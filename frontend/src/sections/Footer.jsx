import { motion, useScroll, useTransform } from 'motion/react';

export default function Footer() {
  const { scrollYProgress } = useScroll();
  const showTop = useTransform(scrollYProgress, [0.1, 0.15], [0, 1]);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <img src="/logos/logo-go4ai-life.webp" alt="GO4AI" className="footer-logo" />
            <p className="footer-tagline mono">GO4AI — TỪ NĂNG LỰC AI ĐẾN GIÁ TRỊ THỰC TẾ</p>
          </div>
          <div className="footer-info">
            <strong>GO4AI Founding Talent Challenge 2026</strong>
            <span>Đơn vị tổ chức: Công ty TNHH Công nghệ Tư vấn Đào tạo GO4AI</span>
            <span>
              Website:{' '}
              <a href="https://edu.go4ai.org/" target="_blank" rel="noreferrer">
                edu.go4ai.org
              </a>
            </span>
            <span>
              Email: <a href="mailto:go4ai.org@gmail.com">go4ai.org@gmail.com</a>
            </span>
            <span>
              Hotline: <a href="tel:0988846503">098-884-6503</a>
            </span>
          </div>
          <nav className="footer-links" aria-label="Liên kết">
            <a href="https://edu.go4ai.org/" target="_blank" rel="noreferrer">Về GO4AI</a>
            <a href="#faq">Thể lệ chương trình</a>
            <a href="#dang-ky">Chính sách xử lý dữ liệu cá nhân</a>
          </nav>
        </div>
        <p className="footer-disclaimer">
          Việc tham gia chương trình không đồng nghĩa với cam kết tuyển dụng, cấp cổ phần, chức danh hoặc chứng nhận tự động.
        </p>
      </div>
      <motion.a href="#hero" className="to-top" style={{ opacity: showTop }} aria-label="Lên đầu trang">
        ↑
      </motion.a>
    </footer>
  );
}
