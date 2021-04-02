import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";

export default function(feature = 0, action = 0, use_common_auth = 1) {
  
  // ハルカで全て一括設定を無視して権限判定
  if (isHaruka()) use_common_auth = 0;  
  if (this.state.featureAuths.includes(feature * 100 + action)) {
    return true;
  } else {
    if(use_common_auth){
        if (this.state.commonAuths.includes(action)) {
            return true;
        }
    }
  }
  return false;
}

function isHaruka(){  
  let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
  if (initState == null || initState == undefined || initState.enable_ordering_karte == null || initState.enable_ordering_karte == undefined) return;
  let is_haruka = 0;
  let haruka = initState.enable_ordering_karte;
  let dialysis = initState.enable_dialysis;
  if(haruka == 1) is_haruka = 1;
  else if(dialysis == 0) is_haruka = 1;
  return is_haruka == 1;
}
