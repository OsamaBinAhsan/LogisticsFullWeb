import type { Variants, Transition } from 'framer-motion';

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 28,
};

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 20,
};

export const easeStandard: Transition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: easeStandard },
};

export const slideInRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: springSnappy },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
};

export const slideInLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: springSnappy },
  exit: { x: '-100%', opacity: 0, transition: { duration: 0.2 } },
};

export const slideUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: springGentle },
};

export const scaleIn: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: springSnappy },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.15 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: springGentle },
};

export const cartBadgePop: Variants = {
  initial: { scale: 1 },
  animate: { scale: [1, 1.5, 1], transition: springBouncy },
};

// Logistics-specific presets
export const rowFlash: Variants = {
  initial: { backgroundColor: 'transparent' },
  flash: {
    backgroundColor: ['transparent', 'rgba(245,158,11,0.12)', 'transparent'],
    transition: { duration: 0.6 },
  },
};

export const badgeMorph: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 24,
};

export const fadeUp: Variants = slideUp;
export const springBounce: Transition = springBouncy;
export const drawerSpring: Transition = {
  type: 'spring',
  damping: 30,
  stiffness: 300,
};
export const rowFadeSlide: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: springGentle },
};

export const springPresets = {
  stiff: { type: 'spring', stiffness: 400, damping: 30 },
  gentle: springGentle,
  bouncy: springBouncy,
  snappy: springSnappy,
};

