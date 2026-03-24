import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import './Preloader.css';

const MESSAGES = [
  'Curating your cravings',
  'Selecting finest flavors',
  'Almost at your table',
];

const PROGRESS_STEPS = [
  { value: 22,  delay: 0    },
  { value: 48,  delay: 800  },
  { value: 76,  delay: 1700 },
  { value: 100, delay: 2600 },
];

/* ── Stars ── */
const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 0.8 + Math.random() * 1.6,
  duration: 2.5 + Math.random() * 4,
  delay: Math.random() * 5,
}));

/* ── Burger rain ── */
const BURGER_RAIN = Array.from({ length: 18 }, (_, i) => {
  let x = (i * 7.3 + 3) % 100;
  if (x > 33 && x < 67) x = x < 50 ? 28 : 72;
  return {
    id: i,
    x,
    size: 13 + (i % 5) * 2.5,
    duration: 2.4 + (i % 6) * 0.5,
    delay: -((i * 0.6) % 5),
    opacity: 0.25 + (i % 4) * 0.08,
  };
});

/* ── Tick positions on ring ── */
const TICKS = Array.from({ length: 48 }, (_, i) => {
  const angle = (i / 48) * 2 * Math.PI - Math.PI / 2;
  const r1 = 88, r2 = i % 4 === 0 ? 82 : 85;
  return {
    x1: 94 + r1 * Math.cos(angle),
    y1: 94 + r1 * Math.sin(angle),
    x2: 94 + r2 * Math.cos(angle),
    y2: 94 + r2 * Math.sin(angle),
  };
});

/* ── Tiny premium burger (dark themed) ── */
const TinyBurger = ({ size = 20 }) => (
  <svg width={size} height={Math.round(size * 0.9)} viewBox="0 0 20 18" style={{ display: 'block' }}>
    <rect x="1"   y="13.5" width="18" height="3.5" rx="1.5" fill="#c8883a" opacity="0.9" />
    <rect x="2"   y="10"   width="16" height="3"   rx="1"   fill="#5a2c0e" opacity="0.9" />
    <rect x="0.5" y="8"    width="19" height="2"   rx="1"   fill="#c09020" opacity="0.9" />
    <rect x="3"   y="6"    width="14" height="2"   rx="1"   fill="#a03818" opacity="0.9" />
    <rect x="0"   y="3.5"  width="20" height="2.5" rx="1.5" fill="#2e6e20" opacity="0.9" />
    <ellipse cx="10" cy="1.8" rx="9.5" ry="3.2" fill="#b07828" opacity="0.9" />
  </svg>
);

const LAYER_VARIANTS = {
  bunBot: {
    hidden:  { opacity: 0, y: -700, x: '-50%' },
    visible: { opacity: 1, y: 0, x: '-50%',
      transition: { type: 'spring', stiffness: 100, damping: 22, mass: 1.2, delay: 0 } },
  },
  patty: {
    hidden:  { opacity: 0, y: -720, x: '-50%' },
    visible: { opacity: 1, y: 0, x: '-50%',
      transition: { type: 'spring', stiffness: 105, damping: 20, mass: 1.0, delay: 0.14 } },
  },
  cheese: {
    hidden:  { opacity: 0, y: -710, x: '-50%' },
    visible: { opacity: 1, y: 0, x: '-50%',
      transition: { type: 'spring', stiffness: 95, damping: 17, mass: 0.85, delay: 0.28 } },
  },
  tomato: {
    hidden:  { opacity: 0, y: -700, x: '-50%' },
    visible: { opacity: 1, y: 0, x: '-50%',
      transition: { type: 'spring', stiffness: 110, damping: 19, mass: 0.9, delay: 0.42 } },
  },
  lettuce: {
    hidden:  { opacity: 0, y: -690, x: '-50%' },
    visible: { opacity: 1, y: 0, x: '-50%',
      transition: { type: 'spring', stiffness: 90, damping: 24, mass: 0.75, delay: 0.56 } },
  },
  bunTop: {
    hidden:  { opacity: 0, y: -740, scale: 0.85, x: '-50%' },
    visible: { opacity: 1, y: 0, scale: 1, x: '-50%',
      transition: { type: 'spring', stiffness: 82, damping: 26, mass: 1.35, delay: 0.70 } },
  },
};

