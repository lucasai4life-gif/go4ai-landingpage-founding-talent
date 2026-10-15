import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import SplitText from '../components/SplitText.jsx';
import { formOptions } from '../content.js';
import { submitLead } from '../lib/api.js';
import { EASE } from '../lib/motion.js';

const DRAFT_KEY = 'go4ai-ftc26-draft';
const EMPTY = {
  fullName: '', email: '', phone: '', segment: '', segmentOther: '', organization: '',
  strength: '', project: '', motivation: '',
  mode: '', hoursPerWeek: '', acceptTerms: false, acceptPrivacy: false,
  website: '', // honeypot
};

const STEPS = [
  { title: 'Về bạn', fields: ['fullName', 'email', 'phone', 'segment', 'segmentOther', 'organization'] },
  { title: 'Năng lực & động lực', fields: ['strength', 'project', 'motivation'] },
  { title: 'Cam kết & xác nhận', fields: ['mode', 'hoursPerWeek', 'acceptTerms', 'acceptPrivacy'] },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 .-]{8,16}$/;

// Kiểm tra phía trình duyệt khớp với server (server vẫn là nơi quyết định)
function validate(f, fields) {
  const e = {};
  const has = (k) => fields.includes(k);
  if (has('fullName') && (f.fullName.trim().length < 2 || f.fullName.trim().length > 100)) e.fullName = 'Vui lòng nhập họ và tên (2–100 ký tự).';
  if (has('email') && !EMAIL_RE.test(f.email.trim())) e.email = 'Email chưa đúng định dạng.';
  if (has('phone') && f.phone.trim() && !PHONE_RE.test(f.phone.trim())) e.phone = 'Số điện thoại chưa đúng định dạng.';
  if (has('segment') && !f.segment) e.segment = 'Vui lòng chọn nhóm ứng viên.';
  if (has('segmentOther') && f.segment === 'other' && (f.segmentOther.trim().length < 2 || f.segmentOther.trim().length > 100)) {
    e.segmentOther = 'Vui lòng ghi rõ bạn thuộc nhóm nào (2–100 ký tự).';
  }
  if (has('organization') && f.organization.trim().length < 2) e.organization = 'Vui lòng nhập trường học / đơn vị.';
  if (has('strength') && !f.strength) e.strength = 'Vui lòng chọn thế mạnh chuyên môn.';
  if (has('project') && f.project.length > 1000) e.project = 'Tối đa 1000 ký tự.';
  if (has('motivation') && f.motivation.trim().length < 20) e.motivation = 'Chia sẻ ít nhất 20 ký tự về động lực tham gia.';
  if (has('motivation') && f.motivation.length > 1000) e.motivation = 'Tối đa 1000 ký tự.';
  if (has('mode') && !f.mode) e.mode = 'Vui lòng chọn hình thức tham gia.';
  if (has('hoursPerWeek')) {
    const h = Number(f.hoursPerWeek);
    if (!Number.isInteger(h) || h < 1 || h > 80) e.hoursPerWeek = 'Nhập số giờ nguyên từ 1 đến 80.';
  }
  if (has('acceptTerms') && !f.acceptTerms) e.acceptTerms = 'Bạn cần đồng ý với Thể lệ chương trình.';
  if (has('acceptPrivacy') && !f.acceptPrivacy) e.acceptPrivacy = 'Bạn cần đồng ý với Chính sách xử lý dữ liệu cá nhân.';
  return e;
}

/* ---------- Đếm ngược ---------- */

