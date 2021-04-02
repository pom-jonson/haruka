import $ from "jquery";

export default function(doneDatas) {
  let history_list_obj = $("#div-history");
  let obj_item = $(".pres-medicine", history_list_obj);
  if(obj_item.hasClass("line-done")){
    obj_item.removeClass("line-done");
  }
  doneDatas.map(doneData => {
    let pres_history_obj = $(".pres-medicine-"+doneData.number);
    pres_history_obj.addClass("line-done");
  });
}