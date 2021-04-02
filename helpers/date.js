import {getServerTime} from "~/helpers/constants";

export const formatDate4API = dt => {
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var result = y + m + d;
  return result;
};

export const formatDateFull = (dt, seperator = "") => {
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var h = ("00" + dt.getHours()).slice(-2);
  var min = ("00" + dt.getMinutes()).slice(-2);
  var s = ("00" + dt.getSeconds()).slice(-2);
  var result = y + seperator + m + seperator + d + " " + h + ":" + min + ":" + s;
  return result;
};

export const formatDate = dateStr => {
  if (!dateStr || dateStr.length < 8) return "";
  dateStr = "" + dateStr;
  let newDate = new Date(
    dateStr.substring(0, 4),
    dateStr.substring(4, 6) - 1,
    dateStr.substring(6, 8)
  );
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${year}-${month < 10 ? `0${month}` : `${month}`}-${
    date < 10 ? `0${date}` : `${date}`
    }`;
};

export const getCurrentDate = (separator = "") => {
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`;
};


export const isValidDate = dateStr => {
  var datePat = /^(\d{4}|\d{4})(\/)(\d{2,2})(\/)(\d{2,2})$/;

  var matchArray = dateStr.match(datePat); // is the format ok?
  if (matchArray == null) {
    return false;
  }
  return true
}

export const getAge = dateStr => {
  let curDate = new Date();
  let curYear = curDate.getFullYear();
  let curMonth = curDate.getMonth() + 1;
  let curDay =  curDate.getDate();

  let birthDate = new Date(dateStr);
  let birthYear = birthDate.getFullYear();
  let birthMonth = birthDate.getMonth() + 1;
  let birthDay = birthDate.getDate();

  let age = curYear - birthYear;
  if ( curMonth < (birthMonth - 1))
  {
    age--;
  }
  if (((birthMonth - 1) == curMonth) && (curDay < birthDay))
  {
    age--;
  }
  return age;
};

export const formatJapan = val => {  // format : 2018年 02月 21日
  if (val == undefined || val == null || val =='') return '';
  let dt = new Date(val);
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);

  var result = y  + '年' + m + '月' + d + '日';
  return result;
};

export const formatJapanDate = val => {  // format : 2018年 02月 21日 (火)
  if (val == undefined || val == null || val =='') return '';
  let dt = new Date(val);
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var weekday = new Array(7);
  weekday[0] = "日";
  weekday[1] = "月";
  weekday[2] = "火";
  weekday[3] = "水";
  weekday[4] = "木";
  weekday[5] = "金";
  weekday[6] = "土";

  var result = y  + '年' + m + '月' + d + '日' + '(' + weekday[dt.getDay()] + ')';
  return result;
};

export const formatJapanDateNoYear = val => {  // format : 02月 21日 (火)
  let dt = new Date(val);
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var weekday = new Array(7);
  weekday[0] = "日";
  weekday[1] = "月";
  weekday[2] = "火";
  weekday[3] = "水";
  weekday[4] = "木";
  weekday[5] = "金";
  weekday[6] = "土";

  var result = m + '月' + d + '日' + '(' + weekday[dt.getDay()] + ')';
  return result;
};

export const formatJapanYearMonth = val => {  // format : 2018年 02月)
  let dt = new Date(val);
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var result = y  + '年' + m + '月';
  return result;
};

export const formatJapanYear = val => {  // format : 2018年
  let dt = new Date(val);
  var y = dt.getFullYear();
  var result = y  + '年';
  return result;
};

export const formatJapanMonth = val => {  // format : 2018年 02月
  let dt = new Date(val);
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var result = y  + '年' + m + '月';
  return result;
};

export const formatDateSlash = val => {  // format : 2018/02/21
  if (val == undefined || val == null || val =='') return '';
  let dt = new Date(val);
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var result = y + '/' + m + '/' + d;
  return result;
};
export const formatDateLine = val => {  // format : 2018-02-21
  if (val == undefined || val == null || val =='') return '';
  let dt = new Date(val);
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var result = y + '-' + m + '-' + d;
  return result;
};

