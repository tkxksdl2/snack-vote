import date from "date-and-time";

export const parseDate = (inputDate: any) => {
  const now = new Date(Date.now());
  const contentDate = new Date(inputDate);
  const minutes = Math.floor((now.getTime() - contentDate.getTime()) / 60000);
  if (minutes <= 1) return "방금 전";
  else if (minutes < 60) return `${minutes}분 전`;
  else if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`;
  else if (minutes < 10080) return `${Math.floor(minutes / 1440)}일 전`;
  return date.format(new Date(inputDate), "YYYY/MM/DD HH:mm");
};
