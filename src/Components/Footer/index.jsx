import React, { useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
// import { Link } from "react-router-dom";
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

const footerData = {
  contact: {
    phones: ["+91 94127 27707"],
    email: ["info@plumberbathware.com"],
    address:
      "AQUA PLUMBINGS PVT. LTD./nGaur Udyog Kendra/nDelhi-Mathura Bypass/nMathura - 281001(U.P.), India",
  },
  social: [
    {
      icon: FaFacebookF,
      link: "https://www.facebook.com/",
      label: "Facebook",
    },
    {
      icon: FaInstagram,
      link: "https://www.instagram.com/",
      label: "Instagram",
    },
    {
      icon: FaLinkedinIn,
      link: "https://www.linkedin.com/",
      label: "LinkedIn",
    },
    {
      icon: FaXTwitter,
      link: "https://twitter.com/",
      label: "Twitter",
    },
    {
      icon: FaYoutube,
      link: "https://www.youtube.com/",
      label: "YouTube",
    },
  ],
};

const Index = () => {
  const currentYear = new Date().getFullYear();

  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-500, 0]);

  const ContactIcon = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-2 text-neutral-400">
      <Icon className="w-4 h-4 text-primary" />
      {children}
    </div>
  );

  return (
    <footer className="w-full float-left overflow-hidden">
      <motion.div
        style={{ y }}
        ref={container}
        className="pt-24 flex flex-col items-center justify-center relative bg-[#000d19] text-white/50"
      >
        <div className="container mx-auto max-w-[90%] px-4">
          {/* Top Footer Section */}
          <div className="flex flex-wrap justify-between border-b border-white/10 py-12 md:py-16">
            {/* Logo */}

            {/* Contact Info */}
            <div className="w-full md:w-1/6 mb-8 md:mb-0">
              <ul className="space-y-3 mx-auto w-fit">
                <li className="text-primary font-semibold text-base mb-4">
                  <ContactIcon icon={FaPhoneAlt}>Contact</ContactIcon>
                </li>
                {footerData.contact.phones.map((phone, index) => (
                  <li key={index}>
                    <a
                      href={`tel:${phone}`}
                      className="text-neutral-400 hover:text-neutral-300 text-sm"
                    >
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Email */}
            <div className="w-full md:w-1/6 mb-8 md:mb-0">
              <ul className="space-y-3 mx-auto w-fit">
                <li className="text-primary font-semibold text-base mb-4">
                  <ContactIcon icon={FaEnvelope}>Email</ContactIcon>
                </li>
                {footerData.contact.email.map((email, index) => (
                  <li key={index}>
                    <a
                      href={`mailto:${email}`}
                      className="text-neutral-400 hover:text-neutral-300 text-sm lowercase"
                    >
                      {email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Address */}
            <div className="w-full md:w-1/4 mb-8 md:mb-0">
              <ul className="space-y-3 mx-auto w-fit">
                <li className="text-primary font-semibold text-base mb-4">
                  <ContactIcon icon={FaMapMarkerAlt}>Address</ContactIcon>
                </li>
                <li className="text-neutral-400 text-sm leading-6 whitespace-pre-line">
                  {footerData.contact.address}
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="w-full md:w-1/6">
              <ul>
                <li className="text-primary font-semibold text-base mb-4">
                  Follow on
                </li>
                <div className="flex gap-4">
                  {footerData.social.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={item.label}
                        className="text-neutral-400 hover:text-white transition-colors"
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
          <div className="flex flex-wrap justify-between items-center py-6 border-t border-white/10">
            <p className="text-neutral-400 text-xs ">
              © {currentYear} Plumber Bathware | All rights reserved.
            </p>
            <p className="text-neutral-400 text-xs ">
              <a
                href="https://akashsingh.in/"
                className=" text-xs hover:text-neutral-300"
                rel="nofollow"
                target="_blank"
              >
                site : triverse
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Index;