export const getPrevDayByJapanFormat = val => {  // format : 2019年11月14日(木)
  let cur_day;
  var date = new Date(val);
  var month = parseInt(("0" + (date.getMonth() + 1)).slice(-2));
  var day = parseInt(("0" + date.getDate()).slice(-2));
  var year = parseInt(date.getFullYear());
  if(day == 1){
    if(month == 1){
      cur_day = new Date(year - 1, 11, 31);
    } else {
      cur_day = new Date(year, month -1, 0);
    }
  } else {
    cur_day = new Date(year, month - 1, day -1);
  }
  return cur_day;
};

export const getNextDayByJapanFormat = val => {  // format : 2019年11月14日(木)
  let cur_day;
  var date = new Date(val);
  var month = parseInt(("0" + (date.getMonth() + 1)).slice(-2));
  var day = parseInt(("0" + date.getDate()).slice(-2));
  var year = parseInt(date.getFullYear());
  if(val === new Date(year, month + 1, 0)){
    if(month === 12){
      cur_day = new Date(year + 1, 1, 1);
    } else {
      cur_day = new Date(year, month , 1);
    }
  } else {
    cur_day = new Date(year, month -1, day + 1);
  }
  return cur_day;
};

export const getPrevMonthByJapanFormat = val => {  // format : 2019年11月(木)
  let cur_day;
  var date = new Date(val);
  var month = parseInt(("0" + (date.getMonth() + 1)).slice(-2));
  var day = parseInt(("0" + date.getDate()).slice(-2));
  var year = parseInt(date.getFullYear());
  if(month == 1){
    cur_day = new Date(year - 1, 11, day);
  } else {
    cur_day = new Date(year, month-2, day);
  }
  return cur_day;
};

export const getNextMonthByJapanFormat = val => {  // format : 2019年11月(木)
  let cur_day;
  var date = new Date(val);
  var month = parseInt(("0" + (date.getMonth() + 1)).slice(-2));
  var day = parseInt(("0" + date.getDate()).slice(-2));
  var year = parseInt(date.getFullYear());
  if(month == 12){
    cur_day = new Date(year + 1, 0, day);
  } else {
    cur_day = new Date(year, month, day);
  }
  return cur_day;
};

export const formatTime = val => {  // format : 12 : 24
  if (val == undefined || val == null || val == '') return '';
  let dt = new Date(val);
  var h = ("00" + dt.getHours()).slice(-2);
  var min = ("00" + dt.getMinutes()).slice(-2);
  var result = h + ":" + min ;
  return result;
};

export const formatJapanDateSlash = val => {  // format : 2018/02/21(火)
  if (val == undefined || val == null || val =='') return '';
  if (val == '日未定') return val;
  val = val.split("-").join("/");
  let dt = new Date(val);
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var weekday = new Array(7);
  weekday[0] = "日";
  weekday[1] = "月";
  weekday[2] = "火";
  weekday[3] = "水";
  weekday[4] = "木";
  weekday[5] = "金";
  weekday[6] = "土";

  var result = y  + '/' + m + '/' + d + '' + '(' + weekday[dt.getDay()] + ')';
  return result;
};

export const getWeekName = (year, month, date) => { //param 2020, 3, 4
  let val = year;
  if(month < 10){
    val  = val + '-0' + month;
  } else {
    val  = val + '-' + month;
  }
  if(date < 10){
    val  = val + '-0' + date;
  } else {
    val  = val + '-' + date;
  }
  let dt = new Date(val);
  var weekday = new Array(7);
  weekday[0] = "日";
  weekday[1] = "月";
  weekday[2] = "火";
  weekday[3] = "水";
  weekday[4] = "木";
  weekday[5] = "金";
  weekday[6] = "土";

  return weekday[dt.getDay()];
};

