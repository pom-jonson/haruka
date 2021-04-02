import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import {Dial_telegram_field} from "~/helpers/dialConstants";
import {
  addRedBorder, removeRedBorder
} from '~/helpers/dialConstants'

export default function (dialysis_method_code=0) {
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    let default_values = init_status.dial_method_default;
    if (default_values == undefined || default_values == null) return;
    let dial_common_config = JSON.parse(
      window.sessionStorage.getItem("init_status")
    ).dial_common_config;
    let pattern_unit = null;
    if (
      dial_common_config !== undefined &&
      dial_common_config != null &&
      dial_common_config["単位名：除水設定"] !== undefined
    ) {
        pattern_unit = dial_common_config["単位名：除水設定"];
    }
    if (pattern_unit === undefined || pattern_unit == null) return;
    let return_obj = {};
    Object.keys(Dial_telegram_field).map(index=>{
        let telegram_item_id = Dial_telegram_field[index];
        default_values.find(item=>{
            if(item.telegram_item_id===telegram_item_id.telegram_item_id && item.protocol==="4.0" && item.dialysis_method_code == "0"){
                return_obj[index] = item;
            }});
    });
    Object.keys(Dial_telegram_field).map(index=>{
        let telegram_item_id = Dial_telegram_field[index];
        default_values.find(item=>{
            if(item.telegram_item_id===telegram_item_id.telegram_item_id && item.protocol==="4.0" && item.dialysis_method_code == dialysis_method_code){
                return_obj[index] = item;
            }});
    });
    let error_message = [];
    let first_tag_id = '';
    Object.keys(return_obj).map(index=>{
        removeRedBorder(index + '_id');
        let item = return_obj[index];
        //is_required が1の項目の欄が空欄の状態
        if (item.is_usable !== 0 && item.is_required === 1 && (this.state[index] === "")){
            // 200526 (284-1) 初回投与量「０」、事前停止「0」でも透析が実行できるようにしてください。
            if (!(index=="syringe_stop_time" || index=="syringe_speed" || index=="syringe_amount" || index == "drainage_speed" ||
              index == "target_water_removal_amount")){
                error_message.push(Dial_telegram_field[index].title + "を設定してください。");
                if (first_tag_id == '') first_tag_id = index + '_id';
                addRedBorder(index + '_id');
            }
        }
        //下限値・上限値が0や空欄でない項目
        if (item.min_value != null && item.min_value != 0){
            let compare_value = 0;
            if (typeof this.state[index] == "string" && this.state[index].indexOf(":") > 0){
                compare_value = getMinute(this.state[index]);
            } else {
                compare_value = parseFloat(this.state[index])
            }
            if (compare_value < 0) {
                error_message.push(Dial_telegram_field[index].title + "を正確に入力してください。");
                if (first_tag_id == '') first_tag_id = index + '_id';
                addRedBorder(index + '_id');
            }
            if (compare_value < parseFloat(item.min_value)) {
                error_message.push(Dial_telegram_field[index].title + "は" + item.min_value + pattern_unit[index].value + "以上に設定してください。");
                if (first_tag_id == '') first_tag_id = index + '_id';
                addRedBorder(index + '_id');
            }
        }
        if (item.max_value != null && item.max_value != 0){
            let compare_value = 0;
            if (typeof this.state[index] == "string" && this.state[index].indexOf(":") > 0){
                compare_value = getMinute(this.state[index]);
            } else {
                compare_value = parseFloat(this.state[index])
            }
            if (compare_value < 0) {
                error_message.push(Dial_telegram_field[index].title + "を正確に入力してください。");
                if (first_tag_id == '') first_tag_id = index + '_id';
                addRedBorder(index + '_id');
            }
            if (compare_value > parseFloat(item.max_value)) {
                error_message.push(Dial_telegram_field[index].title + "は"+ item.max_value + pattern_unit[index].value + "下に設定してください。");
                if (first_tag_id == '') first_tag_id = index + '_id';
                addRedBorder(index + '_id');
            }
        }
    });
    let ret_val = {
        error_str_arr: error_message,
        first_tag_id,
    };
    return ret_val;
}
function getMinute(dt){
    var datas = dt.split(":");
    let result = parseInt(datas[0])*60+parseInt(datas[1]);
    return parseFloat(result);
}