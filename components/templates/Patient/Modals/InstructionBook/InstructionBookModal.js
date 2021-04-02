import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Spinner from "react-bootstrap/Spinner";
import InstructionUsageSelectModal from "./InstructionUsageSelectModal";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import DatePicker from "react-datepicker";
import {formatDateFull} from "~/helpers/date";
import Context from "~/helpers/configureStore";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  font-size: 1rem;
  height: 100%;
  .work-list{
    display: flex;
    height: calc(100% - 35rem);
    width: 100%;
    justify-content: space-between;
    .area-1 {
      margin-right: 3px;
      .selected, .selected:hover{
        background:lightblue!important;
      }
      .title{
        text-align: center;
        font-size: 1rem;
        font-weight: bold;
        background-color: #a0ebff;
        border:1px solid lightgray;
        border-bottom: none;
        padding: 0.2rem;
      }
      .content{
        height: calc(100% - 2rem);
        border:1px solid lightgray;
        p {
          margin: 0;
          cursor: pointer;
          padding-left: 0.25rem;
        }
        p:hover {
          background-color: rgb(246, 252, 253);
        }
        overflow-y:auto;
      }
    }
  }
  .btn-group {
    .change-date-btn {
      height: 2rem;
    }
  }
  .disabled{
    opacity: 0.5;
  }
  .disabled:hover{
    border:none;
  }
  .button-add, .button-update, .button-stop {
    padding: 0.5rem;
    width: 10rem;
    span {
      font-size: 1rem;
    }
  }
  .react-datepicker{
    width: 130% !important;
    font-size: 1.25rem;
    .react-datepicker__month-container{
      width:79% !important;
      height:24.375rem;
    }
    .react-datepicker__navigation--next--with-time{
      right: 6rem;
    }
    .react-datepicker__time-container{
      width:21% !important;
    }
    .react-datepicker__time-box{
      width:auto !important;
    }
    .react-datepicker__current-month{
      font-size: 1.25rem;
    }
    .react-datepicker__day-names, .react-datepicker__week{
      display: flex;
      justify-content: space-between;
    }
    .react-datepicker__month{
      .react-datepicker__week{
        margin-bottom:0.25rem;
      }
    }
  }
  .table-area {
    width: 100%;
    margin: auto;
    margin-left: 11px;
    font-size: 1rem;
    font-family: "Noto Sans JP", sans-serif;
    table {
        margin-bottom:0;
        thead{
          display: table;
          width:calc(100% - 17px);
        }
        tbody{
          height: 23rem;
          overflow-y:scroll;
          display:block;
          background: white;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
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
        .td-rp {
          width: 2rem;
        }
        .td-content{
          text-align: left;
        }
        .td-slip {
          width: 10%;
        }
        .td-usage {
            width: 10%;
        }
        .td-date {
            width: 12rem;
        }
        .td-btn {
          width: 5rem;
          button {
            width: 100%;
          }
        }
     }
  }
  .selected {
    background: rgb(105, 200, 225) !important;
    color: white;
  }
  .no-result {
    padding: 10rem;
    text-align: center;
    font-size: 1rem;
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
`;
const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  display: table-caption;
  position: relative;
  top: 10rem;
`;
const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0 0rem;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
`;

const ContextMenu = ({ visible, x,  y,  parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li onClick={() => parent.contextMenuAction("edit")}><div>変更</div></li>
          <li onClick={() => parent.contextMenuAction("delete")}><div>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class InstructionBookModal extends Component {
  constructor(props) {
    super(props);
    this.state={
      instruction_large_master: [],
      instruction_middle_master: [],
      instruction_content_master: [],
      table_list: [],
      is_loaded: false,
      isOpenUsageModal: false,
      is_added: false,
      confirm_message : "",
      alert_messages : "",
      selected_index: -1,
      edit_flag:false,
      selected_large_number:0,
      selected_middle_number:0,
      selected_content_number:0,
      all_master:{
        large_master_data:[],
        middle_master_data: [],
        content_master_data: []
      },
      start_date: new Date(),
      end_date: new Date(),
    }
    this.is_changed = false;
  }
  
  async componentDidMount() {
    await this.getInstructionBookMster();
    await this.getInstructionBook();
  }

  getInstructionBookMster = async() => {
    var path = "/app/api/v2/instruction_book/search_master";
    await apiClient._post(path, {params: {}})
      .then((res) => {
        if (res){
          this.setState({
            instruction_large_master:res.large_master_data,
            all_master: res,
            selected_large_number:res.large_master_data[0] != undefined ? res.large_master_data[0].number:0,
          }, () => {
              this.getInstructionSubCategory(this.state.selected_large_number);
          })
        } else {
          this.setState({
            instruction_large_master:[],
            instruction_middle_master:[],
            instruction_content_master:[],
            selected_large_number:0,
            selected_middle_number:0,
            selected_content_number:0
          })
        }
      })
      .catch(() => {
      });
  }

  getInstructionSubCategory = async(large_number) => {
    let middle_master = this.state.all_master.middle_master_data;
    let filterarray = middle_master.filter(x=>x.catergory_detail_id == large_number);
    if (filterarray.length > 0) {
      this.setState({
        instruction_middle_master:filterarray,
        selected_middle_number:filterarray[0].number,
        selected_middle_name:filterarray[0].name,
      }, () => {
        this.getInstructionContent(this.state.selected_middle_number);
      });
    } else {
      this.setState({
        instruction_middle_master:[],
        instruction_content_master:[],
        selected_middle_number:0,
        selected_content_number:0
      })
    }
  }

  getInstructionContent = async(middle_number) => {
    let content_master = this.state.all_master.content_master_data;
    let filterarray = content_master.filter(x=>x.subcatergory_detail_id == middle_number);
    if (filterarray.length > 0) {
      this.setState({
        instruction_content_master:filterarray,
        selected_content_number:filterarray[0].number,
      });
    } else {
      this.setState({
        instruction_content_master:[],
        selected_content_number:0,
      });
    }
  }

  getInstructionBook = async() => {
    var path = "/app/api/v2/instruction_book/search_instruction_book";
    await apiClient._post(path, {params: {patient_id: this.props.patientId}})
      .then((res) => {
        if (res.alert_message) {
          this.setState({
            alert_messages: res.alert_message,
            is_loaded: true,
            close_main: true
          });
          return;
        }
        let table_list = res;
        if (this.props.copied_item !== undefined) {
          let insert_item = this.props.copied_item;
          delete insert_item.number;
          table_list.push(insert_item);
        }
        this.setState({ table_list, is_loaded: true});
      })
      .catch(() => {
      }).finally(()=>{
        this.setState({is_loaded: true});
      });
  }
  //大分類選択
  selectCategory = (number) => {
    this.setState({
      selected_large_number: number,
    }, () => {
      this.getInstructionSubCategory(number);
    });
  };

  //中分類選択
  selectSubCategory = (number, name) => {
    this.setState({
      selected_middle_number: number,
      selected_middle_name: name,
    }, () => {
      this.getInstructionContent(number);
    });
  };

  //内容選択
  selectContent = (number, name) => {
    this.setState({
      selected_content_number: number,
      selected_content_name: name,
    });
  };

  selectRow = (item, index) => {
    this.setState({
      selected_item:item,
      selected_index: index,
    })
  };

  openUsageModal = (item, index) => {
    this.setState({
      selected_item:item,
      selected_index: index,
      isOpenUsageModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      isOpenUsageModal: false,
    })
  };
  
  addContent = () => {
    // if(this.state.edit_flag) return false;
    if (!(this.state.selected_middle_number > 0)) {
      this.setState({alert_messages: "中分類を選択してください。"});
      return;
    }
    if (!(this.state.selected_content_number > 0)) {
      this.setState({alert_messages: "内容を選択してください。"});
      return;
    }
    this.is_changed = true;
    let {table_list} = this.state;
    let insert_item = {
      Rp: table_list.length,
      subcatergory_detail_id: this.state.selected_middle_number,
      subcatergory_detail_name: this.state.selected_middle_name,
      drug_content_id: this.state.selected_content_number,
      drug_content_name: this.state.selected_content_name,
      start_date: "",
      end_date: "",
      title: "",
      is_new: 1,
    };
    table_list.push(insert_item);
    this.setState({table_list, is_changed: true});
  };
  
  editRow = () => {
    if(!this.state.edit_flag) return;
    let {table_list, selected_index} = this.state;
    if (table_list[selected_index] === undefined) return;
    table_list[selected_index].subcatergory_detail_id = this.state.selected_middle_number;
    table_list[selected_index].subcatergory_detail_name = this.state.selected_middle_name;
    table_list[selected_index].drug_content_id = this.state.selected_content_number;
    table_list[selected_index].drug_content_name = this.state.selected_content_name;
    // table_list[selected_index].start_date = "";
    // table_list[selected_index].end_date = "";
    // table_list[selected_index].title = "";
    table_list[selected_index].is_edit = 1;
    this.setState({table_list,
      edit_flag: false,
      is_changed: true
    });
  };
  saveUsage = (usage_data) => {
    this.closeModal();
    if (this.state.all_usage_change) {
      let {table_list} = this.state;
      table_list.map(item=> {
        item.title = usage_data.title;
        item.target_time_info_array = usage_data.target_time_info_array;
        item.time_interval_id = usage_data.time_interval_id;
        item.number_of_times_per_day = usage_data.number_of_times_per_day;
        item.usage_class = usage_data.usage_class;
        if (usage_data.usage_class != 1) {
          item.target_time_ids = undefined;
        }
        item.is_edit = 1;
      });
      this.setState({
        table_list,
        all_usage_change: undefined,
        is_changed: true
      });
      return;
    } else {
      let {selected_index, selected_item, table_list} = this.state;
      selected_item.title = usage_data.title;
      selected_item.start_date = usage_data.start_date;
      selected_item.end_date = usage_data.end_date;
      selected_item.target_time_info_array = usage_data.target_time_info_array;
      selected_item.time_interval_id = usage_data.time_interval_id;
      selected_item.number_of_times_per_day = usage_data.number_of_times_per_day;
      selected_item.usage_class = usage_data.usage_class;
      selected_item.is_edit = 1;
      table_list[selected_index] = selected_item;
      this.setState({table_list, is_changed: true});
    }
  }
  saveInstruction = (is_continue) => {
    // this.setState({is_continue})
    // this.props.closeModal();
    if (!this.state.is_changed) return;
    let alert_messages = "";
    let {table_list} = this.state;
    table_list.map(item => {
      if (item.start_date === undefined || item.start_date == null || item.start_date == "") {
        alert_messages = "開始日を入力してください。";
        return;
      }
      if (item.start_date !== undefined && item.start_date != null && item.start_date !== "" && item.end_date !== undefined && item.end_date != null && item.end_date !== "") {
        if (!this.checkDate(item.start_date, item.end_date)) {
          alert_messages = "終了は開始以降の日付を選択してください。";
        }
      }
    });
    if (alert_messages !== "") {
      this.setState({alert_messages});
      return;
    }
    this.setState({
      confirm_message: "確定しますか？",
      confirm_action: is_continue ? "register_continue" : "register_one"
    })
  };
  
  handleClick = (e, index) => {
    if (e.type === "contextmenu") {
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
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("instruction_book_modal").offsetLeft,
          y: e.clientY + window.pageYOffset - 60,
        },
        selected_index:index,
      });
    }
  };
  
  contextMenuAction = (act) => {
    if (act === "delete") {
      this.setState({
        confirm_message: "削除しますか？",
        confirm_action: "delete"
      })
    } else if (act == "edit") {
      let content_master = this.state.all_master.content_master_data;
      let middle_master = this.state.all_master.middle_master_data;
      
      let selected_item = this.state.table_list[this.state.selected_index];
      
      let selected_content_number = selected_item.drug_content_id;
      let selected_middle_number = selected_item.subcatergory_detail_id;
      
      let find_middle_data = middle_master.find(x=>x.number == selected_middle_number);
      let selected_middle_name = find_middle_data.name;
      let find_content_data = content_master.find(x=>x.number == selected_content_number);
      let selected_content_name = find_content_data.content;
      
      let selected_large_number = find_middle_data !== undefined ? find_middle_data.catergory_detail_id : 0;
      let content_filterarray = content_master.filter(x=>x.subcatergory_detail_id == selected_middle_number);
      let middle_filterarray = middle_master.filter(x=>x.catergory_detail_id == selected_large_number);
      
      this.setState({
        selected_large_number,
        selected_middle_number,
        instruction_middle_master: middle_filterarray,
        instruction_content_master: content_filterarray,
        selected_content_number,
        selected_middle_name,
        selected_content_name,
        edit_flag: true
      })
    }
  };
  
  doneEdit = () => {
    if(this.state.edit_flag == false) return false;
    this.is_changed = true;
    this.setState({
      edit_flag: false,
      selected_large_number:0,
      selected_middle_number:0,
      selected_content_number:0,
      selected_index: -1
    })
  }
  
  confirmCancel = () => {
    if (this.state.confirm_action == "register_continue") {
      this.getInstructionBook();
    }
    this.setState({
      confirm_message : "",
      confirm_action : "",
      alert_messages : "",
      selected_index: -1,
    });
    if (this.state.close_main) {
      this.props.closeModal();
    }
  };
  
  confirmOk = () => {
    this.confirmCancel();
    if (this.state.confirm_action == "delete") {
      let {selected_index, table_list} = this.state;
      if (table_list[selected_index] === undefined || table_list[selected_index] == null) return;
      if (table_list[selected_index].is_new == 1) {
        table_list.splice(selected_index, 1);
      } else {
        table_list[selected_index].is_delete = 1;
      }
      this.is_changed = true;
      this.setState({
        table_list,
        is_changed: true
      });
    } else if (this.state.confirm_action == "register_one" || this.state.confirm_action == "register_continue") {
      this.setState({close_main: true});
      this.saveData();
    }
  }
  checkDate(from, to) {
    from = new Date(from);
    to = new Date(to);
    if (from.getTime() > to.getTime()) return false;
    return true;
  }
  
  saveData = async () => {
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let karte_status = 1;
    if (this.context.karte_status.name === "訪問診療") {
      karte_status = 2;
    } else if(this.context.karte_status.name === "入院") {
      karte_status = 3;
    }
    let {table_list} = this.state;
    let content_list = [];
    table_list.map(item => {
      if (item.is_new == 1 || item.is_edit == 1 || item.is_delete == 1) {
        content_list.push(item);
      }
    });
    var path = "/app/api/v2/instruction_book/register_instruction_book";
    await apiClient._post(path, {params: {
      patient_id: this.props.patientId,
        table_list: content_list,
        department_id: this.context.department.code == 0 ? 1 : this.context.department.code,
        doctor_code: authInfo.doctor_code == 0 ? this.context.selectedDoctor.code : authInfo.doctor_code,
        karte_status
    }})
      .then((res) => {
        if (res){
          this.setState({alert_messages:"指示簿を登録しました。"});
        }
      })
      .catch(() => {
      });
  };
  
  getSubCategoryName = (subcategory_id) => {
    let middle_master = this.state.all_master.middle_master_data;
    let find_data = middle_master.find(x=>x.number == subcategory_id);
    if (find_data === undefined) return "";
    return find_data.name;
  }
  getContentName = (content_id) => {
    let content_master = this.state.all_master.content_master_data;
    let find_data = content_master.find(x=>x.number == content_id);
    if (find_data === undefined) return "";
    return find_data.content;
  };
  
  getDate = (key,value) => {
    let {table_list} = this.state;
    if (table_list.length == 0) return;
    if (value == null) {
      value = new Date();
    }
    table_list.map(item => {
      item[key] = formatDateFull(value, "/");
      item.is_edit = 1;
    });
    this.setState({
      [key]: value,
      table_list,
      is_changed: true
    });
  };
  
  changeAllUsage = () => {
    this.setState({
      all_usage_change: true,
      isOpenUsageModal: true,
      selected_item: undefined
    });
  }
  
  render() {
    let {instruction_large_master, instruction_middle_master, instruction_content_master, table_list} = this.state;
    const CustomStartDateInput = ({onClick}) => (<Button type="common" onClick={onClick} className="change-date-btn">一括開始日変更</Button>);
    const CustomEndDateInput = ({onClick}) => (<Button type="common" className={`ml-2 change-date-btn`} onClick={onClick}>一括終了日変更</Button>);
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal outpatient-modal first-view-modal" id ="instruction_book_modal">
          <Modal.Header><Modal.Title>指示簿</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={`w-100 d-flex mt-2 mb-2`}>
                  <div className={`w-50 text-left`}>指示</div>
                  <div className={`w-50 text-right`}>
                    <Button type="common" onClick={this.getInstructionBook}>現在有効な指示一覧</Button>
                  </div>
                </div>
                <div className="work-list">
                  <div className="area-1" style={{width:"30%"}}>
                    <div className="title">大分類</div>
                    <div className="content">
                      {instruction_large_master !== undefined && instruction_large_master.length>0 && (
                        instruction_large_master.map(item => {
                          return (
                            <>
                            <p className={item.number===this.state.selected_large_number?"selected":""} onClick = {this.selectCategory.bind(this, item.number,item.name)}>{item.name}</p>
                            </>
                          )
                        })
                      )}
                    </div>
                  </div>
                  <div className="area-1" style={{width:"30%"}}>
                    <div className="title">中分類</div>
                    <div className="content">
                      {instruction_middle_master !== undefined && instruction_middle_master.length>0 && (
                        instruction_middle_master.map(item => {
                          return (
                            <>
                            <p className={item.number===this.state.selected_middle_number?"selected":""}
                              onClick = {this.selectSubCategory.bind(this, item.number, item.name)}
                            >{item.name}</p>
                            </>
                          )
                        })
                      )}
                    </div>
                  </div>
                  <div className="area-1" style={{width:"40%"}}>
                    <div className="title">内容</div>
                    <div className="content">
                      {instruction_content_master !== undefined && instruction_content_master.length>0 && (
                        instruction_content_master.map(item => {
                          return (
                            <>
                            <p className={item.number==this.state.selected_content_number?"selected":""}
                              onClick = {this.selectContent.bind(this, item.number, item.content)}
                              onDoubleClick={this.addContent.bind(this, item.number, item.content)}
                            >{item.content}</p>
                            </>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>
                <div className={'notice-area mt-3 mb-3'}>※指示内容を削除する時は、一覧の削除したい行の上で右クリックして、削除をクリックしてください。</div>
                <div className="d-flex w-100 mb-3">
                  <div className="w-75">
                    <Button isDisabled={this.state.edit_flag} className ={this.state.edit_flag?"button-add mr-2 disabled":"button-add mr-2"} onClick = {this.addContent.bind(this)}>↓追加</Button>
                    <Button isDisabled={this.state.edit_flag} className ={this.state.edit_flag?"button-update mr-2":"disabled mr-2 button-update"} onClick = {this.editRow.bind(this)}>変更確定</Button>
                    <Button isDisabled={this.state.edit_flag} className ={this.state.edit_flag?"button-stop":"disabled button-stop"} onClick = {this.doneEdit.bind(this)}>変更中止</Button>
                  </div>
                  <div className={`d-flex btn-group`} style={{width:'27rem'}}>
                    <DatePicker
                      locale="ja"
                      selected={this.state.start_date}
                      onChange={this.getDate.bind(this, "start_date")}
                      dateFormat="yyyy/MM/dd HH:mm"
                      timeCaption="時間"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={10}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      customInput={<CustomStartDateInput />}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                    <DatePicker
                      locale="ja"
                      selected={this.state.end_date}
                      onChange={this.getDate.bind(this, "end_date")}
                      dateFormat="yyyy/MM/dd HH:mm"
                      timeCaption="時間"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={10}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      customInput={<CustomEndDateInput />}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                    <Button type="common" className={`ml-2 change-date-btn`} onClick={this.changeAllUsage}>一括用法変更</Button>
                  </div>
                </div>
                <div className={'table-area'}>
                  <table className="table-scroll table table-bordered" id="code-table" onKeyDown={this.onKeyPressed} tabIndex="0">
                    <thead>
                    <tr>
                      <th className={'td-rp'}>Rp</th>
                      <th className={'td-slip'}>伝票</th>
                      <th className={'td-content'}>内容</th>
                      <th className={'td-date'}>開始日</th>
                      <th className={'td-date'}>終了日</th>
                      <th className={'td-usage'}>用法</th>
                      <th className={'td-btn'}/>
                    </tr>
                    </thead>
                      <tbody>
                    {this.state.is_loaded ? (
                      <>
                      {table_list !== undefined && table_list != null && table_list.length > 0 ? table_list.map((item,index)=>{
                        if (item.is_delete != 1)
                        return (
                        // <tr onContextMenu={e => this.handleClick(e, index)} onClick={this.selectRow.bind(this, item, index)} key={item}  className={this.state.selected_index === index ? "selected" : ""}>
                        <tr onContextMenu={e => this.handleClick(e, index)} key={item}  className={this.state.selected_index === index ? "selected" : ""}>
                          <td className={`td-rp`}>{index + 1}</td>
                          <td className={`td-slip`}>{this.getSubCategoryName(item.subcatergory_detail_id)}</td>
                          <td className={`td-content`}>{this.getContentName(item.drug_content_id)}</td>
                          <td className={'td-date'}>{item.start_date != null && item.start_date != "" ? item.start_date.replace(/-/gi, "/").substr(0, 16) : ""}</td>
                          <td className={'td-date'}>{item.end_date != null && item.end_date != "" ? item.end_date.replace(/-/gi, "/").substr(0, 16) : item.start_date != "" ? "日未定" : ""}</td>
                          <td className={'td-usage'}>{item.title}</td>
                          <td className={'td-btn'}><Button type="common" onClick={this.openUsageModal.bind(this,item)}>用法</Button> </td>
                        </tr>
                      )}):(
                        <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
                      )}
                    </>
                    ):(
                      <div className='text-center' style={{marginLeft:"50%"}}>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </div>
                    )}
                      </tbody>
                  </table>
                </div>
              </Wrapper>
              <ContextMenu
                {...this.state.contextMenu}
                parent={this}
              />
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={this.state.is_changed ? "red-btn" : "disable-btn"} onClick={this.saveInstruction.bind(this,false)}>確定</Button>
            <Button className="red-btn" onClick={this.saveInstruction.bind(this,true)}>確定（連続）</Button>
          </Modal.Footer>
        </Modal>
        {this.state.isOpenUsageModal && (
          <InstructionUsageSelectModal
            closeModal={this.closeModal}
            modal_data={this.state.selected_item}
            saveUsage={this.saveUsage}
            />
        )}
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </>
    );
  }
}
InstructionBookModal.contextType = Context;

InstructionBookModal.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
  cache_index:PropTypes.number,
  from_source:PropTypes.string,
  selected_item:PropTypes.object,
  copied_item:PropTypes.object,
};

export default InstructionBookModal;