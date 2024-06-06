import React, { createContext, useContext, useState } from "react";
import { UserAuth } from "../App";
import BlogEditor from "../components/blog-editor.component";
import Loader from "../components/loader.component";
import PublishForm from "../components/publish-form.component";
import { Navigate } from "react-router-dom";
const blogStructure = {
  title: "",
  banner: "",
  des: "",
  tags: [],
  content: [],
  // author: {
  //   personal_info: {},
  // },
};
export const TextEditor = createContext({});
const EditorPage = () => {
  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserAuth);
  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <TextEditor.Provider
      value={{
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
        blog,
        setBlog,
      }}
    >
      {!access_token ? (
        <Navigate to="/signin" />
      ) : isLoading ? (
        <Loader />
      ) : editorState === "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </TextEditor.Provider>
  );
};

export default EditorPage;
