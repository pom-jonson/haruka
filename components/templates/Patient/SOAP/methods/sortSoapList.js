export default function(soapList) {
  let sort_soap_list = {};
  if(soapList.length > 0){
    soapList.map(item=>{
      // let key_updated_at = new Date(item.updated_at).getTime();
      // sort_soap_list[key_updated_at + getSortKey(item.number)] = item;
      let key_treatment_date = ''+new Date(item.treatment_date).getTime();
      let key_created_at = ''+new Date(item.created_at).getTime();
      sort_soap_list[key_treatment_date + key_created_at + getSortKey(item.number)] = item;
    })
  }
  return sort_soap_list;
}

function getSortKey(number, length=8) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}


