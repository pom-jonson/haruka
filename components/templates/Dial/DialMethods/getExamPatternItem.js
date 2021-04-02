import axios from "axios";

export default async function(pattern_code) {  
  const { data } = await axios.post(
    "/app/api/v2/dial/master/get_examination_pattern_item",
    {
      params: {
        pattern_code: pattern_code
      }
    }
  );
  this.setState({
    examinationPatternItemList: data
  });
  return data;
}
