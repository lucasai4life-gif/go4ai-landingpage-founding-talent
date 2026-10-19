import { animate, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import SplitText from '../components/SplitText.jsx';
import { foundingOpportunity, rounds } from '../content.js';
import { EASE } from '../lib/motion.js';

/* ---------- Visual từng vòng ---------- */

function QuestionsVisual({ play }) {
  const widths = [86, 64, 92, 72, 58, 80, 68];
  return (
    <div className="v-think" aria-hidden="true">
      <div className="v-think-head mono">
        <span>BÀI TƯ DUY · 7 CÂU</span>
        <span>35–45′</span>
      </div>
      <ol className="v-think-list">
        {widths.map((w, i) => (
          <li key={i}>
            <span className="mono">Q{i + 1}</span>
            <span className="v-think-track">
              <motion.span
                className="v-think-fill"
                initial={{ width: 0 }}
                animate={play ? { width: `${w}%` } : { width: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.3 + i * 0.22 }}
              />
            </span>
            <motion.span className="v-think-check" initial={{ scale: 0 }} animate={play ? { scale: 1 } : { scale: 0 }} transition={{ delay: 0.9 + i * 0.22, type: 'spring', stiffness: 400, damping: 18 }}>
              ✓
            </motion.span>
          </li>
        ))}
      </ol>
      <motion.div className="v-think-foot mono" initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 2.6 }}>
        → Founder chấm điểm trực tiếp
      </motion.div>
    </div>
  );
}

