import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import { surface } from "~/components/_nano/colors";
import PropTypes from "prop-types";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import * as apiClient from "../../../../api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import $ from "jquery";

const Card = styled.div`
  position: relative;
  overflow: hidden;
  overflow-y: auto;
  margin: 0px;
  float: left;
  width: 100%;
  height: 100%;
  background-color: ${surface};
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
      font-size: 20px;
      font-weight: 100;
    }
  }
  .patient-no{
      width:92px
  }
  .sex{
      width:55px;
  }
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 14px;
  display: flex;
  overflow: hidden;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  
  .history-list{
    overflow: hidden;
    font-size:1rem;
    table {
      margin:0;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc(80vh - 17.5rem);
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
      }
      tr{
        display: table;
        width: 100%;
      }
      thead{
        display:table;
        width:100%;
        border-bottom: 1px solid #dee2e6;
        tr{width: calc(100% - 17px);}
      }
      td {
        padding: 0.3rem;
        word-break: break-all;
        font-size: 1rem;
        vertical-align: middle;
      }
      th {
        position: sticky;
        text-align: center;
        padding: 0.25rem;
        font-size: 1rem;
        white-space:nowrap;
        border:1px solid #dee2e6;
        border-bottom:none;
        border-top:none;
        font-weight: normal;
      }
      .selected {
        background: rgb(105, 200, 225) !important;
        color: white;
      }
    }
  }
  .left-area {
    height: 100%;
    width: 50%;
  }
  .right-area {
    height: 100%;
    width: 50%;
    margin-left: 0.5rem;
    .selected-patients:hover {
        background: rgb(105, 200, 225) !important;
        color: white;
    }
  }
  .label-box {
    font-size: 16px;
    border: 1px solid #a0a0a0;
  }
  .cursor{
    cursor:pointer;
  }
  .change-no {
    padding-top: 15px;
    label {
        font-size: 16px;
    }
  }
  .search_word {
    display: flex;
    font-size: 18px;
    margin-bottom: 2px;
    button{
      padding: 0;
      height: 2.3rem;
      span{
        font-weight: 100;
        font-size: 1rem;
      }
    }
    button {width:6rem;}
    .select-id{
        width:40%;
        div {
          width: calc(100% - 6rem);
          div {display:none;}
          input {
            ime-mode:active;
          }
        }
    }
    .select-word{
        width:100%;
        div {
          width: calc(100% - 6rem);
          div {display:none;}
          input {
            ime-mode:active;
          }
        }
    }
    label {
        width: 0;
        margin-bottom: 3px;
    }
    input {
      font-size: 1rem;
      height: 2.3rem;
      margin-top: 0;
    }
  }
 `;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    width:60px;
  }
  .context-menu li {
    clear: both;
    width: 60px;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
    color:black;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible,x,y,parent,index}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("delete",index)}>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class SelectMultiPatientModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientsList: [],
      search_word:'',
      search_id:'',
      search_type:0,
      cur_caret_pos:0,
      is_kana: 0,
      showAlert: false,
      is_searched: false,
      isCloseConfirm: false,
      confirm_message: "",
      showTitle: "",
      modal_data: {},
      seleted_patients:[],
    };
    this.change_flag = 0;
  }
  async componentDidMount() {
  }
  
  onClickInputWord = () => {
    let search_input_obj = document.getElementById("search_input");
    let cur_caret_pos = search_input_obj.selectionStart;
    this.setState({cur_caret_pos});
  };
  
  searchPatientsList = () => {
    this.setState({
      is_kana: 0,
    },() => {
      this.getPatientsListSearchResult();
    });
  };
  searchPatientsListKana = () => {
    this.setState({
      is_kana: 1,
    },() => {
      this.getPatientsListSearchResult();
    });
  };
  
  getPatientsListSearchResult = async () => {
    this.setState({systemPatientId: 0});
    const {
      pageStatus,
      limitStatus
    } = this.context;
    // let schValId = this.state.search_id;
    let schValKana = this.state.search_word;
    // let is_kana = this.state.is_kana;
    let treatStatus=2;
    
    let path = "/app/api/v2/patients/search_patient";
    let post_data = {
      from_group_master:1,
    };
    
    // if (!is_kana){
    //     post_data.keyword = schValId != "" ? schValId : "";
    // } else {
    //     post_data.keywordKana = schValKana != "" ? schValKana : "";
    // }
    post_data.keywordKana = schValKana != "" ? schValKana : "";
    post_data.status = treatStatus ? treatStatus:0;
    post_data.page = pageStatus ? pageStatus:1;
    post_data.limit = limitStatus != 20 ? limitStatus : "";
    
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if (res) {
          this.setState({is_searched: true,  patientsList:res });
        }
      })
      .catch(() => {
      });
  };
  
  searchId = e => {
    var word = e.target.value;
    word = word.toString().trim();
    this.convertStr(word);
    // this.context.$updateSchIdVal(word);
    this.setState({
      is_kana: 0,
      search_id:word
    });
  };
  searchKana = e => {
    var word = e.target.value;
    let search_input_obj = document.getElementById("search_input");
    let cur_caret_pos = search_input_obj.selectionStart;
    word = word.toString().trim();
    this.setState({
      search_word:word,
      is_kana: 1,
      cur_caret_pos:cur_caret_pos
    });
  };
  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.searchPatientsList();
    }
  };
  enterPressedKana = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.searchPatientsListKana();
    }
  };
  
  convertStr = str => {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
  };
  
  selectPatient = (value) => {
    this.change_flag = 1;
    let seleted_patients =  this.state.seleted_patients;
    let exit_array = seleted_patients.filter(item => {
      if (item.systemPatientId === value.systemPatientId) return item;
    });
    if(exit_array.length > 0) return;
    seleted_patients.push(value);
    this.setState({
      systemPatientId: value.systemPatientId,
      select_number: value.systemPatientId,
      seleted_patients,
    })
  };
  
  handleOk = () =>{
    var duplicated_patients = [];
    if (this.state.seleted_patients.length > 0) {
      this.state.seleted_patients.map(item => {
        if (item.visit_group_id > 0 && item.visit_group_id != this.props.group_id){
          duplicated_patients.push(item);
        }
      })
      this.props.handleOk(this.state.seleted_patients, duplicated_patients);
    } else {
      this.setState({
        showAlert: true
      });
    }
  };
  
  closeAlert = () => {
    this.setState({
      showAlert: false,
      showTitle: "",
      isCloseConfirm: false,
      confirm_message: "",
    });
  }
  
  contextMenuAction = (act, index) => {
    if (act === "delete") {
      let seleted_patients = this.state.seleted_patients;
      delete seleted_patients[index];
      this.setState({
        seleted_patients,
      })
    }
  };
  
  handleClick = (e, index) => {
    if (e.type === "contextmenu"){
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
        .getElementById("selected-patients")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({contextMenu: {visible: false}});
          document
            .getElementById("selected-patients")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let modal_left = $('#select_pannel_modal').offset().left;
      let left_area_left = document.getElementsByClassName('left-area')[0].offsetLeft;
      let modal_top = document.getElementsByClassName('modal-dialog')[0].offsetTop;
      let modal_header_height = document.getElementsByClassName('modal-header')[0].offsetHeight;
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - modal_left - left_area_left,
          y: e.clientY + window.pageYOffset - modal_header_height - modal_top,
          index: index,
        },
      });
    }
  };
  
  confirmClose=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        isCloseConfirm:true,
      });
    } else {
      this.props.closeModal();
    }
  }
  
  render() {
    let {patientsList} = this.state;
    return  (
      <Modal show={true} id="select_pannel_modal"  className="select-multi-patient-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>患者選択</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Wrapper>
              <div className="left-area">
                <div className={'search_word'}>
                  <div className="select-word d-flex border p-1">
                    <InputKeyWord
                      id={'search_input'}
                      type="text"
                      label=""
                      onChange={this.searchKana.bind(this)}
                      onKeyPressed={this.enterPressedKana}
                      onClick={this.onClickInputWord}
                      value={this.state.search_word}
                      placeholder="患者ID/患者名"
                    />
                    <Button type="mono" className="search-btn ml-2" onClick={this.searchPatientsListKana.bind(this)}>検索</Button>
                  </div>
                </div>
                <div className="history-list" style={{height: 'calc(100% - 51px)'}}>
                  <table className="table-scroll table table-bordered" id={`inspection-pattern-table`}>
                    <thead>
                    <tr>
                      <th style={{width:"6rem"}} className="patient-no">患者番号</th>
                      <th style={{width:"10rem"}}>氏名</th>
                      <th style={{width:"8rem"}}>カナ氏名</th>
                      <th style={{width:"3rem"}} className="sex">性別</th>
                      <th style={{width:"10rem"}}>訪問診療先</th>
                      <th>訪問診療グループ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(patientsList !== undefined && patientsList != null && patientsList.length > 0) ? (
                      patientsList.map((item, index) => {
                        if(item.is_enabled !== 0){
                          return (
                            <>
                              <tr key={index} className={this.state.select_number == item.systemPatientId ? "selected cursor" : "cursor"} onClick={this.selectPatient.bind(this,item)}>
                                <td style={{textAlign:"right", width:"6rem"}}>{item.patientNumber}</td>
                                <td style={{width:"10rem"}}>{item.name}</td>
                                <td style={{width:"8rem"}}>{item.patient_name_kana}</td>
                                <td style={{width:"3rem"}}>{item.sex === 1?"男性":"女性"}</td>
                                <td style={{width:"10rem"}}>{item.place_name}</td>
                                <td>{item.group_name}</td>
                              </tr>
                            </>
                          )
                        }
                      })
                    ) : (
                      <>
                        {this.state.is_searched && (
                          <tr>
                            <td colSpan={'6'} className={'text-center'}>条件に一致する結果は見つかりませんでした。</td>
                          </tr>
                        )}
                      </>
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="right-area history-list">
                <table className="table-scroll table table-bordered">
                  <thead>
                  <tr>
                    <th style={{width:"6rem"}} className="patient-no">患者番号</th>
                    <th style={{width:"10rem"}}>氏名</th>
                    <th style={{width:"8rem"}}>カナ氏名</th>
                    <th style={{width:"3rem"}}>性別</th>
                    <th style={{width:"10rem"}}>訪問診療先</th>
                    <th>訪問診療グループ</th>
                  </tr>
                  </thead>
                  <tbody style={{height:"calc(80vh - 14.8rem)"}} id={`selected-patients`}>
                  {this.state.seleted_patients.length > 0 && (
                    this.state.seleted_patients.map((item, index) => {
                      if(item.is_enabled !== 0){
                        return (
                          <>
                            <tr key={index} className={'selected-patients cursor'} onContextMenu={e =>this.handleClick(e,index)}>
                              <td style={{textAlign:"right", width:"6rem"}}>{item.patientNumber}</td>
                              <td style={{width:"10rem"}}>{item.name}</td>
                              <td style={{width:"8rem"}}>{item.patient_name_kana}</td>
                              <td style={{width:"3rem"}}>{item.sex === 1?"男性":"女性"}</td>
                              <td style={{width:"10rem"}}>{item.place_name}</td>
                              <td>{item.group_name}</td>
                            </tr>
                          </>
                        )
                      }
                    })
                  )}
                  </tbody>
                </table>
              </div>
            </Wrapper>
          </Card>
          {this.state.showAlert && (
            <SystemAlertModal
              hideModal= {this.closeAlert}
              handleOk= {this.closeAlert}
              showMedicineContent= {this.state.showTitle == "" ? "患者様を選択してください。" : this.state.showTitle}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
          {this.state.isCloseConfirm && (
            <SystemConfirmJapanModal
              hideConfirm={this.closeAlert.bind(this)}
              confirmCancel={this.closeAlert.bind(this)}
              confirmOk={this.props.closeModal}
              confirmTitle={this.state.confirm_message}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.confirmClose}>キャンセル</Button>
          <Button className="red-btn" onClick={this.handleOk}>選択</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SelectMultiPatientModal.contextType = Context;

SelectMultiPatientModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk:   PropTypes.func,
  group_id:PropTypes.number,
};

export default SelectMultiPatientModal;
