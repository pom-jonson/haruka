import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
// import {formatDateLine, formatDateSlash} from "~/helpers/date";
import {formatDateLine} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Checkbox from "~/components/molecules/Checkbox";
import Radiobox from "~/components/molecules/Radiobox";
import Button from "~/components/atoms/Button";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
registerLocale("ja", ja);
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 label {
   margin-bottom:0;
   height:2.2rem;
   line-height:2.2rem;
 }
 button {
  height: 2.2rem;
  font-size: 1rem;
 }
.select-period {
    .period-title {    
        line-height: 2.2rem;
        width: 70px;
        text-align: right;
        margin-right: 10px;
    }
    div {
        margin-top: 0;
    }
    input {
      width:7rem;
      height:2.2rem;
    }
    .from-to{
        padding-left:5px;                
        padding-right:5px;    
        line-height: 2.2rem;
    }
    .label-title {
        width: 0;
        margin: 0;
    }
}
.pullbox-select {
    height: 2.2rem;
    width: 10rem;
}
.pullbox {
    .label-title {
        width: 70px;
        text-align: right;
        line-height: 2.2rem;
        margin-right: 10px;
        font-size: 16px;
    }
}
.radio-area {
    label {
        line-height: 2.2rem;
        font-size: 14px;
        width: 10rem;
    }
}
.table-title {
    margin-top: 0.5rem;
    label {
        margin-bottom: 0;
    }
    .table-name {
        border: 1px solid #aaa;
        width: 180px;
        text-align: center;
    }
    .table-color {
        width: 100px;
        text-align: center;
    }
    .table-request {
        width: 50px;
        text-align: center;
    }
    .table-ok {
        width: 50px;
        text-align: center;
        border: 1px solid #aaa;
    }
}

