import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { LanguageContext, UserAuth } from "../App";
import { BlogContext } from "../pages/blog.page";
import { tranlate } from "../utils/language";
import CommentCard from "./comment-card.component";
import CommentField from "./comment-field.component";
import LoadMore from "./load-more.component";
import NoData from "./no-data.component";
import AnimationWrapper from "./page-animation.component";

export const fetchComment = async ({
  skip = 0,
  setParentCommentLoaded,
  comment_arr = null,
  blog_id,
}) => {
  let res;
  await axios
    .post(import.meta.env.VITE_SERVER + `/comments/${blog_id}`, { skip })
    .then(({ data }) => {
      data.map((comment) => {
        comment.childrenLevel = 0;
      });
      setParentCommentLoaded((prev) => prev + data.length);
      if (comment_arr) {
        res = { results: [...comment_arr, data] };
      } else {
        res = { results: data };
      }
    });

  return res;
};
export const CommentContainerContext = createContext({});
const CommentContainer = () => {
  const [someoneTyping, setSomeoneTyping] = useState(false);
  const { socket } = useContext(UserAuth);
  let {
    blog: {
      blog_id,
      activity: { total_parent_comments },
      comments: { results: comment_arr },
    },
    blog,
    setBlog,
    commentWrapper,
    setCommentWrapper,
    parentCommentLoaded,
    setParentCommentLoaded,
  } = useContext(BlogContext);

  const { language } = useContext(LanguageContext);
  const loadMoreComments = async () => {
    const comments = await fetchComment({
      blog_id: blog._id,
      setParentCommentLoaded,
      skip: parentCommentLoaded,
      comment_arr,
    });
    const new_comment_arr = comments.results[parentCommentLoaded];
    setBlog({
      ...blog,
      comments: { results: [...comment_arr, ...new_comment_arr] },
    });
  };
  useEffect(() => {
    socket?.on("sendTyping", (data) => {
      setSomeoneTyping(true);
    });
    socket?.on("sendComment", (data) => {
      console.log("comddddddd: ", data);
      if (data.parentIndex !== undefined) {
        console.log(data.parentIndex);

        comment_arr[data.parentIndex].replyLoaded = true;
        console.log("parent comment: ", comment_arr[data.parentIndex]);
        comment_arr[data.parentIndex].children.length += 1;

        comment_arr.splice(data.parentIndex + 1, 0, data);
      } else {
        comment_arr.splice(0, 0, data);
        setParentCommentLoaded((prev) => prev + 1);
      }

      setBlog({
        ...blog,
        comments: { results: [...comment_arr] },
      });
    });
  }, [socket]);
  console.log("p-c", total_parent_comments);
  console.log("pcl", parentCommentLoaded);
  return (
    <CommentContainerContext.Provider
      value={{ someoneTyping, setSomeoneTyping }}
    >
      <div
        className={`max-sm:w-full w-[300px] fixed  ${
          commentWrapper
            ? "top-0 sm:right-0 border-t-1 rounded-t-3xl"
            : "top-[100%] right-[-100%]"
        } duration-700 max-sm:right-0 sm:top-0 w-[40%] min-w-[350px] h-[800px] z-50 bg-white shadow-2xl p-8 overflow-y-scroll px-16 overflow-x-scroll pr-[20px]`}
      >
        <div className="relative">
          <h1 className="font-bold text-xl">{tranlate.comment[language]}</h1>
          <p className=" text-lg mt-2 w-[70%] text-dark-grey"></p>
          <button
            onClick={() => setCommentWrapper(false)}
            className="absolute top-0 right-0 "
          >
            <i className="fi fi-br-cross text-xl w-10 h-10 flex justify-center items-center rounded-full bg-grey/30"></i>
          </button>
          <hr className="border-grey my-8 w-[110%] -ml-10 " />
        </div>
        <CommentField action={"Comment"} />

        {/* {someoneTyping && <h1>Someone is commenting...</h1>} */}
        {comment_arr && comment_arr.length ? (
          <>
            {comment_arr.map((data, i) => {
              return (
                <AnimationWrapper key={i}>
                  <CommentCard
                    commentData={data}
                    lefVal={data.childrenLevel}
                    index={i}
                  />
                </AnimationWrapper>
              );
            })}
          </>
        ) : (
          <NoData message={"No comment"} />
        )}

        {total_parent_comments > parentCommentLoaded ? (
          <button
            onClick={loadMoreComments}
            className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2 "
          >
            {tranlate.load_more[language]}
          </button>
        ) : (
          ""
        )}
      </div>
    </CommentContainerContext.Provider>
  );
};

export default CommentContainer;
