import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Artifact3D from './Artifact3D';

gsap.registerPlugin(ScrollTrigger);

const Hero = ({ isLoading, onLoadingComplete }) => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        if (!isLoading) {
            const ctx = gsap.context(() => {
                // Cinematic Text Reveal
                gsap.from(".hero-title span", {
                    duration: 1.5,
                    y: 100,
                    skewY: 7,
                    stagger: 0.1,
                    ease: "power4.out",
                    opacity: 0,
                    delay: 0.5
                });

                // Parallax on Scroll
                gsap.to(".hero-3d-container", {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    },
                    y: 100,
                    scale: 0.9,
                    rotateZ: 5
                });

                gsap.to(".hero-title", {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    },
                    y: -50,
                    opacity: 0.5
                });
            }, sectionRef);

            return () => ctx.revert();
        }
    }, [isLoading]);

    return (
        <section ref={sectionRef} className="hero" style={{
            minHeight: '130vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            padding: '2rem',
            textAlign: 'center',
            zIndex: 1
        }}>
            <div className="hero-background-data" style={{
                position: 'fixed',
                top: '22%',
                left: '5%',
                textAlign: 'left',
                opacity: 0.2,
                zIndex: 2,
                display: isLoading ? 'none' : 'block'
            }}>
                <p className="mono-small">LAT: 51.5074 N</p>
                <p className="mono-small">LONG: 0.1278 W</p>
                <p className="mono-small">VER: QX-25.01-ELITE</p>
                <div style={{ width: '40px', height: '1px', background: 'white', marginTop: '1rem' }}></div>
            </div>

            <div className="hero-3d-container" style={{
                width: '100%',
                maxWidth: '1200px',
                position: 'absolute',
                top: '-15%',
                zIndex: 0
            }}>
                <Artifact3D isLoading={isLoading} onLoadingComplete={onLoadingComplete} />
            </div>

            {!isLoading && (
                <>
                    <h1 className="hero-title" style={{
                        fontSize: 'clamp(3rem, 15vw, 12rem)', // Slightly reduced min size
                        lineHeight: 0.8,
                        overflow: 'hidden',
                        marginTop: 'clamp(18rem, 30vh, 5rem)', // INCREASED MARGIN TO CLEAR PANDA (was 10rem)
                        position: 'relative',
                        zIndex: 10
                    }}>
                        <span style={{ display: 'inline-block' }}>WE BUILD</span> <br />
                        <span className="highlight-serif" style={{ display: 'inline-block' }}>Intelligence</span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.8 }}
                        className="mono-small"
                        style={{ marginTop: '3rem', maxWidth: '600px', opacity: 0.6 }}
                    >
                        [ PREMIUM_DIGITAL_INTELLIGENCE_COLLECTIVE ]
                        <br />
                        ARCHITECTING THE FUTURE OF THE DECENTRALIZED WEB.
                    </motion.p>
                </>
            )}

            <div className="scroll-indicator" style={{
                position: 'absolute',
                bottom: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: 0.4,
                display: isLoading ? 'none' : 'block'
            }}>
                <div className="mono-small">INITIATE_DESCENT</div>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: '1px', height: '40px', background: 'white', margin: '1rem auto 0' }}
                />
            </div>
        </section>
    );
};

export default Hero;
