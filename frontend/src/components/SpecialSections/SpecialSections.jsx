import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SpecialSections.css';
import { assets } from '../../assets/assets';

const SpecialSections = () => {
  const wrapperRef = useRef(null);
  const activeIndexRef = useRef(0);
  const wheelLockRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const sections = [
    {
      id: 'signature',
      title: 'Signature Dishes',
      description: 'Indulge in our world-renowned signature dishes.',
      image: assets.signature_dishes 
    },
    {
      id: 'seasonal',
      title: 'Seasonal Specials',
      description: 'Discover the freshest seasonal ingredients.',
      image: assets.seasonal_specials
    },
    {
      id: 'chef',
      title: "Chef's Selection",
      description: 'Let our master chef guide your palate.',
      image: assets.chef_selection
    },
  ];

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const handleWheel = (event) => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const inViewport = rect.top <= 0 && rect.bottom >= window.innerHeight;
      if (!inViewport) return;

      const isDown = event.deltaY > 0;
      const lastIndex = sections.length - 1;
      const current = activeIndexRef.current;

      if ((isDown && current >= lastIndex) || (!isDown && current <= 0)) {
        return;
      }

      event.preventDefault();
      if (wheelLockRef.current) return;

      wheelLockRef.current = true;
      setActiveIndex((prev) => {
        if (isDown) return Math.min(prev + 1, lastIndex);
        return Math.max(prev - 1, 0);
      });

      setTimeout(() => {
        wheelLockRef.current = false;
      }, 420);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [sections.length]);

  return (
    <div className="special-sections-wrapper" ref={wrapperRef}>
      {/* FIXED BACKGROUND THAT UPDATES */}
      <div className="bg-anchor">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-layer"
            style={{ 
              backgroundImage: `url(${sections[activeIndex].image})`,
              backgroundColor: '#1a1a1a' // Dark gray if image fails
            }}
          />
        </AnimatePresence>
        <div className="bg-vignette"></div>
      </div>

      <div className="main-content-grid">
        <div className="image-sticky-side">
          <div className="image-box">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={sections[activeIndex].image}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="active-feature-img"
              />
            </AnimatePresence>
          </div>
        </div>

        <div className="text-scroll-side">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`scroll-block ${activeIndex === index ? 'active' : ''}`}
            >
              <div className="content-inner">
                <span className="idx">0{index + 1}</span>
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialSections;