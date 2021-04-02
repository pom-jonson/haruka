export default function(e) {
    let is_drop_soap = typeof(e) == "string";
    let data = is_drop_soap ? e : e.dataTransfer.getData("text");
    // if () {      
    //   console.log("object");
    // } else { // prescription drop
    //   data = e.dataTransfer.getData("text");
    // }

    let order_number = undefined;
    let prescription_number = undefined;
    // let rank = undefined;
    let dropList = [];
    let order = undefined;
    if(data.includes("preset_prescription:")) {
      
      prescription_number = data.replace("preset_prescription:", "");
      this.state.medicineSetData.map(medicine => {
        if (medicine.preset_number === parseInt(prescription_number)) {
          //prescription = medicine;
          // console.log(medicine)
          medicine.order_data.order_data.map(rp => {
            dropList.push(parseInt(rp.usage));  
          })
        }
      });

      if(!is_drop_soap) {        
        e.preventDefault();
      }
    } else if(data.includes("preset_order:")) {
      
      order_number = data.replace("preset_order:", "");
      let numbers = order_number.split(":");

      this.state.medicineSetData.map(item => {
        if (item.preset_number === parseInt(numbers[0])) {
          order = item.order_data.order_data[parseInt(numbers[1])];
        }
      })
      // console.log("getDropOrderList - preset_order");
      // console.log(order);

      dropList.push(parseInt(order.usage));  
      // console.log(dropList);
      if(!is_drop_soap) {        
        e.preventDefault();
      }

    } else if(data.includes("prescription:")) {

      prescription_number = data.replace("prescription:", "");
      if(!is_drop_soap) {
        this.state.medicineHistory.map(medicine => {
          if (medicine.number === parseInt(prescription_number)) {
            //prescription = medicine;

            medicine.order_data.order_data.map(rp => {
              dropList.push(parseInt(rp.usage));  
            })

          }
        });
        e.preventDefault();
      } else {
        // drop from soap
        if(this.m_presDataFromSoap != undefined) {        
          Object.keys(this.m_presDataFromSoap).map(medicine => {
            if (parseInt(medicine) === parseInt(prescription_number)) {
              //prescription = medicine;

              this.m_presDataFromSoap[medicine].order_data.order_data.map(rp => {
                dropList.push(parseInt(rp.usage));  
              })

            }
          });
        } else { // drop from prescription
          this.state.medicineHistory.map(medicine => {
            if (medicine.number === parseInt(prescription_number)) {
              //prescription = medicine;

              medicine.order_data.order_data.map(rp => {
                dropList.push(parseInt(rp.usage));  
              })

            }
          });
        }
      } 

    } else if(data.includes("order:")) {
      
      order_number = data.replace("order:", "");
      this.state.medicineHistory.map(medicine => {
        medicine.order_data.order_data.map(item => {
          if (item.order_number === order_number) {
            order = item;
          }
        });
      });
      dropList.push(parseInt(order.usage));  
      
      if(!is_drop_soap) {        
        e.preventDefault();
      }
    }

    return dropList;

    // if (data.includes("order:")) {
    //   console.log("data.includes(order:");

    //   order_number = data.replace("order:", "");
    // }

    // if (data.includes("prescription:")) {
    //   console.log("data.includes(prescription:");
    //   prescription_number = data.replace("prescription:", "");
    // }

    // if (order_number !== undefined) {
    //   console.log("order_number !== undefined:");
    //   if (!this.dragAndDropCopyOrder(order_number)) {
    //     e.preventDefault();
    //   }
    // }

    // if (prescription_number !== undefined) {
    //   console.log("prescription_number !== undefined:");
    //   if (!this.dragAndDropCopyOrders(prescription_number)) {
    //     e.preventDefault();
    //   }
    // }

    // if (data.includes("preset_order")) {
    //   console.log("data.includes(preset_order:");
    //   if (!this.dragAndDropCopyOrder(data.replace("preset_order:", ""), true)) {
    //     e.preventDefault();
    //   }
    // }

    // if (data.includes("preset_prescription")) {
    //   console.log("data.includes(preset_prescription:");
    //   if (!this.dragAndDropCopyOrders(data.replace("preset_prescription:", ""), true)) {
    //     e.preventDefault();
    //   }
    // }

    // if (data.includes("rank:")) {
    //   console.log("rank:");
    //   if (
    //     !this.dragAndDropInsertMed(parseInt(data.replace("rank:", "")))
    //   ) {
    //     e.preventDefault();
    //   }
    // }
}
