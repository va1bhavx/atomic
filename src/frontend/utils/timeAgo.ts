import dayjs from "../lib/dayjs";

export const timeAgo = (date: string) => {
  return dayjs.utc(date).fromNow();
};
