export default async function(dropText, from=null) {
    let data = dropText;
    let order_number = undefined;
    let prescription_number = undefined;
    let item_details_number = undefined;
    // initialize last rp number when do usage cancel (用法を変更して区分エラーになった場合)
    this.modal_obj.lastOrderIndex = null;  
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
      await this.dragAndDropCopyOrder(order_number); 
      return;
    }

    if (prescription_number !== undefined) {
      await this.dragAndDropCopyOrders(prescription_number, false, from);
      return;
    }
    if (item_details_number !== undefined) {
      await this.dragAndDropCopyItemDetails(item_details_number); 
      return;
    }
    if (data.includes("rank:")) {
      await this.dragAndDropInsertMed(parseInt(data.replace("rank:", ""))); 
    }
}
