import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Button from "~/components/atoms/Button";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import SelectExamItemModal from "./SelectExamItemModal";
import axios from "axios";
import {formatDateLine, formatTime, formatTimePicker} from "../../../helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import * as apiClient from "~/api/apiClient";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

registerLocale("ja", ja);

const Wrapper = styled.div`
  display: block;
  width: 70vw;
  .label-title {
    font-size: 1rem;
    width: 100px;
  }
  button, input{
    height:2rem;
    line-height:2rem;
    font-size:1rem;
    span{
      font-size:1rem;
    }
  }
  button{
    padding:0;
  }
  .select-box{    
      .pullbox-title{
        width: 5rem;
        text-align: right;
        margin-right:0.5rem; 
        height:2rem;
        line-height:2rem;
       }
       .pullbox-select{
         font-size:1rem;
          width:10rem;
          padding-right: 1rem;
          height:2rem;
          line-height:2rem;
      }
      .pullbox-label{
        font-size:1rem;
        margin-bottom:0;
        width:auto;
        height:2rem;
        line-height:2rem;
      }
  }
  .collect-date{
    label {
        width: 5rem;
        text-align: right;
        margin-right: 8px; 
        line-height: 2rem;
    }
    input {
        width: 7rem;
        padding:0 8px;
        line-height:1rem;
        border-radius: 4px;
        border: solid 1px lightgray;
    }
    .pullbox-label{
      padding:0;
    }
    .label-title{
      font-size:1rem;
      padding-top:0.15rem;
    }
    .react-datepicker__navigation{
      background:none;
    }
    .react-datepicker{
      button{
        height:0;
        margin-left:0;
        padding:0;
      }
    }
  }
  .notice{
    font-size:1rem;
    input {
        width: 25rem;
        height:2rem;
    }
    label{
        width: 7.5rem;
        text-align:right;
        height:2rem;
        font-size:1rem;
        margin-top:0.2rem
    }
  }
  .table-area {
    width: calc(100% - 2rem);
    margin: auto;
    margin-left:0;
    font-size: 0.875rem;
    font-family: "Noto Sans JP", sans-serif;
    table {
        margin-bottom:0;
        thead{
          display: table;
          width:calc(100% - 17px);
        }
        tbody{
          height: 20rem;  
          overflow-y:scroll;
          display:block;
          tr:nth-child(even) {background-color: #f2f2f2;}
          tr:hover{background-color:#e2e2e2 !important;}
        }
        tr{
          display: table;
          width: 100%;
          box-sizing: border-box;
          height: 2rem;
        }
        td {
            padding: 0.25rem;
            text-align: left;
            cursor: pointer;
            word-break: break-all;
            vertical-align:middle;
        }
        th {
            text-align: center;
            padding: 0.3rem;
            vertical-align:middle;
        }
        .td-comment{
            width: 25%;
        }
        .label-title {
            width: 0;
            margin-right: 0px;
        }
       
        .td-content{
            text-align: center;
            width: 120px;
            div{
              width:110px;
              margin-top:0;
            }
            input{
              width: 100%;
              height: 2rem;
              ime-mode:inactive;
            }
        }
     }
  }
  .btn-area{
    position: relative;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    text-align: center;
    float:right;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      margin-right: 30px;
    }
    span {
      color: white;
      font-size: 16px;
      font-weight: 100;
    }
  }
  .patient-area{
    padding-right: 0.5rem;
    padding-bottom:0.5rem;
    .label-title{
        font-size: 1rem;
        width: 4.5rem;
        margin-top: 0;
        margin-bottom: 0;
        line-height: 2rem;
        margin-left: 0.5rem;
        text-align: right;
        margin-right: 0.5rem;
    }
    input{
        width: 13rem;
        height: 2rem;
        background: lightgray;
    }
  }

`;

