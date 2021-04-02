import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import Button from "../atoms/Button";
import Context from "~/helpers/configureStore";
import axios from "axios";
import auth from "~/api/auth";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import { KEY_CODES } from "~/helpers/constants";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import {formatDateLine} from "../../helpers/date";
import $ from "jquery";
import Spinner from "react-bootstrap/Spinner";
import * as localApi from "~/helpers/cacheLocal-utils";
registerLocale("ja", ja);
import {setDateColorClassName} from "~/helpers/dialConstants";

const PatientsWrapper = styled.div`
  width: 100%;
  margin: auto;
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
  }
  .title {
    font-size: 30px;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .table-area {
    width: 99%;
    margin: auto;
    margin-left: 11px;
    height: calc(100% - 200px);
    font-size: 0.875rem;
    font-family: "Noto Sans JP", sans-serif;
    table {
        margin-bottom:0;
        thead{
          display: table;
          width:calc(100% - 17px);
        }
        tbody{
          height: calc(100vh - 12rem);
          overflow-y:scroll;
          display:block;
          background: white;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        tr{
          display: table;
          width: 100%;
          box-sizing: border-box;
        }
        td {
            padding: 0.25rem;
            text-align: left;
            cursor: pointer;
        }
        th {
            background-color: #e2caff;
            color: black;
            text-align: center;
            padding: 0.3rem;
            font-weight:normal;
            font-size:1rem;
        }
        .td-date{
            width: 15%;
        }
        .td-patientId{
            text-align:center;
            width: 10%;
        }
        .patient-id{
          text-align: right !important;
        }
        .td-name {
            // width: 20%;
        }
        .td-kana {
            width: 20%;
        }
        .td-sex {
            width: 5%;
            text-align:center;
        }
        .td-age{
            width: 10%;
        }
     }
  }
  .selected {
    background: rgb(105, 200, 225) !important;
    color: white;
  }
  .no-result {
      padding: 260px;
      text-align: center;
      font-size: 1rem;
      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
.react-datepicker-wrapper{
    input{
        height:2rem;
        width:9rem;
        padding-top:0.3rem;
    }
}
.react-datepicker__tab-loop {
  display: inline-block;
}
.left-calendar{
    button{
        height:1.9rem;
    }
}

`;

// const Flex = styled.div`
//   background: ${colors.background};
//   display: flex;
//   align-items: center;
//   padding: 12px 10px;
//   width:100%;
//   z-index: 100;
//   button {
//     background-color: ${colors.surface};
//     min-width: auto;
//     margin-left: 2%;
//   }

// `;

const FlexTop = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 10px;
  width: 100%;
  z-index: 100;
  button{
    min-width: 40px;
  }
  .date-btn{
    padding: 5px;
  }
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 40vw;
  margin-top: 25vh;
  display: table-caption;
  position: absolute;
  top: 230px;
