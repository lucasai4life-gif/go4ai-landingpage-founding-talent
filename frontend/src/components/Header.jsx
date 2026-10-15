import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { useState } from 'react';

const NAV = [
  ['#quyen-loi', 'Quyền lợi'],
  ['#hanh-trinh', 'Hành trình'],
  ['#doi-tuong', 'Đối tượng'],
  ['#lich-trinh', 'Lịch trình'],
  ['#faq', 'FAQ'],
];

export default function Header() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    setHidden(y > 400 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
  });

  return (
    <>
      <motion.div className="progress-bar" style={{ scaleX: progress }} aria-hidden="true" />
      <motion.header
        className={`site-header ${scrolled ? 'is-scrolled' : ''}`}
        animate={{ y: hidden ? -72 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="container header-inner">
          <a href="#hero" className="brand">
            <img src="/logos/logo-go4ai-life.webp" alt="GO4AI" className="brand-logo" />
            <span className="brand-tag mono">Founding Talent Challenge 2026</span>
          </a>
          <nav className="header-nav" aria-label="Điều hướng chính">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="nav-link">
                {label}
              </a>
            ))}
          </nav>
          <a href="#dang-ky" className="btn btn-coral btn-sm">
            Đăng ký ngay
          </a>
        </div>
      </motion.header>
    </>
  );
}
