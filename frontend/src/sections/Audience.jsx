import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import SplitText from '../components/SplitText.jsx';
import { directions, values } from '../content.js';
import { EASE } from '../lib/motion.js';

export default function Audience() {
  const [active, setActive] = useState(0);
  const loop = [...values, ...values];

  return (
    <section id="doi-tuong" className="section audience">
      <div className="container">
        <span className="eyebrow">Đối tượng tham gia</span>
        <SplitText as="h2" className="section-title" text="GO4AI ĐANG TÌM KIẾM NHỮNG AI?" />
        <Reveal as="p" className="section-lead" i={2}>
          Không quan trọng bạn bắt đầu từ đâu. Quan trọng là bạn sẵn sàng tạo ra điều gì.
        </Reveal>
        <Reveal as="p" className="audience-intro" i={3}>
          Chương trình dành cho sinh viên, người đi làm, người từng khởi nghiệp và những cá nhân mong muốn phát triển năng lực thông qua các dự án
          AI ứng dụng thực tế.
        </Reveal>

        <div className="audience-grid">
          <div className="audience-display" aria-hidden="true">
            <span className="mono audience-display-label">04 HƯỚNG CHUYÊN MÔN</span>
            <div className="audience-display-word">
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  initial={{ y: 40, opacity: 0, filter: 'blur(6px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -40, opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  {directions[active].key}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="audience-display-no mono">{directions[active].no} / 04</span>
          </div>

          <ul className="audience-list">
            {directions.map((d, i) => {
              const on = i === active;
              return (
                <motion.li
                  key={d.key}
                  className={`direction ${on ? 'is-on' : ''}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                >
                  <button type="button" onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-expanded={on}>
                    <span className="direction-no mono">{d.no}</span>
                    <span className="direction-name">
                      <span className="mono direction-key">{d.key}</span>
                      {d.name}
                    </span>
                    <motion.span className="direction-arrow" animate={{ x: on ? 0 : -8, opacity: on ? 1 : 0.3 }} aria-hidden="true">
                      →
                    </motion.span>
                  </button>
                  <motion.div className="direction-desc" initial={false} animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.4, ease: EASE }}>
                    <p>{d.desc}</p>
                  </motion.div>
                  <motion.span className="direction-bar" animate={{ scaleX: on ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }} aria-hidden="true" />
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="values">
        <div className="container">
          <span className="eyebrow">Điều GO4AI đánh giá cao</span>
        </div>
        <div className="values-strip" role="list" aria-label="Điều GO4AI đánh giá cao">
          <div className="values-track">
            {loop.map((v, i) => (
              <span key={i} className="values-item" role={i < values.length ? 'listitem' : undefined} aria-hidden={i >= values.length}>
                {v}
                <span className="values-sep" aria-hidden="true">✦</span>
              </span>
            ))}
          </div>
        </div>
        <div className="container">
          <Reveal as="p" className="values-note">
            Bạn không cần giỏi tất cả các lĩnh vực. Hãy bắt đầu từ thế mạnh của mình và sẵn sàng chứng minh năng lực bằng hành động.
          </Reveal>
        </div>
      </div>
    </section>
  );
}
