import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import SplitText from '../components/SplitText.jsx';
import { faqs } from '../content.js';
import { EASE } from '../lib/motion.js';

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section faq">
      <div className="container faq-grid">
        <div>
          <span className="eyebrow">FAQ</span>
          <SplitText as="h2" className="section-title" text="CÂU HỎI THƯỜNG GẶP" />
          <Reveal as="p" className="section-lead" i={2}>
            Chưa thấy câu trả lời bạn cần? Liên hệ{' '}
            <a className="link" href="mailto:go4ai.org@gmail.com">
              go4ai.org@gmail.com
            </a>{' '}
            hoặc hotline{' '}
            <a className="link" href="tel:0988846503">
              098-884-6503
            </a>
            .
          </Reveal>
        </div>
        <ul className="faq-list">
          {faqs.map((f, i) => {
            const on = open === i;
            const id = `faq-${i}`;
            return (
              <Reveal as="li" key={f.q} className={`faq-item ${on ? 'is-open' : ''}`} i={i}>
                <h3>
                  <button type="button" aria-expanded={on} aria-controls={id} onClick={() => setOpen(on ? -1 : i)}>
                    <span className="faq-no mono">{String(i + 1).padStart(2, '0')}.</span>
                    <span className="faq-q">{f.q}</span>
                    <motion.span className="faq-icon" animate={{ rotate: on ? 45 : 0 }} transition={{ duration: 0.3, ease: EASE }} aria-hidden="true">
                      +
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={id}
                      className="faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <div className="faq-a-inner">
                        {f.list && (
                          <dl className="faq-dl">
                            {f.list.map(([k, v]) => (
                              <div key={k}>
                                <dt className="mono">{k}</dt>
                                <dd>{v}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        {f.a.map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
