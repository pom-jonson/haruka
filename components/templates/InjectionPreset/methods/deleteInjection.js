import axios from "axios";
import { persistedState } from "../../../../helpers/cache";
// import * as apiClient from "../../../../api/apiClient";

export default function() {
  let { cacheDelState } = persistedState();
  let deleted = false;
  if (cacheDelState) {
    let medicineHistory = [];
    this.state.medicineHistory.map(item => {
      medicineHistory.push({ ...item });
    });
    let deletedHistory = [];

    cacheDelState.map(delData => {
      medicineHistory.map(med => {
        let medicine = { ...med };
        if (medicine.number == delData.number) {
          if (delData.order_data !== undefined) {
            let order_data = [];
            medicine.order_data.order_data.map(med_order_data => {
              let deleted = false;
              delData.order_data.map(item => {
                if (item.order_number === med_order_data.order_number) {
                  deleted = true;
                }
              });
              if (deleted === false) {
                order_data.push(med_order_data);
              }
            });
            if (order_data.length > 0) {
              medicine.is_enabled = 4; // RP delete
              medicine.order_data.order_data = order_data;
            } else {
              medicine.is_enabled = 3; // all delete
            }
          }
        }
        if (medicine.is_enabled >= 3) {
          deletedHistory.push(medicine);
        }
      });
    });

    deletedHistory.map(medicine => {
      let presData = [];
      presData.push(medicine);
      medicine.order_data.order_data = medicine.order_data.order_data.map(
        item => {
          item.update_mode = "update";
          return item;
        }
      );
      let postData = {
        number: medicine.number,
        system_patient_id: medicine.patient_id,
        insurance_type: medicine.order_data.insurance_type,
        body_part: medicine.order_data.body_part,
        order_data: medicine.order_data.order_data,
        psychotropic_drugs_much_reason:
          medicine.order_data.psychotropic_drugs_much_reason,
        poultice_many_reason: medicine.order_data.poultice_many_reason,
        free_comment: medicine.order_data.free_comment,
        department_code: medicine.order_data.department_code,
        department: medicine.order_data.department,
        is_internal_prescription: medicine.order_data.is_internal_prescription,
        doctor_name: this.context.selectedDoctor.name,
        doctor_code: this.context.selectedDoctor.code,
        substitute_name: this.state.currentUserName
      };

      if (medicine.is_enabled === 3) {
        postData.is_enabled = 2;
      }

      let path = "/app/api/v2/order/injection/update";
      axios
        .post(path, {
          params: postData
        })
        .then(() => {
          // this.closeModal();
        })
        .catch(() => {
          // this.closeModal();
        });
    });
    deleted = true;
    window.localStorage.removeItem("haruka_delete_cache");
  }

  return deleted;
}
