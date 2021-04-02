import React, { Component } from "react";
// import DatePicker from "react-datepicker";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import axios from "axios";
import {
  getNextDayByJapanFormat,
  getPrevDayByJapanFormat,
  formatJapanDate,
  formatDateLine
} from "~/helpers/date";
import * as methods from "../Dial/DialMethods";
import DialSideBar from "../Dial/DialSideBar";
import DialPatientNav from "../Dial/DialPatientNav";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as sessApi from "~/helpers/cacheSession-utils";
// import * as apiClient from "~/api/apiClient";
import MedicineInforPreviewModal from "./MedicineInforPreviewModal";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import ja from "date-fns/locale/ja";
import PropTypes from "prop-types";
import {setDateColorClassName} from "~/helpers/dialConstants"

const Card = styled.div`
  position: fixed;
  top: 70px;
  width: calc(100% - 390px);
  margin: 0px;
  height: 100%;
  float: left;
  left: 200px;
  background-color: ${surface};
  padding: 20px;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .prev-day {
    cursor: pointer;
    padding-right: 10px;
    display: inline-block;
    font-size: 20px;
  }
  .next-day {
    cursor: pointer;
    padding-left: 10px;
    display: inline-block;
    font-size: 20px;
  }
  .react-datepicker-wrapper{
    font-size: 20px;
  }
  .day-area{
    margin: 20px 0px 10px 0px;
    font-size: 18px;
  }
  .sub-title-list{
    width:100%;
    margin-right: 2%;
    font-size: 20px;
    .cur-date {
        padding: 5px;

        border: 1px solid gray;
    }
    .subtitle{
      float: left;
      width: 100px;
    }
  }
  .cur_date {
    margin-top: 20px;
    font-size: 25px;
    display: flex;
    flex-wrap: wrap;
  }
  .prev-day {
    cursor: pointer;
    padding-right: 10px;
  }
  .next-day {
    cursor: pointer;
    padding-left: 10px;
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: calc( 100vh - 210px);
  float: left;
  margin-bottom: 10px;
  overflow-y: auto;
  label {
      text-align: right;
  }
  table {
    overflow-y: auto;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
          padding: 0.25rem;
      }
      th {
          font-size: 18px;
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
      .table-check {
          width: 60px;
      }
      .item-no {
        width: 50px;
      }
      .code-number {
          width: 120px;
      }
  }
  .regular-med{
    overflow: hidden;
    height: 40vh;
  }

  .temp-med{
    overflow:hidden;
    height: 200px;
    .temp-med-body{
      overflow-y: auto;
      border: 1px solid gray;
      height: 50%;
    }
  }

  .second-th th{
    background: white;
  }

  .table th, .table td{
    vertical-align: middle;
  }

  .name{
    width: 50%;
  }
  .amount{
    width: 10%;
  }
  .unit{
    width: 10%;
  }
  .text-left{
    text-align: left;
  }
  .text-center{
    text-align: center;
  }
  .main-body{
    height: calc(100vh - 20rem);
    overflow-y: auto;
  }
  .regist-date{
    float: left;
    width: 100px;
  }
 `;

