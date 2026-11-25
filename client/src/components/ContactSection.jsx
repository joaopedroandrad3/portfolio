import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Copy,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Send,
  Sparkles,
} from 'lucide-react';
import { PROFILE_CONFIG } from '../config/profile';
import { useLanguage } from '../i18n/LanguageContext';

export default function ContactSection() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const [errorCode, setErrorCode] = useState(null);
  const [fallbackMailto, setFallbackMailto] = useState(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE_CONFIG.socials.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // fallback silencioso
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorCode(null);
    setFallbackMailto(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.ok) {
        setErrorCode(json.error || 'server_error');
        if (json.fallbackMailto) {
          setFallbackMailto(json.fallbackMailto);
        } else {
          const subject = form.subject || `Contato via Portfólio — ${form.name}`;
          const body = `Nome: ${form.name}\nE-mail: ${form.email}\n\n${form.message}`;
          setFallbackMailto(
            `mailto:${PROFILE_CONFIG.socials.email}?subject=${encodeURIComponent(
              subject
            )}&body=${encodeURIComponent(body)}`
          );
        }
        setStatus('error');
        return;
      }

      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setErrorCode('server_error');
      const subject = form.subject || `Contato via Portfólio — ${form.name}`;
      const body = `Nome: ${form.name}\nE-mail: ${form.email}\n\n${form.message}`;
      setFallbackMailto(
        `mailto:${PROFILE_CONFIG.socials.email}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`
      );
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative z-10 pt-24 pb-12 lg:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Lado Esquerdo: Canais Profissionais */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <span className="inline-block border border-white/15 px-3 py-1 font-mono text-[10px] tracking-[0.26em] text-amethyst-300 uppercase">
                {t.contact.sector}
              </span>
              <h2 className="mt-5 font-serif text-4xl font-light leading-tight text-white sm:text-5xl">
                {t.contact.titleStart}{' '}
                <span className="italic text-amethyst-300">{t.contact.titleItalic}</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-mist sm:text-base">
                {t.contact.subtitle}
              </p>

              {/* E-mail Profissional com Cópia Rápida */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="glass-panel-hover glass-panel group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left"
                >
                  <div>
                    <span className="block font-mono text-[10px] tracking-[0.2em] text-amethyst-300 uppercase">
                      {t.contact.directEmailLabel}
                    </span>
                    <span className="mt-1 block text-sm font-medium text-white">
                      {PROFILE_CONFIG.socials.email}
                    </span>
                  </div>
                  <span className="glass-pill-idle flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[11px] text-white">
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-amethyst-300" />
                        {t.contact.copied}
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-mist" />
                        {t.contact.copyEmail}
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Apenas perfis relevantes para recrutamento */}
            <div className="mt-10">
              <span className="block font-mono text-[10px] tracking-[0.24em] text-mist uppercase">
                {t.contact.directChannels}
              </span>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {[
                  { label: 'LinkedIn', href: PROFILE_CONFIG.socials.linkedin, icon: Linkedin },
                  { label: 'GitHub', href: PROFILE_CONFIG.socials.github, icon: Github },
                  { label: 'Email', href: `mailto:${PROFILE_CONFIG.socials.email}`, icon: Mail },
                ].map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    className="glass-pill-idle inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs text-white/90"
                  >
                    <Icon className="h-4 w-4 text-amethyst-300" />
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Lado Direito: Formulário com Entrega Real por E-mail */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel rounded-3xl p-6 sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-medium text-white">{t.contact.formTitle}</h3>
                  <p className="mt-0.5 font-mono text-[11px] text-mist">{t.contact.formSub}</p>
                </div>
                <Sparkles className="h-5 w-5 text-amethyst-400" />
              </div>

              {status === 'sent' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amethyst-400/50 bg-amethyst-600/20 text-amethyst-300 shadow-violetGlow">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="mt-5 font-serif text-2xl text-white">
                    {t.contact.successTitle}
                  </h4>
                  <p className="mx-auto mt-2 max-w-md text-sm text-mist">
                    {t.contact.successBody}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="glass-pill-idle mt-6 rounded-full px-6 py-2.5 text-xs font-medium text-white"
                  >
                    {t.contact.sendAnother}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] text-mist uppercase">
                        {t.contact.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t.contact.namePlaceholder}
                        className="w-full rounded-xl border border-white/12 bg-black/55 px-4 py-3 text-sm text-white placeholder:text-mist/50 focus:border-amethyst-400/65 focus:outline-none focus:ring-1 focus:ring-amethyst-400/40"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-mono text-[11px] text-mist uppercase">
                        {t.contact.emailLabel}
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder={t.contact.emailPlaceholder}
                        className="w-full rounded-xl border border-white/12 bg-black/55 px-4 py-3 text-sm text-white placeholder:text-mist/50 focus:border-amethyst-400/65 focus:outline-none focus:ring-1 focus:ring-amethyst-400/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] text-mist uppercase">
                      {t.contact.subjectLabel}
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder={t.contact.subjectPlaceholder}
                      className="w-full rounded-xl border border-white/12 bg-black/55 px-4 py-3 text-sm text-white placeholder:text-mist/50 focus:border-amethyst-400/65 focus:outline-none focus:ring-1 focus:ring-amethyst-400/40"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] text-mist uppercase">
                      {t.contact.messageLabel}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t.contact.messagePlaceholder}
                      className="w-full resize-none rounded-xl border border-white/12 bg-black/55 px-4 py-3 text-sm text-white placeholder:text-mist/50 focus:border-amethyst-400/65 focus:outline-none focus:ring-1 focus:ring-amethyst-400/40"
                    />
                  </div>

                  {status === 'error' && errorCode && (
                    <div className="space-y-3 rounded-xl border border-amethyst-400/40 bg-amethyst-700/20 px-4 py-3 text-xs text-amethyst-200">
                      <p>{t.contact.errors[errorCode] || t.contact.errors.server_error}</p>
                      {fallbackMailto && (
                        <a
                          href={fallbackMailto}
                          className="inline-flex items-center gap-1.5 rounded-full border border-amethyst-300/40 bg-black/40 px-3.5 py-1.5 font-mono text-[11px] text-white transition hover:border-amethyst-300"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-amethyst-300" />
                          {t.contact.fallbackMailtoCta}
                        </a>
                      )}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="glass-pill-active inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60 sm:w-auto"
                    >
                      <Send className="h-4 w-4" />
                      {status === 'sending' ? t.contact.sending : t.contact.submit}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        <footer className="mt-20 border border-white/12 bg-black/45 px-6 py-4 backdrop-blur-md">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <span className="font-mono text-[11px] text-mist">
              {PROFILE_CONFIG.socials.email}
            </span>
            <span className="rounded-full bg-white px-4 py-1 font-mono text-[10px] font-semibold tracking-[0.2em] text-black uppercase">
              JP.ANDRADE
            </span>
            <span className="text-xs text-mist">{t.contact.footerCredit}</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
