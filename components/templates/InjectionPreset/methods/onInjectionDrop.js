export default function(dropText) {
    let data = dropText;
    let order_number = undefined;
    let injection_number = undefined;    
    if (data.includes("order:")) {
      order_number = data.replace("order:", "");
    }

    if (data.includes("injection:")) {
      injection_number = data.replace("injection:", "");
    }  

    if (order_number !== undefined) {
      if (!this.dragAndDropCopyInjectionOrder(order_number)) {
        // e.preventDefault();
      }
    }

    if (injection_number !== undefined) {
      if (!this.dragAndDropCopyInjectionOrders(injection_number)) {
        // e.preventDefault();
      }
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
}
