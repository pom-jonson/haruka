import { persistedState } from "../../../../helpers/cache";

export default function() {
  let { persistState, cacheState } = persistedState();

  if (!persistState) return;
  if (!cacheState) return;

  cacheState = cacheState.filter(item => {
    if (item.user_number !== persistState.user_number) return item;
  });

  const newStateStr = JSON.stringify(cacheState);
  window.localStorage.setItem("haruka_edit_cache", newStateStr);
}
