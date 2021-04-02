import { CACHE_LOCALNAMES } from "~/helpers/constants";

export default function(value) {
	let originalNumber = this.state.injectData;
    originalNumber[this.modal_obj.indexOfEditPres].body_part = value;

    this.modal_obj.isBodyPartOpen = false;
    this.modal_obj.indexOfEditPres = -1;
    let data = {};
    data['injectData'] = originalNumber;
    this.storeInjectionDataInCache(data);

    // 注射データドラッグ&ドロップ操作
    let drop_inject_data = window.localStorage.getItem(CACHE_LOCALNAMES.DROP_INJECTION_DATA);
    if (drop_inject_data != null && drop_inject_data != undefined && drop_inject_data != "") {
      this.onDropEvent(drop_inject_data);
      window.localStorage.removeItem(CACHE_LOCALNAMES.DROP_INJECTION_DATA);
    }
          
    // this.setState({
    //     isBodyPartOpen: false,
    //     indexOfEditPres: -1,
    //     injectData: originalNumber
    // },
    // function() {
    //   this.storeInjectionDataInCache();

    //   // 注射データドラッグ&ドロップ操作
    //     let drop_inject_data = window.localStorage.getItem(CACHE_LOCALNAMES.DROP_INJECTION_DATA);
    //     if (drop_inject_data != null && drop_inject_data != undefined && drop_inject_data != "") {
    //       this.onDropEvent(drop_inject_data);
    //       window.localStorage.removeItem(CACHE_LOCALNAMES.DROP_INJECTION_DATA);
    //     }
    // });
}
  