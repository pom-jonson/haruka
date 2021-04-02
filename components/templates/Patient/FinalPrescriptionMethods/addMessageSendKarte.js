import { Karte_Step_Title, Karte_Messages } from "~/helpers/constants";

export default function(step, type, msg, error) {
  // step 1: 処方, 2: 注射, 3: SOAP 
  // type 1: 新規登録, 2: 編集（修正）, 3: 中止（削除）, 4: Response error 
  // msg : string
  // rstep

  // console.log(" add Message " + step + "," + type + "," + msg + "," + error + ",");
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

  cache.cur_step = step;
  cache.cur_error = error;

  if(cache.messages[step] == undefined) {
    cache.messages[step] = {};
    cache.messages[step].errors = {};
    cache.messages[step].success = {};
  }

  if(error) {
    
    cache.messages[step].errors[type] = msg;
  }
  else {
    if(msg == "") {
      cache.messages[step].success[type] = Karte_Step_Title[step] + Karte_Messages[type] + "\n";    
    } else {
      cache.messages[step].success[type] = msg + "\n";    
    }
   
  }

  window.localStorage.setItem("haruka_send_karte", JSON.stringify(cache))

}
