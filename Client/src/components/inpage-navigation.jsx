import React, { useEffect, useRef, useState } from "react";

export let activeTagRef;
export let activeLineRef;
const InpageNavigation = ({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  children,
}) => {
  const [inNavTab, setInNavTag] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  activeTagRef = useRef();
  activeLineRef = useRef();

  const handleChangeTab = (button, i) => {
    setInNavTag(i);
    let { offsetWidth, offsetLeft } = button;
    console.log(offsetLeft, offsetWidth);
    activeLineRef.current.style.left = offsetLeft + "px";
    activeLineRef.current.style.width = offsetWidth + "px";
  };
  useEffect(() => {
    console.log(width);
    if (width > 766 && inNavTab !== defaultActiveIndex) {
      console.log("inner if: ", width);
      handleChangeTab(activeTagRef.current, defaultActiveIndex);
    }
    activeTagRef.current.click();
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, [width]);
  return (
    <>
      <div className="relative bg-white border-b border-grey flex flex-nowrap overflow-x-auto mb-8">
        {routes.map((route, i) => {
          // console.log(
          //   `${route} ${defaultHidden.includes(route) === true ? "Yes" : ""}`
          // );
          return (
            <button
              key={i}
              ref={defaultActiveIndex === i ? activeTagRef : null}
              className={`p-4 px-5 capitalize ${
                inNavTab === i ? "text-black" : "text-dark-grey"
              } duration-150 ${
                defaultHidden.includes(route) ? "md:hidden" : ""
              }`}
              onClick={(e) => handleChangeTab(e.target, i)}
            >
              {route}
            </button>
          );
        })}
        <hr
          ref={activeLineRef}
          className="absolute bottom-0 duration-300 border-dark-grey"
        />
      </div>
      {Array.isArray(children) ? children[inNavTab] : children}
    </>
  );
};

export default InpageNavigation;
