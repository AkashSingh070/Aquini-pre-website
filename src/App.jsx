import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import Header from "./Components/Header/Index";
import Footer from "./Components/Footer/Index";
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
    // Select inner-containers (for background image tween)
    const innerContainers = gsap.utils.toArray(
      container.querySelectorAll(".inner-container")
    );

    let currentIndex = 0;
    let animating = false;

    // Set initial positions for outer and inner wrappers.
    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });
    // Ensure the inner-container has a default background position.
    innerContainers.forEach((el) =>
      gsap.set(el, { backgroundPosition: "center center" })
    );

    // Immediately display the first section.
    gsap.set(sections[currentIndex], { autoAlpha: 1, zIndex: 1 });
    gsap.fromTo(
      [outerWrappers[currentIndex], innerWrappers[currentIndex]],
      { yPercent: (i) => (i ? -100 : 100) },
      { yPercent: 0, duration: 1.25, ease: "power1.inOut" }
    );

    // Function to navigate to a given section.
    function gotoSection(index, direction) {
      // Prevent transition if index is out of bounds.
      if (index < 0 || index >= sections.length) {
        console.log("Boundary reached, index:", index);
        return;
      }
      animating = true;
      const dFactor = direction === -1 ? -1 : 1;
      const tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => (animating = false),
      });

      // Fade out the previous section.
      gsap.set(sections[currentIndex], { zIndex: 0 });
      tl.to(images[currentIndex], { yPercent: 0 }).set(sections[currentIndex], {
        autoAlpha: 0,
      });

      // Prepare and animate the new section.
      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
      tl.fromTo(
        [outerWrappers[index], innerWrappers[index]],
        { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
        { yPercent: 0 },
        0
      )
        // Animate the inner-container's background position for a parallax effect.
        .fromTo(
          innerContainers[index],
          {
            backgroundPosition:
              direction === 1 ? "center top" : "center bottom",
          },
          { backgroundPosition: "center center" },
          0
        )
        .fromTo(images[index], { yPercent: 0 }, { yPercent: 0 }, 0);

      currentIndex = index;
    }

    // Create a GSAP Observer with corrected scroll direction.
    Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: 1,
      onDown: () => {
        // Scroll down: move to the next slide.
        if (!animating && currentIndex < sections.length - 1) {
          gotoSection(currentIndex + 1, 1);
        }
      },
      onUp: () => {
        // Scroll up: move to the previous slide.
        if (!animating && currentIndex > 0) {
          gotoSection(currentIndex - 1, -1);
        }
      },
      tolerance: 10,
      preventDefault: true,
    });

    return () => Observer.getAll().forEach((obs) => obs.kill());
  }, []);

  // Only 3 main sections.
  const sectionsData = [
    { id: "first", heading: "Scroll down" },
    { id: "second", heading: "Animated with GSAP" },
    { id: "third", heading: "GreenSock" },
  ];

  // 3 background images corresponding to each section.
  const bgImages = [img03, img02, img01];

  return (
    <>
      <Header />
      <div
        ref={containerRef}
        className="bg-black text-white font-serif uppercase min-h-screen"
      >
        {sectionsData.map((section, index) => (
          <section
            key={section.id}
            className="fixed top-0 h-full w-full invisible "
          >
            <div className="outer w-full h-full overflow-y-hidden">
              <div className="inner w-full h-full overflow-y-hidden relative">
                <div
                  className="bg flex items-center justify-center flex-col absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${
                      bgImages[index % bgImages.length]
                    })`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-lg"></div>
                  <div
                    className="inner-container mx-auto h-auto w-[85vw] aspect-video z-10 shadow-2xl bg-cover mt-[100px]"
                    style={{
                      backgroundImage: `url(${
                        bgImages[index % bgImages.length]
                      })`,
                    }}
                  ></div>
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
