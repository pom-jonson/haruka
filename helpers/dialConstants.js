
import renderHTML from 'react-render-html';
import $ from "jquery";
import * as sessApi from "~/helpers/cacheSession-utils";
import {formatDateTimeIE} from "~/helpers/date";
// export const IS_DEVELOP = process.env.NODE_ENV !== "production";
export const dial_status = [
  "未来院", "前体重計測済", "開始済", "終了済", "後体重計測済"
];
export const dialysis_method_category = [
  "HD", "ECUM", "HDF", "HF", "OHDF", "I-HDF", "O/I-HDF", "予備"
];

export const staff_category = {
    doctor:1,
    nurse:2,
    manager:3,
}

export function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}
//code key -> name value
export function makeList_code(data, enabled = 0){
  let master_list = {};
  if (data != undefined && data.length>0 ){
      Object.keys(data).map((key) => {
          if(enabled === 1){
              if(data[key].is_enabled === 1){
                  master_list[data[key].code] = data[key].name;
              }
          } else {
              master_list[data[key].code] = data[key].name;
          }
      });
  }
  return master_list;
}
//code number -> name value
export function makeList_number(data){
  let master_list = {};
  if (data != undefined && data.length>0 ){
      Object.keys(data).map((key) => {
          master_list[data[key].number] = data[key].name;
      });
  }
  return master_list;
}

//id:number value:name
export function makeList_data(data){
    let bed_nos = [
        { id: 0, value: "" },
    ];
    if (data != undefined && data.length>0 ){
        data.map((item, index) => {
            let bed_info = {id: item.number, value: item.name};
            bed_nos[index+1]= bed_info;
        });
    }
  return bed_nos;
}

// convert full to half letter
export function convertFullToHalf(str){
    if(str == "" || str == null || str == undefined){
        return "";
    }
    let convert_str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)});
    return convert_str;
}

//id:code value:name
export function makeList_codeName(data, is_enabled = 0){
    let bed_nos = [
        { id: 0, value: "" },
    ];
    let bed_info;
    if (data != undefined && data.length>0 ){
        data.map((item, index) => {
            if (is_enabled == 1){
                if (item.is_enabled == 1){
                    bed_info = {id: item.code, value: item.name};
                    bed_nos[index+1]= bed_info;
                }
            } else {
                bed_info = {id: item.code, value: item.name};
                bed_nos[index+1]= bed_info;
            }
        });
    }
  return bed_nos;
}
//id:number value:value
export function makeList_value(data){
    let bed_nos = [
        { id: 0, value: "" },
    ];
    if (data != undefined && data.length>0 ){
        data.map((item, index) => {
            let bed_info = {id: item.number, value: item.value};
            bed_nos[index+1]= bed_info;
        });
    }
  return bed_nos;
}
//extract only enabled elements from array
export function extract_enabled(data){
  let master_data = [];
  if (data != undefined && data.length>0 ){
      data.map(item => {
        if (item.is_enabled ==1) {
          master_data.push(item);
        }
      })
  }
  return master_data;
}

//special case for only anti_master
export function code_antiItems(data){
  let code_antiItems = {};
  if (data != undefined && data.length>0 ){
      Object.keys(data).map((key) => {
        code_antiItems[data[key].code] = data[key].anti_items;
      });
  }
  return code_antiItems;
}
//-----------------------------------
//make object with code key from array
export function code_data(data){
  let master_list = {};
  if (data != undefined && data.length>0 ){
      Object.keys(data).map((key) => {
          master_list[data[key].code] = data[key];
      });
  }
  return master_list;
}

//make Array with id and name from data, id = code, name = name
export function makeList_codeID(data){
  let master_list = [];
  if (data != undefined && data.length>0 ){
      data.map((item) => {
          var temp = {};
          temp['id'] = item.code;
          temp['value'] = item.name;
          master_list.push(temp);
      });
  }
  return master_list;
}

export function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
  }

//display line break
export function displayLineBreak(val){
  if(val == undefined || val==null || val=='') return '';
  if ((typeof val) == 'number') return val;    
  if ((typeof val) != 'string') return val;
  val = escapeHtml(val);
  val = val.replace(/[\n\r]+/g, '\\n').split("\\n");
  var temp="";
  val.map((item, index) => {
      if (index < val.length-1) temp +=item + '<br/>';
      else temp += item;
  });
  temp = temp.split(" ").join("&nbsp;");  // backspace⇒ &nbsp; 変換
  return renderHTML(temp);
}

