import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './SpecialSections.css';
import { assets } from '../../assets/assets';

const SpecialSections = () => {
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

  const fallbackImage = assets.signature_dishes;
  const currentImage = sections[activeIndex]?.image || fallbackImage;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    sections.forEach((section) => {
      const img = new Image();
      img.src = section.image || fallbackImage;
    });
  }, []);

  const handleWheel = (event) => {
    const delta = event.deltaY;
    const lastIndex = sections.length - 1;
    const current = activeIndexRef.current;

    if (wheelLockRef.current || Math.abs(delta) < 8) return;

    if (delta > 0 && current < lastIndex) {
      event.preventDefault();
      wheelLockRef.current = true;
      setActiveIndex(current + 1);
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 420);
      return;
    }

    if (delta < 0 && current > 0) {
      event.preventDefault();
      wheelLockRef.current = true;
      setActiveIndex(current - 1);
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 420);
    }
  };

  return (
    <section className="special-sections-wrapper" onWheel={handleWheel}>
      <div className="special-sections-window">
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

        <div className="window-content">
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
      </div>
    </section>
  );
};

export default SpecialSections;
