export default async function(id, name) {
  let department_name = "その他";
  this.state.doctors.map(doctor => {
    if (doctor.doctor_code === parseInt(id)) {
      if (doctor.diagnosis_department_name !== "") {
        department_name = doctor.diagnosis_department_name;
      }
    }
  });
  this.context.$updateDoctor(id, name, department_name);
}
