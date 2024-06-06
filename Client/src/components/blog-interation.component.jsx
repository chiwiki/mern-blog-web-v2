import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { LanguageContext, UserAuth } from "../App";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";
import { tranlate } from "../utils/language";

const BlogInteraction = () => {
  const appId = import.meta.env.VITE_APP_ID;
  let {
    commentWrapper,
    setCommentWrapper,
    blog: {
      blog_id,
      title,
      activity,
      activity: { total_likes, total_parent_comments },
      author: {
        personal_info: { username: author_username },
      },
      author,
    },
    blog,
    setBlog,
    isLikedByUser,
    setIsLikedByUser,
  } = useContext(BlogContext);
  const { language } = useContext(LanguageContext);

  let {
    userAuth: { username, access_token },
    socket,
  } = useContext(UserAuth);
  console.log("author", author);
  console.log("username", username);
  const handleLike = () => {
    const increment = isLikedByUser ? -1 : 1;
    if (!access_token) {
      return toast.error("You need to log in to like blog");
    }
    console.log("handle like");
    axios
      .put(
        import.meta.env.VITE_SERVER_BLOG + `/like/${blog_id}`,
        { is_liked_by_user: isLikedByUser },
        { headers: { Authorization: "Bearer " + access_token } }
      )
      .then(({ data }) => {
        const { notification } = data;

        if (!isLikedByUser) {
          socket.emit("interact", {
            ...notification,
            notification_for: author_username,
          });
        } else {
          socket.emit("deleteInteraction", {
            message: "delete like",
            notification_for: author_username,
          });
        }
        console.log("is liked by user", data);
        setIsLikedByUser((prev) => !prev);
        setBlog({
          ...blog,
          activity: { ...activity, total_likes: total_likes + increment },
        });
      });
  };
  useEffect(() => {
    axios
      .post(
        import.meta.env.VITE_SERVER + "/blogs/is-liked-by-user",
        { _id: blog._id },
        { headers: { Authorization: "Bearer " + access_token } }
      )
      .then(({ data: { isLikedByUser: isLiked } }) => {
        console.log(Boolean(isLiked));
        setIsLikedByUser(Boolean(isLiked));
      });
  }, []);

  return (
    <div className="flex item-center justify-between">
      <div className="flex gap-3 items-center">
        <button
          onClick={handleLike}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-grey/30 gap-2"
        >
          <i
            className={`fi ${isLikedByUser ? "fi-sr-heart" : "fi-rr-heart"}`}
          ></i>
        </button>
        <p className="border-grey my-2">{total_likes}</p>
        <button
          onClick={() => setCommentWrapper((prev) => !prev)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-grey/30 gap-2"
        >
          <i className="fi fi-rr-comment-alt"></i>
        </button>
        <p className="border-grey my-2">{total_parent_comments}</p>
      </div>
      <div className="flex gap-6 items-center">
        {username === author_username && (
          <Link to={`/edit/${blog_id}`} className="hover:underline">
            {tranlate.edit[language]}
          </Link>
        )}
        <Link
          to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${window.location.href}`}
          target="_blank"
        >
          <i className="fi fi-brands-twitter text-xl hover:text-twitter"> </i>
        </Link>
        {/* <Link
          target="_blank"
          to={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
          )}&amp;src=sdkpreparse`}
        >
          <i className="fi fi-brands-facebook text-xl hover:text-twitter"> </i>
        </Link> */}
      </div>
    </div>
  );
};

export default BlogInteraction;
