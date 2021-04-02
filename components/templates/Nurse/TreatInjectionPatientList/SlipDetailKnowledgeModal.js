import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
// import {formatDateLine} from "~/helpers/date";
import Checkbox from "~/components/molecules/Checkbox";
import * as sessApi from "~/helpers/cacheSession-utils";
// import SelectPannelHarukaModal from "~/components/templates/Patient/Modals/Common/SelectPannelHarukaModal";
// import OxygenCalculateModal from "~/components/templates/Patient/Modals/OutPatient/OxygenCalculateModal";
import {setDateColorClassName} from '~/helpers/dialConstants'
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .div-title {
   height:2.3rem;
   line-height:2.3rem;
 }
 .div-value {
   height:2.3rem;
   line-height:2.3rem;
   border:1px solid #aaa;
   padding:0 0.3rem;
 }
 .react-datepicker{
   width: 130% !important;
   font-size: 1.25rem;
   .react-datepicker__month-container{
     width:79% !important;
     height:24.375rem;
   }
   .react-datepicker__navigation--next--with-time{
     right: 6rem;
   }
   .react-datepicker__time-container{
     width:21% !important;
   }
   .react-datepicker__time-box{
     width:auto !important;
   }
   .react-datepicker__current-month{
     font-size: 1.25rem;
   }
   .react-datepicker__day-names, .react-datepicker__week{
     display: flex;
     justify-content: space-between;
   }
   .react-datepicker__month{
     .react-datepicker__week{
       margin-bottom:0.25rem;
     }
   }
 }
 .react-datepicker-wrapper {
   input {
    height: 2.3rem;
    width: 11rem;
    font-size:1rem;
    text-align:center;
   }
 }
 .check-area {
   margin-left:1rem;
   label {
    font-size: 1rem;
    line-height: 2.3rem;
    height: 2.3rem;
    margin-bottom: 0;
   }
 }
 .select-radio {
   label {
     line-height: 2.3rem;
     font-size: 1rem;
     margin-right:5rem;
   }
 }
 .btn-area {
   button {
     height:2.3rem;
     margin-right:0.5rem;
     font-size:1rem;
   }
 }
 .list-area {
   margin-top:0.5rem;
   width:100%;   
   overflow-y:auto;
   height: calc(60vh - 20rem);
   padding-left:10px;
   padding-right:10px;
   padding-top:2px;
   padding-bottom:2px;
   .div-row {
    margin-top: -1px;
    border:1px solid #aaa;
   }
   .row-title {
     width: 50%;
     border-right:1px solid #aaa;
     .left-area {
       width:5rem;
       border-right:1px solid #aaa;
       display: block;
       align-items: center;
     }
     .right-area {
       width:calc(100% - 5rem);
       padding: 0.3rem;
     }
   }
   .row-value {
     width:50%;
     align-items: flex-start;
     justify-content: space-between;
     border-left:none;
     padding: 0.2rem;
     .left-value {
        width:50%;
     }
     .right-value {
      width:50%;
     }
   }
   .load-area {
     width:100%;
     border:1px solid #aaa;
   }
 }
 .panel-menu {
    width: 100%;
    margin-bottom: 1rem;
    font-weight: bold;
    .menu-btn {
        width:50%;
        text-align: center;
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
        padding: 5px 0;
        cursor: pointer;
    }
    .active-menu {
        width:50%;
        text-align: center;
        border-top: 1px solid black;
        border-right: 1px solid black;
        border-left: 1px solid black;
        padding: 5px 0;
    }
    .no-menu {
        width: calc(100% - 600px);
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
    }
  }
  .button-area{
    margin-top:10px;
    margin-bottom:10px;
    padding-left:10px;
    padding-right:10px;
    position:relative;
    button{
      margin-right:20px;
    }
    .count-info{
      position:absolute;
      right:10px;
    }
  }
  .pannel-area{
    padding-left:10px;
    padding-right:10px;
  }
  .table-area {
   margin-top:0.5rem;
   width: 100%;
   table {
     width:100%;
     margin:0;
     tbody{
       display:block;
       overflow-y: scroll;
       // height: calc(80vh - 17rem);
       height: 18vh;
       width:100%;
       tr{cursor:pointer;}
       tr:nth-child(even) {background-color: #f2f2f2;}
       tr:hover{background-color:#e2e2e2;}
     }
     tr{
       display: table;
       width: 100%;
     }
     thead{
       display:table;
       width:100%;    
       border-bottom: 1px solid #dee2e6;    
       tr{width: calc(100% - 17px);}
     }
     th {
       position: sticky;
       text-align: center;
       padding: 0.3rem;
       white-space:nowrap;
       border:none;
       border-right:1px solid #dee2e6;
       vertical-align: middle;
     }
     td {
       padding: 0.25rem;
       word-break: break-all;
     }
   }  
 }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.ul`
  margin-bottom:0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);    
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
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

const ContextMenu = ({ visible, x,  y,  parent}) => {  
  if (visible) {
      return (
        <ContextMenuUl>
          <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>              
            <li><div onClick={() => parent.contextMenuAction()}>取消し</div></li>
            <li><div onClick={() => parent.contextMenuAction()}>修正実施</div></li>
            <li><div onClick={() => parent.contextMenuAction()}>薬品終了</div></li>
            <li><div onClick={() => parent.contextMenuAction()}>薬品終了取消し</div></li>
            <li><div onClick={() => parent.contextMenuAction()}>未実施確認</div></li>
            <li><div onClick={() => parent.contextMenuAction()}>IN量入力</div></li>
            <li><div onClick={() => parent.contextMenuAction()}>予定変更</div></li>
            <li><div onClick={() => parent.contextMenuAction()}>キャンセル</div></li>
          </ul>
        </ContextMenuUl>
      );
  } else {
      return null;
  }
};

class SlipDetailKnowledgeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      done_time_type:0,
      selected_date:"",
      order_data: this.props.selected_order,
      tab_id:0,
      knowledge_list: [],
      knowledge_patient_list: [],
      treat_location_master: [],
      check_knowledge: [],
      check_knowledge_patient: [],
      load_flag:false,
      isOpenOxygenModal: false,
      isItemSelectModal: false,
      alert_messages:"",
    };

    this.staff_list = [];
    let staff_list = sessApi.getStaffList();
    if(staff_list != undefined && staff_list != null && Object.keys(staff_list).length > 0){
      Object.keys(staff_list).map(staff_number=>{
        this.staff_list[staff_number] = staff_list[staff_number]['name'];
      })
    }
  }
  async componentDidMount() {
    if (this.props.order_type == "treat") {
      await this.getTreatmentMaster();    
    }
    await this.getKnowledge();    
  }
    
  setDoneTimeType = (e) => {
    this.setState({done_time_type:parseInt(e.target.value)});
  };

  setPeriod=(key,value)=>{
    this.setState({[key]:value});
  };

  setViewMode = (name, value) => {
    this.setState({[name]: value});
  }

  getKnowledge=async()=>{    
    let path = "/app/api/v2/nursing_service/slip_detail/get_knowledge";
    let post_data = {
      cur_date: this.props.treat_date,
      patient_id: this.state.tab_id == 0 ? 0 : this.props.patientInfo.patient_id,
      order_type: this.props.order_type
    };
    await apiClient
      .post(path, {
        params: post_data,
      })
      .then((res) => {
        if (res && res.length > 0) {   
          if (this.state.tab_id == 0) {            
            let knowledge_list = res.map(item=>{
              item.checked = 0;
              return item;
            });
            this.setState({
              knowledge_list: knowledge_list,     
              load_flag: true,     
            });
          } else {
            let knowledge_patient_list = res.map(item=>{
              item.checked = 0;
              return item;
            });
            this.setState({
              load_flag: true,
              knowledge_patient_list: knowledge_patient_list,          
            });
          }         
        } else {
          this.setState({
            load_flag: true
          });
        }
      })
      .catch(() => {
        this.setState({
          load_flag: true
        });
      });
  };

  getTreatmentMaster=async()=>{    
    // get master data
    let path = "/app/api/v2/master/treat";
    let post_data = {
      general_id: 1,
      patient_id: this.props.patientInfo.patient_id
    };

    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if (res) {
          let treat_location = [{id:0,value:""}];
          if (res.treat_location != null && res.treat_location.length > 0){
            res.treat_location.map(item=>{
              treat_location.push({id:item.location_id, value: item.name})
            })
          }
          let _state = {
            all_data: res,
            classification_master:res.treat_classification,
            part_master:res.treat_part,
            position_master:this.treat_order_part_position_mode == 0 ? res.treat_position : undefined,
            side_master:res.treat_side,
            treat_location_master:treat_location,
            treat_department_definition:res.treat_department_definition,
            treat_part_definition:res.treat_part_definition,
            treat_item_unit:res.treat_item_unit,
            treat_set:res.treat_set,
            treat_item:res.treat_item,
            additions:res.additions,
            additions_check:{},
            additions_send_flag_check:{},
            load_flag:true,
          };                    
          
          this.setState(_state);          
        }
      })
      .catch(() => {
      });
  };

  confirmOk=()=>{
    if(this.state.selected_index == -1){
      this.setState({alert_messages: (this.state.problem_focus_classification == "#" ? "看護問題" : "フォーカス") + "を選択してください。"});  
    }
  }

  closeModal=()=>{
    this.setState({
      alert_messages:"",
      openDoneComment:false,
      isItemSelectModal: false,
      isOpenOxygenModal: false
    });  
  }

  handleClick = (e) => {
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
          .getElementById("wrapper")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("wrapper")
              .removeEventListener(`scroll`, onScrollOutside);
          });      
      var obj_dialog = document.getElementsByClassName('slip-detail')[0].getElementsByClassName('modal-dialog')[0];      
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - obj_dialog.offsetLeft,
          y: e.clientY + window.pageYOffset - obj_dialog.offsetTop,
        },
      });
    }
  }

  setTab = ( e, val ) => {
    let _state = {tab_id:parseInt(val)};
    if (val == 1 && this.state.knowledge_patient_list.length < 1) {
      _state.load_flag = false;
    }
    this.setState(_state, async()=>{
      if (val == 1 && this.state.knowledge_patient_list.length < 1) {        
        await this.getKnowledge();
      }
    });
  };

  contextMenuAction = () => {    
    this.forceUpdate();
  };

  getOrderStatus = (_type, _item) => {
    if (_type == "treat") { // treat
      if (_item.state == undefined || _item.state == null) {
        return "";
      }
      return _item.state == 0 ? "○": "●";
    } else { // injection
      if (_item.done_order == undefined || _item.done_order == null) {
        return "";
      }
      return _item.done_order == 0 ? "○": "●";
    }
  }

  getOrderTitle = (_type, _karteStatus, _category) => {
    let result = "";
    result = _karteStatus == 1 ? "外来" : _karteStatus == 3 ? "入院" : "訪問診療";
    if (_category == "処置" && _type == "treat") {
      result += "処置";
    } else {
      result += "注射";
    }

    return result;
  }

  getImplementLocation = (_locationId) => {
    let result = "";

    if (this.state.treat_location_master.length < 1) return result;
    
    this.state.treat_location_master.map(item=>{
      if (_locationId == item.id) result = item.value;
    });

    return result;
  }

  openOxygenModal = (index) => {
    // if (this.state.practice_name == null || this.state.practice_name == ""){
    //   this.setState({alert_messages: "行為名を選択してください。"});
    //   return;
    // }
    
    // let oxygen_data = this.state.set_detail[index]['oxygen_data'] !== undefined && this.state.set_detail[index]['oxygen_data'] != null ?
    //   JSON.parse(this.state.set_detail[index]['oxygen_data']) : null;
    // this.change_flag = 1;
    this.setState({
      isOpenOxygenModal: true,
      oxygen_index:index,
      // oxygen_data,
    });
  };

  openItemSelectModal = value => {
    this.setState({
      isItemSelectModal: true,
      cur_index: value,
    })
  };

  getConvertDateTime = (_date=null, _type=null) => {
    let result = "";
    if(_date == undefined || _date == null || _date == "") return result;

    if (_type == "type_2") {
      result = _date.substr(0, 4) + "/" + _date.substr(5, 2) + "/" + _date.substr(8, 2);
      return result;
    }

    result = _date.substr(0, 4) + "/" + _date.substr(5, 2) + "/" + _date.substr(8, 2) + " ";
    if (_date.length > 10) {
      result = result + _date.substr(11, 2) + ":" + _date.substr(14, 2);
    }

    return result
  }

  getRadio = (idx, name, value) => {
    if (name == "knowledge_list") {
      let knowledge_list = this.state.knowledge_list;
      knowledge_list[idx].checked = value ? 1 : 0;
      this.setState({
        knowledge_list
      });
    } else if(name == "knowledge_patient_list") {
      let knowledge_patient_list = this.state.knowledge_patient_list;
      knowledge_patient_list[idx].checked = value ? 1 : 0;
      this.setState({
        knowledge_patient_list
      });
    }
  }

  render() {
    let {order_data} = this.state;
    return (
      <>
        <Modal show={true} className="custom-modal-sm slip-detail first-view-modal">
          <Modal.Header><Modal.Title>ナレッジセット</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper className='wrapper' id = 'wrapper'>
                <div className={'flex'}>
                  <div className={'select-radio flex'}>
                    <Radiobox
                      label={'現在時間で実施'}
                      value={0}
                      getUsage={this.setDoneTimeType.bind(this)}
                      checked={this.state.done_time_type === 0}
                      disabled={true}
                      name={`done_time_type`}
                    />
                    <Radiobox
                      label={'予定時間で実施'}
                      value={1}
                      getUsage={this.setDoneTimeType.bind(this)}
                      checked={this.state.done_time_type === 1}
                      disabled={true}
                      name={`done_time_type`}
                    />
                    <Radiobox
                      label={'指定時間で実施'}
                      value={2}
                      getUsage={this.setDoneTimeType.bind(this)}
                      checked={this.state.done_time_type === 2}
                      disabled={true}
                      name={`done_time_type`}
                    />
                    <DatePicker
                      locale="ja"
                      selected={this.state.selected_date}
                      onChange={this.setPeriod.bind(this,"selected_date")}
                      dateFormat="yyyy/MM/dd h:mm aa"
                      timeCaption="時間"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={10}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      disabled={this.state.done_time_type !== 2}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                  </div>
                </div>
                <div className={'flex'} style={{marginTop:"0.5rem"}}>
                  <div className={'div-title'} style={{width:"4rem"}}>患者ID</div>
                  <div className={'div-value'}>{this.props.patientInfo.patientNumber}</div>
                  <div className={'div-title'} style={{width:"5rem", marginLeft:"1.5rem"}}>患者氏名</div>
                  <div className={'div-value'}>{this.props.patientInfo.patientName}</div>
                  <div className={'div-title'} style={{width:"3rem", marginLeft:"1.5rem"}}>年齢</div>
                  <div className={'div-value'}>{this.props.patientInfo.age}</div>
                  <div className={'div-value'} style={{border:"none"}}>才</div>
                  <div className={'div-title'} style={{width:"3rem", marginLeft:"1.5rem"}}>性別</div>
                  <div className={'div-value'}>{this.props.patientInfo.gender == 1 ? "男性" : "女性"}</div>
                </div>
                <div className={'list-area'} id='list-area'>
                  {this.state.load_flag ? (
                    <>
                      {this.props.order_type == "treat" ? (
                        <>
                          <div className={'div-row'}>
                            <div className={'flex'} style={{borderBottom:"1px solid #aaa"}}>
                              <div className={'row-title'}>
                                <div className={'flex'} style={{borderBottom:"1px solid #aaa",height:"60%"}}>
                                  <div className={'left-area'}>
                                    <button onContextMenu={e => this.handleClick(e)} style={{width:"100%", height:"100%"}}>{this.getOrderStatus(this.props.order_type, order_data)}</button>
                                  </div>
                                  <div className={'right-area'}>
                                    <div>{this.getOrderTitle(order_data.karte_status, order_data.category)}</div>
                                    <div>YYYY/MM/DD（AAA)</div>
                                  </div>
                                </div>
                                <div className={'flex'} style={{height:"40%"}}>
                                  <div className={'left-area'} style={{textAlign:"center", lineHeight:"2.5"}}>
                                    ｺﾒﾝﾄ
                                  </div>
                                  <div className={'right-area'}>                                            
                                  </div>
                                </div>
                              </div>
                              <div className={'row-value flex'}>
                                <div className={'left-value'}>
                                  <div>指示開始日時:YYYY/MM/DD HH:MI</div>
                                  <div>実施日時:</div>
                                  <div>指示受け日時:{order_data.instruction_receive_date != "" ? this.getConvertDateTime(order_data.instruction_receive_date) : ""}</div>
                                  <div>指示確認日時:</div>
                                </div>
                                <div className={'right-value'}>
                                  <div>依頼者: テスト 医師</div>
                                  <div>実施者: テスト 看護師</div>
                                  <div>指示受け者:{order_data.instruction_receiver > 0 ? this.staff_list[order_data.instruction_receiver] : ""}</div>
                                  <div>指示確認者</div>
                                </div>
                              </div>
                            </div>
                            <div style={{padding:"0.3rem", paddingLeft:'2rem'}}>
                              {order_data.location_id > 0 && (                                
                                  <div>実施場所：{this.getImplementLocation(order_data.location_id)}</div>
                                )}
                                {order_data.order_data.order_data.detail.map(ele=>{
                                  return (
                                    <>
                                      {ele.set_name != "" && (
                                        <div>セット：{ele.set_name}</div>
                                      )}
                                      {ele.practice_name != "" && (
                                        <div>処置：{ele.practice_name}</div>
                                      )}
                                      {ele.request_name != "" && (
                                        <div>請求：{ele.request_name}</div>
                                      )}                                                                        
                                      {ele.treat_detail_item.length > 0 && ele.treat_detail_item.map(child=>{
                                        return(
                                          <>
                                            {child.classfic_name == "薬剤" && (
                                              <div>薬剤：{child.item_name} {child.count > 0 ? child.count + child.main_unit : ""}</div>
                                            )}
                                            {child.classfic_name == "医事コメント" && (
                                              <div>医事コメント：{child.item_name} {child.count > 0 ? child.count + child.main_unit : ""}</div>
                                            )}
                                            {child.classfic_name == "材料" && (
                                              <div>材料：{child.item_name} {child.count > 0 ? child.count + child.main_unit : ""}</div>
                                            )}
                                            {child.classfic_name == "実施情報" && (
                                              <div>実施情報：{child.item_name} {child.count > 0 ? child.count + child.main_unit : ""}</div>
                                            )}
                                            {child.classfic_name == "膀胱留置カテーテル" && (
                                              <div>膀胱留置カテーテル：{child.item_name} {child.count > 0 ? child.count + child.main_unit : ""}</div>
                                            )}                                          
                                          </>
                                        );
                                      })}
                                    </>
                                  );
                                })}
                            </div>
                          </div>
                        </>
                      ):(
                        <>
                          <div className={'div-row'}>
                            <div className={'flex'} style={{borderBottom:"1px solid #aaa"}}>
                              <div className={'row-title'}>
                                <div className={'flex'} style={{borderBottom:"1px solid #aaa",height:"60%"}}>
                                  <div className={'left-area'}>
                                    <button onContextMenu={e => this.handleClick(e)} style={{width:"100%", height:"100%"}}>{this.getOrderStatus("injection", order_data)}</button>
                                  </div>
                                  <div className={'right-area'}>
                                    <div>{this.getOrderTitle("injection", order_data.karte_status)}</div>
                                    <div>YYYY/MM/DD（AAA)</div>
                                  </div>
                                </div>
                                <div className={'flex'} style={{height:"40%"}}>
                                  <div className={'left-area'} style={{textAlign:"center", lineHeight:"2.5"}}>
                                    ｺﾒﾝﾄ
                                  </div>
                                  <div className={'right-area'}>                                            
                                  </div>
                                </div>
                              </div>
                              <div className={'row-value flex'}>
                                <div className={'left-value'}>
                                  <div>指示開始日時:YYYY/MM/DD HH:MI</div>
                                  <div>実施日時:</div>
                                  <div>指示受け日時:{order_data.instruction_receive_date != "" ? this.getConvertDateTime(order_data.instruction_receive_date) : ""}</div>
                                  <div>指示確認日時:</div>
                                </div>
                                <div className={'right-value'}>
                                  <div>依頼者: テスト 医師</div>
                                  <div>実施者: テスト 看護師</div>
                                  <div>指示受け者:{order_data.instruction_receiver > 0 ? this.staff_list[order_data.instruction_receiver] : ""}</div>
                                  <div>指示確認者</div>
                                </div>
                              </div>
                            </div>
                            <div style={{padding:"0.3rem", paddingLeft:'2rem'}}>
                              {order_data.order_data.location_name != "" && (                                
                                <div>実施場所：{order_data.order_data.location_name}</div>
                              )}
                              {order_data.order_data.drip_rate != "" && (                                
                                <div>点滴速度：{order_data.order_data.drip_rate}ml/h</div>
                              )}
                              {order_data.order_data.water_bubble != "" && (                                
                                <div>1分あたり：{order_data.order_data.water_bubble}滴</div>
                              )}
                              {order_data.order_data.exchange_cycle != "" && (                                
                                <div>交換サイクル：{order_data.order_data.exchange_cycle}時間</div>
                              )}
                              {order_data.order_data.require_time != "" && (                                
                                <div>所要時間：{order_data.order_data.require_time}時間</div>
                              )}
                              {order_data.order_data.free_comment != "" && order_data.order_data.free_comment.length > 0 && order_data.order_data.free_comment[0] != null && order_data.order_data.free_comment[0] != "" && (                                
                                <div>備考：{order_data.order_data.free_comment[0]}</div>
                              )}                                      
                              {order_data.order_data.order_data.map(ele=>{
                                return (
                                  <>
                                    {ele.usage_name != "" && (
                                      <div>手技：{ele.usage_name}</div>
                                    )}                                            
                                    {ele.body_part != "" && (
                                      <div>部位/補足：{ele.body_part}</div>
                                    )}                                                                        
                                    {ele.med.length > 0 && ele.med.map(child=>{
                                      return(
                                        <>                                                  
                                          <div>薬剤：{child.item_name} {child.amount + child.unit}</div>                                                                                                    
                                        </>
                                      );
                                    })}
                                  </>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}                                      
                    </>
                  ):(
                    <div className={'load-area'}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  )}
                </div>
                <div className='button-area flex'>
                  {/*<button onClick={this.openItemSelectModal.bind(this,index)}>新規追加</button>
                  <button onClick={this.openOxygenModal.bind(this,index)}>酸素量計算</button>*/}
                  <button>新規追加</button>
                  <button>酸素量計算</button>
                  <div className='count-info'>処置行為数 &nbsp;&nbsp;1/1</div>
                </div>
                <div className="pannel-area">
                  <div className="panel-menu flex">
                    {this.state.tab_id === 0 ? (
                        <><div className="active-menu">処置ナレッジ</div></>
                    ) : (
                        <><div className="menu-btn" onClick={e => {this.setTab(e, 0);}}>処置ナレッジ</div></>
                    )}
                    {this.state.tab_id === 1 ? (
                        <><div className="active-menu">患者ナレッジ</div></>
                    ) : (
                        <><div className="menu-btn" onClick={e => {this.setTab(e, 1);}}>患者ナレッジ</div></>
                    )}
                  </div>
                  <div className='table-area'>
                    {this.state.tab_id == 0 && (
                      <>
                        {this.props.order_type == "treat" ? (
                          <>
                            <div style={{marginBottom:'10px'}}>過去に実施された処置・注射情報です。</div>
                              <div className='table'>
                                <table className='table-scroll table table-bordered'>
                                  <thead>
                                    <tr>
                                      <th className='text-center' style={{width:"6rem"}}>チェック</th>
                                      <th className='text-center' style={{width:"10rem"}}>分類</th>
                                      <th className='text-center'>品名／名称</th>
                                      <th className='text-center' style={{width:"6rem"}}>数量</th>
                                      <th className='text-center' style={{width:"6rem"}}>単位</th>
                                      <th className='text-center' style={{width:"10rem"}}>ロット</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.load_flag == false ? (
                                      <>
                                        <tr>
                                          <td colSpan={'6'}>
                                            <SpinnerWrapper>
                                              <Spinner animation="border" variant="secondary" />
                                            </SpinnerWrapper>
                                          </td>
                                        </tr>
                                      </>
                                    ):(
                                      <>
                                        {this.state.knowledge_list.length > 0 && (
                                          this.state.knowledge_list.map((order, idx)=>{
                                            return (
                                              <>
                                                <tr>
                                                  <td className='text-center' style={{width:"6rem"}}>
                                                    <Checkbox
                                                        label=""
                                                        getRadio={this.getRadio.bind(this,idx)}
                                                        // isDisabled={true}
                                                        value={order != undefined && order != null && order.checked != undefined && order.checked != null && order.checked == 1}
                                                        name="knowledge_list"
                                                      />
                                                  </td>
                                                  <td style={{width:"10rem"}}>{order.classfic_name != undefined && order.classfic_name != null ? order.classfic_name : ""}</td>
                                                  <td>{order.item_name != undefined && order.item_name != null ? order.item_name : ""}</td>
                                                  <td className='text-right' style={{width:"6rem"}}>{order.count != undefined && order.count != null ? order.count : ""}</td>
                                                  <td style={{width:"6rem"}}>{order.main_unit != undefined && order.main_unit != null ? order.main_unit : ""}</td>
                                                  <td style={{width:"10rem"}}>{order.lot != undefined && order.lot != null ? order.lot : ""}</td>
                                                </tr>
                                              </>
                                            );
                                          })
                                        )}
                                      </>
                                    )}                                                                  
                                  </tbody>                               
                                </table>
                              </div>
                          </>
                        ) : (
                          <>
                            <div style={{marginBottom:'10px'}}>過去に実施された処置・注射情報です。</div>
                              <div className='table'>
                                <table className='table-scroll table table-bordered'>
                                  <thead>
                                    <tr>
                                      <th className='text-center' style={{width:"6rem"}}>チェック</th>
                                      <th className='text-center' style={{width:"10rem"}}>分類</th>
                                      <th className='text-center'>品名／名称</th>
                                      <th className='text-center' style={{width:"15rem"}}>設定値</th>                                
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.load_flag == false ? (
                                      <>
                                        <tr>
                                          <td colSpan={'4'}>
                                            <SpinnerWrapper>
                                              <Spinner animation="border" variant="secondary" />
                                            </SpinnerWrapper>
                                          </td>
                                        </tr>
                                      </>
                                    ):(
                                      <>
                                        {this.state.knowledge_list.length > 0 && (
                                          this.state.knowledge_list.map((order, idx)=>{
                                            return (
                                              <>
                                                <tr>
                                                  <td className='text-center' style={{width:"6rem"}}>
                                                    <Checkbox
                                                        label=""
                                                        getRadio={this.getRadio.bind(this, idx)}
                                                        // isDisabled={true}
                                                        value={order != undefined && order != null && order.checked != undefined && order.checked != null && order.checked == 1}
                                                        name="knowledge_list"
                                                      />
                                                  </td>
                                                  <td style={{width:"10rem"}}></td>
                                                  <td>{order.item_name != undefined && order.item_name != null ? order.item_name : ""}</td>
                                                  <td className='text-right' style={{width:"15rem"}}></td>                                
                                                </tr>                              
                                              </>
                                            );
                                          })
                                        )}
                                      </>
                                    )}
                                    
                                  </tbody>
                                </table>
                              </div>
                          </>
                        )}
                        
                      </>                    
                    )}
                    {this.state.tab_id == 1 && (
                      <>
                        {this.props.order_type == "treat" ? (
                          <>
                            <div style={{marginBottom:'10px'}}>過去に実施された処置・注射情報です。</div>
                              <div className='table'>
                                <table className='table-scroll table table-bordered'>
                                  <thead>
                                    <tr>
                                      <th className='text-center' style={{width:"6rem"}}>チェック</th>
                                      <th className='text-center' style={{width:"10rem"}}>分類</th>
                                      <th className='text-center'>品名／名称</th>
                                      <th className='text-center' style={{width:"6rem"}}>数量</th>
                                      <th className='text-center' style={{width:"6rem"}}>単位</th>
                                      <th className='text-center' style={{width:"10rem"}}>ロット</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.load_flag == false ? (
                                      <>
                                        <tr>
                                          <td colSpan={'6'}>
                                            <SpinnerWrapper>
                                              <Spinner animation="border" variant="secondary" />
                                            </SpinnerWrapper>
                                          </td>
                                        </tr>
                                      </>
                                    ):(
                                      <>
                                        {this.state.knowledge_patient_list.length > 0 && (
                                          this.state.knowledge_patient_list.map((order, idx)=>{
                                            return (
                                              <>
                                                <tr>
                                                  <td className='text-center' style={{width:"6rem"}}>
                                                    <Checkbox
                                                        label=""
                                                        getRadio={this.getRadio.bind(this, idx)}
                                                        // isDisabled={true}
                                                        value={order != undefined && order != null && order.checked != undefined && order.checked != null && order.checked == 1}
                                                        name="knowledge_patient_list"
                                                      />
                                                  </td>
                                                  <td style={{width:"10rem"}}>{order.classfic_name != undefined && order.classfic_name != null ? order.classfic_name : ""}</td>
                                                  <td>{order.item_name != undefined && order.item_name != null ? order.item_name : ""}</td>
                                                  <td className='text-right' style={{width:"6rem"}}>{order.count != undefined && order.count != null ? order.count : ""}</td>
                                                  <td style={{width:"6rem"}}>{order.main_unit != undefined && order.main_unit != null ? order.main_unit : ""}</td>
                                                  <td style={{width:"10rem"}}>{order.lot != undefined && order.lot != null ? order.lot : ""}</td>
                                                </tr>
                                              </>
                                            );
                                          })
                                        )}
                                      </>
                                    )}                                                                  
                                  </tbody>                               
                                </table>
                              </div>
                          </>
                        ) : (
                          <>
                            <div style={{marginBottom:'10px'}}>過去に実施された処置・注射情報です。</div>
                              <div className='table'>
                                <table className='table-scroll table table-bordered'>
                                  <thead>
                                    <tr>
                                      <th className='text-center' style={{width:"6rem"}}>チェック</th>
                                      <th className='text-center' style={{width:"10rem"}}>分類</th>
                                      <th className='text-center'>品名／名称</th>
                                      <th className='text-center' style={{width:"15rem"}}>設定値</th>                                
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.load_flag == false ? (
                                      <>
                                        <tr>
                                          <td colSpan={'4'}>
                                            <SpinnerWrapper>
                                              <Spinner animation="border" variant="secondary" />
                                            </SpinnerWrapper>
                                          </td>
                                        </tr>
                                      </>
                                    ):(
                                      <>
                                        {this.state.knowledge_patient_list.length > 0 && (
                                          this.state.knowledge_patient_list.map((order, idx)=>{
                                            return (
                                              <>
                                                <tr>
                                                  <td className='text-center' style={{width:"6rem"}}>
                                                    <Checkbox
                                                        label=""
                                                        getRadio={this.getRadio.bind(this, idx)}
                                                        // isDisabled={true}
                                                        value={order != undefined && order != null && order.checked != undefined && order.checked != null && order.checked == 1}
                                                        name="knowledge_patient_list"
                                                      />
                                                  </td>
                                                  <td style={{width:"10rem"}}></td>
                                                  <td>{order.item_name != undefined && order.item_name != null ? order.item_name : ""}</td>
                                                  <td className='text-right' style={{width:"15rem"}}></td>                                
                                                </tr>                              
                                              </>
                                            );
                                          })
                                        )}
                                      </>
                                    )}
                                    
                                  </tbody>
                                </table>
                              </div>
                          </>
                        )}
                      </>  
                    )}
                  </div>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={"red-btn"}>{"確定"}</Button>
          </Modal.Footer>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}            
          />
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )} 
          {/*{this.state.isItemSelectModal && (
            <SelectPannelHarukaModal
              selectMaster = {this.setItemName}
              closeModal= {this.closeModal}
              MasterName= {'品名'}
              item_category_id={this.state.set_detail[this.state.cur_index]['classfic']}
              is_pagenation={true}
            />
          )}
          {this.state.isOpenOxygenModal && (
            <OxygenCalculateModal
              closeModal={this.closeModal}
              handleOk={this.handleOk}
              modal_data={this.state.oxygen_data}
              practice_name={this.state.practice_name}
            />
          )}*/}
        </Modal>
      </>
    );
  }
}

SlipDetailKnowledgeModal.propTypes = {
  closeModal: PropTypes.func,
  patientInfo: PropTypes.object,
  selected_order: PropTypes.object,
  treat_date: PropTypes.string,
  order_type: PropTypes.string,
};

export default SlipDetailKnowledgeModal;
