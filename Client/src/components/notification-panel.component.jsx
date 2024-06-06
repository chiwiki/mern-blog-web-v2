import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { LanguageContext, UserAuth } from "../App";
import { filterPaginationData } from "../common/filterPaginationData";
import { tranlate } from "../utils/language";
import LoadMore from "./load-more.component";
import NoData from "./no-data.component";

import NotificationCard from "./notification-card.component";

const NotificationPanel = ({ setOpen }) => {
  const {
    notifications,
    setNotifications,
    userAuth: { access_token },
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const fetchNotifications = ({ page = 1 }) => {
    axios
      .post(
        import.meta.env.VITE_SERVER + "/notifications/",
        { filter: "all", page },
        {
          headers: { Authorization: "Bearer " + access_token },
        }
      )
      .then(async ({ data }) => {
        console.log("NOTIFI_____: ", data);
        const filterFormData = await filterPaginationData({
          state: notifications,
          data: data.notifications,
          countRoute: "/notifications/count-notifications",
          page: 1,
          user: access_token,
          data_to_send: { filter: "all" },
        });
        console.log("data: ", filterFormData);
        setNotifications(filterFormData);
      });
  };
  useEffect(() => {
    console.log(notifications);

    if (!notifications) {
      fetchNotifications({ page: 1 });
    }
  }, []);

  return (
    <div
      className="bg-white border border-grey absolute right-[45px] top-full duration-200 z-50 h-60 overflow-y-scroll overscroll-contain w-[450px]  shadow-md max-md:-right-[20px] max-md:w-[400px]"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex justify-between">
        <h1 className="py-2 px-6">{tranlate.notifications[language]}</h1>
        <button
          className="text-blue-600 underline px-6 py-2 hover:text-blue-400"
          onClick={() => navigate("/dashboard/notifications")}
        >
          {tranlate.view_all[language]}
        </button>
      </div>
      <hr className="w-full mb-5" />

      {notifications && notifications?.results?.length ? (
        <div className="w-full">
          {notifications.results.map((notification, index) => {
            return (
              <NotificationCard
                data={notification}
                key={index}
                setOpen={setOpen}
              />
            );
          })}
          <LoadMore state={notifications} fetchDataFunc={fetchNotifications} />
        </div>
      ) : (
        <NoData message={"No notification yet"} />
      )}
    </div>
  );
};

export default NotificationPanel;
