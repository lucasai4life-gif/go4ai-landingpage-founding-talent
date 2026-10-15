import { motion } from 'motion/react';
import CountUp from '../components/CountUp.jsx';
import Reveal from '../components/Reveal.jsx';
import SplitText from '../components/SplitText.jsx';
import Partners from './Partners.jsx';
import { capabilities, impact } from '../content.js';
import { EASE } from '../lib/motion.js';

export default function About() {
  return (
    <section id="ve-go4ai" className="section about">
      <div className="about-glow" aria-hidden="true" />
      <div className="container about-inner">
        <span className="eyebrow eyebrow-light">Đồng hành cùng hệ sinh thái AI ứng dụng GO4AI</span>
        <SplitText as="h2" className="section-title about-title" text="TỪ NĂNG LỰC AI ĐẾN GIÁ TRỊ THỰC TẾ" />
        <Reveal as="p" className="about-lead" i={2}>
          GO4AI là hệ sinh thái đào tạo, tư vấn và triển khai giải pháp trí tuệ nhân tạo ứng dụng, tập trung giúp cá nhân và tổ chức chuyển hóa
          kiến thức AI thành sản phẩm, quy trình và kết quả có thể đo lường.
        </Reveal>

        <Reveal as="p" className="about-sub mono">
          GO4AI phát triển hai năng lực cốt lõi:
        </Reveal>
        <div className="about-caps">
          {capabilities.map(([t, d], i) => (
            <motion.div key={t} className="about-cap" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
              <motion.span className="about-cap-line" variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: EASE, delay: i * 0.15 } } }} />
              <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.2 + i * 0.15 } } }}>
                <span className="mono about-cap-no">0{i + 1} —</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="about-impact">
          <span className="mono about-impact-label">DẤU ẤN GO4AI</span>
          <dl className="impact-row">
            {impact.map((m, i) => (
              <Reveal key={m.label} className="impact" i={i}>
                <dt className="impact-num">
                  <CountUp value={m.value} suffix={m.suffix} duration={2} />
                </dt>
                <dd>{m.label}</dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <Partners />

        <div className="about-closing">
          <SplitText as="p" className="about-tagline" text="ĐẦU RA THỰC TẾ · ĐO LƯỜNG ĐƯỢC · CHUẨN HÓA ĐƯỢC" step={0.06} />
          <Reveal as="p" className="about-closing-text" i={2}>
            Thông qua Founding Talent Challenge, GO4AI tìm kiếm những cá nhân có khả năng cùng phát triển sản phẩm, giải pháp và những giá trị AI có
            thể ứng dụng lâu dài.
          </Reveal>
        </div>
      </div>
    </section>
  );
}
