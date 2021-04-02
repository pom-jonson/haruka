export default function(id, name) {
  let department_name = "その他";
  this.state.doctors.map(doctor => {
    if (doctor.doctor_code === parseInt(id)) {
      if (doctor.diagnosis_department_name !== "") {
        department_name = doctor.diagnosis_department_name;
      }
    }
  });
  this.context.$updateDoctor(id, name, department_name);
  this.context.$selectDoctor(false);
  this.setState(
    {
      canEdit: true
    },
    () => {     
      // MedicineSelectionからCopyやEditを進行する時
      if (this.state.isCopyOrder === true) {
        this.state.tempItems.forEach(order => {
          this.copyInjectionOrder(order);
        });
      }

      if (this.state.isEditOrder === true) {
        let prescription = this.state.tempItems[0];

        this.editInjectOrders(prescription);
      }      
      this.setState({
        tempItems: [],
        canEdit: this.state.staff_category === 1,
        isCopyOrder: false,
        isEditOrder: false
      });
    }
  );
}