//inset br tag into string
export function insertLineBreak(val){
  if(val == undefined || val==null || val=='') return '';
  if ((typeof val) == 'number') return val;    
  if ((typeof val) != 'string') return val;
  val = escapeHtml(val);
  val = val.replace(/[\n\r]+/g, '\\n').split("\\n");
  var temp="";
  val.map((item, index) => {
      if (index < val.length-1) temp +=item + '<br/>';
      else temp += item;
  });
  temp = temp.split(" ").join("&nbsp;");  // backspace⇒ &nbsp; 変換
  return temp;
}

//auto break textarea
export function textareaBreakStr(val){
    if(val == undefined || val==null || val=='') return '';
    val = val.replace(/[\n\r]+/g, '\\n').split("\\n");

    let result_str = "";
    let line_array = [];
    if (val.length > 0) {
        val.map(item=>{
            let line_length = getTextareaLineLength(item);
            line_array.push(item);
            if (line_length > 50) {
                let line_content = getContentOfLine(item);
                result_str += line_content + "\n\r";
            } else {
                result_str += item + "\n\r";
            }
        });
    }
    return result_str;
}

function getContentOfLine(str){
    let str_length = getTextareaLineLength(str);

    if (str_length <= 50) {
        return str;
    }

    let result = getFiftyChars(str);

    return result.first + "\n\r" + getContentOfLine(result.second);
}

// textarea line
function getTextareaLineLength(val){

    let result = 0;

    for(let i=0;i<val.length;i++){
        let chr = val.charCodeAt(i);
        if((chr >= 0x00 && chr < 0x81) ||
            (chr === 0xf8f0) ||
            (chr >= 0xff61 && chr < 0xffa0) ||
            (chr >= 0xf8f1 && chr < 0xf8f4)){
            //半角文字の場合は1を加算
            result += 1;
        }else{
            //それ以外の文字の場合は2を加算
            result += 2;
        }
    }

    return result;
}

// return fiftly length's chars
function getFiftyChars(val){
    let result = {};
    let nCount = 0;
    let nPos = 0;

    for(let i=0;i<val.length;i++){
        let chr = val.charCodeAt(i);
        if (nCount > 50) break;
        if((chr >= 0x00 && chr < 0x81) ||
            (chr === 0xf8f0) ||
            (chr >= 0xff61 && chr < 0xffa0) ||
            (chr >= 0xf8f1 && chr < 0xf8f4)){
            //半角文字の場合は1を加算
            nCount += 1;
        }else{
            //それ以外の文字の場合は2を加算
            nCount += 2;
        }
        nPos = i;
    }
    result.first = val.substring(0, nPos);
    result.second = val.substring(nPos, val.length);

    return result;
}

// get half length of full text
export function getHalfLength(val){
  if (val == null || val == undefined || val.length < 1) return 0;
    let result = 0;

    for(let i=0;i<val.length;i++){
        let chr = val.charCodeAt(i);
        if((chr >= 0x00 && chr < 0x81) ||
            (chr === 0xf8f0) ||
            (chr >= 0xff61 && chr < 0xffa0) ||
            (chr >= 0xf8f1 && chr < 0xf8f4)){
            //半角文字の場合は1を加算
            result += 1;
        }else{
            //それ以外の文字の場合は2を加算
            result += 2;
        }
    }

    return result;
}

//get weekdays from int
export function getWeekday(val){
  var weekday_names = ["日", "月", "火", "水", "木", "金", "土"];
  var week_days = [];
  if (val == 0) return weekday_names;
  if (val == undefined || val == null || val=='') return week_days;
  for(var i=0; i < 7; i++){
    var pval = Math.pow(2, i);
    if ((val & pval) > 0){
      week_days.push(weekday_names[i]);
    }
  }
  return week_days;
}

export function getWeekdayFormat(val){
  var weekday_names = ["日", "月", "火", "水", "木", "金", "土"];
  var week_days_str = '';
  if (val == 0) return '日月火水木金土';
  if (val == undefined || val == null || val=='') return week_days_str;
  for(var i=0; i < 7; i++){
    var pval = Math.pow(2, i);
    if ((val & pval) > 0){      
      week_days_str += weekday_names[i];
    }
  }
  return week_days_str;
}

