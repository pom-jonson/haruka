import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import InputWithLabel from "../../../molecules/InputWithLabel";
import Button from "~/components/atoms/Button";
// import RadioButton from "~/components/molecules/RadioInlineButton";
import Checkbox from "~/components/molecules/Checkbox";
// import { Row, Col } from "react-bootstrap";
import { surface } from "~/components/_nano/colors";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {faTrash} from "@fortawesome/pro-regular-svg-icons";
import {formatJapanDateSlash} from "~/helpers/date"
import PropTypes from "prop-types";
import InputWithLabel from "~/components/molecules/InputWithLabel";
// import RadioGroupButton from "~/components/molecules/RadioGroup";
import DatePicker from "react-datepicker";
import DialSideBar from "../DialSideBar";
import CloseableTabs from 'react-closeable-tabs';
import Error from "./Error"
import ErrorData from "./ErrorData"
import CalcData from "./CalcData"
import LogData from "./LogData"
import { formatJapanDate} from "~/helpers/date";
import DialPatientNav from "../DialPatientNav";
import {setDateColorClassName} from "~/helpers/dialConstants";

const Card = styled.div`
  position: relative;  
  width: 100%;
  margin: 0px;
  // height: 100vh;
  float: left;
  width: calc(100% - 390px);
  left: 200px;
  height: 100vh;
  position: fixed;
  background-color: ${surface};
  padding: 1.25rem;
  .footer {
    margin-top: 0.625rem;
    text-align: center;
    margin-left: 0px !important;
    button {
      text-align: center;
      border-radius: 0.25rem;
      background: rgb(105, 200, 225); 
      border: none;
      margin-right: 1.875rem;
    }
    
    span {
      color: white;
      font-size: 0.8rem;
      font-weight: 100;
    }
  }

  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
`;