//param [2,3,5]
//symbol default => "、"
//return 火水金
export const getWeekNamesBySymbol = (_weekdays, symbol="、") => {
  let result = "";
  let week_days = [
    {name:"日", value: 0},
    {name:"月", value: 1},
    {name:"火", value: 2},
    {name:"水", value: 3},
    {name:"木", value: 4},
    {name:"金", value: 5},
    {name:"土", value: 6}
  ];
  _weekdays.map(ele=>{
    let week_name = "";
    week_days.map(item=>{
      if(item.value == ele ){
        week_name = item.name;
      }
    });
    if(result == ""){
      result = week_name;
    } else {
      result = result + symbol + week_name;
    }
  });
  return result;
};

export const formatTimePicker = val => {
  if (val == undefined || val == null || val == '') return '';
  var d = new Date(),
    s = val,
    ss = s.replace(":", "."),
    parts = ss.match(/(\d+)\.(\d+)/),
    hours = parseInt(parts[1], 10),
    minutes = parseInt(parts[2], 10);

  d.setHours(hours);
  d.setMinutes(minutes);
  return d;
};


export const formatNowTime = () => {  // format : 12 : 24

  var d = new Date(),
    hours = parseInt(("00" + d.getHours()).slice(-2), 10),
    minutes = parseInt(("00" + d.getMinutes()).slice(-2), 10);

  d.setHours(hours);
  d.setMinutes(minutes);
  return d;
};

export const formatDateIE = dt => { // 2019-11-28 00:00:00
  var datas = dt.split(" ");
  var ymd = datas[0].split("-");
  var temp = "";
  if(parseInt(ymd[1]) < 10) {
    temp = parseInt(ymd[1]);
    ymd[1] = "0" + temp.toString();
  }
  if(parseInt(ymd[2]) < 10) {
    temp = parseInt(ymd[2]);
    ymd[2] = "0" + temp.toString();
  }
  var dt_str = ymd.join("-");
  return new Date(dt_str);
};

export const formatTimeHourIE = dt => { // 2019-11-28 00:00:00
  if (dt == null || dt == undefined || dt == ""){
    return "--:--"
  }
  if(dt instanceof Date) {
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var h = ("00" + dt.getHours()).slice(-2);
    var min = ("00" + dt.getMinutes()).slice(-2);
    var s = ("00" + dt.getSeconds()).slice(-2);
    dt = y + "/" + m + "/" + d + " " + h + ":" + min + ":" + s;
  }
  var datas = dt.split(" ");
  if (datas[1] == undefined || datas[1] == null) {
    return datas[0];
  }
  return datas[1].substring(0, 2);
};

export const formatTimeIE = dt => { // 11:27
  if (dt == null || dt == undefined || dt == ""){
    return "--:--"
  }
  if(dt instanceof Date) {
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var h = ("00" + dt.getHours()).slice(-2);
    var min = ("00" + dt.getMinutes()).slice(-2);
    var s = ("00" + dt.getSeconds()).slice(-2);
    dt = y + "/" + m + "/" + d + " " + h + ":" + min + ":" + s;
  }
  var datas = dt.split(" ");
  if (datas[1] == undefined || datas[1] == null) {
    return datas[0];
  }
  return datas[1].substring(0, 5);
};

export const formatTimeSecondIE = dt => { // 2019-11-28 00:00:00
  if (dt == null || dt == undefined || dt == ""){
    return "--:--"
  }
  if(dt instanceof Date) {
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var h = ("00" + dt.getHours()).slice(-2);
    var min = ("00" + dt.getMinutes()).slice(-2);
    var s = ("00" + dt.getSeconds()).slice(-2);
    dt = y + "/" + m + "/" + d + " " + h + ":" + min + ":" + s;
  }
  var datas = dt.split(" ");
  if (datas[1] == undefined || datas[1] == null) {
    return datas[0];
  }
  return datas[1].substring(0, 8);
};

