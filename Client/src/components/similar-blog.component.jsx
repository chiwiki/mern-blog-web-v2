import React from "react";
import { Link } from "react-router-dom";

const SimilarBlog = ({ blog }) => {
  const { title, blog_id, banner, tags } = blog;
  return (
    <div className="w-full flex gap-2 mb-6">
      <img className="w-[120px] h-[120px] object-cover" src={banner} alt="" />
      <div className="flex flex-col gap-2 w-full overflow-clip">
        <p className="text-dark-grey">{tags[0].toUpperCase()}</p>
        <Link
          className="text-black font-bold md:text-2xl hover:underline text-xl"
          to={`/blog/${blog_id}`}
        >
          {title}
        </Link>
      </div>
    </div>
  );
};

export default SimilarBlog;
