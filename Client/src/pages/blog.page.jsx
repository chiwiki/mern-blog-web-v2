import axios from "axios";
import { delay } from "framer-motion";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LanguageContext, UserAuth } from "../App";
import { getFullDay } from "../common/date";
import BlogContent from "../components/blog-content.component";
import BlogInteraction from "../components/blog-interation.component";

import CommentContainer, {
  fetchComment,
} from "../components/comment-container.component";
import Loader from "../components/loader.component";
import AnimationWrapper from "../components/page-animation.component";
import SimilarBlog from "../components/similar-blog.component";
import TableOfContent from "../components/table-of-content.component";
import { tranlate } from "../utils/language";

export let blogStructure = {
  banner: "",
  title: "",
  des: "",
  tags: [],
  content: "",
  author: {
    personal_info: {},
  },
  publishedAt: "",
};
export const BlogContext = createContext(blogStructure);
const BlogPage = () => {
  const { blog_id } = useParams();
  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(blogStructure);
  const [loading, setLoading] = useState(true);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [commentWrapper, setCommentWrapper] = useState(true);
  const [parentCommentLoaded, setParentCommentLoaded] = useState(0);
  let {
    userAuth: { access_token },
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  console.log("blog page:", access_token);
  const fetchBlog = () => {
    axios
      .put(import.meta.env.VITE_SERVER + `/blogs/${blog_id}`)
      .then(async ({ data }) => {
        data.comments = await fetchComment({
          blog_id: data._id,
          setParentCommentLoaded,
        });
        document.title = data.title;
        console.log("blog: ", data);
        await axios
          .post(import.meta.env.VITE_SERVER + "/blogs/search", {
            tag: data.tags[0],
            limit: 6,
          })
          .then(({ data: { blogs } }) => {
            blogs = blogs.filter((blog) => blog.blog_id !== blog_id);
            setSimilarBlogs(blogs);
          });

        setBlog(data);
        setLoading(false);
      });
  };
  const tableOfContent = [];
  useEffect(() => {
    resetState();
    fetchBlog();
  }, [blog_id]);
  const resetState = () => {
    setIsLikedByUser(false);
    setBlog(blogStructure);
    setSimilarBlogs(blogStructure);
    setLoading(true);
    setCommentWrapper(false);
    setParentCommentLoaded(0);
  };
  let {
    banner,
    title,
    content,
    des,
    tags,
    publishedAt,
    author: {
      personal_info: { username: author_name, profile_img, fullname },
    },
  } = blog;
  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider
          value={{
            blog,
            setBlog,
            similarBlogs,
            setSimilarBlogs,
            isLikedByUser,
            setIsLikedByUser,
            commentWrapper,
            setCommentWrapper,
            parentCommentLoaded,
            setParentCommentLoaded,
          }}
        >
          <CommentContainer />
          <div className="max-w-[900px] center max-lg:px-[5vw]">
            <img src={banner} alt="" className="aspect-video" />
            <div className="mt-12">
              <h2>{title}</h2>
              <p className="font-gelasio">{des}</p>
              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img
                    src={profile_img}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                  <p className="capitalize">
                    {fullname} <br />
                    <Link to={`/user/${author_name}`} className="underline">
                      @{author_name}
                    </Link>
                  </p>
                </div>
                <p className="text-dark-grey max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  {tranlate.published_on[language]} {getFullDay(publishedAt)}
                </p>
              </div>
            </div>
            <BlogInteraction />
            <div className="my-7 font-gelasio blog-page-content">
              {content[0].blocks.map((block, i) => {
                const { type, data } = block;
                if (type === "header") {
                  tableOfContent.push(data);
                }
              })}
              <TableOfContent data={tableOfContent} />
              {content[0].blocks.map((block, i) => {
                return (
                  <div className="my-4 md:my-8 " key={i}>
                    <BlogContent block={block} />
                  </div>
                );
              })}
            </div>
            <BlogInteraction />
            <div className="h-[1px] bg-orange-300 w-full"></div>
            {similarBlogs && similarBlogs.length ? (
              <div className="mb-12">
                <h1 className="mt-10 text-2xl font-bold">
                  {tranlate.similar_blogs[language]}
                </h1>
                <hr className="w-[100px] bg-dark-grey mb-8" />
                {similarBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.8 }}
                    >
                      <SimilarBlog blog={blog} />
                    </AnimationWrapper>
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
