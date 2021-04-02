import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/pro-solid-svg-icons";
import SearchBar from "~/components/molecules/SearchBar"
import * as sessApi from "~/helpers/cacheSession-utils";
import SelectPatientListModal from "./modals/SelectPatientListModal"
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {Dial_tab_index, makeList_code} from "~/helpers/dialConstants";
import {formatDateLine} from "~/helpers/date";
import SetSortPatientListModal from "./SetSortPatientListModal";
import * as localApi from "~/helpers/cacheLocal-utils";

const Icon = styled(FontAwesomeIcon)`
  color: white;
  font-size: 26px;
  margin-right: 5px;
  cursor: pointer;
`;

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: 200px;
  margin: 0px;
  height: 100vh;
  float: left;
  background: rgb(63,16,64);
  z-index:100;
.title {
  font-size: 1.25rem;
  color : white;
  font-weight: bolder;
  padding: 1.5rem 0.5rem;
  background: rgb(43,0,44);
  text-align: center;
}
.patient-item {
  font-size: 0.85rem;
  text-align: left;
  margin-top: 0.3rem;
  color: rgb(248, 250,252)! important;
  padding: 0 10px;
  display: flex;
  cursor: pointer;
}

.patient-name {
  width: 60%;
  text-align:left;
  word-break: break-all;
}
.patient-id {
  width: 40%;
  word-break: break-all;
  padding-right: 0.4rem;
  text-align: left;
}
.patient-list {
    .patient-item:nth-child(odd) {background-color: rgb(77, 43, 77);}
    padding-top: 0.7rem;
    overflow-y: auto;
    // overflow-x: hidden;
    height: calc(100vh - 17.5rem);
}
 p{
    margin: 0;
 }
 .list-title {
    display: flex;
    color: white;
    margin-left:15px;
    margin-right:7px;
 }
 .footer {
  color: white;
  text-align: center;
  .flex-title {
    display: flex;
    margin-bottom: 0.2rem;
  }
  .border {
      width: 33%;
      font-size: 0.9rem;
      border: solid 1px #744e74 !important;
  }
 }
 .ptm-2 {
    padding: 0.9rem 0;
 }
 .patient-item::-webkit-scrollbar-thumb {
  background-color: rgb(43,0,44);
  outline: 1px solid slategrey;
}
.search_patient{
    display:flex;
    svg {
      height: 2.3rem;
      line-height: 2.3rem;
      margin-right:0.3rem;
      top:0;
    }
    div {
      height: 2.3rem;
    }
    .search-box{
      width: calc(100% - 0.9rem);
      input{
      }
      input{
        width: 100%;
        background: wheat;
        height: 2.3rem;
        margin-left: 0.1rem;
      }
    }
}
.click{
    cursor:pointer;
}
.patient-item:hover{
  background:#9d7b9d!important;
}
.patient-item.selected{
  background: darkcyan!important;
}
`;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 300;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: normal;
    line-height: 1.2rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    border-bottom: 1px solid #cfcbcb;
    div {
      padding: 0.75rem;
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

const ContextMenu = ({visible, x, y,parent,  system_patient_id}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.onPatientClick(system_patient_id)}>この患者様を選択</div></li>
          <li><div onClick={() => parent.move_to_doctor_karte(system_patient_id)}>Drカルテに移動</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class DialSideBar extends Component {
  constructor(props) {
    super(props);
    let patientInfo = sessApi.getObjectValue("dial_setting","patient");
    let system_patient_id = sessApi.getObjectValue("dial_setting","patientById");
    let sort_type = sessApi.getObjectValue("dial_setting","patient_list_sort_type");
    this.state = {
      patientList: [],
      schVal:'',
      selected_id:patientInfo != undefined && patientInfo != null && patientInfo.system_patient_id>0?patientInfo.system_patient_id:(system_patient_id > 0 ? system_patient_id : 0),
      isOpenSearchPatientListModal:false,
      confirm_message:'',
      openSetSortModal:false,
      sort_type:(sort_type !== undefined && sort_type != null) ? sort_type : "kana_name", //default: kana_name
    }
    
    if (patientInfo != undefined && patientInfo != null && this.props.onGoto != undefined){
      this.props.onGoto(patientInfo);
    }
    if (patientInfo != undefined && patientInfo != null){
      sessApi.setObjectValue("dial_setting","patientById", patientInfo.system_patient_id);
    }
    if (patientInfo == undefined || patientInfo == null || !(patientInfo.system_patient_id > 0)){
      if (system_patient_id > 0) this.getPatientDetail(system_patient_id);
    }
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    this.dial_group = makeList_code(code_master['グループ']),
      
      this.change_dial_delete = null;
    this.select_patient_flag == null;
    this.current_dial_code = null;
  }
  
  async componentDidMount(){
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    this.setState({current_patient_context: current_system_patient_id});
    this.getPatientList();
  }
  
  move_to_doctor_karte = (system_patient_id) => {
    var confirm_message = '';
    var confirm_type = '';
    var dial_change_flag = sessApi.getObjectValue('dial_change_flag');
    // if (dial_change_flag !== undefined && dial_change_flag != null && this.change_dial_delete == null) return;
    if(this.change_dial_delete == null && dial_change_flag !== undefined && dial_change_flag != null){
      confirm_message = "登録していない内容があります。\n変更内容を破棄して移動しますか？";
      confirm_type = "change_dial_page";
    }
    if (confirm_message != ''){
      this.setState({
        confirm_message,
        confirm_type,
        go_func:"move_to_doctor_karte",
        func_param:system_patient_id,
        
      });
      return;
    } else {
      this.change_dial_delete = null;
    }
    
    var url = "/dial/board/system_setting";
    var date = sessApi.getObjectValue('for_left_sidebar', 'date');
    if (date == undefined || date == null || date == '') date = formatDateLine(new Date());
    
    sessApi.setObjectValue("from_print", "schedule_date", date);
    sessApi.setObjectValue("from_print", "system_patient_id", system_patient_id);
    sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.DRMedicalRecord);
    sessApi.remove('for_left_sidebar');
    setTimeout(()=>{
      this.props.history.replace(url);
    }, 500);
  }
  
  getPatientList = async (params, _from=null) => {
    // _from =>
    // DN78 透析患者表印刷の修正
    // ②左サイドバーの検索条件とソート条件（ID順とカナ順のみ。グループ順選択時はデフォルトのID順）を反映するように。
    
    let patientById = sessApi.getObjectValue("dial_setting","patientById");
    this.setState({
      isOpenSearchPatientListModal: false
    });
    
    if (params == null || params == undefined || params == "") {
      params = sessApi.getObjectValue("dial_setting","condition");
      if (params == null || params == undefined || params == "") {
        params = {
          // search_by_patient: 1,
          search_by_patient: 0,
          search_by_day: 0,
          search_by_time: 0,
          search_by_name_letter: 0,
          curCommonCode: 0,
        }
      }
    }
    let path = "/app/api/v2/dial/patient/list_condition";
    var post_data = {
      keyword:this.state.schVal,
      sort_order:this.state.sort_type,
      condition: params
    }
    // DN78 透析患者表印刷の修正
    // ②左サイドバーの検索条件とソート条件（ID順とカナ順のみ。グループ順選択時はデフォルトのID順）を反映するように。
    if (_from == "patient_ledger" && this.state.sort_type == "dial_group") {
      post_data.sort_order = "patient_number";
    }
    const { data } = await axios.post(path, {param:post_data});
    
    // DN78 透析患者表印刷の修正
    // ②左サイドバーの検索条件とソート条件（ID順とカナ順のみ。グループ順選択時はデフォルトのID順）を反映するように。
    if (_from == "patient_ledger") {
      return data != undefined && data !=null ? data : [];
    }
    if(data != undefined && data !=null){
      this.setState({
        patientList:data
      });
    } else {
      this.setState({
        patientList:[]
      });
    }
    
    
    if(patientById > 0){
      // var cur_page_path = window.location.href.split("/");
      // cur_page_path = cur_page_path[cur_page_path.length - 1];
      
      let change_patient_flag = sessApi.getObjectValue("dial_setting","change_patient_flag");
      if(change_patient_flag !== undefined && change_patient_flag != null && change_patient_flag === 1){
        sessApi.delObjectValue("dial_setting","change_patient_flag");
      } else {
        // if (cur_page_path == 'dial_patient') return;
      }
      // this.getPatientDetail(patientById);
    }
    return data
  };
  
  async getPatientDetail(system_patient_id, scroll_flag = false){
    let path = "/app/api/v2/dial/patient/getPatientDetail";
    var post_data = {'system_patient_id':system_patient_id};
    const { data } = await axios.post(path, {param:post_data});
    if (data != null ){
      var patient = data;
    } else {
      return;
    }
    sessApi.setObjectValue("dial_setting", "patient", patient);
    sessApi.setObjectValue("dial_setting","patientById", system_patient_id);
    
    this.setState({selected_id:system_patient_id});
    if (this.props.onGoto != undefined){
      this.props.onGoto(patient, scroll_flag);
    }
  }
  
  onPatientClick = async (patient_info) => {
    var confirm_message = '';
    var confirm_type = '';
    var cur_page_path = window.location.href.split("/");
    cur_page_path = cur_page_path[cur_page_path.length - 1];
    if (cur_page_path == 'dial_new_patient' && this.select_patient_flag == null){
      confirm_message = 'ID : ' + patient_info.patient_number + '  患者様氏名：' + patient_info.patient_name + '\n選択した患者様の透析患者マスタに移動しますか？';
      confirm_type = 'select_patient'
    }
    
    if (confirm_message != ''){
      this.setState({
        confirm_message,
        confirm_type,
        go_func:"onPatientClick",
        func_param:patient_info,
      });
      return;
    } else {
      this.select_patient_flag == null
    }
    
    
    var dial_change_flag = sessApi.getObjectValue('dial_change_flag');
    if (this.state.selected_id == patient_info.system_patient_id && dial_change_flag !== undefined && dial_change_flag != null && this.change_dial_delete == null) return;
    if(this.change_dial_delete == null && dial_change_flag !== undefined && dial_change_flag != null){
      confirm_message = "登録していない内容があります。\n変更内容を破棄して移動しますか？";
      confirm_type = "change_dial_page";
    }
    if (confirm_message != ''){
      this.setState({
        confirm_message,
        confirm_type,
        go_func:"onPatientClick",
        func_param:patient_info,
      });
      return;
    } else {
      this.change_dial_delete = null;
    }
    
    this.setState({selected_id:patient_info.system_patient_id});
    localApi.setValue("current_system_patient_id", patient_info.system_patient_id);
    await this.getPatientDetail(patient_info.system_patient_id, true);
    if (cur_page_path == 'dial_new_patient'){
      this.props.history.replace('/dial/dial_patient');
      // setTimeout(() => {
      //   this.props.history.replace('/dial/dial_patient');
      // }, 500);
    }
  };
  
  confirmCancel = () =>{
    this.setState({
      confirm_message:'',
    })
  }
  
  confirmOk = () => {
    this.confirmCancel();
    if (this.state.confirm_type == 'change_dial_page'){
      this.change_dial_delete = null;
      sessApi.remove('dial_change_flag');
      if (this.state.go_func == 'onPatientClick'){
        this.onPatientClick(this.state.func_param);
      }
      if (this.state.go_func == 'move_to_doctor_karte'){
        this.move_to_doctor_karte(this.state.func_param);
      }
    }
    if (this.state.confirm_type == 'select_patient'){
      this.select_patient_flag = true;
      if (this.state.go_func == 'onPatientClick'){
        this.onPatientClick(this.state.func_param);
      }
    }
  }
  
  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.getPatientList();
    }
  };
  search = word => {
    word = word.toString().trim();
    this.setState({ schVal: word });
  };
  getAllPatients = () => {
    sessApi.delObjectValue("dial_setting","condition");
    this.setState({schVal:''}, () => {
      this.getPatientList();
    });
  }
  
  setSortModal=()=>{
    this.setState({openSetSortModal:true});
  };
  
  sortByName = (type) => {
    // sessApi.setObjectValue("dial_setting","order", !this.state.sort_order);
    sessApi.setObjectValue("dial_setting","patient_list_sort_type", type);
    this.setState({
      sort_type:type,
      openSetSortModal:false,
    }, () => {
      this.getPatientList();
    })
  }
  handleSearchPatientByCondition = () => {
    this.setState({
      isOpenSearchPatientListModal: true
    });
  }
  
  closeModal = () => {
    this.setState({
      isOpenSearchPatientListModal: false,
      openSetSortModal: false
    });
  }
  
  handleClick = (e, system_patient_id) => {
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    var that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextMenu: { visible: false } }, ()=>{
      });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({contextMenu: { visible: false }}, ()=>{
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("patient-list")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false },
        }, ()=>{
        });
        document
          .getElementById("patient-list")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    
    this.setState({
      contextMenu: {
        visible: true,
        x: e.clientX,
        y: e.clientY + window.pageYOffset,
        system_patient_id:system_patient_id},
    })
  }
  
  render() {
    let patientList = [];
    if(this.state.patientList != undefined && this.state.patientList !=null){
      patientList = this.state.patientList;
    }
    if(patientList.length > 0 && this.state.sort_type === "dial_group"){
      let no_group_list = [];
      let has_group_list = [];
      patientList.map(patient=>{
        if(this.dial_group[patient.dial_group] === undefined){
          no_group_list.push(patient);
        } else {
          has_group_list.push(patient);
        }
      });
      patientList = [];
      patientList = has_group_list.concat(no_group_list);
    }
    return (
      <Card>
        <div className="title">透析支援システム</div>
        <div className="list-title ptm-2">
          <p className="patient-name">患者一覧</p>
          <p className="patient-id">{this.state.patientList.length}名</p>
        </div>
        <div className="patient-list" id = 'patient-list'>
          {patientList.length > 0 &&
          patientList.map((patient, index) => {
            if(this.state.sort_type === "dial_group"){
              let view_group_name_flag = false;
              if(this.current_dial_code != patient.dial_group){
                view_group_name_flag = true;
                this.current_dial_code = patient.dial_group;
              } else {
                view_group_name_flag = false;
              }
              return (
                <>
                  {view_group_name_flag && (
                    <>
                      <div style={{paddingLeft:"5px", color:"white"}}>{this.dial_group[this.current_dial_code] !== undefined ? this.dial_group[this.current_dial_code] : "グループなし"}</div>
                    </>
                  )}
                  <div
                    className={"patient-item patientId-" + patient.system_patient_id + (this.state.selected_id == patient.system_patient_id ? " selected":"")}
                    key={index}
                    patient-id={patient.system_patient_id}
                    onClick={()=>this.onPatientClick(patient)}
                    onContextMenu={e => this.handleClick(e, patient.system_patient_id)}
                  >
                    <p className="patient-id">{patient.patient_number}</p>
                    <p className="patient-name">{patient.patient_name}</p>
                  </div>
                </>
              )
            } else {
              return (
                <div
                  className={"patient-item patientId-" + patient.system_patient_id + (this.state.selected_id == patient.system_patient_id ? " selected":"")}
                  key={index}
                  patient-id={patient.system_patient_id}
                  onClick={()=>this.onPatientClick(patient)}
                  onContextMenu={e => this.handleClick(e, patient.system_patient_id)}
                >
                  <p className="patient-id">{patient.patient_number}</p>
                  <p className="patient-name">{patient.patient_name}</p>
                </div>
              )
            }
          })}
        </div>
        <div className="footer">
          <div className="ptm-2 click" onClick={this.getAllPatients}>全患者</div>
          <div className="flex-title">
            <div className="border ptm-2 click" onClick={this.handleSearchPatientByCondition} style={{width:"50%"}}>絞り込み</div>
            <div className="border ptm-2 click" onClick={this.setSortModal} style={{width:"50%"}}>並び替え</div>
          </div>
          <div className="search_patient">
            <Icon icon={faUser}></Icon>
            <SearchBar
              placeholder=""
              search={this.search}
              enterPressed={this.enterPressed}
              value={this.state.schVal}
            />
          </div>
        </div>
        {this.state.isOpenSearchPatientListModal && (
          <SelectPatientListModal
            closeModal={this.closeModal}
            getPatient={this.getPatientList}
          />
        )}
        {this.state.confirm_message != "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk}
            confirmTitle= {this.state.confirm_message}
            title = {'入力中'}
          />
        )}
        {this.state.openSetSortModal && (
          <SetSortPatientListModal
            closeModal={this.closeModal}
            handleOk={this.sortByName}
            sort_type={this.state.sort_type}
          />
        )}
        
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
      </Card>
    )
  }
}

DialSideBar.contextType = Context;

DialSideBar.propTypes = {
  getPatientList: PropTypes.func,
  onGoto: PropTypes.func,
  updateFavouriteList: PropTypes.func,
  history: PropTypes.object,
};
export default DialSideBar