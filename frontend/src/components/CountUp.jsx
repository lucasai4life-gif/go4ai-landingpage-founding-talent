import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const fmt = (n, format) => {
  const v = Math.round(n);
  if (format === 'pad') return String(v).padStart(2, '0');
  return v.toLocaleString('vi-VN');
};

/** Đếm số khi phần tử vào khung nhìn. */
export default function CountUp({ value, format = 'plain', duration = 1.6, suffix = '', className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, value, { duration, ease: [0.22, 0.61, 0.36, 1], onUpdate: setN });
    return () => c.stop();
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className}>
      {fmt(n, format)}
      {suffix}
    </span>
  );
}
