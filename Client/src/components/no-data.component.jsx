import React from "react";

const NoData = ({ message }) => {
  return (
    <div className="w-full rounded-full bg-grey/50 py-2 text-center">
      <h1 className="text-black ">{message}</h1>
    </div>
  );
};

export default NoData;
