export default function() {
  this.context.$selectDoctor(false);
  this.setState({
    canEdit: this.state.staff_category === 1,
    isCopyOrder: false,
    isEditOrder: false,
    tempItems: []
  });
}
