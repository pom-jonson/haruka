import axios from "axios";

export default async function(systemType) {
  try {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo == null || authInfo.user_number === undefined) return;
    let postData = {
      number: authInfo.user_number,
      type: systemType
    };    

    let path = "/app/api/v2/user/bookmarks/get";
    const { data } = await axios.post(
      path,
      {
        params: postData
      }
    );
    this.context.$updateBookmarksList(JSON.parse(data));    
  } catch (e) {
    return null;
  }
}
