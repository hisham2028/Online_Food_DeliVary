import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './SpecialSections.css';
import { assets } from '../../assets/assets';

const SpecialSections = () => {
  const wrapperRef = useRef(null);
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

  const fallbackImage = assets.signature_dishes;
  const currentImage = sections[activeIndex]?.image || fallbackImage;

  useEffect(() => {
    sections.forEach((section) => {
      const img = new Image();
      img.src = section.image || fallbackImage;
    });
  }, []);

  useEffect(() => {
    let rafId = null;

    const updateActiveSection = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = Math.max(rect.height - viewportHeight, 1);
      const passed = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const segment = totalScrollable / (sections.length - 1 || 1);
      const nextIndex = Math.min(
        sections.length - 1,
        Math.max(0, Math.round(passed / Math.max(segment, 1)))
      );

      setActiveIndex(nextIndex);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        updateActiveSection();
        rafId = null;
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [sections.length]);

  return (
    <div className="special-sections-wrapper" ref={wrapperRef}>
      {/* FIXED BACKGROUND THAT UPDATES */}
      <div className="bg-anchor">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="bg-layer"
          style={{ 
            backgroundImage: `url(${currentImage})`,
            backgroundColor: '#1a1a1a'
          }}
        />
        <div className="bg-vignette"></div>

        <div className="image-sticky-side">
          <div className="image-box">
            <motion.img
              key={activeIndex}
              src={currentImage}
              onError={(event) => {
                if (event.currentTarget.src !== fallbackImage) {
                  event.currentTarget.src = fallbackImage;
                }
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="active-feature-img"
              alt={sections[activeIndex]?.title || 'Special section image'}
            />
          </div>
        </div>

        <div className="text-sticky-side">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="content-inner"
          >
            <span className="idx">0{activeIndex + 1}</span>
            <h2>{sections[activeIndex].title}</h2>
            <p>{sections[activeIndex].description}</p>
          </motion.div>
        </div>
      </div>

      <div className="scroll-track" aria-hidden="true">
        {sections.map((section) => (
          <div key={section.id} className="scroll-step" />
        ))}
      </div>

      <div className="main-content-grid" aria-hidden="true">
        <div className="text-scroll-side">
          {sections.map((section) => (
            <div key={section.id} className="scroll-block" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialSections;