.table-area {
  table {
    font-size: 1rem;
    margin-bottom: 0;
  }
    
    thead{
      margin-bottom: 0;
      display:table;
      width:100%;        
      border: 1px solid #dee2e6;
      tr{
          width: calc(100% - 17px);
      }
    }
    tbody{
      height: 65vh;
      overflow-y: scroll;
      display:block;      
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;
        text-align: left;
        vertical-align: middle;
    }
    th {
        text-align: center;
        padding: 0.3rem;
    }      
    .tl {
        text-align: left;
    }      
    .tr {
        text-align: right;
    }
    .white-row:hover {background-color: #f2f2f2;}
    .purple-row {
      background-color: #A757A8;
      color:white;
    }
    .purple-row:hover {
      background-color: #f377f5;
      color:white;
    }
    .pink-row {
      background-color: #F8ABA6;
      color:white;
    }
    .pink-row:hover {
      background-color: #fb8078;
      color:white;
    }
}
// .selected {
//     background: rgb(105, 200, 225) !important;
// }
.react-datepicker-popper {
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
}

.patient-name{
  width: "80px";
  line-height: 30px;
  margin-left: 10rem;
}
.patient-name-label{
  width: 10rem;
  border: 1px solid #aaa;
  margin-right: 3rem;
}
.button-group{
  float: right;
  button{
    margin-left: 10px;
  }
}
.user-css{
  width: 80px;
  line-height: 26px;
}
.user-content-css{
  width: 150px;
  border: 1px solid #aaa;
  line-height: 26px;
  margin-right: 20px;
}
.react-datepicker-wrapper{
  input{
    height: 30px;
  }
}
.checkbox-css{
  label{
    display: block;
  }
}
.condition-area{
  justify-content: space-between;
}
.condition-left{
  height: 50vh;
  overflow-y: auto;
  width: 30%;
}
.condition-middle{
  height: 50vh;
  overflow-y: auto;
  width: 30%;
}
.condition-right{
  height: 50vh;
  overflow-y: auto;
  width: 40%;
}
`;

class InchargeSheetModal extends Component {
  constructor(props) {
    super(props);

    let _searchCondition = JSON.parse(JSON.stringify(this.props.searchCondition));
    this.state = {
      course_date: new Date(_searchCondition.course_date),
      order_list:[],
      discharge_list:[],
      slipTypeArray: _searchCondition.slipTypeArray,
      search_type: _searchCondition.search_type,
      // 指示受け状況
      instruction_received_flag: _searchCondition.instruction_received_flag,
      flag_not_received: _searchCondition.flag_not_received,
      // 部門受付体制
      department_reception_column_flag: _searchCondition.department_reception_column_flag,
      outside_department_reception_flag: _searchCondition.outside_department_reception_flag,
      // 実施体制
      not_implemented_flag: _searchCondition.not_implemented_flag,
      implemented_flag: _searchCondition.implemented_flag,
      flag_not_to_be_implemented: _searchCondition.flag_not_to_be_implemented,
      // 入外区分
      foreign_flag: _searchCondition.foreign_flag,
      hospitalization_flag: _searchCondition.hospitalization_flag,
      // 削除オーダ
      delete_order_display_flag: _searchCondition.delete_order_display_flag,
      // 検索条件
      search_condition: null,
      confirm_message: "",
      alert_messages: "",
      all_check: false,
    }

  }

  async componentDidMount() {
    let all_check = this.handleAllCheck();
    this.setState({
      all_check: all_check
    });
  }  

  handleAllCheck = () => {
    let all_check_flag = true;
    this.state.slipTypeArray.map(item=>{
      if (item.enable == 1 && item.check == false) {
          all_check_flag = false;
      }
    });

    if (this.state.instruction_received_flag == false || 
      this.state.flag_not_received == false || 
      this.state.outside_department_reception_flag == false || 
      this.state.not_implemented_flag == false || 
      this.state.implemented_flag == false || 
      this.state.flag_not_to_be_implemented == false || 
      this.state.foreign_flag == false || 
      this.state.hospitalization_flag == false || 
      this.state.delete_order_display_flag == false || 
      this.state.department_reception_column_flag == false) {
      all_check_flag = false;
    }

    return all_check_flag;
  }

  getOrderData =async()=>{
    this.setState({list_data: []});
    let path = "/app/api/v2/nurse/get_all_order";
    let post_data = {
      search_date: formatDateLine(this.state.course_date)
    };
    await apiClient
        ._post(path, {
            params: post_data
        })
        .then((res) => {
            if(res.length > 0){
                this.setState({
                  order_list: res,
                });
            } else {
                this.setState({
                  order_list: [],
                });
            }
        })
        .catch(() => {
        });
}

  getDate = value => {
    this.setState({
      course_date: value,
    });
  }

  setSearchConditionType = (e) => {
    this.setState({search_type:parseInt(e.target.value)});
  };

  getOtherRadio = (number) => {
    let slipTypeArray = this.state.slipTypeArray;
    slipTypeArray.map(item => {
      if (item.id === number) {
        item.check = !item.check;
      }
    });

    this.setState({
      slipTypeArray
    });
  }

  getAllCheckRadio = (name) => {
    if (name == "all_check") {      
      let all_check = !this.state.all_check;
      this.setState({
        all_check: all_check
      },()=>{
        this.allCheckOperation(all_check);
      });      
    }
  }

  allCheckOperation = (_val) => {
    let slipTypeArray = this.state.slipTypeArray;
    slipTypeArray.map(item=>{
      if (item.enable == 1) {
          item.check = _val;
      }
    });

    this.setState({
      slipTypeArray: slipTypeArray,
      instruction_received_flag: _val,
      flag_not_received: _val,
      outside_department_reception_flag: _val,
      not_implemented_flag: _val,
      implemented_flag: _val,
      flag_not_to_be_implemented: _val,
      foreign_flag: _val,
      hospitalization_flag: _val,
      delete_order_display_flag: _val,
      department_reception_column_flag: _val,      
    });    
  }

  getRadio = (name) => {
    let _state = {};
    switch (name) {
      case "instruction_received_flag":
        _state.instruction_received_flag = !this.state.instruction_received_flag;
        break;
      case "flag_not_received":
        _state.flag_not_received = !this.state.flag_not_received;
        break;
      case "department_reception_column_flag":
        _state.department_reception_column_flag = !this.state.department_reception_column_flag;
        break;
      case "outside_department_reception_flag":
        _state.outside_department_reception_flag = !this.state.outside_department_reception_flag;
        break;
      case "not_implemented_flag":
        _state.not_implemented_flag = !this.state.not_implemented_flag;
        break;
      case "implemented_flag":
        _state.implemented_flag = !this.state.implemented_flag;
        break;
      case "flag_not_to_be_implemented":
        _state.flag_not_to_be_implemented = !this.state.flag_not_to_be_implemented;
        break;
      case "foreign_flag":
        _state.foreign_flag = !this.state.foreign_flag;
        break;
      case "hospitalization_flag":
        _state.hospitalization_flag = !this.state.hospitalization_flag;
        break;
      case "delete_order_display_flag":
        _state.delete_order_display_flag = !this.state.delete_order_display_flag;
        break;
      default:
        break;
    }

    this.setState(_state);
  };

  handleOk = () => {
    let postData = {};
    this.state.slipTypeArray.map(item=>{
      if (item.alias != "") {
        postData[item.alias] = item.check;
      }
    });

    let search_type = "suggest_at"; // 依頼日検索
    if(this.state.search_type == 1) search_type = "completed_at"; // 実施日検索
    if(this.state.search_type == 3) search_type = "emergency_instruction"; // 緊急指示検索
    postData.search_type_str = search_type;

    postData.search_date = formatDateLine(this.state.course_date);
    postData.slipTypeArray = this.state.slipTypeArray;
    postData.course_date = this.state.course_date;
    postData.search_type = this.state.search_type;
    postData.instruction_received_flag = this.state.instruction_received_flag;
    postData.flag_not_received = this.state.flag_not_received;
    postData.department_reception_column_flag = this.state.department_reception_column_flag;
    postData.outside_department_reception_flag = this.state.outside_department_reception_flag;
    postData.not_implemented_flag = this.state.not_implemented_flag;
    postData.implemented_flag = this.state.implemented_flag;
    postData.flag_not_to_be_implemented = this.state.flag_not_to_be_implemented;
    postData.foreign_flag = this.state.foreign_flag;
    postData.hospitalization_flag = this.state.hospitalization_flag;
    postData.delete_order_display_flag = this.state.delete_order_display_flag;

    this.props.handleOk(postData);
  }

  saveCondition = () => {
    this.setState({
      confirm_message: "検索条件を保存しますか？"
    });
  }

  handleSaveCondition = async () => {

    let postData = {};
    this.state.slipTypeArray.map(item=>{
      if (item.alias != "") {
        postData[item.alias] = item.check;
      }
    });

    postData.search_date = formatDateLine(this.state.course_date);
    postData.display_mode_class = this.state.search_type;
    postData.instruction_received_flag = this.state.instruction_received_flag;
    postData.flag_not_received = this.state.flag_not_received;
    postData.department_reception_column_flag = this.state.department_reception_column_flag;
    postData.outside_department_reception_flag = this.state.outside_department_reception_flag;
    postData.not_implemented_flag = this.state.not_implemented_flag;
    postData.implemented_flag = this.state.implemented_flag;
    postData.flag_not_to_be_implemented = this.state.flag_not_to_be_implemented;
    postData.foreign_flag = this.state.foreign_flag;
    postData.hospitalization_flag = this.state.hospitalization_flag;
    postData.delete_order_display_flag = this.state.delete_order_display_flag;

    let path = "/app/api/v2/nurse/save_condition";
    await apiClient
      ._post(path, {
        params: postData
      })
      .then(() => {
        // suucess
        this.setState({
          alert_messages: "検索条件を保存しました。"
        });

      })
      .catch((err) => {
        if (err.response.data) {
          // const { error_messages } = err.response.data;
          // error_msg = error_messages;
        }
        // return false;
      });
  }

  confirmCancel = () => {
    this.setState({
      confirm_message: "",
      alert_messages: ""
    });
  }

  confirmOk = () => {
    this.confirmCancel();
    this.handleSaveCondition();
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm incharge-search-condition first-view-modal"
        >
          <Modal.Header><Modal.Title>検索条件</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'flex'}>
                  <div>
                    <div className={'flex'}>
                      【表示モード】
                    </div>
                    <div className={'radio-area flex'}>
                      <Radiobox
                        label={'実施日検索'}
                        value={1}
                        getUsage={this.setSearchConditionType.bind(this)}
                        checked={this.state.search_type === 1}
                        disabled={true}
                        name={`search_type_condition`}
                      />
                      <Radiobox
                        label={'依頼日検索'}
                        value={2}
                        getUsage={this.setSearchConditionType.bind(this)}
                        checked={this.state.search_type === 2}
                        disabled={true}
                        name={`search_type_condition`}
                      />
                      <Radiobox
                        label={'緊急指示検索'}
                        value={3}
                        getUsage={this.setSearchConditionType.bind(this)}
                        checked={this.state.search_type === 3}
                        disabled={true}
                        name={`search_type_condition`}
                      />
                    </div>
                  </div>
                  <div>
                    <div className={'flex'}>
                      【対象日付】
                    </div>
                    <div className={'flex'}>
                      <DatePicker
                        locale="ja"
                        selected={this.state.course_date}
                        onChange={this.getDate.bind(this)}
                        dateFormat="yyyy/MM/dd"
                        placeholderText={"年/月/日"}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"                      
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    </div>
                  </div>
                </div>
                <div className={'flex'}>
                    <Checkbox
                      label={"一括 ON/OFF"}
                      getRadio={this.getAllCheckRadio.bind(this, )}
                      value={this.state.all_check}
                      name="all_check"                    
                    />
                </div>
                <div className={'flex condition-area'}>
                  <div className="condition-left">
                    <div>【伝票種別】</div>
                    <div className="checkbox-css">
                      {this.state.slipTypeArray.filter((ele, idx)=>{
                        if (idx < 13) {
                          return ele
                        }
                      }).map(item=>{
                        return(
                          <>
                            <Checkbox
                              label={item.name}
                              getRadio={this.getOtherRadio.bind(this, item.id)}
                              value={item.check}
                              name="check"
                              isDisabled={item.enable == 0}
                            />
                          </>
                        )
                      })}
                    </div>
                  </div>
                  <div className="condition-middle">
                    <div>【伝票種別】</div>
                    <div className="checkbox-css">
                      {this.state.slipTypeArray.filter((ele, idx)=>{
                        if (idx >= 13) {
                          return ele
                        }
                      }).map(item=>{
                        return(
                          <>
                            <Checkbox
                              label={item.name}
                              getRadio={this.getOtherRadio.bind(this, item.id)}
                              value={item.check}
                              name="check"
                              isDisabled={item.enable == 0}
                            />
                          </>
                        )
                      })}
                    </div>
                  </div>
                  <div className="condition-right checkbox-css">
                    <div>
                      【対象区分】
                    </div>
                    <div>指示受け状況</div>
                    <div>
                      <Checkbox
                        label="指示受け済"
                        getRadio={this.getRadio.bind(this)}
                        value={this.state.instruction_received_flag}
                        name="instruction_received_flag"
                      />
                      <Checkbox
                        label="指示受け未"
                        getRadio={this.getRadio.bind(this)}
                        value={this.state.flag_not_received}
                        name="flag_not_received"
                      />
                    </div>
                    <div>部門受付体制</div>
                    <div>
                      <Checkbox
                        label="部門受付済"
                        getRadio={this.getRadio.bind(this)}
                        value={this.state.department_reception_column_flag}
                        name="department_reception_column_flag"
                      />
                      <Checkbox
                        label="部門未受付"
                        getRadio={this.getRadio.bind(this)}
                        value={this.state.outside_department_reception_flag}
                        name="outside_department_reception_flag"
                      />
                    </div>
                    <div>実施体制</div>
                    <div>
                      <Checkbox
                        label="未実施"
                        getRadio={this.getRadio.bind(this)}
                        value={this.state.not_implemented_flag}
                        name="not_implemented_flag"
                      />
                      <Checkbox
                        label="実施済"
                        getRadio={this.getRadio.bind(this)}
                        value={this.state.implemented_flag}
                        name="implemented_flag"
                      />
                      {/*<Checkbox
                        label="実施対象外"
                        getRadio={this.getRadio.bind(this)}
                        value={this.state.flag_not_to_be_implemented}
                        name="flag_not_to_be_implemented"
                      />*/}
                    </div>
                    <div>入外区分</div>
                    <div>
                      <Checkbox
                        label="入院"
                        getRadio={this.getRadio.bind(this)}
                        value={this.state.hospitalization_flag}
                        name="hospitalization_flag"
                      />
                      <Checkbox
                        label="外来"
                        getRadio={this.getRadio.bind(this)}
                        value={this.state.foreign_flag}
                        name="foreign_flag"
                      />
                    </div>
                    <div>削除オーダー</div>
                    <div>
                      <Checkbox
                        label="表示"
                        getRadio={this.getRadio.bind(this)}
                        value={this.state.delete_order_display_flag}
                        name="delete_order_display_flag"
                      />
                    </div>
                  </div>
                </div>
                <div className={'flex'}>
                  <Button type="common" onClick={this.saveCondition}>{'検索条件保存'}</Button>                                    
                </div>
                {this.state.confirm_message !== "" && (
                  <SystemConfirmModal
                    hideConfirm= {this.confirmCancel.bind(this)}
                    confirmCancel= {this.confirmCancel.bind(this)}
                    confirmOk= {this.confirmOk.bind(this)}
                    confirmTitle= {this.state.confirm_message}
                  />
                )}
                {this.state.alert_messages !== "" && (
                  <SystemAlertModal
                    hideModal= {this.confirmCancel.bind(this)}
                    handleOk= {this.confirmCancel.bind(this)}
                    showMedicineContent= {this.state.alert_messages}
                  />
                )}
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className='cancel-btn' onClick={this.props.closeModal}>キャンセル</Button>
            <Button className='red-btn' onClick={this.handleOk}>確定</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

InchargeSheetModal.propTypes = {
    patientId: PropTypes.number,
    patientInfo: PropTypes.object,
    closeModal: PropTypes.func,
    handleOk: PropTypes.func,
    detailedPatientInfo : PropTypes.object,
    searchCondition : PropTypes.object,
};

export default InchargeSheetModal;
