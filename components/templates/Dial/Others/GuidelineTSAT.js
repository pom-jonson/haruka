import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import GuideTableTSAT from "./GuideTableTSAT"
import InputWithLabel from "../../../molecules/InputWithLabel";
import DialSideBar from "../DialSideBar";
import GuidelineCriteriaModalTSAT from "./modals/GuidelineCriteriaModalTSAT"
import GuideTablePreviewModalTSAT from "./modals/GuideTablePreviewModalTSAT"
import GraphPreviewModal from "./modals/GraphPreviewModal"
import NoteModal from "./modals/NoteModal"
import * as apiClient from "~/api/apiClient";
import {formatDateLine} from "~/helpers/date"
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import Spinner from "react-bootstrap/Spinner";
import {getServerTime} from "~/helpers/constants";

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 390px);
  left: 200px;
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
  .footer {
    position: absolute;
    bottom: 4rem;
    width:100%;
  }
  .flex {
      display: flex;
      flex-wrap: wrap;
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
    cursor: auto;
  }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 4.375rem;
  padding-top: 0.625rem;
  float: left;
  .list-title {
    margin-top: 1.25rem;
    font-size: 1.25rem;
    width: 20%;
  }
  .search-box {
      width: 100%;
      display: flex;
      .pullbox {
        margin-top: 0.5rem;
        .label-title {
            width: 11rem;
            margin-left: 0.625rem;
            margin-right: 0.625rem;
            text-align:right;
            font-size:1rem;
        }
        label {
            width: calc(100% - 8.125rem);
            margin-bottom: 0;
            select {
                width: 100%;
                font-size:1rem;
            }
        }
      }
      .period {
        width: 30%;
        label {
            width: 0;
        }
        .period-label{
          font-size:1rem;
          width:2.2rem;
          padding-top:17px;
        }
        display: flex;
        .pd-15 {
            padding: 1rem 0 0 0.5rem;
        }
        .react-datepicker-wrapper {
            width: 100%;
            .react-datepicker__input-container {
                width: 100%;
                input {
                    font-size: 1rem;
                    width: 8.5rem;
                    height: 2.5rem;
                    border-radius: 0.25rem;
                    border-width: 1px;
                    border-style: solid;
                    border-color: rgb(206, 212, 218);
                    border-image: initial;
                    padding: 0px 0.5rem;
                }
            }
        }
    }
    .section_numbers {
        width: 20%;
    }
    .display_no {
        width: 30%;
    }
    .display_patient {
        width: 20%;
    }
  }
