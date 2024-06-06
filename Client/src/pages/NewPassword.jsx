import React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { LanguageContext, UserAuth } from "../App";
import { tranlate } from "../utils/language";
const NewPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUserAuth } = useContext(UserAuth);
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const handleResetPassword = (e) => {
    if (!password.length) {
      return toast.error("You must be write password");
    }
    e.target.setAttribute("disabled", true);
    setLoading(true);
    axios
      .put(import.meta.env.VITE_SERVER + `/users/reset-password/${token}`, {
        password,
      })
      .then(({ data }) => {
        toast.success(data);
        navigate("/signin");
      })
      .catch(({ response }) => {
        console.log(response);
        toast.error(response.data.messsage);
      })
      .finally(() => {
        setLoading(false);
        e.target.removeAttribute("disabled");
      });
  };
  return (
    <div className=" px-4 py-2  fixed top-0 left-0 w-screen h-screen z-50 bg-white">
      <h1 className="font-bold text-[30px] mb-10 flex items-center justify-center w-full mt-10">
        {tranlate.reset_password[language]}
      </h1>

      <div className="w-full flex justify-center items-center flex-col">
        <div className="w-full mb-2  flex items-center justify-center flex-col gap-3">
          <div className="w-full md:max-w-[600px]">
            <label htmlFor="password">New password</label>
          </div>
          <input
            onChange={(e) => setPassword(e.target.value)}
            defaultValue={password}
            placeholder="password"
            name="password"
            id="password"
            type={"password"}
            className=" input-box placeholder:text-gray-400 md:max-w-[600px]"
          />
          <button
            className={`btn-dark mx-auto rounded-[5px] ${
              loading ? "cursor-progress" : "cursor-pointer"
            }`}
            onClick={handleResetPassword}
          >
            {tranlate.send[language]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
