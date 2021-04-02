import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import DialSideBar from "~/components/templates/Dial/DialSideBar";
import DialPatientNav from "~/components/templates/Dial/DialPatientNav";
import Button from "~/components/atoms/Button";
import {formatJapanDate, formatDateLine, formatTimeIE,getNextDayByJapanFormat, getPrevDayByJapanFormat, getPrevMonthByJapanFormat} from "~/helpers/date";
import Radiobox from "~/components/molecules/Radiobox";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as apiClient from "~/api/apiClient";
import * as methods from "~/components/templates/Dial/DialMethods";
import {makeList_code, displayLineBreak, setDateColorClassName} from "~/helpers/dialConstants";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
registerLocale("ja", ja);
import DrKartePrintModal from "~/components/templates/Dial/Board/molecules/printSheets/DrKartePrintModal";
import renderHTML from 'react-render-html';
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 20rem;
  display: flex;
`;

const Wrapper = styled.div`  
    position: fixed;  
    top: 70px;
    height: calc(100vh - 100px);
    font-size: 14px;
    width: calc(100% - 390px);
    left:200px;
    padding:20px;
    padding-top: 10px;
    .title {
        font-size: 2rem;
        padding-left: 7px;
        border-left: solid 5px #69c8e1;
    }
    .period{
        .label-title{
            display:none;
        }
        .pd-15{
            margin-top: 10px;
            margin-left: 3px;
            margin-right: 3px;
        }
        margin-bottom: 10px;
    }
    .border-bottom {
        border-bottom: solid 1px #eee;
        margin-left: 10px;
        margin-top: 5px;
    }
    .comment-required{
        color:red;
    }
    .title-td{
        text-align:center;        
    }
    span {
        color: blue;
        font-weight: bolder;
    }
    .flex {
        display: flex;
        flex-wrap: wrap;
    }
    .medical-record {
        display: flex;
    }
    .row {
        margin: 0;
    }
    td{
        p{
            margin-bottom:0px;
        }
    }
    .right-end{
      float:right;
      color:black;
    }
    .left-end{
      color:black;
    }
 `;
const LeftContent = styled.div`  
 width: 100%;
 height: 100%;
 .add-btn-area {
    padding-top: 8px;
    div {
        padding-left: 15px;
    }
 }
 .MyCheck{
    margin-left: 24px;
    margin-bottom: 5px;
    label{
      font-size: 16px;
      margin-right: 10px;
    }
  }
 .checkbox-group{
   display: flex;
  .gender {
    font-size: 14px;
      margin-top: 5px;
      .gender-label {
          width: 23%;
          float: left;
          text-align: right;
          margin-top: 5px;
      }
      .radio-btn label{
            width: 23%;
            border: solid 1px rgb(206, 212, 218);
            border-radius: 4px;
            margin-left: 5px;
      }
  }
  .before-treat{
    width:48%;
    .title {
        border-bottom: solid 1px #ddd;
    }
  }
  .after {
    margin-left: 4%;
  }
}
.middle-content {
    margin-top: 10px;
}

.use-history {
    margin-top: 10px;
    .VAManager__List-sc-1pyghe7-3 {
        height: 10%;
    }
}
.day-area {    
    width: 280px;
    font-size: 20px;
}
.no-tag {
    width: calc(100% - 470px);
}
.course{
    padding-top: 5px;
    width: 90px;
    text-align: right;
    cursor: pointer;
    margin-right: 10px;
    svg {
        margin-left: 0;
    }
}
.finding{
    padding-top: 5px;
    width: 90px;
    text-align: left;
    cursor: pointer;
    svg {
        margin-left: 0;
    }
}
   .from-to {
    padding-left: 5px;
    padding-right: 5px;
    line-height: 30px;
  }
  .prev-day {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 30px;
    padding-left: 5px;
    padding-right: 5px;
  }
  .next-day {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 30px;
    padding-left: 5px;
    padding-right: 5px;
  }
  .select-today {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 30px;
    margin-left: 5px;
    margin-right: 5px;
    padding-left: 5px;
    padding-right: 5px;
  }
  .react-datepicker-wrapper {
    input {
        width: 110px;
    }
  }
  .date-area {
    .MyCheck {
        label {
            line-height: 30px;
        }   
    }
  }
 `;

const List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 0.875rem;
    width: 100%;
    margin-right: 2%;
    float: left;    
    label {
        margin: 0;
    }
    table {
        thead{
            display:table;
            width:calc(100% - 1rem);
        }
        tbody{
            display:block;
            overflow-y: scroll;
            height: calc( 100vh - 23rem);
            width:100%;
        }
        tr{
            display: table;
            width:100%;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        td {
            padding: 0.25rem;            
            input {
                margin: 0;
            }
            word-break:break-all;
            word-wrap:break-word;
            width:50%;
        }
        th {
            text-align: center;
            padding: 0.3rem;
            word-break:break-all;
            word-wrap:break-word;
        }
        .last-th{
            border-right-style:none;
        }
         .top-div {
          margin-top: -1.5rem;
         }
    }
    .w50{
        width:50%;
    }
    .tl {
        text-align: left;
    }
    .tr {
        text-align: right;
    }
 `;

