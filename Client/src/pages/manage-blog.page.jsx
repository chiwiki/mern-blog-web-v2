import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LanguageContext, UserAuth } from "../App";
import { filterPaginationData } from "../common/filterPaginationData";
import InpageNavigation from "../components/inpage-navigation";
import LoadMore from "../components/load-more.component";
import Loader from "../components/loader.component";
import {
  ManageDraftBlogCard,
  ManagePublishedBlogCard,
} from "../components/manage-blogcard.component";
import NoData from "../components/no-data.component";
import AnimationWrapper from "../components/page-animation.component";
import { tranlate } from "../utils/language";
const ManageBlogPage = () => {
  let activeTab = useSearchParams()[0].get("tab");
  const [blogs, setBlogs] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [query, setQuery] = useState("");
  let {
    userAuth: { access_token },
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
    console.log("draft: ", draft);
    axios
      .post(
        import.meta.env.VITE_SERVER + "/blogs/blogs-written-by-user",
        { page, draft, query, deletedDocCount },
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      )
      .then(async ({ data }) => {
        let fommatedData = await filterPaginationData({
          state: draft ? drafts : blogs,
          data: data.blogs,
          page,
          user: access_token,
          countRoute: "/blogs/user-written-blogs-count",
          data_to_send: { draft, query },
        });
        console.log(fommatedData);
        if (draft) {
          setDrafts(fommatedData);
        } else {
          setBlogs(fommatedData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (e) => {
    if (!e.target.value.length) {
      setQuery("");
      setBlogs(null);
      setDrafts(null);
    }
  };

  const handleSearch = (e) => {
    let searchQuery = e.target.value;
    setQuery(searchQuery);

    if (e.keyCode == 13 && searchQuery.length > 0) {
      setBlogs(null);
      setDrafts(null);
    }
  };
  useEffect(() => {
    if (access_token) {
      if (blogs == null) {
        console.log("blogssss");
        getBlogs({ page: 1, draft: false });
      }
      if (drafts == null) {
        console.log("draftsssss");
        getBlogs({ page: 1, draft: true });
      }
    }
  }, [access_token, query]);
  return (
    <>
      <h1 className="max-md:hidden font-bold">
        {tranlate.dashboard_blogs.manage_blog[language]}
      </h1>
      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
          placeholder={tranlate.navbar.search_blog[language]}
          onKeyDown={handleSearch}
          onChange={handleChange}
        />
        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <InpageNavigation
        routes={["Blogs", "Drafts"]}
        defaultActiveIndex={activeTab != "draft" ? 0 : 1}
      >
        {blogs == null ? (
          <Loader />
        ) : blogs.results.length ? (
          <>
            <h1 className=" font-bold text-[18px] mb-2">
              Count {query.length > 0 ? `"${query}"` : ""}{" "}
              {blogs.results.length} of {blogs.totalDocs}{" "}
            </h1>
            <hr className="w-full border-grey" />
            {blogs.results.map((blog, i) => {
              return (
                <AnimationWrapper transiton={{ delay: i * 0.04 }} key={i}>
                  <ManagePublishedBlogCard
                    blog={{
                      ...blog,
                      index: i,
                      setStateFunc: setBlogs,
                      blogs: blogs,
                    }}
                  />
                </AnimationWrapper>
              );
            })}

            <LoadMore
              state={blogs}
              fetchDataFunc={getBlogs}
              additionalParams={{
                draft: false,
                deletedDocCount: blogs.deletedDocCount,
              }}
            />
          </>
        ) : (
          <NoData message={"No published Blog"} />
        )}

        {drafts == null ? (
          <Loader />
        ) : drafts.results.length ? (
          <>
            <h1 className=" font-bold text-[18px] mb-2">
              Count {query.length > 0 ? `"${query}"` : ""}{" "}
              {drafts.results.length} of {drafts.totalDocs}{" "}
            </h1>
            <hr className="w-full border-grey" />
            {drafts.results.map((draft, i) => {
              return (
                <AnimationWrapper transiton={{ delay: i * 0.04 }} key={i}>
                  <ManageDraftBlogCard
                    draft={{ ...draft, index: i, setStateFunc: setDrafts }}
                  />
                </AnimationWrapper>
              );
            })}
            <LoadMore
              state={drafts}
              fetchDataFunc={getBlogs}
              additionalParams={{
                draft: true,
                deletedDocCount: drafts.deletedDocCount,
              }}
            />
          </>
        ) : (
          <NoData message={"No published Blog"} />
        )}
      </InpageNavigation>
    </>
  );
};

export default ManageBlogPage;
