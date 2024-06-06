import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import InpageNavigation, {
  activeTagRef,
} from "../components/inpage-navigation";
import AnimationWrapper from "../components/page-animation.component";
import NoData from "../components/no-data.component";

import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post-card.component";
import { filterPaginationData } from "../common/filterPaginationData";
import { LanguageContext, UserAuth } from "../App";
import MinimalBlog from "../components/minima-blog.component";
import LoadMore from "../components/load-more.component";
import { tranlate } from "../utils/language";

const Homepage = () => {
  let {
    userAuth: { username, access_token },
    socket,
    notifications,
    setNotifications,
    userAuth,
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  const catogories = [
    "chuyện tìm việc",
    "đàm phán công việc",
    "hồ sơ xin việc",
    "mẹo phỏng vấn",
    "học tập",
    "hướng nghiệp",
    "kỹ năng cứng và mềm",
  ];
  const [blogs, setBlogs] = useState(null);
  const [pageState, setPageState] = useState(tranlate.home_page.home[language]);
  const [trendingBlogs, setTrendingBlogs] = useState(null);

  const fetchLatestBlog = ({ page = 1 }) => {
    const body = { page: page };
    axios
      .post(import.meta.env.VITE_SERVER + "/blogs/latest-blogs", body)
      .then(async ({ data }) => {
        const filterFormData = await filterPaginationData({
          state: blogs,
          data: data,
          countRoute: "/blogs/count-latest-blogs",
          page,
        });
        setBlogs(filterFormData);
      })
      .catch((error) => console.log(error));
  };
  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER + "/blogs/trending")
      .then(({ data }) => {
        setTrendingBlogs(data);
      })
      .catch((error) => console.log(error));
  };
  const fetchTagBlogs = ({ page = 1 }) => {
    console.log("blog:", blogs);
    console.log("pageState: ", pageState);
    axios
      .post(import.meta.env.VITE_SERVER + "/blogs/search", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        console.log("data: ", data);
        const filterFormData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          countRoute: "/blogs/count-search-blogs",
          page,
          data_to_send: { tag: pageState },
        });

        setBlogs(filterFormData);
        console.log(filterFormData);
      });
  };
  const handleChangeTag = (button, i) => {
    let category = button.innerText.toLowerCase();
    setBlogs(null);
    if (pageState == category) {
      setPageState(tranlate.home_page.home[language]);
    } else {
      setPageState(category);
    }
  };
  useEffect(() => {
    if (username) {
      socket.emit("newUser", { username: username });
    }
  }, [userAuth]);
  useEffect(() => {
    activeTagRef.current.click();
    if (pageState === tranlate.home_page.home[language]) {
      fetchLatestBlog({ page: 1 });
    } else {
      fetchTagBlogs({ page: 1 });
    }
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);
  useEffect(() => {
    setPageState(tranlate.home_page.home[language]);
    setBlogs(null);
  }, [language]);
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InpageNavigation
            routes={[pageState, tranlate.home_page.trending[language]]}
            defaultHidden={[tranlate.home_page.trending[language]]}
          >
            <div>
              {blogs === null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => (
                  <BlogPostCard key={i} content={blog} author={blog.author} />
                ))
              ) : (
                <NoData message={"No blog"} />
              )}
              <LoadMore
                state={blogs}
                fetchDataFunc={
                  pageState == `${tranlate.home_page.home[language]}`
                    ? fetchLatestBlog
                    : fetchTagBlogs
                }
              />
            </div>
            <div>
              {trendingBlogs === null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => {
                  return (
                    <MinimalBlog
                      key={i}
                      i={i}
                      content={blog}
                      author={blog.author}
                    />
                  );
                })
              ) : (
                <NoData message={"No blog"} />
              )}
            </div>
          </InpageNavigation>
        </div>
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="tex-xl font-medium mb-8">
                {tranlate.home_page.tags[language]}
              </h1>
              <div className="flex gap-2 flex-wrap ">
                {catogories.map((category, i) => {
                  return (
                    <button
                      key={i}
                      className={`tag ${
                        pageState == category ? "bg-black text-white" : " "
                      }`}
                      onClick={(e) => handleChangeTag(e.target, i)}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <h1 className="tex-xl font-medium mb-8">
                {tranlate.home_page.trending[language]}{" "}
                <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              <div className="mt-2">
                {trendingBlogs === null ? (
                  <Loader />
                ) : trendingBlogs.length ? (
                  trendingBlogs.map((blog, i) => {
                    return (
                      <MinimalBlog
                        key={i}
                        i={i}
                        content={blog}
                        author={blog.author}
                      />
                    );
                  })
                ) : (
                  <NoData message={"No blog"} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Homepage;
