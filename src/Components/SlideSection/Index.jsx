// SlideSection.jsx
import React from "react";

// If you're using the same AnimatedHeading from your main file,
// pass it in as a prop so we don't duplicate code here.
const SlideSection = ({
  index,
  activeSection,
  heading,
  parentImage,
  childImage,
  AnimatedHeading,
}) => {
  return (
    <section className="fixed top-0 h-full w-full invisible">
      {/* Parent background (outer wrapper) */}
      <div
        className="outer w-full h-full overflow-hidden bg-cover bg-center"
        style={{
          // This background moves bottom->top on scroll
          backgroundImage: `url(${parentImage})`,
          backgroundPosition: "center bottom",
        }}
      >
        {/* Child background (inner wrapper) */}
        <div
          className="inner w-full h-full overflow-hidden bg-cover bg-center"
          style={{
            // This background moves top->bottom on scroll
            backgroundImage: `url(${childImage})`,
            backgroundPosition: "center top",
          }}
        >
          {activeSection === index ? (
            <AnimatedHeading
              key={activeSection}
              text={heading}
              className="z-20 text-center text-[clamp(1rem,5vw,5rem)] font-normal tracking-[0.5em] w-[90vw] max-w-[1200px]"
            />
          ) : (
            <h2 className="section-heading z-20 text-center text-[clamp(1rem,5vw,5rem)] font-normal tracking-[0.5em] w-[90vw] max-w-[1200px]">
              {heading}
            </h2>
          )}
        </div>
      </div>
    </section>
  );
};

export default SlideSection;
