import { MotionConfig } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import { getSeason } from './lib/api.js';
import About from './sections/About.jsx';
import Audience from './sections/Audience.jsx';
import Benefits from './sections/Benefits.jsx';
import Faq from './sections/Faq.jsx';
import Footer from './sections/Footer.jsx';
import Hero from './sections/Hero.jsx';
import Journey from './sections/Journey.jsx';
import Register from './sections/Register.jsx';
import Schedule from './sections/Schedule.jsx';

export default function App() {
  const [season, setSeason] = useState(null);

  useEffect(() => {
    getSeason().then(setSeason).catch(() => setSeason(null));
  }, []);

  // Mọi nút "Đăng ký" nhảy thẳng tới form (không cuộn mượt qua cả trang) và focus ô đầu tiên
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest('a[href="#dang-ky"]');
      if (!link) return;
      e.preventDefault();
      const target = document.getElementById('dang-ky');
      if (!target) return;
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      history.replaceState(null, '', '#dang-ky');
      setTimeout(() => target.querySelector('.lead-form input:not([type=hidden]):not(.hp)')?.focus({ preventScroll: true }), 50);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Thời điểm tham chiếu lấy từ máy chủ nếu có
  const now = useMemo(() => (season ? new Date(season.serverTime) : new Date()), [season]);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#dang-ky">
        Bỏ qua đến form đăng ký
      </a>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Journey />
        <Audience />
        <About />
        <Schedule now={now} />
        <Faq />
        <Register season={season} />
      </main>
      <Footer />
    </MotionConfig>
  );
}
