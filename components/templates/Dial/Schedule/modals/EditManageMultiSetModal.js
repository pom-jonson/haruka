import React, { Component } from "react";
import { Modal, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import RadioButton from "~/components/molecules/RadioInlineButton";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import { registerLocale } from "react-datepicker";
import { formatJapanDate, formatDateLine } from "~/helpers/date";
import * as methods from "../../DialMethods";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/pro-solid-svg-icons";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import { makeList_codeName } from "~/helpers/dialConstants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;

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

  .sp-date {
    margin-right: 15px;
    font-size: 20px !important;
  }

  span {
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
    padding-left: 1rem;
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
    }
    .selected {
      background: lightblue;
    }
    .row {
      cursor: pointer;
    }
    .radio-group-btn label {
      border-radius: 0;
      margin-right: 3px;
      width: 32%;
      text-align: left;
      padding-left: 5px;
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
      input {
        font-size: 14px;
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
`;

const gender_list = [
  { id: 1, value: "男性" },
  { id: 2, value: "女性" },
  { id: 3, value: "全て" },
];

class EditManageMultiSetModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    var groups = makeList_codeName(code_master["グループ"], 1);
    this.state = {
      selected_date: this.props.selected_date != undefined && this.props.selected_date != null ? this.props.selected_date:new Date(),
      schedule_date: new Date(),
      all_check_flag: 0,
      selected_patients_list: [],
      patients_list: this.props.patients_same_day,
      selected_fee: 0,
      time_zone_list: getTimeZoneList(),
      fee_management: [],
      gender_list,
      gender: 3,
      groups,

      fee_check_array: {},

      isUpdateConfirmModal:false,
      isCloseConfirmModal:false,
      confirm_message:'',
      confirm_alert_title:''
    };

    this.change_flag = false;
  }

  async componentDidMount() {
    this.getFeeMasterCode();
  }

  getCheckAll = (name, value) => {
    var temp = [];
    if (name == "select_all") {
      this.setState({ all_check_flag: value });
    }
    if (value === 1) {
      Object.keys(this.state.patients_list).map((patient_id) => {
        temp.push(
          parseInt(this.state.patients_list[patient_id].system_patient_id)
        );
      });
      this.setState({ selected_patients_list: temp });
    } else {
      this.setState({
        selected_patients_list: [],
        all_check_flag: 0,
      });
    }
    this.change_flag = true;
  };

  getDate = (value) => {
    this.setState({
      schedule_date: value,
    });
    this.change_flag = true;
  };

  multiSet = async () => {
    if (this.state.selected_patients_list.length < 1) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    var fee_check_array = this.state.fee_check_array;
    var new_fee_list = [];
    Object.keys(fee_check_array).map((key) => {
      if (fee_check_array[key] == true) new_fee_list.push(key);
    });

    if (new_fee_list.length == 0) {
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

  confirmSet = async() => {
    this.confirmCancel();
    let patient_ids = [];
    Object.keys(this.state.patients_list)
      .filter((item) => {
        if (this.state.selected_patients_list.indexOf(parseInt(item)) >= 0) {
          return true;
        }
      })
      .map((patient_id) => {
        patient_ids.push(patient_id);
      });
    
    var fee_check_array = this.state.fee_check_array;
    var new_fee_list = [];
    Object.keys(fee_check_array).map((key) => {
      if (fee_check_array[key] == true) new_fee_list.push(key);
    });

    let path = "/app/api/v2/dial/schedule/dial_management_multi_set";
    const post_data = {
      params: {
        patient_ids: patient_ids,
        new_fee: new_fee_list,
        date: formatDateLine(this.state.selected_date),
      },
    };
    await apiClient.post(path, post_data).then((res) => {
      var title = '';
      var message = res.alert_message;
      if (message.indexOf('変更') > -1) title = "変更完了##";
      if (message.indexOf('登録') > -1) title = "登録完了##";
      window.sessionStorage.setItem("alert_messages", title + res.alert_message);
      this.props.handleOk(this.state.selected_date);
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

  selectPatient = (e) => {
    var temp = [...this.state.selected_patients_list];
    if (temp.indexOf(parseInt(e.target.value)) < 0) {
      temp.push(parseInt(e.target.value));
    } else {
      var index = temp.indexOf(parseInt(e.target.value));
      if (index !== -1) {
        temp.splice(index, 1);
      }
    }
    if (temp.length == Object.keys(this.state.patients_list).length) {
      this.setState({ all_check_flag: 1 });
    } else {
      this.setState({ all_check_flag: 0 });
    }
    this.setState({ selected_patients_list: temp });
    this.change_flag = true;
  };

  selectFeeMaster = (number, name, value) => {
    if (name == "fee_items") {
      var fee_check_array = this.state.fee_check_array;
      fee_check_array[number] = value;
      this.setState({
        fee_check_array,
      });
    }
    this.change_flag = true;
  };

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
  closeModal = () => {
    this.setState({
      addManageModal: false,
    });
  };
  openManageAddModal = () => {
    this.setState({
      addManageModal: true,
    });
  };

  addManage = (item) => {
    this.closeModal();
    var temp = this.state.fee_management;
    var fee_check_array = this.state.fee_check_array;
    var check_duplicate = temp.filter((x) => x.number == item.number);
    if (check_duplicate.length > 0) {
      window.sessionStorage.setItem(
        "alert_messages",
        "すでに追加された項目です。"
      );
      return;
    }
    temp.push(item);
    fee_check_array[item.number] = false;
    this.setState({
      fee_management: temp,
      fee_check_array,
    });
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
    let { patients_list, fee_management } = this.state;

    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal prescription-multiSet-modal managemoney-multiset-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>管理料の一括設定</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="schedule_date">
              <span className="sp-date">
                {formatJapanDate(this.state.selected_date)}
              </span>
              <span>の管理料予定</span>
            </div>
            <Col md="4" className="left">
              <div className="top_part flex">
                <div className="">対象管理料一覧</div>
                <div className="search" onClick={this.openManageAddModal}>
                  <Icon icon={faPlusSquare} />
                  管理料を追加
                </div>
              </div>
              <div className="main_part">
                {fee_management !== undefined &&
                  fee_management !== null &&
                  fee_management.length > 0 &&
                  fee_management.map((item) => {
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
                          getUsage={(e) => this.selectPatient(e)}
                          checked={
                            this.state.selected_patients_list.indexOf(
                              parseInt(patient_id)
                            ) >= 0
                              ? true
                              : false
                          }
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
                                this.state.time_zone === item.id ? true : false
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
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.close.bind(this)}>キャンセル</Button>
            <Button className="red-btn" onClick={this.multiSet.bind(this)}>一括設定</Button>
        </Modal.Footer>
        {this.state.addManageModal && (
          <DialSelectMasterModal
            selectMaster={this.addManage}
            closeModal={this.closeModal}
            MasterCodeData={this.state.feeMasterData}
            MasterName="管理料"
          />
        )}
        {this.state.isUpdateConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmSet.bind(this)}
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

EditManageMultiSetModal.contextType = Context;

EditManageMultiSetModal.propTypes = {
  closeModal: PropTypes.func,
  selected_date: PropTypes.array,
  patients_same_day: PropTypes.array,
  handleOk: PropTypes.func,
};

export default EditManageMultiSetModal;