export const getThirdDayByJapanFormat = val => {  // format : 2019年11月14日(木)
  let cur_day;
  var date = new Date(val);
  var month = parseInt(("0" + (date.getMonth() + 1)).slice(-2));
  var day = parseInt(("0" + date.getDate()).slice(-2));
  var year = parseInt(date.getFullYear());
  if(val === new Date(year, month + 1, 0)){
    if(month === 12){
      cur_day = new Date(year + 1, 1, 1);
    } else {
      cur_day = new Date(year, month , 1);
    }
  } else {
    cur_day = new Date(year, month -1, day + 3);
  }
  return cur_day;
};

export const getAfterDayByJapanFormat = (val, after_day) => {  // format : 2019年11月14日(木)
  let cur_day;
  var date = new Date(val);
  var month = parseInt(("0" + (date.getMonth() + 1)).slice(-2));
  var day = parseInt(("0" + date.getDate()).slice(-2));
  var year = parseInt(date.getFullYear());
  if(val === new Date(year, month + 1, 0)){
    if(month === 12){
      cur_day = new Date(year + 1, 1, 1);
    } else {
      cur_day = new Date(year, month , 1);
    }
  } else {
    cur_day = new Date(year, month -1, day + after_day);
  }
  return cur_day;
};

export const formatDateTimeIE = val => {
  if(val == undefined || val == null || val == "")
    return "";

  if(val instanceof Date) {
    var y = val.getFullYear();
    var m = ("00" + (val.getMonth() + 1)).slice(-2);
    var d = ("00" + val.getDate()).slice(-2);
    var h = ("00" + val.getHours()).slice(-2);
    var min = ("00" + val.getMinutes()).slice(-2);
    var s = ("00" + val.getSeconds()).slice(-2);
    var result = y + "/" + m + "/" + d + " " + h + ":" + min + ":" + s;
    return new Date(result);
  }

  var datas = val.split(" ");
  var ymd = datas[0].split("-");
  var temp = "";
  if(parseInt(ymd[1]) < 10) {
    temp = parseInt(ymd[1]);
    ymd[1] = "0" + temp.toString();
  }
  if(parseInt(ymd[2]) < 10) {
    temp = parseInt(ymd[2]);
    ymd[2] = "0" + temp.toString();
  }
  var dt_str = ymd.join("/");
  if(datas.length>1){
    dt_str = dt_str +" "+ datas[1];
  }

  return new Date(dt_str);
};

export const formatJapanDateTimeIE = val => {
  if(val == undefined || val == null || val == "")
    return "";

  if(val instanceof Date) {
    var y = val.getFullYear();
    var m = ("00" + (val.getMonth() + 1)).slice(-2);
    var d = ("00" + val.getDate()).slice(-2);
    var h = ("00" + val.getHours()).slice(-2);
    var min = ("00" + val.getMinutes()).slice(-2);
    var s = ("00" + val.getSeconds()).slice(-2);
    var result = y + "/" + m + "/" + d + " " + h + ":" + min + ":" + s;
    return result;
  }

  var datas = val.split(" ");
  var ymd = datas[0].split("-");
  var temp = "";
  if(parseInt(ymd[1]) < 10) {
    temp = parseInt(ymd[1]);
    ymd[1] = "0" + temp.toString();
  }
  if(parseInt(ymd[2]) < 10) {
    temp = parseInt(ymd[2]);
    ymd[2] = "0" + temp.toString();
  }
  var dt_str = ymd.join("/");
  if(datas.length>1){
    dt_str = dt_str +" "+ datas[1];
  }
  return dt_str;
};

