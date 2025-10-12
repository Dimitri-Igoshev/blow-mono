'use client';

import { motion } from 'framer-motion';

export const AnimatedLogo = () => {
  return (
    <div style={styles.wrapper}>
      {/* Серый фон спинера (полный круг) */}
      <div style={styles.baseCircle} />

      {/* Красная вращающаяся дуга */}
      <motion.div
        animate={{ rotate: 360 }}
        style={styles.spinner}
        transition={{
          duration: 1.5,
          ease: 'linear',
          repeat: Infinity,
        }}
      />

      {/* Логотип по центру */}
      <motion.img
        alt="Logo"
        animate={{
          scale: [0.9, 1.1, 0.9],
        }}
        height={50}
        src="/logo-round.png"
        style={styles.logo}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
        width={50}
      />
    </div>
  );
};

const size = 60;
const borderWidth = 4;

const styles = {
  wrapper: {
    position: 'relative' as const,
    width: size,
    height: size,
    margin: '0 auto',
  },
  baseCircle: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: size,
    height: size,
    borderRadius: '50%',
    border: `${borderWidth}px solid rgba(227, 30, 36, 0.2)`,
    boxSizing: 'border-box' as const,
  },
  spinner: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: size,
    height: size,
    borderRadius: '50%',
    borderTop: `${borderWidth}px solid #e31e24`,
    borderRight: `${borderWidth}px solid transparent`,
    borderBottom: `${borderWidth}px solid transparent`,
    borderLeft: `${borderWidth}px solid transparent`,
    boxSizing: 'border-box' as const,
  },
  logo: {
    position: 'absolute' as const,
    top: '5px',
    left: '5px',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
  },
};
