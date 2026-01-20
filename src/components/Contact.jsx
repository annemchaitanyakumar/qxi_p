const Contact = () => {
    return (
        <section id="contact-form" style={{
            padding: 'clamp(6rem, 15vh, 10rem) 1rem',
            maxWidth: '1400px',
            margin: '0 auto',
            borderBottom: '1px solid var(--line-color)'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', // Responsive split
                gap: '4rem'
            }}>
                {/* Left: Info */}
                <div>
                    <span className="mono-small" style={{ color: 'var(--accent-color)', display: 'block', marginBottom: '1rem' }}>START A PROJECT</span>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1, marginBottom: '2rem' }}>
                        Let's Create<br />Together
                    </h2>
                    <p style={{ maxWidth: '400px', opacity: 0.7, lineHeight: 1.6, marginBottom: '3rem' }}>
                        Ready to transform your vision into reality? We're selective about projects we take on—ensuring every collaboration receives our complete dedication.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <a href="mailto:hello@quinzex.com" className="mono-small" style={{ fontSize: '1rem' }}>
                            EMAIL: HELLO@QUINZEX.COM
                        </a>
                        <p className="mono-small" style={{ fontSize: '1rem', opacity: 0.6 }}>
                            LOCATION: GLOBAL / REMOTE
                        </p>
                    </div>
                </div>

                {/* Right: Form */}
                <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} onSubmit={(e) => e.preventDefault()}>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label className="mono-small" style={{ display: 'block', marginBottom: '0.8rem', opacity: 0.7 }}>YOUR NAME</label>
                            <input type="text" style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                padding: '1rem 0',
                                color: 'white',
                                fontFamily: 'var(--font-body)',
                                fontSize: '1.2rem',
                                outline: 'none'
                            }} />
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label className="mono-small" style={{ display: 'block', marginBottom: '0.8rem', opacity: 0.7 }}>EMAIL ADDRESS</label>
                            <input type="email" style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                padding: '1rem 0',
                                color: 'white',
                                fontFamily: 'var(--font-body)',
                                fontSize: '1.2rem',
                                outline: 'none'
                            }} />
                        </div>
                    </div>

                    <div>
                        <label className="mono-small" style={{ display: 'block', marginBottom: '0.8rem', opacity: 0.7 }}>PROJECT BRIEF</label>
                        <textarea rows="4" style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid rgba(255,255,255,0.2)',
                            padding: '1rem 0',
                            color: 'white',
                            fontFamily: 'var(--font-body)',
                            fontSize: '1.2rem',
                            outline: 'none',
                            resize: 'vertical'
                        }}></textarea>
                    </div>

                    <div>
                        <label className="mono-small" style={{ display: 'block', marginBottom: '1.5rem', opacity: 0.7 }}>BUDGET RANGE</label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {['$10k - $25k', '$25k - $50k', '$50k - $100k', '$100k+'].map((range) => (
                                <button key={range} style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '50px',
                                    color: 'white',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                                    onMouseEnter={(e) => e.target.style.borderColor = 'white'}
                                    onMouseLeave={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <button type="submit" style={{
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            padding: '1.2rem 3rem',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            borderRadius: '2px', // Slight styling
                            letterSpacing: '0.05em'
                        }}>
                            SEND INQUIRY
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Contact;
