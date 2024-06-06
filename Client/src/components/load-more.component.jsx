import React, { useContext } from "react";
import { LanguageContext } from "../App";
import { tranlate } from "../utils/language";

const LoadMore = ({ state, fetchDataFunc, additionalParams }) => {
  const { language } = useContext(LanguageContext);
  console.log("additional params: ", additionalParams);
  if (state !== null && state.totalDocs > state.results.length) {
    return (
      <button
        onClick={() =>
          fetchDataFunc({ ...additionalParams, page: state.page + 1 })
        }
        className="text-dark-grey p-2 px-3 flex items-center hover:bg-grey/30 border border-grey mx-auto max-w-[100px] my-5"
      >
        {tranlate.load_more[language]}
      </button>
    );
  }
};

export default LoadMore;
