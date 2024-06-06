import React from "react";
import { Link } from "react-router-dom";
import FullLogo from "../imgs/full-logo-light.png";
const Footer = () => {
  return (
    <footer className="w-screen bg-black flex flex-col justify-center items-center ">
      {/* <div className="grid grid-cols-2 md:grid-cols-4 p-10 max-md:gap-20 gap-20">
        <div className="flex flex-col gap-2">
          <h1 className="capitalize text-white text-2xl mb-2">LEGAL</h1>
          <p className="text-white/70">Terms of Use</p>
          <p className="text-white/70">Privacy Policy</p>
          <p className="text-white/70">Interest-Based Ads</p>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="capitalize text-white text-2xl mb-2">OUR SITE</h1>
          <p className="text-white/70">Nat Geo Home</p>
          <p className="text-white/70">Attend to a live event</p>
          <p className="text-white/70">Book a trip</p>
          <p className="text-white/70">Book a trip</p>
          <p className="text-white/70">Book a trip</p>
          <p className="text-white/70">Book a trip</p>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="capitalize text-white text-2xl mb-2">JOIN US</h1>
          <p className="text-white/70">Subcribe</p>
          <p className="text-white/70">Customer Service</p>
          <p className="text-white/70">Review Subscription</p>
          <p className="text-white/70">Manage Your Subscription</p>
          <p className="text-white/70">Work at Nat Geo</p>
          <p className="text-white/70">Book a trip</p>
        </div>
        <div className="flex flex-col gap-2 ">
          <h1 className="capitalize text-white text-2xl mb-2">FOLLOW US</h1>
          <div className="flex flex-wrap gap-4">
            <Link>
              <i className="fi fi-brands-facebook text-white text-2xl"></i>
            </Link>
            <Link>
              <i className="fi fi-brands-youtube text-white text-2xl"></i>
            </Link>
            <Link>
              <i className="fi fi-brands-tik-tok text-white text-2xl"></i>
            </Link>
            <Link>
              <i className="fi fi-brands-twitter-alt text-white text-2xl"></i>
            </Link>
          </div>
        </div>
      </div> */}

      <div className="mb-3 flex gap-4 w-full max-md:flex-col max-md:gap-2 justify-center items-center border-t border-dark-grey py-4">
        <img src={FullLogo} atl="" className="h-12 object-contain max-w-min" />
        <span className="text-base text-dark-grey">Copyright © 2015-2024</span>
      </div>
    </footer>
  );
};

export default Footer;