class DoctorKarte extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        let patientInfo = sessApi.getObjectValue("dial_setting","patient");        
        var oneMonthago = new Date();        
        oneMonthago.setMonth(oneMonthago.getMonth()-1);
        this.state = {
            isInputPanelModal:false,
            isLoaded:false,
            kind:'',            
            patientInfo,
            start_date:oneMonthago,
            end_date: new Date(),
            karte_list:{},
            isOpenMedicalHistoryModal: false,
            isOpenInsulinManageModal: false,
            select_date_type: 2
        }
    }

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         patientInfo: nextProps.patientInfo,
    //         patientId: nextProps.patientId,            
    //     }, () => {
    //         this.getKarteInfo();
    //     });
    // }
    
    getDrKarteStyle = async () => {
        let path = "/app/api/v2/management/config/get_drkarte_style";
        await apiClient.post(path).then(res=>{
            this.setState({drkarte_style: res});
        })
    }

    async componentDidMount () {
        let material_master = sessApi.getObjectValue("dial_common_master","material_master");
        let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
        let from_daily_print_date = JSON.parse(window.sessionStorage.getItem("from_daily_print"));
        await this.getDrKarteStyle();
        this.setState({
            examinationCodeData,
            examination_codes:makeList_code(examinationCodeData),
            puncture_needle_a:makeList_code(material_master['穿刺針']),
            puncture_needle_v:makeList_code(material_master['穿刺針']),
            dialysates:makeList_code(material_master['透析液']),
            disinfection_liquid:makeList_code(material_master['消毒薬']),
            fixed_tape:makeList_code(material_master['固定テープ']),
        });
        if (from_daily_print_date != undefined && from_daily_print_date != null){
            this.setState({end_date:new Date(from_daily_print_date)});
        }
        await this.getStaffs();
        await this.getDoctors();
        await this.getFacility();

        let patientInfo = sessApi.getObjectValue("dial_setting","patient");
        if (patientInfo == undefined || patientInfo == null){
            this.setState({
              isLoaded: true
            });
            return;
        }
        this.getKarteInfo();
    }

    getKarteInfo = async() => {
        let patientInfo = sessApi.getObjectValue("dial_setting","patient");
        if (patientInfo == undefined || patientInfo == null){
            this.setState({
              isLoaded: true
            });
            return;
        }
        let path = "/app/api/v2/dial/board/Karte/search";
        await apiClient
            ._post(path, {
                params: {
                    is_enabled:1,
                    system_patient_id: patientInfo.system_patient_id,
                    from_date : this.state.start_date != "" ? formatDateLine(this.state.start_date) : formatDateLine(this.state.end_date),
                    end_date : formatDateLine(this.state.end_date),
                    blank_instruction: 1
                    // date:formatDateLine(this.state.schedule_date),
                }
            })
            .then((res) => {
                this.setState({
                    karte_list:res['karte_list'],
                    isLoaded: true
                })
            })
            .catch(() => {
                this.setState({
                    isLoaded: true
                });
            });
    }

    getInputStartdate = value => {
        this.setState({start_date: value, isLoaded: false}, () => {
            this.getKarteInfo();
        });
    };

    getInputEnddate = value => {
        this.setState({end_date: value, isLoaded: false}, () => {
            this.getKarteInfo();
        });
    };

    selectPatient = patientInfo =>{
        this.setState({patientInfo:patientInfo, isLoaded: false}, ()=>{
            this.getKarteInfo();
        })
    }

    checkSO = (category) => {
        if((category =='Drカルテ/経過') || category =="Drカルテ/所見" ) return true;
        else return false;
    }

    closeModal = () => {
        this.setState({
            isEditPrescriptModal:false,
            isInputPanelModal:false,
            isPreviewModal:false,
            isTempInspectionMOdal:false,
            isEditInjectionModal:false,
            isOpenMedicalHistoryModal:false,
            isOpenInsulinManageModal:false,
            isOpenPrintModal:false,
        });
    }

    handleOk = () => {
        this.closeModal();
        this.getKarteInfo();
        this.props.refreshScheduleInfo(this.state.patientInfo.system_patient_id, this.state.schedule_date);
    };

    printPreview = () => {
        let patientInfo = sessApi.getObjectValue("dial_setting","patient");
        if(patientInfo == undefined || patientInfo == null){
            window.sessionStorage.setItem("alert_messages", '患者様を選択してください。');
            return;
        }
        this.setState({
            isPreviewModal: true,
            print_data: this.state.karte_list
        })
    };

   printPreview_new = () => {
        let patientInfo = this.state.patientInfo;
        if(patientInfo == undefined || patientInfo == null || Object.keys(patientInfo).length === 0 || patientInfo.system_patient_id == undefined){
            window.sessionStorage.setItem("alert_messages", '患者様を選択してください。');
            return;
        }
        this.setState({isOpenPrintModal:true});        
    };
    setDate = (e) =>{
        let end_date = this.state.end_date;
        let start_date = this.state.start_date;
        if(parseInt(e.target.value) === 0){
            end_date = new Date();
            start_date = '';
        }
        if(parseInt(e.target.value) === 1){
            end_date = "";
            start_date = '';
        }
        if(parseInt(e.target.value) === 2){
            if(end_date === ''){
                end_date = new Date();
            }
            start_date = getPrevMonthByJapanFormat(end_date);
        }

        this.setState({
            select_date_type:parseInt(e.target.value),
            end_date,
            start_date,
            isLoaded: false
        },()=>{
            this.getKarteInfo();
        })
    };

    moveDay = (type) => {
        let now_day = this.state.end_date;
        if(now_day === ''){
            now_day = new Date();
        }
        let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
        this.setState({
            end_date: cur_day,
            select_date_type:0,
            start_date:"",
            isLoaded: false
        }, ()=>{
            this.getKarteInfo();
        });
    };

    selectToday=()=>{
        this.setState({
            end_date: new Date(),
            select_date_type:0,
            start_date:"",
            isLoaded: false
        },()=>{
            this.getKarteInfo();
        });
    }
    prescriptionRender = (pres_array) => {
        let max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.drkarte_display_width !== undefined ? this.state.drkarte_style.drkarte_display_width : 80;
        return (pres_array.map(item=> {
            let lines = parseInt(item.left_str.length / max_length);
            let mods = (item.left_str.length % max_length + item.right_str.length) > max_length;
            let topstyle = lines > 0 && !mods;
            return (
              <div className="" key={item} style={{clear:"both"}}>
                  <div className="left-div" style={(item.rp_key === undefined || item.rp_key >0) ? {float:"left"}:{float: "left", marginLeft:"1.5rem"}}>{item.left_str}</div>
                  <div className={topstyle?"top-div":""} style={item.is_usage == 1 ? {float:"right", marginRight:"3rem"}:{float:"right"}}>{item.right_str}</div>
              </div>
            )
        }))
    }
    IsJsonString = (str) => {
        try {
            var json = JSON.parse(str);
            return (typeof json === 'object');
        } catch (e) {
            return false;
        }
    }

    render() {        
        let { karte_list, doctor_list_by_number} = this.state;        
        return (
            <>
            <DialSideBar
                onGoto={this.selectPatient}
                history = {this.props.history}
            />
            <DialPatientNav
                patientInfo={this.state.patientInfo}
                history = {this.props.history}
            />
            <Wrapper>    
                <div className="title">カルテ</div>            
                <div className="flex medical-record">
                    <LeftContent>
                        <form name="frmPopup" method="post">
                            <input type="hidden" name="type" />
                            <input type="hidden" name="patientInfo" />                  
                            <input type="hidden" name="staffs" />
                            <input type="hidden" name="examination_codes" />
                            <input type="hidden" name="data" />
                            <input type="hidden" name="disease" />
                        </form>
                        <div className="date-area">
                            <div className="MyCheck flex">
                                <Radiobox
                                    label="日付指定"
                                    value={0}
                                    getUsage={this.setDate.bind(this)}
                                    checked={this.state.select_date_type === 0 ? true : false}
                                    name={`date-set`}
                                />
                                <div className="prev-day" onClick={this.moveDay.bind(this, 'prev')}>{"＜ "}</div>
                                <div className={'select-today'} onClick={this.selectToday.bind()}>本日</div>
                                <div className="next-day" onClick={this.moveDay.bind(this, 'next')}>{" ＞"}</div>
                            </div>
                            <div className="MyCheck flex">
                                <Radiobox
                                    label="期間指定"
                                    value={2}
                                    getUsage={this.setDate.bind(this)}
                                    checked={this.state.select_date_type === 2 ? true : false}
                                    name={`date-set`}
                                />
                                <div className={'d-flex'}>
                                    <DatePicker
                                        locale="ja"
                                        selected={this.state.start_date}
                                        onChange={this.getInputStartdate.bind(this)}
                                        dateFormat="yyyy/MM/dd"
                                        placeholderText="年/月/日"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        disabled={this.state.select_date_type === 2 ?  false : true}
                                        dayClassName = {date => setDateColorClassName(date)}
                                    />
                                    <div className={'from-to'}>～</div>
                                    <DatePicker
                                        locale="ja"
                                        selected={this.state.end_date}
                                        onChange={this.getInputEnddate.bind(this)}
                                        dateFormat="yyyy/MM/dd"
                                        placeholderText="年/月/日"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        disabled={this.state.end_date === '' ?  true : false}
                                        dayClassName = {date => setDateColorClassName(date)}
                                    />
                                </div>
                            </div>
                        </div>
                        <List>
                            <table className="table-scroll table table-bordered" id="medical-record-table">
                                <thead>
                                <tr>
                                    <th className="text-center w50">透析経過</th>
                                    <th className="text-center last-th w50">処置・検査・処方</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {this.state.isLoaded == false ? (
                                      <div className='spinner-disease-loading center'>
                                        <SpinnerWrapper>
                                          <Spinner animation="border" variant="secondary" />
                                        </SpinnerWrapper>
                                      </div>
                                    ):(
                                      <>
                                        {karte_list !==undefined && karte_list !==null && (
                                            Object.keys(karte_list).map((key) => {
                                                let item =karte_list[key];
                                                var doctors = [];
                                                if (item.karte.length != 0){
                                                    if (item.karte[Object.keys(item.karte)[0]][0] != undefined){
                                                        doctors.push(item.karte[Object.keys(item.karte)[0]][0].instruction_doctor_number);
                                                    }
                                                }
                                                return (
                                                    <>
                                                        <tr>
                                                            <td className="flex-td course-td" style={{background:"lightblue"}} onContextMenu={e => this.handleClick(e, null, null, key, 0)}>
                                                                <div className="date-area">{formatJapanDate(key)}</div>                                                        
                                                            </td>
                                                            <td className="title-td" onContextMenu={e => this.handleClick(e, null, null, key, 1)}>
                                                                {item.dial.length==0 && item.karte.length !=0 && doctor_list_by_number != undefined && (
                                                                    <><span>非透析日{doctors.length> 0 && doctor_list_by_number[doctors[0]] !== undefined ? '('+ doctor_list_by_number[doctors[0]] +')':''}</span></>
                                                                )}
                                                                {item.dial.length>0 && (
                                                                    <><span>透析実施</span></>
                                                                )}
                                                                {item.dial[0] != null && doctor_list_by_number != undefined && (item.dial[0].start_date == null && item.dial[0].console_start_date ==null) &&(
                                                                    <><span>(未実施){doctors.length> 0 && doctor_list_by_number[doctors[0]] !== undefined ? '('+ doctor_list_by_number[doctors[0]] +')':''}</span></>
                                                                )}
                                                                {doctor_list_by_number != undefined && item.dial.length > 0 && (item.dial[0].start_date != null || item.dial[0].console_start_date !=null) && (
                                                                  <>
                                                                  {doctors.length > 0 && (
                                                                      <>
                                                                        <span>&nbsp;回診({doctor_list_by_number[doctors[0]]})&nbsp;&nbsp;</span>
                                                                      </>
                                                                  )}
                                                                  {item.dial[0] != null && (
                                                                      <>
                                                                      <span>
                                                                        {item.dial[0].start_date != null ? formatTimeIE(item.dial[0].start_date) : 
                                                                          item.dial[0].console_start_date != null? formatTimeIE(item.dial[0].console_start_date) :''}
                                                                      </span>
                                                                      <span>&nbsp;{(item.dial[0].start_date != null || item.dial[0].console_start_date != null)? "~" : ""}&nbsp;</span>
                                                                      <span>&nbsp;
                                                                        {item.dial[0].end_date != null ? formatTimeIE(item.dial[0].end_date) : 
                                                                        // item.dial[0].console_end_date != null ? formatTimeIE(item.dial[0].console_end_date) :
                                                                        ""}
                                                                      &nbsp;</span>
                                                                      <span>&nbsp;透析時間</span>
                                                                      </>
                                                                  )}
                                                                </>
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="title-td course-td">
                                                            {item.dial.length != 0 && item.karte.length != 0 && (
                                                                <div style={{cursor:"pointer"}}>
                                                                    <span>
                                                                        体重:{item.dial[0] != null && item.dial[0].weight_before != null && item.dial[0].weight_before > 0? parseFloat(item.dial[0].weight_before).toFixed(1)+ "kg⇒" : "0kg⇒"}
                                                                        {item.dial[0] != null && item.dial[0].weight_after != null &&item.dial[0].weight_after > 0 ? parseFloat(item.dial[0].weight_after).toFixed(1)+ "kg" : "0kg"}
                                                                    </span>&nbsp;&nbsp;
                                                                    <span>
                                                                        血圧:{item.dial[0] != null && item.dial[0].bp_pressure_max != null ? item.dial[0].bp_pressure_max: 0}/{item.dial[0] != null && item.dial[0].bp_pressure_min != null ? item.dial[0].bp_pressure_min:0}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            </td>
                                                            <td/>
                                                        </tr>
                                                        {item.karte != null && item.karte.length !=0 && item.karte['検査実施'] != undefined && item.karte['検査実施'].length > 0 && (
                                                          <tr>
                                                            <td></td>
                                                            <td>
                                                              <div style={{clear:'both'}}>
                                                              {item.karte['検査実施'].map(sub_item => {
                                                                return displayLineBreak(sub_item.body);
                                                              })}
                                                              </div>
                                                            </td>
                                                          </tr>
                                                        )}
                                                        {item.karte != null && item.karte.length !=0 && item.karte['注射実施'] != undefined && item.karte['注射実施'].length > 0 && (
                                                          <tr>
                                                            <td></td>
                                                            <td>
                                                              <div style={{clear:'both'}}>
                                                              {item.karte['注射実施'].map(sub_item => {
                                                                return displayLineBreak(renderHTML(sub_item.body));
                                                              })}
                                                              </div>
                                                            </td>
                                                          </tr>
                                                        )}                                                        
                                                        {item.karte != null && item.karte.length !=0 && doctor_list_by_number != undefined && (
                                                            Object.keys(item.karte).map((sub_key) => {
                                                                return(
                                                                    <>
                                                                    <tr>
                                                                        <td className='course-td' onContextMenu={e => this.handleClick(e, sub_key, item.karte[sub_key], key, 0)}>
                                                                            {item.karte[sub_key].map((sub_karte_item) => {
                                                                                var check_doctor = doctors.includes(sub_karte_item.instruction_doctor_number);
                                                                                if (check_doctor == false) doctors.push(sub_karte_item.instruction_doctor_number);
                                                                                if(sub_karte_item.category_2 == '経過'){

                                                                                    return(
                                                                                    <>
                                                                                    <div>
                                                                                        (経過{check_doctor?'':':' + doctor_list_by_number[sub_karte_item.instruction_doctor_number]})
                                                                                        {renderHTML(sub_karte_item.body)}
                                                                                    </div>
                                                                                    </>
                                                                                    )
                                                                                }
                                                                            })}
                                                                        </td>
                                                                        <td onContextMenu={e => this.handleClick(e, sub_key, item.karte[sub_key], key, 1)}>
                                                                            {item.karte[sub_key].map((sub_karte_item) => {
                                                                                var check_doctor = doctors.includes(sub_karte_item.instruction_doctor_number);
                                                                                if (check_doctor == false) doctors.push(sub_karte_item.instruction_doctor_number);
                                                                                if(sub_karte_item.category_2 != '経過'){
                                                                                    if (sub_karte_item.category_2 == '指示' && sub_karte_item.body != ""){
                                                                                        return(
                                                                                            <>
                                                                                            <div>
                                                                                                （指示 {check_doctor?'':':' + doctor_list_by_number[sub_karte_item.instruction_doctor_number]}）
                                                                                                {renderHTML(sub_karte_item.body)}
                                                                                            </div>
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                    if (sub_karte_item.category_2 == '装置操作履歴'){
                                                                                        return(
                                                                                            <>
                                                                                            <div>                                                                                        
                                                                                                {displayLineBreak(sub_karte_item.body)}
                                                                                            </div>
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                    if (sub_karte_item.category_2 == '透析条件'){
                                                                                        return(
                                                                                            <>
                                                                                            {sub_karte_item.category_2 !== '指示' && check_doctor != true && sub_karte_item.instruction_doctor_number != null && (
                                                                                                <div>(指示ドクター:{doctor_list_by_number[sub_karte_item.instruction_doctor_number]})</div>
                                                                                            )}
                                                                                            <div>{displayLineBreak(sub_karte_item.body)}</div>
                                                                                            </>
                                                                                        )
                                                                                    }                                                                            
                                                                                    if (sub_karte_item.category_2.includes('処方')){
                                                                                        return(
                                                                                            <>
                                                                                            {check_doctor != true && sub_karte_item.instruction_doctor_number != null && (
                                                                                                <div>(指示ドクター:{doctor_list_by_number[sub_karte_item.instruction_doctor_number]})</div>
                                                                                            )}
                                                                                            {this.IsJsonString(sub_karte_item.body) ? (
                                                                                              <div>{this.prescriptionRender(JSON.parse(sub_karte_item.body))}</div>
                                                                                            ):(
                                                                                              <div>{displayLineBreak(sub_karte_item.body)}</div>
                                                                                            )}
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                    if (sub_karte_item.category_2.includes('注射') && sub_karte_item.category_2 != '注射実施'){
                                                                                        return(
                                                                                            <>
                                                                                            {check_doctor != true && sub_karte_item.instruction_doctor_number != null && (
                                                                                                <div>(指示ドクター:{doctor_list_by_number[sub_karte_item.instruction_doctor_number]})</div>
                                                                                            )}
                                                                                            <div>{displayLineBreak(sub_karte_item.body)}</div>
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                    if (sub_karte_item.category_2.includes('検査') && sub_karte_item.category_2 != '検査実施'){
                                                                                        return(
                                                                                            <>
                                                                                            {check_doctor != true && sub_karte_item.instruction_doctor_number != null && (
                                                                                                <div>(指示ドクター:{doctor_list_by_number[sub_karte_item.instruction_doctor_number]})</div>
                                                                                            )}
                                                                                            <div>{displayLineBreak(sub_karte_item.body)}</div>
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                    if (sub_karte_item.category_2 == 'インスリン'){
                                                                                        return(
                                                                                            <>
                                                                                            {check_doctor != true && sub_karte_item.instruction_doctor_number != null && (
                                                                                                <div>(指示ドクター:{doctor_list_by_number[sub_karte_item.instruction_doctor_number]})</div>
                                                                                            )}
                                                                                            <div>{displayLineBreak(sub_karte_item.body)}</div>
                                                                                            </>
                                                                                         )
                                                                                    }
                                                                                }
                                                                            })}
                                                                        </td>
                                                                    </tr>
                                                                    </>
                                                                )
                                                            })
                                                        )}
                                                        {item.manage != null && item.manage.length > 0 ? (
                                                            item.manage.map(manage_item => {
                                                                return(
                                                                    <>
                                                                        <tr>
                                                                            <td className='course-td'/>
                                                                            <td style = {{background:'antiquewhite', textAlign:'left'}} className = {manage_item.is_comment_requiered ==1 && manage_item.comment == null?"comment-required":""}>
                                                                                <div>【管理料 指導料など】</div>
                                                                                <div>{manage_item.name}</div>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )        
                                                            })
                                                        ):(<></>)}
                                                        {item.inspect != null && item.inspect.length >0 && this.state.examination_codes !== undefined && (
                                                            item.inspect.map((pres_item)=>{
                                                                return (
                                                                    <>
                                                                        <tr>
                                                                            <td className='course-td'/>
                                                                            <td >
                                                                                {pres_item.is_temporary != null && pres_item.is_temporary == 0 ? "【定期検査】" :"【臨時検査】"}
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            {pres_item.examination_code != null && (
                                                                            <>
                                                                                <td className='course-td'/>
                                                                                <td>
                                                                                    {pres_item.is_completed==1?"済) ":"未) "}{pres_item.examination_code != null && this.state.examination_codes[pres_item.examination_code]}
                                                                                </td>
                                                                            </>
                                                                            )}
                                                                            
                                                                        </tr>



                                                                    </>
                                                                )
                                                            })
                                                        )}
                                                        {item.inject != null && item.inject.length >0 && (
                                                            item.inject.map((pres_item)=>{
                                                                return (
                                                                    <>
                                                                        <tr>
                                                                            <td className='course-td'/>
                                                                            <td >
                                                                                {pres_item.is_temporary != null && pres_item.is_temporary == 0 ? "【定期注射】" :"【臨時注射】"}
                                                                            </td>
                                                                        </tr>
                                                                        {/*is_completed*/}
                                                                        {pres_item.data_json!== null && pres_item.data_json.length>0 && (
                                                                            pres_item.data_json.map(medicine=>{
                                                                                if (medicine.item_name != undefined && medicine.item_name != ''){
                                                                                    return(
                                                                                        <>
                                                                                            <tr >
                                                                                                <td className='course-td'/>
                                                                                                <td>{pres_item.is_completed==1?"済) ":"未) "}{medicine.item_name}</td>
                                                                                            </tr>
                                                                                        </>
                                                                                    )
                                                                                }
                                                                            })
                                                                        )}
                                                                    </>
                                                                )
                                                            })
                                                        )}
                                                    </>
                                                )
                                            })
                                        )}
                                      </>
                                    )}
                                </tbody>
                            </table>
                        </List>
                    </LeftContent>
                    </div>
                    <div className="footer-buttons">
                      <Button className ="red-btn" onClick={this.printPreview_new.bind(this)}>帳票プレビュー</Button>
                    </div>                    
            </Wrapper>
            {this.state.isOpenPrintModal && (
                <DrKartePrintModal
                    handleOk={this.handleOk}
                    closeModal={this.closeModal}                        
                    patient_id = {this.state.patientInfo.system_patient_id}
                    patientInfo={this.state.patientInfo}
                    schedule_date = {this.state.end_date}
                    end_date = {this.state.end_date}
                    start_date = {this.state.start_date}
                    karte_list={this.state.karte_list}
                    select_date_type={this.state.select_date_type}
                />
            )}
            </>
        )
    }
}

DoctorKarte.contextType = Context;

DoctorKarte.propTypes = {
    patientInfo: PropTypes.object,
    patientId: PropTypes.number,
    schedule_date: PropTypes.string,    
    refreshScheduleInfo: PropTypes.func,
    history: PropTypes.object,
};

export default DoctorKarte