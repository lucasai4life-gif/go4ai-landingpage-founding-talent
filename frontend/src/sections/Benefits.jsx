import { AnimatePresence, motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import SplitText from '../components/SplitText.jsx';
import { benefits } from '../content.js';
import { EASE } from '../lib/motion.js';

function BenefitRow({ item, index, active, onActive }) {
  const ref = useRef(null);
  const center = useInView(ref, { margin: '-45% 0px -45% 0px' });
  useEffect(() => {
    if (center) onActive(index);
  }, [center, index, onActive]);
  const no = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      ref={ref}
      className={`benefit ${active ? 'is-active' : ''}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <motion.span className="benefit-line" variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: EASE } } }} />
      <div className="benefit-no mono" aria-hidden="true">{no}</div>
      <div className="benefit-body">
        <motion.h3 variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE, delay: 0.15 } } }}>
          {item.title}
        </motion.h3>
        {item.tag && (
          <motion.span className="badge badge-green" variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { delay: 0.35 } } }}>
            {item.tag}
          </motion.span>
        )}
        {item.body.map((p, i) => (
          <motion.p key={i} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.25 + i * 0.1 } } }}>
            {p}
          </motion.p>
        ))}
        {item.paths && (
          <motion.ol className="career-ladder" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.5 } } }}>
            {item.paths.map(([name, desc], i) => (
              <motion.li key={name} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}>
                <span className="ladder-dot" aria-hidden="true">{i + 1}</span>
                <strong>{name}</strong>
                <span>{desc}</span>
              </motion.li>
            ))}
          </motion.ol>
        )}
        {item.note && <p className="benefit-note">{item.note}</p>}
      </div>
    </motion.article>
  );
}

export default function Benefits() {
  const [active, setActive] = useState(0);
  const no = String(active + 1).padStart(2, '0');

  return (
    <section id="quyen-loi" className="section benefits">
      <div className="container benefits-grid">
        <div className="benefits-aside">
          <div className="sticky-block">
            <span className="eyebrow">Quyền lợi ứng viên</span>
            <SplitText as="h2" className="section-title" text="KHÔNG CHỈ LÀ MỘT CHƯƠNG TRÌNH TUYỂN CHỌN" />
            <Reveal as="p" className="section-lead" i={2}>
              Đây là cơ hội để bạn được đầu tư phát triển năng lực, tạo ra sản phẩm và chứng minh giá trị thực tế.
            </Reveal>
            <div className="benefit-counter mono" aria-hidden="true">
              <span className="benefit-counter-num">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={no} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                    {no}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="benefit-counter-total">/ 05</span>
            </div>
            <div className="benefit-dots" aria-hidden="true">
              {benefits.map((_, i) => (
                <motion.span key={i} animate={{ width: i === active ? 32 : 8, backgroundColor: i === active ? '#08906c' : '#bec9c6' }} transition={{ duration: 0.4, ease: EASE }} />
              ))}
            </div>
          </div>
        </div>
        <div className="benefits-list">
          {benefits.map((b, i) => (
            <BenefitRow key={b.title} item={b} index={i} active={i === active} onActive={setActive} />
          ))}
        </div>
      </div>
    </section>
  );
}
