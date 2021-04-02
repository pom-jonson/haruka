import {formatJapanDateSlash} from "~/helpers/date";

export const clipboardNutritionGuidance = (order_data) => {
  let clipboard_text = "予約日時" + "：" + (formatJapanDateSlash(order_data.reserve_datetime.split(' ')[0])+" "+order_data.reserve_datetime.split(' ')[1]) + "\n";
  clipboard_text += "身長：" + order_data.height + "cm" + "\n";
  clipboard_text += "体重：" + order_data.weight + "㎏" + "\n";
  clipboard_text += "BMI：" + order_data.bmi + "\n";
  if(order_data.request_disease_names !== undefined){
    clipboard_text += "病名：" + "\n";
    order_data.request_disease_names.map(disease_name=>{
      clipboard_text += getOneSpaces(3) + disease_name + "\n";
    });
  }
  clipboard_text += "指示食種：" + order_data.food_type_name + "\n";
  clipboard_text += "エネルギー：" + order_data.calorie + "kcal" + "\n";
  clipboard_text += "塩分：" + order_data.salt_id + "g" + "\n";
  clipboard_text += "蛋白質：" + order_data.protein + "g" + "\n";
  clipboard_text += "リン：" + (order_data.phosphorus_flag == 1 ? "制限あり" : "制限なし") + "\n";
  clipboard_text += "脂質：" + order_data.lipid + "g" + "\n";
  clipboard_text += "カリウム：" + (order_data.potassium_flag == 1 ? "制限あり" : "制限なし") + "\n";
  clipboard_text += "糖質：" + order_data.sugar + "g" + "\n";
  clipboard_text += "水分：" + order_data.moisture + "㎖" + "\n";
  clipboard_text += "PFC比：" + order_data.pfc_ratio + "\n";
  clipboard_text += "P/S比：" + order_data.ps_ratio + "\n";
  if(order_data.request_content_names !== undefined && order_data.request_content_names.length > 0){
    clipboard_text += "指示内容：" + "\n";
    order_data.request_content_names.map(content_name=>{
      clipboard_text += getOneSpaces(3) + content_name + "\n";
    });
  }
  if(order_data.guidance_content_other !== ""){
    clipboard_text += "指示内容のその他：" + order_data.guidance_content_other + "\n";
  }
  if(order_data.importance_message_names !== undefined && order_data.importance_message_names.length > 0){
    clipboard_text += "重点伝達事項：" + "\n";
    order_data.importance_message_names.map(message_name=>{
      clipboard_text += getOneSpaces(3) + message_name + "\n";
    });
  }
  if(order_data.content_other !== ""){
    clipboard_text += "重点伝達事項のその他：" + order_data.content_other + "\n";
  }
  if(order_data.free_comment !== ""){
    clipboard_text += "フリーコメント：" + order_data.free_comment;
  }
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

const getOneSpaces = (_n) => {
  let result = "";
  let one_space = "　";
  for (var i = _n - 1; i >= 0; i--) {
    result += one_space;
  }
  return result;
}