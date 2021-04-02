import { CACHE_LOCALNAMES } from "~/helpers/constants";
// import * as localApi from "~/helpers/cacheLocal-utils";
// import * as patientApi from "~/helpers/cachePatient-utils";

export default async function(medicine, indexOfInsertPres, indexOfInsertMed, condition=true) {
  let original = this.state.injectData;  
  let canEdit = 0;
  if (
    this.context.$canDoAction(
      this.context.FEATURES.PRESCRIPTION,
      this.context.AUTHS.REGISTER
    ) ||
    this.context.$canDoAction(
      this.context.FEATURES.PRESCRIPTION,
      this.context.AUTHS.REGISTER_OLD
    )
  ) {
    canEdit = 1;
  }
  if (
    this.context.$canDoAction(
      this.context.FEATURES.PRESCRIPTION,
      this.context.AUTHS.REGISTER_PROXY
    ) ||
    this.context.$canDoAction(
      this.context.FEATURES.PRESCRIPTION,
      this.context.AUTHS.REGISTER_PROXY_OLD
    )
  ) {
    canEdit = 2;
  }
  let can_edit_result = true;
  if (canEdit == 0) {
    window.sessionStorage.setItem("alert_messages", "権限がありません。");
    // alert("権限がありません。");
    can_edit_result = false;
  }
  if (can_edit_result === false) {
    let medicines = [];
    const insertMedicine = {
      medicine: medicine,
      indexOfInsertPres: indexOfInsertPres,
      indexOfInsertMed: indexOfInsertMed
    };
    medicines.push(insertMedicine);
    this.setState({
      tempItems: medicines
    });
    return false;
  }

  // ------------ start
  // let bgMedicine = "";
  let result = this.checkInjectionContraindication(medicine);

  if(condition) {
    if(result == 1) {
      this.modal_obj.insertMedicineFlag = false;
      this.modal_obj.hideDuplicateModal = false;
      this.modal_obj.modalType = "Alert";
      this.modal_obj.showMedicineContent = "相互作用・禁忌の情報がありますが追加しますか？";

      // this.setState({
      //   insertMedicineFlag: false,
      //   hideDuplicateModal: false,
      //   modalType: "Alert",
      //   showMedicineContent: "相互作用・禁忌の情報がありますが追加しますか？"
      // }); 

      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);      
      return;
    } else if(result == 2) {
      this.modal_obj.insertMedicineFlag = false;
      this.modal_obj.hideDuplicateModal = false;
      this.modal_obj.modalType = "Reject";
      this.modal_obj.showMedicineContent = "禁忌薬に含まれるので追加できません。";
      this.modal_obj.insertStep = 0;

      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);

      // this.setState({
      //   insertMedicineFlag: false,
      //   hideDuplicateModal: false,
      //   modalType: "Reject",
      //   showMedicineContent: "禁忌薬に含まれるので追加できません。",
      //   insertStep: 0
      // });         
      return;

    }    
  }

  this.modal_obj.hideDuplicateModal = true;
  this.modal_obj.modalType = "";
  this.modal_obj.insertStep = 0; 

  this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);

  // this.setState({
  //   hideDuplicateModal: true,
  //   modalType: "",
  //   insertStep: 0
  // }); 

  // -------------- end
    
  let medicine1 = {
    medicineId: medicine.code,
    medicineName: medicine.name,
    amount: medicine.amount,
    unit: medicine.main_unit,      
    free_comment: [],
    if_duplicate: medicine.if_duplicate,
    contraindication_alert: medicine.contraindication_alert,
    contraindication_reject: medicine.contraindication_reject,
    start_month : medicine.start_month !== undefined ? medicine.start_month : "",
    end_month : medicine.end_month !== undefined ? medicine.end_month : "",
    start_date : medicine.start_date !== undefined ? medicine.start_date : "",
    end_date : medicine.end_date !== undefined ? medicine.end_date : "",
    period_permission : 0,
    gene_name : medicine.gene_name !== undefined ? medicine.gene_name : "",
    tagret_contraindication: medicine.tagret_contraindication,
    yj_code: medicine.yj_code
  };
    let period_permission = 0;
    let rp_date = original[indexOfInsertPres].start_date;
    let mtime = 0;
    if (rp_date != undefined && rp_date != null) {
      mtime = new Date(rp_date.substring(0, 4)+"-"+rp_date.substring(4, 6)+"-"+rp_date.substring(6, 8)).getTime();
    }

    period_permission = this.checkPeriodmedicineUnit(medicine1, mtime);
    medicine1.period_permission = period_permission;

    if (
    indexOfInsertPres == original.length - 1 &&
    indexOfInsertMed == original[original.length - 1].medicines.length - 1
  ) {
    if (original[original.length - 1].usageName != null && original[original.length - 1].usageName != undefined && original[original.length - 1].usageName == "") {
      this.modal_obj.usageOpen = true;
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      // this.setState({
      //   usageOpen: true
      // });
      // ドラッグ&ドロップ操作時注射データ保存
      window.localStorage.setItem(CACHE_LOCALNAMES.DROP_INJECTION_DATA, "rank:" + medicine.code);
      return;
    }
    original[original.length - 1].medicines[
      original[original.length - 1].medicines.length - 1
    ] = medicine1;
    this.setState({ indexOfInsertPres: -1, indexOfInsertMed: -1 });
  } else {
    if (original[indexOfInsertPres].usageName != null && original[indexOfInsertPres].usageName != undefined && original[indexOfInsertPres].usageName == "") {
      this.modal_obj.usageOpen = true;
      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      // this.setState({
      //   usageOpen: true
      // });
      // ドラッグ&ドロップ操作時注射データ保存
      window.localStorage.setItem(CACHE_LOCALNAMES.DROP_INJECTION_DATA, "rank:" + medicine.code);
      return;
    }
    original[indexOfInsertPres].medicines[indexOfInsertMed] = medicine1;
    this.setState({
      indexOfInsertPres: indexOfInsertPres,
      indexOfInsertMed: indexOfInsertMed
    });
  }

  this.modal_obj.isAmountOpen = true;
  this.modal_obj.daysInitial = 0;
  this.modal_obj.showedPresData = {
    medicineName: medicine.name
  };  

  // right menu from prescribetable's 数量の変更
  this.amountCancelFromMenu = "";

  let data = {};
  data['injectData'] = original;
  data.is_reload_state = false;

  // prevent refresh
  this.modal_obj.insert_med_option = 1;

  this.setState(
    {
      // injectData: original,
      // isAmountOpen: true,
      // daysInitial:0,
      calcNum: this.state.injectData.length - 1,
      usageModal: false,
      // showedPresData: {
      //   medicineName: medicine.name
      // }
    },
    function() {
      window.localStorage.removeItem(CACHE_LOCALNAMES.CALC );
      this.storeInjectionDataInCache(data);

      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
    }
  );

  let selDiseaseData = {};
  // let diseaseData = [];

  // let patientDiseaseData = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE_DATA)); // 病名禁忌
  // let patientDiseaseData = patientApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE); // 病名禁忌
  let diseaseDataResult = await this.getContraindicationsToDiseaseApi(this.props.match.params.id); // 病名禁忌
  // if(patientDiseaseData != undefined) {
  //   diseaseData = patientDiseaseData;
  // }

  let diseaseDetail = diseaseDataResult.details;
  let diseaseData = diseaseDataResult.result;
  if (diseaseData == undefined) {
    diseaseData = [];
  }

  //病名禁忌 チェック
  if(diseaseData != undefined && diseaseData.length > 0) {
      let m_code = parseInt(medicine.code);
      diseaseData.map((item)=>{
        let keyword = item.keyword;
        let disease_documents_list = item.disease_documents_list;
        Object.keys(disease_documents_list).map((idx)=>{
           let yj_code_list = disease_documents_list[idx].y;
           let documents = disease_documents_list[idx].d;
           if(yj_code_list.includes(medicine.yj_code)) {
              Object.keys(documents).map((id)=>{
                  let detail = diseaseDetail[documents[id]];
                  if(detail.y == medicine.yj_code) {
                      let obj = {};
                      if(selDiseaseData[m_code] === undefined) {
                        obj.medicineName = medicine.name;
                        obj.disease = {};
                        selDiseaseData[m_code] = obj;
                      }
                      if(selDiseaseData[m_code].disease[keyword] === undefined) {
                        selDiseaseData[m_code].disease[keyword] = [];
                      }
                      selDiseaseData[m_code].disease[keyword].push([diseaseDataResult.strkeys.i[detail.i], diseaseDataResult.strkeys.c[detail.c]]);
                  }
              });  
           }

        });    
          
      });
  }

  if (diseaseData.length > 0 && Object.keys(selDiseaseData).length > 0) {

    this.modal_obj.diseaseModal = true;
    this.modal_obj.diseaseData = selDiseaseData;
    this.modal_obj.insertMedicineFlag = false;

    this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);

    // this.setState({
    //     diseaseModal: true,
    //     diseaseData: selDiseaseData,
    //     insertMedicineFlag: false,
    //   });
    return false;
  } else {
      let periodData = {};
      if(period_permission == -1) {
          periodData[medicine1.medicineId] = [medicine1.medicineName, medicine1.gene_name];
          this.modal_obj.insertMedicineFlag = false;
          this.modal_obj.periodModal = true;
          this.modal_obj.periodData = periodData;

          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);

          // this.setState({
          //     insertMedicineFlag: false,
          //     periodModal: true,
          //     periodData: periodData,
          // });
          return false;
      } else {
          this.modal_obj.insertMedicineFlag = true;

          this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);

          // this.setState({
          //     insertMedicineFlag: true,
          // });
      }
  }

  return true;
}
