import * as karteApi from "~/helpers/cacheKarte-utils";
import {
  CACHE_LOCALNAMES,
} from "~/helpers/constants";

export default function() {
  let originalNumber = JSON.parse(JSON.stringify(this.state.presData));
  let cacheState = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
  if (cacheState != undefined && cacheState != null && cacheState[0].presData.length > 0) {
    originalNumber = cacheState[0].presData;
    
  }
  if (this.amountCancelFromMenu == "amount_cancel_from_menu") {
    this.amountCancelFromMenu = "";
    return;
  }

  let order_pos = -1;
  let med_pos = -1;
  let _indexOfInsertPres = this.m_indexOfInsertPres;
  let _indexOfInsertMed = this.m_indexOfInsertMed;
  if (_indexOfInsertPres == -1 || _indexOfInsertMed == -1) {
    order_pos = originalNumber.length - 1;    
  } else {    
    order_pos = _indexOfInsertPres;
    med_pos = _indexOfInsertMed;
  }  

  // if (this.state.isForUpdate === false) {
    if (order_pos != -1 && originalNumber[order_pos].medicines.length >= 2) {
      if (med_pos != -1) {
        originalNumber[order_pos].medicines[med_pos] = this.getEmptyMedicine();        
      } else {        
        originalNumber[order_pos].medicines.pop();
        originalNumber[order_pos].medicines.push(
          this.getEmptyMedicine()
        );
      }
    } else {
      originalNumber.pop();
      originalNumber[originalNumber.length] = this.getEmptyPrescription();
    }

    // ■1211-3 処方薬品登録
    if (this.modal_obj.med_diagnosis_ok == true) {
      originalNumber[_indexOfInsertPres].medicines.splice(
        [_indexOfInsertMed],
        1
      );
    }
    this.modal_obj.med_diagnosis_ok  = null;

    // this.setState({ presData: originalNumber }, function() {
    //   this.storeDataInCache();
    // });
    let data = {};
    data['presData'] = originalNumber;
    this.storeDataInCache(data);
  // }

  // this.setState({
  //   isAmountOpen: false,
  //   showedPresData: {
  //     medicineName: ""
  //   },
  //   insertStep: 0
  // });  
}
