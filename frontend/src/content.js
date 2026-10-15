// Nội dung lấy nguyên văn từ bản phác thảo đã được duyệt (go4ai-talent-2026.pages.dev)

export const DEADLINE_ISO = '2026-11-30T16:59:59Z'; // 23:59:59 30/11/2026 GMT+7

export const heroStats = [
  { label: 'THÔNG SỐ 01', value: 25000000, format: 'vnd', title: '25.000.000 VNĐ', desc: 'Học bổng AI Business Builder Level 2 — Tài trợ 100% học phí cho ứng viên đủ điều kiện.' },
  { label: 'THÔNG SỐ 02', value: 4, format: 'pad', suffix: ' VÒNG THỬ THÁCH', desc: 'Tư duy · Sản phẩm · Đội nhóm · Thực chiến' },
  { label: 'THÔNG SỐ 03', value: 90, format: 'plain', suffix: ' NGÀY THỰC CHIẾN', desc: 'Cơ hội tham gia dự án thực tế và phát triển cùng GO4AI.' },
];

export const schools = [
  ['ueh', 'UEH University'],
  ['fpt-university', 'Đại học FPT'],
  ['fpt-polytechnic', 'Cao đẳng FPT Polytechnic'],
  ['ben-tre', 'Cao đẳng Bến Tre'],
  ['ctim', 'Cao đẳng CTIM'],
  ['tay-nguyen', 'Đại học Tây Nguyên'],
  ['vietd', 'VIETD'],
];

export const partners = [
  ['thinksmart', 'ThinkSmart'],
  ['sunlandsg', 'SunlandSG'],
  ['mahaspa', 'MahaSpa'],
  ['ftms', 'FTMS Global'],
  ['vtalk', 'VTALK Academy'],
  ['hr1', 'HR1VIETNAM'],
  ['pnic', 'PNIC'],
  ['simplamo', 'Simplamo'],
  ['startup-mastertrack', 'Startup MasterTrack'],
  ['thegioirobot', 'Thế Giới Robot'],
];

export const benefits = [
  {
    title: 'HỌC BỔNG AI TRỊ GIÁ 25.000.000 VNĐ',
    tag: 'TÀI TRỢ 100% HỌC PHÍ',
    body: [
      'Ứng viên vượt qua hai vòng đầu và đủ điều kiện tham gia Vòng 3 được GO4AI tài trợ toàn bộ học phí chương trình AI Business Builder Level 2, trị giá 25.000.000 VNĐ.',
      'Cơ hội phát triển năng lực ứng dụng AI, thiết kế quy trình và xây dựng sản phẩm giải quyết bài toán thực tế.',
    ],
  },
  {
    title: 'FOUNDER TRỰC TIẾP ĐÁNH GIÁ NĂNG LỰC',
    body: [
      'Không chỉ được nhìn nhận qua CV hay một buổi phỏng vấn, bạn có cơ hội thể hiện tư duy, bảo vệ quan điểm và chứng minh khả năng thực thi.',
      'Nhận kết quả đánh giá và những phản hồi được công bố theo tiêu chí rõ ràng, giúp nhận diện thế mạnh và định hướng phát triển.',
    ],
  },
  {
    title: 'XÂY DỰNG SẢN PHẨM THỰC TẾ, PHÁT TRIỂN PORTFOLIO',
    body: [
      'Trực tiếp thực hiện các thử thách về kinh doanh, công nghệ AI, phát triển đối tác hoặc vận hành.',
      'Tạo ra sản phẩm và bằng chứng có thể kiểm chứng, làm nền tảng phát triển CV, Portfolio và hồ sơ năng lực nghề nghiệp trong phạm vi quyền sử dụng được cho phép.',
    ],
  },
  {
    title: 'KẾT NỐI VÀ PHÁT TRIỂN CÙNG ĐỘI NGŨ GO4AI',
    body: [
      'Gặp gỡ Founder, kết nối những cá nhân có chuyên môn bổ trợ và cùng phát triển dự án AI theo đội nhóm.',
      'Rèn luyện năng lực hợp tác, giải quyết vấn đề và trực tiếp trình bày, bảo vệ sản phẩm tại Demo Day.',
    ],
  },
  {
    title: 'CƠ HỘI THỰC CHIẾN VÀ PHÁT TRIỂN SỰ NGHIỆP',
    body: [
      'Những ứng viên đủ điều kiện được xem xét tham gia giai đoạn 90 ngày thực chiến, trực tiếp tạo ra giá trị thông qua các mục tiêu và dự án thực tế.',
      'Dựa trên kết quả đã chứng minh, ứng viên có cơ hội được xem xét cho các định hướng hợp tác:',
    ],
    paths: [
      ['VENTURE OWNER', 'Tiềm năng phụ trách và phát triển một mảng kinh doanh hoặc sản phẩm.'],
      ['CORE TEAM', 'Tiềm năng trở thành thành viên đội ngũ nòng cốt, đồng hành dài hạn cùng GO4AI.'],
      ['CONTINUE DEVELOPMENT', 'Tiếp tục phát triển năng lực và được xem xét các cơ hội phù hợp trong tương lai.'],
    ],
    note: 'Phạm vi công việc, quyền lợi tài chính và điều kiện hợp tác được hai bên thỏa thuận riêng. Chương trình không bảo đảm tự động tuyển dụng, bổ nhiệm chức danh hoặc cấp cổ phần.',
  },
];

