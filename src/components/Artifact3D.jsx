import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Float,
    PerspectiveCamera,
    Points,
    PointMaterial,
    Environment,
    PresentationControls
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';


const Eye = ({ position }) => {
    const pupilRef = useRef();

    useFrame((state) => {
        if (pupilRef.current) {
            const targetX = state.mouse.x * 0.05;
            const targetY = state.mouse.y * 0.05;
            pupilRef.current.position.x = THREE.MathUtils.lerp(pupilRef.current.position.x, targetX, 0.2);
            pupilRef.current.position.y = THREE.MathUtils.lerp(pupilRef.current.position.y, targetY, 0.2);
        }
    });

    return (
        <group position={position}>
            <mesh>
                <sphereGeometry args={[0.15, 32, 32]} />
                <meshStandardMaterial color="#f0f0f0" emissive="#ffffff" emissiveIntensity={0.2} />
            </mesh>
            <mesh ref={pupilRef} position={[0, 0, 0.12]}>
                <sphereGeometry args={[0.07, 32, 32]} />
                <meshStandardMaterial color="black" roughness={0.1} />
            </mesh>
        </group>
    );
};

// Custom Fur Material using Shell Technique
// This creates the illusion of depth and individual strands
const ShellFurMaterial = ({ color, layer, totalLayers, thickness, motionOffset }) => {
    const uniforms = useMemo(() => ({
        uLayer: { value: layer },
        uTotalLayers: { value: totalLayers },
        uThickness: { value: thickness },
        uMotionOffset: { value: new THREE.Vector3() },
        uColor: { value: new THREE.Color(color) }
    }), []);

    useEffect(() => {
        uniforms.uMotionOffset.value.copy(motionOffset);
    }, [motionOffset]);

    return (
        <meshPhysicalMaterial
            color={color}
            transparent
            alphaTest={0.5}
            roughness={0.8}
            metalness={0.1}
            onBeforeCompile={(shader) => {
                shader.uniforms.uLayer = uniforms.uLayer;
                shader.uniforms.uTotalLayers = uniforms.uTotalLayers;
                shader.uniforms.uThickness = uniforms.uThickness;
                shader.uniforms.uMotionOffset = uniforms.uMotionOffset;

                shader.vertexShader = `
                    uniform float uLayer;
                    uniform float uTotalLayers;
                    uniform float uThickness;
                    uniform vec3 uMotionOffset;
                    varying float vLayerNorm;
                    varying vec2 vPatternUv;
                    ${shader.vertexShader}
                `.replace(
                    '#include <begin_vertex>',
                    `
                    vLayerNorm = uLayer / uTotalLayers;
                    float layerThickness = vLayerNorm * uThickness;
                    
                    // Push vertex out along normal
                    vec3 pos = position + normal * layerThickness;
                    
                    // Secondary Motion (Lag/Drag)
                    // The outer layers move more than the inner layers
                    pos -= uMotionOffset * vLayerNorm * vLayerNorm * 0.6;
                    
                    vec3 transformed = pos;
                    vPatternUv = uv * 40.0; // Scale noise
                    `
                );

                shader.fragmentShader = `
                    varying float vLayerNorm;
                    varying vec2 vPatternUv;
                    ${shader.fragmentShader}
                `.replace(
                    '#include <dithering_fragment>',
                    `
                    #include <dithering_fragment>
                    
                    // Deterministic noise for individual hair strands
                    float noise = fract(sin(dot(vPatternUv, vec2(12.9898, 78.233))) * 43758.5453);
                    
                    // The higher the layer, the more strands are discarded
                    // This creates the "tapered" look of fur
                    if (noise < vLayerNorm) discard;
                    
                    // Darken inner layers for fake AO
                    gl_FragColor.rgb *= (0.4 + 0.6 * vLayerNorm);
                    `
                );
            }}
        />
    );
};

const ShellFur = ({ geometry, color, count = 20, thickness = 0.15, motionOffset }) => {
    return Array.from({ length: count }).map((_, i) => (
        <mesh key={i} geometry={geometry}>
            <ShellFurMaterial
                color={color}
                layer={i}
                totalLayers={count}
                thickness={thickness}
                motionOffset={motionOffset}
            />
        </mesh>
    ));
};

