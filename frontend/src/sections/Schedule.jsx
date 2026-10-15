import { motion, useScroll, useSpring } from 'motion/react';
import { useMemo, useRef } from 'react';
import Reveal from '../components/Reveal.jsx';
import SplitText from '../components/SplitText.jsx';
import { schedule } from '../content.js';
import { EASE } from '../lib/motion.js';

function statusOf(item, now) {
  const start = item.start ? new Date(item.start) : null;
  const end = item.end ? new Date(item.end) : null;
  if (end && now > end) return 'past';
  if ((!start || now >= start) && end && now <= end) return 'now';
  return 'next';
}

const LABEL = { past: 'Đã qua', now: 'Đang diễn ra', next: 'Sắp tới' };

export default function Schedule({ now }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const items = useMemo(() => schedule.map((s) => ({ ...s, status: statusOf(s, now) })), [now]);

  return (
    <section id="lich-trinh" className="section schedule">
      <div className="container schedule-grid">
        <div className="schedule-head">
          <div className="sticky-block">
            <span className="eyebrow">Những điều bạn cần biết</span>
            <SplitText as="h2" className="section-title" text="LỊCH TRÌNH DỰ KIẾN" />
            <Reveal as="p" className="section-lead" i={2}>
              Thông tin chi tiết về các giai đoạn thử thách và giải đáp các thắc mắc thường gặp.
            </Reveal>
            <Reveal as="p" className="schedule-note" i={3}>
              Các mốc thời gian ngoài hạn đăng ký là kế hoạch đề xuất, cần Founder GO4AI phê duyệt trước khi công bố chính thức. Lịch đào tạo, gặp gỡ
              và Demo Day được thông báo theo từng giai đoạn.
            </Reveal>
          </div>
        </div>

        <div className="timeline-wrap" ref={ref}>
          <div className="timeline-track" aria-hidden="true">
            <motion.div className="timeline-fill" style={{ scaleY: line }} />
          </div>
          <ol className="timeline">
            {items.map((s, i) => (
              <motion.li
                key={s.phase}
                className={`tl-item tl-${s.kind} tl-${s.status}`}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <span className="tl-dot" aria-hidden="true">
                  {s.status === 'now' && <span className="tl-ping" />}
                </span>
                <div className="tl-content">
                  <span className="tl-time mono">{s.time}</span>
                  <strong className="tl-phase">{s.phase}</strong>
                  {s.status === 'now' ? (
                    <span className="badge badge-coral tl-badge">● Bạn đang ở đây — {LABEL.now}</span>
                  ) : (
                    s.kind !== 'final' && <span className="tl-status mono">{LABEL[s.status]}</span>
                  )}
                </div>
                <span className="tl-index mono" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
