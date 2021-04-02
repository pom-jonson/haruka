import * as localApi from "~/helpers/cacheLocal-utils";
import $ from "jquery";

export default function(order_number, status, allReset = false, do_all = 0) {
  let prescription_gray_info = localApi.getObject("prescription_gray_info");
  let gray_order_numbers = [];
  let gray_rp_numbers = [];
  if(prescription_gray_info != undefined && prescription_gray_info != null){
    // gray_order_numbers = prescription_gray_info.order_numbers != undefined ? prescription_gray_info.order_numbers : [];
    gray_rp_numbers = prescription_gray_info.rp_numbers != undefined ? prescription_gray_info.rp_numbers : [];
  }
  let history_list_obj = $("#div-history");
  let obj_item = $(".pres-history", history_list_obj);
  if(obj_item.hasClass("doing")){
    obj_item.removeClass("doing");
  }
  if (allReset) {
    gray_order_numbers = [];
    gray_rp_numbers = [];
  } else {
    this.state.medicineHistory.map(item => {
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
      let pres_history_obj = $(".pres-order-"+number);
      pres_history_obj.addClass("doing");
    });
  }
  if(gray_rp_numbers.length > 0){
    gray_rp_numbers.map(number=>{
      let pres_history_obj = $(".pres-rp-"+number);
      pres_history_obj.addClass("doing");
    });
  }
  prescription_gray_info = {
    order_numbers:gray_order_numbers,
    rp_numbers:gray_rp_numbers
  };
  localApi.setObject("prescription_gray_info", prescription_gray_info);
}
