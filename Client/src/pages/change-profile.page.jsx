import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { LanguageContext, UserAuth } from "../App";
import { storeInSession } from "../common/session";
import { uploadImg } from "../common/uploadImg";
import InputBox from "../components/input.component";
import Loader from "../components/loader.component";
import AnimationWrapper from "../components/page-animation.component";
import { tranlate } from "../utils/language";
import { profileStructure } from "./profile.page";

const ChangeProfile = () => {
  let {
    userAuth,
    userAuth: { access_token, username },
    setUserAuth,
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  let profileImgEle = useRef();
  const [profile, setProfile] = useState(profileStructure);
  const [loading, setLoading] = useState(true);
  const [uploadedImg, setUploadedImg] = useState(null);
  console.log("profile: _____", profile);
  let {
    personal_info: { fullname, profile_img, email, bio },
    social_links,
  } = profile;
  let bioLimit = 150;
  let editProfileForm = useRef();
  const [characterLeft, setCharacterLeft] = useState(bioLimit);
  const handleCharacterChange = (e) => {
    setCharacterLeft(bioLimit - e.target.value.length);
  };
  const handleImagePreview = (e) => {
    let loadingToast = toast.loading("Uploading...");
    const file = e.target.files[0];
    console.log(file);
    uploadImg(file)
      .then((downloadURL) => {
        profileImgEle.current.src = downloadURL;
        setUploadedImg(downloadURL);
        toast.dismiss(loadingToast);
        toast.success("Uploaded");
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        console.log(err);
      });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    e.target.setAttribute("disabled", true);
    let loadingToast = toast.loading("Changing profile image");
    if (uploadedImg) {
      axios
        .put(
          import.meta.env.VITE_SERVER + "/users/change-profile-img",
          { profile_img: uploadedImg },
          {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          }
        )
        .then(({ data }) => {
          toast.dismiss(loadingToast);
          toast.success(data.status);
          let newUserAuth = { ...userAuth, profile_img: uploadedImg };
          storeInSession("user", JSON.stringify(newUserAuth));
          setUserAuth(newUserAuth);
          setUploadedImg(null);
          e.target.removeAttribute("disabled");
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          setUploadedImg(null);
          e.target.removeAttribute("disabled");
          console.log(err);
        });
    }
  };

  const handleUpdateInfo = (e) => {
    e.preventDefault();

    let form = new FormData(editProfileForm.current);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    console.log(formData);
    let {
      username,
      bio,
      youtube,
      facebook,
      twitter,
      github,
      instagram,
      website,
    } = formData;
    e.target.setAttribute("disabled", true);
    let loadingToast = toast.loading("Changing profile");

    if (username.length < 3) {
      return toast.error("Username must be at least 6 characters");
    }
    if (bio.length > bioLimit) {
      return toast.error(`Bio should not be more than ${bioLimit}`);
    }

    axios
      .put(
        import.meta.env.VITE_SERVER + "/users/change-profile",
        {
          username,
          bio,
          social_links: {
            youtube,
            facebook,
            twitter,
            github,
            instagram,
            website,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      )
      .then(({ data }) => {
        //console.log(data.username);
        if (userAuth.username != data.personal_info.username) {
          let newUserAuth = { ...userAuth, username: data.username };
          //console.log(newUserAuth);
          storeInSession("user", JSON.stringify(newUserAuth));
          setUserAuth(newUserAuth);
        }
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        toast.success("Profile Updated");
      })
      .catch(({ response }) => {
        console.log("error: ", response);
        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");
        toast.error(response.data.message);
      });
  };
  useEffect(() => {
    if (access_token) {
      console.log("userAuth: ______", userAuth);
      axios
        .get(
          import.meta.env.VITE_SERVER +
            `/users/get-profile/${userAuth.username}`
        )
        .then(({ data: { user } }) => {
          setProfile(user);
          setLoading(false);
        });
    }
  }, [access_token]);
  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <form ref={editProfileForm}>
          <Toaster />
          <h1 className="max-md:hidden">{tranlate.edit_profile[language]}</h1>
          <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
            <div className="max-lg:center mb-5 ">
              <label
                htmlFor="uploadImg"
                id="profileImgLabel"
                className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
              >
                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                  {tranlate.upload_image[language]}
                </div>

                <img
                  ref={profileImgEle}
                  src={profile_img}
                  alt=""
                  className=" border-2 border-orange-300 w-full h-full rounded-full object-cover"
                />
              </label>
              <input
                type="file"
                id="uploadImg"
                accept=".png, .jpeg, .jpg"
                hidden
                onChange={handleImagePreview}
              />
              {uploadedImg && (
                <button
                  onClick={handleUpload}
                  className="btn-light mt-5 max-lg:center lg:w-full px-10"
                >
                  Upload
                </button>
              )}
            </div>
            <div className="grid lg:grid-rows-2 w-full">
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                  <div className="">
                    <InputBox
                      name="fullname"
                      type="text"
                      value={fullname}
                      placeholder="Fullname"
                      icon="fi-rr-user"
                      disabled={true}
                    />
                  </div>

                  <div className="">
                    <InputBox
                      name="email"
                      type="email"
                      value={email}
                      placeholder="Email"
                      disabled={true}
                      icon="fi-rr-envelope"
                    />
                  </div>
                </div>
              </div>

              <InputBox
                name="username"
                type="text"
                value={username}
                placeholder="Username"
                icon="fi-rr-at"
              />
              <p className="text-dark-grey -mt-3">
                {tranlate.username_des[language]}
              </p>
              <textarea
                name="bio"
                id="bio"
                className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5 "
                placeholder="Bio"
                defaultValue={bio}
                onChange={handleCharacterChange}
              ></textarea>
              <p className="mt-1 text-dark-grey">
                {characterLeft} {tranlate.preview_page.char_left[language]}
              </p>
              <p className="my-6 text-dark-grey">
                {tranlate.social_link[language]}
              </p>
              <div className="md:grid md:grid-cols-2 gap-x-6">
                {Object.keys(social_links).map((key, i) => {
                  //console.log(key);
                  let link = social_links[key];
                  return (
                    <InputBox
                      key={i}
                      name={key}
                      type={"text"}
                      value={link}
                      placeholder="https://"
                      icon={
                        "fi " + (key != "website")
                          ? "fi-brands-" + key
                          : "fi-ss-site"
                      }
                    />
                  );
                })}
              </div>
              <button
                onClick={handleUpdateInfo}
                className="btn-dark w-auto px-10"
                type="submit"
              >
                {tranlate.update[language]}
              </button>
            </div>
          </div>
        </form>
      )}
    </AnimationWrapper>
  );
};

export default ChangeProfile;
