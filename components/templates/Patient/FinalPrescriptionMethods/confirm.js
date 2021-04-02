export default function(item) {
  if (item.indexNum == 0 || item.indexNum) {
    let original = this.state.presData;
    original[item.indexNum] = item;

    // this.setState(
    //   {
    //     presData: original,
    //     isAmountOpen: false,
    //     isDaysOpen: false,
    //     daysInitial: 0,
    //     daysLabel: "",
    //     daysSuffix: ""
    //   },
    //   function() {
    //     this.storeDataInCache();
    //   }
    // );
    this.modal_obj.isAmountOpen = false;
    this.modal_obj.isDaysOpen = false;
    this.modal_obj.daysInitial = 0;
    this.modal_obj.daysLabel = "";
    this.modal_obj.daysSuffix = "";

    let data = {};
    data['presData'] = original;

    this.storeDataInCache(data);    
  } else {
    this.state.presData.push(item);
    // this.setState(
    //   {
    //     presData: this.state.presData,
    //     isAmountOpen: false,
    //     isDaysOpen: false,
    //     daysInitial: 0,
    //     daysLabel: "",
    //     daysSuffix: "",
    //     showedPresData: {
    //       medicineName: ""
    //     }
    //   },
    //   function() {
    //     this.storeDataInCache();
    //   }
    // );
    this.modal_obj.isAmountOpen = false;
    this.modal_obj.isDaysOpen = false;
    this.modal_obj.daysInitial = 0;
    this.modal_obj.daysLabel = "";
    this.modal_obj.daysSuffix = "";
    this.modal_obj.showedPresData = {
      medicineName: ""
    };

    let data = {};
    data['presData'] = this.state.presData;

    this.storeDataInCache(data);  

    this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);      
  }
}
