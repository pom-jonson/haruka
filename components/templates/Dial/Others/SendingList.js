import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import DatePicker from "react-datepicker";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import { formatJapanDate, formatDateLine, getNextDayByJapanFormat, getPrevDayByJapanFormat} from "~/helpers/date";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import DialMultiSelectPatientModal from "~/components/templates/Dial/Common/DialMultiSelectPatientModal";
import * as methods from "~/components/templates/Dial/DialMethods";
import axios from "axios";
import Context from "~/helpers/configureStore";
import Radiobox from "~/components/molecules/Radiobox";
import * as sessApi from "~/helpers/cacheSession-utils";
import {Dial_tab_index,displayLineBreak, stripHtml, setDateColorClassName} from "~/helpers/dialConstants";
import PrintSendingPreview from "~/components/templates/Print/PrintSendingPreview";
import DialShowShemaModal from "~/components/templates/Patient/Modals/Common/DialShowShemaModal";
import Spinner from "react-bootstrap/Spinner";
import {getServerTime} from "~/helpers/constants";

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 20rem;
  display: flex;
`;

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  background-color: ${surface};
  padding: 1.25rem;
  .flex{
    display:flex;
  }
  .a_tag{
    text-decoration: underline;
    color: blue;
    cursor:pointer;
  }
.custom-date-input{
    font-size: 2rem;
    margin: 0 10px;
    cursor:pointer;
}
.prev-day{
    font-size: 1.875rem;
    cursor: pointer;
   }
.next-day {
    font-size: 1.875rem;
    cursor: pointer;
}
.title{
  font-size:2rem;
  margin-bottom:1.25rem;
  padding-left: 0.5rem;
  border-left: solid 0.3rem #69c8e1;
  margin-right:9rem;
}
.others {
  position:absolute;
  right:1.25rem;
  button {
      margin-left: 0.2rem;
      margin-bottom: 0px;
      margin-top: 0.3rem;
  }
  span {
      font-size: 1rem;
  }
}
.disable-button {
  background: rgb(101, 114, 117);
  cursor:auto;
}
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 1rem;
  width: 100%;
  height: 4.375rem;
  padding: 1.25rem;
  float: left;
  .search-box {
      width: 100%;
      display: flex;
  }
  .label-title {
    width: 6rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .pullbox-select {
      font-size: 1rem;
      width: 9.375rem;
  }
  .radio-area{
    label{
      font-size:1rem;
    }
    margin-left: 10px;
    line-height: 2rem;
  }
  .radio-label {
    width: 3rem;
    float: left;
    padding-right: 0.625rem;
    text-align: right;
    line-height: 2rem;
  }
  .select_date_range{
    display:flex;
    margin-right: 1rem;
    .pullbox{
      margin-right:1.25rem;
    }
    span{
      margin: 0px 0.625rem;
      line-height: 2rem;
    }
    .select-period {
      display:flex;
      width:25rem;
    }
  }
  .checkbox-area{
    line-height: 2rem;
    label{
      font-size: 1rem;
    }
  }
   .example-custom-input{
      font-size: 1rem;
      text-align:center;
      padding: 0px 0.2rem;
      border: 1px solid;
      line-height: 2rem;
    }
    .disabled{
        background:lightgray;
    }
    .select_patient{
      position: absolute;
      right: 2rem;
      button{
        span{
          font-size: 1rem;
        }
      }
    }

    button{
      margin-left: 0.625rem;
    }
 `;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  border: solid 1px lightgrey;
  margin-bottom: 0.625rem;
  label {
      text-align: right;
  }
  table {
    font-size: 1rem;
    margin-bottom: 0;
  }
  thead{
    margin-bottom: 0;
    display:table;
    width:100%;
    tr{width: calc(100% - 17px);}
  }
  tbody{
    height: calc( 100vh - 17rem);
    overflow-y: scroll;
    display:block;
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
  }
  tr{
    display: table;
    width: 100%;
    box-sizing: border-box;
  }
  td {
      padding: 0.25rem;
      text-align: left;
      vertical-align: middle;
      border-bottom: 1px solid #dee2e6;
      word-break: break-all;
      button{
        float:right;
      }
  }
  th {
      text-align: center;
      padding: 0.3rem;
      border-bottom: 1px solid #dee2e6;
  }
  .table-check {
      width: 3.75rem;
  }
  .item-no {
    width: 3rem;
  }
  .patient-name {
    width: 20rem;
  }
  .code-number {
    width: 10rem;
  }