const Panda = ({ isMoving, walkParams, isLoading, mouse }) => { // Changed elapsedRef to walkParams
    const hipsRef = useRef();
    const spineRef = useRef();
    const neckRef = useRef();
    const headRef = useRef();

    // Arms
    const leftShoulderRef = useRef();
    const leftElbowRef = useRef();
    const rightShoulderRef = useRef();
    const rightElbowRef = useRef();

    // Legs
    const leftThighRef = useRef();
    const leftKneeRef = useRef();
    const leftAnkleRef = useRef();
    const rightThighRef = useRef();
    const rightKneeRef = useRef();
    const rightAnkleRef = useRef();

    // Fur movement ref
    const furMotionRef = useRef(new THREE.Vector3());

    useFrame((state, delta) => {
        // Lock leg cycle to X position to strictly prevent sliding
        const currentX = walkParams.current ? walkParams.current.x : 0;
        const strideLength = 2.5; // Tuning this fixes the "sliding" feeling
        const progress = (currentX + 50) * strideLength;

        if (isMoving) {
            // 1. Leg Cycle (Human-like)
            const leftCycle = Math.sin(progress);
            const rightCycle = Math.sin(progress + Math.PI);

            // Thighs
            if (leftThighRef.current) leftThighRef.current.rotation.x = leftCycle * 0.45;
            if (rightThighRef.current) rightThighRef.current.rotation.x = rightCycle * 0.45;

            // Knees (Bend more when leg is behind)
            const leftKneeBend = leftCycle > 0 ? leftCycle * 0.3 : leftCycle * 0.8;
            const rightKneeBend = rightCycle > 0 ? rightCycle * 0.3 : rightCycle * 0.8;
            if (leftKneeRef.current) leftKneeRef.current.rotation.x = -Math.abs(leftKneeBend);
            if (rightKneeRef.current) rightKneeRef.current.rotation.x = -Math.abs(rightKneeBend);

            // Ankles (Heel-to-toe)
            if (leftAnkleRef.current) leftAnkleRef.current.rotation.x = leftCycle * 0.2;
            if (rightAnkleRef.current) rightAnkleRef.current.rotation.x = rightCycle * 0.2;

            // 2. Arms (Counter-swing with Waving)
            // WE WANT THE VIEWER'S RIGHT HAND TO WAVE (Panda's Left Hand).
            // Code-LEFT is Viewer-LEFT (-0.9). Wait. 
            // If the user said "Still Left hand is waving" when I animated `rightShoulderRef`, then
            // `rightShoulderRef` appears on the LEFT to them? Or they want the OTHER one.
            // I will switch back to `leftShoulderRef` (Screen Left) because that's the only one left.

            // "Wave Zone" when x > -6
            const isWaving = currentX > -6;

            // RIGHT ARM: Just walks
            if (rightShoulderRef.current) rightShoulderRef.current.rotation.x = leftCycle * 0.35;
            if (rightElbowRef.current) rightElbowRef.current.rotation.x = -Math.abs(leftCycle * 0.3);

            // LEFT ARM: WAVES
            if (leftShoulderRef.current) {
                if (isWaving) {
                    // Blend to wave
                    const waveBlend = Math.min(1, (currentX + 6) / 2);
                    const walkRot = rightCycle * 0.35;
                    const waveRot = -Math.PI / 2.5; // Raised up

                    leftShoulderRef.current.rotation.x = THREE.MathUtils.lerp(walkRot, waveRot, waveBlend);
                    leftShoulderRef.current.rotation.z = THREE.MathUtils.lerp(0, -Math.PI / 6, waveBlend); // Outward (negative for left)
                } else {
                    leftShoulderRef.current.rotation.x = rightCycle * 0.35;
                    leftShoulderRef.current.rotation.z = 0;
                }
            }

            if (leftElbowRef.current) {
                if (isWaving) {
                    // Waving motion
                    const waveTime = state.clock.getElapsedTime();
                    const waveSpeed = waveTime * 15; // Faster wave
                    leftElbowRef.current.rotation.x = -Math.PI / 2 + Math.sin(waveSpeed) * 0.3;
                    leftElbowRef.current.rotation.z = -Math.sin(waveSpeed) * 0.2;
                } else {
                    leftElbowRef.current.rotation.x = -Math.abs(rightCycle * 0.3);
                    leftElbowRef.current.rotation.z = 0;
                }
            }

            // 3. Body Motion (Weight Shift & Bob)
            const bob = Math.abs(Math.cos(progress * 2)) * 0.12;
            if (hipsRef.current) hipsRef.current.position.y = bob;

            if (spineRef.current) {
                spineRef.current.rotation.z = Math.sin(progress) * 0.08;
                spineRef.current.rotation.y = Math.cos(progress) * 0.05;
            }

            // 4. Fur Secondary Motion
            const motionLag = new THREE.Vector3(
                Math.sin(progress) * 0.05,
                Math.cos(progress * 2) * 0.03,
                0
            );
            furMotionRef.current.copy(motionLag);

        } else {
            // Return to Idle
            const lerpSpeed = 0.08;
            const reset = (ref) => {
                if (ref && ref.current) {
                    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0, lerpSpeed);
                    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, 0, lerpSpeed);
                    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, 0, lerpSpeed);
                }
            };

            [leftThighRef, rightThighRef, leftKneeRef, rightKneeRef, leftAnkleRef, rightAnkleRef,
                leftShoulderRef, rightShoulderRef, leftElbowRef, rightElbowRef, spineRef].forEach(reset);

            // Explicitly reset Z rotation for arms (used in wave)
            if (leftShoulderRef.current) leftShoulderRef.current.rotation.z = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.z, 0, lerpSpeed);
            if (leftElbowRef.current) leftElbowRef.current.rotation.z = THREE.MathUtils.lerp(leftElbowRef.current.rotation.z, 0, lerpSpeed);

            if (hipsRef.current) hipsRef.current.position.y = THREE.MathUtils.lerp(hipsRef.current.position.y, 0, lerpSpeed);
            furMotionRef.current.lerp(new THREE.Vector3(), 0.1);
        }

        if (headRef.current) {
            const targetRotY = isLoading ? 0 : state.mouse.x * 0.25;
            const targetRotX = isLoading ? 0 : -state.mouse.y * 0.2;
            headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.1);
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.1);
        }
    });

    const isWavingRef = (walkParams.current ? walkParams.current.x : 0) > -6 && isLoading;

    const bodyMat = (
        <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.4}
            metalness={0.05}
            reflectivity={0.5}
        />
    );
    const accentMat = (
        <meshPhysicalMaterial
            color="#111111"
            roughness={0.5}
            metalness={0.1}
        />
    );

    // Geometries memoized for reuse in shells
    const bodyGeo = useMemo(() => new THREE.SphereGeometry(1.1, 32, 32), []);
    const armGeo = useMemo(() => new THREE.CapsuleGeometry(0.2, 0.6, 8, 16), []);
    const forearmGeo = useMemo(() => new THREE.CapsuleGeometry(0.18, 0.6, 8, 16), []);
    const thighGeo = useMemo(() => new THREE.CapsuleGeometry(0.28, 0.8, 8, 16), []);
    const calfGeo = useMemo(() => new THREE.CapsuleGeometry(0.25, 0.8, 8, 16), []);
    const headGeo = useMemo(() => new THREE.SphereGeometry(0.95, 32, 32), []);
    const earGeo = useMemo(() => new THREE.SphereGeometry(0.32, 32, 32), []);

    const furMotion = furMotionRef.current;

    return (
        <group position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]} frustumCulled={false}>
            {/* HIPS (Root of movements) */}
            <group ref={hipsRef}>

                {/* BODY / SPINE */}
                <group ref={spineRef} position={[0, 0.2, 0]}>
                    <ShellFur geometry={bodyGeo} color="#ffffff" count={16} thickness={0.12} motionOffset={furMotion} />

                    {/* SHOULDER & ARMS */}
                    {/* Left Arm */}
                    <group ref={leftShoulderRef} position={[-0.9, 0.5, 0]}>
                        <ShellFur geometry={armGeo} color="#111111" count={12} thickness={0.08} motionOffset={furMotion} />
                        <group ref={leftElbowRef} position={[0, -0.6, 0]}>
                            <ShellFur geometry={forearmGeo} color="#111111" count={12} thickness={0.08} motionOffset={furMotion} />
                            {/* Hand */}
                            <mesh position={[0, -0.7, 0]}>
                                <sphereGeometry args={[0.2, 16, 16]} />
                                {accentMat}
                            </mesh>
                        </group>
                    </group>

                    {/* Right Arm */}
                    <group ref={rightShoulderRef} position={[0.9, 0.5, 0]}>
                        <ShellFur geometry={armGeo} color="#111111" count={12} thickness={0.08} motionOffset={furMotion} />
                        <group ref={rightElbowRef} position={[0, -0.6, 0]}>
                            <ShellFur geometry={forearmGeo} color="#111111" count={12} thickness={0.08} motionOffset={furMotion} />
                            {/* Hand */}
                            <mesh position={[0, -0.7, 0]}>
                                <sphereGeometry args={[0.2, 16, 16]} />
                                {accentMat}
                            </mesh>
                        </group>
                    </group>

                    {/* HEAD & NECK */}
                    <group ref={neckRef} position={[0, 1, 0]}>
                        <group ref={headRef} position={[0, 0.3, 0.5]}>
                            <ShellFur geometry={headGeo} color="#ffffff" count={16} thickness={0.12} motionOffset={furMotion} />

                            {/* Mask / Eye Patches (Slightly outside the fur) */}
                            {[[-0.38, 0.2], [0.38, 0.2]].map(([x, y], i) => (
                                <group key={i} position={[x, y, 0.75]}>
                                    <mesh scale={[1.1, 1.35, 0.6]} position={[0, 0, -0.1]}>
                                        <sphereGeometry args={[0.25, 32, 32]} />
                                        <meshStandardMaterial color="#111111" roughness={0.5} />
                                    </mesh>
                                    <Eye position={[0, 0, 0.1]} />
                                </group>
                            ))}

                            {/* Snout */}
                            <group position={[0, -0.1, 0.8]}>
                                <mesh scale={[1.2, 0.9, 0.8]}>
                                    <sphereGeometry args={[0.28, 32, 32]} />
                                    <meshStandardMaterial color="#ffffff" roughness={0.4} />
                                </mesh>
                                <mesh position={[0, 0.05, 0.22]}>
                                    <sphereGeometry args={[0.08, 32, 32]} />
                                    <meshStandardMaterial color="#111111" roughness={0.3} />
                                </mesh>
                            </group>

                            {/* Ears */}
                            {[[-0.7, 0.8], [0.7, 0.8]].map(([x, y], i) => (
                                <group key={i} position={[x, y, -0.2]}>
                                    <ShellFur geometry={earGeo} color="#111111" count={12} thickness={0.06} motionOffset={furMotion} />
                                </group>
                            ))}
                        </group>
                    </group>
                </group>

                {/* LEGS (Attached to Hips) */}
                <group ref={leftThighRef} position={[-0.6, -0.5, 0]}>
                    <ShellFur geometry={thighGeo} color="#111111" count={12} thickness={0.08} motionOffset={furMotion} />
                    <group ref={leftKneeRef} position={[0, -0.8, 0]}>
                        <ShellFur geometry={calfGeo} color="#111111" count={12} thickness={0.08} motionOffset={furMotion} />
                        <group ref={leftAnkleRef} position={[0, -0.8, 0]}>
                            <mesh position={[0, -0.1, 0.2]} scale={[1, 0.5, 1.5]}>
                                <boxGeometry args={[0.5, 0.4, 0.6]} />
                                {accentMat}
                            </mesh>
                        </group>
                    </group>
                </group>

                <group ref={rightThighRef} position={[0.6, -0.5, 0]}>
                    <ShellFur geometry={thighGeo} color="#111111" count={12} thickness={0.08} motionOffset={furMotion} />
                    <group ref={rightKneeRef} position={[0, -0.8, 0]}>
                        <ShellFur geometry={calfGeo} color="#111111" count={12} thickness={0.08} motionOffset={furMotion} />
                        <group ref={rightAnkleRef} position={[0, -0.8, 0]}>
                            <mesh position={[0, -0.1, 0.2]} scale={[1, 0.5, 1.5]}>
                                <boxGeometry args={[0.5, 0.4, 0.6]} />
                                {accentMat}
                            </mesh>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    );
};

