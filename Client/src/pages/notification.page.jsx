import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { LanguageContext, UserAuth } from "../App";
import { filterPaginationData } from "../common/filterPaginationData";

import LoadMore from "../components/load-more.component";
import Loader from "../components/loader.component";
import NoData from "../components/no-data.component";
import NotificationMainCard from "../components/notification-main-card..component";
import AnimationWrapper from "../components/page-animation.component";
import { tranlate } from "../utils/language";

const NotificationPage = () => {
  const [filter, setFilter] = useState("all");
  let filters = ["all", "like", "comment", "reply"];
  const [notifications, setNotifications] = useState(null);
  const [newNotifications, setNewNotifications] = useState(0);
  const [openPanel, setOpenPanel] = useState(false);
  let {
    userAuth,
    setUserAuth,
    userAuth: { access_token },
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  const fetchNotifications = ({ page, deletedDocCount = 0 }) => {
    axios
      .post(
        import.meta.env.VITE_SERVER + "/notifications/",
        { page, deletedDocCount, filter },
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      )
      .then(async ({ data: { notifications: data } }) => {
        console.log(data);

        let formatedData = await filterPaginationData({
          state: notifications,
          data,
          page,
          countRoute: "/notifications/count-notifications",
          data_to_send: { filter },
          user: access_token,
        });

        setNotifications(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const countNewNotifications = () => {
    axios
      .post(
        import.meta.env.VITE_SERVER + "/notifications/new-notifications",
        { filter },
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      )
      .then(({ data: { totalDocs } }) => {
        setNewNotifications(totalDocs);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleFilter = (e) => {
    let btn = e.target;
    setFilter(btn.innerHTML);
    setNotifications(null);
  };
  const handleDeleteAllNotifications = () => {
    axios
      .post(
        import.meta.env.VITE_SERVER + "/notifications/delete-all",
        { filter },
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      )
      .then(({ data }) => {
        console.log(data);
        setNotifications({ results: [] });
        setNewNotifications(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleReadAllNotifications = () => {
    axios
      .post(
        import.meta.env.VITE_SERVER + "/notifications/mark-as-read",
        { filter },
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      )
      .then(({ data }) => {
        console.log(data);

        if (notifications.results) {
          const newResults = notifications.results.map((result) => {
            return { ...result, seen: true };
          });
          setNotifications({ ...notifications, results: newResults });
        }
        removeFromSession("new notifications");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (access_token) {
      fetchNotifications({ page: 1 });
      countNewNotifications();
    }
  }, [access_token, filter]);
  return (
    <div className="">
      <h1 className="max-md:hidden font-bold">
        {tranlate.notifications[language]}
      </h1>
      <div className="my-8 flex gap-6">
        {filters.map((filterName, i) => {
          return (
            <button
              key={i}
              className={`py-2 ${
                filter === filterName ? "btn-dark" : "btn-light"
              }`}
              onClick={handleFilter}
            >
              {/* {tranlate[filterName][language]} */}
              {filterName}
            </button>
          );
        })}
      </div>

      {notifications == null ? (
        <Loader />
      ) : (
        <>
          {notifications.results.length ? (
            <>
              <h1 className=" font-bold text-[18px] mb-2">
                {notifications.results.length} of {notifications.totalDocs}{" "}
              </h1>
              <hr className="w-full border-grey" />
              <div className="flex justify-end py-2 px-3 gap-3 items-center">
                {newNotifications > 0 && (
                  <h2 className="font-bold !text-[18px] text-white bg-black rounded-full px-2">
                    {newNotifications} {tranlate.new[language]}
                  </h2>
                )}
                <button
                  className="px-2 py-1 flex justify-center items-center relative"
                  onClick={() => setOpenPanel((prev) => !prev)}
                >
                  <i className="fi fi-rr-menu-dots text-[20px]"></i>
                  <div
                    className={`absolute right-0 top-[100%] flex flex-col justify-center gap-2 px-4 py-2 bg-white border border-grey ${
                      openPanel ? "show" : "hide"
                    } `}
                    onMouseEnter={() => setOpenPanel(true)}
                    onMouseLeave={() => setOpenPanel(false)}
                  >
                    <div
                      className="flex gap-2 items-center link"
                      onClick={handleReadAllNotifications}
                    >
                      <i className="fi fi-br-check"></i>
                      <span className="whitespace-nowrap ">
                        {tranlate.mark_as_read[language]}
                      </span>
                    </div>
                    <div
                      className="flex gap-2 items-center link"
                      onClick={handleDeleteAllNotifications}
                    >
                      <i className="fi fi-rr-trash"></i>
                      <span className="whitespace-nowrap ">
                        {tranlate.delete_all[language]}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
              <hr className="w-full border-grey" />
              {notifications.results.map((notification, i) => {
                return (
                  <AnimationWrapper key={i} transiton={{ delay: i * 0.08 }}>
                    <NotificationMainCard
                      data={notification}
                      index={i}
                      notificationState={{ notifications, setNotifications }}
                    />
                  </AnimationWrapper>
                );
              })}
            </>
          ) : (
            <NoData message={"Nothing available"} />
          )}

          <LoadMore
            state={notifications}
            fetchDataFunc={fetchNotifications}
            additionalParams={{
              deletedDocCount: notifications.deletedDocCount,
            }}
          />
        </>
      )}
    </div>
  );
};

export default NotificationPage;
