import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";

export const getMenuAuthority = (menu_id, permission, menu_name="") => {
  let curUserInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let arr_menu_permission = curUserInfo.menu_auth; 
    if (arr_menu_permission == undefined || arr_menu_permission == null ) {
      menu_name = false;
      return menu_name;
    }
    if (arr_menu_permission[menu_id] != undefined && arr_menu_permission[menu_id].includes(permission)) return true;
    else return false;
};

export const AUTHS = {
    READ: 10,
    REGISTER: 11, // { value: 11, label: '登録'},
    REGISTER_OLD: 12, // { value: 12, label: '登録(過去)'},
    REGISTER_PROXY: 13, // { value: 13, label: '代理登録'},
    REGISTER_PROXY_OLD: 14, // { value: 14, label: '代理登録(過去)'},
    DONE_OREDER: 15, // { value: 15, label: '実施'},
    EDIT: 21, // { value: 21, label: '変更'},
    EDIT_OLD: 22, // { value: 22, label: '変更(過去)'},
    EDIT_PROXY: 23, // { value: 23, label: '代理変更'},
    EDIT_PROXY_OLD: 24, // { value: 24, label: '代理変更(過去)'},
    STOP: 31, // { value: 31, label: '中止'},
    STOP_OLD: 32, // { value: 32, label: '中止(過去)'},
    STOP_PROXY: 33, // { value: 33, label: '代理中止'},
    STOP_PROXY_OLD: 34, // { value: 34, label: '代理中止(過去)'},
    DELETE: 41, // { value: 41, label: '削除'},
    DELETE_OLD: 42, // { value: 42, label: '削除(過去)'},
    DELETE_PROXY: 43, // { value: 43, label: '代理削除'},
    DELETE_PROXY_OLD: 44, // { value: 44, label: '代理削除(過去)'},
    CONFIRM: 51, // { value: 51, label: '承認'},
    SHOW_DELETE: 52, // { value: 51, label: '削除済みの表示'},
    CAN_SHOW: 53, // { value: 53, label: '薬剤マスタ管理画面の閲覧'},
    RECEIPT: 61, // {value: 61, label: 'レセプト情報の修正'},
  };