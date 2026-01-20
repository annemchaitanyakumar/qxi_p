import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
    const [isPointer, setIsPointer] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const springConfig = { damping: 50, stiffness: 1000 };
    const sx = useSpring(cursorX, springConfig);
    const sy = useSpring(cursorY, springConfig);

    useEffect(() => {
        if (isMobile) return;
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setCoords({ x: e.clientX, y: e.clientY });

            const target = e.target;
            setIsPointer(window.getComputedStyle(target).cursor === 'pointer' || target.tagName === 'A' || target.tagName === 'BUTTON');
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [isMobile]);

    if (isMobile) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 99999,
            mixBlendMode: 'difference'
        }}>
            <motion.div
                style={{
                    x: sx,
                    y: sy,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                {/* Main Reticle */}
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <motion.circle
                        cx="20" cy="20"
                        initial={{ r: 7 }}
                        animate={{ r: isPointer ? 14 : 7 }}
                        stroke="white" strokeWidth="0.5"
                    />
                    <line x1="20" y1="15" x2="20" y2="25" stroke="white" strokeWidth="0.5" />
                    <line x1="15" y1="20" x2="25" y2="20" stroke="white" strokeWidth="0.5" />

                    {/* Corner Marks */}
                    <path d="M 2,10 V 2 H 10" stroke="white" strokeWidth="1" />
                    <path d="M 30,2 H 38 V 10" stroke="white" strokeWidth="1" />
                    <path d="M 2,30 V 38 H 10" stroke="white" strokeWidth="1" />
                    <path d="M 30,38 H 38 V 30" stroke="white" strokeWidth="1" />
                </svg>

                {/* Dynamic Coordinates */}
                <div style={{
                    position: 'absolute',
                    top: '25px',
                    left: '25px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '8px',
                    color: 'white',
                    whiteSpace: 'nowrap',
                    opacity: 0.5
                }}>
                    X: {coords.x.toString().padStart(4, '0')} / Y: {coords.y.toString().padStart(4, '0')}
                    <br />
                    QX_USR_ID: 1042-ALPHA
                </div>
            </motion.div>
        </div>
    );
};

export default CustomCursor;
