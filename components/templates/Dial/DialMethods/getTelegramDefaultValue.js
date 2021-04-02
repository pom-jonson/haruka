import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import {Dial_telegram_field} from "~/helpers/dialConstants";
export default function (dialysis_method_code=0) {
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  let default_values = init_status.dial_method_default;
  let return_obj = {};
  Object.keys(Dial_telegram_field).map(index=>{
    let telegram_item_id = Dial_telegram_field[index];
    default_values.find(item=>{
      if(item.telegram_item_id===telegram_item_id.telegram_item_id && item.protocol==="4.0" && item.dialysis_method_code == "0"){
        return_obj[index] = item;
        return_obj[index]['title'] = telegram_item_id.title;
      }});
  });
  Object.keys(Dial_telegram_field).map(index=>{
    let telegram_item_id = Dial_telegram_field[index];
    default_values.find(item=>{
      if(item.telegram_item_id===telegram_item_id.telegram_item_id && item.protocol==="4.0" && item.dialysis_method_code == dialysis_method_code){
        return_obj[index] = item;
        return_obj[index]['title'] = telegram_item_id.title;
      }});
  });
  return return_obj;
}