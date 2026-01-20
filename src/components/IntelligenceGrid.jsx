import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Shield, Zap, Terminal } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
    {
        title: "ENGINEERING",
        desc: "Architecting robust, scalable systems with cutting-edge technologies. From microservices to monoliths, we build infrastructure that endures.",
        icon: <Cpu size={24} />,
        id: "01"
    },
    {
        title: "DESIGN",
        desc: "Crafting immersive digital interfaces that bridge the gap between human and machine. UI/UX, Motion Systems, and Creative Coding.",
        icon: <Shield size={24} />, // Shield fits 'protection of experience' conceptually, or swap if needed
        id: "02"
    },
    {
        title: "INTELLIGENCE",
        desc: "Embedding cognitive capabilities into digital products. From predictive analytics to generative AI, we harness machine intelligence.",
        icon: <Zap size={24} />,
        id: "03"
    },
    {
        title: "STRATEGY",
        desc: "Navigating the intersection of technology and business. We architect digital journeys that create lasting competitive advantage.",
        icon: <Terminal size={24} />,
        id: "04"
    }
];

const IntelligenceGrid = () => {
    const gridRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".capability-card", {
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                stagger: 0.15,
                duration: 1,
                ease: "power3.out"
            });

            gsap.from(headerRef.current, {
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: "top 90%",
                },
                x: -30,
                opacity: 0,
                duration: 1
            });
        }, gridRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="intelligence-grid" style={{
            padding: 'clamp(6rem, 15vh, 12rem) 1rem', // Responsive padding
            maxWidth: '1400px',
            margin: '0 auto',
            position: 'relative'
        }}>
            {/* Background Accent */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
                pointerEvents: 'none'
            }}></div>

            <div ref={headerRef} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: '1px solid var(--line-color)',
                paddingBottom: '2rem',
                marginBottom: 'clamp(3rem, 10vh, 6rem)', // Responsive margin
                flexWrap: 'wrap', // Allow wrapping on small screens
                gap: '1rem'
            }}>
                <h2 style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', letterSpacing: '-0.03em' }}>
                    <span style={{ opacity: 0.4 }}>[</span> CORE_CAPABILITIES <span style={{ opacity: 0.4 }}>]</span>
                </h2>
                <span className="mono-small" style={{ opacity: 0.5 }}>SEC_LEVEL_01 // ENCRYPTED</span>
            </div>

            <div ref={gridRef} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Smaller min-width for mobile
                gap: '1px',
                backgroundColor: 'var(--line-color)',
                border: '1px solid var(--line-color)'
            }}>
                {capabilities.map((cap, idx) => (
                    <motion.div
                        key={idx}
                        className="capability-card"
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                        style={{
                            backgroundColor: 'var(--bg-color)',
                            padding: '4rem 3rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--accent-color)'
                            }}>
                                {cap.icon}
                            </div>
                            <span className="mono-small" style={{ opacity: 0.3 }}>INDEX_{cap.id}</span>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{cap.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '90%' }}>
                                {cap.desc}
                            </p>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '3rem' }}>
                            <a href="#" className="mono-small" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '1rem',
                                color: 'var(--accent-color)',
                                opacity: 0.6
                            }}>
                                <span style={{ width: '20px', height: '1px', background: 'currentColor' }}></span>
                                ACCESS_PROTOCOL
                            </a>
                        </div>

                        {/* Card Corners */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', borderLeft: '1px solid rgba(255,255,255,0.1)' }}></div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default IntelligenceGrid;
