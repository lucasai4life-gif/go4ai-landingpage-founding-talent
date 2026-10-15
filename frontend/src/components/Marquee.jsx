/** Dải logo chạy vô tận; nhân đôi danh sách để vòng lặp liền mạch. */
export default function Marquee({ items, reverse = false, speed = 40 }) {
  const list = [...items, ...items];
  return (
    <div className="marquee" style={{ '--marquee-speed': `${speed}s` }}>
      <div className={`marquee-track ${reverse ? 'is-reverse' : ''}`}>
        {list.map(([file, name], i) => (
          <div className="marquee-item" key={i} title={name} aria-hidden={i >= items.length}>
            <img src={`/logos/${file}.webp`} alt={i < items.length ? name : ''} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}