export function getMonthFormat (month_day) {
  if (month_day == 0 || month_day == 1) return '毎月';
  // var month_names = ['1月', '2月', '3月','4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  var month_day_str = '';
  for (var i = 1; i < 13; i++) {
    var pval = Math.pow(2, i);
    if ((month_day & pval) > 0) {
      month_day_str += i + '・';
    }
  }
  if(month_day_str != ''){
    month_day_str = month_day_str.substring(0, month_day_str.length-1) + '月';
  }
  return month_day_str;
}

export function getWeekIntervalFormat (week_interval) {
  if (week_interval === 1 || week_interval === 0) return '1/W 毎週';
  var week_interval_str = '';
  for (var i = 1; i < 6; i++) {
    var pval = Math.pow(2, i);
    if ((week_interval & pval) > 0) {
      week_interval_str += i + '・';
    }
  }
  if (week_interval_str != ''){
    week_interval_str = '第' + week_interval_str;
    week_interval_str = week_interval_str.substring(0, week_interval_str.length-1) + '曜日';
  }
  return week_interval_str;
}

//sort timing code master
export function sortTimingCodeMaster(timingCodeData){
    timingCodeData.map((item, index) => {
        // switch(item.value){
        //     case '透析開始前':
        //         item.sort_special = 0;
        //         break;
        //     case '透析開始時～直後':
        //         item.sort_special = 1;
        //         break;
        //     case '透析開始後':
        //         item.sort_special = 2;
        //         break;
        //     case '透析中':
        //         item.sort_special = 3;
        //         break;
        //     case '透析終了前':
        //         item.sort_special = 4;
        //         break;
        //     case '透析終了直前～終了時':
        //         item.sort_special = 5;
        //         break;
        //     case '透析終了後':
        //         item.sort_special = 6;
        //         break;
        // }
        item.sort_special = index;
    })
    // timingCodeData.sort(function(a, b){
    //     return (parseInt(a.sort_special) - parseInt(b.sort_special)) || (a.name_kana > b.name_kana)
    // })
    return timingCodeData;
}

//sort by timing name : 透析開始前-透析開始後-透析終了前-透析終了後
export function sortByTiming(data, timingCodeData){    
    var timing_record;
    if (data == undefined || data == null) return data;
    // if (typeof data != 'array') return data;
    if (data.length ==undefined || data.length == 0) return data;

    data.map(item => {
        if (item.timing_code != undefined){
            timing_record = timingCodeData.filter(x => x.code == item.timing_code);
            if (timing_record.length > 0){
                item.sort_special = timing_record[0].sort_special;
            } else {
                item.sort_special = 100;
            }
        }
    })    
    data.sort(function(a, b){
        return (parseInt(a.sort_special) - parseInt(b.sort_special));
    })
    return data;
}

export const Dial_tab_index = {
    DialMonitor:0,
    BeforeConfirm:1,
    Sending:2,
    BloodSet:3,
    DrainageSet:4,
    DoctorProposal:5,
    Instruction:6,
    DRMedicalRecord:7,
    VAManager:8,
    FootCare:9,
    PatientPlan:10,
    PatientInformation:11,
    MyCalendar:12,
    PatientMain:13,
};

export const Instruction_status = [
    "",
    "未",
    "要確認",
    "対応中",
    "済"
]
export const Dial_status_color = {
    None:0,
    Complete:1,
    Uncomplete:2,
};