export const formatDateTimeStr = val => {
  if(val == undefined || val == null || val == "")
    return "";

  if(val instanceof Date) {
    var y = val.getFullYear();
    var m = ("00" + (val.getMonth() + 1)).slice(-2);
    var d = ("00" + val.getDate()).slice(-2);
    var h = ("00" + val.getHours()).slice(-2);
    var min = ("00" + val.getMinutes()).slice(-2);
    var s = ("00" + val.getSeconds()).slice(-2);
    var result = y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
    return result;
  } else {
    return "";
  }
  //
  // var datas = val.split(" ");
  // var ymd = datas[0].split("-");
  // var temp = "";
  // if(parseInt(ymd[1]) < 10) {
  //     temp = parseInt(ymd[1]);
  //     ymd[1] = "0" + temp.toString();
  // }
  // if(parseInt(ymd[2]) < 10) {
  //     temp = parseInt(ymd[2]);
  //     ymd[2] = "0" + temp.toString();
  // }
  // var dt_str = ymd.join("-");
  // if(datas.length>1){
  //     dt_str = dt_str +" "+ datas[1];
  // }


};

export const getTimeZoneBaseLocal = (val) => {
  let cur_date_time = new Date();
  let timezone = val;
  if(val == null || val == undefined || val== "") {
    timezone = {
      "1":{ "name":"午前", "start":"09:40", "end":"15:00" },
      "2":{ "name":"午後", "start":"16:35", "end":"22:30" },
      "3":{ "name":"夜間", "start":"", "end":"" },
      "4":{ "name":"深夜", "start":"22:30", "end":"07:00" }
    };
  }
  var dt = new Date(cur_date_time);
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var dt_str;
  var today = y+"/"+m+"/"+d;
  dt_str = today + " " + timezone[4].end;
  var morning_start = new Date(dt_str);
  dt_str = today + " " + timezone[1].end;
  var morning_end = new Date(dt_str);
  dt_str = today + " " + timezone[2].end;
  var after_end =  new Date(dt_str);

  if(dt.getTime() > morning_start.getTime() && dt.getTime() <= morning_end.getTime()) {    
    return 1; //午前
  } else if(dt.getTime() > morning_end.getTime() && dt.getTime() <= after_end.getTime()) {    
    return 2; //午後
  } else {    
    return 4; //深夜
  }
  // 午前 7-15
  // 午後 15-22:30
  //深夜
}

export const getTimeZone = async(val)=> {
  var cur_date_time = await getServerTime();
  let timezone = val;
  if(val == null || val == undefined || val== "") {
    timezone = {
      "1":{ "name":"午前", "start":"09:40", "end":"15:00" },
      "2":{ "name":"午後", "start":"16:35", "end":"22:30" },
      "3":{ "name":"夜間", "start":"", "end":"" },
      "4":{ "name":"深夜", "start":"22:30", "end":"07:00" }
    };
  }
  var dt = new Date(cur_date_time);
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var dt_str;
  var today = y+"/"+m+"/"+d;
  dt_str = today + " " + timezone[4].end;
  var morning_start = new Date(dt_str);
  dt_str = today + " " + timezone[1].end;
  var morning_end = new Date(dt_str);
  dt_str = today + " " + timezone[2].end;
  var after_end =  new Date(dt_str);

  if(dt.getTime() > morning_start.getTime() && dt.getTime() <= morning_end.getTime()) {    
    return 1; //午前
  } else if(dt.getTime() > morning_end.getTime() && dt.getTime() <= after_end.getTime()) {    
    return 2; //午後
  } else {    
    return 4; //深夜
  }
  // 午前 7-15
  // 午後 15-22:30
  //深夜
};

export const getDifferentTime = (first_dt,second_dt) => {
  let diff_time = 0;
  if(first_dt == undefined || first_dt == null || first_dt== "" ||
    second_dt == undefined || second_dt == null || second_dt== "" ) {
    return diff_time;
  }
  if(!(first_dt instanceof Date)) {
    first_dt = new Date(first_dt);
  }
  if(!(second_dt instanceof Date)) {
    second_dt = new Date(second_dt);
  }
  diff_time = Math.abs(first_dt.getTime() - second_dt.getTime());
  return diff_time;
};

