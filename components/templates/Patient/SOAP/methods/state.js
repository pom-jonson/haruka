// const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
import { getCurrentDate } from "../../../../../helpers/date";

export default function() {
  return {
    isLoaded: false,
    isForUpdate: false,
    soapList: [],
    updateIndex: -1,
    presData: {
      soap_start_at: getCurrentDate("-"),
      sharp_text: '',
      s_text: '',
      o_text: '',
      a_text: '',
      p_text: ''
    }
  };
}
