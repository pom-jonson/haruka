import React, { Component, useContext } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { faChevronUp, faChevronDown } from "@fortawesome/pro-solid-svg-icons";
import AddProgressHistory from "./AddProgressHistory";
import * as apiClient from "~/api/apiClient";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import {formatDateLine} from "~/helpers/date";
import * as methods from "~/components/templates/Dial/DialMethods";
import {displayLineBreak, compareTwoObjects} from "~/helpers/dialConstants"
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import axios from "axios/index";
import InputPanel from "./InputPanel";
import InputSoapPanel from "./InputSoapPanel";
import OverwriteConfirmModal from "./OverwriteConfirmModal";
import InputKartePanel from "~/components/templates/Dial/Board/molecules/InputKartePanel";
import Button from "~/components/atoms/Button";
import DialShowShemaModal from "~/components/templates/Patient/Modals/Common/DialShowShemaModal";
import renderHTML from 'react-render-html';
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
  margin-left:1rem;
`;
const Wrapper = styled.div`
  padding:10px 10px;
  // height: calc(100% - 40rem);
  height: 100%;
  .text-left{
      text-align:left;
  }
  .soap-content{
      overflow: hidden;
      padding: 2px;
      button{
          float: right;
      }
  }
  .text-right{
    text-align:right;
  }
  .text-center{
      text-align:center;
  }
  .half{
      width:50%;
  }
  .content{
    height: calc(100% - 48vh);
  }
  .title_area{
      margin-bottom:1rem;
      display:flex;
      font-size:
  }
  .add_area{
      display: flex;
    flex-wrap: wrap;
      position:absolute;
      right:4rem;
      font-size:1rem;
      cursor:pointer
  }
  .title{
      font-size:1.25rem;
  }
  .send_content{
      width:65%;
  }
  .label-title{
      width:6.25rem;
      font-size:1.25rem;
      text-align:right;
      margin-right:0.625rem;
  }
  .pullbox-select{
      width:12.5rem;
      font-size:1rem;
  }
  .select_date_range{
      display:flex;
      .pullbox{
          margin-right:1.25rem;
      }
      span{
          padding-top:0.5rem;
      }
  }
   .example-custom-input{
        font-size: 1rem;
        width:11.25rem;
        text-align:center;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
        border: 1px solid;
        margin-left:0.3rem;
        margin-right:0.3rem;
    }
    .table-monitor{
        height: calc( 100% - 5rem);
        table{
            display:block;
            height:100%;
        }
        thead{
            display:block;
            width:calc(100% - 17px);
            tr{
                display: table;
            }
        }
        tbody{
            display:block;
            overflow-y:scroll;
            height: calc( 100% - 2.5rem);
            width:100%;
        }
        tr{
            width:100%;
            display:table;
        }
        th{
            font-size:1rem;
            text-align:center;
            padding:0.3rem;
        }
        td{
            font-size:1rem;
            padding:0.25rem;
            vertical-align:middle;
            word-break:break-all;
            label{
                margin:0;
            }
            p{
                margin-bottom:0px;
            }
        }
        .time_col{
            width:5%;
        }
        .inputer_col{
            border-right-style:none;
            width:10rem;
        }
        .treat_col,.suso_col{
            width:41%;
        }
    }
    .footer{
        button{
            padding-left: 2.5rem;
            padding-right: 2.5rem;
        }
        button span{
            font-size:1rem;
        }
    }
.zoom-display{
    background: white;
    margin-top: -10rem;
    display: inline-block;
    width: 100%;
    .table-monitor {
        height: calc(100vh - 32rem);
    }
 }
