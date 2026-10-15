// Đường cong chuẩn của design system: cubic-bezier(0.22, 0.61, 0.36, 1)
export const EASE = [0.22, 0.61, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: i * 0.06 } }),
};

export const stagger = (step = 0.06, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});

export const inViewOnce = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.3 } };
