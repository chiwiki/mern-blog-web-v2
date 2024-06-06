import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext, UserAuth } from "../App";
import { getFullDay } from "../common/date";
import { tranlate } from "../utils/language";

const NotificationCard = ({ data, setOpen }) => {
  const {
    userAuth: { access_token },
    setNotifications,
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const {
    blog: { banner, title, blog_id },
    user: {
      personal_info: { username, profile_img },
    },
    type,
    seen,
    createdAt,
    _id,
  } = data;
  const handleClick = () => {
    axios
      .put(import.meta.env.VITE_SERVER + `/notifications/${_id}`, null, {
        headers: { Authorization: "Bearer " + access_token },
      })
      .then(({ data }) => {
        setOpen(false);
        setNotifications(null);
        navigate(`/blog/${blog_id}`, { replace: true });
        // window.location.href = window.location.pathname; // Giữ nguyên URL hiện tại
        // window.location.reload();
      })
      .catch(({ response }) => {
        console.log(response.data.message);
      });
  };
  return (
    <div
      className="w-full bg-white px-4 py-2 flex items-start justify-between hover:bg-grey mb-2 relative"
      onClick={handleClick}
    >
      {!seen ? (
        <div className="rounded-full w-[10px] h-[10px] bg-indigo-400 absolute left-[10px] top-[23px]"></div>
      ) : (
        <span className="w-[6px] h-[6px] bg-transparent rounded-full absolute left-[10px] top-[50%] -translate-y-1/2" />
      )}

      <div className="flex gap-2 items-start justify-center ml-3">
        <img
          src={profile_img}
          className="w-[45px] h-[45px] object-cover rounded-full"
        />
        <div className="font-gelasio w-[250px] ">
          <div className="flex text-base items-end gap-2">
            <p className="font-bold text-[13px]">{username}</p>
            <span className="text-gray text-[10px]">
              {getFullDay(createdAt)}
            </span>
          </div>
          <p>
            {type === "reply" ? (
              <span>{tranlate.replied_on[language]}</span>
            ) : type === "comment" ? (
              <span>{tranlate.commented_on[language]}</span>
            ) : (
              <span>{tranlate.like_your_blog[language]}</span>
            )}{" "}
            <span>{title}</span>
          </p>
        </div>
      </div>
      <div className="flex items-start">
        <img
          src={banner}
          alt=""
          className="h-[45px] w-[60px] object-cover rounded-md"
        />
      </div>
    </div>
  );
};
export default NotificationCard;
