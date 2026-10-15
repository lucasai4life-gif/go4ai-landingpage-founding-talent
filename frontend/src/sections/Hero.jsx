import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import CountUp from '../components/CountUp.jsx';
import NeuralCanvas from '../components/NeuralCanvas.jsx';
import SplitText from '../components/SplitText.jsx';
import { heroStats, rounds } from '../content.js';
import { EASE } from '../lib/motion.js';

const NODE_ANGLES = [-90, 0, 90, 180];
const R = 150;
const HOLD_MS = 4000; // mỗi chặng: chạy TRAVEL_S rồi dừng ở node
const TRAVEL_S = 1.6;
const TAIL_DEG = 90; // cung sáng phủ đúng một chặng (node trước → node hiện tại)

const tailStart = (TAIL_DEG * Math.PI) / 180;
const TAIL_X = -Math.sin(tailStart) * R;
const TAIL_Y = -Math.cos(tailStart) * R;

function JourneyOrbit() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref);
  // step tăng liên tục để cung sáng luôn chạy theo chiều kim đồng hồ (04 → 01 không quay ngược)
  const [step, setStep] = useState(0);
  const [rot, setRot] = useState(0);
  // Node chỉ sáng khi sao đang đứng ở node: tới nơi thì sáng, vừa rời đi thì tắt ngay
  const nearest = Math.round(rot / 90);
  const active = Math.abs(rot - nearest * 90) < 2 ? nearest % 4 : -1;

  useEffect(() => {
    if (reduce || !inView) return;
    const t = setInterval(() => setStep((s) => s + 1), HOLD_MS);
    return () => clearInterval(t);
  }, [reduce, inView]);

  useEffect(() => {
    // easeInOut: tăng tốc khi rời node, chậm dần khi tới node kế tiếp
    const c = animate(rot, step * 90, { duration: TRAVEL_S, ease: [0.65, 0, 0.35, 1], onUpdate: setRot });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <motion.div
      ref={ref}
      className="orbit"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.3 }}
      aria-label="Bốn vòng thử thách: Tư duy, Sản phẩm, Đội nhóm, Thực chiến"
      role="img"
    >
      {['tl', 'tr', 'bl', 'br'].map((c) => (
        <span key={c} className={`hud-plus hud-${c}`} aria-hidden="true">+</span>
      ))}
      <svg viewBox="-210 -210 420 420" className="orbit-svg" aria-hidden="true">
        <defs>
          <linearGradient id="comet-tail" gradientUnits="userSpaceOnUse" x1={TAIL_X} y1={TAIL_Y} x2="0" y2={-R}>
            <stop offset="0" stopColor="#08906c" stopOpacity="0" />
            <stop offset="1" stopColor="#08906c" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="comet-glow">
            <stop offset="0" stopColor="#08906c" stopOpacity="0.35" />
            <stop offset="1" stopColor="#08906c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r="190" className="ring ring-outer" />
        <circle r={R} className="ring ring-main" />
        <circle r="105" className="ring ring-inner" />
        {/* Sao chổi: transform của SVG xoay quanh (0,0) = tâm vòng tròn */}
        <g transform={`rotate(${rot})`}>
          <path d={`M ${TAIL_X} ${TAIL_Y} A ${R} ${R} 0 0 1 0 ${-R}`} stroke="url(#comet-tail)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="0" cy={-R} r="14" fill="url(#comet-glow)" />
          <circle cx="0" cy={-R} r="4" fill="#08906c" />
        </g>
        {NODE_ANGLES.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = Math.cos(rad) * R, y = Math.sin(rad) * R;
          const on = i === active;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              {/* Vòng tỏa ra: chỉ hiện ở node đang sáng; key theo active để chạy lại từ đầu mỗi lần tới node */}
              {on && !reduce && (
                <g key={`pulse-${active}`} className="node-pulses">
                  {[0, 1, 2].map((k) => (
                    <circle key={k} r="22" className="node-pulse" style={{ animationDelay: `${k * 0.75}s` }} />
                  ))}
                </g>
              )}
              <circle r="22" className={`node ${on ? 'is-on' : ''}`} />
              <text className="node-no" textAnchor="middle" dy="5">{rounds[i].no}</text>
            </g>
          );
        })}
        <text className="orbit-center-1" textAnchor="middle" dy="-4">GO4AI</text>
        <text className="orbit-center-2" textAnchor="middle" dy="20">TALENT 2026</text>
      </svg>
      {rounds.map((r, i) => (
        <div key={r.key} className={`orbit-label orbit-label-${i} ${i === active ? 'is-on' : ''}`}>
          <span className="mono">ROUND {r.no}</span>
          <strong>{r.no}. {r.short}</strong>
        </div>
      ))}
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yOrbit = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section id="hero" className="hero" ref={ref}>
      <NeuralCanvas />
      <div className="container hero-grid">
        <motion.div className="hero-copy" style={{ y: yText, opacity: fade }}>
          <motion.div className="hero-badge" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <span className="beacon" aria-hidden="true" />
            <span className="eyebrow">Chương trình tuyển chọn &amp; phát triển nhân tài GO4AI</span>
          </motion.div>
          <h1 className="hero-title">
            <SplitText text="TỪ TIỀM NĂNG" className="hero-title-accent" animateOnMount delay={0.15} />
            <SplitText text="ĐẾN CƠ HỘI TRỞ THÀNH ĐỘI NGŨ NÒNG CỐT GO4AI" className="hero-title-rest" animateOnMount delay={0.35} step={0.04} />
          </h1>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.9 }}>
            <p className="hero-lead">
              Bạn có năng lực, có khát vọng phát triển và muốn tạo ra nhiều giá trị hơn trong lĩnh vực AI?
            </p>
            <p className="hero-sub">
              GO4AI Founding Talent Challenge 2026 là hành trình <strong>4 vòng thử thách</strong>, nơi bạn được thể hiện tư duy, xây dựng
              sản phẩm thực tế, được Founder trực tiếp đánh giá và mở ra cơ hội phát triển cùng hệ sinh thái GO4AI.
            </p>
            <div className="hero-cta">
              <a href="#dang-ky" className="btn btn-coral btn-lg btn-shine">
                ĐĂNG KÝ THAM GIA NGAY <span className="btn-arrow" aria-hidden="true">→</span>
              </a>
              <span className="badge badge-coral mono">HẠN ĐĂNG KÝ: 30/11/2026</span>
            </div>
          </motion.div>
        </motion.div>
        <motion.div className="hero-visual" style={{ y: yOrbit }}>
          <JourneyOrbit />
        </motion.div>
      </div>

      <div className="container">
        <motion.dl
          className="hero-stats"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 1.1 } } }}
        >
          {heroStats.map((s) => (
            <motion.div key={s.label} className="hero-stat" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}>
              <dt className="mono hero-stat-label">{s.label}</dt>
              <dd>
                <span className="hero-stat-value">
                  <CountUp value={s.value} format={s.format === 'vnd' ? 'plain' : s.format} />
                  {s.format === 'vnd' ? ' VNĐ' : s.suffix}
                </span>
                <span className="hero-stat-desc">{s.desc}</span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
