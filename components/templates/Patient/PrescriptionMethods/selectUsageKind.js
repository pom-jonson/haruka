export default function(e) {
  this.setState({
    medical_business_diagnosing_type: parseInt(e.target.id),
    tab: parseInt(e.target.id),
    usageSelectIndex: -1
  });
  if (
    document.getElementById("prescription_dlg") !== undefined &&
    document.getElementById("prescription_dlg") !== null
  ) {
    document.getElementById("prescription_dlg").focus();
  }
}
