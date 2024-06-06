import React, { useState } from "react";

const InputBox = ({
  type,
  name,
  icon,
  placeHodler,
  value,
  id,
  disabled,
  className,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <>
      <label htmlFor={id} className="capitalize font-medium">
        {name}
      </label>
      <div className="w-full relative mb-4 mt-1">
        <input
          id={id}
          defaultValue={value}
          disabled={disabled}
          type={
            type === "password"
              ? passwordVisible
                ? "text"
                : "password"
              : "text"
          }
          name={name}
          placeholder={placeHodler}
          className={`${className ? className : "input-box"} `}
          required
        />
        <i className={`${icon} absolute left-4 top-1/2 -translate-y-1/2`}></i>
        {type === "password" ? (
          <i
            className={`fi ${
              passwordVisible ? "fi-rr-unlock" : "fi-rr-lock"
            } absolute right-4 top-1/2 -translate-y-1/2 duration-100`}
            onClick={() => setPasswordVisible((prev) => !prev)}
          ></i>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default InputBox;
