import React from "react";
import Header from "@editorjs/header";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import List from "@editorjs/list";
import Link from "@editorjs/link";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { uploadImg } from "../common/uploadImg";

const handleUploadByFile = (e) => {
  console.log(e);

  return uploadImg(e).then((url) => {
    console.log(url);
    return {
      success: 1,
      file: { url },
    };
  });
};

const handleUploadByUrl = (e) => {
  let image = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (error) {
      reject(error.message);
    }
  });
  return image.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

export const tools = {
  header: {
    class: Header,
    config: {
      placeholder: "Type heading...",
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  embed: Embed,
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile: handleUploadByFile,
        uploadByUrl: handleUploadByUrl,
      },
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  // link: Link,
  Quote: Quote,
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+SHIFT+M",
  },
  marker: Marker,
};
