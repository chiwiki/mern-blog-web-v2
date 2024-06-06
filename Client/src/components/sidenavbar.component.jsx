import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate, Outlet, NavLink } from "react-router-dom";
import { LanguageContext, UserAuth } from "../App";
import { tranlate } from "../utils/language";

const Sidebar = () => {
  const defaultPage = window.location.pathname.split("/")[2];
  const [pageState, setPageState] = useState(defaultPage.replace("-", " "));
  const [showSidenav, setShowSideNav] = useState(false);
  const {
    userAuth: { access_token },
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  const activeTab = useRef();
  const sidebarIcon = useRef();
  const pageStateTab = useRef();
  const setActiveTab = (e) => {
    const { offsetWidth, offsetLeft } = e.target;
    console.log(e.target.offsetLeft, e.target.offsetWidth);
    activeTab.current.style.width = offsetWidth + "px";
    activeTab.current.style.left = offsetLeft + "px";
    if (e.target === sidebarIcon.current) {
      setShowSideNav(true);
    } else {
      setShowSideNav(false);
    }
  };
  // useEffect(() => {
  //   console.log("href: ", window.location.pathname.split("/")[2]);
  //   const setPageStateHandler = () => {
  //     const defaultPage = window.location.pathname.split("/")[2];
  //     setPageState(defaultPage.replace("-", " "));
  //   };
  //   setPageStateHandler();

  //   // setTimeout(() => {
  //   //   pageStateTab.current.click();
  //   // }, 500);
  // }, [window.location.pathname.split("/")[2]]);
  useEffect(() => {
    console.log("render");
  }, [window.location.href]);
  return access_token === null ? (
    <Navigate to="/signin" />
  ) : (
    <section className="relative py-0 m-0 flex max-md:flex-col gap-10">
      <div className="sticky top-[80px] z-30">
        <div className="md:hidden border-b border-grey py-1 flex flex-wrap overflow-x-auto bg-white">
          <button
            onClick={setActiveTab}
            ref={sidebarIcon}
            className="p-5 capitalize
          "
          >
            <i className="fi fi-sr-bars-staggered pointer-events-none"></i>
          </button>
          <button
            className="capitalize cursor-pointer px-2"
            ref={pageStateTab}
            onClick={setActiveTab}
          >
            {pageState}
          </button>

          <hr
            ref={activeTab}
            className=" absolute top-[calc(100%-1px)] duration-500 border-black"
          />
        </div>
      </div>
      <div
        className={`min-w-[200px] h-[calc(100vh-80px-60px)] 
          md:h-cover
          md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] 
        bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-150 ${
          !showSidenav
            ? "max-md:opacity-0 max-md:pointer-events-none"
            : "pointer-events-auto opacity-100"
        } `}
      >
        <h1 className="text-xl text-dark-grey mb-3">
          {tranlate.dashboard[language]}
        </h1>
        <hr className="border-grey -ml-6 mb-6 mr-6 w-full" />
        <NavLink
          to="/dashboard/blogs"
          onClick={(e) => {
            setPageState(e.target.innerText);
          }}
          className="sidebar-link"
        >
          <i className="fi fi-rr-document"></i>
          Blogs
        </NavLink>

        <NavLink
          to="/dashboard/notifications"
          onClick={(e) => {
            setPageState(e.target.innerText);
          }}
          className="sidebar-link"
        >
          <i className="fi fi-rr-bell"></i>
          {tranlate.notifications[language]}
        </NavLink>

        <NavLink
          to="/editor"
          onClick={(e) => {
            setPageState(e.target.innerText);
          }}
          className="sidebar-link"
        >
          <i className="fi fi-rr-edit"></i>
          {tranlate.write[language]}
        </NavLink>

        <h1 className="text-xl text-dark-grey mb-3 mt-20">
          {tranlate.settings[language]}
        </h1>
        <hr className="border-grey -ml-6 mb-6 mr-6" />
        <NavLink
          to="/settings/edit-profile"
          onClick={(e) => {
            setPageState(e.target.innerText);
          }}
          className="sidebar-link"
        >
          <i className="fi fi-rs-user-pen"></i>
          {tranlate.profile_page.edit_profile[language]}
        </NavLink>

        <NavLink
          to="/settings/change-password"
          onClick={(e) => {
            setPageState(e.target.innerText);
          }}
          className="sidebar-link"
        >
          <i className="fi fi-rr-lock"></i>
          {tranlate.change_pasword.cp[language]}
        </NavLink>
      </div>
      <div
        className={`max-md:-mt-8 mt-8 w-full ${
          showSidenav ? "max-md:opacity-0 pointer-events-none" : ""
        }`}
      >
        <Outlet />
      </div>
    </section>
  );
};

export default Sidebar;
