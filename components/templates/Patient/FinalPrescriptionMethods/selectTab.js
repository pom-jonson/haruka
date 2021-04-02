export default function(id) {
  this.setState({
    medical_business_diagnosing_type: parseInt(id),
    tab: parseInt(id),
    usageSelectIndex: -1
  });
  if (
    document.getElementById("prescription_dlg") !== undefined &&
    document.getElementById("prescription_dlg") !== null
  ) {
    document.getElementById("prescription_dlg").focus();
  }
}
