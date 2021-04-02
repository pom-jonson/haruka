import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import { surface } from "~/components/_nano/colors";
import {formatJapanDateSlash} from "~/helpers/date"
import PropTypes from "prop-types";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
// import CloseableTabs from 'react-closeable-tabs';
import LetterSearch from "../Pattern/LetterSearch"
import MedNavi from "../Pattern/MedNavi"
import * as methods from "../DialMethods";
import AmountInputModal from "./AmountInputModal";

const Card = styled.div`
  position: relative;  
  overflow: hidden; 
  overflow-y: auto;
  width: 100%;
  margin: 0px;
  float: left;
  width: 100%;
  height: 80vh;
  background-color: ${surface};
  padding: 20px;
  .footer {
    margin-top: 10px;
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
      font-size: 0.8rem;
      font-weight: 100;
    }
  }
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 210px);
  font-size: 14px;
  .content{        
    margin-top: 10px;
    overflow:hidden;
    height: calc(100vh - 220px);    
  }
  .OaoNv{
    border: 1px solid #aaa;
    height: 90%;
  }
  .flex {
    display: flex;
    height: 90% !important;
    flex-wrap: wrap;
  }
  .patient-sel-buttons{
    button{
      margin-right: 10px;
      margin-top: 20px;
    }
  }
  .example-custom-input{
      font-size: 15px;
      width:180px;
      text-align:center;
      padding-left: 15px;
      padding-right: 15px;
      padding-top: 5px;
      padding-bottom: 5px;
      border: 1px solid;
      margin-left:5px;
      margin-right:5px;
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
    height: 100%;
    width: 100%;
    .main-info{
      overflow: hidden;
      label{
        width: 0px;
        margin: 0px;        
      }      
      input{
        border: 1px solid #aaa;
      }
    }
    .main-info .disease-name {
        height: 80%;
        overflow: hidden;
        border: 1px solid #ddd;
        p {
            margin: 0;
            text-align: center;
            font-size: 20px;
        }
    }
    .history-list{
      overflow-y: auto;
      height: 100%;
      font-size:16px;
      padding-left: 10px;
      border: 1px solid #aaa;      
    }
    .history-list .disease-name {
        height: 80%;
        border: 1px solid #ddd;
        .history-title {
        font-size: 20px;
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
            padding-left: 10px;
            border-radius: 4px;
        } 
    }
  }
  .right-area {    
    height: 100%;
    width: 60%;    
    padding-left: 20px;

    .sc-bdVaJa{
      padding-top: 5px;
      height: 95%;
    }

    .sc-htpNat {
      margin-top: -10px;
      background: none;
      font-size: 16px;
      .tab.active {
          border-left: solid 1px #aaa;
          border-bottom: none;
          border-right: solid 1px #aaa;
          border-top: solid 1px #aaa;
          outline: none;
      }
    }    

    .first-area {
      .entry-date {    
        width: 35%;
        label {
            text-align: right;
            width: 90px;
            font-size: 14px;
            margin-top: 7px;
            margin-bottom: 0;
        }
        input {
            width: 64%;
            height: 35px;
        }
        .react-datepicker-wrapper {
            width: 64%;
            .react-datepicker__input-container {
                width: 100%;
                input {
                    display: block;
                    width: 100%;
                    height: 38px;
                    border-radius: 4px;
                    border-width: 1px;
                    border-style: solid;
                    border-color: rgb(206, 212, 218);
                    border-image: initial;
                    padding: 0px 8px;
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
            font-size: 18px;
            .foot-label {
                height: 40px;
                padding-top: 5px;
                margin-right: 1px;
                width: 49%;
                text-align: center;
                background-color: #4f95ef;
                color: white;
            }
        }
    }
    .third-area {
        padding-top: 20px;
      table {
          td {
              width: 40%;
              label {
                width: 30%;
                text-align: left;
                margin-right: 0;
                font-size: 14px;
              }
              padding: 5px 0px 5px 0;
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
        margin-left: 29px;
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
              height: 22px;
              padding: 0;
          }
          div {
            margin-top: -1px;
          }
      }
    }
  }
  .radio-label {
    width: 115px;;
    padding-top: 10px;
    text-align: right;
  }
  .prev-content {
    .radio-btn label{
        width: 75px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
        font-size: 14px;
    }
  }
  .print-type {
    .radio-btn label{
        width: 75px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
        font-size: 14px;
    }
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .label-box {
    font-size: 16px;
    border: 1px solid #a0a0a0;
  }
  .prev-session {    
    width: 65%;
    padding-left: 5%;
  }
  .pt-20 {
    padding-top: 20px;
  }
  .pt-10 {
    padding-top: 10px;
  }
  .pt-12 {
    padding-top: 12px;
  }
  .padding-top-5 {
    padding-top: 5px;
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
  .cursor{
    cursor:pointer;
  }
  .footer {
    margin-top: 10px!important;
    button span {
        font-size: 20px;
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
    margin-top: 10px;
  }
  .list-content{
    border: 1px solid #ddd;
    height: 200px;
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
    margin-top: 20px;
  }
  .history-item{
    padding: 5px;
  }
  .history-header{
    overflow: hidden;
    display: block;
    margin-bottom: 20px;
  }
  .header-item{
    width: 30%;
    float: left;
    margin-right: 30px;
    label {
        text-align: left;
        width: 60px;
        font-size: 14px;
        margin-top: 7px;
        margin-bottom: 0;
    }
    input {
        width: 64%;
        height: 35px;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;ge
        padding: 0px 8px;
    }        
  }
  .selected {
    background: rgb(105, 200, 225);    
   }
 `;

