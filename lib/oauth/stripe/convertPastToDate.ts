import moment from "moment";

/**
 * Convert past date into date object
 * @param date - Date in the "fromNow" format e.g. 5 hr. ago
 */
const convertPastToDate = (string: string): Date => {
  const number = string.split(" ")[0];
  const interval = string.split(" ")[1];
  const now = moment(new Date());

  let date = moment().toDate();

  // Handle seconds ago
  if (interval.includes("sec")) {
    date = moment(now).subtract(number, "seconds").toDate();
  }
  // Handle minutes ago
  if (interval.includes("min") || interval.includes("minute")) {
    date = moment(now).subtract(number, "minutes").toDate();
  }
  // Handle hours ago
  else if (interval.includes("hr") || interval.includes("hour")) {
    date = moment(now).subtract(number, "hours").toDate();
  }
  // Handle days ago
  else if (interval.includes("d.") || interval.includes("day")) {
    date = moment(now).subtract(number, "days").toDate();
  } else {
    date = now.toDate();
  }

  return date;
};

export { convertPastToDate };