export default function Preloader({ onComplete }) {
  const [progress, setProgress]   = useState(0);
  const [msgIndex, setMsgIndex]   = useState(0);
  const [assembled, setAssembled] = useState(false);
  const [exiting, setExiting]     = useState(false);

  const cursorRef = useRef(null);
  const ringRef   = useRef(null);

  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 18 });

  /* Custom cursor */
  useEffect(() => {
    const move = e => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top  = e.clientY + 'px';
      }
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      mouseX.set((e.clientX - cx) / cx * 10);
      mouseY.set((e.clientY - cy) / cy * 6);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  /* Progress */
  useEffect(() => {
    const timers = PROGRESS_STEPS.map(({ value, delay }) =>
      setTimeout(() => setProgress(value), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  /* Messages */
  useEffect(() => {
    if (msgIndex >= MESSAGES.length - 1) return;
    const t = setTimeout(() => setMsgIndex(i => i + 1), 1000);
    return () => clearTimeout(t);
  }, [msgIndex]);

  /* Assemble */
  useEffect(() => {
    if (progress >= 5 && !assembled) setAssembled(true);
  }, [progress, assembled]);

  /* Exit */
  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setExiting(true);
        setTimeout(() => onComplete?.(), 900);
      }, 1400);
    }
  }, [progress, onComplete]);

  const circumference = 2 * Math.PI * 82;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="pl-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(20px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Custom cursor */}
          <div ref={cursorRef} className="pl-cursor">
            <div className="pl-cursor-dot" />
          </div>

          {/* Ambient glows */}
          <div className="pl-glow-center" />
          <div className="pl-blob pl-blob-a" />
          <div className="pl-blob pl-blob-b" />

          {/* Stars */}
          <div className="pl-stars" aria-hidden="true">
            {STARS.map(s => (
              <div
                key={s.id}
                className="pl-star"
                style={{
                  left:             `${s.x}%`,
                  top:              `${s.y}%`,
                  width:            `${s.size}px`,
                  height:           `${s.size}px`,
                  animationDuration:`${s.duration}s`,
                  animationDelay:   `${s.delay}s`,
                }}
              />
            ))}
          </div>

          {/* Burger rain */}
          <div className="pl-rain-layer" aria-hidden="true">
            {BURGER_RAIN.map(b => (
              <div
                key={b.id}
                className="pl-rain-item"
                style={{
                  left:              `${b.x}%`,
                  opacity:            b.opacity,
                  animationDuration: `${b.duration}s`,
                  animationDelay:    `${b.delay}s`,
                }}
              >
                <TinyBurger size={b.size} />
              </div>
            ))}
          </div>

          {/* Corner ornaments */}
          <div className="pl-corners">
            <div className="pl-corner pl-corner-tl" />
            <div className="pl-corner pl-corner-tr" />
            <div className="pl-corner pl-corner-bl" />
            <div className="pl-corner pl-corner-br" />
          </div>

          {/* Horizontal rules */}
          <div className="pl-rule-top" />
          <div className="pl-rule-bot" />

          {/* Center — ring + burger */}
          <motion.div className="pl-center" style={{ x: springX, y: springY }}>
            <svg className="pl-ring" viewBox="0 0 188 188">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="rgba(197,152,68,0.4)" />
                  <stop offset="40%"  stopColor="#e8c070" />
                  <stop offset="100%" stopColor="rgba(197,152,68,0.4)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Outer spinning dashes */}
              <circle
                className="pl-ring-dash"
                cx="94" cy="94" r="90"
                style={{ transformOrigin: '94px 94px' }}
              />

              {/* Track */}
              <circle className="pl-ring-track" cx="94" cy="94" r="82" />

              {/* Tick marks */}
              {TICKS.map((t, i) => (
                <line
                  key={i}
                  className="pl-ring-tick"
                  x1={t.x1} y1={t.y1}
                  x2={t.x2} y2={t.y2}
                  opacity={i % 4 === 0 ? 0.4 : 0.15}
                />
              ))}

              {/* Progress arc */}
              <motion.circle
                className="pl-ring-fill"
                cx="94" cy="94" r="82"
                strokeDasharray={circumference}
                filter="url(#glow)"
                animate={{ strokeDashoffset: (1 - progress / 100) * circumference }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>

            {/* Burger */}
            <div className="pl-burger-scene">
              <motion.div
                className="pl-burger-wrap"
                animate={assembled ? { y: [0, -5, 0] } : {}}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div className="pl-bun-bot" variants={LAYER_VARIANTS.bunBot} initial="hidden" animate={assembled ? 'visible' : 'hidden'} />
                <motion.div className="pl-patty"   variants={LAYER_VARIANTS.patty}  initial="hidden" animate={assembled ? 'visible' : 'hidden'} />
                <motion.div className="pl-cheese"  variants={LAYER_VARIANTS.cheese} initial="hidden" animate={assembled ? 'visible' : 'hidden'} />
                <motion.div className="pl-tomato"  variants={LAYER_VARIANTS.tomato} initial="hidden" animate={assembled ? 'visible' : 'hidden'} />
                <motion.div className="pl-lettuce" variants={LAYER_VARIANTS.lettuce}initial="hidden" animate={assembled ? 'visible' : 'hidden'} />
                <motion.div className="pl-bun-top" variants={LAYER_VARIANTS.bunTop} initial="hidden" animate={assembled ? 'visible' : 'hidden'} />
              </motion.div>
            </div>
          </motion.div>

          {/* Brand */}
          <motion.div
            className="pl-brand-block"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="pl-tagline">Fine Dining · Delivered</p>
            <h1 className="pl-brand">
              <span className="pl-brand-crave">Crave</span>
              <span className="pl-brand-yard">Yard</span>
            </h1>
            <div className="pl-msg-area">
              <AnimatePresence mode="wait">
                <motion.p
                  key={msgIndex}
                  className="pl-msg"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.4 }}
                >
                  {MESSAGES[msgIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Progress */}
          <motion.div
            className="pl-progress-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="pl-line-track">
              <motion.div
                className="pl-line-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <motion.span className="pl-progress-num">
              {String(progress).padStart(3, '0')}
            </motion.span>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}