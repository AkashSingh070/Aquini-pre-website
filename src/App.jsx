import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import Header from "./Components/Header/Index";
import Footer from "./Components/Footer/Index";
import img01 from "./assets/01.webp";
import img02 from "./assets/02.webp";
import img03 from "./assets/03.webp";
import BGimg03 from "./assets/slideBG-01.webp";

gsap.registerPlugin(Observer);

const AnimatedSections = () => {
  const containerRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const sections = container.querySelectorAll("section");
    const images = container.querySelectorAll(".bg");
    const titles = container.querySelectorAll(".title");
    const outerWrappers = gsap.utils.toArray(
      container.querySelectorAll(".outer")
    );
    const innerWrappers = gsap.utils.toArray(
      container.querySelectorAll(".inner")
    );
    const innerContainers = gsap.utils.toArray(
      container.querySelectorAll(".inner-container")
    );
    const scrollDownElements = container.querySelectorAll(".scroll-down");

    let currentIndex = 0;
    let animating = false;

    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });
    innerContainers.forEach((el) =>
      gsap.set(el, { backgroundPosition: "center center", force3D: true })
    );

    gsap.set(sections[currentIndex], { autoAlpha: 1, zIndex: 1 });
    titles[currentIndex].classList.add("active");

    gsap.fromTo(
      [outerWrappers[currentIndex], innerWrappers[currentIndex]],
      { yPercent: (i) => (i ? -100 : 100) },
      { yPercent: 0, duration: 1.25, ease: "power1.inOut" }
    );

    // Function to scroll to the scroll indicator
    const scrollToScrollIndicator = (index) => {
      if (index < sections.length - 1) {
        // Don't scroll on last section
        const scrollElement = scrollDownElements[index];
        if (scrollElement) {
          // Wait for slide transition to complete, then scroll
          setTimeout(() => {
            const rect = scrollElement.getBoundingClientRect();
            const scrollDestination = rect.top + window.scrollY - 20; // Adjust for better visibility

            gsap.to(window, {
              scrollTo: scrollDestination,
              duration: 1,
              ease: "power2.inOut",
            });
          }, 1300); // Slightly after the slide transition completes
        }
      }
    };

    function gotoSection(index, direction) {
      if (index < 0 || index >= sections.length) return;
      animating = true;
      setActiveSlide(index);

      const dFactor = direction === -1 ? -1 : 1;
      const tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => {
          animating = false;
          scrollToScrollIndicator(index);
        },
      });

      if (titles[currentIndex]) titles[currentIndex].classList.remove("active");

      gsap.set(sections[currentIndex], { zIndex: 0 });
      tl.to(images[currentIndex], { yPercent: 0 }).set(sections[currentIndex], {
        autoAlpha: 0,
      });

      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });

      if (titles[index]) titles[index].classList.add("active");

      tl.fromTo(
        [outerWrappers[index], innerWrappers[index]],
        { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
        { yPercent: 0 },
        0
      );

      if (index < 3) {
        tl.fromTo(
          innerContainers[index],
          { backgroundPosition: "center center" },
          { backgroundPosition: "center center" },
          0
        );
      }

      currentIndex = index;
    }

    // Click handler for scroll-down elements
    const handleScrollDownClick = (event) => {
      if (!animating && currentIndex < sections.length - 1) {
        gotoSection(currentIndex + 1, 1);
      }
    };

    // Add click event listeners to all scroll-down elements
    scrollDownElements.forEach((el) => {
      el.style.cursor = "pointer"; // Make it clear it's clickable
      el.addEventListener("click", handleScrollDownClick);
    });

    Observer.create({
      target: container,
      type: "wheel,touch,pointer",
      wheelSpeed: 1,
      onDown: () => {
        if (!animating && currentIndex < sections.length - 1) {
          gotoSection(currentIndex + 1, 1);
        }
      },
      onUp: () => {
        if (!animating && currentIndex > 0) {
          gotoSection(currentIndex - 1, -1);
        }
      },
      tolerance: 10,
      preventDefault: true,
    });

    const handleKeyDown = (event) => {
      if (
        event.key === "ArrowDown" &&
        !animating &&
        currentIndex < sections.length - 1
      ) {
        gotoSection(currentIndex + 1, 1);
      } else if (event.key === "ArrowUp" && !animating && currentIndex > 0) {
        gotoSection(currentIndex - 1, -1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      Observer.getAll().forEach((obs) => obs.kill());
      window.removeEventListener("keydown", handleKeyDown);
      // Remove click event listeners to prevent memory leaks
      scrollDownElements.forEach((el) => {
        el.removeEventListener("click", handleScrollDownClick);
      });
    };
  }, []);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header isLoaded={isLoaded} />

      <div
        ref={containerRef}
        className="min-h-screen w-full relative min-w-screen"
      >
        {/* First Section */}
        <section id="first" className="fixed top-0 h-full w-full invisible">
          <div className="outer w-full h-full overflow-y-hidden">
            <div className="inner w-full h-full overflow-y-hidden">
              <div
                className="flex justify-center items-end flex-col bg-cover bg-no-repeat  relative overflow-hidden"
                style={{ backgroundImage: `url(${BGimg03})` }}
              >
                <div className="absolute inset-0 bg-black/5 backdrop-blur-md"></div>
                <div
                  className="inner-container mx-auto h-[85dvh] w-[84vw] aspect-video z-10 shadow-2xl bg-cover mt-[150px]"
                  style={{ backgroundImage: `url(${img03})` }}
                >
                  <div className="relative z-10 text-center w-full h-full">
                    <div className="title title01">
                      <h1>
                        AN EXCLUSIVE EXPERIENCE <br />
                        IS TAKING SHAPE
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="animate-bounce scroll-down h-20 ease-in duration-500 cursor-pointer">
                <span className="h-20 w-[1px] bg-white flex"></span>
              </div>
            </div>
          </div>
        </section>
        {/* Second Section */}
        <section id="second" className="fixed top-0 h-full w-full invisible">
          <div className="outer w-full h-full overflow-y-hidden">
            <div className="inner w-full h-full overflow-y-hidden relative">
              <div
                className="bg flex justify-center items-end flex-col bg-cover bg-no-repeat  relative overflow-hidden"
                style={{ backgroundImage: `url(${img02})` }}
              >
                <div className="absolute inset-0 bg-black/10 backdrop-blur-lg"></div>
                <div
                  className="inner-container mx-auto h-[85dvh] w-[84vw] aspect-video z-10 shadow-2xl bg-cover mt-[150px]"
                  style={{ backgroundImage: `url(${img02})` }}
                >
                  <div className="relative z-10 text-center w-full h-full flex items-center justify-center">
                    <div className="title w-1/2 text-[30px] tracking-[3px] flex items-center justify-center mt-[25%] ml-10">
                      <h2>DESIGN MEETS DESIRE.</h2>
                    </div>
                    <div className="flex items-center justify-center w-1/2">
                      <p
                        className={`uppercase tracking-[4px] leading-[1.8] pl-6 text-[19px] text-left mx-auto w-9/12 para_text ${
                          activeSlide === 1 ? "active" : ""
                        }`}
                      >
                        Aquini brings you products that meet International
                        standards of excellence, offering you both style and
                        durability for your private sanctuary. Conceptualized in
                        world renowned design studios, Aquini's latest
                        collection reflects the perfect balance of innovation
                        and timeless elegance. Whether you're drawn to graceful
                        curves or sleek, futuristic lines, our diverse selection
                        is tailored to match your indulgence in the ultimate
                        luxury and design with Aquini.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="animate-bounce scroll-down h-20 ease-in duration-500 cursor-pointer">
                <span className="h-20 w-[1px] bg-white flex"></span>
              </div>
            </div>
          </div>
        </section>
        {/* Third Section */}
        <section id="third" className="fixed top-0 h-full w-full invisible">
          <div className="outer w-full h-full overflow-y-hidden">
            <div className="inner w-full h-full overflow-y-hidden relative">
              <div
                className="bg flex justify-center items-end flex-col bg-cover bg-no-repeat  relative overflow-hidden"
                style={{ backgroundImage: `url(${img01})` }}
              >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-lg"></div>
                <div
                  className="inner-container mx-auto h-[85dvh] w-[84vw] aspect-video z-10 shadow-2xl bg-cover mt-[150px]"
                  style={{ backgroundImage: `url(${img01})` }}
                >
                  <div className="relative z-10 text-center w-full h-full flex items-center justify-center">
                    <div className="title title02 mt-14">
                      <h2 className="!text-center">
                        Revealing Soon
                        <br /> <span>van gogh</span>
                        <p>Collection</p>
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="animate-bounce scroll-down h-20 ease-in duration-500 cursor-pointer">
                <span className="h-20 w-[1px] bg-white flex"></span>
              </div>
            </div>
          </div>
        </section>
        {/* Footer Section */}
        <section id="footer" className="fixed top-0 h-full w-full invisible">
          <div className="outer w-full h-full overflow-y-hidden">
            <div className="inner w-full h-full overflow-y-hidden relative">
              <div className="bg-black flex items-end justify-center absolute inset-0  ">
                <Footer isActive={activeSlide} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AnimatedSections;
