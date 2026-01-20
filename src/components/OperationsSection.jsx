import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, Activity, ShieldAlert, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const OperationsSection = () => {
    const sectionRef = useRef(null);
    const canvasRef = useRef(null);
    const [logs, setLogs] = useState([
        "SYSTEM_INITIALIZED",
        "CONNECTING_TO_GLOBAL_NODES...",
        "ENCRYPTED_SIGNAL_STREAM_ACTIVE"
    ]);

    useEffect(() => {
        // Scroll animations
        const ctx = gsap.context(() => {
            gsap.from(".ops-header", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                y: 30,
                opacity: 0,
                duration: 1
            });
        }, sectionRef);

        // Simulated log stream
        const interval = setInterval(() => {
            const messages = [
                "PING_RESPONSE_7ms_TOKYO",
                "NODE_UPDATE_SUCCESS_[44.2.1]",
                "THREAT_NEUTRALIZED_LEVEL_2",
                "BUFFER_XFL_CLEARING...",
                "SYNC_COMPLETE_SECTOR_7G",
                "ANOMALY_DETECTED_RECALIBRATING"
            ];
            setLogs(prev => [...prev.slice(-5), messages[Math.floor(Math.random() * messages.length)]]);
        }, 3000);

        // Canvas Visualization (Global Connectivity)
        const canvas = canvasRef.current;
        const c = canvas.getContext('2d');
        let animationFrameId;

        const handleResize = () => {
            if (canvas && canvas.parentElement) {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        const nodes = Array.from({ length: 15 }, () => ({
            x: Math.random() * (canvas.width || 800),
            y: Math.random() * (canvas.height || 400),
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        }));

        const animate = () => {
            if (!canvas || !c) return;
            c.clearRect(0, 0, canvas.width, canvas.height);
            c.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            c.lineWidth = 0.5;

            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                c.beginPath();
                c.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                c.fillStyle = 'rgba(255, 255, 255, 0.5)';
                c.fill();

                for (let j = i + 1; j < nodes.length; j++) {
                    const node2 = nodes[j];
                    const dist = Math.hypot(node.x - node2.x, node.y - node2.y);
                    if (dist < 200) {
                        c.beginPath();
                        c.moveTo(node.x, node.y);
                        c.lineTo(node2.x, node2.y);
                        c.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            ctx.revert();
            clearInterval(interval);
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <section ref={sectionRef} className="operations-section" style={{
            padding: '8rem 2rem',
            maxWidth: '1400px',
            margin: '0 auto',
            borderTop: '1px solid var(--line-color)',
            position: 'relative'
        }}>
            <div className="ops-header" style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>
                    <span style={{ opacity: 0.4 }}>[</span> STRATEGIC_OPS <span style={{ opacity: 0.4 }}>]</span>
                </h2>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                    <div className="mono-small" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={14} /> LIVE_TELEMETRY
                    </div>
                    <div className="mono-small" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)' }}>
                        <ShieldAlert size={14} /> SECURITY_ENFORCED
                    </div>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                minHeight: '400px'
            }}>
                {/* Visualization Area */}
                <div style={{
                    border: '1px solid var(--line-color)',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.01)',
                    minHeight: '400px'
                }}>
                    <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        padding: '0.5rem',
                        background: 'rgba(0,0,0,0.8)',
                        border: '1px solid var(--line-color)',
                        pointerEvents: 'none'
                    }}>
                        <p className="mono-small" style={{ fontSize: '0.6rem' }}>CONNECTED_NODES: 15</p>
                        <p className="mono-small" style={{ fontSize: '0.6rem' }}>LOCATION: GLOBAL_DISTRIBUTED</p>
                    </div>
                </div>

                {/* Log Stream Area */}
                <div style={{
                    border: '1px solid var(--line-color)',
                    padding: '2rem',
                    background: 'rgba(255,255,255,0.01)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ borderBottom: '1px solid var(--line-color)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p className="mono-small">OPERATION_LOGS</p>
                        <Cpu size={16} style={{ opacity: 0.5 }} />
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        {logs.map((log, i) => (
                            <motion.div
                                key={`${i}-${log}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{
                                    fontSize: '0.7rem',
                                    fontFamily: 'var(--font-mono)',
                                    marginBottom: '0.8rem',
                                    color: i === logs.length - 1 ? 'var(--accent-color)' : 'var(--text-secondary)'
                                }}
                            >
                                <span style={{ opacity: 0.3 }}>[{new Date().toLocaleTimeString([], { hour12: false })}]</span> {log}
                            </motion.div>
                        ))}
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                        <div style={{ height: '2px', background: 'var(--line-color)', position: 'relative' }}>
                            <motion.div
                                animate={{ width: ['0%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'white' }}
                            />
                        </div>
                        <p className="mono-small" style={{ marginTop: '0.5rem', fontSize: '0.6rem' }}>PROCESSING_STREAM...</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OperationsSection;