export const rounds = [
  {
    key: 'think',
    no: '01',
    name: 'THINK',
    short: 'TƯ DUY',
    color: 'green',
    question: 'BẠN TƯ DUY VÀ ĐƯA RA QUYẾT ĐỊNH NHƯ THẾ NÀO?',
    intro: 'Trả lời 7 câu hỏi về GO4AI, chiến lược, khả năng phản biện, tinh thần chủ động và định hướng phát triển cá nhân.',
    meta: [
      ['Hình thức', 'Trực tuyến, khuyến nghị 35–45 phút.'],
      ['Đầu ra', 'Bài đánh giá tư duy và kết quả chấm điểm trực tiếp từ Founder.'],
    ],
    when: '02–06/12/2026',
    visual: 'questions',
  },
  {
    key: 'build',
    no: '02',
    name: 'BUILD',
    short: 'SẢN PHẨM',
    color: 'coral',
    question: 'BẠN CÓ THỂ BIẾN Ý TƯỞNG THÀNH SẢN PHẨM KHÔNG?',
    intro: 'Lựa chọn 1 trong 4 thử thách theo thế mạnh chuyên môn:',
    tracks: [
      ['BUSINESS BUILDER', 'Thiết kế và kiểm chứng một cơ hội kinh doanh.'],
      ['AI PRODUCT BUILDER', 'Xây dựng bản mẫu giải pháp AI cho bài toán thực tế.'],
      ['ECOSYSTEM BUILDER', 'Phát triển đề xuất hợp tác và mở rộng hệ sinh thái.'],
      ['VENTURE OPERATIONS BUILDER', 'Thiết kế giải pháp vận hành và tối ưu nguồn lực.'],
    ],
    meta: [
      ['Hình thức', 'Thực hiện cá nhân, nộp sản phẩm trực tuyến.'],
      ['Đầu ra', 'Một sản phẩm hoặc bộ giải pháp có thể xem xét, thử nghiệm và kiểm chứng.'],
    ],
    when: '10–27/12/2026',
    visual: 'tracks',
  },
  {
    key: 'meet',
    no: '03',
    name: 'MEET, TRAIN & LEVEL 2',
    short: 'ĐỘI NHÓM',
    color: 'blue',
    question: 'BẠN CÓ THỂ TẠO RA ĐIỀU GÌ KHI LÀM VIỆC CÙNG MỘT ĐỘI?',
    intro: 'Ứng viên vượt qua hai vòng đầu sẽ tham gia hành trình kết nối, đào tạo và xây dựng dự án:',
    steps: [
      'Gặp gỡ và trao đổi cùng Founder GO4AI.',
      'Được tài trợ học phí AI Business Builder Level 2 theo điều kiện chương trình.',
      'Kết nối và thành lập đội 2–5 thành viên.',
      'Cùng phát triển dự án AI ứng dụng.',
      'Trình bày và bảo vệ sản phẩm tại Demo Day.',
    ],
    score: 'Đánh giá năng lực: 40% điểm đội nhóm + 60% điểm cá nhân, với các ngưỡng đạt theo thể lệ.',
    meta: [['Đầu ra', 'Dự án AI, bằng chứng đóng góp cá nhân và kết quả đánh giá từ Founder.']],
    when: '11/01–28/02/2027',
    visual: 'team',
  },
  {
    key: 'real',
    no: '04',
    name: 'THỰC CHIẾN',
    short: 'THỰC CHIẾN',
    color: 'dark',
    question: '90 NGÀY ĐỂ CHỨNG MINH GIÁ TRỊ THỰC TẾ.',
    intro: 'Ứng viên đủ điều kiện được xem xét bước vào giai đoạn hợp tác thực tế cùng GO4AI.',
    body: 'Bạn và Founder thống nhất mục tiêu, trách nhiệm và kết quả cần đạt; sau đó triển khai công việc và chứng minh năng lực bằng sản phẩm, số liệu hoặc bằng chứng có thể xác minh.',
    meta: [['Đầu ra', 'Kết quả thực chiến và quyết định về định hướng hợp tác phù hợp.']],
    when: '08/03–05/06/2027',
    visual: 'goal',
  },
];

