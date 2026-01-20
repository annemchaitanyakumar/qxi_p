import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InteractiveGrid = () => {
    const [columns, setColumns] = useState(0);
    const [rows, setRows] = useState(0);

    useEffect(() => {
        const calculateGrid = () => {
            const columnCount = Math.ceil(window.innerWidth / 40); // Slightly smaller cells for more detail
            const rowCount = Math.ceil(window.innerHeight / 40);
            setColumns(columnCount);
            setRows(rowCount);
        };

        calculateGrid();
        window.addEventListener('resize', calculateGrid);
        return () => window.removeEventListener('resize', calculateGrid);
    }, []);

    return (
        <div
            className="interactive-grid-container"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                overflow: 'hidden',
                pointerEvents: 'auto',
                backgroundColor: '#000000'
            }}
        >
            {[...Array(columns * rows)].map((_, i) => (
                <GridCell key={i} />
            ))}
        </div>
    );
};

const GridCell = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                border: '0.1px solid rgba(255, 255, 255, 0.03)',
                width: '100%',
                height: '100%',
                position: 'relative',
                backgroundColor: 'transparent'
            }}
        >
            <motion.div
                initial={false}
                animate={{
                    opacity: isHovered ? 0.5 : 0,
                    scale: isHovered ? 1 : 0.8
                }}
                transition={{
                    duration: isHovered ? 0.05 : 1.2, // Even faster in, even slower out
                    ease: "easeOut"
                }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#ffffff', // Direct white fill
                }}
            />
        </div>
    );
};

export default InteractiveGrid;
