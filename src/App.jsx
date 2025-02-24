import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import Lenis from "lenis"; // Lenis for smooth scrolling
import Header from "./Components/Header/Index";
import Footer from "./Components/Footer/Index";
import img01 from "./assets/01.webp";
import img02 from "./assets/02.webp";
import img03 from "./assets/03.webp";
import BGimg03 from "./assets/slideBG-01.webp";
import mobileBg1 from "./assets/bg01.webp";
import mobileBg2 from "./assets/bg02.webp";
import mobileBg3 from "./assets/bg03.webp";
import mobilebanner1 from "./assets/banner01.webp";
import mobilebanner2 from "./assets/banner02.webp";
import mobilebanner3 from "./assets/banner03.webp";

// Register GSAP plugins (only Observer is needed now)
gsap.registerPlugin(Observer);

const AnimatedSections = () => {
  const containerRef = useRef(null);
  const lenisRef = useRef(null);
  const gotoSectionRef = useRef(null); // Store the gotoSection function here
  const animatingRef = useRef(false);

  // Centralized active slide using a ref and state
  const currentSlideRef = useRef(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 786);

  useEffect(() => {
    // Handler to update state based on window width
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 786);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ref arrays for elements (using callback refs in JSX)
  const sectionsRef = useRef([]);
  const imagesRef = useRef([]);
  const outerWrappersRef = useRef([]);
  const innerWrappersRef = useRef([]);
  const innerContainersRef = useRef([]);
  const scrollDownElementsRef = useRef([]);

  // Simple handler to go to the next slide
  const handleNextSlide = (e) => {
    e.stopPropagation();
    if (
      gotoSectionRef.current &&
      currentSlideRef.current < sectionsRef.current.length - 1
    ) {
      gotoSectionRef.current(currentSlideRef.current + 1, 1);
    }
  };

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1, // scroll duration in seconds
      easing: (t) => t, // linear easing (adjust as needed)
    });

    function raf(time) {
      lenisRef.current.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const sections = sectionsRef.current;
    const images = imagesRef.current;
    const outerWrappers = outerWrappersRef.current;
    const innerWrappers = innerWrappersRef.current;
    const innerContainers = innerContainersRef.current;
    const scrollDownElements = scrollDownElementsRef.current;

    // Set initial positions for animation
    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });
    innerContainers.forEach((el) =>
      gsap.set(el, { backgroundPosition: "center center", force3D: true })
    );

    // Show the first section with an initial animation.
    gsap.set(sections[currentSlideRef.current], { autoAlpha: 1, zIndex: 1 });
    gsap.fromTo(
      [
        outerWrappers[currentSlideRef.current],
        innerWrappers[currentSlideRef.current],
      ],
      { yPercent: (i) => (i ? -100 : 100) },
      {
        yPercent: 0,
        duration: 1.8, // Increase duration for a slower transition
        ease: "power1.inOut",
        onComplete: () => setIsLoaded(true),
      }
    );

    // Use Lenis to smoothly scroll to the scroll-down indicator.
    const scrollToScrollIndicator = (index) => {
      if (index < sections.length - 1 && lenisRef.current) {
        setTimeout(() => {
          const rect = scrollDownElements[index].getBoundingClientRect();
          const scrollDestination = rect.top + window.scrollY - 20;
          lenisRef.current.scrollTo(scrollDestination, {
            duration: 1,
            easing: (t) => t, // adjust easing if needed
          });
        }, 1500);
      }
    };

    // Centralized function to transition to a specific section.
    function gotoSection(newIndex, direction) {
      if (newIndex < 0 || newIndex >= sections.length || animatingRef.current)
        return;
      animatingRef.current = true;
      const dFactor = direction === -1 ? -1 : 1;
      const tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => {
          animatingRef.current = false;
          scrollToScrollIndicator(newIndex);
        },
      });

      // Animate out the current slide.
      gsap.set(sections[currentSlideRef.current], { zIndex: 0 });
      tl.to(images[currentSlideRef.current], { yPercent: 0 }).set(
        sections[currentSlideRef.current],
        { autoAlpha: 0 }
      );

      // Animate in the new slide.
      gsap.set(sections[newIndex], { autoAlpha: 1, zIndex: 1 });
      tl.fromTo(
        [outerWrappers[newIndex], innerWrappers[newIndex]],
        { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
        { yPercent: 0 },
        0
      );

      if (newIndex < 3) {
        tl.fromTo(
          innerContainers[newIndex],
          { backgroundPosition: "center center" },
          { backgroundPosition: "center center" },
          0
        );
      }

      // Update the centralized active slide reference and state.
      currentSlideRef.current = newIndex;
      setActiveSlide(newIndex);
    }
    // Store gotoSection in the ref for our click handler.
    gotoSectionRef.current = gotoSection;

    // Keydown navigation handler (ArrowDown / ArrowUp).
    const handleKeyDown = (event) => {
      if (
        event.key === "ArrowDown" &&
        !animatingRef.current &&
        currentSlideRef.current < sections.length - 1
      ) {
        gotoSection(currentSlideRef.current + 1, 1);
      } else if (
        event.key === "ArrowUp" &&
        !animatingRef.current &&
        currentSlideRef.current > 0
      ) {
        gotoSection(currentSlideRef.current - 1, -1);
      }
    };

    // Determine if device is mobile (for this fix only)
    const isMobile = window.innerWidth < 786;

    // Updated Observer for mobile: swap onDown and onUp callbacks only for mobile.
    Observer.create({
      target: containerRef.current,
      type: "wheel,touch,pointer",
      wheelSpeed: 1,
      onDown: () => {
        if (!animatingRef.current) {
          if (isMobile) {
            // For mobile: onDown goes to previous slide (instead of next)
            if (currentSlideRef.current > 0) {
              gotoSection(currentSlideRef.current - 1, -1);
            }
          } else {
            // For desktop: onDown goes to next slide
            if (currentSlideRef.current < sections.length - 1) {
              gotoSection(currentSlideRef.current + 1, 1);
            }
          }
        }
      },
      onUp: () => {
        if (!animatingRef.current) {
          if (isMobile) {
            // For mobile: onUp goes to next slide (instead of previous)
            if (currentSlideRef.current < sections.length - 1) {
              gotoSection(currentSlideRef.current + 1, 1);
            }
          } else {
            // For desktop: onUp goes to previous slide
            if (currentSlideRef.current > 0) {
              gotoSection(currentSlideRef.current - 1, -1);
            }
          }
        }
      },
      tolerance: 10,
      preventDefault: true,
    });

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      Observer.getAll().forEach((obs) => obs.kill());
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Header
        isLoaded={isLoaded}
        onDownload={() => {
          if (activeSlide !== 3) gotoSectionRef.current(3, activeSlide);
        }}
        onLogo={() => {
          if (activeSlide !== 0) gotoSectionRef.current(0, activeSlide);
        }}
      />
      <div
        ref={containerRef}
        className="min-h-screen w-full relative min-w-screen"
      >
        {/* First Section */}
        <section
          ref={(el) => (sectionsRef.current[0] = el)}
          id="first"
          className="fixed top-0 h-full w-full invisible"
        >
          <div
            ref={(el) => (outerWrappersRef.current[0] = el)}
            className="outer w-[100dvw] h-[100dvh] overflow-y-hidden"
          >
            <div
              ref={(el) => (innerWrappersRef.current[0] = el)}
              className="inner w-[100dvw] h-[100dvh] overflow-y-hidden"
            >
              <div
                ref={(el) => (imagesRef.current[0] = el)}
                className="flex justify-center items-end flex-col bg-cover bg-no-repeat relative overflow-hidden h-screen w-screen"
                style={{
                  backgroundImage: `url(${
                    isSmallScreen ? mobileBg1 : BGimg03
                  })`,
                }}
              >
                <div className="absolute inset-0 bg-black/5 backdrop-blur-md"></div>
                <div
                  ref={(el) => (innerContainersRef.current[0] = el)}
                  className="inner-container mx-auto md:h-[85dvh]  md:w-[84vw]  md:aspect-video z-10 shadow-2xl bg-cover md:mt-[150px] flex justify-center items-center m-auto h-[95dvh] w-[95vw]"
                  style={{
                    backgroundImage: `url(${
                      isSmallScreen ? mobilebanner1 : img03
                    })`,
                  }}
                >
                  <div className="relative z-10 text-center w-full h-full">
                    <div
                      className={`title title01  w-[230px] sm:w-[250px] md:w-auto ${
                        activeSlide === 0 && isLoaded ? "active" : ""
                      }`}
                    >
                      <h1 className=" ">
                        AN EXCLUSIVE EXPERIENCE <br />
                        IS TAKING SHAPE
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              {/* Use the simple onClick handler */}
              <div
                onClick={handleNextSlide}
                className="animate-bounce scroll-down h-20 ease-in duration-500 cursor-pointer"
              >
                <span className="h-20 w-[1px] bg-white flex"></span>
              </div>
            </div>
          </div>
        </section>

        {/* Second Section */}
        <section
          ref={(el) => (sectionsRef.current[1] = el)}
          id="second"
          className="fixed top-0 h-full w-full invisible"
        >
          <div
            ref={(el) => (outerWrappersRef.current[1] = el)}
            className="outer w-[100dvw] h-[100dvh] overflow-y-hidden"
          >
            <div
              ref={(el) => (innerWrappersRef.current[1] = el)}
              className="inner w-[100dvw] h-[100dvh] overflow-y-hidden relative"
            >
              <div
                ref={(el) => (imagesRef.current[1] = el)}
                className="flex justify-center items-end flex-col bg-cover bg-no-repeat relative overflow-hidden h-[100dvh] w-[100dvw]"
                style={{
                  backgroundImage: `url(${isSmallScreen ? mobileBg2 : img02})`,
                }}
              >
                <div className="absolute inset-0 bg-black/10 backdrop-blur-lg"></div>
                <div
                  ref={(el) => (innerContainersRef.current[1] = el)}
                  className="inner-container mx-auto md:h-[85dvh] md:w-[84vw] md:aspect-video z-10 shadow-2xl bg-cover md:mt-[150px] h-[95dvh] w-[95vw]"
                  style={{
                    backgroundImage: `url(${
                      isSmallScreen ? mobilebanner2 : img02
                    })`,
                  }}
                >
                  <div className="relative z-10 text-center xl:w-full w-11/12 mx-auto h-full flex flex-col xl:flex-row justify-end ">
                    <div
                      className={`title xl:w-1/2 xl:text-[1.8vw] lg:text-[40px] md:text-[30px] sm:text-[4.5dvw] text-[4.1vw]  w-full tracking-[3px] flex items-center xl:justify-center xl:mt-[25%] xl:ml-10 sm:mb-5 mb-4 xl:mb-0 ${
                        activeSlide === 1 ? "active" : ""
                      }`}
                    >
                      <h2>DESIGN MEETS DESIRE.</h2>
                    </div>
                    <div className="flex items-center justify-center xl:w-1/2 w-full mb-10 xl:mb-0">
                      <p
                        className={`uppercase xl:tracking-[4px] tracking-[1.9px] 2xl:leading-[1.8] xl:leading-[1.6]  leading-[1.6] 2xl:pl-6 2xl:text-[19px] xl:text-[17px] md:text-[15px] text-[14px] text-left mx-auto xl:w-9/12 w-full  para_text   ${
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
              <div
                onClick={handleNextSlide}
                ref={(el) => (scrollDownElementsRef.current[1] = el)}
                className="animate-bounce scroll-down h-20 ease-in duration-500 cursor-pointer"
              >
                <span className="h-20 w-[1px] bg-white flex"></span>
              </div>
            </div>
          </div>
        </section>

        {/* Third Section */}
        <section
          ref={(el) => (sectionsRef.current[2] = el)}
          id="third"
          className="fixed top-0 h-full w-full invisible"
        >
          <div
            ref={(el) => (outerWrappersRef.current[2] = el)}
            className="outer w-[100dvw] h-[100dvh] overflow-y-hidden"
          >
            <div
              ref={(el) => (innerWrappersRef.current[2] = el)}
              className="inner w-[100dvw] h-[100dvh] overflow-y-hidden relative"
            >
              <div
                ref={(el) => (imagesRef.current[2] = el)}
                className="flex justify-center items-end flex-col bg-cover bg-no-repeat relative overflow-hidden h-[100dvh] w-[100dvw]"
                style={{
                  backgroundImage: `url(${isSmallScreen ? mobileBg3 : img01})`,
                }}
              >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-lg"></div>
                <div
                  ref={(el) => (innerContainersRef.current[2] = el)}
                  className="inner-container mx-auto md:h-[85dvh] md:w-[84vw] md:aspect-video z-10 shadow-2xl bg-cover md:mt-[150px] h-[95dvh] w-[95vw]"
                  style={{
                    backgroundImage: `url(${
                      isSmallScreen ? mobilebanner3 : img01
                    })`,
                  }}
                >
                  <div className="relative z-10 text-center w-full h-full flex items-center justify-center">
                    <div
                      className={`title title02 mt-14 ${
                        activeSlide === 2 ? "active" : ""
                      }`}
                    >
                      <h2 className="!text-center">
                        Revealing Soon <br /> <span>van gogh</span>
                        <p>Collection</p>
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={handleNextSlide}
                ref={(el) => (scrollDownElementsRef.current[2] = el)}
                className="animate-bounce scroll-down h-20 ease-in duration-500 cursor-pointer"
              >
                <span className="h-20 w-[1px] bg-white flex"></span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <section
          ref={(el) => (sectionsRef.current[3] = el)}
          id="footer"
          className="fixed top-0 h-full w-full invisible"
        >
          <div
            ref={(el) => (outerWrappersRef.current[3] = el)}
            className="outer w-[100dvw] h-[100dvh] overflow-y-hidden"
          >
            <div
              ref={(el) => (innerWrappersRef.current[3] = el)}
              className="inner w-[100dvw] h-[100dvh] overflow-y-hidden relative"
            >
              <div className="bg-black flex items-end justify-center absolute inset-0">
                <Footer isActive={activeSlide} isMobile={isSmallScreen} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AnimatedSections;
