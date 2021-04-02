import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
import Button from "~/components/atoms/Button";
import axios from "axios";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Context from "~/helpers/configureStore";
import Spinner from "react-bootstrap/Spinner";
import PropTypes from "prop-types";
import auth from "~/api/auth";
import {secondary} from "../../_nano/colors";
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import {formatTimeIE, formatTimePicker} from "~/helpers/date";
import DatePicker  from "react-datepicker";
import {toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const Card = styled.div`
  width: 100%;
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 20px;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
    margin-bottom: 20px;
  }
  .table-area {
    width: 50rem;
    margin: auto;
    height: calc(100% - 200px);
    font-size: 1rem;
    font-family: "Noto Sans JP", sans-serif;
		.div-header{
			width:100%;
			background-color: ${secondary};
			color: ${surface};
			text-align: center;
			.div-title{
				border:none;
				border-right: solid 1px lightgray;
			}
			.div-content {
				border: none;
			}
		}
		.div-body{
			height: calc(100vh - 280px);
			overflow-y:auto;
			border-bottom: solid 1px lightgray;
		}
		.div-title {
			width: 21rem;
			padding-left: 0.4rem;
			border-left: solid 1px lightgray;
			border-top: solid 1px lightgray;
			line-height: 2.375rem;
		}
		.search-box {
			.pullbox {
				.pullbox-label {
					width: 100%;
					margin-bottom: 0;
				}
				.pullbox-select {
					width: 100%;
				}
			}
		}
		.dial-label {
			width: 13rem;
		}
		.haruka-label {
			width: 13rem;
			font-size: 0.875rem
		}
		.label-title {
			width: 0;
			margin-right: 0px;
		}
		.div-content {
			border-left: solid 1px lightgray;
			border-right: solid 1px lightgray;
			border-top: solid 1px lightgray;
			line-height: 2.375rem;
			width: calc(100% - 300px);
			padding-left: 0.4rem;
			label {
			  font-size: 0.875rem;
			}
		}
		.div-input {
			margin-top: -8px;
		}
		.div-time {
			.react-datepicker__input-container input {
				height: 2.375rem;
				width: 100%;
			}
			width: 5rem;
		}
  }
  .footer {
    position: relative;
    margin-top: 30px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }
    span {
      color: white;
      font-size: 16px;
      font-weight: 100;
    }
    .disable-button{
      background: rgb(101, 114, 117);
    }
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
`;
class SystemSetting extends Component {
  constructor(props) {
    super(props);
    var initState = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    let table_data = [];
    this.state = {
      table_data,
      category: "",
      modal_data:{},
      isUpdateConfirmModal: false,
      confirm_message:"",
      alert_messages:"",
      load_flag:false,
    };
    this.cur_system = this.enableHaruka(initState);
  }
  
  componentDidMount() {
    if(!this.context.$canDoAction(this.context.FEATURES.SYSTEM_SETTING, this.context.AUTHS.READ, 0)) {
      this.props.history.replace("/");
    }
    // haruka config
    let table_data = [
      {title:"シール印刷", name:"enable_print", type:"radio", type_array:{"true":"有効","false":"無効"}},
      {title:"JAPIC禁忌薬判定", name:"enable_japic_search", type:"radio", type_array:{"ON":"有効","OFF":"無効"}},
      {title:"ログ用画面キャプチャ", name:"enable_screen_capture", type:"radio", type_array:{"ON":"有効","OFF":"無効"}},
      {title:"同一IPのログイン", name:"same_ip_logout_flag", type:"radio", type_array:{"ON":"禁止","OFF":"許可"}},  // ON = 1,  OFF = 0
      {title:"キャプチャ形式", name:"screen_capture_type", type:"selector", type_array:[{ id: 1, value: "png"},{ id: 2, value: "jpg"}]},
      {title:"キャプチャ最大幅（px）", name:"screen_capture_maxwidth", type:"text"},
      {title:"キャプチャ最大容量（kB）", name:"screen_capture_maxkb", type:"text"},
      {title:"ブラウザのタイトル", name:"title", type:"text"},
      {title:"離席時自動ログアウト時間(分)", name:"screensaver_limit", type:"text"},
      {title:"離席再ログインフォーム表示時間(秒)", name:"screensaver_form_limit", type:"text"},
      {title:"リハビリ病名　医事コメント連携", name:"haruka_rehabily_r_flag", type:"radio", type_array:{"ON":"主病名のみ","OFF":"全て"}},
      {title:"波線「～」置換", name:"telegram_swung_dash", type:"radio", type_array:{"ON":"有効","OFF":"無効"}}, // ON = 1,  OFF = 0
      {title:"追加品名機能", name:"enable_function_item", type:"radio", type_array:{"ON":"有効","OFF":"無効"}},
      {title:"選択パネルのスクリーンキーボード", name:"screen_keyboard_use", type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
      {title:"医師名マスタ作成形式", name:"doctor_name_create_mode", type:"radio", type_array:{0:"医師ユーザー登録時に作成",1:"マスタから選択のみ"}},
      {title:"デバッグモード", name:"debug_mode", type:"radio", type_array:{0:"いいえ",1:"はい"}},
      {title:"エラーメール送信フラグ", name:"error_mail_send", type:"radio", type_array:{0:"いいえ",1:"はい"}},
      {title:"エラーメール送信元（From）", name:"error_mail_from", type:"text"},
      {title:"エラーメール送信先（To）", name:"error_mail_to", type:"text"},
      {title:"エラーメール件名（Subject）", name:"error_mail_subject", type:"text"},
      {title:"デバッグ用ユーザー", name:"debug_user", type:"text"},
      {title:"処方Do登録件数", name:"patient_do_max_number", type:"selector", type_array:[{ id: 1, value: 1},{ id: 2, value: 2},{ id: 3, value: 3}]},
      {title:"処方Do呼び出し方式", name:"patient_do_get_mode",type:"radio", type_array:{0:"共有 ",1:"医師別"}},
      {title:"フリー入力病名", name:"wordpro_name",type:"radio", type_array:{0:"無効 ",1:"連携しない",2:"連携する"}},
      {title:"医師別の診療科制限", name:"can_write_department_list",type:"radio", type_array:{0:"なし ",1:"専用設定",2:"所属科"}},
      {title:"入外訪問記載区分制限", name:"doctor_outpatient_hospitalization_limit",type:"radio", type_array:{"true":"有効 ","false":"無効"}},
      {title:"JAPIC併用禁忌", name:"japic_alert_reject",type:"radio", type_array:{0:"警告",1:"禁止"}},
      {title:"依頼医の医師別頻用病名を参照", name:"consented_doctor_frequent_disease_enable",type:"radio", type_array:{"ON":"有効 ","OFF":"無効"}},
      {
        title:"シール印刷設定",
        name:"sticker_print_mode",
        type:"array",
        value:[
          {title:"SOAP", name:"soap_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"処方", name:"prescription_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"注射", name:"injection_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"検体検査", name:"examination_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"細胞診検査", name:"cytology_exam_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"細菌検査", name:"bacterial_exam_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"病理組織検査", name:"pathology_exam_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"処置", name:"treatment_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"汎用オーダー", name:"guidance_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"リハビリ", name:"rihabily_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"放射線", name:"radiation_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"生理検査", name:"inspection_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"食事指示", name:"meal_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"患者記載情報", name:"allergy_edit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"入院申込", name:"hospital_application",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"入院決定", name:"hospital_decision",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"入院実施", name:"hospital_done",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"退院許可", name:"discharge_permit",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"退院決定", name:"discharge_decision",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"退院実施", name:"discharge_done",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"転棟転室", name:"hospital_move",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"担当変更", name:"change_responsibility",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"外泊・帰院", name:"going_out_in",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"文書作成", name:"document",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"栄養指導依頼", name:"guidance_nutrition_order",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
          {title:"死亡登録", name:"death_register",type:"radio", type_array:{0:"無効 ",1:"初期値OFF",2:"初期値ON"}},
        ],
      },
      {title:"一括シール印刷設定", name:"multiple_print_mode",type:"radio", type_array:{0:"共通部をまとめる",1:"個別に表示"}},
      {title:"在宅処方(一包化)の会計キー", name:"prescription_home_one_dose_package", type:"text"},
      {title:"在宅診療区分設定", name:"enable_home_medical_business_diagnosing_type", type:"radio", type_array:{"ON":"有効","OFF":"無効"}},
      {title:"外来迅速検体検査加算の会計キー", name:"todayResult_detail_code", type:"text"},
      {title:"患者以外のページで患者メニューを使用", name:"patient_menu_enable_in_not_patient_page", type:"radio", type_array:{"ON":"可能","OFF":"不可"}},
      {title:"病名の入外区分", name:"disease_name_hospital_in_out",type:"radio", type_array:{1:"連携する",2:"入外共通として連携"}},
      {title:"病名の診療科情報", name:"disease_name_medical_department",type:"radio", type_array:{1:"連携する",2:"全科共通として連携"}},
      {title:"処置の請求情報オプション", name:"treat_order_is_enable_request",type:"radio", type_array:{"1":"使用する","0":"使用しない"}},
      {title:"処置部位・位置選択形式", name:"treat_order_part_position_mode",type:"radio", type_array:{0:"一階層表示",1:"部位-位置階層表示"}},
      {title:"入外区分：入院", name:"karte_in_out_enable_hospitalization",type:"radio", type_array:{"ON":"使用する","OFF":"使用しない"}},
      {title:"入外区分：訪問診療", name:"karte_in_out_enable_visiting",type:"radio", type_array:{"ON":"使用する","OFF":"使用しない"}},
      {title:"注射の全文検索", name:"injection_pro_search",type:"radio", type_array:{"ON":"有効","OFF":"無効"}},
      {title:"（次の日の）朝食変更締め切り", name:"morning_time", type:"time"},
      {title:"（次の日の）昼食変更締め切り", name:"noon_time", type:"time"},
      {title:"（次の日の）夕食変更締め切り", name:"evening_time", type:"time"},
      {title:"放射線のPACS表示設定", name:"radiation_pacs_flag", type:"radio", type_array:{"ON":"有効","OFF":"無効"}},
      {title:"入院決定オーダーの指定", name:"hospital_decision_bed", type:"radio", type_array:{0:"病室まで",1:"ベッドまで"}},
      {title:"検体検査の注目に使用する文字", name:"examination_attention_mark", type:"text"},
      {title:"セッションの生存時間(分)", name:"ExpirationMin", type:"text"},
      {title:"エラー後に元画面に自動で戻る", name:"error_auto_reload", type:"radio", type_array:{"ON":"有効","OFF":"無効"}},
      {
        title:"検体検査系キュー登録タイミング",
        name:"examination_queue_timing",
        type:"array",
        value:[
          {title:"検体採取実施時電文送信(外来)", name:"outpatient_collect",type:"radio", type_array:{"ON":"有効","OFF":"無効"}},
          {title:"検体検査受付時電文送信(外来)", name:"outpatient_done",type:"radio", type_array:{"ON":"有効","OFF":"無効"}},
          {title:"検体採取実施時電文送信(訪問)", name:"visit_collect",type:"radio", type_array:{"ON":"有効","OFF":"無効"}},
          {title:"検体検査受付時電文送信(訪問)", name:"visit_done",type:"radio", type_array:{"ON":"有効","OFF":"無効"}},
          {title:"検体採取実施時電文送信(入院)", name:"hospital_collect",type:"radio", type_array:{"ON":"有効","OFF":"無効"}},
          {title:"検体検査受付時電文送信(入院)", name:"hospital_done",type:"radio", type_array:{"ON":"有効","OFF":"無効"}}
        ],
      },
      {title:"入院時食事情報の初期送信日数", name:"in_hospital_meal_telegram_send_date_count", type:"numeric"},
      {title:"食事変更時の初期送信日数", name:"change_meal_telegram_send_date_count", type:"numeric"},
    ];
    // dialysis config
    if (this.cur_system == "dialysis") {
      table_data = [
        {title:"同一IPのログイン", name:"same_ip_logout_flag", type:"radio", type_array:{"ON":"禁止","OFF":"許可"}},  // ON = 1,  OFF = 0
        {title:"ブラウザのタイトル", name:"title", type:"text"},
        {
          title:"グラフの下の表の項目表示",
          name:"graph_table_show",
          type:"array",
          value:[
            {title:"除水量設定", name:"ms_target_drainage",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"除水速度", name:"ms_drainage_cur_speed",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"除水量積算", name:"ms_cur_drainage",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"血流量設定", name:"ms_blood_target_flow",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"血流量", name:"ms_blood_cur_flow",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"シリンジポンプ速度設定", name:"ms_syringe_speed",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"SP積算", name:"ms_syringe_value",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"静脈圧", name:"ms_venous_pressure",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"透析液圧", name:"ms_fluid_pressure",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"透析液温度設定", name:"ms_dialysate_target_temperature",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"透析液温度", name:"ms_dialysate_cur_temperature",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"透析液濃度設定", name:"ms_dialysate_target_concentration",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"透析液濃度", name:"ms_dialysate_cur_concentration",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"TMP", name:"ms_tmp",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"ダイアライザ血液入口圧", name:"ms_dializer_pressure",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"脱血圧", name:"ms_arterial_pressure",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"目標補液量", name:"ms_fluid_target_amount",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"補液速度", name:"ms_fluid_speed",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"補液量積算", name:"ms_fluid_cur_amount",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"補液温度設定", name:"ms_fluid_target_temperature",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"補液温度", name:"ms_fluid_cur_temperature",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"補液回数", name:"ms_hdf_count",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"総補液積算", name:"ms_hdf_amount",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"緊急総補液量", name:"ms_emergency_amount",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
            {title:"入力時間", name:"input_time",type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
          ],
        },
        {title:"病歴印刷設定", name:"disease_history_print_type", type:"radio", type_array:{0:"病歴",1:"患者病歴"}},
        // {title:"自動取得の間隔", name:"dial_device_request_interval", type:"text"},
        {title:"除水設定画面でのコンソール・ベッド修正", name:"dewatering_setting_console_bed_number_change", type:"radio", type_array:{"ON":"有効","OFF":"無効"}},
        {title:"処置モニタからDrカルテ新規記事登録", name:"treatmonitor_drkarte_display", type:"radio", type_array:{"ON":"表示","OFF":"非表示"}},
        {title:"体重計測の車椅子マスタ選択", name:"weight_calc_wheelchair_select_available", type:"radio", type_array:{"ON":"使用","OFF":"不使用"}},
        {title:"送信する血流量の形式", name:"console_init_blood_flow_is_fixed", type:"radio", type_array:{1:"固定の初期値",0:"スケジュールの値"}},
        {title:"固定設定時の血流量", name:"console_init_blood_flow_value", type:"text"},
      ];
    }
    this.setState({
      table_data,
      disabled: this.context.$canDoAction(this.context.FEATURES.SYSTEM_SETTING, this.context.AUTHS.EDIT,0)
    });
    auth.refreshAuth(location.pathname+location.hash);
  }
  
  async UNSAFE_componentWillMount(){
    this.getSearchResult();
  }
  enableHaruka = (initState) => {
    if (initState == null || initState == undefined) {
      return "haruka";
    }
    if(initState.enable_ordering_karte == 1) return "haruka";
    if(initState.enable_dialysis == 1) return "dialysis";
    return "haruka";
  }
  
  // 検索
  getSearchResult = async () => {
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/management/config/get";
    let { data } = await axios.post(path);
    data.same_ip_logout_flag = data.same_ip_logout_flag == 1 ? "ON" : "OFF";
    data.telegram_swung_dash = data.telegram_swung_dash == 1 ? "ON" : "OFF";
    data.haruka_rehabily_r_flag = data.haruka_rehabily_r_flag == 1 ? "ON" : "OFF";
    this.setState({
      config_data: data,
      load_flag:true,
    });
  };
  
  confirmCancel() {
    this.setState({
      confirm_message: "",
      alert_messages: "",
    });
  }
  
  editData = async () => {
    this.setState({
      confirm_message:"",
      load_flag:false,
    });
    let path = "/app/api/v2/management/config/save";
    let {config_data} = this.state;
    config_data.same_ip_logout_flag = config_data.same_ip_logout_flag == "ON" ? 1 : 0;
    config_data.telegram_swung_dash = config_data.telegram_swung_dash == "ON" ? 1 : 0;
    config_data.haruka_rehabily_r_flag = config_data.haruka_rehabily_r_flag == "ON" ? 1 : 0;
    config_data.noon_time = config_data.noon_time != "" ? formatTimeIE(config_data.noon_time) : '';
    config_data.evening_time = config_data.evening_time != "" ? formatTimeIE(config_data.evening_time) : '';
    config_data.morning_time = config_data.morning_time != "" ? formatTimeIE(config_data.morning_time) : '';
    await axios.post(path, {params: config_data}).then(()=>{
      this.setState({alert_messages:"設定を保存しました。"}, ()=>{
        this.getSearchResult();
      });
    });
  };
  
  setValue = (key, type, e) => {
    if (key == "console_init_blood_flow_value") {
      var RegExp = /^[0-9０-９]*$/;
      if (e.target.value !== "" && !RegExp.test(e.target.value)) return;
      if (e.target.value !== "" && parseInt(e.target.value) > 600) {
        return;
      }
    }
    let config_data= this.state.config_data;
    config_data[key] = e.target.value;
    this.setState({config_data});
  };
  setArrayValue = (key, sub_key, e) => {
    let config_data= this.state.config_data;
    if(config_data[key] === undefined) {
      config_data[key]  = {};
    }
    config_data[key][sub_key] = e.target.value;
    this.setState({config_data});
  };
  
  saveConfig = () => {
    if(!this.context.$canDoAction(this.context.FEATURES.SYSTEM_SETTING, this.context.AUTHS.EDIT, 0))  return;
    let {config_data} = this.state;
    let alert_messages = "";
    if(config_data.screensaver_limit < 1) {
      alert_messages = "離席時自動ログアウト時間(分)を1以上に設定してください。";
    }
    if(config_data.screensaver_form_limit < 1) {
      alert_messages = "離席再ログインフォーム表示時間(秒)を1以上に設定してください。";
    }
    if(config_data.error_mail_from !== undefined && config_data.error_mail_from.length > 256) {
      alert_messages = "エラーメール送信元（From）を256文字以下で入力してください。";
    }
    if(config_data.error_mail_to !== undefined && config_data.error_mail_to.length > 256) {
      alert_messages = "エラーメール送信先（To）を256文字以下で入力してください。";
    }
    if(config_data.error_mail_subject !== undefined && config_data.error_mail_subject.length > 100) {
      alert_messages = "エラーメール件名（Subject）を100文字以下で入力してください。";
    }
    if(config_data.in_hospital_meal_telegram_send_date_count < 1){
      alert_messages = "入院時食事情報の初期送信日数を入力してください。";
    }
    if(config_data.change_meal_telegram_send_date_count < 1){
      alert_messages = "食事変更時の初期送信日数を入力してください。";
    }
    if(alert_messages === ""){
      this.setState({confirm_message: "設定を保存しますか？"});
    } else {
      this.setState({alert_messages});
    }
  };
  
  resetConfig = () => {
    this.getSearchResult();
  };
  
  setDate = (key, value) => {
    let config_data= this.state.config_data;
    config_data[key] = value;
    this.setState({config_data});
  }
  
  setIntNumberValue = (key,e) => {
    let config_data = this.state.config_data;
    let RegExp = /^[0-9０-９]*$/;
    if (e.target.value != '' && !RegExp.test(e.target.value)){
      config_data[key] = this.state.config_data[key];
    } else {
      config_data[key] = toHalfWidthOnlyNumber(e.target.value);
    }
    this.setState({config_data});
  }
  
  render() {
    let {table_data, config_data, disabled} = this.state;
    return (
      <Card>
        <div className="title">{this.cur_system == "haruka" ? "システム設定":"システム仕様変更"}</div>
        <div className={'table-area'}>
          <div className="div-header d-flex w-100">
            <div className={'div-title text-center'}>項目</div>
            <div className={'div-content text-center'}>値</div>
          </div>
          <div className="div-body">
            {this.state.load_flag ? (
              <>
                {config_data !== undefined && Object.keys(config_data).length > 0 && table_data !== undefined && table_data !== null && table_data.length > 0 && (
                  table_data.map((item, key) => {
                    return (
                      <>
                        <div key={key} className="w-100 d-flex">
                          <div className={'div-title'}>{item.title}</div>
                          <div className={'div-content'}>
                            {item.type=="radio" && Object.keys(item.type_array).map((index)=>{
                              return (
                                <>
                                  <Radiobox
                                    label={item.type_array[index]}
                                    value={index}
                                    getUsage={this.setValue.bind(this, item.name, item.type)}
                                    checked={config_data[item.name] == index ? true : false}
                                    name={item.name}
                                  />
                                </>
                              );
                            })}
                            {item.type==="selector" && (
                              <div className="search-box">
                                <SelectorWithLabel
                                  options={item.type_array}
                                  title=""
                                  getSelect={this.setValue.bind(this, item.name, item.type)}
                                  departmentEditCode={item.type_array.find(x=>x.value==config_data[item.name]) != undefined &&
                                  item.type_array.find(x=>x.value==config_data[item.name]).id}
                                />
                              </div>
                            )}
                            {item.type === "text" && (
                              <div className="div-input">
                                <InputWithLabel
                                  label=""
                                  type="text"
                                  diseaseEditData={config_data[item.name]}
                                  getInputText={this.setValue.bind(this,item.name, item.type)}
                                />
                              </div>
                            )}
                            {item.type === "numeric" && (
                              <div className="div-input">
                                <InputWithLabel
                                  label=""
                                  type="text"
                                  getInputText={this.setIntNumberValue.bind(this, item.name)}
                                  diseaseEditData={config_data[item.name]}
                                />
                              </div>
                            )}
                            {item.type === "time" && (
                              <div className='div-time'>
                                <DatePicker
                                  selected={config_data[item.name] instanceof Date ? config_data[item.name] : formatTimePicker(config_data[item.name])}
                                  onChange={this.setDate.bind(this,item.name)}
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={5}
                                  dateFormat="HH:mm"
                                  timeFormat="HH:mm"
                                  timeCaption="時間"
                                  popperPlacement="top"
                                />
                              </div>
                            )}
                            {item.type === "array" && item.value !== undefined && item.value != null && item.value.map((sub_item,sub_key)=>{
                              return (
                                <div key={sub_key}>
                                  <label className={this.cur_system == "haruka" ? "haruka-label": "dial-label"}>{sub_item.title}</label>
                                  {sub_item.type==="radio" && Object.keys(sub_item.type_array).map((index)=>{
                                    return (
                                      <>
                                        <Radiobox
                                          label={sub_item.type_array[index]}
                                          value={index}
                                          getUsage={this.setArrayValue.bind(this, item.name, sub_item.name)}
                                          checked={config_data[item.name][sub_item.name] == index ? true : false}
                                          name={sub_item.name}
                                        />
                                      </>
                                    );
                                  })}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </>
                    )
                  })
                )}
              </>
            ):(
              <div className='text-center' style={{width:"100%", height:"100%"}}>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            )}
          </div>
        </div>
        <div className="footer">
          <Button type="mono" onClick={this.resetConfig.bind(this)}>初期値</Button>
          <Button type="mono" onClick={this.saveConfig} className={!disabled?"disable-button" : ""}>設定を保存</Button>
        </div>
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.editData.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </Card>
    )
  }
}
SystemSetting.contextType = Context;

SystemSetting.propTypes = {
  history: PropTypes.object
};

export default SystemSetting