`;


const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 77.5rem;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 5.25rem;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({ visible, x,  y,  parent, dr_kind, selected_treat_item}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  let conf_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data");
  let treatmonitor_drkarte_display = conf_data != undefined && conf_data.treatmonitor_drkarte_display != undefined ? conf_data.treatmonitor_drkarte_display : "ON";
  if (visible) {
    if (Array.isArray(selected_treat_item)){
      return (
        <ContextMenuUl>
          <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
            {$canDoAction(FEATURES.DIAL_DRKARTE,AUTHS.REGISTER,0) != false && treatmonitor_drkarte_display == "ON" && (
              <li><div onClick={() =>parent.addDrKarte(dr_kind)}>{dr_kind==0?'Drカルテ経過記事追加':'Drカルテ指示登録'}</div></li>
            )}
            <li><div onClick={() => parent.contextMenuAction(selected_treat_item,"edit")}>編集</div></li>
            <li><div onClick={() => parent.contextMenuAction(selected_treat_item, "delete")}>削除</div></li>
            <li><div onClick={() => parent.showSendingModal(selected_treat_item)}>次回の申し送りに登録</div></li>
            <li><div onClick={() => parent.showDrProposalModal(selected_treat_item)}>Dr上申に追加</div></li>
          </ul>
        </ContextMenuUl>
      );
    } else {
      return (
        <ContextMenuUl>
          <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
            {$canDoAction(FEATURES.DIAL_DRKARTE,AUTHS.REGISTER,0) != false &&  treatmonitor_drkarte_display == "ON" && (
              <li><div onClick={() =>parent.addDrKarte(dr_kind)}>{dr_kind==0?'Drカルテ経過記事追加':'Drカルテ指示登録'}</div></li>
            )}
            <li><div onClick={() => parent.showSendingModal(selected_treat_item)}>次回の申し送りに登録</div></li>
            <li><div onClick={() => parent.showDrProposalModal(selected_treat_item)}>Dr上申に追加</div></li>
          </ul>
        </ContextMenuUl>
      );
    }
  } else {
    return null;
  }
};
// const content = '関東病院:耳鼻咽喉科-左耳がよく聞こえません。急いで治療対策が必要です。';

class TreatMonitor extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    
    this.state = {
      see_doctor_flag:0,
      display_zoom:1,
      isOpenProgressModal:false,
      isInputKartePanelModal:false,
      treat_monitor_list:[],
      system_patient_id: 0,
      patientInfo:patientInfo!=undefined && patientInfo!=null ? patientInfo:{},
      schedule_date: schedule_date!=undefined && schedule_date != null ? schedule_date: new Date(),
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isShowSendingModal:false,
      isDrProposalModal:false,
      isOverwriteConfirmModal:false,
      isInputSoapPanelModal:false,
      confirm_message:"",
      alert_title:'',
      alert_messages:'',
      isOpenShemaModal: false,
      imgBase64: null,
      image_comment: ""
    }
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.prev_props = JSON.parse(JSON.stringify(this.props));
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    if(this.state.system_patient_id != nextProps.patientInfo.system_patient_id || this.state.schedule_date != nextProps.schedule_date){
      this.setState({
        patientInfo: nextProps.patientInfo,
        system_patient_id:nextProps.patientInfo.system_patient_id,
        schedule_date:nextProps.schedule_date,
      }, () => {
        this.getSoapInfo();
      });
    } else if(nextProps.patientInfo.system_patient_id === undefined){
      this.setState({
        treat_monitor_list:[],
      })
    }
  }

  shouldComponentUpdate(nextprops, nextstate) {    
    nextprops = JSON.parse(JSON.stringify(nextprops));    
    if (compareTwoObjects(nextprops, this.prev_props) && compareTwoObjects(nextstate, this.state)) return false;
    this.prev_props = JSON.parse(JSON.stringify(nextprops));        
    return true;
  }
  
  async componentDidMount () {
    // let server_time = await getServerTime();
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    await this.getDoctors();
    await this.getStaffs();
    await this.getSoapInfo();
    this.setState({schedule_date: schedule_date!=undefined && schedule_date != null ? schedule_date: new Date()});
  }

  componentWillUnmount() {    

    // initialize
    this.authInfo = null;
  }
  
  getSoapInfo = async() => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined){
      return;
    }
    let path = "/app/api/v2/dial/board/Soap/search";
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo === undefined || authInfo == null) path = "/app/api/v2/dial/no_auth/Soap/search";
    let date = this.state.schedule_date;
    await apiClient
      ._post(path, {
        params: {
          is_enabled:1,
          system_patient_id: this.state.patientInfo.system_patient_id,
          date: date != undefined && date != null && date != ''?formatDateLine(date):formatDateLine(new Date()),
        }
      })
      .then((res) => {
        this.setState({treat_monitor_list:res});
      })
      .catch(() => {
      
      });
  }
  
  checkSO = (category_2) => {
    if((category_2 =='S') || (category_2 =="O") || (category_2 =="A")){
      return true;
    } else {
      return false;
    }
  }
  
  displayZoom = () => {
    this.props.moreDisplay();
    let zoom = 0;
    if(this.state.display_zoom == zoom){
      zoom = 1;
    }
    this.setState({display_zoom: zoom});
  };
  
  setZoom = () => {
    let zoom = 0;
    if(this.state.display_zoom == zoom){
      zoom = 1;
    }
    this.setState({display_zoom: zoom});
  }
  
  OpenProgressModal = () => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined){
      window.sessionStorage.setItem("alert_messages", '患者様を選択してください。');
      return;
    }
    if (this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.S) ||
      this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.A) ||
      this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.O) ||
      this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.P) ||
      this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.INSTRUCTION) ||
      this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.CURRENT_DISEASE) ||
      this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.TEMP_PRESCRIPTION) ||
      this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.TEMP_INJECTION) ||
      this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.TEMP_INSPECTION) ||
      this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.REG_PRESCRIPTION) ||
      this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.REG_INJECTION)
    ) {
      this .setState({isOpenProgressModal:true});
    } else {
      window.sessionStorage.setItem("alert_messages", '権限がありません。');
    }
  };
  
  closeModal = () => {
    this.setState({
      isOpenProgressModal: false,
      isInputPanelModal: false,
      isInputSoapPanelModal:false,
      isShowSendingModal:false,
      isDrProposalModal:false,
      isOverwriteConfirmModal:false,
      isInputKartePanelModal:false,
      alert_title:'',
      alert_messages:''
    }, ()=>{
      this.getSoapInfo();
    });
  };
  
  handleOk = async(param = null) => {
    await this.closeModal();
    this.props.refreshScheduleInfo(this.props.patientInfo.system_patient_id, this.props.schedule_date);
    if (param == 1){
      this.setState({
        alert_messages:'臨時注射を変更しました。',
        alert_title:'登録確認'
      })
    } 
    if (param == 0) {
      this.setState({
        alert_messages:'定期注射を変更しました。',
        alert_title:'登録確認'
      })
    }
  };
  
  handleKarteOk = () => {
    this.closeModal();
    this.props.refreshScheduleInfo(this.props.patientInfo.system_patient_id, this.props.schedule_date);
  }
  
  handleSOAPOk = async() => {
    await this.closeModal();
    this.props.getCurDiseaseInfo();
  };
  
  handleClick = (e, item, dr_kind) => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("treat_monitor-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("treat_monitor-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      
      let clientY = e.clientY;
      let clientX = e.clientX;
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
          dr_kind,
        },
        selected_treat_item: item
      }, ()=>{
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        let window_height = window.innerHeight;
        if (clientY + menu_height > window_height) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX,
              y: clientY - menu_height,
              dr_kind,
            },
            selected_treat_item: item
          })
        }
      });
    }
  };
  
  contextMenuAction = (selected_treat_item, type) => {
    if (type === "edit"){
      this.editData(selected_treat_item);
    }
    if (type === "delete"){
      var new_items = [];
      selected_treat_item.map(sub_item => {
        new_items.push(sub_item.value);
      })
      this.setState({
        item:new_items,
      }, () => {
        this.delete();
      })
    }
  };
  
  addDrKarte(dr_kind){
    this.setState({
      isInputKartePanelModal:true,
      dr_kind:dr_kind==0?'Drカルテ/経過':'Drカルテ/指示'
    })
  }
  
  showSendingModal(selected_treat_item) {
    var selected_item = [];
    if (Array.isArray(selected_treat_item)){
      selected_treat_item.map(sub_item => {
        selected_item.push(sub_item.value);
      })
    }
    if (selected_item.length > 0){
      if (selected_item[0].source == '次回申し送り'){
        this.setState({
          isOverwriteConfirmModal:true,
          overwrite_kind:1,
        });
      } else {
        if (selected_item[0].export_destination == '次回申し送り'){
          this.setState({
            isOverwriteConfirmModal:true,
            overwrite_kind:0,
          });
        } else {
          this.new_create();
        }
      }
    } else {
      if (selected_treat_item.source == '次回申し送り'){
        this.setState({
          isOverwriteConfirmModal:true,
          overwrite_kind:1,
        })
      } else{
        if (selected_treat_item.export_destination == '次回申し送り'){
          this.setState({
            isOverwriteConfirmModal:true,
            overwrite_kind:0,
          });
        } else {
          this.new_create();
        }
      }
    }
  }
  
  new_create = async () => {
    var selected_treat_item = this.state.selected_treat_item;
    var body = '';
    var source = '処置モニター';
    var handover_relation = '';
    if (Array.isArray(selected_treat_item)){
      var selected_item = [];
      selected_treat_item.map(sub_item => {
        selected_item.push(sub_item.value);
      });
      selected_item.map(item=>{
        body += item.body+'\n';
        handover_relation = item.relation;
      });
    } else {
      if (selected_treat_item.value.body != undefined && selected_treat_item.value.body != null && selected_treat_item.value.body != ''){
        body = selected_treat_item.value.body;
      }
      if (selected_treat_item.value.body != undefined && selected_treat_item.value.body_2 != null && selected_treat_item.value.body_2 != ''){
        body = body ==''? selected_treat_item.value.body_2:body + '\n' + selected_treat_item.value.body_2;
      }
      handover_relation = selected_treat_item.value.number;
    }
    let data = {
      patient_id: this.state.patientInfo.system_patient_id,
      category: '次回申し送り',
      message: body,
      source : source,
      relation: handover_relation,
    };
    let path = "/app/api/v2/dial/board/sendingDataRegister";
    await apiClient.post(path, {
      params: data
    }).then(() => {
      this.closeModal();
      window.sessionStorage.setItem("alert_messages","登録完了##" +  '次回申し送りを登録しました。');
    }).catch(() => {
    });
  }
  
  re_edit = () => {
    var selected_treat_item = this.state.selected_treat_item;
    var body = '';
    var source = '処置モニター';
    var handover_relation = '';
    var number = 0;
    if (Array.isArray(selected_treat_item)){
      var selected_item = [];
      selected_treat_item.map(sub_item => {
        selected_item.push(sub_item.value);
      });
      selected_item.map(item=>{
        body += item.body+'\n';
        handover_relation = item.relation;
        number = item.export_relation;
      })
    } else {
      if (selected_treat_item.value.body != undefined && selected_treat_item.value.body != null && selected_treat_item.value.body != ''){
        body = selected_treat_item.value.body;
      }
      if (selected_treat_item.value.body != undefined && selected_treat_item.value.body_2 != null && selected_treat_item.value.body_2 != ''){
        body = body ==''? selected_treat_item.value.body_2:body + '\n' + selected_treat_item.value.body_2;
      }
      handover_relation = selected_treat_item.value.number;
      number = selected_treat_item.value.export_relation;
    }
    this.setState({
      isShowSendingModal:true,
      item:{message:body, number:number},
      source,
      handover_relation,
    });
  }
  
  overwrite = async () => {
    var selected_treat_item = this.state.selected_treat_item;
    var body = '';
    var source = '処置モニター';
    var handover_relation = '';
    var number = 0;
    if (Array.isArray(selected_treat_item)){
      var selected_item = [];
      selected_treat_item.map(sub_item => {
        selected_item.push(sub_item.value);
      })
      selected_item.map(item=>{
        body += item.body+'\n';
        handover_relation = item.relation;
        number = item.export_relation;
      })
    } else {
      if (selected_treat_item.value.body != undefined && selected_treat_item.value.body != null && selected_treat_item.value.body != ''){
        body = selected_treat_item.value.body;
      }
      if (selected_treat_item.value.body != undefined && selected_treat_item.value.body_2 != null && selected_treat_item.value.body_2 != ''){
        body = body ==''? selected_treat_item.value.body_2:body + '\n' + selected_treat_item.value.body_2;
      }
      handover_relation = selected_treat_item.value.number;
      number = selected_treat_item.value.export_relation;
    }
    let data = {
      number:number,
      patient_id: this.state.patientInfo.system_patient_id,
      category: '次回申し送り',
      message: body,
      source : source,
      relation: handover_relation,
    };
    
    let path = "/app/api/v2/dial/board/sendingDataRegister";
    await apiClient.post(path, {
      params: data
    }).then(() => {
      this.closeModal();
      window.sessionStorage.setItem("alert_messages","登録完了##" +  '次回申し送りを登録しました。');
    }).catch(() => {
    });
  }
  
  showDrProposalModal(selected_treat_item){
    var body = "";
    var source = '処置モニター';
    var handover_relation = '';
    if (Array.isArray(selected_treat_item)){
      var selected_item = [];
      selected_treat_item.map(sub_item => {
        selected_item.push(sub_item.value);
      });
      selected_item.map(item=>{
        body += item.body+'\n';
        handover_relation = item.realtion;
      })
    } else {
      if (selected_treat_item.value.body != undefined && selected_treat_item.value.body != null && selected_treat_item.value.body != ''){
        body = selected_treat_item.value.body;
      }
      if (selected_treat_item.value.body != undefined && selected_treat_item.value.body_2 != null && selected_treat_item.value.body_2 != ''){
        body = body ==''? selected_treat_item.value.body_2:body + '\n' + selected_treat_item.value.body_2;
      }
      handover_relation = selected_treat_item.value.number;
    }
    this.setState({
      isDrProposalModal:true,
      item:{message:body, number:0},
      source,
      handover_relation,
    })
  }
  
  editData = (selected_treat_item) => {
    var new_items = [];
    selected_treat_item.map(sub_item => {
      new_items.push(sub_item.value);
    })
    this.setState({
      isInputSoapPanelModal:true,
      selected_soap_kind: selected_treat_item[0].value.category_2,
      item:new_items,
    })
  };
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }
  
  deleteData = async () => {
    let path = "/app/api/v2/dial/board/Soap/delete";
    let post_data = {
      params: {
        system_patient_id: this.state.patientInfo.system_patient_id,
        item:this.state.item
      }
    };
    await axios.post(path,  post_data);
    this.confirmCancel();
    window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
    this.getSoapInfo();
  };
  
  delete = () => {
    let item = this.state.item;
    if (item != null){
      this.setState({
        isDeleteConfirmModal : true,
        confirm_message:"この項目を削除して良いですか？",
      });
    }
  };
  
  openShema = async (item) => {
    if(this.authInfo === undefined || this.authInfo == null) {this.props.openLoginModal(); return;}
    if(item == null || item == undefined || item.number < 1) return;
    let path = "/app/api/v2/dial/board/Soap/get_image_by_number";
    await apiClient
      ._post(path, {
        params: {
          number: item.number,
        },
      })
      .then((res) => {
        if (res) {
          this.setState({
            isOpenShemaModal: true,
            imgBase64: res,
            image_comment: item.image_comment
          });
        }
      })
      .catch(() => {});
  }
  
  closeShemaModal = () => {
    this.setState({
      isOpenShemaModal: false,
      imgBase64: null,
      image_comment: ""
    });
  }
  
  render() {    
    let {treat_monitor_list, doctor_list_by_number, staff_list_by_number} = this.state;
    return (
      <Wrapper>
        {/*<div className={this.state.display_zoom == 1 ? "content" : "zoom-display"}>*/}
        <div className="content">
          <div className="title_area continue_sending_title_area">
            <div className = "continue_sending_title title">処置モニタ</div>
            <div className = "continue_sending_add add_area">
              <div onClick={ this.OpenProgressModal }><Icon icon={faPlus} />経過記録を追加</div>
              <div onClick={this.displayZoom}>
                { this.state.display_zoom != 1 ? (
                  <>
                    <Icon icon={faChevronUp} />
                    表示を拡大
                  </>
                ) : (
                  <>
                    <Icon icon={faChevronDown} />
                    表示を縮小
                  </>
                )
                }
              </div>
            </div>
          </div>
          {/*{ this.state.display_zoom == 1 ? (*/}
          <div className="table-monitor" id={'treat-table-monitor'}>
            <table className="table-scroll table table-bordered" id="treat_monitor-table">
              <thead>
              <tr>
                <th className="time_col">時間</th>
                <th className="suso_col">経過</th>
                <th className='treat_col'>処置</th>
                {/* <th className='instructor_col'>指示者</th> */}
                <th className='inputer_col'>入力者</th>
              </tr>
              </thead>
              <tbody>
              {treat_monitor_list !==undefined && treat_monitor_list != [] && doctor_list_by_number != undefined && staff_list_by_number != undefined &&(
                Object.keys(treat_monitor_list).map((key) => {
                  var item = treat_monitor_list[key];
                  var soap_left_body = '';
                  var soap_right_body = '';
                  if (Array.isArray(item)){
                    if (item[0].type.includes('soap')){
                      return(
                        <>
                          <tr>
                            <td className="text-center time_col">{item[0].value.write_date_time}</td>
                            <td className='suso_col' onContextMenu={e => this.handleClick(e, item, 0)}>
                              {item.map((sub_item, sub_index) => {
                                if (this.checkSO(sub_item.value.category_2)) {
                                  soap_left_body = '(' + sub_item.value.category_2 + ')' + sub_item.value.body;
                                  return(
                                    <div className="soap-content" key={sub_index}>
                                      {(renderHTML(soap_left_body))}
                                      {sub_item.value.image_path != null &&
                                      sub_item.value.image_path != "" &&
                                      this.checkSO(sub_item.value.category_2) && (
                                        <Button
                                          onClick={() => this.openShema(sub_item.value)}
                                        >
                                          シェーマを見る
                                        </Button>
                                      )}
                                    </div>
                                  );
                                }
                                // if (this.checkSO(sub_item.value.category_2)) soap_left_body = sub_item.value.body;
                              })}
                            </td>
                            <td className='treat_col' onContextMenu={e => this.handleClick(e, item, 1)}>
                              {item.map((sub_item, sub_index) => {
                                if (!this.checkSO(sub_item.value.category_2)){
                                  soap_right_body = '(' + sub_item.value.category_2 + ')' +  sub_item.value.body;
                                  return(
                                    <div className="soap-content" key={sub_index}>
                                      {(renderHTML(soap_right_body))}
                                      {sub_item.value.image_path != null &&
                                      sub_item.value.image_path != "" &&
                                      !this.checkSO(sub_item.value.category_2) && (
                                        <Button
                                          onClick={() => this.openShema(sub_item.value)}
                                        >
                                          シェーマを見る
                                        </Button>
                                      )}
                                    </div>
                                  );
                                }
                                // if (!this.checkSO(sub_item.value.category_2)) soap_right_body = sub_item.value.body;
                              })}
                            </td>
                            {/*{item.map((sub_item, sub_index) => {
                                                                if (this.checkSO(sub_item.value.category_2)) soap_left_body += sub_item.value.body +'\n';
                                                                if (!this.checkSO(sub_item.value.category_2)) soap_right_body += sub_item.value.body +'\n';
                                                                
                                                                if (sub_index == item.length-1){
                                                                    return(
                                                                    <>
                                                                        <td className='suso_col' onContextMenu={e => this.handleClick(e, item, 0)}>{displayLineBreak(soap_left_body)}</td>
                                                                        <td className='suso_col' onContextMenu={e => this.handleClick(e, item, 1)}>{displayLineBreak(soap_right_body)}</td>
                                                                    </>
                                                                    )
                                                                }
                                                            })}*/}
                            {/* <td>{(item[0].value.instruction_doctor_number != null) ? doctor_list_by_number[item[0].value.instruction_doctor_number]: ""}</td> */}
                            <td className='inputer_col text-center'>{item[0].value.updated_by !== null?staff_list_by_number[item[0].value.updated_by]: ""}</td>
                          </tr>
                        </>
                      )
                    }
                  } else {
                    if (item.value.category_1!='Drカルテ'){
                      return (
                        <>
                          <tr>
                            <td className="text-center time_col">{item.value.write_date_time}</td>
                            {item.type.toString().includes('op_alarm') && (
                              <>
                                <td className='suso_col' onContextMenu={e => this.handleClick(e, item, 0)}>
                                  {item.value.category_1 =='操作履歴'? displayLineBreak(item.value.body_2):displayLineBreak(item.value.body)}
                                </td>
                                <td className='suso_col' onContextMenu={e => this.handleClick(e, item, 1)}>
                                  {item.value.category_1 =='操作履歴'?displayLineBreak(item.value.body):displayLineBreak(item.value.body_2)}
                                </td>
                              </>
                            )}
                            {!item.type.toString().includes('op_alarm') && (
                              <>
                                {/* <td className="">{item.value.category_2=='経過'?displayLineBreak(item.value.body):''}</td> */}
                                <td className='suso_col'></td>
                                <td className='treat_col'>{item.value.category_2!='経過'?displayLineBreak((item.value.body)):''}</td>
                              </>
                            )}
                            {/* <td>{item.value.instruction_doctor_number !== null ? doctor_list_by_number[item.value.instruction_doctor_number]: ""}</td> */}
                            <td className='inputer_col text-center'>{item.value.updated_by !== null?staff_list_by_number[item.value.updated_by]: ""}</td>
                          </tr>
                        </>
                      )
                    }
                  }
                })
              )}
              </tbody>
            </table>
          </div>
        </div>
        {(this.state.isOpenProgressModal && (
          <AddProgressHistory
            handleOk={this.handleOk}
            handleSOAPOk = {this.handleSOAPOk}
            closeModal={this.closeModal}
            schedule_date={this.props.schedule_date}
            patientInfo={this.props.patientInfo}
          />
        ))}
        {this.state.isDeleteConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.deleteData.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isInputPanelModal && (
          <InputPanel
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            kind={this.state.selected_soap_kind}
            patient_id = {this.state.patientInfo.system_patient_id}
            schedule_date={this.state.schedule_date}
            item={this.state.item}
          />
        )}
        {this.state.isInputSoapPanelModal && (
          <InputSoapPanel
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            kind={this.state.selected_soap_kind}
            patient_id = {this.state.patientInfo.system_patient_id}
            schedule_date={this.state.schedule_date}
            item={this.state.item}
          />
        )}
        {this.state.isShowSendingModal && (
          <InputPanel
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            kind='申し送り/次回'
            patient_id = {this.state.patientInfo.system_patient_id}
            schedule_date={this.state.schedule_date}
            item={this.state.item}
            source = {this.state.source}
            handover_relation = {this.state.handover_relation}
          />
        )}
        {this.state.isDrProposalModal && (
          <InputPanel
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            kind='Dr上申'
            patient_id = {this.state.patientInfo.system_patient_id}
            schedule_date={this.state.schedule_date}
            item={this.state.item}
            source = {this.state.source}
            handover_relation = {this.state.handover_relation}
          />
        )}
        {this.state.isOverwriteConfirmModal && (
          <OverwriteConfirmModal
            closeModal = {this.closeModal}
            re_edit = {this.re_edit}
            overwrite = {this.overwrite}
            create = {this.new_create}
            kind = {this.state.overwrite_kind}
          />
        
        )}
        {this.state.isInputKartePanelModal && (
          <InputKartePanel
            handleOk={this.handleKarteOk}
            closeModal={this.closeModal}
            kind={this.state.dr_kind}
            patient_id = {this.state.patientInfo.system_patient_id}
            patientInfo = {this.state.patientInfo}
            schedule_date = {this.state.schedule_date}
          />
        )}
        {this.state.isOpenShemaModal === true && (
          <DialShowShemaModal
            closeModal={this.closeShemaModal}
            imgBase64={this.state.imgBase64}
            image_comment={this.state.image_comment}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title = {this.state.alert_title}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          selected_treat_item={this.state.selected_treat_item}
        />
      </Wrapper>
    )
  }
}

TreatMonitor.contextType = Context;
TreatMonitor.propTypes = {
  patientInfo: PropTypes.object,
  schedule_date:PropTypes.instanceOf(Date),
  refreshScheduleInfo:PropTypes.func,
  getCurDiseaseInfo:PropTypes.func,
  openLoginModal:PropTypes.func,
  moreDisplay:PropTypes.func,
};
export default TreatMonitor