function Digit({ value, label }) {
  const v = String(value).padStart(2, '0');
  return (
    <div className="cd-unit">
      <div className="cd-digits">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={v} initial={{ y: '-100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="cd-label mono">{label}</span>
    </div>
  );
}

function Countdown({ deadline, offsetMs }) {
  const [now, setNow] = useState(() => Date.now() + offsetMs);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now() + offsetMs), 1000);
    return () => clearInterval(t);
  }, [offsetMs]);
  const diff = Math.max(0, new Date(deadline).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return (
    <div className="countdown" role="timer" aria-label={`Còn ${d} ngày ${h} giờ ${m} phút đến hạn đăng ký`}>
      <Digit value={d} label="NGÀY" />
      <span className="cd-sep">:</span>
      <Digit value={h} label="GIỜ" />
      <span className="cd-sep">:</span>
      <Digit value={m} label="PHÚT" />
      <span className="cd-sep">:</span>
      <Digit value={s} label="GIÂY" />
    </div>
  );
}

/* ---------- Trường nhập ---------- */

function Field({ id, label, required, hint, error, children, counter }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="field-label">
        {label} {required && <span className="req">*</span>}
      </label>
      {children}
      <div className="field-foot">
        <AnimatePresence mode="wait" initial={false}>
          {error ? (
            <motion.span key="e" id={`${id}-err`} className="field-error" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {error}
            </motion.span>
          ) : (
            hint && (
              <motion.span key="h" className="field-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {hint}
              </motion.span>
            )
          )}
        </AnimatePresence>
        {counter}
      </div>
    </div>
  );
}

function Choice({ name, options, value, onChange, error, columns = 2 }) {
  return (
    <div className={`choices cols-${columns}`} role="radiogroup" aria-invalid={!!error} aria-describedby={error ? `${name}-err` : undefined}>
      {options.map(([v, label, sub]) => (
        <label key={v} className={`choice ${value === v ? 'is-on' : ''}`}>
          <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} />
          <span className="choice-dot" aria-hidden="true" />
          <span className="choice-text">
            {label}
            {sub && <span className="mono choice-sub"> ({sub})</span>}
          </span>
        </label>
      ))}
    </div>
  );
}

/* ---------- Section ---------- */

