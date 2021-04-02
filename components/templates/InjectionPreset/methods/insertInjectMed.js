
export default async function(medicine, indexOfInsertPres, indexOfInsertMed) {
  let original = this.state.injectData;  
  if (this.checkInjectCanEdit(0) === false) {
    let medicines = [];
    const insertMedicine = {
      medicine: medicine,
      indexOfInsertPres: indexOfInsertPres,
      indexOfInsertMed: indexOfInsertMed
    };
    medicines.push(insertMedicine);
    this.setState({
      tempItems: medicines
    });
    return false;
  }


    
  let medicine1 = {
    medicineId: medicine.code,
    medicineName: medicine.name,
    amount: medicine.amount,
    unit: medicine.main_unit,      
    free_comment: [],
    contraindication_alert: medicine.contraindication_alert,
    contraindication_reject: medicine.contraindication_reject,
    tagret_contraindication: medicine.tagret_contraindication,
    yj_code: medicine.yj_code
  };
 
  if (
    indexOfInsertPres == original.length - 1 &&
    indexOfInsertMed == original[original.length - 1].medicines.length - 1
  ) {
    original[original.length - 1].medicines[
      original[original.length - 1].medicines.length - 1
    ] = medicine1;
    this.setState({ indexOfInsertPres: -1, indexOfInsertMed: -1 });
  } else {
    original[indexOfInsertPres].medicines[indexOfInsertMed] = medicine1;
    this.setState({
      indexOfInsertPres: indexOfInsertPres,
      indexOfInsertMed: indexOfInsertMed
    });
  }
  this.setState(
    {
      injectData: original,
      isAmountOpen: true,
      daysInitial:0,
      calcNum: this.state.injectData.length - 1,
      usageModal: false,
      showedPresData: {
        medicineName: medicine.name
      }
    },
    function() {
      window.localStorage.removeItem("haruka_calc_formula");
      this.storeInjectionDataInCache();
    }
  );

  return true;
}
