import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SpecialSections.css';
import { assets } from '../../assets/assets';

const SpecialSections = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef(null);
  const lastWheelTime = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

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
    const direction = event.deltaY > 0 ? 1 : -1;
    const isFirst = activeIndex === 0;
    const isLast = activeIndex === sections.length - 1;

    if ((direction < 0 && isFirst) || (direction > 0 && isLast)) {
      return;
    }

    event.preventDefault();

    if (Date.now() - lastWheelTime.current < 420) {
      return;
    }

    lastWheelTime.current = Date.now();
    setActiveIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return 0;
      if (next >= sections.length) return sections.length - 1;
      return next;
    });
  };

  useEffect(() => {
    const currentWrapper = wrapperRef.current;
    if (currentWrapper) {
      currentWrapper.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (currentWrapper) {
        currentWrapper.removeEventListener('wheel', handleWheel);
      }
    };
  }, [activeIndex]);


  const activeSection = sections[activeIndex];

  const goToNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const goToPrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    // Ignore mostly vertical gestures so normal page scroll still works.
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    const swipeThreshold = 45;
    if (deltaX <= -swipeThreshold) {
      goToNext();
    } else if (deltaX >= swipeThreshold) {
      goToPrev();
    }
  };

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

        <div className="carousel-viewport" aria-label="Special sections horizontal carousel">
          <motion.div
            className="carousel-track"
            animate={{ x: `-${activeIndex * 100}%` }}
            transition={{ type: 'spring', stiffness: 90, damping: 18 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {sections.map((section) => (
              <article key={section.id} className="carousel-slide">
                <img
                  src={section.image}
                  alt={section.title}
                  className="feature-image"
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden';
                  }}
                />
                <div className="slide-shine" />
              </article>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="carousel-dots">
        {sections.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      <p className="wheel-hint">Scroll inside this section to move horizontally</p>
    </section>
  );
};

export default SpecialSections;