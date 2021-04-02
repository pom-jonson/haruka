import { persistedState } from "../../../../helpers/cache";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES} from "~/helpers/constants";

export default function() {
  let { persistState, cacheInjectState } = persistedState(this.props.match.params.id);

  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let hour = newDate.getHours();
  let minute = newDate.getMinutes();
  let second = newDate.getSeconds();

  let now = `${year}-${month < 10 ? `0${month}` : `${month}`}-${
    date < 10 ? `0${date}` : `${date}`
  } ${hour < 10 ? `0${hour}` : `${hour}`}:${
    minute < 10 ? `0${minute}` : `${minute}`
  }:${second < 10 ? `0${second}` : `${second}`}`;

  let newFlg = true;
  if (cacheInjectState) {
    cacheInjectState.map(item => {
      if (item.user_number === persistState.user_number) {
        newFlg = false;
      }
    });
  } else {
    cacheInjectState = [];
  }

  if (newFlg) {
    cacheInjectState.push({
      user_number: persistState.user_number,
      system_patient_id: parseInt(this.props.match.params.id),
      time: now,
      injectData: this.state.injectData,
      number: this.state.isForUpdate ? this.state.orderNumber : undefined,
      insurance_type: 0, //保険情報現状固定
      free_comment: Array.isArray(this.state.free_comment)
        ? this.state.free_comment
        : [this.state.free_comment], //備考
      department_code: this.context.department.code, //this.state.departmentId,
      department: this.context.department.name, //this.state.department,
      patient_name: this.state.patientInfo.name,
      medical_department_name: this.context.medical_department_name,
      duties_department_name: this.context.duties_department_name,
      unusedDrugSearch: this.state.unusedDrugSearch,
      profesSearch: this.state.profesSearch,
      normalNameSearch: this.state.normalNameSearch,
      isForInjectionUpdate: false
    });

    if (this.state.staff_category === 2) {
      cacheInjectState[0].doctor_name = this.context.selectedDoctor.name;
      cacheInjectState[0].doctor_code = this.context.selectedDoctor.code;
      cacheInjectState[0].substitute_name = this.state.currentUserName;
    }
  } else {
    cacheInjectState.map(item => {
      if (item.user_number === persistState.user_number) {
        item.injectData = this.state.injectData;
        item.system_patient_id = parseInt(this.props.match.params.id);
        item.time = now;
        item.number = this.state.isForUpdate
          ? this.state.orderNumber
          : undefined;
        item.insurance_type = 0;
        item.free_comment = Array.isArray(this.state.free_comment)
          ? this.state.free_comment
          : [this.state.free_comment];
        item.department_code = this.context.department.code;
        item.department = this.context.department.name;
        item.patient_name = this.state.patientInfo.name;
        item.unusedDrugSearch = this.state.unusedDrugSearch;
        item.profesSearch = this.state.profesSearch;
        item.normalNameSearch = this.state.normalNameSearch;
        item.isForInjectionUpdate = true;

        if (this.state.staff_category === 2) {
          item.doctor_name = this.context.selectedDoctor.name;
          item.doctor_code = this.context.selectedDoctor.code;
          item.substitute_name = this.state.currentUserName;
        }
      }
    });
  }

  const newStateStr = JSON.stringify(cacheInjectState);
  // window.localStorage.setItem("haruka_inject_edit_cache", newStateStr);
  karteApi.setVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_EDIT, newStateStr);
}