export const directions = [
  { no: '01', key: 'BUSINESS', name: 'PHÁT TRIỂN KINH DOANH', desc: 'Dành cho người quan tâm đến khách hàng, thị trường, mô hình doanh thu và phát triển hoạt động kinh doanh.' },
  { no: '02', key: 'TECHNOLOGY', name: 'CÔNG NGHỆ & SẢN PHẨM AI', desc: 'Dành cho người yêu thích công nghệ, xây dựng sản phẩm, phát triển ứng dụng và giải pháp AI.' },
  { no: '03', key: 'ECOSYSTEM', name: 'PHÁT TRIỂN ĐỐI TÁC', desc: 'Dành cho người có thế mạnh kết nối, xây dựng quan hệ hợp tác và phát triển hệ sinh thái.' },
  { no: '04', key: 'OPERATIONS', name: 'VẬN HÀNH', desc: 'Dành cho người có tư duy hệ thống, tổ chức công việc, quản lý nguồn lực và tối ưu quy trình.' },
];

export const values = ['TƯ DUY CHỦ ĐỘNG', 'KHẢ NĂNG HỌC HỎI', 'NĂNG LỰC THỰC THI', 'TINH THẦN HỢP TÁC', 'TRÁCH NHIỆM VỚI KẾT QUẢ'];

export const impact = [
  { value: 20, suffix: '+', label: 'Trường học đồng hành' },
  { value: 3000, suffix: '+', label: 'Học viên tham gia hệ sinh thái' },
  { value: 15, suffix: '+', label: 'Doanh nghiệp và tổ chức đối tác' },
];

export const capabilities = [
  ['ĐÀO TẠO AI ỨNG DỤNG', 'Thiết kế chương trình đào tạo thực chiến, phát triển năng lực AI thông qua sản phẩm công việc, bằng chứng thực tế và hệ thống đánh giá năng lực AI Passport.'],
  ['TRIỂN KHAI GIẢI PHÁP AI', 'Tư vấn, thiết kế và triển khai AI Agent, chatbot, workflow tự động hóa và các giải pháp AI phục vụ hoạt động kinh doanh, vận hành.'],
];

