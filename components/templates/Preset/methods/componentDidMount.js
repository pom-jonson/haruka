export default async function() {
  this.getPatientInfor();
  this.getHistoryData({
    id: this.props.match.params.id
  });
  this.getNotConsentedHistoryData();
  this.getDoctorsList();
  this.getUsageData();
  this.getDiseaseList();

  this.context.$updateStaffCategory(this.state.staff_category);

  this.setState({
    departmentId: this.context.department.code,
    department: this.context.department.name
  });

  if (
    document.getElementById("prescription_dlg") !== undefined &&
    document.getElementById("prescription_dlg") !== null
  ) {
    document.getElementById("prescription_dlg").focus();
  }
}
