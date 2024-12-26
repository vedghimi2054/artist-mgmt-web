import dayjs from "dayjs";


export const formatToDbDateTime = (date) => {
  if (!date) return ""; 
  return dayjs(date).format('YYYY-MM-DD')
  };

