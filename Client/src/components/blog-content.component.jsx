import React, { useRef } from "react";

const Img = ({ url, caption }) => {
  return (
    <div>
      <img src={url} alt="" />
      {caption.length ? (
        <p
          className="text-center my-3 md:mb-10 text-dark-grey italic"
          dangerouslySetInnerHTML={{ __html: caption }}
        ></p>
      ) : (
        ""
      )}
    </div>
  );
};
const List = ({ style, items }) => {
  if (style === "unordered") {
    return (
      <ul className="pl-[30px]">
        {items.map((item, i) => {
          return (
            <li
              dangerouslySetInnerHTML={{ __html: item }}
              key={i}
              className="pl-5 list-disc"
            ></li>
          );
        })}
      </ul>
    );
  }
  return (
    <ol>
      {items.map((item, i) => {
        return (
          <li
            dangerouslySetInnerHTML={{ __html: item }}
            key={i}
            className="pl-5 list-decimal"
          ></li>
        );
      })}
    </ol>
  );
};
const Quote = ({ quote, caption }) => {
  return (
    <div className="bg-purple/10 pl-5 p-3 border-l-4 border-purple">
      <p
        className="text-xl leading-10 md:text-2xl"
        dangerouslySetInnerHTML={{ __html: quote }}
      ></p>
      {caption.length ? (
        <p
          className="text-base text-purple"
          dangerouslySetInnerHTML={{ __html: caption }}
        ></p>
      ) : (
        ""
      )}
    </div>
  );
};
const BlogContent = ({ block }) => {
  let { type, data } = block;

  if (type === "paragraph") {
    return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
  }
  if (type === "header") {
    if (data.level === 3) {
      return (
        <h3
          id={data.text}
          className="font-3xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h3>
      );
    } else {
      return (
        <h2
          id={data.text}
          className="font-4xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h2>
      );
    }
  }
  if (type === "image") {
    return <Img url={data.file.url} caption={data.caption} />;
  }
  if (type === "list") {
    return <List style={data.style} items={data.items} />;
  }
  if (type === "Quote") {
    return <Quote quote={data.text} caption={data.caption} />;
  }
  return <div>Blog Content</div>;
};

export default BlogContent;
