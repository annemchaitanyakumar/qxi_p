import { motion } from 'framer-motion';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

const Philosophy = () => {
    const sectionRef = useRef(null);

    const pillars = [
        {
            number: "01",
            title: "INNOVATION",
            desc: "We don't follow trends—we define them. Pioneering solutions that shape the future of digital."
        },
        {
            number: "02",
            title: "PRECISION",
            desc: "Focused on detail-oriented execution where every pixel and line of code serves a specific purpose."
        },
        {
            number: "03",
            title: "EXCELLENCE",
            desc: "Mediocrity is not in our vocabulary. We deliver nothing less than extraordinary results."
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".philosophy-item", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="philosophy" style={{
            padding: 'clamp(4rem, 10vh, 10rem) 1rem', // Reduced padding
            maxWidth: '1400px',
            margin: '0 auto',
            borderBottom: '1px solid var(--line-color)'
        }}>
            <div style={{
                marginBottom: '4rem', // Reduced margin
                borderLeft: '2px solid var(--accent-color)',
                paddingLeft: 'clamp(1rem, 3vw, 2rem)' // Responsive padding
            }}>
                <span className="mono-small">OUR_ETHOS</span>
                <h2 style={{
                    fontSize: 'clamp(2.5rem, 10vw, 6rem)', // Slightly smaller min
                    lineHeight: 0.9,
                    marginTop: '1rem',
                    textTransform: 'uppercase'
                }}>
                    Built on<br />
                    <span style={{ color: 'var(--text-secondary)' }}>Conviction</span>
                </h2>

                <p style={{
                    maxWidth: '600px',
                    marginTop: '2rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)'
                }}>
                    Quinzex Intelligence is not just a collective—it's a philosophy. We believe that exceptional digital experiences arise from the intersection of technical mastery and artistic vision.
                </p>

                {/* Stats Section */}
                <div style={{
                    display: 'flex',
                    gap: 'clamp(1.5rem, 4vw, 4rem)', // Responsive gap
                    marginTop: '3rem',
                    flexWrap: 'wrap'
                }}>
                    <div>
                        <span style={{ fontSize: '2rem', display: 'block', fontFamily: 'var(--font-header)' }}>98%</span>
                        <span className="mono-small" style={{ opacity: 0.6 }}>CLIENT RETENTION</span>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', display: 'block', fontFamily: 'var(--font-header)' }}>50+</span>
                        <span className="mono-small" style={{ opacity: 0.6 }}>PROJECTS SHIPPED</span>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', display: 'block', fontFamily: 'var(--font-header)' }}>15</span>
                        <span className="mono-small" style={{ opacity: 0.6 }}>ELITE MEMBERS</span>
                    </div>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Reduced min-width
                gap: 'clamp(2rem, 5vw, 6rem)'
            }}>
                {pillars.map((item, i) => (
                    <div key={i} className="philosophy-item">
                        <span style={{
                            fontFamily: 'var(--font-header)',
                            fontSize: '4rem',
                            color: 'transparent',
                            WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                            display: 'block',
                            marginBottom: '1rem'
                        }}>
                            {item.number}
                        </span>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
                            {item.title}
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            fontSize: '1rem'
                        }}>
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Philosophy;
