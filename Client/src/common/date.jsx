import { useContext } from "react";
import { LanguageContext } from "../App";
import { tranlate } from "../utils/language";

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Oct",
  "Nov",
  "Dec",
];
let days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "Thursday",
  "friday",
  "saturday",
];

const getDay = (timestamp) => {
  let date = new Date(timestamp);
  return `${days[date.getDay()]}, ${months[date.getMonth()]}_${date.getDate()}`;
};

const getFullDay = (timestamp) => {
  let date = new Date(timestamp);
  let curDate = new Date(Date.now());
  const { language } = useContext(LanguageContext);

  let timeDuring = curDate.getTime() - date.getTime();

  let minute = Math.floor(timeDuring / 1000 / 60);
  let hours = Math.floor(timeDuring / 1000 / 3600);
  let dates = Math.floor(hours / 24);

  if (minute < 1) {
    return "Vua xong";
  }
  if (hours < 1) {
    return `${minute} ${tranlate.minutes[language]}`;
  }
  if (dates < 1) {
    return `${hours} ${tranlate.hours[language]}`;
  }
  if (dates < 7) {
    return `${dates} ${tranlate.days[language]}`;
  }
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
export { getDay, getFullDay };
