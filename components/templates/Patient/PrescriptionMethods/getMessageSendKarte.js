 // import { Karte_Steps, Karte_Step_Title, Karte_Types, Karte_Messages, Karte_Urls } from "~/helpers/constants";
import { Karte_Step_Title, Karte_Urls, Karte_Steps } from "~/helpers/constants";

export default function() {
  // step 1: 処方, 2: 注射, 3: SOAP
  // type 1: 新規登録, 2: 編集（修正）, 3: 中止（削除）, 4: Response error
  // msg : string
  // rstep
  let steps = Karte_Step_Title;
  // let types = {1: "登録をしました", 2:"の編集を確定しました", 3:"の中止を確定しました"};
  const cacheSendKarte = JSON.parse(window.localStorage.getItem("haruka_send_karte"));
  let existSendKarte = true;
  let cache = {};
  if(cacheSendKarte == null){
    existSendKarte = false;
  }
  if(existSendKarte){
    cache = cacheSendKarte;
  } else {
    cache.cur_step = 0;
    cache.cur_error = 0;
    cache.messages = {};
  }
  let urls = Karte_Urls;
  let ret_msg = "";
  let title = "";
  // let idx;
  window.localStorage.removeItem("haruka_send_karte");
  if( cache.cur_error == 0 ) return {msg: ret_msg, url: urls[Karte_Steps.Patients] != undefined ? urls[Karte_Steps.Patients] : "soap" , title:cache.cur_title};

  for (let [step, message] of Object.entries(cache.messages)) {
      if(Object.keys(message.success).length > 0) {
        Object.keys(message.success).map(idx=>{
          ret_msg += "■" + message.success[idx] + "\n";
        });
      }
      if(Object.keys(message.errors).length > 0) {
        Object.keys(message.errors).map(idx=>{
          if(step == Karte_Steps.Hospital_Bed || step == Karte_Steps.Hospital_In || step == Karte_Steps.Discharge_Permit || step == Karte_Steps.Discharge_Decision
            || step == Karte_Steps.Discharge_Done || step == Karte_Steps.Ward_Move_Cancel || step == Karte_Steps.Change_Responsibility_Cancel
            || step == Karte_Steps.Hospital_Done_Cancel || step == Karte_Steps.Discharge_Cancel || step == Karte_Steps.Hospital_Going_Cancel
            || step == Karte_Steps.Inspection_Stop
          ){
            ret_msg += message.errors[idx] + "\n";
          } else {
            title = "■" + steps[step] + "エラー";
            ret_msg += title + "\n";
            ret_msg += message.errors[idx] + "\n";
          }
        });
      }

      ret_msg += "\n";
  }

  return {msg: ret_msg, url: urls[cache.cur_step] != undefined ? urls[cache.cur_step] : "soap", title:cache.cur_title};
}