class RegisterSelfExamResultModal extends Component {
  constructor(props) {
    super(props);
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let table_list = [{item_name:"", item_value: "", comment1: "", comment2: "", item:null, boilerplate_1:'', boilerplate_2:''}];
    let modal_data = props.modal_data;
    let collected_date = new Date();
    let collected_time = new Date();
    let karte_status_code = 1;
    let display_department_id = 1;
    if (modal_data != undefined) {
        collected_date = modal_data.collected_date != undefined && modal_data.collected_date != null && modal_data.collected_date != '' ? new Date(modal_data.collected_date) : new Date();
        collected_time = modal_data.collected_time != undefined && modal_data.collected_time != null && modal_data.collected_time != '' ? formatTimePicker(modal_data.collected_time) : new Date();
        karte_status_code = modal_data.is_hospitalized == 1 ? 2 : 1;
        display_department_id = modal_data.department ? modal_data.department : 1;
        if (modal_data.results != undefined && modal_data.results.length > 0) {
            let result = [];
            modal_data.results.map(item=>{
                result.push({item_name:item.label, item_value: item.value, comment1: item.boilerplate_1, comment2: item.boilerplate_2, item:item, boilerplate_1:item.boilerplate_1_code, boilerplate_2:item.boilerplate_2_code})
            });
            result.push({item_name:"", item_value: "", comment1: "", comment2: "", item:null, boilerplate_1:'', boilerplate_2:''});
            table_list = result;
        }
    }
    this.state = {
        table_list,
        isOpenItemModal:false,
        isOpenCommentModal:false,
        patient_id: props.patient.patient_number,
        birthday: props.patient.birthday,
        age: props.patient.age,
        patient_name: props.patient.patient_name,
        patient_name_kana: props.patient.patient_name_kana,
        collected_date,
        collected_time,
        karte_status_code,
        notice: "",
        gender: props.patient !== undefined ?(props.patient.gender === 1 ? "男": props.patient.gender === 2 ? "女" : ""): "",
        display_department_id,
        ward_master:[{id:0, value:""}],
        first_ward_id: '',
        alert_messages: '',
        confirm_message: ''
    };
    this.karte_status=[{ id: 1, value: "外来"},{ id: 2, value: "入院"}];
    this.insert_data = {item_name:"", item_value: "", comment1: "", comment2: "", item:null, boilerplate_1:'', boilerplate_2:''};
  }

    async UNSAFE_componentWillMount(){
      await this.getMaster();
        let exam_item = await axios.post("/app/api/v2/master/examination/find");
        let result_comment = await axios.post("/app/api/v2/master/common_data/find_comment");
        if (exam_item != null)
            exam_item = exam_item.data;
        if (result_comment != null) {
            result_comment = result_comment.data;
        }
        exam_item.map(item=>{

            item.name=item.name.trim();
        });
        result_comment.map(item=>{
            item.name=item.name.trim();
        });
        this.setState({exam_item,result_comment});
    }

  register = () =>{
      this.props.handleOk(this.state.save_name);
  };
  getMaster = async()=> {
    let path = "/app/api/v2/ward/get/bed_control/master_data";
    await apiClient.post(path, {params: {}})
    .then(res => {
      let ward_master = this.state.ward_master;
      if(res.ward_master.length > 0){
        res.ward_master.map(ward=>{
          ward_master.push({id:ward.number, value:ward.name});
        });
      }        
      this.setState({ward_master,})
    })
  }

  setValue = (e) =>{
      this.setState({save_name:e.target.value});
  };

    getValue = (key, value) => {
        this.setState({[key]: value});
    };

    // 表示対象科
    getDepartment = e => {
        this.setState({
            display_department_id:e.target.id,
            department_name: e.target.value
        })
    };

    getKarteStatus = e => {
        this.setState({
            karte_status_code:e.target.id,
            karte_status_name: e.target.value
        });
    };

    openCommentModal = (index,key) => {
        this.setState({
            isOpenCommentModal: true,
            selected_comment_key:key,
            selected_comment_index:index
        })
    };

    openItemModal = (index) => {
        this.setState({
            isOpenItemModal: true,
            selected_item_index:index
        })
    };
    setWard=(e)=>{
        this.setState({first_ward_id:e.target.id});
    };
    confirmSave = async () => {
      this.confirmCancel();
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        let post_data = {
            data:this.state.table_list,
            is_temporary: this.state.is_temporary,
            patient: this.props.patient,
            collected_date: formatDateLine(this.state.collected_date),
            collected_time: this.state.collected_time ? formatTime(this.state.collected_time):"",
            department: this.state.display_department_id,
            department_name: this.state.department_name,
            hospitalized_flag:this.state.karte_status_code,
            order_comment:this.state.notice,
            doctor_code:authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
            doctor:authInfo.staff_category == 1 ? authInfo.name : this.context.selectedDoctor.name,
        };
        if (this.props.modal_data != undefined && this.props.modal_data.examination_recode_number > 0) {
          post_data.number = this.props.modal_data.examination_recode_number;
        }
        await axios.post("/app/api/v2/karte/examination/save",{params:post_data}).then((res)=>{
            window.sessionStorage.setItem('alert_messages', res.data.alert_messages);
            this.props.handleOk();
        });
    }

