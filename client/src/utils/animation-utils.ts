import { AnimationProps } from "framer-motion";

export const fadeIn: AnimationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const slideUp: AnimationProps = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
  transition: { duration: 0.3 }
};

export const slideIn: AnimationProps = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
  transition: { duration: 0.3 }
};

export const popIn: AnimationProps = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 25 }
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const characterHover = {
  initial: { y: 0 },
  animate: { 
    y: [-5, 0],
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1
      }
    }
  }
};

export const buttonPress = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};

export const dragItem = {
  whileHover: { scale: 1.05 },
  whileDrag: { scale: 1.05, zIndex: 10 }
};

export const drawerAnimation = {
  initial: { height: 0 },
  animate: { height: 'auto' },
  exit: { height: 0 },
  transition: { duration: 0.3 }
};

export const islandHover = {
  whileHover: { 
    scale: 1.03,
    transition: { duration: 0.2 } 
  }
};
