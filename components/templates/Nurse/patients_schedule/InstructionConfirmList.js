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
import {formatDateLine, formatDateSlash, formatTimeIE} from "~/helpers/date";
import Checkbox from "~/components/molecules/Checkbox";
import * as sessApi from "~/helpers/cacheSession-utils";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {setDateColorClassName} from "~/helpers/dialConstants";
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
   height:2rem;
   line-height:2rem;
 }
 .div-value {
   height:2rem;
   line-height:2rem;
   border:1px solid #aaa;
   padding:0 0.3rem;
 }
 .react-datepicker-wrapper {
   input {
    height: 2rem;
    width: 7rem;
    font-size:1rem;
   }
 }
 .check-area {
   margin-left:1rem;
   label {
    font-size: 1rem;
    line-height: 2rem;
    height: 2rem;
    margin-bottom: 0;
   }
 }
 .select-radio {
   margin-left:1rem;
   label {
     line-height: 2rem;
     font-size: 1rem;
   }
 }
 .btn-area {
   button {
     height:2rem;
     margin-right:0.5rem;
     font-size:1rem;
   }
 }
 .list-area {
   margin-top:0.5rem;
   width:100%;
   height: calc(80vh - 20rem);
   overflow-y:auto;
   padding-top: 1px;
   .div-row {
    margin-top: -1px;
   }
   .cursor-pointer {
    cursor: pointer;
   }
   .row-title {
     width:3rem;
     border:1px solid #aaa;
     display: flex;
     align-items: center;
     div {
      width: 100%;
      text-align: center;
     }
   }
   .row-value {
     width:calc(100% - 3rem);
     align-items: flex-start;
     justify-content: space-between;
     border:1px solid #aaa;
     border-left:none;
     padding: 0.2rem;
     .left-value {
       width:45%;
     }
     .middle-value {
      width:25%;
     }
     .right-value {
      width:30%;
     }
   }
   .load-area {
     width:100%;
     border:1px solid #aaa;
   }
 }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class InstructionConfirmList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_date:props.search_date,
      work_zone:props.work_zone,
      load_flag:false,
      schedule_data:[],
      list_data:[],
      start_hour:props.start_hour,
      end_hour:props.end_hour,
      view_mode:0,
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:'',
      alert_type:'',
      alert_messages:"",
    };
    this.time_list = [];
    for(let index = 8; index < 24; index++){
      this.time_list.push(index);
    }
    for(let index = 0; index < 8; index++){
      this.time_list.push(index);
    }
    this.staff_list = [];
    let staff_list = sessApi.getStaffList();
    if(staff_list != undefined && staff_list != null && Object.keys(staff_list).length > 0){
      Object.keys(staff_list).map(staff_number=>{
        this.staff_list[staff_number] = staff_list[staff_number]['name'];
      })
    }
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.user_number = authInfo.user_number;
    this.change_flag = 0;
  }
  
  async componentDidMount() {
    await this.seachConfirmList();
  }
  
  seachConfirmList=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/nursing_service/search/instruction_confirm_list";
    let post_data = {
      search_date: (this.state.selected_date != null && this.state.selected_date != "") ? formatDateLine(this.state.selected_date) : "",
      hos_number:this.props.patient_info.hos_number,
      view_mode:this.state.view_mode,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          schedule_data:res,
        });
      })
      .catch(() => {
      
      });
    this.maekListdata(this.state.schedule_data);
  }
  
  maekListdata=(schedule_data)=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let list_data = [];
    if(schedule_data.length > 0){
      schedule_data.map(schedule_info=>{
        let exit_flag = false;
        this.time_list.map(time_value=>{
          if(this.state.start_hour == null || (time_value >= this.state.start_hour && time_value <= this.state.end_hour)){
            let schedule = schedule_info.schedule.schedule_dates[formatDateLine(this.state.selected_date)];
            if(schedule != undefined && schedule.length > 0){
              schedule.map(time=>{
                if(parseFloat(time) >= time_value && parseFloat(time) <= time_value){
                  exit_flag = true;
                }
              })
            }
          }
        });
        if(exit_flag){
          let data = {};
          data.nurse_instruction_id = schedule_info.nurse_info.number;
          data.instruction_confirm_date = schedule_info.nurse_info.instruction_confirm_date;
          data.confirm_staff_name = (schedule_info.nurse_info.instruction_confirmer != null && this.staff_list[schedule_info.nurse_info.instruction_confirmer] != undefined)
            ? this.staff_list[schedule_info.nurse_info.instruction_confirmer] : "";
          data.item_level_name = schedule_info.nurse_info.item_level_name;
          data.start_date = schedule_info.nurse_info.start_date;
          data.end_date = schedule_info.nurse_info.end_date;
          data.incidental_attribute = schedule_info.nurse_info.incidental_attribute;
          data.created_name = (schedule_info.nurse_info.created_by != null && this.staff_list[schedule_info.nurse_info.created_by] != undefined)
            ? this.staff_list[schedule_info.nurse_info.created_by] : "";
          list_data.push(data);
        }
      });
    }
    this.setState({
      list_data,
      load_flag:true,
    });
  }
  
  setWorkZone = (e) => {
    let start_hour = null;
    let end_hour = null;
    if(parseInt(e.target.value) != 0){
      start_hour = this.props.shift_pattern_master.find((x) => x.number === parseInt(e.target.value)).start_hour;
      end_hour = this.props.shift_pattern_master.find((x) => x.number === parseInt(e.target.value)).end_hour;
    }
    this.setState({
      work_zone:parseInt(e.target.value),
      start_hour,
      end_hour,
    }, ()=>{
      this.maekListdata(this.state.schedule_data);
    });
  };

  setPeriod=(key,value)=>{
    this.setState({[key]:value});
  };

  setViewMode = (name, value) => {
    this.setState({[name]: value});
  }
  
  confirmInstruction=(nurse_instruction_id)=>{
    if(nurse_instruction_id == 0){return;}
    let schedule_data = this.state.schedule_data;
    schedule_data.map(schedule_info=>{
      if(schedule_info.nurse_info.number == nurse_instruction_id){
        schedule_info.nurse_info.instruction_confirm_date = formatDateSlash(new Date()) + ' ' + formatTimeIE(new Date());
        schedule_info.nurse_info.instruction_confirmer = this.user_number;
        schedule_info.nurse_info.change_flag = 1;
        this.change_flag = 1;
      }
    });
    this.setState({schedule_data}, ()=>{
      this.maekListdata(this.state.schedule_data);
    });
  }
  
  confirmAllInstruction=()=>{
    let list_data = this.state.list_data;
    let nurse_instruction_ids = [];
    if(list_data.length > 0){
      list_data.map(data=>{
        nurse_instruction_ids.push(data.nurse_instruction_id);
      })
    } else {
      return;
    }
    let schedule_data = this.state.schedule_data;
    schedule_data.map(schedule_info=>{
      if(nurse_instruction_ids.includes(schedule_info.nurse_info.number) && schedule_info.nurse_info.instruction_confirm_date == null){
        schedule_info.nurse_info.instruction_confirm_date = formatDateSlash(new Date()) + ' ' + formatTimeIE(new Date());
        schedule_info.nurse_info.instruction_confirmer = this.user_number;
        schedule_info.nurse_info.change_flag = 1;
        this.change_flag = 1;
      }
    });
    this.setState({schedule_data}, ()=>{
      this.maekListdata(this.state.schedule_data);
    });
  }
  
  confirmClose=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"modal_close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  }
  
  closeModal=()=>{
    if(this.state.alert_type == "modal_close"){
      this.props.closeModal();
    }
    this.setState({
      alert_messages:"",
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:'',
    });
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type == "modal_close"){
      this.props.closeModal();
    }
    if(this.state.confirm_type == "search"){
      this.change_flag = 0;
      this.setState({
        confirm_message:"",
        confirm_type:"",
        confirm_alert_title:'',
        load_flag:false
      }, ()=>{
        this.seachConfirmList();
      });
    }
    if(this.state.confirm_type == "register"){
      this.register();
    }
  }
  
  confirmSearch=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"確認処理が確定していません。確認内容がクリアされますがよろしいですか？",
        confirm_type:"search",
        confirm_alert_title:'入力中',
      });
    } else {
      this.seachConfirmList();
    }
  }
  
  confirmRegister=()=>{
    if(this.change_flag == 0){return;}
    this.setState({
      confirm_message:"保存しますか？",
      confirm_type:"register",
      confirm_alert_title:'保存確認',
    });
  }
  
  register=async()=>{
    let confirm_list = [];
    let schedule_data = this.state.schedule_data;
    schedule_data.map(schedule_info=>{
      if(schedule_info.nurse_info.change_flag == 1){
        let confirm_info = {
          nurse_instruction_id : schedule_info.nurse_info.number,
          instruction_confirm_date : schedule_info.nurse_info.instruction_confirm_date,
          instruction_confirmer : schedule_info.nurse_info.instruction_confirmer,
        };
        confirm_list.push(confirm_info);
      }
    });
    if(confirm_list.length > 0){
      let path = "/app/api/v2/nursing_service/confirm/instruction";
      let post_data = {
        confirm_list,
      };
      await apiClient
        .post(path, {
          params: post_data
        })
        .then((res) => {
          this.setState({
            alert_messages:res.success_message != undefined ? res.success_message : res.error_message,
            alert_type:res.success_message != undefined ? "modal_close" : "",
          });
        })
        .catch(() => {
      
        });
    }
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm instruction-confirm-list first-view-modal">
          <Modal.Header><Modal.Title>指示確認一覧</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'flex'}>
                  <div className={'div-title'} style={{width:"4rem"}}>患者ID</div>
                  <div className={'div-value'} style={{minWidth:"7rem"}}>{this.props.patient_info.patient_number}</div>
                  <div className={'div-title'} style={{width:"5rem", marginLeft:"0.5rem"}}>患者氏名</div>
                  <div className={'div-value'} style={{minWidth:"21rem"}}>{this.props.patient_info.patient_name}</div>
                  <div className={'div-title'} style={{width:"3rem", marginLeft:"0.5rem"}}>年齢</div>
                  <div className={'div-value'} style={{minWidth:"7rem"}}>{this.props.patient_info.age+'歳 '+this.props.patient_info.age_month+'ヶ月'}</div>
                  <div className={'div-title'} style={{width:"3rem", marginLeft:"0.5rem"}}>性別</div>
                  <div className={'div-value'}>{this.props.patient_info.gender == 1 ? "男" : "女"}性</div>
                </div>
                <div className={'flex'} style={{marginTop:"0.5rem"}}>
                  <div className={'div-title'} style={{width:"4rem"}}>対象日</div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.selected_date}
                    onChange={this.setPeriod.bind(this,"selected_date")}
                    dateFormat="yyyy/MM/dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                  <div className={'check-area'}>
                    <Checkbox
                      label="確認済み指示を表示する"
                      getRadio={this.setViewMode.bind(this)}
                      value={this.state.view_mode === 1}
                      name="view_mode"
                    />
                  </div>
                  <div className={'select-radio flex'}>
                    {this.props.shift_pattern_master.length > 0 && (
                      this.props.shift_pattern_master.map(item=>{
                        return (
                          <>
                            <Radiobox
                              label={item.name}
                              value={item.number}
                              getUsage={this.setWorkZone.bind(this)}
                              checked={this.state.work_zone === item.number}
                              disabled={true}
                              name={`work_zone_1`}
                            />
                          </>
                        )
                      })
                    )}
                  </div>
                </div>
                <div className={'flex btn-area'} style={{marginTop:"0.5rem"}}>
                  <button onClick={this.confirmSearch}>最新表示</button>
                  <button onClick={this.confirmAllInstruction}>一括確認</button>
                </div>
                <div className={'list-area'}>
                  {this.state.load_flag ? (
                    <>
                      {this.state.list_data.length > 0 && (
                        this.state.list_data.map(data=>{
                          return (
                            <>
                              <div className={'flex div-row'}>
                                <div
                                  className={'row-title '+ (data.instruction_confirm_date == null ? "cursor-pointer" : "")}
                                  onClick={this.confirmInstruction.bind(this, data.instruction_confirm_date == null ? data.nurse_instruction_id : 0)}
                                >
                                  <div>{data.instruction_confirm_date == null ? '〇' : '確'}</div>
                                </div>
                                <div className={'row-value flex'}>
                                  <div className={'left-value'}>
                                    <div style={{paddingRight:"0.5rem"}}>{data.item_level_name}</div>
                                    <div> </div>
                                  </div>
                                  <div className={'middle-value'}>
                                    <div>指示開始日時：{data.start_date}</div>
                                    <div>指示確認日時：{data.instruction_confirm_date == null ? "" : data.instruction_confirm_date}</div>
                                  </div>
                                  <div className={'right-value'}>
                                    <div>依頼者：{data.created_name}</div>
                                    <div>指示確認者：{data.confirm_staff_name}</div>
                                  </div>
                                </div>
                              </div>
                              <div className={'flex div-row'}>
                                <div className={'row-title'}>
                                  <div>
                                    <div>付帯</div>
                                    <div>情報</div>
                                  </div>
                                </div>
                                <div className={'row-value'}>
                                  {data.incidental_attribute.length > 0 && (
                                    data.incidental_attribute.map(attribute=>{
                                      return (
                                        <>
                                          <div>{attribute.name}</div>
                                        </>
                                      )
                                    })
                                  )}
                                </div>
                              </div>
                            </>
                          )
                        })
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
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.confirmClose}>キャンセル</Button>
            <Button className={this.change_flag ? "red-btn" : "disable-btn"} onClick={this.confirmRegister}>{"確定"}</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.confirm_message != "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk}
              confirmTitle= {this.state.confirm_message}
              title= {this.state.confirm_alert_title}
            />
          )}
        </Modal>
      </>
    );
  }
}

InstructionConfirmList.propTypes = {
  closeModal: PropTypes.func,
  shift_pattern_master: PropTypes.array,
  patient_info: PropTypes.object,
  work_zone: PropTypes.number,
  search_date: PropTypes.string,
  start_hour: PropTypes.number,
  end_hour: PropTypes.number,
};

export default InstructionConfirmList;
