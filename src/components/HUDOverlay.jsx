import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HamburgerMenu from './HamburgerMenu';

const HUDOverlay = () => {
    // ... existing state ...
    const [time, setTime] = useState(new Date());
    const [scroll, setScroll] = useState(0);
    const [logs, setLogs] = useState(["BOOT_SEQUENCE_INIT...", "ENCRYPTING_COMM_CHANNELS...", "NEURAL_LINK_ESTABLISHED"]);

    // ... existing useEffect ...
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        const handleScroll = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            setScroll(Math.round((winScroll / height) * 100));
        };
        // Simulated log stream
        const logInterval = setInterval(() => {
            const messages = [
                "FETCHING_DATA_SLICE_" + Math.random().toString(36).substring(7),
                "PANDA_PROTOCOL_ACTIVE",
                "SYNCING_VOID_SERVER",
                "UPDATING_INTEL_INDEX",
                "CLEANING_CACHE...",
                "STABILIZING_QUBITS"
            ];
            setLogs(prev => [...prev.slice(-4), messages[Math.floor(Math.random() * messages.length)]]);
        }, 4000);

        window.addEventListener('scroll', handleScroll);
        return () => {
            clearInterval(timer);
            clearInterval(logInterval);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="hud-overlay" style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 5000,
            fontFamily: 'var(--font-mono)',
            color: 'rgba(255, 255, 255, 0.7)',
            textTransform: 'uppercase',
            fontSize: '0.6rem',
            letterSpacing: '0.1em'
        }}>
            {/* Hamburger Menu */}
            <div style={{ pointerEvents: 'auto' }}>
                <HamburgerMenu />
            </div>

            {/* Desktop Navigation Links */}
            <div style={{
                position: 'fixed',
                top: '2.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: window.innerWidth < 1024 ? 'none' : 'flex',
                gap: '3rem',
                pointerEvents: 'auto'
            }}>
                <a href="#expertise" className="mono-small" style={{ opacity: 0.6 }}>EXPERTISE</a>
                <a href="#philosophy" className="mono-small" style={{ opacity: 0.6 }}>PHILOSOPHY</a>
                <a href="#contact" className="mono-small" style={{ opacity: 0.6 }}>CONTACT</a>
            </div>

            {/* Top Left: Logo */}
            <div style={{
                position: 'fixed',
                top: '2rem',
                left: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{
                    fontFamily: 'var(--font-header)',
                    fontSize: '1.2rem',
                    color: 'white'
                }}>
                    QX//INTEL
                </div>
            </div>

            {/* Bottom Right: Access Progress - THE SPECIFIC COMPONENT FIXED PER USER REQUEST */}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '1.5rem',
                textAlign: 'right',
                pointerEvents: 'auto' // Allow interaction if needed
            }}>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                    <p style={{ fontSize: '0.5rem', opacity: 0.5 }}>V_2.5.01-RC</p>
                    <p style={{ fontSize: '0.5rem', opacity: 0.5 }}>PRJ_QX_INTEL</p>
                </div>
                <div style={{
                    width: 'clamp(120px, 30vw, 200px)',
                    height: '2px',
                    background: 'rgba(255,255,255,0.1)',
                    position: 'relative',
                    marginLeft: 'auto'
                }}>
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0, // Fill from right to match text alignment or keep left? Left is more standard.
                            height: '100%',
                            background: 'white',
                            width: `${scroll}%`,
                            transformOrigin: 'right'
                        }}
                    />
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.6rem' }}>ACCESS_PROGRESS: {scroll}%</p>
            </div>

            {/* Decorative Borders (Hidden on mobile for cleaner look) */}
            {window.innerWidth > 768 && (
                <div style={{
                    position: 'fixed',
                    inset: '2rem',
                    border: '1px solid rgba(255,255,255,0.03)',
                    pointerEvents: 'none'
                }}></div>
            )}
        </div>
    );
};

export default HUDOverlay;
