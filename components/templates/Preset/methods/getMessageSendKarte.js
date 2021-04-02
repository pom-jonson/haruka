 // import { Karte_Steps, Karte_Step_Title, Karte_Types, Karte_Messages, Karte_Urls } from "~/helpers/constants";
import { Karte_Step_Title, Karte_Urls, Karte_Steps } from "~/helpers/constants";

export default function() {
  // step 1: 処方, 2: 注射, 3: SOAP 
  // type 1: 新規登録, 2: 編集（修正）, 3: 中止（削除）, 4: Response error 
  // msg : string
  // rstep
  let steps = Karte_Step_Title;
  // let types = {1: "登録をしました", 2:"の編集を確定しました", 3:"の中止を確定しました"};
  const cacheSendKarte = JSON.parse(
    window.localStorage.getItem("haruka_send_karte")
  );


  let existSendKarte = true;
  let cache = {};
  if(cacheSendKarte == null){
    existSendKarte = false;
  }
  
  
  if(existSendKarte) cache = cacheSendKarte;
  else {
    cache.cur_step = 0;
    cache.cur_error = 0;
    cache.messages = {};
  }

  let urls = Karte_Urls;
  let ret_msg = "";
  let title = "";
  // let idx;
  // console.log(cache);
  window.localStorage.removeItem("haruka_send_karte");
  if( cache.cur_error == 0 ) return {msg: ret_msg, url: urls[Karte_Steps.Patients]};
  
  
  for (let [step, message] of Object.entries(cache.messages)) {
      if(Object.keys(message.success).length > 0) {
        Object.keys(message.success).map(idx=>{
          ret_msg += "■" + message.success[idx] + "\n";
        });
      }
      if(Object.keys(message.errors).length > 0) {
        Object.keys(message.errors).map(idx=>{
          title = "■" + steps[step] + "エラー";
          ret_msg += title + "\n"; 
          ret_msg += message.errors[idx] + "\n"; 
        });
      }

      ret_msg += "\n";
  }


  return {msg: ret_msg, url: urls[cache.cur_step]};
}
