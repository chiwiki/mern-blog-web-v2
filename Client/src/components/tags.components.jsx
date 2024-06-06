import React, { useContext } from "react";

import { TextEditor } from "../pages/editor.page";

const Tag = ({ tag, tagIndex }) => {
  let {
    blog: { tags },
    blog,
    setBlog,
  } = useContext(TextEditor);
  const deleteTag = () => {
    tags = tags.filter((t) => t !== tag);
    setBlog({ ...blog, tags });
  };

  const handleEditor = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      let curTag = e.target.innerText;
      tags[tagIndex] = curTag;
      e.target.setAttribute("contentEditable", false);
      setBlog({ ...blog, tags });
    }
  };

  const addEditable = (e) => {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  };

  return (
    <div className="bg-white inline-block relative rounded-full mr-2 px-5 p-2 hover:bg-opacity-50 pr-8 mt-2">
      <p
        className="outline-none"
        onKeyDown={handleEditor}
        onClick={addEditable}
      >
        {tag}
      </p>
      <button
        onClick={deleteTag}
        className="absolute right-2 top-1/2 -translate-y-1/2 mt-[2px]"
      >
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  );
};

export default Tag;
