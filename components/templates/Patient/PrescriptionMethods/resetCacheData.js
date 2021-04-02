import { persistedState } from "../../../../helpers/cache";
import { CACHE_LOCALNAMES } from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";

export default function(patient_id) {
  let { persistState, cacheState } = persistedState(patient_id);

  if (!persistState) return;
  if (!cacheState) return;

  cacheState = cacheState.filter(item => {
    if (item.user_number !== persistState.user_number) return item;
  });

  const newStateStr = JSON.stringify(cacheState);
  // window.localStorage.setItem("haruka_edit_cache", newStateStr);
  karteApi.setSubVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber, newStateStr);

}
