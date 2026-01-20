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
            padding: '2rem',
            fontFamily: 'var(--font-mono)',
            color: 'rgba(255, 255, 255, 0.7)',
            textTransform: 'uppercase',
            fontSize: '0.6rem',
            letterSpacing: '0.1em'
        }}>
            {/* Hamburger Menu (Handles its own visibility/interaction) */}
            <div style={{ pointerEvents: 'auto' }}>
                <HamburgerMenu />
            </div>

            {/* Desktop Navigation Links (Hidden on Mobile) */}
            <div style={{
                position: 'absolute',
                top: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: window.innerWidth < 768 ? 'none' : 'flex',
                gap: '3rem',
                pointerEvents: 'auto'
            }}>
                <a href="#" className="mono-small" style={{ opacity: 0.6, transition: 'opacity 0.3s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.6}>EXPERTISE</a>
                <a href="#" className="mono-small" style={{ opacity: 0.6, transition: 'opacity 0.3s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.6}>PHILOSOPHY</a>
                <a href="#" className="mono-small" style={{ opacity: 0.6, transition: 'opacity 0.3s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.6}>CONTACT</a>
            </div>

            {/* Top Left: Logo & Radar - Simplified on Mobile */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{
                        fontFamily: 'var(--font-header)',
                        fontSize: window.innerWidth < 768 ? '1rem' : '1.5rem', // Smaller logo on mobile
                        letterSpacing: '0.1em',
                        color: 'white',
                        borderRight: window.innerWidth < 768 ? 'none' : '1px solid rgba(255,255,255,0.2)', // Remove border
                        paddingRight: window.innerWidth < 768 ? '0' : '1.5rem',
                        marginRight: '0.5rem'
                    }}>
                        QX//INTEL
                    </div>
                    {/* Hide Radar details on mobile to save space */}
                    <div style={{ display: window.innerWidth < 768 ? 'none' : 'flex', gap: '1rem', alignItems: 'center' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            style={{ width: '24px', height: '24px', border: '1px solid currentColor', borderRadius: '50%', position: 'relative', opacity: 0.5 }}
                        >
                            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '1px', background: 'currentColor', transformOrigin: 'left', rotate: '0deg' }}></div>
                        </motion.div>
                        <div style={{ opacity: 0.5, fontSize: '0.5rem' }}>
                            <p>RADAR_ACTIVE</p>
                            <p>SCANNING_HOST...</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Right: System Status - Hidden on Mobile */}
            <div style={{
                position: 'absolute',
                top: '2.5rem',
                right: '4rem', // Moved left to make room for hamburger if needed on desktop, though ham is fixed
                textAlign: 'right',
                fontSize: '0.5rem',
                opacity: 0.8,
                display: window.innerWidth < 768 ? 'none' : 'block'
            }}>
                <p>SYS_TIME: {time.toLocaleTimeString()}</p>
                <p>ENCRYPTION: <span style={{ color: 'var(--accent-color)' }}>AES_256_ACTIVE</span></p>
                <p>CONNECTION: STABLE</p>
            </div>

            {/* Bottom Left: Log Stream */}
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: window.innerWidth < 768 ? 'none' : 'block' }}>
                {logs.map((log, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1 - (logs.length - 1 - i) * 0.2, x: 0 }}
                        key={i}
                        style={{ marginBottom: '2px' }}
                    >
                        {'>'} {log}
                    </motion.div>
                ))}
            </div>

            {/* Bottom Right: Scroll & Version */}
            <div style={{
                position: 'absolute',
                bottom: 'clamp(1rem, 5vh, 2rem)',
                right: 'clamp(1rem, 5vw, 2rem)',
                textAlign: 'right'
            }}>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                    <p>V_2.5.01-RC</p>
                    <p>PRJ_QX_INTEL</p>
                </div>
                <div style={{
                    width: 'clamp(100px, 30vw, 200px)',
                    height: '2px',
                    background: 'rgba(255,255,255,0.1)',
                    position: 'relative'
                }}>
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            background: 'white',
                            width: `${scroll}%`
                        }}
                    />
                </div>
                <p style={{ marginTop: '0.5rem' }}>ACCESS_PROGRESS: {scroll}%</p>
            </div>

            {/* Decorative Corners */}
            <div className="corner-decor" style={{ position: 'absolute', top: '2rem', bottom: '2rem', left: '2rem', right: '2rem', border: '1px solid rgba(255,255,255,0.03)', pointerEvents: 'none' }}></div>
        </div>
    );
};

export default HUDOverlay;