class MedicineSelectModal extends Component {
  constructor(props) {
    super(props);
      Object.entries(methods).forEach(([name, fn]) =>
          name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
      );
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
                    tab: '文字検索',
                    component: <LetterSearch />,
                    id: 0
                },
                {
                    tab: 'お薬ナビ',
                    component: <MedNavi />,
                    id: 1
                }
            ],
            activeIndex: 0,
            start_date: new Date(),
            end_date: new Date(),
            list_array,
            medicineList: [],
            item_code: "",
            item_name: "",
            amount: "",
            medicine_index: 0,
        }
    }
    async componentDidMount() {
        this.getMedicinesByKind(this.props.medicine_kind);
    }

    getRadio = (name) => {
        if (name === "check") {
            // console.log(name)
        }
    };

    deleteHistory = () => {
    }

    selectTitleTab = e => {
        this.setState({activeIndex: parseInt(e.target.id)});
    }

    openAmountModal = (index) => {
        this.setState({
            isOpenModal: true,
            medicine_index: index,
            medicine:this.state.medicineList[this.state.medicine_index]
        });
    };
    closeModal = () => {
        this.setState({isOpenModal: false})
    };
    inputAmount = (amount) => {
        let medicineList = this.state.medicineList;
        // medicineList[this.state.medicine_index].amount = amount;
        let item_code = medicineList[this.state.medicine_index].code;
        let item_name = medicineList[this.state.medicine_index].name;
        let unit = medicineList[this.state.medicine_index].unit;

        this.setState({
            // medicineList,
            item_code,
            item_name,
            amount,
            unit,
            isOpenModal: false,

        })
    };
    handleOk = () => {
        if (this.state.amount == "") {
            window.sessionStorage.setItem("alert_messages", "数量を入力してください。");
            return;
        }
        let post_data = {
            item_code: this.state.item_code,
            item_name: this.state.item_name,
            amount: this.state.amount,
            unit: this.state.unit,
        };
        this.props.handleOk(post_data,this.props.rp_number,this.props.is_open_usage);
    };

    onHide=()=>{}

  render() {
    let {medicineList} = this.state;
    return  (
      <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal med-select-modal">
        <Modal.Header>
          <Modal.Title>薬剤選択パネル</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Card>
            <Wrapper>
                <div className="flex hp-100 content">
                    <div className="left-area">
                        {/*<div className="main-info">                         */}
                          {/*<InputWithLabel*/}
                            {/*label=""*/}
                            {/*type="text"                            */}
                          {/*/>*/}
                          {/*<div className="patient-sel-buttons">*/}
                            {/*<Button type="mono">內服</Button>*/}
                            {/*<Button type="mono">外用</Button>*/}
                            {/*<Button type="mono">インスリン</Button>*/}
                          {/*</div>*/}
                        {/*</div>*/}
                        <div className="history-list">
                          {medicineList !== undefined && medicineList !== null && medicineList.length > 0 ? (
                              medicineList.map((item, index) => {
                              return (
                                <>
                                  <div className={this.state.medicine_index == index ? "selected cursor" : "cursor"} onClick={this.openAmountModal.bind(this, index)}>
                                    {item.name}
                                  </div>
                                </>)
                              })
                          ) : (
                              <div className="no-result"><span>登録された薬剤がありません。</span></div>
                          )}
                        </div>
                    </div>
                    {/*<div className="right-area">*/}
                    {/*  <CloseableTabs*/}
                    {/*    tabPanelColor='lightgray'*/}
                    {/*    data={this.state.data}                        */}
                    {/*    activeIndex={this.state.activeIndex}*/}
                    {/*    tabContentClass=""*/}
                    {/*  />                      */}
                    {/*</div>  */}
                </div>
                <div className='footer-buttons'>
                  <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                  <Button className="red-btn" onClick={this.handleOk}>選択</Button>
                </div>
            </Wrapper>
          </Card>
            {this.state.isOpenModal && (
                <AmountInputModal
                    closeModal={this.closeModal}
                    handleModal={this.inputAmount}
                    medicine={this.state.medicine}
                    />
            )}
        </Modal.Body>
      </Modal>
    );
  }
}

MedicineSelectModal.contextType = Context;

MedicineSelectModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,
    modal_data:PropTypes.object,
    rp_number: PropTypes.number,
    is_open_usage: PropTypes.number,
    medicine_kind: PropTypes.string,
};

export default MedicineSelectModal;
