import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LanguageContext, UserAuth } from "../App";
import { filterPaginationData } from "../common/filterPaginationData";
import AboutUser from "../components/about-user.component";
import BlogPostCard from "../components/blog-post-card.component";
import InpageNavigation from "../components/inpage-navigation";
import LoadMore from "../components/load-more.component";
import Loader from "../components/loader.component";
import NoData from "../components/no-data.component";
import AnimationWrapper from "../components/page-animation.component";
import { tranlate } from "../utils/language";
import NotFoundPage from "./404.page";

export const profileStructure = {
  personal_info: {
    fullname: "",
    userName: "",
    profile_img: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: " ",
};

const ProfilePage = () => {
  let { username: profileId } = useParams();
  const [profile, setProfile] = useState(profileStructure);
  const [blogs, setBlogs] = useState(null);
  let [loading, setLoading] = useState(true);
  let [profileLoaded, setProfileLoaded] = useState("");
  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  let {
    userAuth: { username },
  } = useContext(UserAuth);

  const { language } = useContext(LanguageContext);
  const fetchProfileUser = ({ page = 1 }) => {
    axios
      .get(import.meta.env.VITE_SERVER + `/users/get-profile/${profileId}`)
      .then(({ data: { user } }) => {
        if (user !== null) {
          setProfile(user);
        }
        getBlogs({ user_id: user._id, page: page });
        setProfileLoaded(profileId);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getBlogs = ({ page = 1, user_id }) => {
    user_id = user_id === undefined ? blogs.user_id : user_id;
    axios
      .post(import.meta.env.VITE_SERVER + "/blogs/search", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        let formatedDate = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/blogs/count-search-blogs",
          data_to_send: { author: user_id },
        });
        formatedDate.use_id = user_id;
        setBlogs(formatedDate);
      });
  };

  useEffect(() => {
    if (profileId !== profileLoaded) {
      setBlogs(null);
    }
    if (blogs == null) {
      resetStates();
      fetchProfileUser({ page: 1 });
    }
  }, [profileId, blogs]);

  const resetStates = () => {
    setProfile(profileStructure);
    setLoading(true);
    setProfileLoaded("");
  };
  console.log(profileId);
  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : profile_username ? (
        <section className="h-cover md:flex flex-row-reverse items-start justify-between gap-5  min-[1100px]:gap-12 ">
          <div className="flex flex-col max-md:items-center min-w-[250px] md:w-[50%]  ">
            <img
              src={profile_img}
              className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
            />
            <h1 className="text-2xl font-medium">@{profile_username}</h1>
            <p className="text-xl capitalize h-6">{fullname}</p>
            <p>
              {total_posts.toLocaleString()} Blogs -{" "}
              {total_reads.toLocaleString()}{" "}
              {tranlate.profile_page.reads[language]}
            </p>
            {profileId == username ? (
              <div className="flex gap-4 mt-2 btn-light rounded-md">
                <Link to="/settings/edit-profile">
                  {tranlate.profile_page.edit_profile[language]}
                </Link>
              </div>
            ) : (
              " "
            )}
            <AboutUser
              className="max-md:hidden"
              bio={bio}
              social_links={social_links}
              joinedAt={joinedAt}
            />
          </div>
          <div className="flex flex-col justify-start w-full max-md:mt-12">
            <InpageNavigation
              routes={[
                `${tranlate.profile_page.published_blog[language]}`,
                `${tranlate.profile_page.about_user[language]}`,
              ]}
              defaultHidden={[`${tranlate.profile_page.about_user[language]}`]}
            >
              <>
                {blogs == null ? (
                  <Loader />
                ) : blogs.results.length ? (
                  blogs.results.map((blog, i) => {
                    return (
                      <AnimationWrapper
                        transiton={{ duration: 1, delay: i * 0.1 }}
                        key={i}
                      >
                        <BlogPostCard content={blog} author={blog.author} />
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <NoData message={"No blog"} />
                )}
                <LoadMore state={blogs} fetchDataFunc={fetchProfileUser} />
              </>
              <>
                <AboutUser
                  bio={bio}
                  social_links={social_links}
                  joinedAt={joinedAt}
                />
              </>
            </InpageNavigation>
          </div>
        </section>
      ) : (
        <NotFoundPage />
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;
