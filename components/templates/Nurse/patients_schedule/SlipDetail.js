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
import {formatDateLine} from "~/helpers/date";
import DoneComment from "./DoneComment";
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
   height: calc(80vh - 18rem);
   overflow-y:auto;
   padding-top: 1px;
   .div-row {
    margin-top: -1px;
   }
   .row-title {
     width:4rem;
     border:1px solid #aaa;
     display: flex;
     align-items: center;
     div {
      width: 100%;
      text-align: center;
     }
   }
   .row-value {
     width:calc(100% - 4rem);
     align-items: flex-start;
     justify-content: space-between;
     border:1px solid #aaa;
     border-left:none;
     padding: 0.2rem;
     .left-value {
       width:30%;
     }
     .middle-value {
      width:30%;
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

class SlipDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      done_time_type:0,
      selected_date:"",
      openDoneComment:false,


      load_flag:true,
      alert_messages:"",
    };
  }
  async componentDidMount() {
    // await this.searchSoapFocusRecord();
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

  searchSoapFocusRecord=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/nursing_service/search_plan/soap_focus_record";
    let post_data = {
      start_date:(this.state.start_date != null && this.state.start_date !== "") ? formatDateLine(this.state.start_date) : "",
      end_date:(this.state.end_date != null && this.state.end_date !== "") ? formatDateLine(this.state.end_date) : "",
      problem_focus_classification:this.state.problem_focus_classification,
      nursing_problem_focus:this.state.nursing_problem_focus,
      article:this.state.article,
      problem_number:this.state.problem_number,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          load_flag:true,
          soap_focus_records:res,
          selected_index:-1,
        });
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
    });  
  }

  openDoneComment=()=>{
    this.setState({openDoneComment:true});
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm slip-detail first-view-modal">
          <Modal.Header><Modal.Title>伝票詳細</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
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
                  <div className={'div-value'} style={{minWidth:"7rem"}}>{this.props.patient_info.patient_number}</div>
                  <div className={'div-title'} style={{width:"5rem", marginLeft:"0.5rem"}}>患者氏名</div>
                  <div className={'div-value'} style={{minWidth:"21rem"}}>{this.props.patient_info.patient_name}</div>
                  <div className={'div-title'} style={{width:"3rem", marginLeft:"0.5rem"}}>年齢</div>
                  <div className={'div-value'} style={{minWidth:"7rem"}}>{this.props.patient_info.age+'歳 '+this.props.patient_info.age_month+'ヶ月'}</div>
                  <div className={'div-title'} style={{width:"3rem", marginLeft:"0.5rem"}}>性別</div>
                  <div className={'div-value'}>{this.props.patient_info.gender == 1 ? "男" : "女"}性</div>
                </div>
                <div className={'list-area'}>
                  {this.state.load_flag ? (
                    <>
                      <div className={'flex div-row'}>
                        <div className={'row-title'}><button style={{width:"100%", height:"100%"}}>●</button></div>
                        <div className={'row-value flex'}>
                          <div className={'left-value'}>
                            <div>シャワー浴</div>
                            <div>2010/12/14(火)</div>
                          </div>
                          <div className={'middle-value'}>
                            <div>指示開始日時：2010/12/19 13:24</div>
                            <div>実施日時：2010/12/21 12:21</div>
                          </div>
                          <div className={'right-value'}>
                            <div>依頼者：看護師 Ａ</div>
                            <div>実施者：看護師 Ａ</div>
                          </div>
                        </div>
                      </div>
                      <div className={'flex div-row'}>
                        <div className={'row-title'}>
                          <button style={{width:"100%", height:"100%"}} onClick={this.openDoneComment}>ｺﾒﾝﾄ</button>
                        </div>
                        <div className={'row-value'}>
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
                          <div>シャワー浴</div>
                          <div>見守り</div>
                          <div>毎日</div>
                          <div>（１日 １回）</div>
                        </div>
                      </div>
                      <div className={'flex div-row'}>
                        <div className={'row-title'}><button style={{width:"100%", height:"100%"}}>〇</button></div>
                        <div className={'row-value flex'}>
                          <div className={'left-value'}>
                            <div>爪切り</div>
                            <div>2010/12/21(火)</div>
                          </div>
                          <div className={'middle-value'}>
                            <div>指示開始日時：2010/12/19 13:24</div>
                            <div>実施日時：</div>
                          </div>
                          <div className={'right-value'}>
                            <div>依頼者：看護師 Ａ</div>
                            <div>実施者：</div>
                          </div>
                        </div>
                      </div>
                      <div className={'flex div-row'}>
                        <div className={'row-title'}>
                          <button style={{width:"100%", height:"100%"}} onClick={this.openDoneComment}>ｺﾒﾝﾄ</button>
                        </div>
                        <div className={'row-value'}>
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
                          <div>シャワー浴</div>
                          <div>見守り</div>
                          <div>毎日</div>
                          <div>（１日 １回）</div>
                        </div>
                      </div>
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
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={"red-btn"}>{"確定"}</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )} 
          {this.state.openDoneComment && (
            <DoneComment
              closeModal={this.closeModal}
            />
          )}
        </Modal>
      </>
    );
  }
}

SlipDetail.propTypes = {
  closeModal: PropTypes.func,
  patient_info: PropTypes.object,
};

export default SlipDetail;