function TracksVisual({ play, tracks }) {
  const reduce = useReducedMotion();
  const [pick, setPick] = useState(0);
  const [hover, setHover] = useState(null);
  useEffect(() => {
    if (!play || reduce || hover !== null) return;
    const t = setInterval(() => setPick((p) => (p + 1) % 4), 1700);
    return () => clearInterval(t);
  }, [play, reduce, hover]);
  const current = hover ?? pick;

  return (
    <div className="v-build">
      <div className="v-build-grid">
        {tracks.map(([name, desc], i) => (
          <motion.button
            type="button"
            key={name}
            className={`v-build-cell ${current === i ? 'is-on' : ''}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={play ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.12 }}
          >
            {current === i && <motion.span layoutId="build-pick" className="v-build-pick" transition={{ duration: 0.5, ease: EASE }} />}
            <span className="mono v-build-idx">{String.fromCharCode(65 + i)}</span>
            <strong>{name}</strong>
            <span>{desc}</span>
          </motion.button>
        ))}
        <div className="v-build-center mono" aria-hidden="true">
          CHỌN
          <br />
          1 / 4
        </div>
      </div>
    </div>
  );
}

function TeamVisual({ play }) {
  // Đội 2–5 thành viên: 2 vị trí bắt buộc (nét liền) + 3 vị trí tùy chọn (nét đứt)
  const people = [-90, -18, 54, 126, 198].map((deg) => {
    const r = (deg * Math.PI) / 180;
    return [Math.round(Math.cos(r) * 112), Math.round(Math.sin(r) * 100)];
  });
  const optional = (i) => i >= 2;
  return (
    <div className="v-team" aria-hidden="true">
      <svg viewBox="-180 -140 360 280" className="v-team-svg">
        {people.map(([x, y], i) => (
          <motion.line key={i} x1={x} y1={y} x2="0" y2="0" className="v-team-link" initial={{ pathLength: 0 }} animate={play ? { pathLength: 1 } : { pathLength: 0 }} transition={{ duration: 0.8, delay: 0.6 + i * 0.15, ease: EASE }} />
        ))}
        <motion.circle r="44" className="v-team-core" initial={{ scale: 0 }} animate={play ? { scale: 1 } : { scale: 0 }} transition={{ delay: 1.3, type: 'spring', stiffness: 200, damping: 14 }} />
        <motion.text textAnchor="middle" dy="-2" className="v-team-core-t" initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}>DỰ ÁN</motion.text>
        <motion.text textAnchor="middle" dy="14" className="v-team-core-t" initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}>AI</motion.text>
        {people.map(([x, y], i) => (
          <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} animate={play ? { opacity: optional(i) ? 0.55 : 1, scale: 1 } : {}} transition={{ delay: 0.2 + i * 0.12, duration: 0.5, ease: EASE }} style={{ originX: `${x}px`, originY: `${y}px` }}>
            <circle cx={x} cy={y} r="26" className={`v-team-person ${optional(i) ? 'is-optional' : ''}`} />
            <circle cx={x} cy={y - 6} r="7" className="v-team-head" />
            <path d={`M ${x - 12} ${y + 14} Q ${x} ${y - 2} ${x + 12} ${y + 14}`} className="v-team-head" />
          </motion.g>
        ))}
      </svg>
      <div className="v-team-score">
        <div className="v-team-bar">
          <motion.span className="seg seg-team" initial={{ width: 0 }} animate={play ? { width: '40%' } : { width: 0 }} transition={{ delay: 1.8, duration: 0.8, ease: EASE }}>40% ĐỘI</motion.span>
          <motion.span className="seg seg-solo" initial={{ width: 0 }} animate={play ? { width: '60%' } : { width: 0 }} transition={{ delay: 2.3, duration: 0.8, ease: EASE }}>60% CÁ NHÂN</motion.span>
        </div>
        <span className="mono v-team-note">Đội 2–5 thành viên · Demo Day</span>
      </div>
    </div>
  );
}

function GoalVisual({ play }) {
  const reduce = useReducedMotion();
  const [day, setDay] = useState(reduce ? 90 : 0);
  useEffect(() => {
    if (!play || reduce) return;
    const c = animate(0, 90, { duration: 2.4, ease: EASE, delay: 0.3, onUpdate: (v) => setDay(Math.round(v)) });
    return () => c.stop();
  }, [play, reduce]);
  const C = 2 * Math.PI * 88;
  const milestones = ['Thống nhất Goal', 'Chốt DoD', 'Bằng chứng xác minh'];

  return (
    <div className="v-goal" aria-hidden="true">
      <div className="v-goal-ring">
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="88" className="v-goal-bg" />
          <motion.circle cx="100" cy="100" r="88" className="v-goal-fg" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={play ? { strokeDashoffset: 0 } : { strokeDashoffset: C }} transition={{ duration: 2.4, ease: EASE, delay: 0.3 }} />
        </svg>
        <div className="v-goal-num">
          <strong>{day}</strong>
          <span className="mono">/ 90 NGÀY</span>
        </div>
      </div>
      <ul className="v-goal-steps">
        {milestones.map((m, i) => (
          <motion.li key={m} initial={{ opacity: 0, x: 20 }} animate={play ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.8 + i * 0.6, duration: 0.5, ease: EASE }}>
            <span className="mono">0{i + 1}</span> {m}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Một chương (một vòng) ---------- */

function Chapter({ round, index, onActive }) {
  const ref = useRef(null);
  const center = useInView(ref, { margin: '-50% 0px -50% 0px' });
  const play = useInView(ref, { once: true, amount: 0.35 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bigY = useTransform(scrollYProgress, [0, 1], [120, -120]);

  useEffect(() => {
    if (center) onActive(index);
  }, [center, index, onActive]);

  const Visual = { questions: QuestionsVisual, tracks: TracksVisual, team: TeamVisual, goal: GoalVisual }[round.visual];

  return (
    <article ref={ref} id={`vong-${round.no}`} className={`chapter chapter-${round.color}`} aria-label={`Vòng ${round.no} — ${round.no === '04' ? 'ROUND 04 — THỰC CHIẾN' : `Vòng ${round.no} — ${round.name}`}`}>
      {round.no !== '04' && (
        <motion.span className="chapter-bignum" style={{ y: bigY }} aria-hidden="true">
          {round.no}
        </motion.span>
      )}
      <div className="chapter-grid">
        <div className="chapter-copy">
          <Reveal className="chapter-kicker mono">
            <span className="chapter-pill">ROUND {round.no}</span> — {round.name}
            <span className="chapter-when">{round.when}</span>
          </Reveal>
          <SplitText as="h3" className="chapter-question" text={round.question} step={0.035} />
          <Reveal as="p" className="chapter-intro" i={2}>
            {round.intro}
          </Reveal>
          {round.body && (
            <Reveal as="p" className="chapter-intro" i={3}>
              {round.body}
            </Reveal>
          )}
          {round.steps && (
            <motion.ol className="chapter-steps" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}>
              {round.steps.map((s, i) => (
                <motion.li key={s} variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } } }}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </motion.li>
              ))}
            </motion.ol>
          )}
          {round.score && (
            <Reveal as="p" className="chapter-score" i={2}>
              {round.score}
            </Reveal>
          )}
          <dl className="chapter-meta">
            {round.meta.map(([k, v], i) => (
              <Reveal key={k} className="chapter-meta-row" i={3 + i}>
                <dt className="mono">{k}</dt>
                <dd>{v}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
        <div className="chapter-visual">
          <Visual play={play} tracks={round.tracks} />
        </div>
      </div>
    </article>
  );
}

/* ---------- Cột mốc đặc biệt: Founding Opportunity giữa Vòng 3 & 4 ---------- */

function IconFinance() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
      <path d="M2 9h20" />
      <path d="m10 3-2 6 4 12 4-12-2-6" />
    </svg>
  );
}

function IconLeadership() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="m17 11 2 2 4-4" />
    </svg>
  );
}

function IconExecution() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
    </svg>
  );
}

function FoundingOpportunityMilestone() {
  const iconMap = {
    finance: IconFinance,
    leadership: IconLeadership,
    execution: IconExecution,
  };

  return (
    <div className="founding-opportunity-wrap" id="founding-opportunity" aria-label="Founding Opportunity — Cột mốc đặc quyền giữa Vòng 3 và Vòng 4">
      {/* Liên kết thị giác từ Vòng 03 */}
      <div className="fo-connector-in" aria-hidden="true">
        <span className="fo-connector-line" />
        <span className="fo-connector-pill mono">
          <span className="fo-connector-dot" />
          ROUND 03 → FOUNDING OPPORTUNITY
        </span>
        <span className="fo-connector-line" />
      </div>

      <Reveal className="fo-card" amount={0.2}>
        <div className="fo-head">
          <div className="fo-eyebrow-wrap">
            <span className="fo-eyebrow mono">
              <span className="fo-sparkle" aria-hidden="true">✦</span>
              {foundingOpportunity.badge}
            </span>
            <span className="fo-sub-eyebrow mono">
              {foundingOpportunity.eyebrow}
            </span>
          </div>
          <SplitText as="h3" className="fo-title" text={foundingOpportunity.title} step={0.025} />
          <Reveal as="p" className="fo-desc" i={2}>
            {foundingOpportunity.desc}
          </Reveal>
        </div>

        <div className="fo-grid">
          {foundingOpportunity.benefits.map((b, i) => {
            const Icon = iconMap[b.type] || IconFinance;
            return (
              <Reveal key={b.no} className="fo-item" i={i + 1}>
                <div className="fo-item-top">
                  <div className="fo-item-icon">
                    <Icon />
                  </div>
                  <span className="fo-item-index mono">0{i + 1} / 03</span>
                </div>
                <h4 className="fo-item-title">{b.title}</h4>
                <p className="fo-item-desc">{b.desc}</p>
              </Reveal>
            );
          })}
        </div>

        <div className="fo-foot">
          <svg className="fo-foot-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="fo-disclaimer">{foundingOpportunity.disclaimer}</p>
        </div>
      </Reveal>

      {/* Liên kết thị giác tiếp nối sang Vòng 04 */}
      <div className="fo-connector-out" aria-hidden="true">
        <span className="fo-connector-line-down" />
        <span className="fo-connector-pill fo-connector-pill-out mono">
          BƯỚC VÀO ROUND 04: THỰC CHIẾN 90 NGÀY
          <span className="fo-connector-arrow">↓</span>
        </span>
        <span className="fo-connector-line-down" />
      </div>
    </div>
  );
}

/* ---------- Section ---------- */

export default function Journey() {
  const bodyRef = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: bodyRef, offset: ['start 50%', 'end 50%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const jump = (no) => document.getElementById(`vong-${no}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section id="hanh-trinh" className="section journey">
      <div className="container journey-head">
        <span className="eyebrow">Hành trình tuyển chọn</span>
        <SplitText as="h2" className="section-title" text="04 VÒNG THỬ THÁCH" />
        <Reveal as="p" className="section-lead" i={2}>
          Từ cách bạn tư duy đến giá trị bạn thực sự tạo ra.
        </Reveal>
      </div>

      <div className="container journey-body" ref={bodyRef}>
        <aside className="journey-rail" aria-label="Tiến trình 4 vòng">
          <div className="rail-inner">
            <div className="rail-track" aria-hidden="true">
              <motion.div className="rail-fill" style={{ scaleY: fill }} />
              <motion.div className="rail-fill-x" style={{ scaleX: fill }} />
            </div>
            <ol className="rail-nodes">
              {rounds.map((r, i) => (
                <li key={r.key} className={`rail-node ${i === active ? 'is-active' : ''} ${i < active ? 'is-done' : ''}`}>
                  <button type="button" onClick={() => jump(r.no)} aria-current={i === active ? 'step' : undefined}>
                    <span className="rail-dot" aria-hidden="true">
                      {i < active ? '✓' : r.no}
                    </span>
                    <span className="rail-text">
                      <span className="mono">ROUND {r.no}</span>
                      <strong>{r.short}</strong>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </aside>
        <div className="journey-chapters">
          {rounds.map((r, i) => (
            <Fragment key={r.key}>
              <Chapter round={r} index={i} onActive={setActive} />
              {r.key === 'meet' && <FoundingOpportunityMilestone />}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="container">
        <Reveal className="journey-end">
          <span className="eyebrow">Bắt đầu hành trình của bạn</span>
          <a href="#dang-ky" className="btn btn-coral btn-lg btn-shine">
            ĐĂNG KÝ VÒNG 01 — THINK <span className="btn-arrow" aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
