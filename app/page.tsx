'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

// ==========================================================================
// HOOKS
// ==========================================================================
function useIntersectionObserver(options: { threshold?: number } = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (currentRef) observer.unobserve(currentRef)
        }
      },
      { threshold: options.threshold ?? 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    if (currentRef) observer.observe(currentRef)
    return () => { if (currentRef) observer.unobserve(currentRef) }
  }, [options.threshold])

  return { ref, isVisible }
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress((window.scrollY / total) * 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return progress
}

function AnimatedCounter({ end, suffix, delay = 0 }: { end: number; suffix: string; delay?: number }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const timeout = setTimeout(() => {
      const duration = 2000
      const startTime = performance.now()
      const animate = (t: number) => {
        const p = Math.min((t - startTime) / duration, 1)
        const ease = 1 - Math.pow(1 - p, 4)
        setCount(Math.floor(ease * end))
        if (p < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, delay)
    return () => clearTimeout(timeout)
  }, [started, end, delay])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ==========================================================================
// SCROLL PROGRESS
// ==========================================================================
function ScrollProgress() {
  const progress = useScrollProgress()
  return <div className="scroll-progress" style={{ width: `${progress}%` }} />
}

// ==========================================================================
// NAVBAR
// ==========================================================================
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar__wrapper">
        <a href="#" className="navbar__logo">Power Woman Africa</a>
        <div className={`navbar__menu ${isMenuOpen ? 'is-open' : ''}`}>
          <a href="#experience" className="navbar__link" onClick={() => setIsMenuOpen(false)}>The Experience</a>
          <a href="#mastermind" className="navbar__link" onClick={() => setIsMenuOpen(false)}>The Mastermind</a>
          <a href="#founder" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Founder</a>
          <a href="#impact" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Impact</a>
          <a href="https://form.jotform.com/241352147735051" className="btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
            Request an Invitation
          </a>
        </div>
        <div
          className={`navbar__hamburger ${isMenuOpen ? 'is-active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  )
}

// ==========================================================================
// HERO
// ==========================================================================
function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="hero">
      <div className="hero__content">
        <div className={`hero__diamonds ${loaded ? 'loaded' : ''}`}>
          <span className="hero__diamond">✦</span>
          <span className="hero__diamond">✦</span>
          <span className="hero__diamond">✦</span>
        </div>
        <p className={`overline hero__overline ${loaded ? 'loaded' : ''}`}>
          The Leadership Mastermind Experience
        </p>
        <h1 className={`h1-display hero__heading ${loaded ? 'loaded' : ''}`}>
          Where Accomplished African Women Prepare for Their Next Scale
        </h1>
        <div className={`hero__divider ${loaded ? 'loaded' : ''}`} />
        <p className={`body-lg hero__subheading ${loaded ? 'loaded' : ''}`}>
          An invitation-led leadership mastermind for African women operating at scale or preparing for it.
        </p>
        <p className={`hero__tagline ${loaded ? 'loaded' : ''}`}>
          Women. Wealth. Legacy.
        </p>
        <div className={`hero__meta ${loaded ? 'loaded' : ''}`}>
          <span className="hero__meta-item">March 12–13, 2026</span>
          <span className="hero__meta-dot">·</span>
          <span className="hero__meta-item">Ikoyi, Lagos, Nigeria</span>
        </div>
        <div className={`hero__cta ${loaded ? 'loaded' : ''}`}>
          <a href="https://form.jotform.com/241352147735051" className="btn-primary" target="_blank" rel="noopener noreferrer">
            Request an Invitation
          </a>
        </div>
      </div>
    </section>
  )
}

// ==========================================================================
// TAGLINE BANNER
// ==========================================================================
function TaglineBanner() {
  return (
    <div className="tagline-banner">
      <p className="tagline-banner__text">This is not a conference. It is a mastermind.</p>
    </div>
  )
}

// ==========================================================================
// THE EXPERIENCE
// ==========================================================================
function ExperienceSection() {
  const { ref, isVisible } = useIntersectionObserver()

  const items = [
    {
      icon: '✦',
      title: 'Curated Circle',
      desc: 'A carefully selected group of women who are either operating at scale or preparing for it.',
    },
    {
      icon: '✦',
      title: 'Global Town Halls',
      desc: 'Conversations led by institutional leaders on governance, decision-making, and long-term leadership.',
    },
    {
      icon: '✦',
      title: 'Live Mastermind Sessions',
      desc: 'Practical frameworks that translate leadership experience into transferable intelligence.',
    },
    {
      icon: '✦',
      title: 'Intergenerational Dialogue',
      desc: 'Exchange across leadership stages—from succession-ready executives to founders scaling their impact.',
    },
  ]

  return (
    <section className="experience" id="experience">
      <div className="container">
        <div ref={ref} className={`experience__header animate-fade-up ${isVisible ? 'is-visible' : ''}`}>
          <p className="overline experience__overline">The Experience</p>
          <h2 className="h2 experience__title">Two Days. One Room. Real Mastery.</h2>
          <p className="body-lg experience__intro">
            A two-day in-person leadership mastermind for women building influence, shaping institutions, and thinking beyond individual success toward long-term impact.
          </p>
        </div>
        <div className="experience__grid">
          {items.map((item, i) => (
            <div key={i} className={`experience__card animate-fade-up stagger-${i + 1} ${isVisible ? 'is-visible' : ''}`}>
              <div className="experience__card-icon">{item.icon}</div>
              <h4 className="experience__card-title">{item.title}</h4>
              <p className="experience__card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==========================================================================
// THE MASTERMIND
// ==========================================================================
function MastermindSection() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="curators" id="mastermind">
      <div className="container">
        <div ref={ref} className={`curators__inner animate-fade-up ${isVisible ? 'is-visible' : ''}`}>
          <p className="overline curators__overline">The Mastermind</p>
          <h2 className="h2 curators__title">The Power Woman Playbook</h2>
          <p className="curators__text">
            Anchored by the Power Woman Playbook—a leadership blueprint designed by Udo Okonjo—this mastermind is built for depth, not performance. Every session translates lived leadership experience into shared mastery.
          </p>
          <p className="curators__text">
            Across two days, you will move through frameworks designed to sharpen how you lead, build, and own:
          </p>
          <ul className="curators__list">
            <li className={`curators__list-item animate-fade-up stagger-1 ${isVisible ? 'is-visible' : ''}`}>Day 1 · High Impact Leadership Mastery</li>
            <li className={`curators__list-item animate-fade-up stagger-2 ${isVisible ? 'is-visible' : ''}`}>Day 2 · Wealth by Design™ Mastery</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

// ==========================================================================
// FOUNDER
// ==========================================================================
function FounderSection() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="founder" id="founder">
      <div className="container">
        <div ref={ref} className={`founder__wrapper animate-fade-up ${isVisible ? 'is-visible' : ''}`}>
          <div className="founder__image-frame">
            <Image
              src="/udo-okonjo.jpg"
              alt="Udo Okonjo — Founder and Convener, Power Woman Africa"
              fill
              style={{ objectFit: 'cover', objectPosition: '35% top' }}
              priority
            />
          </div>
          <div className="founder__content">
            <p className="overline founder__overline">Founder & Convener</p>
            <h2 className="founder__name">Udo Okonjo</h2>
            <p className="founder__role">Chief Igniter · Chair, Fine & Country WA · Certified Berkeley Executive Coach</p>
            <p className="founder__text">
              Udo Okonjo is the founder and convener of Power Woman Africa. A lawyer, executive coach, investor, and Chief Executive Officer of Fine and Country West Africa, she has spent more than two decades building leadership and wealth ecosystems for women across Africa and the diaspora.
            </p>
            <p className="founder__text">
              Power Woman Africa represents the culmination of her work across leadership development, capital formation, and legacy building. Her work continues to shape how accomplished African women think about influence, scale, ownership, and long-term impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ==========================================================================
// VIP EARLY ACCESS
// ==========================================================================
function VIPSection() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="vip">
      <div className="container">
        <div ref={ref} className={`vip__wrapper animate-fade-up ${isVisible ? 'is-visible' : ''}`}>
          <p className="overline vip__overline">VIP Early Access</p>
          <h2 className="h2 vip__title">The Right Room Changes Everything</h2>
          <p className="vip__text">
            This mastermind is built around real mastery, strategic exchange, and serious collaboration across sectors, markets, and geographies.
          </p>
          <ul className="vip__includes">
            <li>Priority participation in all mastermind sessions</li>
            <li>Curated peer-level conversations</li>
            <li>Private VIP experiences designed to deepen connection beyond the room</li>
          </ul>
          <p className="vip__note">
            No urgency. No pressure. Just an intentional invitation to the right room.
          </p>
          <div className="vip__cta">
            <a href="https://form.jotform.com/241352147735051" className="btn-primary" target="_blank" rel="noopener noreferrer">
              Confirm Your VIP Access Pass
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ==========================================================================
// IMPACT STATS
// ==========================================================================
function ImpactSection() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="impact" id="impact">
      <div className="container">
        <div ref={ref}>
          <div className={`impact__header animate-fade-up ${isVisible ? 'is-visible' : ''}`}>
            <p className="overline impact__overline">Proven Foundation</p>
            <h2 className="h2 impact__title">Over a Decade of Measurable Impact</h2>
          </div>
          <div className="impact__grid">
            <div className={`impact__stat animate-fade-up stagger-1 ${isVisible ? 'is-visible' : ''}`}>
              <div className="impact__stat-number">
                <AnimatedCounter end={3500} suffix="+" />
              </div>
              <div className="impact__stat-label">Women trained and impacted across Africa and the diaspora</div>
            </div>
            <div className={`impact__stat animate-fade-up stagger-2 ${isVisible ? 'is-visible' : ''}`}>
              <div className="impact__stat-number">
                <AnimatedCounter end={1000} suffix="+" delay={200} />
              </div>
              <div className="impact__stat-label">Alumnae active across senior leadership and entrepreneurship</div>
            </div>
            <div className={`impact__stat animate-fade-up stagger-3 ${isVisible ? 'is-visible' : ''}`}>
              <div className="impact__stat-number">
                <AnimatedCounter end={100} suffix="+" delay={400} />
              </div>
              <div className="impact__stat-label">Corporate, institutional, and ecosystem partnerships</div>
            </div>
            <div className={`impact__stat animate-fade-up stagger-4 ${isVisible ? 'is-visible' : ''}`}>
              <div className="impact__stat-number">
                <AnimatedCounter end={15} suffix="+" delay={600} />
              </div>
              <div className="impact__stat-label">Years of sustained women's leadership development</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ==========================================================================
// LEGACY / ABOUT
// ==========================================================================
function LegacySection() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="legacy">
      <div className="container">
        <div ref={ref} className={`legacy__wrapper animate-fade-up ${isVisible ? 'is-visible' : ''}`}>
          <p className="overline legacy__overline">About Power Woman Africa</p>
          <h2 className="h2 legacy__title">Proven Foundation. Elevated Platform.</h2>
          <p className="legacy__text">
            Power Woman Africa is built on more than a decade of sustained and measurable impact in women's leadership development across Africa and the diaspora.
          </p>
          <p className="legacy__text">
            For over fifteen years, the platform formerly known as Inspired Women of Worth served as one of Africa's most consistent and respected ecosystems for developing women leaders across business, corporate institutions, the public sector, and civil society.
          </p>
          <p className="legacy__text">
            After impacting thousands of women, a clear gap emerged: many accomplished women have achieved success but lack the frameworks, networks, and strategic thinking required to scale influence. Power Woman Africa is the response to that gap.
          </p>
          <div className="legacy__evolution">
            <div className="legacy__evo-item">
              <div className="legacy__evo-label">Then</div>
              <div className="legacy__evo-text">Foundational Capacity Building</div>
            </div>
            <div className="legacy__evo-arrow">→</div>
            <div className="legacy__evo-item">
              <div className="legacy__evo-label">Now</div>
              <div className="legacy__evo-text">Mastery, Scale & Ownership</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ==========================================================================
// EVENT SUMMARY / CTA
// ==========================================================================
function EventSummarySection() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="event-summary">
      <div className="container">
        <div ref={ref} className={`event-summary__inner animate-fade-up ${isVisible ? 'is-visible' : ''}`}>
          <p className="event-summary__tagline">Women. Wealth. Legacy.</p>
          <p className="event-summary__date">March 12–13, 2026</p>
          <p className="event-summary__location">Ikoyi, Lagos, Nigeria</p>
          <p className="event-summary__pillars-text">
            Real Mastery &nbsp;·&nbsp; Peer Exchange &nbsp;·&nbsp; Strategic Collaboration
          </p>
          <p className="event-summary__invitation">By invitation.</p>
          <p className="event-summary__desc">
            A curated room for women operating at scale or preparing for it.
          </p>
          <a href="https://form.jotform.com/241352147735051" className="btn-primary" target="_blank" rel="noopener noreferrer">
            Request an Invitation
          </a>
        </div>
      </div>
    </section>
  )
}

// ==========================================================================
// FOOTER
// ==========================================================================
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#" className="footer__logo">Power Woman Africa</a>
            <p className="footer__tagline">
              Where leadership, wealth, and legacy converge.
            </p>
          </div>
          <div>
            <h6 className="footer__nav-heading">Navigate</h6>
            <a href="#experience" className="footer__link">The Experience</a>
            <a href="#mastermind" className="footer__link">The Mastermind</a>
            <a href="#founder" className="footer__link">Founder</a>
            <a href="#impact" className="footer__link">Impact</a>
          </div>
          <div>
            <h6 className="footer__nav-heading">Connect</h6>
            <a href="mailto:info@powerwomanafrica.com" className="footer__link">Email Us</a>
            <a href="https://udookonjo.com" className="footer__link" target="_blank" rel="noopener noreferrer">Udo Okonjo</a>
            <a href="https://form.jotform.com/241352147735051" className="footer__link" target="_blank" rel="noopener noreferrer">Request Invitation</a>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copyright">© 2026 Power Woman Africa. All rights reserved.</p>
          <a href="mailto:info@powerwomanafrica.com" className="footer__email">info@powerwomanafrica.com</a>
        </div>
      </div>
      <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(245,240,232,0.3)', paddingBottom: '8px' }}>
        10 Onisiwo Street, Off Lateef Jakande, Ikoyi, Lagos, Nigeria
      </div>
    </footer>
  )
}

// ==========================================================================
// MAIN PAGE
// ==========================================================================
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <div className="gold-accent-top" />
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <TaglineBanner />
        <ExperienceSection />
        <MastermindSection />
        <FounderSection />
        <VIPSection />
        <ImpactSection />
        <LegacySection />
        <EventSummarySection />
      </main>
      <Footer />
    </>
  )
}
