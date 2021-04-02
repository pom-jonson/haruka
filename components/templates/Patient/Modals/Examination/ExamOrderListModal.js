import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import ExamGraphModal from './ExamGraphModal'
import ExamTimeSeriesModal from './ExamTimeSeriesModal'
import $ from "jquery";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import {getHalfLength} from "~/helpers/dialConstants"

const Wrapper = styled.div`
  font-size: 1.1rem;
  .clipboard-btn{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
  }
  .selected{
    background: lightgray;
  }
  .clipboard-btn-disable{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
    button{
      pointer-events: none;
      background: #ddd;
      span{
        color: gray;
      }
    }
  }
  table {
    thead {
      display: table;
      width: 100%;
      .td-value {
        width: 126px;
      }
    }
    tbody {
      height: 25.5rem;
      overflow-y: scroll;
      display: block;
    }
    tr {
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    th {
      font-size: 1rem;
      padding: 0.5rem;
    }
    td {
      padding: 0.5rem;
      white-space: nowrap;
    }
    .td-no {
      width: 3rem;
    }
    .item-check{
      width: 1rem;
      z-index: 100;
      label {
        margin-right:0;
      }
      
    }
    .td-number {
      width: 7rem;
    }
    .td-value {
      width:109px;
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
    width:180px;
  }
  .context-menu li {
    clear: both;
    width: 180px;
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
`;

