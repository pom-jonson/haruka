import * as sessApi from "~/helpers/cacheSession-utils";
import {
    // OPERATION_TYPE,
    // PERMISSION_TYPE,
    // SOAP_TREE_CATEGORY,
    // TREE_FLAG,
    // CACHE_LOCALNAMES,
    CACHE_SESSIONNAMES,
    // FUNCTION_ID_CATEGORY,
    // KARTEMODE, 
    // Karte_Types,
} from "~/helpers/constants";

export const getNavigationMenuInfoById = (_id=null) => {
    if (_id == null || _id < 0) return;

    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let navigation_menu = initState.navigation_menu;
    let result = null;
    navigation_menu.map(item=>{      
      if (item.id == _id) {
        result = item;
      }
    });
    return result;
      
};
