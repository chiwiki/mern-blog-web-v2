import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LanguageContext, UserAuth } from "../App";
import { getFullDay } from "../common/date";
import { tranlate } from "../utils/language";

export const BlogStats = ({ stats }) => {
  const { language } = useContext(LanguageContext);
  return (
    <div className="flex gap-2 border-grey max-lg:border-b max-lg:mb-6 max-lg:pb-6 ">
      {Object.keys(stats).map((key, i) => {
        return !key.includes("parent") ? (
          <div
            className={`flex flex-col items-center w-full h-full justify-center p-4 px-6 ${
              i != 0 ? "border-l-2 border-l-grey" : ""
            }`}
            key={i}
          >
            <h1 className="text-xl lg:text-2xl font-medium mb-2">
              {stats[key].toLocaleString()}
            </h1>
            <p className="capitalize">
              {tranlate.dashboard_blogs[key.split("_")[1]][language]}
            </p>
          </div>
        ) : (
          ""
        );
      })}
    </div>
  );
};
export const ManagePublishedBlogCard = ({ blog }) => {
  let [showStat, setShowStat] = useState(false);
  let [popup, setPopup] = useState(false);

  let { blog_id, activity, banner, title, publishedAt, index } = blog;
  let {
    userAuth: { access_token },
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  return (
    <>
      <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
        <img
          src={banner}
          className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover"
          alt=""
        />
        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div className="">
            <Link
              to={`/blog/${blog_id}`}
              className="blog-title mb-4 hover:underline"
            >
              {title}
            </Link>
            <p>
              {tranlate.published_on[language]} {getFullDay(publishedAt)}
            </p>
          </div>
          <div className="flex gap-6 mt-3">
            <Link to={`/edit/${blog_id}`} className="pr-4 py-2 underline">
              {tranlate.edit[language]}
            </Link>
            <button
              onClick={() => setShowStat((preVal) => !preVal)}
              className="lg:hidden pr-4 py-2 underline
          "
            >
              {tranlate.dashboard_blogs.stats[language]}
            </button>
            <button
              onClick={(e) => setPopup(true)}
              className="pr-4 py-2 underline
           text-red"
            >
              {tranlate.delete[language]}
            </button>
            {popup && (
              <div className="fixed w-screen h-screen top-0 left-0 bg-grey/50 flex items-center justify-center overscroll-contain">
                <div className="bg-white w-[300px]  relative">
                  <div className="flex justify-between items-center  bg-[#FF0000]">
                    <p className="text-white text-xl pl-4">
                      {tranlate.warning[language]}
                    </p>
                    <button
                      className="h-[45px] w-[45px] flex items-center justify-center hover:bg-grey/30 rounded-full"
                      onClick={() => setPopup(false)}
                    >
                      <i className="fi fi-rr-cross text-[15px]"></i>
                    </button>
                  </div>
                  <div className="mt-[20px] px-3">
                    <div className="flex gap-4 items-start justify-center  mb-5">
                      <i
                        className="fi fi-ss-triangle-warning text-[20px]"
                        style={{ color: "red" }}
                      ></i>
                      <p className="text-xl">{tranlate.warn[language]}</p>
                    </div>
                    <div className="flex justify-end items-center gap-4 mt-2    w-[300px] py-2  px-6">
                      <button
                        className="bg-grey border px-4 py-2 hover:opacity-80"
                        onClick={() => setPopup(false)}
                      >
                        {tranlate.cancel[language]}
                      </button>
                      <button
                        className="border bg-[#FF0000] text-white px-4 py-2 hover:opacity-80"
                        onClick={async (e) => {
                          await deleteBlog(blog, access_token, e.target);
                          setPopup(false);
                        }}
                      >
                        {tranlate.confirm[language]}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="max-lg:hidden">
          <BlogStats stats={activity} />
        </div>
      </div>

      {showStat ? (
        <div className="lg:hidden ">
          <BlogStats stats={activity} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export const ManageDraftBlogCard = ({ draft }) => {
  let { title, des, blog_id, index } = draft;
  let {
    userAuth: { access_token },
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  return (
    <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey">
      <h1 className="blog-index text-center pl-4 md:pl=6 flex-none">
        {index < 10 ? "0" + index : index}{" "}
      </h1>

      <div className="">
        <h1 className="blog-title mb-3">{title}</h1>
        <p className="line-clamp-2 font-gelasio">
          {des.length ? des : "No Description"}
        </p>
        <div className="flex gap-6 mt-3">
          <Link to={`/edit/${blog_id}`} className="pr-4 py-2 underline">
            {tranlate.edit[language]}
          </Link>
          <button
            onClick={(e) => deleteBlog(draft, access_token, e.target)}
            className="pr-4 py-2 underline text-red"
          >
            {tranlate.delete[language]}
          </button>
        </div>
      </div>
    </div>
  );
};

const deleteBlog = (blog, access_token, target) => {
  let { index, blog_id, setStateFunc, blogs } = blog;
  target.setAttribute("disabled", true);

  axios
    .delete(import.meta.env.VITE_SERVER + `/blogs/${blog_id}`, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    })
    .then(({ data }) => {
      console.log("deleted blog: ", data);
      target.removeAttribute("disabled");
      setStateFunc((preVal) => {
        let { deletedDocCount, totalDocs, results } = preVal;
        console.log("prev blogs: ", preVal);
        console.log("deleted count: ", deletedDocCount);
        results.splice(index, 1);
        if (results.length === 0 && totalDocs - 1 === 0) {
          return null;
        }
        return {
          ...preVal,
          totalDocs: totalDocs - 1,
          deletedDocCount: deletedDocCount + 1,
        };
      });

      setTimeout(() => {
        console.log("blog after update: ", blogs);
      }, 500);
    })
    .catch((err) => {
      console.log(err);
    });
};
