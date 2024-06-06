import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { LanguageContext, UserAuth } from "../App";
import { getFullDay } from "../common/date";
import { tranlate } from "../utils/language";
import NotificationCommentField from "./notification-comment-field.component";

const NotificationMainCard = ({ data, index, notificationState }) => {
  console.log("Notification____________", data);
  const [isReplying, setIsReplying] = useState(false);
  let {
    user,

    createdAt,
    type,
    seen,
    user: {
      personal_info: { fullname, username, profile_img },
    },
    replied_on_comment,
    comment,
    reply,

    _id: notification_id,
  } = data;

  let {
    userAuth: {
      username: author_username,
      profile_img: author_profile_img,
      access_token,
    },
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);

  let {
    notifications,
    notifications: { results, totalDocs },
    setNotifications,
  } = notificationState;
  const handleReply = () => {
    setIsReplying((pre) => !pre);
  };
  const handleDelete = (comment_id, type, target) => {
    console.log("delete commrnt");
    target.setAttribute("disabled", true);
    axios
      .put(
        import.meta.env.VITE_SERVER + "/comments/delete-comment",
        {
          _id: comment_id,
        },
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      )
      .then(() => {
        if (type == "comment") {
          results.splice(index, 1);
        } else {
          delete results[index].reply;
        }

        target.removeAttribute("disabled");
        setNotifications({
          ...notifications,
          totalDocs: totalDocs - 1,
          deletedDocCount: notifications.deletedDocCount + 1,
        });
      })
      .catch((err) => {
        target.removeAttribute("disabled");
        console.log(err);
      });
  };
  return (
    <div
      className={
        "w-full border-b border-grey p-6 mt-4 border-l-black " +
        (!seen ? "border-l-2" : "")
      }
    >
      <div className="flex gap-5 mb-3">
        <img src={profile_img} className="w-12 h-12 rounded-full flex-none" />
        <div className="w-full">
          <h1 className="font-medium text-xl text-dark-grey ">
            <span className="lg:inline-block hidden capitalize">
              {fullname}
            </span>
            <Link
              to={`/user/${username}`}
              className="mx-1 text-black underline"
            >
              {username}
            </Link>
            <span className="font-normal">
              {type == "like"
                ? `${tranlate.like_your_blog[language]}`
                : type == "comment"
                ? `${tranlate.commented_on[language]}`
                : `${tranlate.replied_on[language]}`}
            </span>
          </h1>

          {type == "reply" ? (
            <>
              <Link
                to={`/blog/${data?.blog?.blog_id}`}
                className="hover:underline font-medium text-dark-grey line-clamp-1"
              >{`"${data?.blog?.title}"`}</Link>
              <div className="p-4 mt-4 rounded-md bg-grey">
                <p>{replied_on_comment.comment}</p>
              </div>
            </>
          ) : (
            <Link
              to={`/blog/${data?.blog?.blog_id}`}
              className="hover:underline font-medium text-dark-grey line-clamp-1"
            >{`"${data?.blog?.title}"`}</Link>
          )}
        </div>
      </div>

      {type != "like" ? (
        <p className="ml-14 p-5 font-gelasio text-xl my-5 ">
          {comment.comment}
        </p>
      ) : (
        ""
      )}

      <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
        <p>{getFullDay(createdAt)}</p>

        {type != "like" ? (
          <>
            {!reply ? (
              <button
                onClick={handleReply}
                className="underline hover:text-black"
              >
                {tranlate.reply[language]}
              </button>
            ) : (
              ""
            )}

            <button
              onClick={(e) => handleDelete(comment._id, "comment", e.target)}
              className="underline hover:text-black"
            >
              {tranlate.delete[language]}
            </button>
          </>
        ) : (
          ""
        )}
      </div>

      {isReplying ? (
        <div className="mt-8">
          <NotificationCommentField
            _id={data?.blog?._id}
            blog_author={user}
            index={index}
            replyingTo={comment._id}
            setReplying={setIsReplying}
            notification_id={notification_id}
            notificationData={notificationState}
          />
        </div>
      ) : (
        ""
      )}

      {reply ? (
        <div className="ml-20 p-5 bg-grey mt-5 rounded-md">
          <div className="flex gap-3 mb-3">
            <img
              src={author_profile_img}
              className="w-8 h-8 rounded-full flex-none"
            />
            <div className="w-full">
              <h1 className="font-medium text-xl text-dark-grey">
                <Link
                  to={`/user/${author_username}`}
                  className="mx-1 text-black underline"
                >
                  @{author_username}
                </Link>
                <span className="font-normal">
                  {tranlate.replied_on[language]}
                </span>

                <Link
                  className="mx-1 text-black underline"
                  to={`/user/${username}`}
                >
                  {username}
                </Link>
              </h1>
              <div className="p-4 mt-4 rounded-md bg-grey">
                <p>{reply.comment}</p>
              </div>
            </div>
          </div>

          <div className="ml-14 mt-3 text-dark-grey flex gap-8">
            {/* <p>{getFullDay(reply.createdAt)}</p> */}
            <button
              onClick={(e) => handleDelete(comment._id, "reply", e.target)}
              className="underline hover:text-black"
            >
              {tranlate.delete[language]}
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NotificationMainCard;