`;

class KartePatient extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      patients_list: null,
      search_date: new Date(),
      isOpenKarteModeModal: false,
      modal_data: null,
      selected_index:0,
      is_loaded: false,
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }
  
  async componentDidMount () {
    localApi.setValue("system_next_page", "karte_patient");
    await this.getPatientsList();
    $("#code-table").focus();
    auth.refreshAuth(location.pathname+location.hash);
  }
  
  getPatientsList = async () => {
    let path = "/app/api/v2/patients/karte_list";
    let post_data = {open_date:formatDateLine(this.state.search_date)};
    let { data } = await axios.post(path, {params: post_data});
    this.setState({patients_list:data, is_loaded: true});
  };
  
  goToUrlFunc = (url) => {
    this.props.history.replace(url);
    this.setState({isOpenKarteModeModal: false});
  };
  
  goToPage = () => {
    let system_before_page = localApi.getValue('system_before_page');
    this.props.history.replace(system_before_page != "" ? system_before_page : "/top");
  };
  getValue = (value) => {
    this.setState({search_date:value}, ()=>{
      this.getPatientsList();
    });
  };
  
  setToday = () => {
    this.setState({search_date:new Date()},()=>{
      this.getPatientsList();
    });
  };
  setYesterday = () => {
    this.setState({search_date: new Date().setDate(new Date().getDate()-1)},()=>{
      this.getPatientsList();
    })
  };
  searchRecent = () => {
    this.getPatientsList();
    $("#code-table").focus();
  };
  
  checkKarteMode = (patient_info) => {
    patient_info.systemPatientId = patient_info.system_patient_id;
    let patients_list = this.context.patientsList;
    let isExist = 0;
    patients_list.map(item=>{
      if (item.system_patient_id == patient_info.system_patient_id) {
        isExist = 1;
      }
    });
    if (patients_list != undefined && patients_list != null && patients_list.length > 3 && isExist == 0) {
      window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
      return;
    }
    if (isExist == 0) { // new patient connect
      this.setState({
        isOpenKarteModeModal: true,
        modal_data: patient_info
      });
    } else { // exist patient connect
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+patient_info.systemPatientId+"/"+page);
    }
    
  };
  
  closeModal = () => {
    this.setState({
      isOpenKarteModeModal: false
    });
  };
  
  onKeyPressed(e) {
    let data = [];
    if (this.state.patients_list != undefined && this.state.patients_list != null && this.state.patients_list.length > 0) {
      data = this.state.patients_list;
    }
    if (e.keyCode === KEY_CODES.up) {
      this.setState({
          selected_index: this.state.selected_index >= 1 ? this.state.selected_index - 1: data.length - 1
        }, () => {
          this.scrollToelement();
        }
      );
    }
    if (e.keyCode === KEY_CODES.down) {
      this.setState({
          selected_index:this.state.selected_index + 1 == data.length ? 0 : this.state.selected_index + 1
        }, () => {
          this.scrollToelement();
        }
      );
    }
    if (e.keyCode === KEY_CODES.enter) {
      if (data != null && data.length > 0 && data[this.state.selected_index] != null)
        this.checkKarteMode(data[this.state.selected_index]);
    }
  }
  
  scrollToelement = () => {
    const els = $("#code-table .selected");
    const pa = $("#code-table #patient-list");
    if (els.length > 0 && pa.length > 0) {
      const elHight = $(els[0]).height();
      const elTop = $(els[0]).position().top;
      const paHeight = $(pa[0]).height();
      const scrollTop = elTop - (paHeight - elHight) / 2;
      $(pa[0]).scrollTop(scrollTop);
    }
  };
  
  render() {
    let {patients_list} = this.state;
    return (
      <PatientsWrapper >
        <div className="title-area"><div className={'title'}>カルテ選択患者一覧</div></div>
        <FlexTop>
          <div className="w-50 left-calendar">
            <label className={`ml-1 mr-1`}>日付</label>
            <DatePicker
              locale="ja"
              selected={this.state.search_date}
              onChange={this.getValue.bind(this)}
              dateFormat="yyyy年MM月dd日"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="年/月/日"
              dayClassName = {date => setDateColorClassName(date)}
            />
            <Button type="mono" onClick={this.setToday} className="ml-2 date-btn">本日</Button>
            <Button type="mono" onClick={this.setYesterday} className="ml-2 date-btn">昨日</Button>
          </div>
          <div className={`w-50 text-right`}>
            <Button type="mono" className="tab-btn" onClick={()=>this.goToPage()}>閉じる</Button>
          </div>
        </FlexTop>
        {/*<Flex>
          <div className="w-50">
            <Button type="mono" onClick={this.searchRecent}>最新表示</Button>
          </div>
          <div className="w-50 text-right">
              <Button type="mono" onClick={this.printList}>一覧印刷</Button>
              <Button type="mono" onClick={this.fileOutput}>ファイル出力</Button>
              <Button type="mono" onClick={this.getSearchCondition}>検索条件</Button>
          </div>
        </Flex>*/}
        <div className={'table-area'}>
          <table className="table-scroll table table-bordered" id="code-table" onKeyDown={this.onKeyPressed} tabIndex="0">
            <thead>
            <tr>
              <th className={'td-date'} colSpan={2}>カルテ選択日時</th>
              <th className={'td-patientId'}>患者ID</th>
              <th className={'td-name'}>患者氏名</th>
              <th className={'td-kana'}>カナ氏名</th>
              <th className={'td-sex'}>性別</th>
              <th className={'td-age'}>年齢</th>
            </tr>
            </thead>
            {this.state.is_loaded ? (
              <tbody id="patient-list">
              {patients_list !== undefined && patients_list != null && patients_list.length > 0 ? patients_list.map((item,index)=>{ return (
                <tr onClick={this.checkKarteMode.bind(this, item)} key={item.number}  className={this.state.selected_index === index ? "selected" : ""}>
                  <td className={`text-right`} style={{width:"10%"}}>{item.open_date}</td>
                  <td className={`text-center`} style={{width:"5%"}}>{item.open_time}</td>
                  <td className={'td-patientId patient-id'}>{item.patient_number}</td>
                  <td className={'td-name'}>{item.patient_name}</td>
                  <td className={'td-kana'}>{item.patient_name_kana}</td>
                  <td className={'td-sex'}>{item.gender == 1 ? "男性": item.gender == 2 ? "女性" : ""}</td>
                  <td className={'td-age'}>{item.age}歳 {item.age_month}ヶ月</td>
                </tr>
              )}):(
                <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
              )}
              </tbody>
            ):(
              <div className='text-center'>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            )}
          
          </table>
        </div>
        {this.state.isOpenKarteModeModal == true && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.closeModal}
            modal_type={this.state.modal_type}
          />
        )}
      </PatientsWrapper>
    );
  }
}
KartePatient.contextType = Context;
KartePatient.propTypes = {
  history: PropTypes.object
};

export default KartePatient;
