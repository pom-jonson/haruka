import { getCurrentDate } from "../../../../helpers/date";

export default function(order_number = undefined, presDataState = null) {
  const initData = {
    medicines: [
      {
        medicineId: 0,
        medicineName: "",
        amount: 0,
        unit: "",
        free_comment: []        
      }
    ],
    days: 0,
    days_suffix: "",
    usage: 0,
    usageName: "",
    usageIndex: 0,
    year: "",
    month: "",
    date: "",        
    body_part: "",  
    usage_remarks_comment: [],      
    start_date: getCurrentDate()
  };

  if (presDataState) {
    this.setState({ 
      injectData: presDataState,
      injectionHistory: order_number ? this.setInjectDoCopyStatus(order_number, false) : this.state.injectionHistory
    });
  } else {
    this.setState(
      {
        injectData: [initData],
        indexOfInsertMed: -1,
        injectionHistory: order_number ? this.setInjectDoCopyStatus(order_number, false) : this.state.injectionHistory
      },
      function() {
        window.localStorage.removeItem("haruka_inject_edit_cache");
      }
    );
  }
}
