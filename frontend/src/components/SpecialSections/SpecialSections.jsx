import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SpecialSections.css';
import { assets } from '../../assets/assets';

const SpecialSections = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef(null);

  const sections = [
    {
      id: 'signature',
      title: 'Signature Dishes',
      description: 'Indulge in our world-renowned signature dishes.',
      image: assets.signature_dishes,
    },
    {
      id: 'seasonal',
      title: 'Seasonal Specials',
      description: 'Discover the freshest seasonal ingredients.',
      image: assets.seasonal_specials,
    },
    {
      id: 'chef',
      title: "Chef's Selection",
      description: 'Let our master chef guide your palate.',
      image: assets.chef_selection,
    },
  ];

  const handleWheel = (event) => {
    // A simple debounce mechanism
    if (Date.now() - (lastWheelTime.current || 0) < 800) return;
    lastWheelTime.current = Date.now();

    const direction = event.deltaY > 0 ? 1 : -1;
    setActiveIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return sections.length - 1; // Loop to last
      if (next >= sections.length) return 0; // Loop to first
      return next;
    });
  };
  
  const lastWheelTime = useRef(null);

  useEffect(() => {
    const currentWrapper = wrapperRef.current;
    if (currentWrapper) {
      currentWrapper.addEventListener('wheel', handleWheel, { passive: true });
    }
    return () => {
      if (currentWrapper) {
        currentWrapper.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);


  const activeSection = sections[activeIndex];

  const handleParallaxMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    const x = (px - 0.5) * 2;
    const y = (py - 0.5) * 2;

    setParallax({ x, y });
  };

  const resetParallax = () => setParallax({ x: 0, y: 0 });

  return (
    <section ref={wrapperRef} className="special-sections-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection.id}
          className="special-bg-blur"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ backgroundImage: `url(${activeSection.image})` }}
        />
      </AnimatePresence>
      <div className="special-bg-overlay" />

      <div className="content-grid">
        {/* Left Side: Text Content */}
        <div className="text-content-pane">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="text-block"
            >
              <span className="idx">0{activeIndex + 1}</span>
              <h2>{activeSection.title}</h2>
              <p>{activeSection.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Image */}
        <motion.div
          className="image-pane"
          onMouseMove={handleParallaxMove}
          onMouseLeave={resetParallax}
          animate={{
            rotateX: -parallax.y * 5,
            rotateY: parallax.x * 7,
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 15, mass: 0.8 }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={activeSection.image}
              alt={activeSection.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: -parallax.x * 16,
                y: -parallax.y * 12,
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="feature-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation Dots */}
      <div className="carousel-dots">
        {sections.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default SpecialSections;