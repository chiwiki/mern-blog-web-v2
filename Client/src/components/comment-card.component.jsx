import axios from "axios";
import React, { useContext, useState } from "react";
import { LanguageContext, UserAuth } from "../App";
import { getFullDay } from "../common/date";
import { BlogContext } from "../pages/blog.page";
import CommentField from "./comment-field.component";
import { toast } from "react-hot-toast";
import { tranlate } from "../utils/language";
const CommentCard = ({ index, commentData, lefVal }) => {
  const [replying, setReplying] = useState(false);

  let {
    commented_by: {
      personal_info: { username: username_comment, fullname, profile_img },
    },
    commentedAt,
    comment,
    children,
    _id,
  } = commentData;

  const {
    setBlog,
    blog,
    blog: {
      comments,
      comments: { results: commentsArr },
      author: {
        personal_info: { username: username_author },
      },
      activity,
      activity: { total_parent_comments },
    },
    setParentCommentLoaded,
    parentCommentLoaded,
  } = useContext(BlogContext);

  let {
    userAuth: { username, access_token },

    setUserAuth,
  } = useContext(UserAuth);

  const { language } = useContext(LanguageContext);

  console.log(username);
  const parentCommentIndex = () => {
    let startingPoint = index - 1;
    try {
      while (
        commentsArr[startingPoint].childrenLevel >
        commentsArr[index].childrenLevel
      ) {
        startingPoint--;
      }
    } catch (error) {
      startingPoint = undefined;
    }
    return startingPoint;
  };
  const loadReplies = ({ skip = 0 }) => {
    axios
      .post(import.meta.env.VITE_SERVER + "/comments/replies", { skip, _id })
      .then(({ data }) => {
        commentData.replyLoaded = true;
        for (let i = 0; i < data.length; i++) {
          data[i].childrenLevel = commentData.childrenLevel + 1;
          commentsArr.splice(index + 1 + i + skip, 0, data[i]);
        }
        setBlog({ ...blog, comments: { ...comments, results: commentsArr } });
      });
  };

  const removeCommentCard = (startingPoint, isDelete = false) => {
    if (commentsArr[startingPoint]) {
      while (
        commentsArr[startingPoint].childrenLevel >
        commentsArr[index].childrenLevel
      ) {
        commentsArr.splice(startingPoint, 1);
        if (!commentsArr[startingPoint]) {
          break;
        }
      }
    }
    if (isDelete) {
      let parentIndex = parentCommentIndex();
      console.log("parent index", parentIndex);
      if (parentIndex != undefined) {
        console.log("parent index", parentIndex);
        commentsArr[parentIndex].children = commentsArr[
          parentIndex
        ].children.filter((child) => child != _id);
        if (!commentsArr[parentIndex].children.length) {
          commentsArr[parentIndex].replyLoaded = false;
        }
      }

      commentsArr.splice(index, 1);
    }
    if (commentData.childrenLevel === 0 && isDelete) {
      setParentCommentLoaded((preVal) => preVal - 1);
    }
    setBlog({
      ...blog,
      comments: { ...comments, results: commentsArr },
      activity: {
        ...activity,
        total_parent_comments:
          total_parent_comments -
          (commentData.childrenLevel == 0 && isDelete ? 1 : 0),
      },
    });
  };

  const handleHiddenReplies = () => {
    console.log("hidden");
    commentData.replyLoaded = false;
    console.log(commentData.replyLoaded);
    removeCommentCard(index + 1);
  };

  const deleteComment = async (e) => {
    e.target.setAttribute("disabled", true);
    console.log("comment id: ", _id);
    try {
      const result = await axios.put(
        import.meta.env.VITE_SERVER_COMMENT + "/delete-comment",
        { _id },
        { headers: { Authorization: "Bearer " + access_token } }
      );
      console.log(result);
      e.target.removeAttribute("disabled");
      toast.success("Deleted comment");
      console.log("delete comment successfully");
      removeCommentCard(index + 1, true);
    } catch (error) {
      console.log(error);
      e.target.removeAttribute("disabled");

      toast.error(error.message);
    }
  };

  return (
    <div className="w-full mr-10" style={{ marginLeft: `${lefVal * 50}px` }}>
      <div className="border border-grey rounded-md my-5 p-6">
        <div className="flex gap-3 items-center mb-8">
          <img src={profile_img} alt="" className="w-12 h-12 rounded-full" />
          <p className="line-clamp-1">@{username_comment}</p>
          <p className="min-w-fit text-dark-grey">{getFullDay(commentedAt)}</p>
        </div>
        <p className="w-full font-gelasio text-xl ml-3 ">{comment}</p>
        <div className="flex gp-5 items-center mt-5">
          {commentData.replyLoaded == true ? (
            <button
              onClick={handleHiddenReplies}
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            >
              <i className="fi fi-rs-comment-dots"></i>
              {tranlate.hidden[language]} {children.length}{" "}
              {tranlate.reply[language]}
            </button>
          ) : (
            <button
              onClick={loadReplies}
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            >
              <i className="fi fi-rs-comment-dots"></i>
              {tranlate.show[language]} {children.length}{" "}
              {tranlate.reply[language]}
            </button>
          )}

          <button
            className="underline"
            onClick={() => setReplying((prev) => !prev)}
          >
            {tranlate.reply[language]}
          </button>
          {username === username_comment || username === username_author ? (
            <button
              onClick={deleteComment}
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2 ml-auto"
            >
              <i className="fi fi-rr-trash"></i>
            </button>
          ) : (
            ""
          )}
        </div>
        {replying && (
          <CommentField
            action={"Reply"}
            index={index}
            replyingTo={{ _id, username: username_comment }}
            setReplying={setReplying}
          />
        )}
      </div>
    </div>
  );
};

export default CommentCard;