`;

const ContextMenuUl = styled.ul`
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

const ContextMenu = ({ visible, x,  y, system_patient_id,schedule_date, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction(system_patient_id,schedule_date, "sending")}>申し送り</div></li>
          <li><div onClick={() => parent.contextMenuAction(system_patient_id,schedule_date, "dr_sending")}>Dr上申</div></li>
          <li><div onClick={() => parent.contextMenuAction(system_patient_id,schedule_date, "instruction")}>指示</div></li>
          <li><div onClick={() => parent.contextMenuAction(system_patient_id,schedule_date, "dr_karte")}>Drカルテ</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class SendingList extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let table_data = [];
    this.cache_schedule_date = sessApi.getObjectValue("from_bedside","schedule_date");
    this.cache_patient = sessApi.getObjectValue("from_bedside","patient");
    this.state = {
      start_date:'',
      end_date:'',
      table_data,
      staff_name: "",
      patient_name: "",
      patient_id: 0,
      staff_id: 0,
      isShowPatientList: false,
      isShowStaffList: false,
      isLoaded: false,
      confirm_message:"",
      display_all:0,
      display_next:1,
      display_dr:0,
      display_continue:0,
      display_va_continue:0,
      date_setting:(this.cache_schedule_date != undefined && this.cache_schedule_date != null) ? 1 : 0,
      isOpenPrintPreviewModal: false,
      selected_patients_list:[],
      isOpenShemaModal: false,
      schedule_date:'',
    }
  }
  
  async componentDidMount () {
    let schedule_date = "";
    let start_date = "";
    let end_date = "";
    let cache_schedule_date = sessApi.getObjectValue("from_bedside","schedule_date");
    sessApi.remove("from_bedside");
    if(cache_schedule_date != undefined && cache_schedule_date != null){
      schedule_date = new Date(cache_schedule_date);
      start_date = schedule_date;
      end_date = schedule_date;
    } else {
      let server_time = await getServerTime();
      schedule_date = new Date(server_time);
      let today = new Date(server_time);
      let year = today.getFullYear();
      let month = today.getMonth();
      start_date = new Date(year, month, 1);
      end_date = new Date(year, month+1, 0);
    }
    this.setState({
      schedule_date,
      start_date,
      end_date,
    }, async()=>{
      await this.getStaffs();
      await this.getSendingData();
    });
  }
  
  contextMenuAction (system_patient_id, schedule_date, type) {
    var url = "/dial/board/system_setting";
    sessApi.setObjectValue("from_print", "schedule_date", schedule_date);
    sessApi.setObjectValue("from_print", "system_patient_id", system_patient_id);
    switch(type){
      case 'sending':
        sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.Sending);
        break;
      case 'dr_sending':
        sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.DoctorProposal);
        break;
      case 'instruction':
        sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.Instruction);
        break;
      case 'dr_karte':
        sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.DRMedicalRecord);
        break;
    }
    this.props.history.replace(url);
  }
  
  getSendingData = async () => {
    let path = "/app/api/v2/dial/board/getAllSendingData";
    let post_data = {
      start_date:formatDateLine(this.state.start_date),
      end_date:formatDateLine(this.state.end_date),
      patient_ids: this.state.patient_ids,
      date_setting:this.state.date_setting,
    };
    const { data } = await axios.post(path, {param:post_data});
    if(data != undefined && data !=null){
      data.map(item => {
        item.print_or_not = 1;
      })
      this.setState({
        table_data: data,
        isLoaded: true
      });
    } else {
      this.setState({
        table_data:[],
        isLoaded: true
      });
    }
  }
  
  getPatientList = async () => {
    let path = "/app/api/v2/dial/patient/list";
    var post_data = {
    }
    const { data } = await axios.post(path, {param:post_data});
    if(data != undefined && data !=null && data.data != undefined && data.data != null && data.data.length > 0){
      var temp = [];
      data.data.map(item=>{
        item.name = item.patient_name;
        item.number = item.patient_number;
        temp.push(item.patient_number);
      });
      this.setState({
        selected_patients_list:temp,
        patientList:data.data
      });
    } else {
      this.setState({
        patientList:[]
      });
    }
  };
  
  closeModal = () => {
    this.setState({
      isShowPatientList: false,
      isShowStaffList: false,
      isOpenPrintPreviewModal: false
    })
  };
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }
  
  getStartDate = value => {
    this.setState({
      start_date: value,
      isLoaded: false
    }, ()=>{
      this.getSendingData();
    });
  };
  
  getEndDate = value => {
    this.setState({
      end_date: value,
      isLoaded: false
    }, ()=>{
      this.getSendingData();
    });
  };
  
  showPatientList = () => {
    this.setState({
      isShowPatientList:true
    });
  }
  
  showStaffList = () => {
    this.setState({
      isShowStaffList:true
    });
  }
  
  selectPatients = (patients) => {
    this.setState({
      // patient_name:patient.patient_name,
      selected_patients_list:patients,
      patient_ids: patients,
      isLoaded: false
    }, () => {
      this.getSendingData();
    })
    this.closeModal();
  }
  
  selectStaff = (staff) => {
    this.setState({
      staff_name:staff.name,
      staff_id: staff.number,
    })
    this.closeModal();
  }
  
  clearPatient = () => {
    this.setState({
      patient_name: "",
      patient_id: 0,
    });
    this.closeModal();
  }
  
  clearStaff = () => {
    this.setState({
      staff_name:"",
      staff_id: 0,
    });
    this.closeModal();
  }
  
  changeCheck = (index, name, value)=> {
    if (name == 'print_or_not'){
      var temp = this.state.table_data;
      temp[index].print_or_not = value;
      this.setState({table_data:temp});
    }
  }
  
  switchDisplay = (name, value) => {
    switch(name){
      case 'all_sending':
        if (value){
          this.setState({
            display_all:value,
            display_next:1,
            display_continue:1,
            display_dr:1,
            display_va_continue:1,
          })
        } else {
          this.setState({
            display_all:value,
            display_next:0,
            display_continue:0,
            display_dr:0,
            display_va_continue:0,
          })
        }
        break;
      case 'next_sending':
        if (value==0){
          this.setState({
            display_next:value,
            display_all:0
          });
        } else {
          if (this.state.display_continue && this.state.display_dr && this.state.display_va_continue){
            this.setState({display_next:value, display_all:1})
          } else {
            this.setState({display_next:value})
          }
        }
        break;
      case 'dr_sending':
        if (value==0){
          this.setState({
            display_dr:value,
            display_all:0
          });
        } else {
          if (this.state.display_continue && this.state.display_next && this.state.display_va_continue){
            this.setState({display_dr:value, display_all:1})
          } else {
            this.setState({display_dr:value})
          }
        }
        break;
      case 'continue_sending':
        if (value==0){
          this.setState({
            display_continue:value,
            display_all:0
          });
        } else {
          if (this.state.display_dr && this.state.display_next && this.state.display_va_continue){
            this.setState({display_continue:value, display_all:1})
          } else {
            this.setState({display_continue:value})
          }
        }
        break;
      case 'va_continue':
        if (value==0){
          this.setState({
            display_va_continue:value,
            display_all:0
          });
        } else {
          if (this.state.display_dr && this.state.display_next && this.state.display_continue){
            this.setState({display_va_continue:value, display_all:1})
          } else {
            this.setState({display_va_continue:value})
          }
        }
        break;
    }
  }
  
  changeDateSetting = e => {
    this.setState({
      date_setting:parseInt(e.target.value),
      isLoaded: false
    }, () => {
      this.getSendingData();
    })
  }
  
  PrevDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    this.setState({
      schedule_date: cur_day,
      start_date:cur_day,
      end_date:cur_day,
      isLoaded: false
    }, () => {
      this.getSendingData();
    });
    
  };
  
  NextDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    this.setState({
      schedule_date: cur_day,
      start_date:cur_day,
      end_date:cur_day,
      isLoaded: false
    }, () => {
      this.getSendingData();
    });
  };
  
  getDate = value => {
    this.setState({
      schedule_date: value,
      start_date:value,
      end_date:value,
      isLoaded: false
    }, () => {
      this.getSendingData();
    });
  };
  
  goBedside = (system_patient_id, schedule_date) => {
    sessApi.setObjectValue("from_print", "schedule_date", schedule_date);
    sessApi.setObjectValue("from_print", "system_patient_id", system_patient_id);
    sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.Sending);
    this.props.history.replace("/dial/board/system_setting");
  };
  
  openPreviewModal = () => {
    this.setState({isOpenPrintPreviewModal: true})
  }
  
  hasShemaImage = () => {
    if (this.state.table_data.length <= 0) return;
    
    let result = false;
    this.state.table_data.map(item=>{
      if (item.image_path != null && item.image_path != "" && item.imgBase64 != "") {
        result = true
      }
    });
    
    return result;
  }
  
  openShema = (item) => {
    this.setState({
      isOpenShemaModal: true,
      imgBase64: item.imgBase64,
      image_comment: item.image_comment,
      title: item.title
    });
  }
  
  handleClick = (e, system_patient_id, schedule_date) => {
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
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
          system_patient_id,
          schedule_date,
        },
      });
    }
  }
  
  
  closeShemaModal = () => {
    this.setState({
      isOpenShemaModal: false
    })
  }
  
  goOtherPage (url){
    this.props.history.replace(url);
  }
  
  render() {
    let {table_data} = this.state;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className={this.state.date_setting != 1 ? "example-custom-input disabled":"example-custom-input"} style={{cursor:this.state.date_setting == 1 ? 'pointer' : ''}} onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    const CustomDateInput = ({value, onClick}) => (
      <div className={"custom-date-input"} onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    
    let tr_count = 0;

    if (this.cache_patient != undefined && this.cache_patient != null && this.cache_schedule_date != undefined && this.cache_schedule_date != null){
      var patient_id = this.cache_patient.system_patient_id;
      var schedule_date = this.cache_schedule_date;
    }
    return (
      <Card>
        <div className = "flex">
          <div className="title">申し送り一覧</div>
          {this.state.schedule_date != "" && (
            <>
              <div className="prev-day" onClick={this.PrevDay}>{"< "}</div>
              <DatePicker
                locale="ja"
                selected={this.state.schedule_date}
                onChange={this.getDate.bind(this)}
                dateFormat="yyyy/MM/dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dayClassName = {date => setDateColorClassName(date)}
                customInput={<CustomDateInput />}
              />
              <div className="next-day" onClick={this.NextDay}>{" >"}</div>
            </>
          )}
          <div className="others">
            {this.cache_patient != undefined && this.cache_patient != null && this.cache_schedule_date != undefined && this.cache_schedule_date != null && (
              <>
                <Button className="" onClick = {this.goBedside.bind(this, patient_id, schedule_date)}>患者別に戻る</Button>
              </>
            )}
            <Button className="disable-button">申し送り一覧</Button>
            <Button onClick={this.goOtherPage.bind(this,"/print/DrProposal")}>Dr上申</Button>
            <Button onClick={this.goOtherPage.bind(this,"/print/InstructionPrint")}>指示</Button>
          </div>
        </div>
        <SearchPart>
          <div className = "select_date_range">
            <div className={'select-period'}>
              {this.state.start_date != "" && (
                <>
                  <div className="radio-label">期間</div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.start_date}
                    onChange={this.getStartDate.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                    disabled={this.state.date_setting != 1 ? true:false}
                    customInput={<ExampleCustomInput />}
                  />
                  <span>～</span>
                  <DatePicker
                    locale="ja"
                    selected={this.state.end_date}
                    onChange={this.getEndDate.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                    disabled={this.state.date_setting != 1 ? true:false}
                    customInput={<ExampleCustomInput />}
                  />
                </>
              )}
            </div>
            <div className='radio-area'>
              <Radiobox
                label={'本日'}
                value={0}
                getUsage={this.changeDateSetting.bind(this)}
                checked={this.state.date_setting === 0 ? true : false}
                name={`date-setting`}
              />
              <Radiobox
                label={'期間指定'}
                value={1}
                getUsage={this.changeDateSetting.bind(this)}
                checked={this.state.date_setting === 1 ? true : false}
                name={`date-setting`}
              />
              <Radiobox
                label={'全期間'}
                value={2}
                getUsage={this.changeDateSetting.bind(this)}
                checked={this.state.date_setting === 2 ? true : false}
                name={`date-setting`}
              />
            </div>
          </div>
          <div className='checkbox-area'>
            <Checkbox
              label = "全て"
              getRadio={this.switchDisplay.bind(this)}
              value={this.state.display_all}
              checked={this.state.display_all === 1}
              name="all_sending"
            />
            <Checkbox
              label = "次回申し送り"
              getRadio={this.switchDisplay.bind(this)}
              value={this.state.display_next}
              checked={this.state.display_next === 1}
              name="next_sending"
            />
            <Checkbox
              label = "継続申し送り"
              getRadio={this.switchDisplay.bind(this)}
              value={this.state.display_continue}
              checked={this.state.display_continue === 1}
              name="continue_sending"
            />
            <Checkbox
              label = "VA継続申し送り"
              getRadio={this.switchDisplay.bind(this)}
              value={this.state.display_va_continue}
              checked={this.state.display_va_continue === 1}
              name="va_continue"
            />
            <Checkbox
              label = "Dr上申"
              getRadio={this.switchDisplay.bind(this)}
              value={this.state.display_dr}
              checked={this.state.display_dr === 1}
              name="dr_sending"
            />
          </div>
          <div className="select_patient"><Button onClick={this.showPatientList.bind(this)}>患者選択</Button></div>
          
          {/* <div className='direct_man' onClick={this.showStaffList.bind(this)}>
                      <InputWithLabel
                          label="スタッフ指定"
                          type="text"
                          diseaseEditData={this.state.staff_name}
                      />
                  </div>                     */}
          {/* <Button type="mono" onClick={this.getSendingData} className={this.state.curFocus === 1?"focus": ""}>検索</Button>                                */}
        </SearchPart>
        <Wrapper>
          <table className="table table-bordered table-hover">
            <thead>
            <tr>
              <th className='item-no'>No</th>
              <th style={{width:'5.625rem'}}>患者番号</th>
              <th className="patient-name">患者氏名</th>
              <th className="code-number">日付</th>
              <th style={{width:'8rem'}}>カテゴリー</th>
              <th className='name'>本文</th>
              <th style={{width:"12rem"}}>入力者</th>
              <th style={{width:"12rem"}}>完了者</th>
              {/* {this.hasShemaImage() && (
                                <th></th>
                                )} */}
            </tr>
            </thead>
            <tbody id="code-table">
            {this.state.isLoaded == false ? (
              <div className='spinner-disease-loading center'>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            ):(
              <>
                {table_data !== undefined && table_data !== null && table_data.length > 0 && this.state.staff_list_by_number != undefined && (
                  table_data.map((item) => {
                    if (this.state.display_all || (this.state.display_next && item.category =='次回申し送り') || (this.state.display_continue && item.category =='継続申し送り') || (this.state.display_dr && item.category =='Dr上申') || (this.state.display_va_continue && item.category =='VA継続申し送り')){
                      tr_count++;
                      return (
                        <>
                          <tr onContextMenu={e => this.handleClick(e, item.system_patient_number, item.updated_at.split(' ')[0])}>
                            <td className="text-right item-no">{tr_count}</td>
                            <td style={{width:'5.625rem'}} className="text-right a_tag " onClick={this.goBedside.bind(this, item.system_patient_number, item.updated_at.split(' ')[0])}>
                              {item.patient_number}
                            </td>
                            <td className="text-left a_tag patient-name" onClick={this.goBedside.bind(this, item.system_patient_number, item.updated_at.split(' ')[0])}>
                              {item.patient_name}
                            </td>
                            <td className={'text-left code-number'}>{formatJapanDate(item.updated_at.split(' ')[0])}</td>
                            <td className={'text-left'} style={{width:'8rem'}}>{item.category}</td>
                            <td className='name' style={{textAlign:'left'}}>
                              {displayLineBreak(stripHtml(item.message))}
                              {this.hasShemaImage() && item.image_path != null && item.image_path != "" && item.imgBase64 != "" && (
                                <Button onClick={()=>this.openShema(item)}>シェーマ</Button>
                              )}
                            </td>
                            <td className={'text-left'} style={{width:"12rem"}}>{this.state.staff_list_by_number[item.created_by]}</td>
                            <td className={'text-left'} style={{width:"12rem"}}>{item.completed_by!=null?this.state.staff_list_by_number[item.completed_by]:''}</td>
                          </tr>
                        </>
                      )
                    }
                  })
                )}
              </>
            )}
            </tbody>
          </table>
        </Wrapper>
        <div className="footer-buttons">
          <Button className="red-btn" onClick={this.openPreviewModal}>帳票プレビュー</Button>
        </div>
        
        {this.state.isShowStaffList !== false && (
          <DialSelectMasterModal
            selectMaster = {this.selectStaff}
            closeModal = {this.closeModal}
            MasterCodeData = {this.state.staffs}
            MasterName = 'スタッフ'
            clearItem = {this.clearStaff}
          />
        )}
        {this.state.isShowPatientList !== false && (
          <DialMultiSelectPatientModal
            selectMasters = {this.selectPatients}
            closeModal = {this.closeModal}
            selected_masters_list = {this.state.selected_patients_list}
            clearItem = {this.clearPatient}
          />
        )}
        {this.state.isOpenPrintPreviewModal !== false && (
          <PrintSendingPreview
            closeModal = {this.closeModal}
            table_data = {this.state.table_data}
            start_date = {this.state.start_date}
            end_date = {this.state.end_date}
            date_setting = {this.state.date_setting}
            display_all = {this.state.display_all}
            display_continue = {this.state.display_continue}
            display_dr = {this.state.display_dr}
            display_next = {this.state.display_next}
            display_va_continue = {this.state.display_va_continue}
            staff_list_by_number = {this.state.staff_list_by_number}
          />
        )}
        {this.state.isOpenShemaModal === true && (
          <DialShowShemaModal
            closeModal={this.closeShemaModal}
            imgBase64={this.state.imgBase64}
            image_comment={this.state.image_comment}
            title={this.state.title}
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

SendingList.contextType = Context;

SendingList.propTypes = {
  history:PropTypes.object,
};

export default SendingList