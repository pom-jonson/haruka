import $ from "jquery";

export default async function(doneDatas) {
  let history_list_obj = $("#injection_history_wrapper");
  let obj_item = $(".inject-medicine", history_list_obj);
  if(obj_item.hasClass("line-done")){
    obj_item.removeClass("line-done");
  }
  doneDatas.map(doneData => {
    let pres_history_obj = $(".inject-medicine-"+doneData.number);
    pres_history_obj.addClass("line-done");
  });
}
