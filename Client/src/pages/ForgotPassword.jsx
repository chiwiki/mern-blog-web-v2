import React, { useContext } from "react";
import { useState } from "react";

import axios from "axios";
import { toast } from "react-hot-toast";
import { LanguageContext } from "../App";
import { tranlate } from "../utils/language";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { language } = useContext(LanguageContext);
  const handleSendEmail = (e) => {
    if (!email.length) {
      return toast.error("You miss email");
    }
    e.target.setAttribute("disabled", true);
    setLoading(true);
    axios
      .post(import.meta.env.VITE_SERVER + "/users/forgot-password", { email })
      .then(() => {
        toast.success("Please go to your email to confirm");
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
        {tranlate.forgot_password[language]}
      </h1>

      <div className="w-full flex justify-center items-center flex-col">
        <div className="w-full mb-2  flex items-center justify-center flex-col gap-3">
          <div className="w-full md:max-w-[600px]">
            <label htmlFor="email">Email</label>
          </div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            defaultValue={email}
            placeholder="email"
            name="email"
            id="email"
            type={"email"}
            className=" input-box placeholder:text-gray-400 md:max-w-[600px]"
          />
          <button
            className="btn-dark mx-auto rounded-[5px]"
            onClick={handleSendEmail}
          >
            {tranlate.send[language]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
