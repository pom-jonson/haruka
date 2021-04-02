import * as localApi from "~/helpers/cacheLocal-utils";
import $ from "jquery";

export default function(order_number, status, allReset = false, do_all = 0) {
  let injection_gray_info = localApi.getObject("injection_gray_info");
  let gray_order_numbers = [];
  let gray_rp_numbers = [];
  if(injection_gray_info != undefined && injection_gray_info != null){
    // gray_order_numbers = injection_gray_info.order_numbers != undefined ? injection_gray_info.order_numbers : [];
    gray_rp_numbers = injection_gray_info.rp_numbers != undefined ? injection_gray_info.rp_numbers : [];
  }
  let history_list_obj = $("#injection_history_wrapper");
  let obj_item = $(".inject-history", history_list_obj);
  if(obj_item.hasClass("doing")){
    obj_item.removeClass("doing");
  }
  if (allReset) {
    gray_order_numbers = [];
    gray_rp_numbers = [];
  } else {
    this.state.injectionHistory.map(item => {
      item.order_data.order_data.map(medicine => {
        let exist_falg = false;
        if(Array.isArray(order_number)){
          if (order_number.includes(medicine.order_number)) {
            exist_falg = true;
          }
        } else {
          if (medicine.order_number === order_number) {
            exist_falg = true;
          }
        }
        if (exist_falg) {
          // 処方や注射が空のところに処方箋単位でDoした場合（＝備考欄などもDoで反映される条件の場合）は、向精神薬多剤投与理由や湿布薬超過投与理由、備考といった備考エリアの内容の行も履歴側でグレーにするように
          if (do_all == 1) {
            gray_order_numbers.push(item.number);
          }
        }
      });
    });
    if(Array.isArray(order_number)){
      order_number.map(number=>{
        let index = gray_rp_numbers.indexOf(number);
        if(index === -1){
          if(status){
            gray_rp_numbers.push(number);
          }
        } else {
          if(status == false){
            gray_rp_numbers.splice(index, 1);
          }
        }
      })
    } else {
      let index = gray_rp_numbers.indexOf(order_number);
      if(index === -1){
        if(status){
          gray_rp_numbers.push(order_number);
        }
      } else {
        if(status == false){
          gray_rp_numbers.splice(index, 1);
        }
      }
    }
  }
  if(gray_order_numbers.length > 0){
    gray_order_numbers.map(number=>{
      let pres_history_obj = $(".inject-order-"+number);
      pres_history_obj.addClass("doing");
    });
  }
  if(gray_rp_numbers.length > 0){
    gray_rp_numbers.map(number=>{
      let pres_history_obj = $(".inject-rp-"+number);
      pres_history_obj.addClass("doing");
    });
  }
  injection_gray_info = {
    order_numbers:gray_order_numbers,
    rp_numbers:gray_rp_numbers
  };
  localApi.setObject("injection_gray_info", injection_gray_info);
}

