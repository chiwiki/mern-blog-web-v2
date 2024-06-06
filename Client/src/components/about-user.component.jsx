import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../App";
import { getFullDay } from "../common/date";
import { tranlate } from "../utils/language";

const AboutUser = ({ className, social_links, bio, joinedAt }) => {
  const { language } = useContext(LanguageContext);
  console.log({ social_links });
  const navigate = useNavigate();
  return (
    <div className={className}>
      <p>{bio}</p>
      <div className="flex flex-wrap gap-2">
        {social_links &&
          Object.entries(social_links).map(([key, value], i) => {
            console.log({ key, value });

            return (
              <Link
                to={value}
                className="bg-grey w-[50px] h-[50px] rounded-full flex items-center justify-center hover:bg-grey/70  mt-5 mb-3"
              >
                {value.length ? (
                  value !== "website" ? (
                    <i
                      className={`fi fi-brands-${key} text-[20px] flex justify-center items-center`}
                    ></i>
                  ) : (
                    <i className="fi fi-sr-globe"></i>
                  )
                ) : null}
              </Link>
            );
          })}
      </div>

      <p>
        {tranlate.joined_at[language]} {getFullDay(joinedAt)}
      </p>
    </div>
  );
};

export default AboutUser;