// start/end theo giờ VN; dùng để tô "đang diễn ra"
export const schedule = [
  { phase: 'Đăng ký tham gia', time: 'Đến 30/11/2026', end: '2026-11-30T16:59:59Z', kind: 'open' },
  { phase: 'ROUND 01 — THINK', time: '02–06/12/2026', start: '2026-12-01T17:00:00Z', end: '2026-12-06T16:59:59Z', kind: 'round' },
  { phase: 'Công bố kết quả Vòng 1', time: '08/12/2026', start: '2026-12-07T17:00:00Z', end: '2026-12-08T16:59:59Z', kind: 'result' },
  { phase: 'ROUND 02 — BUILD', time: '10–27/12/2026', start: '2026-12-09T17:00:00Z', end: '2026-12-27T16:59:59Z', kind: 'round' },
  { phase: 'Công bố kết quả Vòng 2', time: '04/01/2027', start: '2027-01-03T17:00:00Z', end: '2027-01-04T16:59:59Z', kind: 'result' },
  { phase: 'ROUND 03 — MEET, TRAIN & LEVEL 2', time: '11/01–28/02/2027', start: '2027-01-10T17:00:00Z', end: '2027-02-28T16:59:59Z', kind: 'round' },
  { phase: 'Công bố kết quả Vòng 3', time: '03/03/2027', start: '2027-03-02T17:00:00Z', end: '2027-03-03T16:59:59Z', kind: 'result' },
  { phase: 'ROUND 04 — THỰC CHIẾN', time: '08/03–05/06/2027', start: '2027-03-07T17:00:00Z', end: '2027-06-05T16:59:59Z', kind: 'round' },
  { phase: 'Đánh giá và quyết định cuối', time: 'Sau khi kết thúc thực chiến', kind: 'final' },
];

export const faqs = [
  {
    q: 'Tham gia chương trình có mất phí không?',
    a: [
      'Không. GO4AI tài trợ chi phí tham gia các vòng tuyển chọn. Ứng viên vượt qua Vòng 2 và đủ điều kiện vào Vòng 3 được tài trợ 100% học phí AI Business Builder Level 2, trị giá 25.000.000 VNĐ.',
      'Các chi phí cá nhân khác nếu phát sinh nằm ngoài phạm vi tài trợ học phí và sẽ được thông báo theo điều kiện tham gia hoạt động liên quan.',
    ],
  },
  {
    q: 'Tôi chưa giỏi AI hoặc không biết lập trình có tham gia được không?',
    a: [
      'Có. Chương trình có bốn hướng chuyên môn gồm Kinh doanh, Công nghệ, Phát triển đối tác và Vận hành.',
      'Bạn có thể lựa chọn thử thách phù hợp với thế mạnh, kinh nghiệm và định hướng của bản thân.',
    ],
  },
  {
    q: 'Tôi có được sử dụng AI để làm bài không?',
    a: ['Có. Bạn được sử dụng AI hỗ trợ nghiên cứu, thiết kế và xây dựng sản phẩm, nhưng phải hiểu, kiểm chứng và chịu trách nhiệm với kết quả của mình.'],
  },
  {
    q: 'Tôi cần dành bao nhiêu thời gian tham gia?',
    list: [
      ['THINK', 'Khoảng 35–45 phút.'],
      ['BUILD', 'Chủ động sắp xếp thời gian để hoàn thành thử thách đúng hạn.'],
      ['LEVEL 2', 'Dự kiến dành 5–8 giờ/tuần cho học tập và dự án, tùy lịch chính thức.'],
      ['THỰC CHIẾN', 'Thời gian và trách nhiệm được thống nhất riêng trước khi bắt đầu.'],
    ],
    a: ['GO4AI đánh giá cao chất lượng thực thi, sự chủ động và khả năng thực hiện cam kết.'],
  },
  {
    q: 'Hoàn thành chương trình có chắc chắn được tuyển dụng không?',
    a: [
      'Không. Kết quả chương trình là cơ sở để GO4AI xem xét năng lực và các cơ hội hợp tác phù hợp.',
      'Những định hướng như Venture Owner hoặc Core Team phụ thuộc vào kết quả thực tế và thỏa thuận riêng giữa các bên.',
    ],
  },
];

export const formOptions = {
  segment: [
    ['student', 'Sinh viên'],
    ['employee', 'Người đi làm'],
    ['founder', 'Từng khởi nghiệp'],
    ['other', 'Khác'],
  ],
  strength: [
    ['business', 'Kinh doanh', 'Business'],
    ['technology', 'Công nghệ', 'Technology'],
    ['ecosystem', 'Phát triển đối tác', 'Ecosystem'],
    ['operations', 'Vận hành', 'Operations'],
  ],
  mode: [
    ['online', 'Online'],
    ['offline', 'Offline'],
    ['hybrid', 'Hybrid'],
  ],
};