`;
const Graph = styled.div`
    margin-left: 51%;
    width: 49%;
    height: calc( 100vh - 13rem);
    .width100 {
        width: 100%;
    }
    .c_graph {
        width: 4.375rem;
        .ver-line {
            background-color: rgb(85, 88, 244);
            width: 1.25rem;
            margin-left: 1.5rem;
        }
        .ver-point {
            text-align: center;
        }
        .height-line-1 {
            height: 6.875rem;
        }
        .height-line-2 {
            height: 11.25rem;
        }
        .height-line-3 {
            height: 13.5rem;
        }
    }
    .p_graph {
        .hor-line {
            background-color: rgb(85, 88, 244);
            height:1.25rem;
        }
        .her-point {
            line-height: 1.25rem;
        }
        .width-line-1 {
            margin-left: 1.5rem;
            width: 35%;
        }
        .width-line-2 {
            width: 25%;
        }
        .width-line-3 {
            width: calc(40% - 8.125rem);
        }
    }
    
    .triangle-up {
        width: 0;
        height: 0;
        border-left: 1.5rem solid transparent;
        border-right: 1.5rem solid transparent;
        border-bottom: 3rem solid rgb(85, 88, 244);
        margin-left: 0.625rem;
    }
    .triangle-right {
        width: 0;
        height: 0;
        border-top: 1.5rem solid transparent;
        border-left: 3rem solid rgb(85, 88, 244);
        border-bottom: 1.5rem solid transparent;
        margin-top: -1rem;
    }
    .box-area {
        width: calc(100% - 4.375rem);
        font-size: 1rem;
        .flex {
            margin-bottom: -1px;
        }
        .guide-box {
            word-break:break-all;
            word-wrap:break-word;
            position: relative;
            p {
                margin: 0;
                padding-left: 0.3rem;
            }
            padding:3px;
            width: 33%;
            height: 12.5rem;
            margin-right: -1px;
            border: 1px solid black;
            button {
                background-color: #ccc;
                color: black;
            }
            .box-bottom-area{
                position: absolute;
                bottom: 0.625rem;
                margin-left: 1rem;
            }
            .people-count {
                width:auto;
                margin-right:0.3rem;
                margin-top:0.3rem;
            }
            .box-btn {
                width: 5rem;
                button{
                    padding-top: 0.5rem;
                    padding-right: 1rem;
                    padding-bottom: 0.5rem;
                    padding-left: 1rem;
                }
            }
        }
        .color-1 {
            background-color: rgb(226, 103, 121);
        }
        .color-2 {
            background-color: rgb(222, 186, 190);
        }
        .color-3 {
            background-color: rgb(238, 237, 181);
        }
        .color-4 {
            background-color: rgb(239, 238, 182);
        }
        .color-5 {
            background-color: white;
        }
        .color-6 {
            background-color: rgb(217, 176, 174);
        }
        .color-7 {
            background-color: rgb(169, 192, 226);
        }
        .color-8 {
            background-color: rgb(247, 237, 140);
        }
        .color-9 {
            background-color: rgb(85, 133, 218);
        }
    }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const section_numbers = [
  { id: 0, value: "全体" },
  { id: 1, value: "1" },
  { id: 2, value: "2" },
  { id: 3, value: "3" },
  { id: 4, value: "4" },
  { id: 5, value: "5" },
  { id: 6, value: "6" },
  { id: 7, value: "7" },
  { id: 8, value: "8" },
  { id: 9, value: "9" },
];

// const display_patient = [
//     { id: 0, value: "全て" },
//     { id: 1, value: "" },
// ];

