import Marquee from '../components/Marquee.jsx';
import { partners, schools } from '../content.js';

/** Hai dải logo chạy ngược chiều, nằm trong phần Về GO4AI (nền xanh đậm) như bản gốc. */
export default function Partners() {
  return (
    <div className="partners" aria-label="Trường học và đối tác đồng hành">
      <Marquee items={schools} speed={32} />
      <Marquee items={partners} speed={36} reverse />
    </div>
  );
}
