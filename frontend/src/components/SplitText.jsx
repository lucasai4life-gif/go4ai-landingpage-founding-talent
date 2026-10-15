import { motion } from 'motion/react';
import { Fragment } from 'react';
import { EASE } from '../lib/motion.js';

/** Tách chữ theo từ, mỗi từ trượt lên từ sau mặt nạ. */
export default function SplitText({ text, as = 'span', className, delay = 0, step = 0.05, animateOnMount = false }) {
  const Tag = motion[as];
  const words = text.split(' ');
  const trigger = animateOnMount ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, amount: 0.5 } };
  return (
    <Tag className={className} initial="hidden" {...trigger} transition={{ staggerChildren: step, delayChildren: delay }} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split-word" aria-hidden="true">
            <motion.span
              className="split-inner"
              variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.7, ease: EASE } } }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}
