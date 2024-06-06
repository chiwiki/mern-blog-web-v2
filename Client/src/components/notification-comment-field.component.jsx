import axios from "axios";
import React, { useContext, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { UserAuth } from "../App";

const NotificationCommentField = ({
  _id,
  blog_author,
  index = undefined,
  replyingTo = undefined,
  setReplying,
  notification_id,
  notificationData,
}) => {
  const [comment, setComment] = useState("");

  let { _id: user_id } = blog_author;
  let {
    userAuth: { access_token },
  } = useContext(UserAuth);
  let {
    notifications,
    notifications: { results },
    setNotifications,
  } = notificationData;
  const handleComment = () => {
    if (!comment.length) {
      return toast.error("You need to write something");
    }

    axios
      .post(
        import.meta.env.VITE_SERVER + "/comments/",
        {
          _id,
          comment,
          blog_author: user_id,
          replying_to: replyingTo,
          notification_id,
        },
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      )
      .then(({ data: { newComment } }) => {
        setReplying(false);
        results[index].reply = { comment, _id: newComment._id };
        setNotifications({ ...notifications, results: results });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Toaster />
      <textarea
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button onClick={handleComment} className="btn-dark mt-5 px-10">
        Reply
      </button>
    </>
  );
};

export default NotificationCommentField;