    saveData = async (is_temporary ) => {
      let {table_list} = this.state;
      if (table_list.length == 1 && table_list[0].item_name == '')  {
        this.setState({alert_messages: '検査項目を入力してください。'});
        return;
      }
      if (table_list.length == 1 && table_list[0].item_name != '' && table_list[0].item_value ==''){
        this.setState({alert_messages: table_list[0].item_name + 'の検査結果を入力してください。'});
        return;
      }

      var alert_mes = '';
      if (table_list.length > 1){
        table_list.map((item, index) => {
            if (index < table_list.length-1){
              if (item.item_name == '') alert_mes += '検査項目を入力してください。' + '\n';
              if (item.item_name != '' && item.item_value == '') alert_mes += item.item_name + 'の結果を入力してください。' + '\n';
            }
        })
        if (alert_mes != ''){
          this.setState({alert_messages: alert_mes});
          return;
        }
      } 
      this.setState({
        is_temporary,
        confirm_message:is_temporary?'検査結果を一時保存しますか？':'検査結果を保存しますか？',
        confirm_action: 'save'
      })  
    };


    closeModal = () => {
        this.setState({
            isOpenItemModal: false,
            isOpenCommentModal: false,
        })
    };

    selectItem = (item) => {
        this.closeModal();
        let {table_list} = this.state;
        let insert_data = {...this.insert_data};
        if(this.state.selected_item_index !== undefined) {
            table_list[this.state.selected_item_index].item_name = item.name;
            table_list[this.state.selected_item_index].item = item;
        }
        if (table_list[table_list.length-1].item_name !== "") {
            table_list.push(insert_data);
        }
        this.setState({table_list})
    };
    selectComment = (item) =>{
        this.closeModal();
        let {table_list} = this.state;
        if(this.state.selected_comment_index !== undefined && this.state.selected_comment_key !== undefined){
            table_list[this.state.selected_comment_index][this.state.selected_comment_key] = item.name;
            if (this.state.selected_comment_key == 'comment1') table_list[this.state.selected_comment_index]['boilerplate_1'] = item.code;
            else if (this.state.selected_comment_key == 'comment2') table_list[this.state.selected_comment_index]['boilerplate_2'] = item.code;
        }
        this.setState({table_list});
    };

    setValue = (index,e) => {
        let {table_list} = this.state;
        table_list[index].item_value = e.target.value;
        this.setState({table_list});
    };

    setNotice = (e) => {
        this.setState({notice:e.target.value});
    }

    clearTime = () => {
      if (this.state.collected_time == undefined || this.state.collected_time == null || this.state.collected_time == '') return;
      this.setState({
        confirm_message: "時刻をクリアしますか？",
        confirm_action: 'clear_time'
      });
    }

    closeSystemAlertModal () {
        this.setState({alert_messages: '',});
    }
    confirmOk = () => {
      this.confirmCancel();
      if (this.state.confirm_action == 'clear_time') {
        this.setState({collected_time: ''});
      } else if (this.state.confirm_action == 'save') {
        this.confirmSave();
      }
    }
    confirmCancel = () =>{
      this.setState({
        confirm_action: '',
        confirm_message: ''
      });
    }