const List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    width: 100%;
    margin-right: 2%;
    height: 100%;
    float: left;
    overflow-y:auto;
    border: solid 1px lightgrey;
    label {
        margin: 0;
    }
    table {
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        td {
            padding: 0.25rem;
            text-align: center;
            input {
                margin: 0;
            }
        }
        th {
            text-align: center;
            padding: 0.3rem;
        }
        .table-check {
            width: 3.75rem;
        }
        .code-number {
            width: 7.5rem;
        }
    }
    .tl {
        text-align: left;
    }
    .tr {
        text-align: right;
    }
 `;
const Wrapper = styled.div`
  width: 100%;
  height: calc( 100vh - 1.625rem);
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  // text-align: center;

  .content{        
    margin-top: 0.625rem;
    overflow:hidden;
    overflow-y: auto;
    height: calc(100vh - 17.5rem);    
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }

  .patient-sel-buttons{
    button{
      margin-right: 0.625rem;
    }
  }

  .example-custom-input{
      font-size: 1rem;
      width:11.25rem;
      text-align:center;
      padding-left: 1rem;
      padding-right: 1rem;
      padding-top: 0.3rem;
      padding-bottom: 0.3rem;
      border: 1px solid;
      margin-left:0.3rem;
      margin-right:0.3rem;
  }

  .div-style1{
    display: block;
    overflow: hidden;
    .label-type1{
      float: left;
    }
    .label-type2{
      float: right;
    }
  }

  .left-area {
    width: 40%;
    height: 100%;    
    .main-info{
      overflow: hidden;
      label{
        width: 0px;
        margin: 0px;
      }
    }
    .main-info .disease-name {
        height: 80%;
        overflow: hidden;
        border: 1px solid #ddd;
        p {
            margin: 0;
            text-align: center;
            font-size: 1.25rem;
        }
    }
    .history-list{
      margin-top: 1.25rem;
      height: 30%;
    }
    .history-list .disease-name {
        height: 80%;
        border: 1px solid #ddd;
        .history-title {
        font-size: 1.25rem;
        }
        .flex div {
            width: 50%;
        }
        .history-delete {
            cursor: pointer;
        }
    }
    .box-border {
        overflow: hidden;
        overflow-y: auto;
        border: 1px solid black;
        height: 85%;
        p {
            margin: 0;
            text-align: center;
        }
        .select-area .radio-group-btn label {
            text-align: left;
            padding-left: 0.625rem;
            border-radius: 0.25rem;
        } 
    }
  }
  .right-area {
    width: 60%;    
    padding-left: 1.25rem;
    height: 90%;
    .sc-bdVaJa{
      border: 1px solid #ddd;
      padding-top: 0.3rem;
      height: 100%;
    }

    .sc-htpNat {
      margin-top: -0.625rem;
      background: none;
      font-size: 1rem;
      border-bottom: 1px solid #ddd;
      .tab {
          border-bottom: solid 1px #ddd;
      }
      .tab.active {
          border-left: solid 1px #ddd;
          border-bottom: none;
          border-right: solid 1px #ddd;
          border-top: solid 1px #ddd;
          outline: none;
      }
    }    

    .first-area {
      .entry-date {    
        width: 35%;
        label {
            text-align: right;
            width: 5.625rem;
            font-size: 1rem;
            margin-top: 0.5rem;
            margin-bottom: 0;
        }
        input {
            width: 64%;
            height: 2.2rem;
        }
        .react-datepicker-wrapper {
            width: 64%;
            .react-datepicker__input-container {
                width: 100%;
                input {
                    display: block;
                    width: 100%;
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
      .entry-date div:first-child {
        margin-top: 0;
        
      }
    }
    .second-area {
        .left-space {
            width: 30%;
            .flex div {
                width: 50%;
            }
        }
        .right-space {
            width: 70%;
            font-size: 1rem;
            .foot-label {
                height: 2.5rem;
                padding-top: 0.3rem;
                margin-right: 1px;
                width: 49%;
                text-align: center;
                background-color: #4f95ef;
                color: white;
            }
        }
    }
    .third-area {
        padding-top: 1.25rem;
      table {
          td {
              width: 40%;
              label {
                width: 30%;
                text-align: left;
                margin-right: 0;
                font-size: 1rem;
              }
              padding: 0.3rem 0px 0.3rem 0;
          }
          .table-label {
            width:20%;
            background-color: #74a6f4;;
            text-align: center;
            color: white;
          }
          .col-md-2 {
              padding: 0;
              max-width: 16%;
              label {
                width: 100%;
              }
          }
          .col-md-1 {
              padding: 0;
          }
      }
      .ml-29 {
        margin-left: 1.8rem;
        max-width: 14%!important;
      }
      .mwp-11 {
        max-width: 11%!important;
      }
      .td-input {
          max-width: 17%!important;
          label {
            width: 0px!important;
          }
          input {
              height: 1.5rem;
              padding: 0;
          }
          div {
            margin-top: -1px;
          }
      }
    
    }
  }
  
  .radio-label {
    width: 7.5rem;;
    padding-top: 0.625rem;
    text-align: right;
  }
  .prev-content {
    .radio-btn label{
        width: 4.7rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0.25rem 0.3rem;
        font-size: 1rem;
    }
  }
  .print-type {
    .radio-btn label{
        width: 4.7rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0.25rem 0.3rem;
        font-size: 1rem;
    }
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .label-box {
    font-size: 1rem;
    border: 1px solid #a0a0a0;
  }
  .prev-session {    
    width: 65%;
    padding-left: 5%;
  }
  .pt-20 {
    padding-top: 1.25rem;
  }
  .pt-10 {
    padding-top: 0.625rem;
  }
  .pt-12 {
    padding-top: 0.75rem;
  }
  .padding-top-5 {
    padding-top: 0.3rem;
  }
  .wp-30 {
    width: 30%;
  }
  .wp-35 {
    width: 35%;
  }
  .wp-40 {
    width: 40%;
  }
  .wp-45 {
    width: 45%;
    cursor: pointer;
  }
  .wp-55 {
    width: 55%;
  }
  .wp-60 {
    width: 60%;
  }
  .wp-70 {
    width: 70%;
  }
  .hp-100 {
    height : 100%;
  }
  .footer {
    margin-top: 0px!important;
    button span {
        font-size: 1rem;
    }
  }

  .table-view{
    border: 1px solid #ddd;
    overflow: hidden;
    height: 90%;
  }

  .div-double-content{
    width: 50%;
    display: block;
    overflow: hidden;
    float: left;
    margin-top: 0.625rem;
  }
  .list-content{
    border: 1px solid #ddd;
    height: 12.5rem;
    width: 100%;
  }

  .div-regist-content{
    height: 50%;
    .div-double-content{
      height: 95%;
    }
    .list-content{
      height: 90%;
    }
  }

  .arm-img{
    margin-top: 1.25rem;
  }

  .history-item{
    padding: 0.3rem;
  }

  .history-header{
    overflow: hidden;
    display: block;
    margin-bottom: 1.25rem;
  }

  .header-item{
    width: 30%;
    float: left;
    margin-right: 1.875rem;
    label {
        text-align: left;
        width: 3.75rem;
        font-size: 1rem;
        margin-top: 0.5rem;
        margin-bottom: 0;
    }
    input {
        width: 64%;
        height: 2.2rem;
        border-radius: 0.25rem;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 0.5rem;
    }    
  }
 `;

class InspectionCalc extends Component {
    constructor(props) {
        super(props);
        let prev_content = ["処置", "観察", "その他"];
        let print_dial_time = ["I", "II", "III", "IV"];
        let cur_date = formatJapanDateSlash(new Date());
        let history_data = [
            "2018/01/25 処置 (次回 02/27)",
            "2017/09/21 処置",
            "2017/09/19 処置 (次回 09/22)",
            "2017/09/14 処置 (観察 09/19)",
            "2017/09/12 その他 (次回 09/14)",
        ];
        let list_array = [
            { id: 0, origin_name: "S)訴え・症状"},
            { id: 1, origin_name: "O)観察"},
            { id: 2, origin_name: "トラブル"},
            { id: 3, origin_name: "指示"},
            { id: 4, origin_name: "P)対応"},
            { id: 5, origin_name: "申し送りコメント"},
            { id: 6, origin_name: "継続申し送りコメント"},
        ];
        let delete_datas = null;
        let list_item = [
            { id: 1, simple_name: "テスト継続単語1" },
            { id: 2, simple_name: "テスト継続単語2" },
        ];
        this.state = {
            prev_content,
            prev_content_value: 0,
            print_dial_time,
            print_dial_time_value: 0,
            entryDate: cur_date,
            nextCheckDate: "",
            history_data,
            delete_datas,
            list_item,
            data: [
                {
                    tab: 'エラー',
                    component: <Error />,
                    id: 0
                },
                {
                    tab: 'エラー＆データ不備',
                    component: <ErrorData />,
                    id: 1
                },
                {
                    tab: '計算済',
                    component: <CalcData />,
                    id: 2
                },
                {
                    tab: 'すべてのログ',
                    component: <LogData />,
                    id: 3
                }
            ],
            activeIndex: 0,
            start_date: new Date(),
            end_date: new Date(),
            list_array,
        }
    }

    componentDidMount() {      
    }

    SelectPrevContent = (e) => {
        this.setState({ prev_content_value: parseInt(e.target.value)});
    };

    SelectPrintDialTime = (e) => {
        this.setState({ print_dial_time_value: parseInt(e.target.value)});
    };

    // getEntryDate = value => {
    //     this.setState({entryDate: value})
    // };

    getNextCheckDate = value => {
        this.setState({nextCheckDate: value})
    };

    getEntryStaff = e => {
        this.setState({entryStaff: e.target.value})
    };

    getRadio = (name) => {
        if (name === "check") {
            // console.log(name)
        }
    };

    checkCreateFootCare = () => {
        this.props.checkFootCare(1);
    }

    makeDeleteHistoryData = ( ) => {

        // let temp_history_values = {...this.state.delete_datas};
        // if(temp_history_values == null)
        //     temp_history_values = [];
        //
        // console.log(temp_history_values);
        //
        //
        // var index = temp_history_values.indexOf(value);
        //
        // console.log(index);
        //
        // if (index !== -1) {
        //     temp_history_values.splice(index, 1);
        // } else {
        //     temp_history_values.push(value);
        // }
        // this.setState({ delete_datas: temp_history_values });
    }

    deleteHistory = () => {
        // let temp_history_data = {...this.state.history_data};
        //
        // this.state.delete_datas.map((item)=>{
        //     temp_history_data.slice(item);
        // });
        // this.setState({delete_datas: [], history_data: temp_history_data});
    }

    selectTitleTab = e => {
        this.setState({activeIndex: parseInt(e.target.id)});
    };

    tabChange = (val) => {
      this.setState({activeIndex: val});
    };

    getStartDate = value => {
        this.setState({
            start_date: value,
        });
    };
    getEndDate = value => {
        this.setState({
            end_date: value,
        });
    };

    render() {
        let {list_array} = this.state;
        const ExampleCustomInput = ({ value, onClick }) => (                       
            <div className="cur-date example-custom-input" onClick={onClick}>                                            
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
            <Wrapper>
                <div className="title">検査計算</div>
                <div className="flex hp-100 content">
                    <div className="left-area">
                        <div className="history-header">
                          <p>期間指定</p>
                          <DatePicker
                            locale="ja"
                            selected={this.state.start_date}
                            onChange={this.getStartDate.bind(this)}
                            dateFormat="yyyy/MM/dd"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dayClassName = {date => setDateColorClassName(date)}
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
                              customInput={<ExampleCustomInput />}
                          />
                        </div>
                        <div className="main-info">
                          <p>患者指定</p>
                          <div className="patient-sel-buttons">
                            <Button type="mono">選択</Button>
                            <Button type="mono">全患者</Button>
                          </div>
                          <InputWithLabel
                            label=""
                            type="text"                            
                          />
                        </div>
                        <div className="history-list">
                          <p>計算項目</p>
                          <List>
                            <table className="table-scroll table table-bordered" id="wordList-table">                                
                                <tbody>
                                {list_array !== undefined && list_array !== null && list_array.length > 0 && (
                                  list_array.map((item, index) => {
                                    return (
                                      <>
                                        <tr onContextMenu={e => this.handleClick(e,index, item)}>
                                          <td>
                                              <Checkbox
                                                  label=""
                                                  getRadio={this.getRadio.bind(this)}
                                                  value={this.state.allChecked}
                                                  name="check"
                                              />
                                          </td>
                                          <td className="tl">{item.origin_name}</td>
                                        </tr>
                                      </>)
                                    })
                                )}
                                </tbody>
                            </table>
                        </List>
                        </div>                        
                    </div>
                    <div className="right-area">
                      <CloseableTabs
                        tabPanelColor='lightgray'
                        data={this.state.data}                        
                        activeIndex={this.state.activeIndex}
                        tabContentClass=""
                      />                      
                    </div>  
                </div>                
                <div className='footer'>                    
                  <Button type="mono" onClick={this.handleInsert}>計算開始</Button>
                  <Button type="mono" onClick={this.handleInsert}>帳票印刷</Button>
                  <Button type="mono" onClick={this.handleInsert}>設定</Button>
                </div>                  
            </Wrapper>
          </Card>
        </>
        )
    }
}

InspectionCalc.contextType = Context;

InspectionCalc.propTypes = {
    checkFootCare:PropTypes.func,
    history: PropTypes.object
};

export default InspectionCalc