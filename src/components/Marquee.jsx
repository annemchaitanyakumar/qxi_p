import { motion } from 'framer-motion';

const Marquee = ({ text, reverse = false }) => {
    return (
        <div style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            padding: '4rem 0',
            borderTop: '1px solid var(--line-color)',
            borderBottom: '1px solid var(--line-color)',
            margin: '4rem 0'
        }}>
            <motion.div
                animate={{ x: reverse ? [0, -1000] : [-1000, 0] }}
                transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear"
                }}
                style={{ display: 'inline-block' }}
            >
                <span style={{
                    fontSize: 'clamp(4rem, 15vw, 8rem)', // Responsive font size
                    fontFamily: 'var(--font-header)',
                    textTransform: 'uppercase',
                    marginRight: '2rem'
                }}>
                    {text} • {text} • {text} • {text} • {text} • {text} •
                </span>
            </motion.div>
        </div>
    );
};

export default Marquee;
