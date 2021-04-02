export default function(order, order_flag = true)  {
    let mtime  = 0;
    let stime = 0;
    let period_permission = 0;
    let periodData = {};
    let selMedicines = []; 
    let today =  new Date();
    let newDate = new Date();
    let department_code = this.context.department.code;
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let offset_date = 0;
    for (let [key, value] of Object.entries(authInfo.default_prescription_start_date_offset)) {
      if(department_code == key){
        offset_date = value;
        break;
      }
    }
    newDate.setDate(today.getDate() + offset_date);
    mtime = newDate.getTime();
    let idx = 0;
    let day = "";
    if(order_flag) { // prescription
       order.med.map(medicine => {
        if(!selMedicines.includes(medicine.item_number)) {
          selMedicines.push(medicine.item_number);
          period_permission = this.checkPeriodmedicineUnit(medicine, mtime);
          let gene_name = (medicine.gene_name !== undefined) ? medicine.gene_name : "";
          // period_permission = -1;
          if(period_permission < 0) {
            idx++;
            periodData[idx] = [medicine.item_name, gene_name];
          }
        }
       });

       if(Object.keys(periodData).length > 0) {
        this.modal_obj.periodOrderModal = true;
        this.modal_obj.periodOrderData = periodData;
        this.modal_obj.periodOrder = order;

        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        return true;
       }
    } else { // prescription
       order.order_data.order_data.map(item => {
         item.med.map(medicine => {
          if(!selMedicines.includes(medicine.item_number)) {
            selMedicines.push(medicine.item_number);
            period_permission = 0;
            if(medicine.start_month !== undefined && medicine.start_month != "") {
              stime = new Date(medicine.start_month).getTime();
              if(stime > mtime) {
                period_permission = -1;
              }  
            }
            // medicine.end_month  = "2019-03";
            if(medicine.end_month !== undefined && medicine.end_month != "") {
              let date_split = medicine.end_month.split("-");
              day = new Date(date_split[0], date_split[1], 0).getDate();
              stime = new Date(medicine.end_month.substring(0,4), medicine.end_month.substring(5,7), day).getTime();
              if(stime < mtime) {
                period_permission = -1;
              }  
            }
            let gene_name = (medicine.gene_name !== undefined) ? medicine.gene_name : "";
            if(period_permission < 0) {
              idx++;
              periodData[idx] = [medicine.item_name, gene_name];
            }
          }
         });
       });  
       if(Object.keys(periodData).length > 0) {
        this.modal_obj.periodPrescriptionModal = true;
        this.modal_obj.periodPrescriptionData = periodData;
        this.modal_obj.periodPrescription  = order;
        this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
        return true;
       }

    }
  return false;
}
