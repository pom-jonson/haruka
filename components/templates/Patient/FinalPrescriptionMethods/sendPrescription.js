import * as apiClient from "~/api/apiClient";
import { CACHE_LOCALNAMES} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";

export default function() {
    let isUsagePermission = false;
    let arrNotAllow = [];
    this.state.presData.map(item => {
      item.medicines.map(med=>{
        if(med.usage_permission !== undefined && med.usage_permission < 0) {
          isUsagePermission = true;
          arrNotAllow.push("・" + med.medicineName);
        }
      })
    });

    if (isUsagePermission) {
      window.sessionStorage.removeItem("isCallingAPI");
      this.closeModal();
      let strMsg = "用法用量の確認が必要な薬剤があります。処方箋からクリックして確認してください\\n対象：\\n" + arrNotAllow.join("\\n");
      window.sessionStorage.setItem("alert_messages", strMsg);
      return;
    }

  if (this.checkPrescriptionData() === false) {
    window.sessionStorage.removeItem("isCallingAPI");
    this.closeModal();
    return;
  }

  if (this.state.staff_category === 2) {
    if (this.context.selectedDoctor.code === 0) {
      confirm("依頼医を選択してください");
      this.closeModal();
      window.sessionStorage.removeItem("isCallingAPI");
      return;
    }
  }

  this.setState({ isSending: true });
  let deleted = this.deletePrescription(this.props.match.params.id);

  const orderData = this.createOrderData(this.state.presData);

  if (orderData[0] !== undefined && orderData[0].med.length != 0) {
    let isUsageCommentError = false;
    orderData.map(med => {
      if (med.usage_name.toString() === "" && med.med.length != 0) {
        isUsageCommentError = true;
      }

    });

    if (!isUsageCommentError) {
      const postData = {
        number: this.state.isForUpdate ? this.state.orderNumber : undefined,
        system_patient_id: this.props.match.params.id, //HARUKA患者番号
        insurance_type: 0, //保険情報現状固定
        order_data: orderData,
        psychotropic_drugs_much_reason: this.state
          .psychotropic_drugs_much_reason, //向精神薬多剤投与理由
        poultice_many_reason: this.state.poultice_many_reason, //湿布薬多剤投与理由
        free_comment: Array.isArray(this.state.free_comment)
          ? this.state.free_comment
          : [this.state.free_comment], //備考
        department_code: this.context.department.code, //this.state.departmentId,
        department: this.context.department.name, //this.state.department,
        is_internal_prescription: this.state.inOut,
        med_consult: orderData[0].med_consult,
        supply_med_info: orderData[0].supply_med_info
      };

      if (this.state.staff_category === 2 || this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY)) {
        postData.doctor_name = this.context.selectedDoctor.name;
        postData.doctor_code = this.context.selectedDoctor.code;
        postData.substitute_name = this.state.currentUserName;
      }

      if (this.state.isForUpdate) {
        let editingIndex = -1;
        this.state.medicineHistory.map((item, index) => {
          if (
            item.order_data.order_data[0].order_number ===
            postData.order_data[0].order_number
          ) {
            editingIndex = index;
          }
        });
        let hasChangedData =
          editingIndex === -1
            ? true
            : this.hasChangedData(
                this.state.medicineHistory[editingIndex].order_data,
                postData
              );
        if (hasChangedData === false) {
          if (!confirm("変更点はないですが閉じてよろしいですか？")) {
            window.sessionStorage.removeItem("isCallingAPI");
            this.closeModal();
            return;
          }
          if (this.state.pacsOn) {
            window.open("http://TFS-C054/01Link/minimizeDV.aspx", "_blank");
            this.PACSOff();
          }
          // window.localStorage.removeItem("haruka_edit_cache");
          // window.localStorage.removeItem("haruka_delete_cache");
          karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT);
          karteApi.delVal(this.props.match.params.id, CACHE_LOCALNAMES.PRESCRIPTION_DELETE);

          this.cancelExamination();
          this.closeModal();
          return;
        }
      }

      let path = this.state.isForUpdate
        ? "/app/api/v2/order/prescription/update"
        : "/app/api/v2/order/prescription/register";

      apiClient
        .post(path, {
          params: postData
        })
        .then(() => {
          this.setState({ isForUpdate: false });
          this.props.history.replace("/patients");
          this.closeModal();          
        })
        .catch(() => {
          window.sessionStorage.removeItem("isCallingAPI");
          //alert("送信に失敗しました。");
          this.closeModal();
        });
      
      this.resetCacheData(this.props.match.params.id);
      return true;
    } else {
      window.sessionStorage.removeItem("isCallingAPI");
      alert("用法方法を入力して下さい。");
      this.closeModal();
      return false;
    }
  } else {
    if (
      this.state.presData.length == 1 &&
      this.state.presData[0].medicines.length == 1 &&
      deleted
    ) {
      // 何も入力せず削除した場合はアラートなし
      this.props.history.replace("/patients");
      this.closeModal();
      return true;
    }
    window.sessionStorage.removeItem("isCallingAPI");
    alert("用法方法を入力して下さい。");
    this.closeModal();
    return false;
  }
}
