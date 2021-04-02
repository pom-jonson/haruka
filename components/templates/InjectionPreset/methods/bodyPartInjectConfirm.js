export default function(value) {
	let originalNumber = this.state.injectData;
    originalNumber[this.state.indexOfEditPres].body_part = value;
  
    this.setState({
        isBodyPartOpen: false,
        indexOfEditPres: -1,
        injectData: originalNumber
    },
    function() {
      this.storeInjectionDataInCache();
    });
}
  