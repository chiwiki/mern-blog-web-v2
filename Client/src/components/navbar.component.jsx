import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { LanguageContext, UserAuth } from "../App";
import DarkLogo from "../imgs/logo-dark.png";
import Vietnam from "../imgs/vietnam.png";
import Usa from "../imgs/usa.png";
import NotificationPanel from "./notification-panel.component";
import Footer from "./footer";
import UserNavigationPannel from "./user-navigation-panel";
import {
  lookInSession,
  storeInSession,
  removeFromSession,
} from "../common/session";

import { getFullDay } from "../common/date";
import { tranlate } from "../utils/language";
// import NotificationCard from "./notification-card.component";
export const NavbarContext = createContext({});
const Navbar = () => {
  const [searchBoxVisible, setSearchBoxVisible] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  const [notificationPanel, setNotificationPanel] = useState(false);
  const [langListDisplay, setLangListDisplay] = useState(false);
  const navigate = useNavigate();
  const [newNotifiCount, setNewNotifiCount] = useState(
    JSON.parse(lookInSession("new notification")) || 0
  );
  const {
    userAuth: { access_token, profile_img },
    notifications,
    setNotifications,
    socket,
  } = useContext(UserAuth);
  const { language, setLanguage } = useContext(LanguageContext);
  // useEffect(() => {
  //   if (access_token) {
  //     console.log("have token");

  //     axios
  //       .post(
  //         import.meta.env.VITE_SERVER + "/notifications/",
  //         { filter: "all", page: 1 },
  //         {
  //           headers: { Authorization: "Bearer " + access_token },
  //         }
  //       )
  //       .then(({ data }) => {
  //         console.log("data: ", data);
  //         setNotifications((pev) => [...data]);
  //       });
  //   }
  // }, [access_token, socket]);
  const handleChangeLanguage = (e) => {
    console.log(e.target.innerText);
    let language = e.target.innerText;
    if (language === "English") {
      setLanguage(0);
    } else {
      setLanguage(1);
    }
  };
  const handleSearch = (e) => {
    let query = e.target.value;
    console.log("query: ", query);
    if (e.keyCode == 13 && query.length) {
      setSearchBoxVisible(false);
      navigate(`/search/${query}`);
    }
  };
  useEffect(() => {
    console.log("nofofofoofo", notifications);
    socket?.on("sendNotification", async (data) => {
      setNewNotifiCount((prev) => {
        const count = prev + 1;
        storeInSession("new notification", count);
        return count;
      });
      toast.custom(
        (t) => {
          const {
            blog: { banner, title },
            user: {
              personal_info: { username, profile_img },
            },
            type,
            seen,
            createdAt,
            _id,
          } = data;
          return (
            // <NotificationCard data={data} />
            <div className="min-w-fit w-[430px] bg-grey px-4 py-2 flex items-start justify-between hover:bg-grey mb-2 relative">
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
        },
        {
          position: "bottom-left",
        }
      );
    });
    socket?.on("deleteNotification", (data) => {
      console.log(data.message);
      // setNewNotifiCount((prev) => {
      //   const count = prev - 1;
      //   storeInSession("new notification", count);
      //   return count;
      // });
      axios
        .post(
          import.meta.env.VITE_SERVER + "/notifications/",
          { filter: "all", page: 1 },
          {
            headers: { Authorization: "Bearer " + access_token },
          }
        )
        .then(({ data: data2 }) => {
          setNotifications([...data2]);
        });
    });
  }, [socket]);

  return (
    <>
      <div>
        <nav className="navbar z-50">
          <Link to="/" className="flex-none w-10">
            <img src={DarkLogo} className="w-full" alt="" />
          </Link>
          <div
            className={`absolute bg-white w-full left-0 top-full mt-0.5  border-b border-gray py-4 px-[5vw] md:border-none md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${
              searchBoxVisible ? "show" : "hidden"
            }`}
          >
            <input
              onKeyDown={handleSearch}
              type="text"
              placeholder={tranlate.navbar.search_blog[language]}
              className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            />
            <i className="fi fi-rr-search absolute right-[10%] top-1/2 -translate-y-1/2 md:pointer-events-none md:left-5 text-2xl text-dark-grey z-10"></i>
          </div>

          <div className="flex items-center gap-3 md:gap-6 ml-auto">
            <button
              className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
              onClick={() => {
                setSearchBoxVisible((prev) => !prev);
              }}
            >
              <i className="fi fi-rr-search text-dark-grey text-2xl"></i>
            </button>

            <button
              className=" bg-grey w-12 h-12 flex items-center justify-center rounded-full relative "
              onMouseEnter={() => setLangListDisplay(true)}
              onMouseLeave={() => setLangListDisplay(false)}
              onClick={() => setLangListDisplay((prev) => !prev)}
            >
              <img
                src={language === 1 ? Vietnam : Usa}
                alt=""
                className="h-10 w-10"
              />
              <div
                onMouseLeave={() => setLangListDisplay(false)}
                className={`absolute right-0 top-[100%] flex flex-col justify-center gap-2 px-4 py-2 bg-white border border-grey ${
                  langListDisplay ? "show" : "hide"
                } `}
                onClick={handleChangeLanguage}
              >
                <span className="whitespace-nowrap link">Tiếng Việt</span>
                <span className="whitespace-nowrap link">English</span>
              </div>
            </button>

            <Link to="/editor" className="hidden md:flex link gap-2 text-2xl">
              <i className="fi fi-rr-file-edit"></i>
              <p>{tranlate.write[language]}</p>
            </Link>

            {access_token ? (
              <div className="relative flex gap-2 justify-center items-center">
                <button
                  onClick={() => {
                    setNewNotifiCount(0);
                    removeFromSession("new notification");

                    setNotificationPanel((prev) => !prev);
                  }}
                  className="bg-grey w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/10 relative"
                >
                  <i className="fi fi-rr-bell text-dark-grey text-2xl"></i>
                  {newNotifiCount !== 0 && (
                    <div className="bg-grey flex items-center justify-center h-[15px] w-[15px] absolute top-[3px] right-[6px] rounded-full">
                      <span className=" text-rose-500">{newNotifiCount}</span>
                    </div>
                  )}
                </button>
                {notificationPanel ? (
                  <NotificationPanel setOpen={setNotificationPanel} />
                ) : (
                  ""
                )}

                <button
                  className="w-12 h-12 mt-1"
                  onClick={() => {
                    setUserNavPanel((prev) => !prev);
                  }}
                >
                  <img
                    src={profile_img}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>
                {userNavPanel ? (
                  <UserNavigationPannel setOpen={setUserNavPanel} />
                ) : (
                  ""
                )}
              </div>
            ) : (
              <>
                <Link to="/signin" className="btn-dark py-2">
                  {tranlate.sign_in[language]}
                </Link>
                <Link to="/signup" className="btn-light py-2 hidden md:block">
                  {tranlate.sign_up[language]}
                </Link>
              </>
            )}
          </div>
        </nav>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Navbar;
