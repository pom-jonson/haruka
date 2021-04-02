import { persistedState } from "../../../helpers/cache";

export default function() {
  let { persistState, cacheState, cacheInjectState } = persistedState();

  if (!persistState) return false;
  if (!cacheState && !cacheInjectState) return false;

  let data = undefined;
  let injectionData = undefined;
  if (cacheState){
    cacheState.map(item => {
      if (item.user_number === persistState.user_number) {
        data = item;
      }
    });
  }    
  
  if (cacheInjectState){
    cacheInjectState.map(item => {
      if (item.user_number === persistState.user_number) {
        injectionData = item;
      }
    });
  }

  if (data === undefined && injectionData === undefined) return false;

  let isEmpty = true;
  let isInjectionEmpty = true;
  if (data !== undefined) {    
    data.presData.map(data => {
      data.medicines.map(medicine => {
        if (medicine.medicineName !== "") {
          isEmpty = false;
        }
      });
    });

    if (isEmpty) {
      window.localStorage.removeItem("haruka_edit_cache");     
    }
  } 

  if(isEmpty && injectionData !== undefined){
    isInjectionEmpty = true;
    data = injectionData;
    data.injectData.map(item => {
      item.medicines.map(medicine => {
        if (medicine.medicineName !== "") {
          isInjectionEmpty = false;
        }
      });
    });

    if (isInjectionEmpty) {
      window.localStorage.removeItem("haruka_inject_edit_cache");    
      return false; 
    }
  }


  let time =
    data.time.substr(0, 4) +
    "年" +
    data.time.substr(5, 2) +
    "月" +
    data.time.substr(8, 2) +
    "日" +
    data.time.substr(11, 2) +
    "時" +
    data.time.substr(14, 2) +
    "時";
  //セット処方する場合処理
	if(data.system_patient_id == null && cacheState){
    window.localStorage.removeItem("haruka_edit_cache");
		return false;
	}
  //セット注射する場合処理
	if(data.system_patient_id == null && cacheInjectState){
    window.localStorage.removeItem("haruka_inject_edit_cache");
		return false;
	}

  let strTitle = "編集中の情報があります。\n時間:" +
        time +
        "\n診療科: " +
        data.department +
        "\n状況: " +
        data.karte_status_name +
        "\n患者名:" +
        data.patient_name;
  this.setState({
    editTitle : strTitle,
    editModal : true,
    editPatientId : data.system_patient_id
  });
  return true;
  /*
  if (
    confirm(
      "編集中の情報があります。\n時間:" +
        time +
        "\n診療科: " +
        data.department +
        "\n患者名:" +
        data.patient_name
    )
  ) {   
      this.props.history.replace(
        "/patients/" + data.system_patient_id + "/soap"
      );

    // if (isEmpty == false) {      
    //   this.props.history.replace(
    //     "/patients/" + data.system_patient_id + "/prescription"
    //   );
    // }else{
    //   this.props.history.replace(
    //     "/patients/" + data.system_patient_id + "/injection"
    //   );
    // }
    return true;
  } else {
    // cacheState = cacheState.filter(item => {
    //   if (item.user_number !== persistState.user_number) return item;
    // });
    // const newStateStr = JSON.stringify(cacheState);
    // window.localStorage.setItem("haruka_edit_cache", newStateStr);
    window.localStorage.removeItem("haruka_edit_cache");
    window.localStorage.removeItem("haruka_inject_edit_cache");
    return false;
  }  
  */  
}
