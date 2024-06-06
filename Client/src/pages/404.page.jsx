import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../App";

import NotFoundDark from "../imgs/404-dark.png";

import fullLogoDark from "../imgs/full-logo-dark.png";
import { tranlate } from "../utils/language";

const NotFoundPage = () => {
  const { language } = useContext(LanguageContext);
  return (
    <section className=" h-cover relative p-10 flex flex-col items-center gap-20">
      <img
        src={NotFoundDark}
        className="select-none border-2 border-grey w-72 aspect-square object-cover rounded"
      />
      <h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
      <p className="text-dark-grey text-xl leading-7 -mt-8">
        {tranlate.page_not_found.des[language]}{" "}
        <Link to="/" className="text-black underline">
          {tranlate.home_page.home[language]}
        </Link>
      </p>

      <div className="mt-auto">
        <img
          src={fullLogoDark}
          className="h-8 object-contain block mx-auto select-none"
        />
        <p className="mt-5 text-dark-grey">
          {tranlate.page_not_found.footer[language]}
        </p>
      </div>
    </section>
  );
};
export default NotFoundPage;
