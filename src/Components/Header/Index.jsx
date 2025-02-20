import "aos/dist/aos.css";
import AOS from "aos";
import { useEffect, useState } from "react";
import Logo from "../../assets/Svg/logo";
import RoundedButton from "../RoundedButton/Index";

export default function Header() {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    AOS.init();

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full  z-999">
      <div className={`w-full  transition-all duration-300 z-999 relative `}>
        <div className="flex items-center justify-between w-[85%]  mx-auto  pointer-events-auto">
          {/* Logo */}
          <div
            className="relative w-[14.58%] h-[100%] cursor-pointer"
            data-aos="fade-in"
            data-aos-delay="500"
            data-aos-duration="600"
            data-aos-once="true"
          >
            <Logo />
          </div>

          {/* Get In Touch Text */}
          <RoundedButton backgroundColor="#a5854e">
            <p>Download</p>
          </RoundedButton>
        </div>
      </div>
    </header>
  );
}
