export default function(index = 0, indexMed = 0, name = "") {
  if (name === "") return;

  let isGroup = false;
  if (name === "one_dose_package" || name === "temporary_medication" || name === "mixture") {
    isGroup = true;
  }
  const original = this.state.presData;
  if (isGroup) {
    original[index][name] = 1 - original[index][name];
  } else {
    original[index].medicines[indexMed][name] =
      1 - original[index].medicines[indexMed][name];
  }

  const newBulk = this.modal_obj.bulk;
    if(name !== "mixture") {
    let allChecked = 1;
    original.map((data, i) => {
      if (isGroup) {
        if (original[i][name] !== 1) {
          allChecked = 0;
        }
      } else {
        data.medicines.map((medicine, j) => {
          if (original[i].medicines[j][name] !== 1) {
            allChecked = 0;
          }
        });
      }
    });

    newBulk[name] = allChecked;
  }
  
  this.modal_obj.bulk = newBulk;
  let remark_status = {      
    bulk: newBulk      
  };
  this.remarkRef.current.testRemarkRender(remark_status);        
  let data = {};
  data['presData'] = original;
  this.storeDataInCache(data);
  // this.setState(
  //   {
  //     presData: original,
  //     bulk: newBulk
  //   },
  //   function() {
  //     this.storeDataInCache();
  //   }
  // );
}