class MedicineInfor extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      table_list: [],
      table_temp_list: [],
      cur_date: new Date(),
      isOpenPreviewModal: false,
      patientInfo: "",
    }
  }
  
  async componentDidMount(){
    this.getMedicineInforByPatient();
  }
  
  getMedicineInforByPatient = async() => {
    let patientInfo = sessApi.getObjectValue("dial_setting","patient");
    if (patientInfo == undefined || patientInfo == null){
      return;
    }
    let path = "/app/api/v2/dial/print/get_med_infor";
    // let path = "/app/api/v2/dial/schedule/prescription_search";
    let post_data = {
      cur_date: formatDateLine(this.state.cur_date),
      patient_id: patientInfo.system_patient_id
    };
    let { data } = await axios.post(path, {params: post_data});
    this.setState({
      table_list: data.regular != null && data.regular != undefined && data.regular.length > 0 ? data.regular : [],
      table_temp_list: data.temp != null && data.temp != undefined && data.temp.length > 0 ? data.temp : [],
    });
  }
  
  openPreviewModal = () => {
    this.setState({
      isOpenPreviewModal: true,
    });
  }
  
  closeModal = () => {
    this.setState({
      isOpenPreviewModal: false,
    });
  };
  
  selectPatient = (patientInfo) => {
    this.setState({patientInfo:patientInfo}, ()=>{
      this.getMedicineInforByPatient();
    })
  };
  
  getDate = value => {
    this.setState({ cur_date: value}, () => {
      this.getMedicineInforByPatient();
    })
  };
  
  PrevDay = () => {
    let now_day = this.state.cur_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    this.setState({ cur_date: cur_day}, () => {
      this.getMedicineInforByPatient();
    })
  };
  
  NextDay = () => {
    let now_day = this.state.cur_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    this.setState({ cur_date: cur_day}, () => {
      this.getMedicineInforByPatient();
    })
  };
  
  render() {
    let {table_list, table_temp_list} = this.state;
    let ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick} style={{cursor:"pointer"}}>
        {formatJapanDate(value)}
      </div>
    );
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
        <Card>
          <div className="title">お薬情報書</div>
          <div className={'cur_date flex'}>
            <div className="prev-day" onClick={this.PrevDay}>{"< "}</div>
            <DatePicker
              locale="ja"
              selected={this.state.cur_date}
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
          <Wrapper>
            <div className="main-body">
              <div className="regular-med">
                <div className="day-area flex">
                  定期投薬
                </div>
                <table className="table table-bordered table-striped table-hover" id="code-table">
                  <tr>
                    <th className="name">薬名</th>
                    <th className="amount">用量</th>
                    <th className="unit">単位</th>
                    <th className="usage">用法</th>
                  </tr>
                  {table_list !== undefined && table_list !== null && table_list.length > 0 && (
                    table_list.map(item => {
                      return (
                        <>
                          <tr>
                            <td className="text-left">{item.med_name}</td>
                            <td className="text-right pr-1">{item.amount}</td>
                            <td className="text-left pl-1">{item.unit}</td>
                            <td className="text-left">{item.usage}</td>
                          </tr>
                        </>)
                    })
                  )}
                </table>
              </div>
              <div className="temp-med">
                <div className="day-area flex">
                  臨時投薬
                </div>
                <div className="temp-med-body pl- 1">
                  {table_temp_list != undefined && table_temp_list != null && table_temp_list.map((rp_item)=>{
                    return (
                      <div key={rp_item} className="pres-area">
                        {rp_item.medicines.length > 0 && rp_item.medicines.map((medi_item, medi_key)=>{
                          return (
                            <>{medi_key<rp_item.medicines.length-1?(
                              <div style={{fontSize:"0.9rem"}}>{medi_item.item_name} {medi_item.amount} {medi_item.unit} {medi_item.is_not_generic == 1 ? "【後発変更不可】": ""}&nbsp; </div>
                            ) : (
                              <span>{medi_item.item_name} {medi_item.amount} {medi_item.unit}{medi_item.is_not_generic == 1 ? "【後発変更不可】": ""}</span>
                            )}
                            </>
                          )
                        })}
                        <span>
                                        {rp_item.usage_name !== undefined ? " " +rp_item.usage_name : " "}
                          {rp_item.days !== undefined && rp_item.days !== null && rp_item.disable_days_dosing == 0? "("+rp_item.days+(rp_item.prescription_category == "頓服"? "回分)" : "日分)") : ""}
                                    </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="footer-buttons">
              <Button onClick={this.openPreviewModal} className={this.state.curFocus === 1 ? "focus red-btn": "red-btn"}>帳票プレビュー</Button>
            </div>
          </Wrapper>
          
          {this.state.isOpenPreviewModal!== false && (
            <MedicineInforPreviewModal
              closeModal={this.closeModal}
              contents_regular={this.state.table_list}
              contents_temp={this.state.table_temp_list}
              cur_date={this.state.cur_date}
              patientInfo={this.state.patientInfo}
            />
          )}
        </Card>
      </>
    )
  }
}

MedicineInfor.propTypes = {
  history: PropTypes.object,
};
export default MedicineInfor