  render() {  
    let {table_list,exam_item,result_comment}=this.state;
    return  (
      <Modal show={true} className="custom-modal-sm auto-width-modal guidance-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>自科検査結果入力</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox>
            <Wrapper>
                <div className="w-100">
                    <div className="patient-area">
                        <div className="d-flex">
                            <div className="birthday remove-x-input">
                                <InputWithLabel
                                    type="text"
                                    label="患者ID"
                                    diseaseEditData={this.state.patient_id}
                                    readonly
                                    isDisabled = {true}
                                />
                            </div>
                            <div className="age remove-x-input">
                                <InputWithLabel
                                    label="性別"
                                    type="text"
                                    diseaseEditData={this.state.gender}
                                    readonly
                                    isDisabled = {true}
                                />
                            </div>
                        </div>
                        <div className="d-flex remove-x-input">
                            <InputWithLabel
                                label="カナ氏名"
                                type="text"
                                diseaseEditData={this.state.patient_name_kana}
                                readonly
                                    isDisabled = {true}
                            />
                            <div className="birthday remove-x-input">
                                <InputWithLabel
                                    label="生年月日"
                                    type="text"
                                    diseaseEditData={this.state.birthday}
                                    readonly
                                    isDisabled = {true}
                                />
                            </div>
                        </div>
                        <div className="d-flex remove-x-input">
                            <InputWithLabel
                                label="患者氏名"
                                type="text"
                                diseaseEditData={this.state.patient_name}
                                readonly
                                    isDisabled = {true}
                            />
                            <div className="age">
                                <InputWithLabel
                                    label="年齢"
                                    type="text"
                                    diseaseEditData={this.state.age}
                                    readonly
                                    isDisabled = {true}
                                />
                            </div>
                        </div>
                    </div>
                <div className={`mt-2`}>
                    <div className="d-flex w-100">
                        <div className="d-flex collect-date">
                            <label>採取日時</label>
                            <DatePicker
                                locale="ja"
                                selected={this.state.collected_date}
                                onChange={this.getValue.bind(this, "collected_date")}
                                dateFormat="yyyy/MM/dd"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dayClassName = {date => setDateColorClassName(date)}
                            />
                            <label>時刻</label>
                            <DatePicker
                                selected={this.state.collected_time}
                                onChange={this.getValue.bind(this,"collected_time")}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={10}
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                timeCaption ='時刻'
                            />
                            <Button type="common" className={`ml-2 mr-2 pl-2 pr-2`} onClick={this.clearTime}>時刻なし</Button>
                            <div className="select-box">
                                <SelectorWithLabel
                                    title="診療科"
                                    options={this.departmentOptions}
                                    getSelect={this.getDepartment}
                                    value={this.state.department_name}
                                    departmentEditCode={this.state.display_department_id}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex mt-2">
                        <div className="select-box">
                            <SelectorWithLabel
                                title="入外区分"
                                options={this.karte_status}
                                getSelect={this.getKarteStatus}
                                value={this.state.karte_status_name}
                                departmentEditCode={this.state.karte_status_code}
                            />
                        </div>
                        <div className="d-flex select-box">
                            <SelectorWithLabel
                                title="病棟"
                                options={this.state.ward_master}
                                getSelect={this.setWard}
                                departmentEditCode={this.state.first_ward_id}
                            />
                        </div>
                    </div>
                    <div className="notice">
                        <InputWithLabel
                            label="フリーコメント"
                            type="text"
                            getInputText={this.setNotice.bind(this)}
                            diseaseEditData={this.state.notice}
                        />
                    </div>
                </div>

                </div>
                <div className='btn-area d-flex'>
                    
                </div>
                <div className={'table-area'}>
                    <table className="table-scroll table table-bordered" id="code-table">
                        <thead>
                        <tr>
                            <th className={'td-title'}>項目名</th>
                            <th className={'td-content'}>結果</th>
                            <th className={'td-comment'}>コメント1</th>
                            <th className={'td-comment'}>コメント2</th>
                        </tr>
                        </thead>
                        <tbody>
                        {table_list != null && table_list.length > 0 && table_list.map((item,index)=>{
                            return(
                            <tr key={index}>
                                <td className={'td-title'} onClick={this.openItemModal.bind(this,index)}>{item.item_name}</td>
                                <td className={'td-content'}>
                                    <InputWithLabel
                                        label=""
                                        type="text"
                                        diseaseEditData={item.item_value}
                                        getInputText={this.setValue.bind(this,index)}
                                    />
                                </td>
                                <td className={'td-comment'} onClick={this.openCommentModal.bind(this,index,"comment1")}>{item.comment1}</td>
                                <td className={'td-comment'} onClick={this.openCommentModal.bind(this,index,"comment2")}>{item.comment2}</td>
                            </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
            <Button className='cancel-btn' onClick={this.props.closeModal}>キャンセル</Button>
            <Button className='red-btn' onClick={this.saveData.bind(this, 1)}>一時保存</Button>
            <Button className='red-btn' onClick={this.saveData.bind(this, 0)}>保存</Button>            
        </Modal.Footer>
          {this.state.isOpenItemModal && (
              <SelectExamItemModal
                  selectMaster = {this.selectItem}
                  closeModal = {this.closeModal}
                  MasterCodeData = {exam_item}
                  MasterName = '検査項目'
                  self_exam={true}
              />
          )}
          {this.state.isOpenCommentModal && (
              <SelectExamItemModal
                  selectMaster = {this.selectComment}
                  closeModal = {this.closeModal}
                  MasterCodeData = {result_comment}
                  MasterName = '結果コメント'
              />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.alert_messages !== "" && (
              <SystemAlertModal
                  hideModal= {this.closeSystemAlertModal.bind(this)}
                  handleOk= {this.closeSystemAlertModal.bind(this)}
                  showMedicineContent= {this.state.alert_messages}
              />
          )}
      </Modal>
    );
  }
}

RegisterSelfExamResultModal.contextType = Context;

RegisterSelfExamResultModal.propTypes = {
  closeModal: PropTypes.func,
    patient:PropTypes.object,
    handleOk: PropTypes.func,
    modal_data:PropTypes.object,
};

export default RegisterSelfExamResultModal;