export const Dial_telegram_field = {
    patient_id: {
        telegram_item_id:"B1",
        title:"患者 ID"
    },
    patient_name:{
        telegram_item_id:"B2",
        title:"患者名"
    },
    dial_method:{
        telegram_item_id:"B3",
        title:"治療モード"
    },
    dilution_timing:{
        telegram_item_id:"D1",
        title:"前補液/後補液の選択"
    },
    weight_before:{
        telegram_item_id:"D2",
        title:"前体重"
    },
    dw:{
        telegram_item_id:"D3",
        title:"DW"
    },
    diagonosis_time:{
        telegram_item_id:"C1",
        title:"透析時間"
    },
    drainage_time:{
        telegram_item_id:"C2",
        title:"除水時間"
    },
    target_water_removal_amount:{
        telegram_item_id:"C3",
        title:"除水量設定"
    },
    drainage_speed:{
        telegram_item_id:"C4",
        title:"除水速度"
    },
    fluid_time:{
        telegram_item_id:"C5",
        title:"補液時間"
    },
    fluid_amount:{
        telegram_item_id:"C6",
        title:"目標補液量"
    },
    fluid_speed:{
        telegram_item_id:"C7",
        title:"補液速度"
    },
    syringe_amount:{
        telegram_item_id:"D4",
        title:"IPワンショット量"
    },
    syringe_speed:{
        telegram_item_id:"C8",
        title:"IP速度"
    },
    syringe_stop_time:{
        telegram_item_id:"D5",
        title:"IP自動切り時間"
    },
    blood_flow:{
        telegram_item_id:"D6",
        title:"血液流量"
    },
    degree:{
        telegram_item_id:"C9",
        title:"透析液温度"
    },
    fluid_temperature:{
        telegram_item_id:"CA",
        title:"補液温度"
    },
    dialysate_amount:{
        telegram_item_id:"D7",
        title:"透析液流量"
    },
    hdf_init_time:{
        telegram_item_id:"D8",
        title:"I-HDF 補液開始時間"
    },
    hdf_init_amount:{
        telegram_item_id:"D9",
        title:"I-HDF 1回補液量"
    },
    hdf_step:{
        telegram_item_id:"DA",
        title:"I-HDF 補液間隔"
    },
    hdf_speed:{
        telegram_item_id:"DB",
        title:"I-HDF 1回補液速度"
    },
    blood_pressure_max:{
        telegram_item_id:"DC",
        title:"最高血圧上限"
    },
    blood_pressure_min:{
        telegram_item_id:"DD",
        title:"最高血圧下限"
    },
    blood_pressure_emax:{
        telegram_item_id:"DE",
        title:"最低血圧上限"
    },
    blood_pressure_emin:{
        telegram_item_id:"DF",
        title:"最低血圧下限"
    },
    pluse_max:{
        telegram_item_id:"DG",
        title:"脈拍上限"
    },
    pluse_min:{
        telegram_item_id:"DH",
        title:"脈拍下限"
    },
    blood_pressure_step:{
        telegram_item_id:"DI",
        title:"血圧自動測定間隔"
    },
};

// validate object array value
export function validateValue(val){
    if (val === undefined || val == null) return false;
    if (val instanceof Object && Object.entries(val).length === 0) return false;
    if (val instanceof Array && val.length === 0) return false;
    return true;
}

export function removeLeadZeros(str){
    if (str==undefined || str==null || str=='') return '';
    if (typeof str == 'number') str = str.toString();
    if (typeof str != 'string') return str;

    str = str.replace(/^0+/, '');
    var first_letter = str.substring(0,1);
    if (first_letter == '.') {        
        str = '0' + str;
        first_letter = '0';
    }

    if (first_letter =='-') {
        str = str.substring(1, str.length);
    } else {
        first_letter = '';
    }
    var second_letter = str.substring(1,2);
    if (second_letter =='.') {
        return first_letter + str;
    }
    str = str.replace(/^0+/, '');
    return first_letter + str;
}

export function toHalfWidthOnlyNumber(strVal){
    // 半角変換
    if (typeof strVal !='string') strVal = strVal.toString();
    var halfVal = strVal.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    halfVal = halfVal.replace('ー','-');
    halfVal = halfVal.replace('。', '.');
    return halfVal;
}

export function getJapanYearNameFromDate(date){
    if (date == undefined || date == null || date =='') return 0;
    date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var result = 0;
    switch(year){
        case 1912:
          if (month < 7) result = 5;
          if (month > 7) result = 4;
          if (month == 7) {
            if(day <= 30) result = 5; else result = 4;
          }
          break;
        case 1926:
          if (month < 12) result = 4;
          if (month > 12) result = 3;
          if (month == 12) {
            if(day <= 25) result = 4; else result = 3;
          }
          break;
        case 1989:
          if (month < 1) result = 3;
          if (month > 1) result = 2;
          if (month == 1) {
            if(day <= 7) result = 3; else result = 2;
          }
          break;
        case 2019:
          if (month < 4) result = 2;
          if (month > 4) result = 1;
          if (month == 4) {
            if(day <= 30) result = 2; else result = 1;
          }
          break;
        default:
            if (year < 1912 ){
                result = 5;
                break;
            }
            if (year > 1912 && year < 1926){
                result = 4;
                break;
            }
            if (year > 1926 && year < 1989){
                result = 3;
                break;
            }
            if (year > 1989 && year < 2019){
                result = 2;
                break;
            }
            if (year > 2019){
                result = 1;
                break;
            }
      }
      return result;
}

