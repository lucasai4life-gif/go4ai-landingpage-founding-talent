import { motion } from 'motion/react';
import { fadeUp } from '../lib/motion.js';

/** Hiện dần khi cuộn tới (fade-up 24px, 0.6s). */
export default function Reveal({ as = 'div', i = 0, className, children, amount = 0.3, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, amount }} {...rest}>
      {children}
    </Tag>
  );
}
