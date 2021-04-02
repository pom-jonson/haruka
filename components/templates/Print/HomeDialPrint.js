import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import styled from "styled-components";
import PropTypes from "prop-types";
import { surface } from "~/components/_nano/colors";
import {getNextDayByJapanFormat, getPrevDayByJapanFormat, formatJapanDate, formatDateLine} from "~/helpers/date"
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import axios from "axios/index";
import DialPatientNav from "../Dial/DialPatientNav";
import DialSideBar from "../Dial/DialSideBar";
import Button from "~/components/atoms/Button";
import Spinner from "react-bootstrap/Spinner";

import PDF from "react-pdf-js";
import {setDateColorClassName} from "~/helpers/dialConstants"

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Card = styled.div`
  position: relative;
  width: 100%;
  margin: 0px;
  float: left;
  width: calc(100% - 390px);
  height: 100vh;
  position: fixed;
  background-color: ${surface};
  padding: 20px;
  top: 60px;
  left: 200px;
  
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
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
  height: 45px;
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
    font-size: 1.25rem;
  }
  .cur_date {
    font-size: 1.5rem;
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
    width: 100%;
    height: calc( 100vh - 200px);
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    display: block;
    align-items: flex-start;
    margin-right: 2%;
    float: left;
    .td-title{
      width:6rem;
      border-left:1px solid black!important;
    }
    .unit {
      width: 4rem;
      text-align:center;
      font-size:0.8rem;
    }
    .measure-table td{
      border: 1px solid grey;
      border-right:none;
    }
    .measure-table{
      table-layout: fixed;
      width:100%;
      border:1px solid black;
    }
    .w2{width:2.5%;}
    .w5{width:5%;}
    .w10{width:10%;}
    .w15{width:15%;}
    .w20{width:20%;}
    .w25{width:25%;}
    .w30{width:30%;}
    .w40{width:40%;}
    .w50{width:50%;}
    .w60{width:60%;}
    .w70{width:70%;}
    .w80{width:80%;}
    .border{border:solid 1px black !important;}
    .border-left{border-left: solid 1px black !important;}
    .border-right {border-right: solid 1px black !important;}
    .border-top {border-top: solid 1px black !important;}
    .border-bottom {border-bottom: solid 1px black !important;}
    .flex{
        display: flex;
        .padding-10{
            padding-left:10px;
            padding-right:10px;
        }
    }
    .mt10{margin-top: 10px;}
    .mt5{margin-top: 5px;}
    .mt15{margin-top: 15px;}
    .mt20{margin-top: 20px;}
    .mt30{margin-top: 30px;}
    .ml10{margin-left: 10px;}
    .mr10{margin-right: 10px;}
    .pt5{padding-top: 5px;}
    .pt10{padding-top: 10px;}
    .pt15{padding-top: 15px;}
    .pt20{padding-top: 20px;}
    .table-bordered th, .table-bordered td {
        border: 1px solid #000;
        padding: 5px;
        // height: 30px;
    }
    .p20{padding: 20px;}
    .p10{padding: 10px;}
    .scroll{overflow-y:auto;}
    .h34{height:35px;}
     @media print{
        .print-area-b{
            width: 80% !important;
        }
    }
    .border-thick-table td{
        border: 0.1px solid grey;
    }
    .border-thick-table th{
        background: white;
    }
    td{
        word-break:break-all;
        word-wrap:break-word;
    }
 `;
const Body = styled.div`
    font-size:1rem;
    height: calc(100% - 0px);
    overflow-y: auto;
    margin-bottom: 0.5rem;
    .item{width:15%}
    .small-td{
        font-size:0.8rem;
    }
    .PDFPage {
      box-shadow: 0 0 8px rgba(0, 0, 0, .5);
    }

    .PDFPageOne {
      margin-bottom: 25px;
      margin-left: auto;
      margin-right: auto;
      margin-top:10px;
    }

    .PDFPage > canvas {
        max-width: 100%;
        height: auto !important;
    }

    .period-label{
        margin-top: 4px;
        margin-right: 15px;
    }
    
    .loaded-area {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        height: 100%;
        background-color: white;
    }
    .loaded-area-file {
        position: relative;
        margin-top: calc(-100vh - 200px);
        height: 900px;
        background-color: white;
    }
  .canvas-div {
    display: flex;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    canvas {
      box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 8px;
      width: 900px;
      height: auto;
    }
  }
 `;

