import date from "date-and-time";

export const parseDate = (inputDate: any) => {
  return date.format(new Date(inputDate), "YYYY/MM/DD HH:mm");
};