export const getAgeFromBirthday = (birthday) => {
  let ret = '';
  if(birthday === undefined || birthday == null || birthday == "") return ret;
  let cur_time = new Date().getTime();
  let birth_time = new Date(birthday);
  let day = parseInt((cur_time-birth_time)/(60 * 60 * 1000 * 24));
  let month = parseInt((cur_time-birth_time)/(60 * 60 * 1000 * 24 * 30));
  let year = parseInt((cur_time-birth_time)/(60 * 60 * 1000 * 24 * 365));
  if (year == 0 && month == 0) {
    ret = day + "日";
  } else if (year == 0 && month != 0) {
    ret = month + 'ヶ月';
  } else {
    ret = year + '歳';
  }
  return ret;
};

export const formatDateString = (dt) => { //ex) 20201120034455
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var h = ("00" + dt.getHours()).slice(-2);
  var min = ("00" + dt.getMinutes()).slice(-2);
  var s = ("00" + dt.getSeconds()).slice(-2);
  var result = y + m + d + h + min + s;
  return result;
};

export const formatJapanSlashDateTime=(val)=>{ // 2021-03-16 03:28:15 =>2021/03/16(土) 03:28:15
  if (val === undefined || val == null || val === '') return '';
  val = val.split("-").join("/");
  let dt = new Date(val);
  let year = dt.getFullYear();
  let mon = ("00" + (dt.getMonth() + 1)).slice(-2);
  let date = ("00" + dt.getDate()).slice(-2);
  let h = ("00" + dt.getHours()).slice(-2);
  let min = ("00" + dt.getMinutes()).slice(-2);
  let s = ("00" + dt.getSeconds()).slice(-2);
  let weekday = new Array(7);
  weekday[0] = "日";
  weekday[1] = "月";
  weekday[2] = "火";
  weekday[3] = "水";
  weekday[4] = "木";
  weekday[5] = "金";
  weekday[6] = "土";
  return year  + '/' + mon + '/' + date + '' + '(' + weekday[dt.getDay()] + ')' + ' ' + h + ':' + min + ':' + s;
};

export const formatJapanDateTime=(val)=>{ // 2021-03-16 03:28:15 =>2021年03月16日(土) 03時28分15秒
  if (val === undefined || val == null || val === '') return '';
  val = val.split("-").join("/");
  let dt = new Date(val);
  let year = dt.getFullYear();
  let mon = ("00" + (dt.getMonth() + 1)).slice(-2);
  let date = ("00" + dt.getDate()).slice(-2);
  let h = ("00" + dt.getHours()).slice(-2);
  let min = ("00" + dt.getMinutes()).slice(-2);
  let s = ("00" + dt.getSeconds()).slice(-2);
  let weekday = new Array(7);
  weekday[0] = "日";
  weekday[1] = "月";
  weekday[2] = "火";
  weekday[3] = "水";
  weekday[4] = "木";
  weekday[5] = "金";
  weekday[6] = "土";
  return year  + '年' + mon + '月' + date + '日' + '(' + weekday[dt.getDay()] + ')' + ' ' + h + '時' + min + '分' + s +'秒';
};

export const formatDateTimeJapan=(val)=>{ // 2021-03-16 03:28:15 =>2021年03月16日03時28分
  if (val === undefined || val == null || val === '') return '';
  val = val.split("-").join("/");
  let dt = new Date(val);
  let year = dt.getFullYear();
  let mon = ("00" + (dt.getMonth() + 1)).slice(-2);
  let date = ("00" + dt.getDate()).slice(-2);
  let h = ("00" + dt.getHours()).slice(-2);
  let min = ("00" + dt.getMinutes()).slice(-2);
  return year  + '年' + mon + '月' + date + '日' + h + '時' + min + '分';
};
