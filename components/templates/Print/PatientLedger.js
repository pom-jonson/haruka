import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import styled from "styled-components";
import PropTypes from "prop-types";
import { surface } from "~/components/_nano/colors";
import {getNextDayByJapanFormat, getPrevDayByJapanFormat, formatJapanDate, formatDateLine} from "~/helpers/date"
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import RadioButton from "~/components/molecules/RadioInlineButton";
import axios from "axios/index";
import PatientLedgerPrintModal from "./Modal/PateintLedgerPrintModal";
import DialPatientNav from "../Dial/DialPatientNav";
import DialSideBar from "../Dial/DialSideBar";
import {setDateColorClassName} from "~/helpers/dialConstants";
const Card = styled.div`
  position: relative;
  width: 100%;
  margin: 0px;
  float: left;
  width: calc(100% - 190px);
  height: 100vh;
  position: fixed;
  background-color: ${surface};
  padding: 20px;
  left: 200px;
  .footer {
    margin-top: 20px;
    text-align: center;
    margin-left: 0px !important;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }
    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }

  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .selected{
      background: lightblue;
  }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 70px;
  padding: 10px;
  float: left;
  .search-box {
      width: 100%;
      display: flex;
  }
  .label-title {
    width: 95px;
    text-align: right;
    margin-right: 10px;
    font-size: 20px;
  }
  .pullbox-select {
      font-size: 12px;
      width: 110px;
  }
  .cur_date {
    font-size: 25px;
    display: flex;
    flex-wrap: wrap;
  }
  .gender {
    font-size: 12px;
    margin-left: 15px;
    .radio-btn label{
        width: 75px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
        font-size: 20px;
        font-weight: bold;
    }
  }
  .prev-day {
    cursor: pointer;
    padding-right: 10px;
  }
  .next-day {
    cursor: pointer;
    padding-left: 10px;
  }
  .patient-count {
    width: 10%;
    font-size: 25px;
    text-align: center;
  }
 `;

const Wrapper = styled.div`
    width: calc(100% - 200px);
    height: calc( 100vh - 220px);
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    display: inline-block;
    .w-15{width: 15%;}
    .w-85{width: 85%;}
    .print-type {
        .radio-btn label{
            width: 100%;
            border: solid 1px rgb(206, 212, 218);
            border-radius: 4px;
            margin: 10px 0;
            padding: 4px 5px;
            font-size: 1.25rem;
            font-weight: bold;
        }
    }
    table {
        overflow-y: auto;
        tr:ntd-child(even) {background-color: #f2f2f2;}
        td {
          padding: 0.25rem;
        }
        th {
          position: sticky;
          text-align: center;
          vertical-align: middle;
          padding: 0.3rem;
        }
        .patient-name{
          width:240px;
        }
    }
    .
 `;

