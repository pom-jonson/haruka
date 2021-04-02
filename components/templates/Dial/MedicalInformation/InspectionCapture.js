import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import InputWithLabel from "../../../molecules/InputWithLabel";
import Button from "~/components/atoms/Button";
// import RadioButton from "~/components/molecules/RadioInlineButton";
// import Checkbox from "~/components/molecules/Checkbox";
// import { Row, Col } from "react-bootstrap";
import { surface } from "~/components/_nano/colors";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {faTrash} from "@fortawesome/pro-regular-svg-icons";
// import {formatJapanDateSlash} from "~/helpers/date"
import PropTypes from "prop-types";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import DialSideBar from "../DialSideBar";
import InspectionCalcModal from "../modals/InspectionCalcModal";
import DialPatientNav from "../DialPatientNav";


const Card = styled.div`
  position: relative;  
  width: 100%;
  margin: 0px;
  top: 70px;
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
      font-size: 1.25rem;
      font-weight: 100;
    }
  }

  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
`;

// const Icon = styled(FontAwesomeIcon)`
//   color: rgba(0, 0, 0, 0.65);
//   font-size: 14px;
//   margin-right: 0.25rem;
// `;

const Wrapper = styled.div`
  width: 100%;
  height: calc( 100vh - 16.875rem);
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  // text-align: center;

  .content{        
    margin-top: 0.625rem;
    overflow:hidden;
    overflow-y: auto;
    height: calc(100vh - 16.875rem);    
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
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
    width: 30%;
    height: 100%;
    // height: calc(100vh - 13.125rem);
    .main-info {
        height: 30%;
        overflow: hidden;
        p {
            margin: 0;
            text-align: left;
            font-size: 1.25rem;
        }
    }
    .history-list {
        height: 70%;
        .history-title {
        font-size: 1.25rem;
        }
        .flex div {
            width: 50%;
        }
        .history-delete {
            cursor: pointer;
        }
        .dummy_2 {
            label{font-size:1.25rem;}
        }
    }
    .box-border {
        overflow: hidden;
        overflow-y: auto;
        border: 1px solid black;
        height: 85%;
        p {
            margin: 0;
            text-align: left;
        }
        .select-area .radio-group-btn label {
            text-align: left;
            padding-left: 0.625rem;
            border-radius: 0.25rem;
        } 
    }
  }
  .right-area {
    width: 70%;    
    padding-left: 1.25rem;
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
        font-size: 1.25rem;
    }
  }

  .table-view{
    border: 1px solid #ddd;
    height: 40%;
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
 `;


class InspectionCapture extends Component {
    constructor(props) {
        super(props);
        let prev_content = ["処置", "観察", "その他"];
        let print_dial_time = ["I", "II", "III", "IV"];
        // let cur_date = formatJapanDateSlash(new Date());
        let history_data = [
            "2018/01/25 処置 (次回 02/27)",
            "2017/09/21 処置",
            "2017/09/19 処置 (次回 09/22)",
            "2017/09/14 処置 (観察 09/19)",
            "2017/09/12 その他 (次回 09/14)",
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
            // entryDate: cur_date,
            nextCheckDate: "",
            history_data,
            delete_datas,
            list_item,
            _infectionList:[],
            openInspectionCalcModal: false,
        }
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

    }

    deleteHistory = () => {
    }

    closeModal = () => {
      this.setState({
        openInspectionCalcModal: false
      });
    }

    handleOk = () => {
      this.setState({
        openInspectionCalcModal: false
      });
    }

    handlePatientSearch = () => {
      this.setState({
        openInspectionCalcModal: true
      });
    }
    selectPatient = (patientInfo) => {
        this.setState({
            patientInfo: patientInfo
        });
    };


    render() {
        let { _infectionList } = this.state;
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
                <div className="title">検査データ取り込み</div>
                <div className="flex hp-100 content">
                    <div className="left-area">
                        <div className="main-info">
                            <div className="div-style1">
                              <div className="label-type1">取込ファイル</div>
                              <div className="label-type2">更新</div>
                            </div>
                            <div className="box-border">
                                <div className="flex padding-top-5">
                                    <div className="wp-30">DM</div>
                                    <div className="wp-70">無</div>
                                </div>
                                <div className="flex padding-top-5">
                                    <div className="wp-30">抗血栓薬</div>
                                    <div className="wp-70"></div>
                                </div>
                                <div className="flex padding-top-5">
                                    <div className="wp-30">ABI上</div>
                                    <div className="wp-35">27.4</div>
                                    <div className="wp-35"></div>
                                </div>
                                <div className="flex padding-top-5">
                                    <div className="wp-30">ABI下</div>
                                    <div className="wp-35">288</div>
                                    <div className="wp-35">3700</div>
                                </div>
                                <div className="flex padding-top-5">
                                    <div className="wp-30">SPO2</div>
                                    <div className="wp-70"></div>
                                </div>
                                <div className="flex padding-top-5">
                                    <div className="wp-30">血糖測定</div>
                                    <div className="wp-35">3.7</div>
                                    <div className="wp-35">3700</div>
                                </div>
                            </div>
                        </div>
                        <div className="history-list">
                            <div className="flex">
                                <div>取込済みファイル</div>                                
                            </div>
                            <div className="box-border">
                                <div className="dummy_2 select-area">
                                    <>
                                        {this.state.history_data.map((item, key)=>{
                                            return (
                                                <>
                                                    <RadioGroupButton
                                                        id={`history_${key}`}
                                                        value={key}
                                                        label={item}
                                                        name="history_data"
                                                        getUsage={this.makeDeleteHistoryData()}
                                                    />
                                                </>
                                            );
                                        })}
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-area">
                      <div>取込状況</div>
                      <div className="table-view">
                        <table className="table-scroll table">
                        <thead>
                            <th className="width-30">取込設定</th>
                            <th className="width-40">取込済み</th>
                            <th className="width-30">検査計算</th>                            
                        </thead>
                        <tbody>
                              {_infectionList.map(item => {
                                return (
                                    <>
                                        <tr>
                                      <td>{item.patient_id}</td>
                                      <td>{item.name}</td>
                                      <td>{item.date}</td>
                                        </tr>
                                  </>
                                )       
                              })}
                        </tbody>
                    </table>
                    </div>
                      <div className="div-regist-content">
                        <div className="div-double-content">
                          登録されていない患者番号
                          <div className="list-content"></div>
                        </div>
                        <div className="div-double-content">
                          登録されていない検査会社コード
                          <div className="list-content"></div>
                        </div>
                      </div>
                    </div>                    
                </div>
                    <div className="footer">
                      <Button type="mono" onClick={this.handlePatientSearch}>検査計算</Button>
                      <Button type="mono" onClick={this.handlePreview}>登録</Button>
                      <Button type="mono" onClick={this.handleInsert}>一括削除</Button>
                    </div>
            </Wrapper>
          </Card>
          {this.state.openInspectionCalcModal && (
              <InspectionCalcModal
                  handleOk={this.handleOk}
                  closeModal={this.closeModal}
              />
          )}
        </>
        )
    }
}

InspectionCapture.contextType = Context;

InspectionCapture.propTypes = {
    checkFootCare:PropTypes.func,
    history:PropTypes.object,
};

export default InspectionCapture