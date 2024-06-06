import axios from "axios";
import React, { useContext, useState } from "react";
import { LanguageContext, UserAuth } from "../App";
import { BlogContext } from "../pages/blog.page";
import { toast } from "react-hot-toast";
import {
  CommentContainerContext,
  fetchComment,
} from "./comment-container.component";
import { tranlate } from "../utils/language";
const CommentField = ({
  action,
  index = undefined,
  replyingTo = undefined,
  setReplying,
}) => {
  const [comment, setComment] = useState("");
  let { someoneTyping, setSomeoneTyping } = useContext(CommentContainerContext);
  let {
    blog: {
      author,
      author: {
        personal_info: { username: author_username },
      },
      blog_id,
      _id,
      comments,
      comments: { results: commentArr },
      activity,
      activity: { total_parent_comments, total_comments },
    },
    blog,
    setBlog,
    parentCommentLoaded,
    setParentCommentLoaded,
  } = useContext(BlogContext);
  let {
    userAuth: { access_token },
    socket,
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  const handleComment = (e) => {
    if (!access_token) {
      return toast.error("You need to login");
    }
    if (!comment.length) {
      return toast.error("You need to write something to comment");
    }
    e.target.setAttribute("disabled", true);
    axios
      .post(
        import.meta.env.VITE_SERVER + "/comments",
        {
          comment,
          blog_author: author._id,
          _id,
          replying_to: replyingTo?._id,
        },
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      )
      .then(async ({ data: { comment: data2, notification } }) => {
        setComment("");
        e.target.removeAttribute("disabled");
        let newCommentArr;
        if (replyingTo) {
          const dt = { ...notification, notification_for: replyingTo.username };
          socket.emit("interact", dt);

          commentArr[index].children.push(data2._id);
          data2.childrenLevel = commentArr[index].childrenLevel + 1;
          data2.parentIndex = index;
          socket.emit("comment", data2);

          commentArr[index].isReplyLoaded = true;
          commentArr.splice(index + 1, 0, data2);
          newCommentArr = commentArr;
          setReplying(false);
        } else {
          data2.childrenLevel = 0;
          newCommentArr = [data2, ...commentArr];
          const dt = { ...notification, notification_for: author_username };
          socket.emit("interact", dt);
          socket.emit("comment", data2);
        }
        let parentCommentIncrementVal = replyingTo ? 0 : 1;
        setBlog({
          ...blog,
          comments: {
            ...comments,
            results: newCommentArr,
          },
          activity: {
            ...activity,
            total_comments: total_comments + 1,
            total_parent_comments:
              total_parent_comments + parentCommentIncrementVal,
          },
        });
        setParentCommentLoaded(
          (prevVal) => prevVal + parentCommentIncrementVal
        );
      })
      .catch((error) => {
        console.log(error.message);
        toast.error(error.message);
        setComment("");
        e.target.removeAttribute("disabled");
      });
  };

  // const debounce = (func, delay) => {};
  // let delay = 0;
  // let timeInteval;
  const handleTyping = (e) => {
    // clearInterval(timeInteval);
    // delay = 0;
    setComment(e.target.value);
    // setSomeoneTyping(true);
    socket.emit("typing", { message: "someone typing comment" });

    // timeInteval = setInterval(() => {
    //   delay += 1;
    //   console.log("delay: ", delay);
    //   if (delay === 5) {
    //     setSomeoneTyping(false);
    //     clearInterval(timeInteval);
    //     return;
    //   }
    // }, 1000);

    // debounce(setSomeoneTyping, 3000);
  };

  return (
    <>
      <textarea
        onChange={handleTyping}
        value={comment}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button onClick={handleComment} className="btn-dark mt-5 px-10">
        {/* {tranlate[`${action}`][language]} */}
        {action}
      </button>
    </>
  );
};

export default CommentField;
