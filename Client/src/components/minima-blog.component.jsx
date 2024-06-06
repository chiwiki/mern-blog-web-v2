import React from "react";
import { Link } from "react-router-dom";
import { getDay, getFullDay } from "../common/date";
import AnimationWrapper from "./page-animation.component";

const MinimalBlog = ({ content, author, i }) => {
  let {
    blog_id,
    title,
    publishedAt,
    activity: { total_likes },
  } = content;
  let {
    personal_info: { username, fullname, profile_img },
  } = author;
  return (
    <AnimationWrapper transition={{ delay: i * 0.15 }}>
      <Link
        className="flex gap-5 mb-8 hover:bg-grey/30 px-3 p-2 group"
        to={`/blog/${blog_id}`}
      >
        <h1 className="blog-index hover:text-dark">
          {i < 10 ? "0" + (i + 1) : i + 1}
        </h1>
        <div className="w-full overflow-hidden">
          <div className="flex gap-3 items-center mb-4">
            <img src={profile_img} alt="" className="w-8 h-8 rounded-full" />
            <div>
              <p className="line-clamp-1 text-black font-medium">{fullname}</p>
              <p className="line-clamp-1 hover:text-dark-grey">@{username}</p>
            </div>

            <p className="min-w-fit text-dark-grey">
              {getFullDay(publishedAt)}
            </p>
          </div>
          <h1 className="blog-title ml-12">{title}</h1>
        </div>
      </Link>
    </AnimationWrapper>
  );
};

export default MinimalBlog;