export function getJapanYearFromDate(date){
  if (date == undefined || date == null || date =='') return '';
  date = new Date(date);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var result = year;
  switch(year){
    case 1912:
      if (month < 7) result = year;
      if (month > 7) result = year + 0.5;
      if (month == 7) {
        if(day <= 30) result = year; else result = year + 0.5;
      }
      break;
    case 1926:
      if (month < 12) result = year;
      if (month > 12) result = year + 0.5;
      if (month == 12) {
        if(day <= 25) result = year; else result = year + 0.5;
      }
      break;
    case 1989:
      if (month < 1) result = year;
      if (month > 1) result = year + 0.5;
      if (month == 1) {
        if(day <= 7) result = year; else result = year + 0.5;
      }
      break;
    case 2019:
      if (month < 4) result = year;
      if (month > 4) result = year + 0.5;
      if (month == 4) {
        if(day <= 30) result = year; else result = year + 0.5;
      }
      break;
  }
  return result;
}

export function addRedBorder(id) {
  if (!$("#" + id).hasClass("red_border")) {
    $("#" + id).addClass("red_border");
  }
  if ($("#" + id + " select").length && !$("#" + id + " select").hasClass("red_border")) {
    $("#" + id).removeClass("red_border");
    $("#" + id + " select").addClass("red_border");
  }
}

export function removeRedBorder(id) {
  if ($("#" + id).hasClass("red_border")) {
    $("#" + id).removeClass("red_border");
  }
  if ($("#" + id + " select").hasClass("red_border")) {
    $("#" + id + " select").removeClass("red_border");
  }
}

export function addRequiredBg(id) {
  if (!$("#" + id).hasClass("required_field")) {
    $("#" + id ).addClass("required_field");
  }
  if (!$("#" + id + " select").hasClass("required_field")) {
    $("#" + id + " select").addClass("required_field");
  }
}

export function removeRequiredBg(id) {
  if ($("#" + id).hasClass("required_field")) {
    $("#" + id).removeClass("required_field");
  }
  if ($("#" + id + " select").hasClass("required_field")) {
    $("#" + id + " select").removeClass("required_field");
  }
}

// VA Image version
export const Dial_VA_Version = {
    version: 2
};

export const Dial_tabs = [
    {
        id: Dial_tab_index.DialMonitor,
        tab_color: Dial_status_color.None,
        title: "透析モニタ"
    },
    {
        id: Dial_tab_index.BeforeConfirm,
        tab_color: Dial_status_color.None,
        title: "開始前確認"
    },
    {
        id: Dial_tab_index.Sending,
        tab_color: Dial_status_color.None,
        title: "申し送り"
    },
    {
        id: Dial_tab_index.DrainageSet,
        tab_color: Dial_status_color.None,
        title: "除水設定"
        
    },
    {
        id: Dial_tab_index.BloodSet,
        tab_color: Dial_status_color.None,
        title: "血圧設定"
    },
    {
        id: Dial_tab_index.DoctorProposal,
        tab_color: Dial_status_color.None,
        title: "Dr上申"
    },
    {
        id: Dial_tab_index.Instruction,
        tab_color: Dial_status_color.None,
        title: "指示一覧"
    },
    {
        id: Dial_tab_index.DRMedicalRecord,
        tab_color: Dial_status_color.None,
        title: 'Drカルテ',
    },
    {
        id: Dial_tab_index.VAManager,
        tab_color: Dial_status_color.None,
        title: "VA管理"
    },
    {
        id: Dial_tab_index.FootCare,
        tab_color: Dial_status_color.None,
        title: "フットケア"
    },
    {
        id: Dial_tab_index.PatientPlan,
        tab_color: Dial_status_color.None,
        title: "他科受診"
    },
    // {
    //     id: Dial_tab_index.PatientMain,
    //     tab_color: Dial_status_color.None,
    //     title: "患者基本"
    // },
    {
        id: Dial_tab_index.PatientInformation,
        tab_color: Dial_status_color.None,
        title: "患者情報"
    },
    {
        id: Dial_tab_index.MyCalendar,
        tab_color: Dial_status_color.None,
        title: "カレンダー"
    },
];

export const timing_order = [
    {order:1, code:1, name:''},
]