class PatientLedger extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.sidebarRef = React.createRef();
    this.state = {
      schedule_date: new Date(),  //日付表示
      timezone: 1,
      table_data:[],
      selected_type :'',
      isOpenPrintModal:false,
      print_type:[
        {id: 1, value:"患者台帳"},
        {id: 2, value:"透析患者表"},
        {id: 3, value:"患者マスタ一覧表"},
        {id: 4, value:"緊急連絡先"},
      ]
    }
  }
  componentDidMount(){
    // this.getSearchResult();
  }
  
  openPreviewModal = () => {
    if (this.state.selected_type == '') {
      window.sessionStorage.setItem('alert_messages','印刷する分類を選択してください。');
      return;
    }
  };
  
  selectPrintType = (e) => {
    if (e.target.value == 1) {
      if (this.state.patientInfo == undefined || this.state.patientInfo == null || this.state.patientInfo.system_patient_id == undefined) {
        window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
        return;
      }
      this.setState({
        selected_type: "ledger",
        isOpenPrintModal: true
      }, () => {
        // this.getSearchResult();
      });
    } else if (e.target.value == 2) {
      this.setState({
        isOpenPrintModal: true,
        selected_type: "patient_table"
      }, () => {
        // this.getSearchResult();
      });
    } else if (e.target.value == 3) {
      this.setState({
        isOpenPrintModal: true,
        selected_type: "master_table"
      }, () => {
        // this.getSearchResult();
      });
    } else if (e.target.value == 4) {
      if (this.state.patientInfo == undefined || this.state.patientInfo == null || !(this.state.patientInfo.system_patient_id > 0) ) {
        window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
        return;
      }
      this.setState({
        isOpenPrintModal: true,
        selected_type: "emergency_table"
      }, () => {
        // this.getSearchResult();
      });
    }
  };
  
  getDate = value => {
    this.setState({ schedule_date: value}, () => {
      this.getSearchResult(false);
    })
  };
  
  PrevDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSearchResult(false);
    })
  };
  
  NextDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day}, () => {
      this.getSearchResult(false);
    })
  };
  
  getSearchResult = async(open_modal= true) => {
    if (this.state.schedule_date == undefined || this.state.schedule_date == '') return;
    if (this.state.selected_type == undefined || this.state.selected_type == '') return;
    
    var print_type = this.state.selected_type;
    var path = '';
    var post_data = {
      schedule_date:formatDateLine(this.state.schedule_date),
    }
    var post_param = {param:post_data};
    switch(print_type){
      case 'ledger':     //スケジュール
        path = "/app/api/v2/dial/patient/list_condition";
        break;
      case 'patient_table':     //指示
        path = "/app/api/v2/dial/patient/list_condition";
        break;
      case 'master_table':
        path = "/app/api/v2/dial/patient/list_condition";
        break;
      case 'emergency_table':
        path = "/app/api/v2/dial/patient/emergency_contact";
        post_data = {
          system_patient_id: this.state.system_patient_id,
          all_display: 0,
        }
        post_param = {params:post_data};
        break;
    }
    
    let _state={
      table_data:[],
      isOpenPrintModal:open_modal
    };
    
    // DN78 透析患者表印刷の修正
    // ②左サイドバーの検索条件とソート条件（ID順とカナ順のみ。グループ順選択時はデフォルトのID順）を反映するように。
    if (print_type == "patient_table") {
      if (this.sidebarRef.current != undefined) {
        _state.table_data = await this.sidebarRef.current.getPatientList(null, "patient_ledger");
      }
    } else {
      let { data } = await axios.post(path, post_param);
      _state.table_data = data == undefined ? [] : data;
    }
    this.setState(_state);
  };
  selectPatient = (patient) => {
    this.setState({
      system_patient_id:patient.system_patient_id,
      patientInfo:patient,
    });
  };
  closeModal = () => {
    this.setState({
      isOpenPrintModal:false,
    });
  };
  
  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick} style={{cursor:"pointer"}}>
        {formatJapanDate(value)}
      </div>
    );
    return (
      <>
        <DialSideBar
          ref = {this.sidebarRef}
          onGoto={this.selectPatient}
          history = {this.props.history}
        />
        <DialPatientNav
          patientInfo={this.state.patientInfo}
          history = {this.props.history}
        />
        <Card>
          <div className="title">患者台帳</div>
          <SearchPart>
            <div className="search-box">
              <div className="cur_date flex">
                <div className="prev-day" onClick={this.PrevDay}>{"< "}</div>
                <DatePicker
                  locale="ja"
                  selected={this.state.schedule_date}
                  onChange={this.getDate.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  customInput={<ExampleCustomInput />}
                  dayClassName = {date => setDateColorClassName(date)}
                />
                <div className="next-day" onClick={this.NextDay}>{" >"}</div>
              </div>
            </div>
          </SearchPart>
          <Wrapper>
            <div className="d-flex h-100">
              <div className="type w-15 print-type">
                {this.state.print_type != undefined && this.state.print_type.length>0 &&(
                  this.state.print_type.map((item)=>{
                    return (
                      <>
                        <RadioButton
                          id={`print_type_${item.id}`}
                          value={item.id}
                          label={item.value}
                          name="print-type"
                          getUsage={this.selectPrintType.bind(this)}
                          checked={this.state.selected_type === item.id ? true : false}
                        />
                      </>
                    );
                  })
                )}
              
              </div>
              <div className="w-85 h-100 p-3" style={{overflowY:"auto"}}>
              
              </div>
            </div>
          </Wrapper>
          {this.state.isOpenPrintModal && (
            <PatientLedgerPrintModal
              handleOk={this.closeModal}
              closeModal={this.closeModal}
              patient_id = {this.state.system_patient_id}
              schedule_date = {formatDateLine(this.state.schedule_date)}
              print_data={this.state.patientInfo}
              modal_type={this.state.selected_type}
              table_data = {this.state.table_data}
              sort_type = {this.sidebarRef.current != undefined ? this.sidebarRef.current.state.sort_type : null}
            />
          )}
        </Card>
      </>
    )
  }
}
PatientLedger.propTypes = {
  history: PropTypes.object
};

export default PatientLedger
