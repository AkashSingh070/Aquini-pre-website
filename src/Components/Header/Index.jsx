import { use } from "framer-motion/m";
import Logo from "../../assets/Svg/Logo.jsx";
import RoundedButton from "../RoundedButton/Index";
import Aos from "aos";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import brochure from "../../assets/Aquini_Product_Catalogue.pdf";

export default function Header({ isLoaded, onDownload, onLogo }) {
  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full  z-999">
      <div className={`w-full  z-999 relative `}>
        <div className="flex items-center md:justify-between justify-center w-[94%]  mx-auto  ">
          {/* Logo */}
          <div
            className={`w-[180px] sm:w-[160px] lg:w-[180px] 2xl:w-[240px] cursor-pointer opacity-0 ease duration-400 delay-200 ${
              isLoaded ? "opacity-100" : ""
            }`}
            onClick={onLogo}
          >
            <Logo />
          </div>
          <a href={brochure} target="_blank" >
            <div
              className={`mx-3 opacity-0 ease duration-400 delay-200 hidden md:inline-block ${
                isLoaded ? "opacity-100" : ""
              }`}
            >
              {/* Get In Touch Text */}
              <RoundedButton backgroundColor="#a5854e">
                <p>Download</p>
              </RoundedButton>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
}
