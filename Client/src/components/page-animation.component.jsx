import React from "react";
import { AnimatePresence, motion } from "framer-motion";
const AnimationWrapper = ({
  keValue,
  children,
  className,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  exit = { opacity: 0 },
  transition = { duration: 1 },
}) => {
  return (
    <AnimatePresence>
      <motion.div
        className={className}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        key={keValue}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimationWrapper;
