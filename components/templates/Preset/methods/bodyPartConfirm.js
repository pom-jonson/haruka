export default function(value) {
    let originalNumber = this.state.presData;
  
    originalNumber[this.state.indexOfEditPres].body_part = value;
  
    this.setState({
        isBodyPartOpen: false,
        indexOfEditPres: -1,
        presData: originalNumber
    },
    function() {
      this.storeDataInCache();
    }
    );
}
  