const Particles = ({ count = 300 }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 15;
            p[i * 3 + 1] = (Math.random() - 0.5) * 15;
            p[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return p;
    }, [count]);

    const pointsRef = useRef();
    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <Points ref={pointsRef} positions={points} stride={3}>
            <PointMaterial
                transparent
                color="white"
                size={0.03}
                sizeAttenuation
                depthWrite={false}
                opacity={0.3}
            />
        </Points>
    );
};

const Scene = ({ isLoading, onLoadingComplete, walkParams, elapsedRef }) => {
    const sceneRef = useRef();

    useFrame((state, delta) => {
        if (isLoading && Math.abs(walkParams.current.x) > 0.01) {
            elapsedRef.current += delta;
        }

        if (sceneRef.current) {
            if (isLoading) {
                sceneRef.current.position.x = walkParams.current.x;
                sceneRef.current.rotation.y = walkParams.current.rotationY;
            } else {
                // Hard reset to final "Center" position to prevent disappearing
                sceneRef.current.position.x = 0;
                sceneRef.current.rotation.y = 0;
            }
        }
    });

    return (
        <group ref={sceneRef}>
            <PresentationControls
                global
                enabled={!isLoading}
                config={{ mass: 2, tension: 500 }}
                snap={{ mass: 4, tension: 1500 }}
                rotation={[0, 0, 0]}
                polar={[-Math.PI / 6, Math.PI / 6]}
                azimuth={[-Math.PI / 4, Math.PI / 4]}
            >
                <Float speed={isLoading ? 0.5 : 2} rotationIntensity={isLoading ? 0.1 : 0.5} floatIntensity={isLoading ? 0.2 : 1}>
                    <Panda
                        isMoving={isLoading && Math.abs(walkParams.current.x) > 0.05}
                        walkParams={walkParams}
                        isLoading={isLoading}
                    />
                </Float>
            </PresentationControls>
        </group>
    );
};

