export default function(dropText) {
    // let data = e.dataTransfer.getData("text");
    let data = dropText;
    let order_number = undefined;
    let prescription_number = undefined;
    let item_details_number = undefined;
    if (data.includes("preset_order")) {

      if (!this.dragAndDropCopyOrder(data.replace("preset_order:", ""), true)) {
        // e.preventDefault();
      }
      return;
    }

    if (data.includes("preset_prescription")) {
      if (!this.dragAndDropCopyOrders(data.replace("preset_prescription:", ""), true)) {
        // e.preventDefault();
      }
      return;
    }

    if (data.includes("order:")) {
      order_number = data.replace("order:", "");
    }

    if (data.includes("prescription:")) {
      prescription_number = data.replace("prescription:", "");
    }

    if (data.includes("item_details:")) {
      item_details_number = data.replace("item_details:", "");
    }

    if (order_number !== undefined) {
      if (!this.dragAndDropCopyOrder(order_number)) {
        // e.preventDefault();
      }
      return;
    }

    if (prescription_number !== undefined) {
      if (!this.dragAndDropCopyOrders(prescription_number)) {
        // e.preventDefault();
      }
      return;
    }
    if (item_details_number !== undefined) {
      if (!this.dragAndDropCopyItemDetails(item_details_number)) {
        // e.preventDefault();
      }
      return;
    }


    if (data.includes("rank:")) {
      if (!this.dragAndDropInsertMed(parseInt(data.replace("rank:", "")))) {
        // e.preventDefault();
      }
    }
}
