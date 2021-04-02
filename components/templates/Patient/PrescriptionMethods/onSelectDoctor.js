export default function() {
  this.context.$selectDoctor(true);
  this.setState({
    isCopyOrder: false,
    isEditOrder: false
  });
}
