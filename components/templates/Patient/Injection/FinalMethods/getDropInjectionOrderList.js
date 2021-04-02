export default function(e) {
    let is_drop_soap = typeof(e) == "string";
    let data = is_drop_soap ? e : e.dataTransfer.getData("text"); 

    let order_number = undefined;
    let prescription_number = undefined;
    let rank = undefined;
    let dropList = [];
    let order = undefined;
    if(data.includes("injection_set:")) {
      
      prescription_number = data.replace("injection_set:", "");
      this.state.injectionSetData.map(medicine => {
        if (medicine.preset_number === parseInt(prescription_number)) {          
          medicine.order_data.order_data.map(rp => {
            rp.med.map(item => {
              dropList.push(item);  
            })
          })
        }
      });
      
    } else if(data.includes("injection_order:")) {
      
      order_number = data.replace("injection_order:", "");
      let numbers = order_number.split(":");
      this.state.injectionSetData.map(item => {
        if (item.preset_number === parseInt(numbers[0])) {
          order = item.order_data.order_data[parseInt(numbers[1])];
        }
      })

      order.med.map(item => {
        dropList.push(item);  
      })      

    } else if(data.includes("injection:")) {

      prescription_number = data.replace("injection:", "");
      if(!is_drop_soap) {
        this.state.injectionHistory.map(medicine => {
          if (medicine.number === parseInt(prescription_number)) {
            //prescription = medicine;

            medicine.order_data.order_data.map(rp => {
              rp.med.map(item => {
                dropList.push(item);  
              })
            })

          }
        });        
      } else {        
        // drop from soap
        if(this.m_injectDataFromSoap != undefined) {        
          Object.keys(this.m_injectDataFromSoap).map(medicine => {
            if (parseInt(medicine) === parseInt(prescription_number)) {

              this.m_injectDataFromSoap[medicine].order_data.order_data.map(rp => {
                rp.med.map(item => {
                  dropList.push(item);  
                })
              })

            }
          });
        } else { // drop from injection
          this.state.injectionHistory.map(medicine => {
            if (medicine.number === parseInt(prescription_number)) {
              //prescription = medicine;

              medicine.order_data.order_data.map(rp => {
                rp.med.map(item => {
                  dropList.push(item);  
                })
              })

            }
          });
        }
      } 

    } else if(data.includes("order:")) {
      order_number = data.replace("order:", "");
      this.state.injectionHistory.map(medicine => {
        medicine.order_data.order_data.map(item => {
          if (item.order_number === order_number) {
            order = item;
          }
        });
      });
      order.med.map(item => {
        dropList.push(item);  
      })      
    } else if(data.includes("rank:")) {
      rank = parseInt(data.replace("rank:", ""));
      this.state.medicineRankData.map(item => {
        if (item.code === rank) {
          item.item_number = item.code;
          item.item_name = item.gene_name;
          dropList.push(item);  
        }
      });      
    }    

    if (!is_drop_soap) {
      e.preventDefault();
    }

    // initialize drop prescription from soap
    this.m_injectDataFromSoap = undefined;

    return dropList;

}
