export default function(soapList) {
  let soapData = this.sortSoapList(soapList);
  this.setState({soapList:soapData}, ()=>{
    this.middleRef.current.setSoapListData(soapData);
  });
}