const ContextMenu = ({visible,x,y,parent,item}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() =>parent.contextMenuAction("time", item)}>この検査を並べて表示</div></li>
          {item.is_numeric == 1 && (
            <li><div onClick={() => parent.contextMenuAction("graph",item)}>この検査をグラフで表示</div></li>
          )}
        
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class ExamOrderListModal extends Component {
  constructor(props) {
    super(props);
    let exam_data = this.props.exam_data;
    this.done_numbers = null;
    let show_done_modal = true;
    if (exam_data.administrate_period !== undefined && exam_data.administrate_period.done_numbers !== undefined) {
      this.done_numbers = exam_data.administrate_period.done_numbers;
      show_done_modal = false;
    }
    this.state = {
      exam_data,
      examinations:exam_data.examinations,
      selected_date:exam_data.collected_date,
      order_id : exam_data.number,
      system_patient_id:exam_data.system_patient_id,
      is_enabled: 1,
      number: 0,
      inspection_id :  '',
      openTimeSeriesModal:false,
      openGraphModal:false,
      isUpdateConfirmModal: false,
      confirm_message:"",
      checkList: [],
      allCheck: 0,
      show_done_modal
    }
  }
  
  async componentDidMount() {
    if (this.state.show_done_modal) await this.searchResult();
  }
  searchResult = async () => {
    let path = "/app/api/v2/master/examination/searchExamResult";
    const post_data = {
      params: {
        order_id:this.state.order_id,
        system_patient_id:this.state.system_patient_id,
        examinations: this.state.examinations,
        select_date_time: this.state.select_date_time
      }
    };
    await apiClient.post(path, post_data).then((res)=>{
      var result = res.exam_result;
      var examinations = res.examinations;
      var temp = this.state.examinations;
      if (result != null && result.length > 0) {
        result.map(item => {
          temp.map(val => {
            if (item.examination_code == val.examination_code) {
              val.value = item.value;
              val.number = item.number;
            }
          })
        });
      }
      if (examinations != null && examinations.length > 0) {
        examinations.map(item=>{
          temp.map(val => {
            if (item.code == val.examination_code) {
              val.is_result_item = item.is_result_item;
              val.is_numeric = item.is_numeric;
            }
          })
        })
      }
      this.setState({
        examinations:temp,
      })
      
    });
  }
  
  contextMenuAction = (act, item) => {
    if( act === "time") {
      this.setState({
        item:item,
        openTimeSeriesModal:true,
      })
    } else if (act === "graph") {
      this.setState({
        item:item,
        openGraphModal:true,
      })
    }
  };
  
  getAlwaysShow = (name, value) => {
    if(name==="alwaysShow"){
      this.setState({is_enabled: value})
    }
  };
  
  getValue = (index, e) => {
    var temp = this.state.examinations;
    temp[index].value = parseInt(e);
    this.setState({
      examinations:temp,
    });
  };
  getOrder = e => {
    this.setState({order: parseInt(e.target.value)})
  };
  
  async registerMaster()  {
    let path = "/app/api/v2/master/examination/registerExamResult";
    const post_data = {
      params: {
        order_id:this.state.order_id,
        system_patient_id:this.state.system_patient_id,
        examinations:this.state.examinations,
      }
    };
    await apiClient.post(path, post_data).then((res)=>{
      if (res)
        window.sessionStorage.setItem("alert_messages", res.alert_message);
    });
  }
  
  handleOk = () => {
    if((this.state.system_patient_id === undefined || this.state.system_patient_id == '' || this.state.system_patient_id <= 0)){
      window.sessionStorage.setItem("alert_messages", '患者IDを入力してください。');
      return;
    }
    
    this.registerMaster();
  };
  
  register = () => {
    this.confirmCancel();
  }
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      confirm_message: "",
    });
  }
  
  handleClick = (e, item) => {
    if (item.is_result_item == 0) return;
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
        .getElementById("wordList-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("wordList-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX -$('#exam_order_list_dlg').offset().left,
          y: e.clientY - $(".modal-content").offset().top - 40,
          item: item,
        },
      });
    }
  };
  
  closeModal = () => {
    this.setState({
      openGraphModal:false,
      openTimeSeriesModal:false,
    })
  }
  
  mainCloseModal = () => {
    this.props.readExamination();
  }

  // ■YJ891 検体検査の「検査結果閲覧」の「検査結果一覧」モーダルの変更
  copyToClipboard = () => {
    if(this.state.checkList.length < 1) return;

    if (this.state.examinations != undefined && this.state.examinations.length > 0) {
      
      let clipboard_text = "";
      
      // count item with longest width
      let long_item_count = 0;
      this.state.examinations.filter(item=>{
        if (this.state.checkList.includes(item.examination_code)) {          
          if (long_item_count < getHalfLength(item.name)) {
            long_item_count = getHalfLength(item.name);
          }
          return item;
        }
      }).map(item=>{
        if (item.name != undefined && item.name != "") {          
          clipboard_text += item.name + this.getEmpttySpaces(long_item_count - getHalfLength(item.name));
          if (item.value != undefined && item.value != "") {
            clipboard_text += "　" + item.value;            
            clipboard_text += "\n";            
          } else {
            clipboard_text += "\n";
          }
        }
      });

      if (window.clipboardData) {
        window.clipboardData.setData ("Text", clipboard_text);
      }
    }    

  }

  getRadio(name, value) {
    if (name == "all_check") {    
      if (value == 0) {
        this.setState({
          allCheck: value,
          checkList: [],
        });
      }else{   
        let chkList = []; 
        this.state.examinations.map(item=>{
          chkList.push(item.examination_code);
        });    
        this.setState({
          allCheck: value,
          checkList: chkList
        });
      }
    } else {
      let chkList = [...this.state.checkList];
      if( value === 1) {
        chkList.push(name);
      }
      else {
        var index = chkList.indexOf(name)
        if (index !== -1) {
          chkList.splice(index, 1);
        }
      }
      if (this.state.examinations.length == chkList.length) {
        this.setState({
          checkList: chkList,
          allCheck: 1,
        });
      }else{
        this.setState({
          checkList: chkList,
          allCheck: 0,
        });
      }
    }

  }

  getEmpttySpaces = (_n) => {
    let result = "";
    if(_n < 1) return result;
    let one_space = " ";
    for (var i = _n - 1; i >= 0; i--) {
      result += one_space;
    }
    return result;
  }
  
  selectDoneTime = (value) => {
    this.setState({select_date_time: value});
  }
  
  openDoneModal = () => {
    if (this.state.select_date_time === undefined) {
      return;
    }
    this.setState({show_done_modal: true});
    this.searchResult();
  }
  
  render() {
    let {examinations} = this.state;
    let modal_title = "検査結果一覧";
    if (!this.state.show_done_modal) modal_title = "結果表示対象選択";
    return  (
      <Modal show={true} id="exam_order_list_dlg"  className="exam-order-list-modal">
        <Modal.Header>
          <Modal.Title>{modal_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!this.state.show_done_modal ? (
            <Wrapper>
              <div className="w-100 h-100" style={{padding: "2rem"}}>
                <div className="border w-100 h-100 p-2" style={{overflowY:"auto"}}>
                  {this.done_numbers != null && Object.keys(this.done_numbers).map(date_key=>{
                    let item = this.done_numbers[date_key];
                    return(
                      <>
                        {item.map((sub_item)=>{
                          if (sub_item.completed_at != "") {
                            let date_time = date_key + " " + sub_item.time;
                            return (
                              <div key={sub_item} className={this.state.select_date_time == date_time ? "selected w-100 text-left": "w-100 text-left"} style={{cursor: "pointer"}} onClick={this.selectDoneTime.bind(this, date_time)}>
                                {date_key}　{sub_item.time}
                              </div>
                            )
                          }
                        })}
                      </>
                    )
                  })}
                </div>
              </div>
            </Wrapper>
          ):(
            <Wrapper>
              <div className={this.state.checkList.length > 0 ? 'clipboard-btn' : 'clipboard-btn-disable'}>
                <Button onClick={this.copyToClipboard}>コピー</Button>
              </div>
              <table className='table table-bordered table-striped table-hover' id = "wordList-table">
                <thead>
                <tr>
                  <th className="item-check">
                    <Checkbox
                      label=""
                      getRadio={this.getRadio.bind(this)}
                      value={this.state.allCheck}
                      name={'all_check'}
                    />
                  </th>
                  <th className={'text-center td-name'}>検査項目名</th>
                  <th className={'text-center td-value'}>結果値</th>
                </tr>
                </thead>
                <tbody>
                {examinations != undefined && examinations != null && examinations.length > 0 && (
                  examinations.map(item => {
                    return(
                      <>
                        <tr onContextMenu={e => this.handleClick(e,item)}>
                          <td className={'item-check'}>
                            <Checkbox
                              label=""
                              getRadio={this.getRadio.bind(this)}
                              value={this.state.allCheck == 1 ? 1: this.state.checkList.indexOf(item.examination_code) !== -1 ? 1 : 0}
                              name={item.examination_code}
                            />
                          </td>
                          <td className='td-name'>{item.name}</td>
                          {/*<td className='td-value text-right pr-2'>{isNaN(item.value)? '': item.value}</td>*/}
                          <td className='td-value text-right pr-2'>{!item.value? '': item.value}</td>
                        </tr>
                      </>
                    )
                  })
                )}
                </tbody>
              </table>
            </Wrapper>
          )}
          {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.register.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.openTimeSeriesModal !== false && (
            <ExamTimeSeriesModal
              closeModal = {this.closeModal}
              system_patient_id = {this.state.system_patient_id}
              exam_item = {this.state.item}
              selected_date = {this.state.selected_date}
            />
          )}
          {this.state.openGraphModal !== false && (
            <ExamGraphModal
              closeModal = {this.closeModal}
              system_patient_id = {this.state.system_patient_id}
              exam_item = {this.state.item}
              selected_date = {this.state.selected_date}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.mainCloseModal}>閉じる</Button>
          {!this.state.show_done_modal && (
            <Button className={this.state.select_date_time !== undefined ? "red-btn" : "disable-btn"} onClick={this.openDoneModal}>確定</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

ExamOrderListModal.contextType = Context;

ExamOrderListModal.propTypes = {
  readExamination: PropTypes.func,
  exam_data : PropTypes.object,
};

export default ExamOrderListModal;