export const JapanDateBorder = {
  MEIJI : new Date('1912-07-30'),
  TAISHYO : new Date('1926-12-15'),
  SHYOWA : new Date('1989-01-07'),
  HEISEI : new Date('2019-04-30'),
}

export const JapanYearConst = {
    RYOWA:1,
    HEISEI:2,
    SHYOWA:3,
    TAISHYO:4,
    MEIJI:5,
}

export const JapanYearBorder ={
    1: 2019,        //RYOWA
    2: 1989,        //HEISEI
    3: 1926,        //SHYOWA
    4: 1912,        //TAISHOYO
    5: 1868,        //MEIJI
}

export const JapnaYearMax = {
    1: 99,        //RYOWA
    2: 31,        //HEISEI
    3: 64,        //SHYOWA
    4: 15,        //TAISHOYO
    5: 45,        //MEIJI
}

export const stand_units = [
    'L',
    'l',
    'L/h',
    'l/h',
    'mL/h',
    'ml/h',
    'mL/min',
    'ml/min',
    'mL',
    'ml',
    'mmHg',
    '℃',
    'mS/cm',
    'min',
    'hr'
]

export const moveCaretPosition =(elemId)=> { //input tag の position move right
  let elem = document.getElementById(elemId);
  let range;
  if(elem != null) {
    let caretPos = elem.value.length;
    if(elem.createTextRange) {
      range = elem.createTextRange();
      range.move('character', caretPos);
      range.select();
    } else {
      elem.focus();
      if(elem.selectionStart !== undefined) {
        elem.setSelectionRange(caretPos, caretPos);
      }
    }
  }
}

export const removeFirstBreak = (str) => {
    if (str == undefined || str == null || str == '') return '';    
    if (str != '' && stripHtml(str).length == str.length) return str;    
    try{
        var obj = $(str);
    }
    catch{        
        return str;
    }
    
    if (str != '' && obj.length == 0) return str;    
    var ret = "";
    var flag = false;
    obj.each(function(){
        if (stripHtml($(this).html()) !='' || flag == true){
            if (flag){
                ret += this.outerHTML;
            } else {
                if (this.outerHTML.substring(0,4) != '<div' && this.outerHTML.substring(0,2) != '<p' && this.outerHTML.substring(0,5) != '<span'){                    
                    ret += this.outerHTML;
                } else {                    
                    ret += $(this).html();
                }
            }
            flag = true;
        }
    });    
    return ret;
}