class HomeDialPrint extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      schedule_date: new Date(),  //日付表示
      pageNumber: 1,
      file:null,
      patientInfo:null,
    }
  }
  
  getDate = value => {
    this.setState({ schedule_date: value, file:null,}, () => {
      this.getPrintPage();
    })
  };
  
  PrevDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getPrevDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day, file:null}, () => {
      this.getPrintPage();
    })
  };
  
  NextDay = () => {
    let now_day = this.state.schedule_date;
    let cur_day = getNextDayByJapanFormat(now_day);
    this.setState({ schedule_date: cur_day, file:null}, () => {
      this.getPrintPage();
    })
  };
  
  selectPatient = (patient) => {
    this.setState({
      system_patient_id:patient.system_patient_id,
      patientInfo:patient,
      file:null
    }, () => {
      this.getPrintPage();
    });
  };
  get_title_pdf = () => {
    let pdf_file_name = "人工透析記録" + "_" + this.state.patientInfo.patient_number + '_' + formatDateLine(this.state.schedule_date).split("-").join("") + ".pdf";
    return pdf_file_name;
  }
  
  changeLoaded =()=>{
    let loaded_area = document.getElementsByClassName("loaded-area-file")[0];
    if(loaded_area !== undefined && loaded_area != null){
      loaded_area.style['display'] = "none";
    }
    let content = document.getElementsByClassName("content")[0];
    if(content !== undefined && content != null){
      content.style['overflow-y'] = "auto";
    }
  }
  
  downloadPdf =()=>{
    if(this.state.file != null){
      const blob = new Blob([this.state.file], { type: 'application/octet-stream' });
      
      let pdf_file_name = this.get_title_pdf();
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
      }
      else{
        const url = window.URL.createObjectURL(new Blob([this.state.file]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', pdf_file_name); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    }
  }
  
  getPrintPage = async() => {
    var patientInfo = this.state.patientInfo;
    if (patientInfo == undefined || patientInfo == null) return;
    
    var url;
    url = '/app/api/v2/dial/generatepdf/dial_record_c';
    axios({
      url: url,
      method: 'POST',
      data:{
        patient_id:this.state.system_patient_id,
        start_date:this.state.schedule_date,
        end_date:this.state.schedule_date,
      },
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({
        file: response.data,
      });
    });
  }
  
  
  async componentDidMount() {
    this.getPrintPage();
  }
  
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages },()=>{
      setTimeout(()=>{
        this.changeLoaded();
      }, 1000);
    });
  }
  onDocumentComplete = (pages) => {
    this.setState({ numPages: pages, page:1 }, () => {
      setTimeout(() => {
        this.changeLoaded();
      }, 1000);
    });
  }
  goToPrevPage = () => {
    if (this.state.pageNumber - 1 !== 0) {
      this.setState((state) => ({ pageNumber: state.pageNumber - 1 }));
    }
  };
  
  goToNextPage = () => {
    if (this.state.pageNumber + 1 <= this.state.numPages) {
      this.setState((state) => ({ pageNumber: state.pageNumber + 1 }));
    }
  };
  
  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick} style={{cursor:"pointer"}}>
        {formatJapanDate(value)}
      </div>
    );
    const { pageNumber, patientInfo } = this.state;
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
            <Body>
            <div className='content'>
              {this.state.file != null && patientInfo != null && (
                <>
                  <div>
                    <div>
                      <div className="canvas-div">
                        <PDF file={this.state.file} page={pageNumber} onDocumentComplete={this.onDocumentComplete} scale={1.512}/>
                      </div>
                    </div>
                  </div>
                  <div className={'loaded-area-file'} id="loaded-area-file">
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                </>
              )}
              {this.state.patientInfo != null && this.state.file == null && (
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
              {this.state.patientInfo == null && (
                <div style={{textAlign:'center', fontSize:'20px', marginTop:'100px'}}>左サイドバーから患者を選択してください。</div>
              )}
            </div>
            </Body>
            <nav style={{marginBottom: "-30px"}}>
              <button onClick={this.goToPrevPage}>前へ</button>
              <button onClick={this.goToNextPage}>次へ</button>
            </nav>
            <div className={`footer-buttons`}>
              <Button className="red-btn" onClick={this.downloadPdf}>印刷</Button>
            </div>
          </Wrapper>
        </Card>
      </>
    )
  }
}
HomeDialPrint.propTypes = {
  history: PropTypes.object,
  print_page: PropTypes.object,
  schedule_date: PropTypes.object,
  x_range: PropTypes.object,
  patientInfo: PropTypes.object,
};

export default HomeDialPrint