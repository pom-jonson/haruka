import {CACHE_LOCALNAMES} from "~/helpers/constants";
import * as patientApi from "~/helpers/cachePatient-utils";
import axios from "axios";
export default async function(patient_id) {
  let need_api_call = patientApi.getVal(patient_id, CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE_API);
  // if (need_api_call != 1 && this.contraindications_to_disease != undefined && this.contraindications_to_disease != null && this.contraindications_to_disease.length > 0) { // no need call api
  if (need_api_call != 1 && this.contraindications_to_disease != undefined && this.contraindications_to_disease != null) { // no need call api
    return this.contraindications_to_disease;
  }
  const { data } = await axios.get(
    "/app/api/v2/karte/contraindications_to_disease",
    {
      params: {
        patient_id: patient_id
      }
    }
  );

  if (data != undefined && data != null && data.result != undefined && data.result != null && data.result.length > 0) {
    // data.result.map(item=>{
    //   if (item.disease_documents_list != undefined && item.disease_documents_list != null && Object.keys(item.disease_documents_list).length > 0 ) {
    //     Object.keys(item.disease_documents_list).map(key=>{
    //       let documents_array = item.disease_documents_list[key].d; // get documents key array
          
    //       let _obj = {};
    //       let yj_code_list = [];
          
    //       if (documents_array.length > 0) {
    //         documents_array.map(ele=>{
    //           _obj[ele] = getDocumentDetail(ele, data.details);
    //           yj_code_list.push(_obj[ele].yj_code);
    //         });
    //       }
    //       delete item.disease_documents_list[key].d;
    //       item.disease_documents_list[key].documents = _obj;
    //       item.disease_documents_list[key].yj_code_list = yj_code_list;

    //     });
    //   }
    // });
    this.contraindications_to_disease = data;    
  } else {
    this.contraindications_to_disease = {result:undefined, details:undefined, strkeys: undefined};    
  }
  patientApi.setVal(patient_id, CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE_API, 0);
  // 病名禁忌
  return data;
}

// function getDocumentDetail (_key, _array) {
//   let _ret = null;
//   if (_array != undefined && _array != null && Object.keys(_array).length > 0) {
//     Object.keys(_array).map(key=>{
//       if (_key == key) {
//         let key_val = {};
//         key_val["contraindication_category"] = _array[key].c;
//         key_val["information"] = _array[key].i;
//         key_val["yj_code"] = _array[key].y;
//         _ret = key_val;
//       }
//     });
//   }
  
//   return _ret;
// }
