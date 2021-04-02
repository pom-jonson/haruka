import React, { Component } from "react";
import { Modal, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
// import InputBoxTag from "~/components/molecules/InputBoxTag";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import RadioButton from "~/components/molecules/RadioInlineButton";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import DatePicker, { registerLocale } from "react-datepicker";
import { formatJapanDate, formatDateLine } from "~/helpers/date";
// import { Col } from "react-bootstrap";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import * as sessApi from "~/helpers/cacheSession-utils";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import // faSearch,
// faPlusSquare
"@fortawesome/pro-solid-svg-icons";
import { makeList_codeName, setDateColorClassName } from "~/helpers/dialConstants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

// const Icon = styled(FontAwesomeIcon)`
//   color: blue;
//   font-size: 15px;
//   margin-right: 5px;
// `;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 100%;
  float: left;
  .flex {
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .left {
    float: left;
  }
  .right {
    float: right;
  }
  label {
    text-align: right;
    width: 100px;
  }
  .label {
    padding-top: 8px;
    width: 60px;
  }
  input {
    width: 200px;
    font-size: 12px;
  }
  .modal_header {
    font-size: 16px;
    span {
      margin-left: 20px;
      padding-top: 10px;
    }
  }
  .patient_id,
  .patient_name {
    font-size: 20px;
  }
  .schedule_date {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 20px;
    span {
      font-size: 14px;
    }
  }

  .sp-date {
    margin-right: 15px;
    font-size: 20px !important;
  }
  .input_area {
    .label-title {
      display: none;
    }
    .count {
      padding-top: 15px;
      padding-left: 5px;
    }
  }
  .checkbox_area {
    padding-left: 15px;
    margin-top: 0px;
    position: absolute;
    right: 7px;
    .checkbox-label {
      text-align: left;
    }
  }
  .search {
    position: absolute;
    right: 19px;
    cursor: pointer;
  }
  .main_part {
    width: 100%;
    height: 400px;
    overflow-y: scroll;
    border: 1px solid lightgray;
    label {
      width: 100%;
      text-align: left;
      padding-left: 10px;
      margin-right: 0px;
    }
    .radio-group-btn label {
      border-radius: 0;
      margin-right: 3px;
      width: 32%;
      text-align: left;
      padding-left: 5px;
    }
  }
  .all-check-manage {
    label {
      width: 100%;
      text-align: left;
      padding-left: 10px;
      margin-right: 0px;
    }
  }
  .bottom_part {
    border: 1px solid lightgray;
    padding-left: 15px;
  }
  .react-datepicker-wrapper {
    width: fit-content;
    border: 1px solid;
    margin-left: 20px;
    margin-right: 20px;
    padding: 5px;
    .react-datepicker__input-container {
      width: 100%;
      margin-top: 3px;
      div {
        font-size: 20px;
      }
      input {
        width: 100%;
        height: 35px;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 8px;
      }
    }
  }
  .modal_container {
    .pullbox {
      margin-top: 10px;
    }
    .pullbox-title {
      width: 60px;
      text-align: right;
      padding-right: 10px;
    }
    .pullbox-label,
    .pullbox-select {
      width: 130px;
    }
  }
  .schedule_time {
    button {
      padding: 0px;
      min-width: 70px;
      height: 38px;
      background: lightblue;
    }
    .label {
      font-size: 16px;
      padding-top: 4px;
    }
  }
  .radio-btn label {
    width: 45px;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    margin: 0 5px;
    padding: 4px 5px;
    font-size: 13px;
  }
  .radio-group-btn label {
    font-size: 14px;
  }

  .footer {
    margin-top: 10px;
    text-align: center;
    padding-top: 20px;
    clear: both;
    label {
      width: 100px;
    }
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
      padding-left: 50px;
      padding-right: 50px;
    }
    .add-button {
      text-align: center;
    }
    span {
      color: white;
      font-size: 15px;
      font-weight: 100;
      letter-spacing: 5px;
    }
  }
`;

const gender_list = [
  { id: 1, value: "男性" },
  { id: 2, value: "女性" },
  { id: 3, value: "全て" },
];

class EditManageMultiMoveModal extends Component {
  constructor(props) {
    super(props);
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    var groups = makeList_codeName(code_master["グループ"], 1);
    this.state = {
      schedule_item: this.props.schedule_item,
      schedule_date: new Date(),
      all_check_flag: 0,
      all_manage_check_flag: 0,
      selected_patients_list: [],
      patients_list: this.props.patients_same_day,
      time_zone_list: getTimeZoneList(),
      groups,
      gender_list,
      gender: 3,

      selected_items: [],
      selected_items_temp: [],
      fee_check_array: {},

      isUpdateConfirmModal:false,
      isCloseConfirmModal:false,
      confirm_message:'',
      confirm_alert_title:''
    };
  }

  extractPatients = (time_zone, group, gender = 3) => {
    var temp = this.props.patients_same_day;

    var new_list = {};
    Object.keys(temp).map((patient_id) => {
      var patient = temp[patient_id];
      var search_flag = true;
      if (time_zone > 0 && patient.time_zone != time_zone) search_flag = false;

      if (group > 0 && patient.group != group) search_flag = false;

      if (gender != 3 && patient.gender != gender) search_flag = false;

      if (search_flag) new_list[patient_id] = patient;
    });
    this.setState({ patients_list: new_list });
  };
  

  getDate = (value) => {
    this.setState({
      schedule_date: value,
    });
    this.change_flag = true;
  };
  multiMove = async () => {
    if (this.state.selected_patients_list.length < 1) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }

    var fee_check_array = this.state.fee_check_array;
    var move_fee_list = [];
    Object.keys(fee_check_array).map((key) => {
      if (fee_check_array[key] == true) move_fee_list.push(key);
    });
    if (move_fee_list.length == 0) {
      window.sessionStorage.setItem(
        "alert_messages",
        "管理料項目を選択してください。"
      );
      return;
    }

    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:'変更しますか？'
    })
  };

  confirmMove = async () => {
    this.confirmCancel();
    let newDate = this.state.schedule_date;
    let req = [];
    Object.keys(this.state.patients_list)
      .filter((item) => {
        if (this.state.selected_patients_list.indexOf(parseInt(item)) >= 0) {
          return true;
        }
      })
      .map((patient_id) => {
        let arr = {
          patient_id: parseInt(patient_id),
          schedule_date: this.state.patients_list[patient_id].schedule_date,
        };
        req.push(arr);
      });
    var fee_check_array = this.state.fee_check_array;
    var move_fee_list = [];
    Object.keys(fee_check_array).map((key) => {
      if (fee_check_array[key] == true) move_fee_list.push(key);
    });
    let path = "/app/api/v2/dial/schedule/dial_management_move_multi_update";
    const post_data = {
      params: {
        schedule_items: req,
        new_date: formatDateLine(newDate),
        move_fees: move_fee_list,
      },
    };
    await apiClient.post(path, post_data).then((res) => {
      var title = '';
      var message = res.alert_message;
      if (message.indexOf('変更') > -1) title = "変更完了##";
      if (message.indexOf('登録') > -1) title = "登録完了##";
      window.sessionStorage.setItem("alert_messages", title + res.alert_message);
      this.props.handleOk(newDate);
    });
  }

  confirmCancel = () => {
    this.setState({
      isUpdateConfirmModal:false,
      isCloseConfirmModal:false,
      confirm_message:'',
      confirm_alert_title:'',
    })
  }

  selectTimezone = (e) => {
    this.setState({ time_zone: parseInt(e.target.value) }, () => {
      this.extractPatients(
        this.state.time_zone,
        this.state.selected_group,
        this.state.gender
      );
    });
  };
  selectGender = (e) => {
    this.setState({ gender: parseInt(e.target.value) }, () => {
      this.extractPatients(
        this.state.time_zone,
        this.state.selected_group,
        this.state.gender
      );
    });
  };

  getGroup = (e) => {
    this.setState({ selected_group: e.target.id }, () => {
      this.extractPatients(
        this.state.time_zone,
        this.state.selected_group,
        this.state.gender
      );
    });
  };

  selectAllTimes = () => {
    this.setState(
      {
        time_zone: 0,
        selected_group: 0,
        gender: 3,
      },
      () => {
        this.extractPatients(
          this.state.time_zone,
          this.state.selected_group,
          this.state.gender
        );
      }
    );
  };

  getCheckAll = (name, value) => {
    var temp = [];
    var selected_items = this.state.selected_items;
    var selected_items_temp = [];
    var fee_check_array = this.state.fee_check_array;
    var check_exist_fee_item;    
    if (name == "select_all") {      
      if (value === 1) {
        Object.keys(this.state.patients_list).map((patient_id) => {
          temp.push(parseInt(this.state.patients_list[patient_id].system_patient_id));
          selected_items_temp.push(this.props.patients_same_day_array[patient_id]);          
          this.props.patients_same_day_array[patient_id].map(sub_item => {
            check_exist_fee_item = selected_items.filter((x) => x.number == sub_item.number);
            if (check_exist_fee_item.length == 0) {
              selected_items.push(sub_item);
              fee_check_array[sub_item.number] = false;
            }
          })
        });

        this.setState({ 
          selected_patients_list: temp,
          selected_items_temp,
          selected_items,
          all_check_flag:1
        });
      } else {
        this.setState({
          selected_patients_list: [],
          selected_items:[],
          selected_items_temp:[],
          fee_check_array:{},
          all_check_flag: 0,
        });
      }
    }

    if (name == "select_all_manage") {      
      if (value == true) {
        Object.keys(fee_check_array).map((key) => {
          fee_check_array[key] = true;
        });
      } else {
        Object.keys(fee_check_array).map((key) => {
          fee_check_array[key] = false;
        });
      }
      this.setState({ all_manage_check_flag: value, fee_check_array });
    }
    this.change_flag = true;
  };

  selectPatient = (e, system_patient_id) => {
    var patients_same_day_array = this.props.patients_same_day_array;
    var temp = [...this.state.selected_patients_list];
    var selected_items = this.state.selected_items;
    var selected_items_temp = this.state.selected_items_temp;
    var fee_check_array = this.state.fee_check_array;
    var check_exist_fee_item;
    if (temp.indexOf(parseInt(e.target.value)) < 0) {
      temp.push(parseInt(e.target.value));
      selected_items_temp.push(patients_same_day_array[system_patient_id]);
      patients_same_day_array[system_patient_id].map((sub_item) => {
        check_exist_fee_item = selected_items.filter(
          (x) => x.number == sub_item.number
        );
        if (check_exist_fee_item.length == 0) {
          selected_items.push(sub_item);
          fee_check_array[sub_item.number] = false;
        }
      });
    } else {
      var index = temp.indexOf(parseInt(e.target.value));
      if (index !== -1) {
        temp.splice(index, 1);
        selected_items_temp.splice(index, 1);
        patients_same_day_array[system_patient_id].map((sub_item) => {
          check_exist_fee_item = false;
          Object.keys(selected_items_temp).map((key) => {
            selected_items_temp[key].map((val) => {
              if (val.number == sub_item.number) check_exist_fee_item = true;
            });
          });

          if (check_exist_fee_item == false) {
            delete fee_check_array[sub_item.number];
            selected_items = selected_items.filter(
              (x) => x.number != sub_item.number
            );
          }
        });
      }
    }
    if (temp.length == Object.keys(this.state.patients_list).length) {
      this.setState({ all_check_flag: 1 });
    } else {
      this.setState({ all_check_flag: 0 });
    }
    this.setState({
      selected_patients_list: temp,
      selected_items,
      selected_items_temp,
      fee_check_array,
    });
    this.change_flag = true;
  };

  selectFeeMaster = (number, name, value) => {
    if (name == "fee_items") {
      var fee_check_array = this.state.fee_check_array;
      fee_check_array[number] = value;
      var all_manage_check_flag = true;
      Object.keys(fee_check_array).map((key) => {
        if (fee_check_array[key] == false) all_manage_check_flag = false;
      });
      this.setState({
        fee_check_array,
        all_manage_check_flag,
      });
    }
    this.change_flag = true;
  };

  close = () => {
    if (this.change_flag){
      this.setState({
        isCloseConfirmModal:true,
        confirm_message:"まだ登録していない内容があります。\n変更を破棄して移動しますか？",
        confirm_alert_title:'入力中',
      })
    } else {
      this.closeThisModal();
    }
  }

  closeThisModal = () => {
    this.confirmCancel();
    this.props.closeModal();
    this.change_flag = false;
  }

  onHide = () => {};

  render() {
    let { patients_list, selected_items } = this.state;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className="cur-date morning example-custom-input" onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );

    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal prescription-multiSet-modal managemoney-multiset-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>管理料の一括移動</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              <div className="schedule_date">
                <span className="sp-date">
                  {formatJapanDate(this.props.schedule_item.schedule_date)}
                </span>
                <span>の管理料予定を</span>
                <DatePicker
                  locale="ja"
                  selected={this.state.schedule_date}
                  onChange={this.getDate.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dayClassName = {date => setDateColorClassName(date)}
                  customInput={<ExampleCustomInput />}
                />
                へ移動する
              </div>
              <Col md="4" className="left">
                <div className="schedule_date">
                  <div className="top_part flex">
                    <div className="">対象管理料一覧</div>
                    {/* <div className='search'><Icon icon={faPlusSquare} />管理料を追加</div> */}
                  </div>
                  <div className="main_part">
                    {selected_items != undefined &&
                      selected_items != null &&
                      selected_items.length > 0 &&
                      selected_items.map((item) => {
                        return (
                          <>
                            <Checkbox
                              label={item.name}
                              getRadio={this.selectFeeMaster.bind(
                                this,
                                item.number
                              )}
                              value={this.state.fee_check_array[item.number]}
                              name="fee_items"
                            />
                          </>
                        );
                      })}
                  </div>
                  <div className="all-check-manage">
                    <Checkbox
                      label="すべての管理料・指導料を移動"
                      getRadio={this.getCheckAll.bind(this)}
                      value={this.state.all_manage_check_flag}
                      name="select_all_manage"
                    />
                  </div>
                </div>
              </Col>
              <Col md="8" className="right">
                <div className="modal_container">
                  <div className="top_part flex">
                    <div className="">対象患者一覧</div>
                    <div className="checkbox_area">
                      <Checkbox
                        label="全患者選択"
                        getRadio={this.getCheckAll.bind(this)}
                        value={this.state.all_check_flag}
                        name="select_all"
                      />
                      {/* <label className="checkbox-label">全患者選択</label> */}
                    </div>
                    {/* <div className='search'><Icon icon={faSearch} />検索</div> */}
                  </div>
                  <div className="main_part">
                    {Object.keys(patients_list).map((patient_id) => {
                      return (
                        <>
                          <RadioGroupButton
                            id={patient_id}
                            value={patient_id}
                            label={
                              patients_list[patient_id].patient_number +
                              " : " +
                              patients_list[patient_id].patient_name
                            }
                            name="patient_name"
                            getUsage={(e) => this.selectPatient(e, patient_id)}
                            checked={
                              this.state.selected_patients_list.indexOf(
                                parseInt(patient_id)
                              ) >= 0
                                ? true
                                : false
                            }
                            // checked={this.state.all_check_flag === 1 ? true : this.state.selected_patients_list.indexOf(parseInt(patient_id)) >=0 ? true : false}
                          />
                        </>
                      );
                    })}
                  </div>
                  <div className="bottom_part flex">
                    <SelectorWithLabel
                      options={this.state.groups}
                      title="グループ"
                      getSelect={this.getGroup.bind(this)}
                      departmentEditCode={this.state.selected_group}
                    />
                    <div className="flex schedule_time">
                      <label className="label">時間帯</label>
                      {this.state.time_zone_list != undefined &&
                        this.state.time_zone_list.length > 0 &&
                        this.state.time_zone_list.map((item) => {
                          return (
                            <>
                              <RadioButton
                                id={`timezone_${item.id}`}
                                value={item.id}
                                label={item.value}
                                name="usage"
                                getUsage={this.selectTimezone}
                                checked={
                                  this.state.timezone === item.id ? true : false
                                }
                              />
                            </>
                          );
                        })}
                      <label className="label">性別</label>
                      {this.state.gender_list != undefined &&
                        this.state.gender_list.length > 0 &&
                        this.state.gender_list.map((item) => {
                          return (
                            <>
                              <RadioButton
                                id={`male_${item.id}`}
                                value={item.id}
                                label={item.value}
                                name="gender"
                                getUsage={this.selectGender}
                                checked={
                                  this.state.gender === item.id ? true : false
                                }
                              />
                            </>
                          );
                        })}
                      <Button type="mono" onClick={this.selectAllTimes}>
                        すべて
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.close}>キャンセル</Button>
            <Button className="red-btn" onClick={this.multiMove.bind(this)}>一括移動</Button>
        </Modal.Footer>

        {this.state.isUpdateConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmMove.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}

        {this.state.isCloseConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.closeThisModal.bind(this)}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
      </Modal>
    );
  }
}

EditManageMultiMoveModal.contextType = Context;

EditManageMultiMoveModal.propTypes = {
  closeModal: PropTypes.func,
  schedule_item: PropTypes.array,
  patients_same_day: PropTypes.array,
  handleOk: PropTypes.func,
  patients_same_day_array: PropTypes.array,
};

export default EditManageMultiMoveModal;
