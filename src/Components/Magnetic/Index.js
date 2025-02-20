import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Index = ({ children }) => {
  const magnetic = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);

  useEffect(() => {
    if (magnetic.current) {
      const element = magnetic.current; // Store the current value in a local variable

      xTo.current = gsap.quickTo(element, "x", {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
      yTo.current = gsap.quickTo(element, "y", {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });

      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = element.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        xTo.current(x * 0.35);
        yTo.current(y * 0.35);
      };

      const handleMouseLeave = () => {
        xTo.current(0);
        yTo.current(0);
      };

      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [magnetic]);

  return React.cloneElement(children, { ref: magnetic });
};

export default Index;
