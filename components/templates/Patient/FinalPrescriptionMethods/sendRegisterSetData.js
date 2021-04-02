import * as apiClient from "~/api/apiClient";

export default function() {
  // let strMsg = "";
  let diagnosisOrderData = {};

  this.state.presData.map((item, rpIdx)=>{
    item.medicines.map((med, medIdx)=>{
      if(med.diagnosis_permission == -1) {
        if(diagnosisOrderData[rpIdx] == undefined) {
          diagnosisOrderData[rpIdx] = [];
        }
        diagnosisOrderData[rpIdx].push(medIdx);
      }
    });
  });

  if( this.state.diagnosis_valid != 1 ) {
    if(Object.keys(diagnosisOrderData).length > 0) {
      this.setState({
        sendDiagnosisModal : true,
        sendDiagnosisOrderData :  diagnosisOrderData
      });
      return;
    }

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
  let deleted = this.deletePrescription();

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
        preset_name: this.state.preset_name,
        diagnosis_valid : (this.state.diagnosis_valid != undefined) ? this.state.diagnosis_valid : 0,
        number: this.state.isForUpdate ? this.state.orderNumber : undefined,       
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

      };      

      if (this.state.staff_category !== 1) {
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
          // if (this.state.pacsOn) {
          //   window.open("http://TFS-C054/01Link/minimizeDV.aspx", "_blank");
          //   this.PACSOff();
          // }
          window.localStorage.removeItem("haruka_edit_cache");
          window.localStorage.removeItem("haruka_delete_cache");
          this.cancelExamination();
          this.closeModal();
          return;
        }
      }

      let path = "/app/api/v2/order/prescription/preset/registration";

      apiClient
        .post(path, {
          params: postData
        })
        .then((res) => {
          if(res.alert_message)  {
            window.sessionStorage.setItem("alert_messages", res.alert_message);
            // alert(res.alert_message + "\n");
          }         

          this.props.history.replace("/preset/prescription");
          this.closeModal();
        })
        .catch(() => {
          window.sessionStorage.removeItem("isCallingAPI");
          // this.props.history.replace("/preset/prescription");
          this.closeModal();
        });

      this.setState({ isForUpdate: false });
      this.resetCacheData();
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
      this.props.history.replace("/preset/prescription");
      this.closeModal();
      return true;
    }
    window.sessionStorage.removeItem("isCallingAPI");
    alert("用法方法を入力して下さい。");
    this.closeModal();
    return false;
  }
}

