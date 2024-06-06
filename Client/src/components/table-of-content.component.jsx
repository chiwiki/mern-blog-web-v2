import React, { useState } from "react";
import { Link } from "react-router-dom";

const TableOfContent = ({ data }) => {
  const [open, setOpen] = useState(true);
  const handleScroll = (i) => {
    const element = document.getElementById(i);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className=" w-full max-w-[500px] border bg-grey shadow-md py-3 px-4 mt-10">
      <div className="flex justify-between">
        <h1 className="font-bold font-gelasio text-[18px]">Danh mục</h1>
        <i
          className="fi fi-br-list cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        ></i>
      </div>

      <hr />
      {open && (
        <div>
          {data &&
            data.map((i, index) => {
              return (
                <h3
                  key={index}
                  style={{ paddingLeft: `${(i.level - 2) * 18}px` }}
                  onClick={() => handleScroll(i.text)}
                  className="cursor-pointer hover:underline !text-[15px] font-semibold"
                >
                  {i.text}
                </h3>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default TableOfContent;
