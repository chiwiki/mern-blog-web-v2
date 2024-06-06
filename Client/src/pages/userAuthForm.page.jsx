import React, { useContext, useRef } from "react";
import InputBox from "../components/input.component";
import GoogleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../components/page-animation.component";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { LanguageContext, UserAuth } from "../App";
import { storeInSession } from "../common/session";
import { app } from "../common/firebase.config";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import MinimalLoader from "../components/MinimalLoader";
import { tranlate } from "../utils/language";
const UserAuthForm = ({ type }) => {
  const formCurrent = useRef();

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [loading, setLoading] = useState(false);
  const {
    userAuth,
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  const userAuthThroughServer = (endpoint, formData) => {
    setLoading(true);
    axios
      .post(import.meta.env.VITE_SERVER + `/users/${endpoint}`, formData)
      .then(({ data }) => {
        sessionStorage.setItem("user", JSON.stringify(data));
        setUserAuth(data);

        console.log("userAuh:", userAuth);
      })
      .catch(({ response }) => toast.error(response.data.message))
      .finally(() => {
        setLoading(false);
      });
  };

  const signinWithGoogle = () => {
    signInWithPopup(auth, provider).then((credUser) => {
      const access_token = credUser.user.accessToken;
      console.log(access_token);
      userAuthThroughServer("/signin-with-google", { access_token });
    });
  };
  const handleUserAuth = (e) => {
    e.preventDefault();
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
    const action = e.target.textContent.toLowerCase();
    console.log({ action });
    const endpoint =
      action === tranlate.sign_in[language] ? "/signin" : "/signup";
    console.log(endpoint);
    const form = new FormData(formCurrent.current);
    let formData = {};
    for (let [key, value] of form) {
      formData[key] = value;
    }
    console.log(formData);
    let { fullname, email, password } = formData;
    if (fullname) {
      if (!fullname.length) {
        return toast.error("Enter fullname");
      }
    }
    if (!email.length) {
      return toast.error("Enter email");
    }
    if (!password.length) {
      return toast.error("Enter password");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Invalid email");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password need at least a lower character, an uppercase character, a special character and length from 6-20"
      );
    }
    userAuthThroughServer(endpoint, formData);
  };
  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper key={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form ref={formCurrent} className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in"
              ? `${tranlate.authform.welcome_back[language]}`
              : `${tranlate.authform.join_us[language]}`}
          </h1>
          {type === "sign-up" ? (
            <InputBox
              id="fullname"
              type="text"
              name="fullname"
              placeHodler={tranlate.authform.type_fullname[language]}
              icon="fi fi-rr-user"
            />
          ) : (
            ""
          )}

          <InputBox
            id="email"
            type="text"
            name="email"
            placeHodler={tranlate.authform.type_email[language]}
            icon="fi fi-rr-envelope"
          />
          <InputBox
            id="password"
            type="password"
            name="password"
            placeHodler={tranlate.authform.type_password[language]}
            icon={"fi fi-rr-key"}
          />
          <div className="w-full flex justify-end">
            <Link className="underline" to="/forgot-password">
              {tranlate.authform.forgot_password[language]}
            </Link>
          </div>
          <div className="w-full mt-8 flex items-center justify-center">
            {type === "sign-in" ? (
              <button
                className={`btn-dark ${
                  loading ? "cursor-progress" : "cursor-pointer"
                }`}
                type="submit"
                onClick={handleUserAuth}
              >
                {tranlate.sign_in[language]}
              </button>
            ) : (
              <button
                className={`btn-dark ${
                  loading ? "opacity-70 cursor-progress" : "cursor-pointer"
                }`}
                type="submit"
                onClick={handleUserAuth}
              >
                {tranlate.sign_up[language]}
              </button>
            )}
          </div>
          <div className="relative w-full flex items-center justify-center gap-4 font-bold text-black  my-10 opacity-10 uppercase">
            <hr className=" w-[40%] border-black" />
            <span className="px-5">{tranlate.authform.or[language]}</span>
            <hr className="w-[40%] border-black" />
          </div>

          <button
            onClick={signinWithGoogle}
            className="w-[90%] btn-dark flex items-center justify-center gap-4 center"
          >
            <img src={GoogleIcon} className="w-5" />
            {tranlate.authform.google[language]}
          </button>
          <div>
            {type === "sign-in" ? (
              <p className="mt-6 text-dark-grey text-xl text-center">
                {tranlate.authform.dont_have[language]}{" "}
                <Link to="/signup" className="underline text-black">
                  {tranlate.sign_up[language]}
                </Link>
              </p>
            ) : (
              <p className="mt-6 text-dark-grey text-xl text-center">
                {tranlate.authform.have_had[language]}{" "}
                <Link to="/signin" className="underline text-black">
                  {tranlate.sign_in[language]}
                </Link>
              </p>
            )}
          </div>
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
