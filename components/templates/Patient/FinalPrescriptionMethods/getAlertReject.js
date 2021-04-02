export default function(s_item, d_item) {
  if(s_item.tagret_contraindication == undefined || s_item.tagret_contraindication == null ) return 0;
  if(d_item.yj_code == undefined || d_item.yj_code == null ) return 0;
  if(s_item.tagret_contraindication.length == 0 ) return 0;
  
  let ret = 0;
  for (let item of s_item.tagret_contraindication) {
    if(item.t_9 == d_item.yj_code.substring(0,9)) {
      if(item.i_c > 1) {
        ret = ret | 1;
      } else {
        if(parseInt(this.japic_alert_reject) == 1){
          ret = ret | 2;
        } else {
          ret = ret | 1;
        }
      }
    }
  }
  
  return ret;
}
