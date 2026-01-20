import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef, useEffect } from 'react'; // Added imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        title: "Neural Analytics",
        subtitle: "Platform",
        tags: "AI / DASHBOARD",
        year: "2026",
        color: "#1a1a1a"
    },
    {
        title: "Vertex",
        subtitle: "Trading Engine",
        tags: "FINTECH / WEB3",
        year: "2026",
        color: "#0f0f15"
    },
    {
        title: "Prism",
        subtitle: "Design System",
        tags: "UI/UX / BRANDING",
        year: "2023",
        color: "#181818"
    }
];

const SelectedWork = () => {
    // Add scroll trigger for cards
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".work-card", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
                y: 100,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="work" ref={containerRef} style={{
            padding: 'clamp(6rem, 15vh, 10rem) 1rem',
            maxWidth: '1400px',
            margin: '0 auto',
            borderBottom: '1px solid var(--line-color)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '5rem',
                flexWrap: 'wrap',
                gap: '2rem'
            }}>
                <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
                    SELECTED <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Work</span>
                </h2>
                <a href="#" className="mono-small" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    VIEW_ALL_WORK <ArrowUpRight size={14} />
                </a>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Reduced min-width
                gap: '2rem'
            }}>
                {projects.map((project, i) => (
                    <div key={i} className="work-card" style={{
                        position: 'relative',
                        width: '100%',
                        height: 'clamp(400px, 50vh, 600px)',
                        background: project.color,
                        overflow: 'hidden',
                        border: '1px solid var(--line-color)',
                    }}>
                        {/* Abstract Visual Placeholder */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: `radial-gradient(circle at ${i % 2 === 0 ? '70% 30%' : '30% 70%'}, rgba(255,255,255,0.03) 0%, transparent 70%)`,
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '60%',
                                height: '60%',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '50%'
                            }}></div>
                        </div>

                        {/* Content Overlay */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span className="mono-small" style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', display: 'block' }}>
                                        {project.tags}
                                    </span>
                                    <h3 style={{ fontSize: '2rem', lineHeight: 1 }}>{project.title}</h3>
                                    <p style={{ opacity: 0.6, fontSize: '1.2rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{project.subtitle}</p>
                                </div>
                                <span className="mono-small" style={{ opacity: 0.4 }}>{project.year}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SelectedWork;
