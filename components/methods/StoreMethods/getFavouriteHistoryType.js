import axios from "axios";

export default async function() {
  try {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo == null || authInfo.user_number === undefined) return;
    let postData = {
      number: authInfo.user_number,
    };    

    let path = "/app/api/v2/user/favourite_history_type/get";
    const { data } = await axios.post(
      path,
      {
        params: postData
      }
    );
    this.context.$updateFavouriteHistoryType(data != null && data != undefined && data == 1 ? "list" : "icon");     
    
  } catch (e) {
    return null;
  }
}
