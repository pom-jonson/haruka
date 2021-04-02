import axios from "axios";

export default async function(type = null) {
  let postData = {type:type, order:'name_kana'};
  const { data } = await axios.post(
    "/app/api/v2/dial/master/get_examination_pattern",
    {
      params: postData
    }
  );

  let master_list = {};
  var examinationPattern_code_options = [{id:0, value:''}];
  if (data != undefined && data.length>0 ){
      Object.keys(data).map((key) => {
        if(data[key].is_enabled === 1){
            master_list[data[key].code] = data[key].name;
            examinationPattern_code_options.push({id:data[key].code, value:data[key].name})
        }
      });
  }
  this.setState({
    examinationPatternList: data,
    examinationPattern_code: master_list,
    examinationPattern_code_options
  });
  return data;
}