const Artifact3D = ({ isLoading, onLoadingComplete }) => {
    const walkParams = useRef({ x: -50, rotationY: Math.PI / 2 });
    const elapsedRef = useRef(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        let ctx = gsap.context(() => {
            if (isLoading) {
                const tl = gsap.timeline({
                    onComplete: () => {
                        if (onLoadingComplete) onLoadingComplete();
                    }
                });

                // Reset
                walkParams.current.x = -50;
                walkParams.current.rotationY = Math.PI / 2;

                // 1. Walk in
                tl.to(walkParams.current, {
                    x: 0,
                    duration: 3.5,
                    ease: "expo.out"
                });

                // 2. Rotate
                tl.to(walkParams.current, {
                    rotationY: 0,
                    duration: 1.5,
                    ease: "back.out(1.5)"
                }, "-=1.2");
            }
        });
        return () => ctx.revert();
    }, [isLoading, onLoadingComplete]);

    return (
        <div style={{ width: '100%', height: '1000px', cursor: 'pointer', touchAction: 'none' }}>
            <Canvas dpr={[1, 2]} shadows>
                <PerspectiveCamera makeDefault position={[0, isMobile ? 1 : 0, isMobile ? 14 : 10]} fov={isMobile ? 45 : 35} />

                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <Environment preset="city" />

                <Scene
                    isLoading={isLoading}
                    onLoadingComplete={onLoadingComplete}
                    walkParams={walkParams}
                    elapsedRef={elapsedRef}
                />

                <Particles />
            </Canvas>
        </div>
    );
};

export default Artifact3D;
