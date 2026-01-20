import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    if (!isMobile) return null;

    const menuItems = [
        { label: "EXPERTISE", href: "#expertise" },
        { label: "PHILOSOPHY", href: "#philosophy" },
        { label: "PORTFOLIO", href: "#work" },
        { label: "CONTACT", href: "#contact" }
    ];

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    top: '2rem',
                    right: '3rem', // Reverted to right side and moved further inward per user "little left" request
                    zIndex: 10000,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '6px',
                    mixBlendMode: 'difference' // Ensure visibility against white/black
                }}
            >
                <motion.span
                    animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
                    style={{ width: '100%', height: '2px', background: 'white' }}
                />
                <motion.span
                    animate={{ opacity: isOpen ? 0 : 1 }}
                    style={{ width: '100%', height: '2px', background: 'white' }}
                />
                <motion.span
                    animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
                    style={{ width: '100%', height: '2px', background: 'white' }}
                />
            </button>

            {/* Full Screen Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
                        animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
                        exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
                        transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }} // smooth easeInOutQuart
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: '#000000',
                            zIndex: 9999,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '2rem'
                        }}
                    >
                        {/* Background Noise/Grid (Optional) */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }}></div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            textAlign: 'center'
                        }}>
                            {menuItems.map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 50, opacity: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                                >
                                    <a
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="hero-title" // Reuse hero title font
                                        style={{
                                            fontSize: '3rem',
                                            color: 'white',
                                            textDecoration: 'none',
                                            position: 'relative',
                                            display: 'inline-block',
                                            lineHeight: 1
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#888'} // Simple hover
                                        onMouseLeave={(e) => e.target.style.color = 'white'}
                                    >
                                        {item.label}
                                    </a>
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer Info in Menu */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ delay: 0.6, duration: 1 }}
                            style={{
                                position: 'absolute',
                                bottom: '3rem',
                                textAlign: 'center',
                                fontSize: '0.8rem',
                                fontFamily: 'var(--font-mono)'
                            }}
                        >
                            <p>QUINZEX INTELLIGENCE</p>
                            <p>EST. 2026</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default HamburgerMenu;