export default function Register({ season }) {
  const [form, setForm] = useState(() => {
    try {
      return { ...EMPTY, ...JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}') };
    } catch {
      return EMPTY;
    }
  });
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [banner, setBanner] = useState(null);
  const [done, setDone] = useState(null);
  const formRef = useRef(null);

  const offsetMs = season ? new Date(season.serverTime).getTime() - Date.now() : 0;
  const deadline = season?.registrationClosesAt || '2026-11-30T16:59:59Z';
  const closed = season ? !season.registrationOpen : false;

  useEffect(() => {
    const { website, ...draft } = form;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [form]);

  const source = useMemo(() => {
    const p = new URLSearchParams(window.location.search);
    return ['utm_source', 'utm_medium', 'utm_campaign'].map((k) => p.get(k)).filter(Boolean).join(' / ') || document.referrer || 'direct';
  }, []);

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(({ [k]: _, ...rest }) => rest);
  };
  const onInput = (k) => (e) => set(k)(e.target.type === 'checkbox' ? e.target.checked : e.target.value);

  const focusFirstError = (errs) => {
    requestAnimationFrame(() => {
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
    });
  };

  const goTo = (next) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const nextStep = () => {
    const errs = validate(form, STEPS[step].fields);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    goTo(step + 1);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return nextStep();
    if (sending) return;
    const all = validate(form, STEPS.flatMap((s) => s.fields));
    if (Object.keys(all).length) {
      setErrors(all);
      const s = STEPS.findIndex((st) => st.fields.some((f) => all[f]));
      if (s !== step) goTo(s);
      return focusFirstError(all);
    }
    setSending(true);
    setBanner(null);
    const res = await submitLead({ ...form, hoursPerWeek: Number(form.hoursPerWeek), source });
    setSending(false);
    if (res.ok) {
      localStorage.removeItem(DRAFT_KEY);
      setDone({ code: res.code, createdAt: res.createdAt, name: form.fullName.trim() });
      return;
    }
    setBanner(res.message || 'Không gửi được hồ sơ. Vui lòng thử lại.');
    if (res.errors) {
      setErrors(res.errors);
      const s = STEPS.findIndex((st) => st.fields.some((f) => res.errors[f]));
      if (s >= 0 && s !== step) goTo(s);
      focusFirstError(res.errors);
    }
  };

  const fieldProps = (k) => ({
    id: `f-${k}`,
    name: k,
    value: form[k],
    onChange: onInput(k),
    'aria-invalid': !!errors[k],
    'aria-describedby': errors[k] ? `f-${k}-err` : undefined,
  });

  return (
    <section id="dang-ky" className="section register">
      <div className="register-bg" aria-hidden="true" />
      <div className="container register-grid">
        <div className="register-copy">
          <span className="eyebrow eyebrow-light">Đăng ký ứng viên</span>
          <SplitText as="h2" className="section-title register-title" text="BẠN ĐÃ SẴN SÀNG CHỨNG MINH NĂNG LỰC?" />
          <Reveal as="p" className="register-lead" i={2}>
            Cơ hội phát triển bắt đầu từ quyết định của bạn hôm nay.
          </Reveal>
          <Reveal as="p" className="register-sub" i={3}>
            Hãy tham gia GO4AI Founding Talent Challenge 2026 để thử thách tư duy, phát triển sản phẩm và mở ra cơ hội đồng hành cùng GO4AI.
          </Reveal>
          <Reveal i={4}>
            <span className="mono register-deadline">HẠN ĐĂNG KÝ: 23:59 — 30/11/2026 (GMT+7)</span>
            <Countdown deadline={deadline} offsetMs={offsetMs} />
          </Reveal>
          <Reveal as="ul" className="register-after" i={5}>
            <li><span className="mono">01</span> Gửi hồ sơ đăng ký</li>
            <li><span className="mono">02</span> GO4AI xác nhận &amp; gửi hướng dẫn</li>
            <li><span className="mono">03</span> Mở Vòng 1 — THINK · 02/12/2026</li>
          </Reveal>
        </div>

        <Reveal className="register-panel" amount={0.15}>
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <Success key="done" done={done} />
            ) : closed ? (
              <motion.div key="closed" className="form-closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3>ĐÃ HẾT HẠN ĐĂNG KÝ</h3>
                <p>Mùa tuyển chọn 2026 đã đóng đăng ký. Theo dõi GO4AI để cập nhật mùa tiếp theo.</p>
              </motion.div>
            ) : (
              <motion.form key="form" ref={formRef} className="lead-form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -20 }}>
                <div className="form-head">
                  <h3 className="form-title">FORM ĐĂNG KÝ ỨNG VIÊN</h3>
                  <p className="form-desc">Mỗi ứng viên chỉ được đăng ký một hồ sơ trong cùng một mùa tuyển chọn.</p>
                </div>

                <ol className="stepper" aria-label="Các bước đăng ký">
                  {STEPS.map((s, i) => (
                    <li key={s.title} className={`stepper-item ${i === step ? 'is-current' : ''} ${i < step ? 'is-done' : ''}`} aria-current={i === step ? 'step' : undefined}>
                      <button type="button" onClick={() => i < step && goTo(i)} disabled={i > step}>
                        <span className="stepper-dot">{i < step ? '✓' : i + 1}</span>
                        <span className="stepper-label">{s.title}</span>
                      </button>
                    </li>
                  ))}
                  <motion.span className="stepper-progress" animate={{ scaleX: step / (STEPS.length - 1) }} transition={{ duration: 0.5, ease: EASE }} aria-hidden="true" />
                </ol>

                {/* Honeypot chống bot */}
                <input type="text" name="website" value={form.website} onChange={onInput('website')} className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                <div className="form-steps">
                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={{
                        enter: (d) => ({ opacity: 0, x: d * 40 }),
                        center: { opacity: 1, x: 0 },
                        exit: (d) => ({ opacity: 0, x: d * -40 }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: EASE }}
                      className="form-step"
                    >
                      {step === 0 && (
                        <>
                          <Field id="f-fullName" label="01. Họ và tên" required error={errors.fullName}>
                            <input className="input" autoComplete="name" placeholder="Nguyễn Văn A" {...fieldProps('fullName')} />
                          </Field>
                          <div className="field-row">
                            <Field id="f-email" label="02. Email" required error={errors.email} hint="Dùng để định danh hồ sơ và nhận thông báo.">
                              <input className="input" type="email" autoComplete="email" placeholder="ban@email.com" {...fieldProps('email')} />
                            </Field>
                            <Field id="f-phone" label="Số điện thoại / Zalo" error={errors.phone} hint="Không bắt buộc.">
                              <input className="input" type="tel" autoComplete="tel" placeholder="09xx xxx xxx" {...fieldProps('phone')} />
                            </Field>
                          </div>
                          <Field id="f-segment" label="03. Bạn thuộc nhóm ứng viên nào?" required error={errors.segment}>
                            <div className="select-wrap">
                              <select className={`input select ${form.segment ? "" : "is-empty"}`} {...fieldProps("segment")}>
                                <option value="" disabled>
                                  — Chọn nhóm ứng viên —
                                </option>
                                {formOptions.segment.map(([v, label]) => (
                                  <option key={v} value={v}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </Field>
                          <AnimatePresence initial={false}>
                            {form.segment === 'other' && (
                              <motion.div
                                key="segment-other"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                style={{ overflow: 'hidden' }}
                              >
                                <Field id="f-segmentOther" label="Bạn thuộc nhóm nào?" required error={errors.segmentOther} hint="Ví dụ: Freelancer, Giảng viên, Học sinh THPT…">
                                  <input className="input" autoFocus maxLength={100} {...fieldProps('segmentOther')} />
                                </Field>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <Field id="f-organization" label="04. Trường học / Đơn vị hiện tại" required error={errors.organization} hint="Nhập tên trường, tổ chức hoặc đơn vị đang học tập/làm việc.">
                            <input className="input" autoComplete="organization" {...fieldProps('organization')} />
                          </Field>
                        </>
                      )}

                      {step === 1 && (
                        <>
                          <Field id="f-strength" label="05. Thế mạnh chuyên môn của bạn là gì?" required error={errors.strength}>
                            <Choice name="strength" options={formOptions.strength} value={form.strength} onChange={set('strength')} error={errors.strength} />
                          </Field>
                          <Field
                            id="f-project"
                            label="06. Bạn đã từng thực hiện dự án hoặc sản phẩm nào đáng chú ý?"
                            error={errors.project}
                            hint="Chia sẻ ngắn gọn dự án, vai trò và kết quả. Có thể kèm link Portfolio. Không bắt buộc."
                            counter={<span className="counter mono">{form.project.length} / 1000</span>}
                          >
                            <textarea className="input textarea" rows={4} maxLength={1000} {...fieldProps('project')} />
                          </Field>
                          <Field
                            id="f-motivation"
                            label="07. Điều gì khiến bạn muốn tham gia GO4AI Founding Talent Challenge?"
                            required
                            error={errors.motivation}
                            hint="Chia sẻ mục tiêu, kỳ vọng hoặc những giá trị bạn mong muốn tạo ra."
                            counter={<span className="counter mono">{form.motivation.length} / 1000</span>}
                          >
                            <textarea className="input textarea" rows={5} maxLength={1000} {...fieldProps('motivation')} />
                          </Field>
                        </>
                      )}

                      {step === 2 && (
                        <>
                          <Field id="f-mode" label="08. Hình thức tham gia phù hợp với bạn?" required error={errors.mode}>
                            <Choice name="mode" options={formOptions.mode} value={form.mode} onChange={set('mode')} error={errors.mode} columns={3} />
                          </Field>
                          <Field id="f-hoursPerWeek" label="09. Bạn có thể cam kết bao nhiêu giờ mỗi tuần?" required error={errors.hoursPerWeek} hint="Số giờ có thể chủ động sắp xếp cho học tập, dự án và hợp tác.">
                            <div className="input-suffix">
                              <input className="input" type="number" inputMode="numeric" min={1} max={80} step={1} {...fieldProps('hoursPerWeek')} />
                              <span className="mono">giờ / tuần</span>
                            </div>
                          </Field>
                          <fieldset className="consents">
                            <legend className="field-label">
                              10. XÁC NHẬN THAM GIA <span className="req">*</span>
                            </legend>
                            <label className={`check ${errors.acceptTerms ? 'has-error' : ''}`}>
                              <input type="checkbox" name="acceptTerms" checked={form.acceptTerms} onChange={onInput('acceptTerms')} />
                              <span className="check-box" aria-hidden="true">✓</span>
                              <span>Tôi đã đọc, hiểu và đồng ý với Thể lệ GO4AI Founding Talent Challenge 2026.</span>
                            </label>
                            {errors.acceptTerms && <span className="field-error" role="alert">{errors.acceptTerms}</span>}
                            <label className={`check ${errors.acceptPrivacy ? 'has-error' : ''}`}>
                              <input type="checkbox" name="acceptPrivacy" checked={form.acceptPrivacy} onChange={onInput('acceptPrivacy')} />
                              <span className="check-box" aria-hidden="true">✓</span>
                              <span>
                                Tôi đã đọc thông tin về xử lý dữ liệu cá nhân và đồng ý với việc xử lý dữ liệu cho các mục đích đăng ký, tổ chức và đánh giá
                                chương trình theo Chính sách xử lý dữ liệu cá nhân được công bố.
                              </span>
                            </label>
                            {errors.acceptPrivacy && <span className="field-error" role="alert">{errors.acceptPrivacy}</span>}
                          </fieldset>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {banner && (
                    <motion.div className="form-banner" role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      {banner}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="form-actions">
                  {step > 0 ? (
                    <button type="button" className="btn btn-ghost" onClick={() => goTo(step - 1)} disabled={sending}>
                      ← Quay lại
                    </button>
                  ) : (
                    <span className="form-note">Các trường có dấu (*) là bắt buộc.</span>
                  )}
                  <button type="submit" className="btn btn-coral btn-lg" disabled={sending} aria-busy={sending}>
                    {sending ? (
                      <>
                        <span className="spinner" aria-hidden="true" /> Đang gửi…
                      </>
                    ) : step < STEPS.length - 1 ? (
                      <>Tiếp tục <span className="btn-arrow" aria-hidden="true">→</span></>
                    ) : (
                      'HOÀN TẤT ĐĂNG KÝ'
                    )}
                  </button>
                </div>
                <p className="form-saved mono">● Nội dung được tự động lưu trên trình duyệt này</p>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

function Success({ done }) {
  const time = new Date(done.createdAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  return (
    <motion.div className="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }} role="status">
      <svg className="success-check" viewBox="0 0 80 80" aria-hidden="true">
        <motion.circle cx="40" cy="40" r="36" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: EASE }} />
        <motion.path d="M24 41 L35 52 L57 29" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.6, ease: EASE }} />
      </svg>
      <h3>ĐĂNG KÝ THÀNH CÔNG!</h3>
      <p>
        Cảm ơn {done.name ? <strong>{done.name}</strong> : 'bạn'} đã đăng ký GO4AI Founding Talent Challenge 2026. Hồ sơ của bạn đã được tiếp nhận.
      </p>
      <dl className="success-meta">
        <div>
          <dt className="mono">MÃ HỒ SƠ</dt>
          <dd className="mono">{done.code}</dd>
        </div>
        <div>
          <dt className="mono">THỜI ĐIỂM</dt>
          <dd>{time}</dd>
        </div>
        <div>
          <dt className="mono">TRẠNG THÁI</dt>
          <dd>Đã đăng ký — Chờ mở Vòng 1</dd>
        </div>
      </dl>
      <p className="success-note">GO4AI sẽ liên hệ qua email để gửi lịch mở Vòng THINK, hướng dẫn và những thông báo tiếp theo.</p>
    </motion.div>
  );
}
