import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { motion } from "framer-motion";
import Header from "./Components/Header/Index";
import img01 from "./assets/01.webp";
import img02 from "./assets/02.webp";
import img03 from "./assets/03.webp";

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
    // Gather innerContainers but DO NOT set yPercent for them now,
    // so they remain fixed.
    const innerContainers = gsap.utils.toArray(
      container.querySelectorAll(".inner-container")
    );
    // Removed: gsap.set(innerContainers, { yPercent: 100 });

    let currentIndex = -1;
    const wrap = gsap.utils.wrap(0, sections.length);
    let animating = false;

    // Set outer and inner wrappers as before.
    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });
    // The inner-container will now remain fixed (no yPercent set).

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
        // Fade out the previous section and add a slight parallax on its image.
        gsap.set(sections[currentIndex], { zIndex: 0 });
        tl.to(images[currentIndex], { yPercent: -0 * dFactor }).set(
          sections[currentIndex],
          { autoAlpha: 0 }
        );
      }

      // Prepare the new section for display.
      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
      tl.fromTo(
        [outerWrappers[index], innerWrappers[index]],
        { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
        { yPercent: 0 },
        0
      )
        // Removed inner-container parallax tween so it remains fixed:
        // .fromTo(
        //   innerContainers[index],
        //   { yPercent: 100 * dFactor },
        //   { yPercent: 0 },
        //   0
        // )
        .fromTo(images[index], { yPercent: 0 * dFactor }, { yPercent: 0 }, 0);

      currentIndex = index;
    }

    // Set up the Observer for scroll, touch, and pointer events.
    Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => !animating && gotoSection(currentIndex - 1, -1),
      onUp: () => !animating && gotoSection(currentIndex + 1, 1),
      tolerance: 10,
      preventDefault: true,
    });

    // Start on the first section.
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

  // Colors for the outer container.
  const bgImages = [img01, img02, img03];

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
                  // Outer background color remains as defined here.
                  style={{
                    backgroundImage: `url(${
                      bgImages[index % bgImages.length]
                    })`,
                  }}
                >
                  <div
                    className="inner-container mx-auto h-auto w-2/3 z-10"
                    // The inner-container background color uses the reversed order
                    // to create the reverse color effect relative to the outer.
                    style={{
                      backgroundImage: `url(${
                        bgImages[index % bgImages.length]
                      })`,
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
