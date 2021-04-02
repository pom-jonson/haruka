import * as apiClient from "~/api/apiClient";

export default function(newPattern, type) {
 
  let postData = {
    code: newPattern.patternCode,
    name: newPattern.patternName,
    name_kana: newPattern.patternKana,
    number: newPattern.number !== undefined ? newPattern.number : 0,
    is_enabled: newPattern.alwaysShow,
  };
  if (type == "item") {
    postData = {
      pattern_code: newPattern.patternCode,
      item_code: newPattern.itemCode,
      name_kana: newPattern.abbreviation,
    };
  }
  let path = "/app/api/v2/dial/master/register_examination_pattern";
  if (type == "item") path = "/app/api/v2/dial/master/register_examination_pattern_item";
  apiClient
    .post(path, {
      params: postData
    })
    .then((res) => {
      if(res.error_message !== undefined){
          window.sessionStorage.setItem("alert_messages", res.error_message);
      } else {
          if(res.alert_message)  {
            var title = '';
            var message = res.alert_message;
            if (message.indexOf('変更') > -1) title = "変更完了##";
            if (message.indexOf('登録') > -1) title = "登録完了##";
            window.sessionStorage.setItem("alert_messages",title + res.alert_message);
          }
          this.props.registerExaminationPattern(this.state);
          this.closeModal();
      }
    })
    .catch(() => {
      window.sessionStorage.removeItem("isCallingAPI");
      this.closeModal();
    });     
}

