const Footer = () => {
    return (
        <footer style={{
            padding: '4rem 1rem 8rem',
            background: 'linear-gradient(to bottom, transparent, #050505)',
            overflow: 'hidden' // Prevent giant text from causing horizontal scroll
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '4rem',
                borderTop: '1px solid var(--line-color)',
                paddingTop: '6rem'
            }}>
                {/* Brand / Tagline */}
                <div style={{ maxWidth: '300px' }}>
                    <p className="mono-small" style={{ fontSize: '1rem', marginBottom: '1rem' }}>QUINZEX INTELLIGENCE</p>
                    <p style={{ opacity: 0.6, lineHeight: 1.6, fontSize: '0.9rem' }}>
                        Premium digital intelligence collective. Crafting tomorrow's experiences today.
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <p className="mono-small" style={{ opacity: 0.4, marginBottom: '1.5rem' }}>NAVIGATE</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['Expertise', 'Philosophy', 'Portfolio', 'Contact'].map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>{item}</a>
                        ))}
                    </div>
                </div>

                {/* Services */}
                <div>
                    <p className="mono-small" style={{ opacity: 0.4, marginBottom: '1.5rem' }}>EXPERTISE</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['Engineering', 'Design', 'AI / ML', 'Strategy'].map(item => (
                            <span key={item} style={{ opacity: 0.6 }}>{item}</span>
                        ))}
                    </div>
                </div>

                {/* Socials */}
                <div>
                    <p className="mono-small" style={{ opacity: 0.4, marginBottom: '1.5rem' }}>CONNECT</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['Twitter', 'LinkedIn', 'Dribbble', 'GitHub'].map(item => (
                            <a key={item} href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>{item}</a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{
                maxWidth: '1400px',
                margin: '6rem auto 0',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '2rem',
                opacity: 0.4,
                fontSize: '0.8rem'
            }}>
                <p>© 2026 QUINZEX INTELLIGENCE. ALL RIGHTS RESERVED.</p>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</a>
                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Terms of Service</a>
                </div>
                <p>Crafted with precision ◆</p>
            </div>

            {/* Giant Background Text */}
            <h1 style={{
                fontSize: 'clamp(15vw, 22vw, 25rem)',
                lineHeight: 1,
                opacity: 0.03,
                textAlign: 'center',
                marginTop: '4rem',
                userSelect: 'none',
                pointerEvents: 'none',
                marginBottom: '-4rem'
            }}>
                QUINZEX
            </h1>
        </footer>
    );
};

export default Footer;
