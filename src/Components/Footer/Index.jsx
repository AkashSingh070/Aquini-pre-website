import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { LuDownload } from "react-icons/lu";
import brochure from "../../assets/Aquini_Product_Catalogue.pdf";

const footerData = {
  contact: {
    phones: ["+91 94127 27707"],
    email: ["sales@aquini.com"],
    address:
      "AQUA PLUMBINGS PVT. LTD.<br/>Gaur Udyog Kendra<br/>Delhi-Mathura Bypass<br/>Mathura - 281001(U.P.), India",
  },
  social: [
    {
      icon: FaInstagram,
      link: "https://www.instagram.com/aquini.india?igsh=YXp5ZDgxajlzMDJ4",
      label: "Instagram",
    },
    {
      icon: FaLinkedinIn,
      link: "https://www.linkedin.com/company/aquini/",
      label: "LinkedIn",
    },
  ],
};

const Index = ({ isActive, isMobile }) => {
  const currentYear = new Date().getFullYear();

  const ContactIcon = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-2 primary-color fill-primary  mx-auto md:mx-0 justify-center md:justify-start">
      <Icon className="sm:!w-8 sm:!h-8 !w-6 !h-6  primary-color fill-primary" />
      {children}
    </div>
  );

  return (
    <footer className="w-full float-left overflow-hidden">
      <div className="pt-24 flex flex-col items-center justify-center relative bg-black text-white/90">
        <div
          className={`container mx-auto max-w-[90%] px-4 opacity-0 ease duration-1000 delay-1000 ${
            isActive === 3 ? "opacity-100" : ""
          }`}
        >
          {/* Download Section */}
          <div className="flex justify-center items-center flex-col w-full">
            <div
              // Changed w-1/2 to w-full on mobile, remains w-1/2 on md and above
              className="title titleFooter w-full xl:w-1/2 text-[18px] tracking-[1.5px]  items-center justify-center mb-10 hidden md:flex"
            >
              <h2 className="!text-center text-wrap !opacity-100">
                Stay Tuned for More
                <br /> Dive into the Aquini Consumer Handbook
              </h2>
            </div>
            <span className="uppercase primary-color Heading_font sm:text-[16px] text-[15px] tracking-[1.5px] mx-auto inline-block sm:mb-10 mb-7 ">
              Download {isMobile ? "Brochure" : "Now"}
            </span>
            <a href={brochure} target="_blank">
              <i className="primary-color fill-primary text-[40px]">
                <LuDownload />
              </i>
            </a>
          </div>

          {/* Top Footer Section */}
          <div className="flex flex-wrap justify-center md:justify-between border-y border-white/10 py-9 my-10 xl:py-24 md:py-12 md:my-10">
            {/* Contact Info */}
            <div className="w-1/2 xl:w-1/6 px-2  mb-10 xl:mb-0 text-center md:text-left">
              <ul className="space-y-3 mx-auto w-fit">
                <li className="primary-color font-semibold text-xl mb-4">
                  <ContactIcon icon={FaPhoneAlt} />
                </li>
                {footerData.contact.phones.map((phone, index) => (
                  <li key={index}>
                    <a
                      href={`tel:9412727707`}
                      className="text-neutral-300 hover:text-white tracking-[1.5px]"
                    >
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Address */}
            <div className="w-1/2 xl:w-1/4 mb-10 xl:mb-0 text-center md:text-left">
              <ul className="space-y-3 mx-auto w-fit">
                <li className="primary-color font-semibold text-xl mb-4 mx-auto ">
                  <ContactIcon icon={FaMapMarkerAlt} />
                </li>
                <li
                  className="text-neutral-300 hover:text-white whitespace-pre-line tracking-[1.5px] leading-[1.5] uppercase"
                  dangerouslySetInnerHTML={{
                    __html: footerData.contact.address,
                  }}
                ></li>
              </ul>
            </div>

            {/* Email */}
            <div className="w-1/2 xl:w-1/6 px-2  xl:mb-0 text-center md:text-left">
              <ul className="space-y-3 mx-auto w-fit">
                <li className="primary-color font-semibold text-xl mb-4">
                  <ContactIcon icon={FaEnvelope} />
                </li>
                {footerData.contact.email.map((email, index) => (
                  <li key={index}>
                    <a
                      href={`mailto:${email}`}
                      className="text-neutral-300 hover:text-white  tracking-[1.5px] uppercase"
                    >
                      {email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            <div className="w-1/2 xl:w-1/6 px-2   xl:mb-0 text-center md:text-left">
              <ul className="space-y-3 mx-auto w-fit">
                <li className="primary-color font-semibold text-xl mb-4">
                  Follow on
                </li>
                <div className="flex gap-3 justify-center md:justify-start">
                  {footerData.social.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={item.label}
                        className="hover:text-white transition-colors text-neutral-300"
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              </ul>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:py-6 py-3 mx-auto text-center md:text-left">
            <p className="!text-neutral-300 text-xs">
              © {currentYear} Plumber | All rights reserved.
            </p>
            <p className="!text-neutral-300 hover:text-white text-xs">
              <a
                href="https://triverseadvertising.com/"
                className="text-xs"
                rel="nofollow"
                target="_blank"
              >
                site : triverse
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Index;
