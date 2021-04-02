import { getCurrentDate } from "../../../../../helpers/date";

export default function() {
  return {
    medicines: [this.getEmptyInject()],   
    days: 0,
    days_suffix: "",
    usage: 0,
    usageName: "",
    usageIndex: 0,
    year: "",
    month: "",
    date: "",        
    body_part: "",  
    usage_remarks_comment: [],      
    start_date: getCurrentDate()
  };
}
