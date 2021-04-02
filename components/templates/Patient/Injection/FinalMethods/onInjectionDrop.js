export default function(dropText, from=null) {
  let data = dropText;
  let order_number = undefined;
  let injection_number = undefined;
  let item_details_number = undefined;
  if (data.includes("order:")) {
    order_number = data.replace("order:", "");
  }
  
  if (data.includes("injection:")) {
    injection_number = data.replace("injection:", "");
  }
  
  if (data.includes("item_details:")) {
    item_details_number = data.replace("item_details:", "");
  }
  
  if (order_number !== undefined) {
    if (!this.dragAndDropCopyInjectionOrder(order_number)) {
      // e.preventDefault();
    }
  }
  
  if (injection_number !== undefined) {
    if (!this.dragAndDropCopyInjectionOrders(injection_number, false, from)) {
      // e.preventDefault();
    }
  }
  
  if (item_details_number !== undefined) {
    if (!this.dragAndDropCopyInjectionItemDetails(item_details_number)) {
      // e.preventDefault();
    }
    return;
  }
  
  if (data.includes("injection_order")) {
    if (!this.dragAndDropCopyInjectionOrder(data.replace("injection_order:", ""), true)) {
      // e.preventDefault();
    }
  }
  
  if (data.includes("injection_set")) {
    if (!this.dragAndDropCopyInjectionOrders(data.replace("injection_set:", ""), true)) {
      // e.preventDefault();
    }
  }
  
  if (data.includes("rank:")) {
    if (!this.dragAndDropInjectionInsertMed(parseInt(data.replace("rank:", "")))) {
      // e.preventDefault();
    }
  }
}
