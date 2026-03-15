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
          <a href="#events" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Events</a>
          <a href="#founder" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Founder</a>
          <a href="#impact" className="navbar__link" onClick={() => setIsMenuOpen(false)}>Impact</a>
          <a href="#events" className="btn-primary btn-sm" onClick={() => setIsMenuOpen(false)}>
            Book Your Seat
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
// HERO — Johannesburg Mastermind
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
          Power Woman Africa · VIP Mastermind
        </p>
        <h1 className={`h1-display hero__heading ${loaded ? 'loaded' : ''}`}>
          The Leadership Mastermind Experience
        </h1>
        <div className={`hero__divider ${loaded ? 'loaded' : ''}`} />
        <p className={`body-lg hero__subheading ${loaded ? 'loaded' : ''}`}>
          A Private Strategic Room for Women Building What Comes Next
        </p>
        <p className={`hero__tagline ${loaded ? 'loaded' : ''}`}>
          Real Mastery · Peer Exchange · Strategic Collaboration
        </p>
        <div className={`hero__meta ${loaded ? 'loaded' : ''}`}>
          <span className="hero__meta-item">Saturday 21 March 2026</span>
          <span className="hero__meta-dot">·</span>
          <span className="hero__meta-item">Fairlawns · Morningside · Johannesburg</span>
        </div>
        <div className={`hero__meta hero__meta--secondary ${loaded ? 'loaded' : ''}`}>
          <span className="hero__meta-item">10:00AM – 3:00PM</span>
          <span className="hero__meta-dot">·</span>
          <span className="hero__meta-item">25 Spots · 5 VIP Only</span>
          <span className="hero__meta-dot">·</span>
          <span className="hero__meta-item">$275 – $550</span>
        </div>
        <p className={`hero__application-note ${loaded ? 'loaded' : ''}`}>
          By Registration
        </p>
        <div className={`hero__cta ${loaded ? 'loaded' : ''}`}>
          <a href="#events" className="btn-primary">
            Book Your Seat
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
      desc: 'A carefully selected group of 15 women who are either operating at scale or preparing for it.',
    },
    {
      icon: '✦',
      title: 'Real Mastery',
      desc: 'Practical frameworks that translate lived leadership experience into transferable intelligence.',
    },
    {
      icon: '✦',
      title: 'Peer Exchange',
      desc: 'Conversations led by institutional leaders on governance, decision-making, and long-term leadership.',
    },
    {
      icon: '✦',
      title: 'Strategic Collaboration',
      desc: 'Exchange across sectors, markets, and borders—from succession-ready executives to founders scaling their impact.',
    },
  ]

  return (
    <section className="experience" id="experience">
      <div className="container">
        <div ref={ref} className={`experience__header animate-fade-up ${isVisible ? 'is-visible' : ''}`}>
          <p className="overline experience__overline">The Experience</p>
          <h2 className="h2 experience__title">One Room. Real Mastery.</h2>
          <p className="body-lg experience__intro">
            A private, in-person leadership mastermind for women building influence, shaping institutions, and thinking beyond individual success toward long-term impact. Across sectors, markets, and borders.
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
// WHAT YOU'LL LEAVE WITH (Outcomes)
// ==========================================================================
function OutcomesSection() {
  const { ref, isVisible } = useIntersectionObserver()

  const outcomes = [
    'A sharper leadership lens — refined through real peer exchange, not theory.',
    'At least one strategic relationship that shifts how you think about your next move.',
    'A personal framework for scaling your influence without sacrificing your well-being.',
    'Clarity on the wealth architecture that matches your ambition and season.',
    'The exhale. For the woman who just needs to be in the right room.',
  ]

  return (
    <section className="outcomes" id="outcomes">
      <div className="container">
        <div ref={ref} className={`outcomes__wrapper animate-fade-up ${isVisible ? 'is-visible' : ''}`}>
          <p className="overline outcomes__overline">What You Leave With</p>
          <h2 className="h2 outcomes__title">This is what the room is designed to give you.</h2>
          <ul className="outcomes__list">
            {outcomes.map((item, i) => (
              <li key={i} className={`outcomes__item animate-fade-up stagger-${i + 1} ${isVisible ? 'is-visible' : ''}`}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ==========================================================================
// TESTIMONIALS — Lagos Mastermind
// ==========================================================================
function TestimonialsSection() {
  const { ref, isVisible } = useIntersectionObserver()

  const testimonials = [
    {
      quote: 'These are the kinds of rooms you pay for — but still end up thanking the convener for the privilege of being in the room. Real women, real stories, real power. No pretence. Just depth, courage, wisdom.',
      name: '@funtoibuoye',
      context: 'Lagos 2026',
    },
    {
      quote: 'One of my best investments in myself this year. I have grown. I have been stretched. And I have connected in ways I\'ve never experienced before in a group setting. This room pushed me to move now.',
      name: '@tmospeaks',
      context: 'Lagos 2026',
    },
    {
      quote: 'This is not just beautiful but exactly what I need to fully understand where I am and where I am headed. Thank you for seeing me.',
      name: 'Dr. Ibiene Ogolo',
      context: 'Lagos 2026',
    },
  ]

  return (
    <section className="testimonials">
      <div className="container">
        <div ref={ref} className={`testimonials__wrapper animate-fade-up ${isVisible ? 'is-visible' : ''}`}>
          <p className="overline testimonials__overline">From the Room</p>
          <h2 className="h2 testimonials__title">What Women Are Saying</h2>
          <div className="testimonials__grid">
            {testimonials.map((t, i) => (
              <div key={i} className={`testimonials__card animate-fade-up stagger-${i + 1} ${isVisible ? 'is-visible' : ''}`} style={{display: 'flex', flexDirection: 'column'}}>
                <p className="testimonials__quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonials__attr" style={{marginTop: 'auto'}}>
                  <span className="testimonials__name">{t.name}</span>
                  <span className="testimonials__context">{t.context}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonials__cta">
            <a href="#events" className="btn-primary">
              View Event Details
            </a>
          </div>
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
            Anchored by the Power Woman Playbook — a leadership blueprint designed by Udo Okonjo — this mastermind is built for depth, not performance. Every session translates lived leadership experience into shared mastery.
          </p>
          <p className="curators__text">
            In a curated room of just 15 women, you will move through frameworks designed to sharpen how you lead, build, and own.
          </p>
          <ul className="curators__list">
            <li className={`curators__list-item animate-fade-up stagger-1 ${isVisible ? 'is-visible' : ''}`}>High Impact Leadership Mastery</li>
            <li className={`curators__list-item animate-fade-up stagger-2 ${isVisible ? 'is-visible' : ''}`}>Wealth by Design Mastery</li>
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
            Power Woman Africa is built on more than a decade of sustained and measurable impact in women&apos;s leadership development across Africa and the diaspora.
          </p>
          <p className="legacy__text">
            For over fifteen years, the platform formerly known as Inspired Women of Worth served as one of Africa&apos;s most consistent and respected ecosystems for developing women leaders across business, corporate institutions, the public sector, and civil society.
          </p>
          <p className="legacy__text">
            After impacting thousands of women, a clear gap emerged: many accomplished women have achieved success but lack the frameworks, networks, and strategic thinking required to scale influence. Power Woman Africa is the response to that gap.
          </p>
          <div className="legacy__evolution">
            <div className="legacy__evo-item">
              <div className="legacy__evo-label">Then</div>
              <div className="legacy__evo-text">Foundational Capacity Building</div>
            </div>
            <div className="legacy__evo-arrow">&rarr;</div>
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
// EVENTS SECTION — Tabbed slider
// ==========================================================================
function EventsSection() {
  const { ref, isVisible } = useIntersectionObserver()
  const [activeEvent, setActiveEvent] = useState(0)

  const events: Array<{
    id: string;
    label: string;
    badge: string;
    title: string;
    date: string;
    location: string;
    time: string;
    spots: string | null;
    price: string | null;
    desc: string;
    cta: { text: string; href: string } | null;
  }> = [
    {
      id: 'johannesburg',
      label: 'Johannesburg 2026',
      badge: 'Upcoming',
      title: 'The Leadership Mastermind Experience — Johannesburg',
      date: 'Saturday 21 March 2026',
      location: 'Fairlawns · Morningside · Johannesburg',
      time: '10:00AM – 3:00PM',
      spots: '25 Spots · 5 VIP Only',
      price: '$275 – $550',
      desc: 'A Private Strategic Room for Women Building What Comes Next. You will leave with clarity on your leadership brand, your personal Wealth Blueprint, your bold next move, and a 90-Day Action Plan. You become part of the Power Woman Africa Circle — a cross-border community committed to peer-to-peer exchange and accountability that doesn\'t end when the room closes.',
      cta: null,
    },
    {
      id: 'lagos',
      label: 'Lagos 2026',
      badge: 'Completed',
      title: 'The Leadership Mastermind Experience — Lagos',
      date: 'March 12 – 13, 2026',
      location: 'Ikoyi, Lagos, Nigeria',
      time: 'Two-Day Mastermind',
      spots: null,
      price: null,
      desc: 'The inaugural Power Woman Africa Leadership Mastermind brought together accomplished women leaders for two transformative days of wealth strategy, leadership mastery, and intentional living. A curated room for women operating at scale or preparing for it.',
      cta: null,
    },
  ]

  const current = events[activeEvent]

  return (
    <section className="events-section" id="events">
      <div className="container">
        <div ref={ref} className={`events__wrapper animate-fade-up ${isVisible ? 'is-visible' : ''}`}>
          <p className="overline events__overline">Events</p>
          <h2 className="h2 events__title">Power Woman Africa Masterminds</h2>

          {/* Tab buttons */}
          <div className="events__tabs">
            {events.map((evt, i) => (
              <button
                key={evt.id}
                className={`events__tab ${activeEvent === i ? 'events__tab--active' : ''}`}
                onClick={() => setActiveEvent(i)}
              >
                {evt.label}
                <span className={`events__tab-badge ${evt.badge === 'Upcoming' ? 'events__tab-badge--upcoming' : 'events__tab-badge--completed'}`}>
                  {evt.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Event card */}
          <div className="events__card" key={current.id}>
            <div className="events__card-header">
              <h3 className="h3 events__card-title">{current.title}</h3>
              {current.badge === 'Upcoming' && (
                <span className="events__card-badge">Upcoming</span>
              )}
            </div>

            <div className="events__card-meta">
              <div className="events__card-meta-row">
                <span className="events__card-meta-label">Date</span>
                <span>{current.date}</span>
              </div>
              <div className="events__card-meta-row">
                <span className="events__card-meta-label">Location</span>
                <span>{current.location}</span>
              </div>
              <div className="events__card-meta-row">
                <span className="events__card-meta-label">Format</span>
                <span>{current.time}</span>
              </div>
              {current.spots && (
                <div className="events__card-meta-row">
                  <span className="events__card-meta-label">Availability</span>
                  <span>{current.spots} &middot; {current.price}</span>
                </div>
              )}
            </div>

            <p className="events__card-desc">{current.desc}</p>

            {current.id === 'johannesburg' ? (
              <div className="events__detailed-content">
                <p className="events__vip-note" style={{marginTop: '1.5rem', marginBottom: '1.5rem', fontStyle: 'italic'}}>
                  VIP tickets include a private 1-hour LifeBoard Strategy Session with Udo Okonjo — your personalised 10-year architecture, one on one.
                </p>
                
                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                  <a href="https://buy.stripe.com/4gM00j8p639gco48ZRaEE3n" className="btn-primary" style={{flex: '1 1 200px'}} target="_blank" rel="noopener noreferrer">
                    Book Mastermind $275
                  </a>
                  <a href="https://buy.stripe.com/4gMaEXbBi6lsbk0cc3aEE3l" className="btn-primary" style={{flex: '1 1 200px'}} target="_blank" rel="noopener noreferrer">
                    Book VIP Access $550
                  </a>
                </div>
              </div>
            ) : current.cta ? (
              <a href={current.cta.href} className="btn-primary" target="_blank" rel="noopener noreferrer">
                {current.cta.text}
              </a>
            ) : (
              <span className="events__card-completed">
                Event completed &mdash; media and recap coming soon.
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ==========================================================================
// EVENT SUMMARY / CTA — Johannesburg
// ==========================================================================
function EventSummarySection() {
  const { ref, isVisible } = useIntersectionObserver()

  return (
    <section className="event-summary">
      <div className="container">
        <div ref={ref} className={`event-summary__inner animate-fade-up ${isVisible ? 'is-visible' : ''}`}>
          <p className="event-summary__tagline">Women. Wealth. Legacy.</p>
          <p className="event-summary__date">Saturday 21 March 2026</p>
          <p className="event-summary__location">Fairlawns &middot; Morningside &middot; Johannesburg</p>
          <p className="event-summary__pillars-text">
            Real Mastery &nbsp;&middot;&nbsp; Peer Exchange &nbsp;&middot;&nbsp; Strategic Collaboration
          </p>
          <p className="event-summary__invitation">By registration. 25 spots · 5 VIP only. $275 – $550.</p>
          <p className="event-summary__desc">
            A Private Strategic Room for Women Building What Comes Next
          </p>
          <a href="#events" className="btn-primary">
            Book Your Seat
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
            <a href="#events" className="footer__link">Events</a>
            <a href="#founder" className="footer__link">Founder</a>
            <a href="#impact" className="footer__link">Impact</a>
          </div>
          <div>
            <h6 className="footer__nav-heading">Connect</h6>
            <a href="mailto:echidinma@fineandcountry.ng" className="footer__link">Email Us</a>
            <a href="https://udookonjo.com" className="footer__link" target="_blank" rel="noopener noreferrer">Udo Okonjo</a>
            <a href="#events" className="footer__link">Book Your Seat</a>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copyright">&copy; 2026 Power Woman Africa. All rights reserved.</p>
          <a href="mailto:echidinma@fineandcountry.ng" className="footer__email">echidinma@fineandcountry.ng</a>
        </div>
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
        <OutcomesSection />
        <TestimonialsSection />
        <MastermindSection />
        <FounderSection />
        <ImpactSection />
        <LegacySection />
        <EventsSection />
        <EventSummarySection />
      </main>
      <Footer />
    </>
  )
}
