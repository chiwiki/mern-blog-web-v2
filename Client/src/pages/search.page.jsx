import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { filterPaginationData } from "../common/filterPaginationData";
import BlogPostCard from "../components/blog-post-card.component";
import InpageNavigation from "../components/inpage-navigation";
import LoadMore from "../components/load-more.component";
import Loader from "../components/loader.component";
import NoData from "../components/no-data.component";
import AnimationWrapper from "../components/page-animation.component";
import UserCard from "../components/user-card.component";

const SearchPage = () => {
  let { query } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [users, setUsers] = useState(null);

  const fetchSearchBlogs = ({ page = 1, create_new_arr = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER + "/blogs/search", {
        query,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/blogs/count-search-blogs",
          data_to_send: { query },
          create_new_arr,
        });
        setBlogs(formatedData);
        console.log(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchUsers = () => {
    axios
      .get(import.meta.env.VITE_SERVER + `/users/search/${query}`)
      .then(({ data: { users } }) => {
        setUsers(users);
        console.log(users);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    resetState();
    fetchSearchBlogs({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);

  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  };

  const UserCardWrapper = () => {
    return (
      <>
        {!users ? (
          <Loader />
        ) : users.length ? (
          <div>
            {users.map((user, i) => {
              return (
                <AnimationWrapper>
                  <UserCard user={user} key={i} />
                </AnimationWrapper>
              );
            })}
          </div>
        ) : (
          <NoData message={"No User data"} />
        )}
      </>
    );
  };
  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InpageNavigation
          routes={[`Search results from "${query}"`, "Account matched"]}
          defaultHidden={["Account matched"]}
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
              <NoData message="No blogs published" />
            )}
            <LoadMore state={blogs} fetchDataFunc={fetchSearchBlogs} />
          </>

          <>
            <UserCardWrapper />
          </>
        </InpageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">
          User related to search <i className="fi fi-rr-user"></i>
        </h1>
        <div>
          {!users ? (
            <Loader />
          ) : users.length ? (
            <div>
              {users.map((user, i) => {
                return (
                  <AnimationWrapper>
                    <UserCard user={user} key={i} />
                  </AnimationWrapper>
                );
              })}
            </div>
          ) : (
            <NoData message={"No User data"} />
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
