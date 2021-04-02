import * as apiClient from "~/api/apiClient";
import { CACHE_LOCALNAMES } from "~/helpers/constants";
// import * as localApi from "~/helpers/cacheLocal-utils";
// import * as patientApi from "~/helpers/cachePatient-utils";

export default async function(medicine, indexOfInsertPres, indexOfInsertMed, condition=true) {
  let original = this.state.presData;  
  if (this.checkCanEdit(0) === false) {
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

  this.setState({
    showMedicineSelected: medicine.name + "は"
  });
  this.setState({
    showMedicineOrigin: ""
  });

  let bgMedicine = "";
  let result = this.checkMedicineContraindication(medicine);

  if(condition) {
    if(result == 1) {

      this.setState({
        insertMedicineFlag: false,
        hideDuplicateModal: false,
        modalType: "Alert",
        showMedicineContent: "相互作用・禁忌の情報がありますが追加しますか？"
      });       
      bgMedicine = "medicine_alert";  
      return;
    } else if(result == 2) {

      this.setState({
        insertMedicineFlag: false,
        hideDuplicateModal: false,
        modalType: "Reject",
        showMedicineContent: "禁忌薬に含まれるので追加できません。",
        insertStep: 0
      });         
      return;

    }    
  }

    this.setState({
      hideDuplicateModal: true,
      modalType: "",
      insertStep: 0
    }); 

    if( !this.checkCanAddMedicine(medicine.code) ) {

      bgMedicine = "medicine_duplicate";

    }  

  let params = {
    type: "haruka",
    codes: parseInt(medicine.code)
  };
    let medDetail = await apiClient.get("/app/api/v2/reference/medicines", {
      params: params
    }); 


  let medicine1 = {
    medicineId: medicine.code,
    medicineName: medicine.name,
    amount: medicine.amount,
    main_unit: medicine.main_unit,
    units: medicine !== undefined && medicine.units !== undefined && medicine.units.length > 0 ?
      medicine.units :
      [{name: medicine.main_unit, multiplier: 1, main_unit_flag: 1}],
    main_unit_flag: 1,
    is_not_generic: 0,
    can_generic_name: 0,
    milling: 0,
    separate_packaging: 0,
    free_comment: [],
    usage_comment: "",
    usage_optional_num: 0,
    poultice_times_one_day: 0,
    poultice_one_day: 0,
    poultice_days: 0,
    diagnosis_division: medicine.diagnosis_division,
    uneven_values: [],
    if_duplicate: medicine.if_duplicate,
    contraindication_alert: medicine.contraindication_alert,
    contraindication_reject: medicine.contraindication_reject,
    label_flag: result,
    bgMedicine: bgMedicine,
    exists_detail_information: medicine.exists_detail_information,
    medDetail: medDetail[medicine.code] !== undefined ? medDetail[medicine.code] : {},
    usage_permission: 0,
    start_month : medicine.start_month !== undefined ? medicine.start_month : "",
    end_month : medicine.end_month !== undefined ? medicine.end_month : "",
    start_date : medicine.start_date !== undefined ? medicine.start_date : "",
    end_date : medicine.end_date !== undefined ? medicine.end_date : "",
    period_permission : 0,
    gene_name : medicine.gene_name !== undefined ? medicine.gene_name : "",
    diagnosis_permission: 0,
    tagret_contraindication: medicine.tagret_contraindication,
    yj_code: medicine.yj_code
  };
  medicine1.can_generic_name = medicine.can_generic_name === undefined ? this.state.bulk.can_generic_name : medicine.can_generic_name;

  //this.state.bulk.can_generic_name;
  medicine1.is_not_generic = this.state.bulk.is_not_generic;
  medicine1.milling = this.state.bulk.milling;

  let period_permission = 0;
  // let stime = 0;
  // let etime = 0;
  let rp_date = original[indexOfInsertPres].start_date;
  let mtime = new Date(rp_date.substring(0, 4)+"-"+rp_date.substring(4, 6)+"-"+rp_date.substring(6, 8)).getTime();


  period_permission = this.checkPeriodmedicineUnit(medicine1, mtime);
  // if(medicine1.start_month != "") {
  //   stime = new Date(medicine1.start_month).getTime();
  //   if(stime > mtime) {
  //     period_permission = -1;
  //   }  
  // }
  // // medicine1.end_month = "2019-03";
  // if(medicine1.end_month != "") {
  //   let date_split = medicine1.end_month.split("-");
  //   let day = new Date(date_split[0], date_split[1], 0).getDate();
  //   etime = new Date(medicine1.end_month.substring(0,4), medicine1.end_month.substring(5,7), day).getTime();
  //   if(etime < mtime) {
  //     period_permission = -1;
  //   }  
  // }

  medicine1.period_permission = period_permission;  


  let rpIdx, medIdx;


  if (
    indexOfInsertPres == original.length - 1 &&
    indexOfInsertMed == original[original.length - 1].medicines.length - 1
  ) {
    rpIdx = original.length - 1;
    medIdx = original[original.length - 1].medicines.length - 1;
    // order = original[original.length - 1];        
    // original[original.length - 1].medicines[
    //   original[original.length - 1].medicines.length - 1
    // ] = medicine1;
    this.setState({
      indexOfInsertPres: -1,
      indexOfInsertMed: -1
    });
    
  } else {
    rpIdx = indexOfInsertPres;
    medIdx = indexOfInsertMed;
    // order = original[indexOfInsertPres];

    // original[indexOfInsertPres].medicines[indexOfInsertMed] = medicine1;
    this.setState({
      indexOfInsertPres: indexOfInsertPres,
      indexOfInsertMed: indexOfInsertMed
    });
  }

  // 用法区分チェック

  let order = original[rpIdx];

  if(order.allowed_diagnosis_division != undefined && !order.allowed_diagnosis_division.includes(medicine1.diagnosis_division.toString())  ) {
    medicine1.diagnosis_permission = -1;
  }
  
  original[rpIdx].medicines[medIdx] = medicine1;


  this.setState({
      presData: original,
      isAmountOpen: true,
      daysInitial:0,
      calcNum: this.state.presData.length - 1,
      usageModal: false,
      showedPresData: {
        medicineName: medicine.name
      }
    },
    function() {
      window.localStorage.removeItem(CACHE_LOCALNAMES.CALC );
      this.storeDataInCache();
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
  if(diseaseData.length > 0) {
      let m_code = parseInt(medicine.code);
      diseaseData.map((item)=>{
        let keyword = item.keyword;
        let disease_documents_list = item.disease_documents_list;
        Object.keys(disease_documents_list).map((idx)=>{
           let yj_code_list = disease_documents_list[idx].y;
           let documents = disease_documents_list[idx].d;
           if (yj_code_list.includes(medicine.yj_code)) {
              Object.keys(documents).map((id)=>{
                  let detail = diseaseDetail[documents[id]];
                  if (detail.y == medicine.yj_code) {
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

  let diagnosisData = {};
  if(medicine1.diagnosis_permission == -1) {
    diagnosisData[rpIdx] = [medIdx];
  }
  

   if( diseaseData.length == 0 || Object.keys(selDiseaseData).length == 0 ) {
    let periodData = {};

    //期間 チェック
      if(period_permission == -1) {
        periodData[medicine1.medicineId] = [medicine1.medicineName, medicine1.gene_name];
        this.setState({
          insertMedicineFlag: false,
          periodModal: true,
          periodData: periodData,
        });
        return false;
      } else {
      if(Object.keys(diagnosisData).length > 0) {
        this.setState({
          insertMedicineFlag: false,
          diagnosisModal: true,
          diagnosisData: diagnosisData
        });

      } else {
        this.setState({
          insertMedicineFlag: true,
        });
      } 
   }
  } else {
        this.setState({
          diseaseModal: true,
          diseaseData: selDiseaseData,
          insertMedicineFlag: false,
        });
      return false;
   }

  return true;
}
