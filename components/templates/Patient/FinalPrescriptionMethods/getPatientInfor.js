import axios from "axios";
import { CACHE_LOCALNAMES, KARTEMODE} from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";

export default async function() {
  try {
    let patient_data = "";
    if (!karteApi.existPatient(this.props.match.params.id)) {
      const { data } = await axios.get(
        `/app/api/v2/karte/initial_patient?patientId=${
          this.props.match.params.id
        }`
      );    
      data.karte_mode = KARTEMODE.READ;

      // YJ100 右サイドバーの患者一覧で患者を切り替えたときに、入外区分や診療科が引き継がれてしまう不具合
      data.karte_status = {code: this.context.karte_status.code, name: this.context.karte_status.name};
      data.department = {code: this.context.department.code, name: this.context.department.name};

      // ●YJ209 複数の患者を開いているとき、最新の1人を閉じるとカルテ外ページの閉じるボタンがなくなる不具合
      data.enter_time = new Date().getTime();
  
      data.karte_mode = KARTEMODE.READ;
      karteApi.setPatient(this.props.match.params.id, JSON.stringify(data));
      localApi.setObject(CACHE_LOCALNAMES.CUR_PATIENT, data);  
      patient_data = data;
    } else {
      patient_data = karteApi.getVal(this.props.match.params.id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
      if(patient_data == undefined) {        
        patient_data.karte_mode = KARTEMODE.READ;
        patient_data.enter_time = new Date().getTime();
        karteApi.setPatient(this.props.match.params.id, JSON.stringify(patient_data));
        localApi.setObject(CACHE_LOCALNAMES.CUR_PATIENT, patient_data);
      } else {
        patient_data.karte_status = {code: this.context.karte_status.code, name: this.context.karte_status.name};
        patient_data.department = {code: this.context.department.code, name: this.context.department.name};
        patient_data.enter_time = new Date().getTime();
        karteApi.setPatient(this.props.match.params.id, JSON.stringify(patient_data));
      }
    }
    localApi.setValue("current_system_patient_id", this.props.match.params.id);
    return patient_data;
  } catch (e) {
    return {};
  }
}
