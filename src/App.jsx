import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { motion } from "framer-motion";
import Header from "./Components/Header/Index";

// Register GSAP plugin
gsap.registerPlugin(Observer);

const AnimatedSections = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const sections = container.querySelectorAll("section");
    const images = container.querySelectorAll(".bg");
    const outerWrappers = gsap.utils.toArray(
      container.querySelectorAll(".outer")
    );
    const innerWrappers = gsap.utils.toArray(
      container.querySelectorAll(".inner")
    );
    // Add reference to inner-containers
    const innerContainers = gsap.utils.toArray(
      container.querySelectorAll(".inner-container")
    );

    let currentIndex = -1;
    const wrap = gsap.utils.wrap(0, sections.length);
    let animating = false;

    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });
    // Set initial horizontal position for inner-containers
    gsap.set(innerContainers, { xPercent: 100 });

    function gotoSection(index, direction) {
      index = wrap(index);
      animating = true;
      const fromTop = direction === -1;
      const dFactor = fromTop ? -1 : 1;
      const tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => (animating = false),
      });

      if (currentIndex >= 0) {
        gsap.set(sections[currentIndex], { zIndex: 0 });
        tl.to(images[currentIndex], { yPercent: -15 * dFactor }).set(
          sections[currentIndex],
          { autoAlpha: 0 }
        );
      }

      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
      tl.fromTo(
        [outerWrappers[index], innerWrappers[index]],
        { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
        { yPercent: 0 },
        0
      )
        // Add animation for inner-container
        .fromTo(
          innerContainers[index],
          { xPercent: 100 * dFactor }, // Reverse horizontal direction
          { xPercent: 0 },
          0
        )
        .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0);

      currentIndex = index;
    }

    Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => !animating && gotoSection(currentIndex - 1, -1),
      onUp: () => !animating && gotoSection(currentIndex + 1, 1),
      tolerance: 10,
      preventDefault: true,
    });

    gotoSection(0, 1);

    return () => Observer.getAll().forEach((obs) => obs.kill());
  }, []);

  // Section data with headings and background colors (in place of images)
  const sectionsData = [
    { id: "first", heading: "Scroll down" },
    { id: "second", heading: "Animated with GSAP" },
    { id: "third", heading: "GreenSock" },
    { id: "fourth", heading: "Animation platform" },
    { id: "fifth", heading: "Keep scrolling" },
  ];

  const bgColors = ["#1abc9c", "#3498db", "#9b59b6", "#e67e22", "#e74c3c"];

  return (
    <>
      <Header />
      <div
        ref={containerRef}
        className="bg-black text-white font-serif uppercase min-h-screen"
      >
        {/* Render sections */}
        {sectionsData.map((section, index) => (
          <section
            key={section.id}
            className="fixed top-0 h-full w-full invisible"
          >
            <div className="outer w-full h-full overflow-y-hidden">
              <div className="inner w-full h-full overflow-y-hidden">
                <div
                  className="bg flex items-center justify-center flex-col absolute inset-0 bg-cover bg-center"
                  style={{ backgroundColor: bgColors[index] }}
                >
                  <div
                    className="inner-container mx-auto h-[50vh] w-2/3 bg-white z-10"
                    style={{
                      backgroundColor: bgColors[bgColors.length - 1 - index],
                    }}
                  ></div>
                  <h2 className="section-heading z-20 text-center text-[clamp(1rem,5vw,5rem)] font-normal tracking-[0.5em] w-[90vw] max-w-[1200px]">
                    {section.heading}
                  </h2>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
};

export default AnimatedSections;