class GuidelineTSAT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start_date:'',
      end_date:'',
      search_patient: 0,        //表示順
      section: 0,        //セクション
      count_by_section:[0,0,0,0,0,0,0,0,0],
      isShowCriteriaModal:false,
      isShowNoteModal:false,
      isTablePreviewModal:false,
      isGraphPreviewModal:false,
      is_loaded:false,
    }
  }
  
  async componentDidMount () {
    let server_time = await getServerTime();
    let today = new Date(server_time);
    let year = today.getFullYear();
    let month = today.getMonth();
    let start_date = new Date(year, month, 1);
    let end_date = new Date(year, month+1, 0);
    this.setState({
      start_date,
      end_date,
    });
    await this.getCriteriaData();
  }
  
  getCriteriaData = async () => {
    let path = "/app/api/v2/dial/medicine_information/Guide/getCriteria";
    await apiClient.post(path, {params:{'kind':'FERR&TSAT'}}).then(res => {
      this.setState({
        comment:res.comment,
        note:res.note,
        TSAT_low:res.TSAT_low,
        TSAT_high:res.TSAT_high,
        FERR_low:res.FERR_low,
        FERR_high:res.FERR_high,
        code:res.code,
      }, () => {
        this.getExamData();
      })
    });
  }
  
  getExamData = async() => {
    let path = "/app/api/v2/dial/medicine_information/examination_data/getByCodeTSAT";
    let post_data = {
      'start_date': formatDateLine(this.state.start_date),
      'end_date':formatDateLine(this.state.end_date),
      'code':this.state.code,
      'section':this.state.section,
      'TSAT_low':this.state.TSAT_low,
      'TSAT_high':this.state.TSAT_high,
      'FERR_low':this.state.FERR_low,
      'FERR_high':this.state.FERR_high,
    }
    await apiClient.post(path, {params:post_data}).then(res => {
      var whole_data = res['whole_data'];
      var count_by_section = [0,0,0,0,0,0,0,0,0];
      whole_data.map(item => {
        count_by_section[item.section_no] += 1;
      })
      this.setState({
        table_data:res['data_by_section'],
        count_by_section,
        is_loaded:true,
      })
    })
  }
  
  getSearchSection = e => {                 //セクション
    this.setState({ section: parseInt(e.target.id) }, ()=>{
      this.getExamData();
    });
  };
  
  getSearchpatient = e => {                 //表示順
    this.setState({ search_patient: parseInt(e.target.id) });
  };
  
  getInputStartdate = value => {
    if (value.getTime() > this.state.end_date.getTime()){
      window.sessionStorage.setItem("alert_messages", '期間を正確に入力してください。');
      return;
    }
    this.setState({start_date: value}, () => {
      this.getExamData();
    });
  };
  
  getInputEnddate = value => {
    if (value.getTime() < this.state.start_date.getTime()){
      window.sessionStorage.setItem("alert_messages", '期間を正確に入力してください。');
      return;
    }
    this.setState({end_date: value}, () => {
      this.getExamData();
    });
  };
  
  showCriteriaModal = () => {
    if(this.context.$canDoAction(this.context.FEATURES.MASTER_SETTING, this.context.AUTHS.EDIT) === false) {
      window.sessionStorage.setItem("alert_messages", '変更権限がありません。');
      return;
    }
    this.setState({
      isShowCriteriaModal:true,
    })
  }
  
  closeModal = () => {
    this.setState({
      isShowCriteriaModal:false,
      isShowNoteModal:false,
      isTablePreviewModal:false,
      isGraphPreviewModal:false,
    })
  }
  
  handleOk = () => {
    this.getCriteriaData();
    this.closeModal();
  }
  
  showNote = (value) =>{
    this.setState({
      selected_sec_no:value,
      isShowNoteModal:true,
    })
  }
  
  showTablePreviewModal = () => {
    this.setState({
      isTablePreviewModal:true,
    })
  }
  
  showGraphPreviewModal = () => {
    this.setState({
      isGraphPreviewModal:true,
    })
  }
  
  goOtherPage = (url) => {
    this.props.history.replace(url);
  }
  
  addColor(e, section_no, from_table = true){
    var obj = null;
    if (from_table){
      obj = document.getElementsByClassName('color-'+section_no);
      if (obj != undefined && obj != null && obj.length > 0){
        obj[0].style.border  = '2px solid red';
      }
      var obj_this = e.target;
      while(obj_this.tagName.toLowerCase() != 'tr'){
        obj_this = obj_this.parentElement;
      }
      obj_this.style.background = '#e2e2e2';
    } else {
      obj = document.getElementsByClassName('record-' + section_no);
      if (obj != undefined && obj != null && obj.length > 0){
        for(var i = 0; i < obj.length; i++){
          obj[i].style.background = '#e2e2e2';
        }
      }
      obj = document.getElementsByClassName('color-' + section_no);
      if (obj != undefined && obj != null && obj.length > 0){
        obj[0].style.border = '2px solid red';
      }
    }
  }
  
  removeColor(e, section_no, from_table = true){
    var obj = null;
    if (from_table){
      obj = document.getElementsByClassName('color-'+section_no);
      if (obj != undefined && obj != null && obj.length > 0){
        obj[0].style.border  = '1px solid black';
      }
      var obj_this = e.target;
      while(obj_this.tagName.toLowerCase() != 'tr'){
        obj_this = obj_this.parentElement;
      }
      obj_this.style.background = 'white';
    } else {
      obj = document.getElementsByClassName('record-' + section_no);
      if (obj != undefined && obj != null && obj.length > 0){
        for(var i = 0; i < obj.length; i++){
          obj[i].style.background = 'white';
        }
      }
      obj = document.getElementsByClassName('color-' + section_no);
      if (obj != undefined && obj != null && obj.length > 0){
        obj[0].style.border = '1px solid black';
      }
    }
  }
  
  render() {
    let {comment, count_by_section} = this.state;
    return (
      <>
        <DialSideBar
          onGoto={this.selectPatient}
          history = {this.props.history}
        />
        <Card>
          <div className='flex'>
            <div className="title">フェリチンとTSATの治療指針</div>
            <div className='others'>
              <Button onClick={this.goOtherPage.bind(this,"/dial/others/guideline")}>PとCaの治療指針</Button>
              <Button className="disable-button">フェリチンとTSATの治療指針</Button>
              <Button onClick={this.goOtherPage.bind(this,"/dial/others/proper_dial_analysis")} style={{marginLeft:'1.5rem'}}>適正透析分析</Button>
            </div>
          </div>
          <SearchPart>
            <div className="search-box">
              <div className="period">
                <label className='period-label' style={{cursor:"text"}}>期間</label>
                <InputWithLabel
                  className="entry_date"
                  label=""
                  type="date"
                  dateFormat = "yyyy/MM/dd"
                  getInputText={this.getInputStartdate}
                  diseaseEditData={this.state.start_date}
                />
                <div className="pd-15">～</div>
                <InputWithLabel
                  className="entry_date"
                  label=""
                  type="date"
                  dateFormat = "yyyy/MM/dd"
                  getInputText={this.getInputEnddate}
                  diseaseEditData={this.state.end_date}
                />
              </div>
              <div className="section_numbers">
                <SelectorWithLabel
                  options={section_numbers}
                  title="選択中セクション"
                  getSelect={this.getSearchSection}
                  departmentEditCode={this.state.section}
                />
              </div>
              {/* <div className="display_no"></div>
                            <div className="display_patient">
                                <SelectorWithLabel
                                    options={display_patient}
                                    title=""
                                    getSelect={this.getSearchpatient}
                                    departmentEditCode={display_patient[this.state.search_patient].id}
                                />
                            </div> */}
            </div>
          </SearchPart>
          {this.state.is_loaded ? (
            <>
              <GuideTableTSAT
                table_data={this.state.table_data}
                addColor = {this.addColor}
                removeColor = {this.removeColor}
                history = {this.props.history}
              />
              <Graph>
                <div className="flex width100">
                  <div className="c_graph">
                    <div className="ver-point" style={{fontSize:'0.85rem'}}>フェリチン</div>
                    <div className="triangle-up"></div>
                    <div className="ver-line height-line-1"></div>
                    <div className="ver-point">{this.state.FERR_high}</div>
                    <div className="ver-line height-line-2"></div>
                    <div className="ver-point">{this.state.FERR_low}</div>
                    <div className="ver-line height-line-3"></div>
                  </div>
                  <div className="box-area">
                    <div className="flex">
                      <div className="guide-box color-7"
                           onMouseOver={e => this.addColor(e, 7, false)}
                           onMouseOut = {e=> this.removeColor(e, 7, false)}
                      >
                        <p>⑦</p>
                        {comment != undefined && comment != null && comment[6].length>0 && (
                          comment[6].map(item => {
                            return(
                              <>
                                <p>{item}</p>
                              </>
                            )
                          })
                        )}
                        <div className="flex box-bottom-area">
                          <div className="people-count">{count_by_section[7]}人</div>
                          <div className="box-btn"><button onClick={this.showNote.bind(this, 6)}>備考</button></div>
                        </div>
                      </div>
                      <div className="guide-box color-4"
                           onMouseOver={e => this.addColor(e, 4, false)}
                           onMouseOut = {e=> this.removeColor(e, 4, false)}
                      >
                        <p>④</p>
                        {comment != undefined && comment != null && comment[3].length>0 && (
                          comment[3].map(item => {
                            return(
                              <>
                                <p>{item}</p>
                              </>
                            )
                          })
                        )}
                        <div className="flex box-bottom-area">
                          <div className="people-count">{count_by_section[4]}人</div>
                          <div className="box-btn"><button onClick={this.showNote.bind(this, 3)}>備考</button></div>
                        </div>
                      
                      </div>
                      <div className="guide-box color-1"
                           onMouseOver={e => this.addColor(e, 1, false)}
                           onMouseOut = {e=> this.removeColor(e, 1, false)}
                      >
                        <p>①</p>
                        {comment != undefined && comment != null && comment[0].length>0 && (
                          comment[0].map(item => {
                            return(
                              <>
                                <p>{item}</p>
                              </>
                            )
                          })
                        )}
                        <div className="flex box-bottom-area">
                          <div className="people-count">{count_by_section[1]}人</div>
                          <div className="box-btn"><button onClick={this.showNote.bind(this, 0)}>備考</button></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="guide-box color-8"
                           onMouseOver={e => this.addColor(e, 8, false)}
                           onMouseOut = {e=> this.removeColor(e, 8, false)}
                      >
                        <p>⑧</p>
                        {comment != undefined && comment != null && comment[7].length>0 && (
                          comment[7].map(item => {
                            return(
                              <>
                                <p>{item}</p>
                              </>
                            )
                          })
                        )}
                        <div className="flex box-bottom-area">
                          <div className="people-count">{count_by_section[8]}人</div>
                          <div className="box-btn"><button onClick={this.showNote.bind(this, 7)}>備考</button></div>
                        </div>
                      </div>
                      <div className="guide-box color-5"
                           onMouseOver={e => this.addColor(e, 5, false)}
                           onMouseOut = {e=> this.removeColor(e, 5, false)}
                      >
                        <p>⑤</p>
                        {comment != undefined && comment != null && comment[4].length>0 && (
                          comment[4].map(item => {
                            return(
                              <>
                                <p>{item}</p>
                              </>
                            )
                          })
                        )}
                        <div className="flex box-bottom-area">
                          <div className="people-count">{count_by_section[5]}人</div>
                          <div className="box-btn"><button onClick={this.showNote.bind(this, 4)}>備考</button></div>
                        </div>
                      </div>
                      <div className="guide-box color-2"
                           onMouseOver={e => this.addColor(e, 2, false)}
                           onMouseOut = {e=> this.removeColor(e, 2, false)}
                      >
                        <p>②</p>
                        {comment != undefined && comment != null && comment[1].length>0 && (
                          comment[1].map(item => {
                            return(
                              <>
                                <p>{item}</p>
                              </>
                            )
                          })
                        )}
                        <div className="flex box-bottom-area">
                          <div className="people-count">{count_by_section[2]}人</div>
                          <div className="box-btn"><button onClick={this.showNote.bind(this, 1)}>備考</button></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="guide-box color-9"
                           onMouseOver={e => this.addColor(e, 9, false)}
                           onMouseOut = {e=> this.removeColor(e, 9, false)}
                      >
                        <p>⑨</p>
                        {comment != undefined && comment != null && comment[8].length>0 && (
                          comment[8].map(item => {
                            return(
                              <>
                                <p>{item}</p>
                              </>
                            )
                          })
                        )}
                        <div className="flex box-bottom-area">
                          <div className="people-count">{count_by_section[8]}人</div>
                          <div className="box-btn"><button onClick={this.showNote.bind(this, 8)}>備考</button></div>
                        </div>
                      </div>
                      <div className="guide-box color-6"
                           onMouseOver={e => this.addColor(e, 6, false)}
                           onMouseOut = {e=> this.removeColor(e, 6, false)}
                      >
                        <p>⑥</p>
                        {comment != undefined && comment != null && comment[5].length>0 && (
                          comment[5].map(item => {
                            return(
                              <>
                                <p>{item}</p>
                              </>
                            )
                          })
                        )}
                        <div className="flex box-bottom-area">
                          <div className="people-count">{count_by_section[6]}人</div>
                          <div className="box-btn"><button onClick={this.showNote.bind(this, 5)}>備考</button></div>
                        </div>
                      </div>
                      <div className="guide-box color-3"
                           onMouseOver={e => this.addColor(e, 3, false)}
                           onMouseOut = {e=> this.removeColor(e, 3, false)}
                      >
                        <p>③</p>
                        {comment != undefined && comment != null && comment[2].length>0 && (
                          comment[2].map(item => {
                            return(
                              <>
                                <p>{item}</p>
                              </>
                            )
                          })
                        )}
                        <div className="flex box-bottom-area">
                          <div className="people-count">{count_by_section[3]}人</div>
                          <div className="box-btn"><button onClick={this.showNote.bind(this, 2)}>備考</button></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex p_graph">
                  <div className="hor-line width-line-1"></div>
                  <div className="her-point">{this.state.TSAT_low}</div>
                  <div className="hor-line width-line-2"></div>
                  <div className="her-point">{this.state.TSAT_high}</div>
                  <div className="hor-line width-line-3" style={{width:'calc(40% - 10rem)'}}></div>
                  <div className="triangle-right"></div>
                  <div className="her-point" style={{fontSize:'1rem'}}>TSAT</div>
                </div>
              </Graph>
              <div className="footer-buttons">
                <Button className='red-btn' onClick={this.showCriteriaModal}>基準値 設定</Button>
                <Button className='red-btn' onClick={this.showGraphPreviewModal}>帳票プレビュー(9分割)</Button>
                <Button className='red-btn' onClick={this.showTablePreviewModal}>帳票プレビュー(一覧)</Button>
              </div>
            </>
          ):(
            <SpinnerWrapper>
              <Spinner animation="border" variant="secondary" />
            </SpinnerWrapper>
          )}
          {this.state.isShowCriteriaModal && (
            <GuidelineCriteriaModalTSAT
              closeModal = {this.closeModal}
              handleOk = {this.handleOk}
              comment = {this.state.comment}
              note = {this.state.note}
              TSAT_low = {this.state.TSAT_low}
              TSAT_high = {this.state.TSAT_high}
              FERR_low = {this.state.FERR_low}
              FERR_high = {this.state.FERR_high}
              code = {this.state.code}
            />
          )}
          {this.state.isShowNoteModal && (
            <NoteModal
              closeModal = {this.closeModal}
              handleOk = {this.handleOk}
              section_no = {this.state.selected_sec_no}
              comment = {this.state.comment[this.state.selected_sec_no]}
              note = {this.state.note[this.state.selected_sec_no]}
            />
          )}
          {this.state.isTablePreviewModal && (
            <GuideTablePreviewModalTSAT
              closeModal = {this.closeModal}
              section = {this.state.section}
              start_date = {this.state.start_date}
              end_date = {this.state.end_date}
              table_data = {this.state.table_data}
            />
          )}
          {this.state.isGraphPreviewModal && (
            <GraphPreviewModal
              closeModal = {this.closeModal}
              comment = {this.state.comment}
              count_by_section = {this.state.count_by_section}
              horr_low = {this.state.TSAT_low}
              horr_high = {this.state.TSAT_high}
              ver_low = {this.state.FERR_low}
              ver_high = {this.state.FERR_high}
              section = {this.state.section}
              start_date = {this.state.start_date}
              end_date = {this.state.end_date}
              horr_name = 'TSAT'
              ver_name = 'フェリチン'
              modal_title = "フェリチンとTSATの治療指針(9分割)"
            />
          )}
        </Card>
      </>
    )
  }
}

GuidelineTSAT.contextType = Context;
GuidelineTSAT.propTypes = {
  history: PropTypes.object
};
export default GuidelineTSAT