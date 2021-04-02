import { formatDateFull } from "../../../helpers/date";
export default function(category, detail) {
  
  let oplog = window.localStorage.getItem("operation_log");
  let operation_log = [];
  if(oplog !== null) {
    operation_log = JSON.parse(window.localStorage.getItem("operation_log") || "");
  }
  let time = new Date();
  let log = {
    time: formatDateFull(time, "-"),
    category: category,
    detail: detail
  };
  operation_log.push(log);
  window.localStorage.setItem("operation_log", JSON.stringify(operation_log));

  return false;
 
}