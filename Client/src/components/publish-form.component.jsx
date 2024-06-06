import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageContext, UserAuth } from "../App";
import { TextEditor } from "../pages/editor.page";
import { tranlate } from "../utils/language";

import AnimationWrapper from "./page-animation.component";
import Tag from "./tags.components";

const PublishForm = () => {
  const { blog_id } = useParams();
  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserAuth);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const maxLimit = 200;
  const maxTags = 10;
  const [retain, setRetain] = useState(maxLimit);
  let {
    blog: { title, banner, des, tags, content },
    setBlog,
    blog,
    setEditorState,
    editorState,
  } = useContext(TextEditor);
  const handleReturnPreviousPage = () => {
    setEditorState("editor");
  };
  const handleTitleChange = (e) => {
    let value = e.target.value;
    setBlog({ ...blog, title: value });
  };
  const handleChangeDes = (e) => {
    let value = e.target.value;
    setBlog({ ...blog, des: value });
    if (retain === 0) {
      return toast.error("You achived max limit for description");
    }
    setRetain((prev) => maxLimit - value.length);
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleTags = (e) => {
    let value = e.target.value.trim().toLowerCase();
    if (e.keyCode === 13 || e.keyCode === 188) {
      if (value.length) {
        console.log(tags);
        if (tags.length < maxTags) {
          console.log(tags);
          setBlog({ ...blog, tags: [...tags, value] });
          e.target.value = "";
        } else {
          return toast.error("You achived limit tags");
        }
      }
    }
  };
  const handlePublish = () => {
    if (!title.length) {
      return toast.error("title ");
    }
    if (!des.length || des.length > maxLimit) {
      return toast.error("des");
    }
    if (!tags.length || tags.length > maxTags) {
      return toast.error("tags");
    }
    let blogObj = {
      title,
      banner,
      des,
      content,
      tags,
    };
    let toastLoading = toast.loading("publishing");
    console.log(blog);
    console.log(access_token);
    axios
      .post(
        import.meta.env.VITE_SERVER_BLOG + "/",
        { ...blogObj, id: blog_id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((blog_id) => {
        console.log(blog_id);
        toast.dismiss(toastLoading);
        toast.success("Published");
        setTimeout(() => {
          navigate("/dashboard/blogs?tab=blog", { replace: true });
        }, 2000);
      })
      .catch(({ response }) => {
        toast.dismiss(toastLoading);
        return toast.error(response.data.message);
      });
  };
  useEffect(() => {
    console.log("publish form ");
  }, []);

  return (
    <AnimationWrapper>
      <section className="w-screeen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <button
          className="w-12 h-12 absolute right-[3vw] z-10 top-[1%]"
          onClick={handleReturnPreviousPage}
        >
          <i className="fi fi-br-cross"></i>
        </button>
        <div className="max-w-[550px] center ">
          <p className="text-dark-grey mb-1">
            {tranlate.preview_page.preview[language]}
          </p>
          <div className="w-full aspect-video rounded-md bg-grey overflow-hidden mt-4">
            <img src={banner} alt="" className="rounded-md" />
          </div>

          <h1 className="text-4xl text-black font-bold leading-tight line-clamp-1">
            {title}
          </h1>
          <p className="text-black leading-tight">{des}</p>
        </div>
        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">
            {tranlate.editor_page.title[language]}
          </p>
          <input
            name="title"
            defaultValue={title}
            placeholder="title"
            className="input-box pl-4 placeholder:opacity-40"
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
          />
          <p className="text-dark-grey mb-2 mt-9">
            {tranlate.preview_page.description[language]}
          </p>
          <input
            name="description"
            defaultValue={des}
            placeholder="Description"
            className="input-box pl-4 placeholder:opacity-40"
            onChange={handleChangeDes}
            onKeyDown={handleKeyDown}
          />
          <p className="text-right mt-1 text-dark-grey">
            {retain} {tranlate.preview_page.char_left[language]}
          </p>

          <p className="text-dark-grey mb-2 mt-9">
            {tranlate.preview_page.toppic[language]}
          </p>
          <div className="bg-grey py-4 p-2 rounded-md">
            <input
              name="topic"
              placeholder="Topic"
              className={
                "sticky bg-white top-0 left-0 mb-3 input-box pl-4 placeholder:opacity-40 focus:bg-white rounded-md"
              }
              onKeyDown={handleTags}
            />
            {tags.map((tag, i) => {
              return <Tag tag={tag} key={i} tagIndex={i} />;
            })}
          </div>
          <p className="text-right mt-1 text-dark-grey">
            {maxTags} {tranlate.preview_page.char_left[language]}
          </p>

          <button className="btn-dark" onClick={handlePublish}>
            {tranlate.editor_page.publish[language]}
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
