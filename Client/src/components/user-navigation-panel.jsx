import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext, UserAuth } from "../App";
import { logOutUser } from "../common/session";
import { tranlate } from "../utils/language";

const UserNavigationPannel = ({ setOpen }) => {
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const signOutUser = () => {
    logOutUser();
    setUserAuth({});
    navigate("/signin", { replace: true });
  };
  return (
    <div
      className="w-60 bg-white border border-grey absolute right-0 top-full duration-200"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to="/editor"
        className="md:hidden flex link gap-2 text-2xl link pl-8 py-4"
      >
        <i className="fi fi-rr-file-edit"></i>
        <p>{tranlate.write[language]}</p>
      </Link>

      <Link to={`/user/${username}`} className="link pl-8 py-4">
        {tranlate.navbar.profile[language]}
      </Link>
      <Link to="/dashboard/blogs" className="link pl-8 py-4">
        {tranlate.dashboard[language]}
      </Link>
      <Link to="/settings/edit-profile" className="link pl-8 py-4">
        {tranlate.settings[language]}
      </Link>

      <span className="absolute border-t border-grey w-[100%]"></span>
      <button
        className="text-left p-4 hover:bg-grey w-full pl-8 py-4 relative group"
        onClick={signOutUser}
      >
        <h1 className="font-bold text-xl mt-1">
          {tranlate.navbar.sign_out[language]}
        </h1>
        <p className="text-dark-grey">@{username}</p>
        <i className="fi fi-sr-exit text-2xl absolute right-[10%] top-1/2 -translate-y-1/2 text-dark-grey group-hover:text-black"></i>
      </button>
    </div>
  );
};

export default UserNavigationPannel;
