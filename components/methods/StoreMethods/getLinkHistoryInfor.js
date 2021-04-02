import axios from "axios";

export default async function(systemType) {
  try {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo == null) return;
    let postData = {
      number: authInfo.user_number,
      type: systemType      
    };    

    const { data } = await axios.post(
      "/app/api/v2/user/link_history/get",
      {
        params: postData
      }
    );
    
    this.context.$updateLinkHistoryList(JSON.parse(data));    
  } catch (e) {
    return null;
  }
}