export const stripHtml = (html) => 
  {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  //compare name kana; if same return 0, if prev is low, return -1, else return 1;
  export const compareNameKana = (name_kana_prev, name_kana_after) => {
    if (name_kana_prev == undefined || name_kana_prev == null || name_kana_prev == '') return -1;
    if (name_kana_after == undefined || name_kana_after == null || name_kana_after == '') return 1;
    var max_length = Math.max(name_kana_prev.length, name_kana_after.length);
    for (var i = 0; i < max_length; i++){
        if (name_kana_prev[i] == undefined) return -1;
        if (name_kana_after[i] == undefined) return 1;
        if (checkCharacter(name_kana_prev[i]) > checkCharacter(name_kana_after[i])) return 1;
        if (checkCharacter(name_kana_prev[i]) < checkCharacter(name_kana_after[i])) return 1;
        if (removeTopMark(name_kana_prev[i]) == removeTopMark(name_kana_after[i])) continue;

        if (checkCharacter(name_kana_prev[i] == 2)){
          if (convertLowerToUpper(name_kana_prev[i]) > convertLowerToUpper(name_kana_after[i])) return 1;
          if (convertLowerToUpper(name_kana_prev[i]) < convertLowerToUpper(name_kana_after[i])) return -1;
          if (convertLowerToUpper(name_kana_prev[i]) == convertLowerToUpper(name_kana_after[i])) continue;
        }

        if (name_kana_prev[i] > name_kana_after[i]) return 1;
        if (name_kana_prev[i] < name_kana_after[i]) return -1;
    }
    return 0;
  }

  export const checkCharacter = (letter) => {
    var alpha = /^[a-zA-Z]+$/;
    var numeric = /^[0-9]+$/;
    if ((typeof letter) != 'string') return 0;
    if (letter == null || letter =='') return 0;
    if (letter.match(alpha)) return 2;
    if (letter.match(numeric)) return 3;
    return 1;
  }

  export const removeTopMark = (character) => {
    var big_murky_Kana = {
      'ガ':'カ','ギ': "キ", 'グ': "く", 'ゲ': "ケ", 'ゴ': "コ",
      'ザ': "サ", 'ジ':" シ", 'ズ':"ス", 'ゼ':"セ", 'ゾ':"ソ",
      'ダ': "タ", 'ヂ':"チ", 'ヅ':"ツ", 'デ':"テ", 'ド':"ト",
      'バ': "ハ", 'ビ':"ヒ", 'ブ':"フ", 'ベ':"ヘ", 'ボ':"ホ",
      'パ': "ハ", 'ピ': "ヒ", 'プ': "フ", 'ペ': "ヘ", 'ポ': "ホ",
      'ッ':"ツ",
    };        

    return big_murky_Kana[character] != undefined ? big_murky_Kana[character] : character ;
  }

  export const convertLowerToUpper = (english_letter) => {
    if (english_letter.charCodeAt(0) > 0x60) {            
      return english_letter.charCodeAt(0) - 32 + 0.5;
    } else {            
        return english_letter.charCodeAt(0);
    }
  }

  export const setDateColorClassName = (date) => {    
    var weekday = date.getDay();
    if (checkHoliday(date)) return 'holiday';
    if (weekday == 6) return 'saturday';
    if (weekday == 0) return 'sunday';
    return '';
  }

  export const checkHoliday = (date) => {
    var holiday_masters = sessApi.getObjectValue("dial_common_master","holiday_master");
    if (holiday_masters == undefined || holiday_masters == null || holiday_masters.length == 0) return false;
    var cur_month = date.getMonth() + 1;
    var holidays_in_cur_month = holiday_masters.filter(x => x.month == cur_month);
    if (holidays_in_cur_month.length == 0) return false;
    var check_flag = false;
    var weekday_names = ["日", "月", "火", "水", "木", "金", "土"];
    for (var i = 0; i < holidays_in_cur_month.length;i++){
      var item = holidays_in_cur_month[i];
      if (check_flag == true) break;
      if (!checkDateBetweekDates(date, item.start_date, item.end_date)) continue;
      if (item.day != null){
        if (date.getDate() != item.day) continue;
      } else if(item.week > 0 && item.day_of_week != null){
        if (item.day_of_week != weekday_names[date.getDay()]) continue;
        var cur_date = date.getDate();
        var week_num = '';
        if (cur_date % 7 == 0) week_num = cur_date/7; else week_num = parseInt(cur_date/7) + 1;
        if (week_num != item.week) continue;
      } else {
        continue;
      }      
      check_flag = true;
    }
    return check_flag;
  }

  export const checkDateBetweekDates = (date, start_date, end_date) => {
    if (date == undefined || date == null || date =='') return false;
    if (start_date == null && end_date == null) return true;
    if(start_date != null && formatDateTimeIE(start_date).getTime() > formatDateTimeIE(date).getTime()) return false;
    if(end_date != null && formatDateTimeIE(end_date).getTime() > formatDateTimeIE(date).getTime()) return false;
    return true;
  }

  export const compareTwoObjects = (first, second) => {
    var res = true;
    if (typeof first != typeof second) return false;
    if (typeof first != 'object') return false;
    if (Object.keys(first).length != Object.keys(second).length) return false;
    Object.keys(first).map(key => {
      if (second[key] == undefined) {
        res = false;
      } else {        
        if (JSON.stringify(first[key]) != JSON.stringify(second[key])){
          res = false;
        }
      }
    })
    return res;
  }

  export const displayInjectionName = (injection_code, injection_name = '', code_display = false) => {
    var injectionMasterData = sessApi.getObjectValue("dial_common_master","injection_master");    
    if (injectionMasterData == undefined || injectionMasterData == null || injectionMasterData.length == 0) return '';
    var data = injectionMasterData.filter(x => x.code == injection_code);
    if (data.length == 0){
      if (injection_name != ''){
        if (code_display){
          return '<span style="color:red">削除済(注射コード:' + injection_code + ')</span>' + injection_name;
        } else {
          return '<span style="color:red">削除済み</span>' + injection_name;
        }
      } else {
        return ''
      }
    } else {
      if (data[0].is_enabled){
        return data[0].name;
      } else {
        return '<span style="color:red">利用停止済&nbsp;</span>' + data[0].name;
      }
    }
  }