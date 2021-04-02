// import { CACHE_LOCALNAMES } from "~/helpers/constants";
// import * as localApi from "~/helpers/cacheLocal-utils";
// import * as patientApi from "~/helpers/cachePatient-utils";

export default async function(order) {
  let selDiseaseData = {};
  // let diseaseData = this.state.patientDiseaseData;
  // let diseaseData = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE_DATA)); // 病名禁忌
  // let diseaseData = patientApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE); // 病名禁忌
  let diseaseDataResult = await this.getContraindicationsToDiseaseApi(this.props.match.params.id); // 病名禁忌
  let diseaseDetail = diseaseDataResult.details;
  let diseaseData = diseaseDataResult.result;
  let selMedicines = [];
  if (diseaseData == undefined) return false;
  
  if(diseaseData.length != 0 && order !== undefined) {
    order.med.map((medicine)=>{
      let m_code = parseInt(medicine.item_number);
        if(!selMedicines.includes(m_code)) {
          selMedicines.push(m_code);
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
                            obj.medicineName = medicine.item_name;
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
      });


    }

   if(Object.keys(selDiseaseData).length !== 0) {
      this.setState({
        diseaseOrderModal: true,
        diseaseOrderData: selDiseaseData,
        diseaseOrder : order,
      });
      return true;
    }     

    return false;

}
