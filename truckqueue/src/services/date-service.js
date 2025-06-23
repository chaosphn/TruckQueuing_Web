import { format } from "date-fns"


export const dateFormatParser = (date, dateFormat) => {
    return format(date, dateFormat);
}