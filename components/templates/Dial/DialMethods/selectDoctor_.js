export default function(doctor) {
    this.setState({
        instruction_doctor_number:doctor.number,
        directer_name:doctor.number>0?this.state.doctor_list_by_number[doctor.number]:'',
        isShowDoctorList: false
    });
}
