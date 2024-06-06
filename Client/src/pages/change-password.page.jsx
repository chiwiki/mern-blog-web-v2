import axios from "axios";
import React, { useContext, useRef } from "react";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { LanguageContext, UserAuth } from "../App";
import InputBox from "../components/input.component";
import AnimationWrapper from "../components/page-animation.component";
import { tranlate } from "../utils/language";

const ChangePassword = () => {
  let {
    userAuth: { access_token },
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  const [loading, setLoading] = useState(false);
  let changePasswordForm = useRef();
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    let form = new FormData(changePasswordForm.current);
    console.log(form);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    let { currentPassword, newPassword } = formData;
    if (!currentPassword.length || !newPassword.length) {
      return toast.error("Fill all the inputs");
    }
    if (
      !passwordRegex.test(currentPassword) ||
      !passwordRegex.test(newPassword)
    ) {
      console.log("invalid input");
      return toast.error(
        "Password must be from 6 to 20 characters long and at least a numeric, a lowercase, a uppercase letter"
      );
    }

    e.target.setAttribute("disabled", true);

    let loadingToast = toast.loading("Updating...");
    setLoading(true);

    axios
      .put(import.meta.env.VITE_SERVER + "/users/change-password", formData, {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
      .then(({ data }) => {
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        setLoading(false);
        changePasswordForm.current.reset();
        return toast.success(data);
      })
      .catch(({ response }) => {
        console.log("error: ", response);
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        setLoading(false);
        return toast.error(response.data.message);
      });
  };
  return (
    <AnimationWrapper className={"w-full"}>
      <Toaster />
      <form ref={changePasswordForm} className="mx-auto md:max-w-[400px]">
        <h1 className="max-md:hidden">
          {tranlate.change_pasword.cp[language]}
        </h1>
        <div className="py-10 w-full md:max-w-[400px]">
          <InputBox
            name="currentPassword"
            type={"password"}
            className="input-box"
            placeHodler={tranlate.change_pasword.current_pass[language]}
            icon={"fi-br-key"}
          />
          <InputBox
            name="newPassword"
            type={"password"}
            className="input-box"
            placeHodler={tranlate.change_pasword.new_pass[language]}
            icon={"fi-br-key"}
          />

          <button
            className={`btn-dark px-10 ${
              loading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            type="submit"
            onClick={handleSubmit}
          >
            {tranlate.change_pasword.cp[language]}
          </button>
        </div>
      </form>
    </AnimationWrapper>
  );
};

export default ChangePassword;
