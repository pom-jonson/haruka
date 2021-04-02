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
import { formatJapanDate } from "~/helpers/date";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import { makeList_codeName } from "~/helpers/dialConstants";
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  .flex {
    display: flex;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 14px;
  }

  .left {
    float: left;
    padding-top: 30px;
  }
  .right {
    float: right;
  }
  label {
    text-align: right;
    width: 100px;
  }
  .pullbox-select {
    width: 100px;
  }
  .label {
    padding-top: 0.5rem;
    width: 4rem;
  }
  input {
    width: 200px;
    font-size: 1rem;
  }
  .modal_header {
    font-size: 1rem;
    span {
      margin-left: 20px;
      padding-top: 0.5rem;
    }
  }
  .patient_id,
  .patient_name {
    font-size: 20px;
  }
  .schedule_date {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    display:flex;
    div {
      line-height:2rem;
      padding: 0 0.3rem;
    }
    .date {border: 1px solid black;}
  }
  .input_area {
    .label-title {
      display: none;
    }
    .count {
      line-height:2.375rem;
      padding-left: 5px;
    }
  }
  .checkbox_area {    
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
    .radio-group-btn label {
      border-radius: 0;
      margin-right: 3px;
      width: 32%;
      text-align: left;
      padding-left: 0.5rem;
      padding-top: 4px;
    }
  }
  .bottom_part {
    border: 1px solid lightgray;
    padding-left: 1rem;
  }
  .react-datepicker-wrapper {
    width: fit-content;
    border: 1px solid;
    margin-left: 0px;
    margin-right: 20px;
    padding: 5px;
    .react-datepicker__input-container {
      width: 100%;
      margin-top: 3px;
      font-size: 1rem;
      input {
        width: 100%;
        height: 2.375rem;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 0.5rem;
      }
    }
  }

  .modal_container {
    .pullbox {
      margin-top: 0.5rem;
    }
    .pullbox-title {
      width: 5rem;
      text-align: right;
      padding-right: 0.5rem;
      font-size: 1rem;
      line-height: 38px;
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
      font-size: 1rem;
    }
  }
  .radio-btn label {
    width: 4rem;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    margin: 0 5px;
    margin-right: 5px;
    padding: 4px 5px;
    font-size: 1rem;
  }
  .radio-group-btn label {
    font-size: 1rem;
  }
  .deploy-radio{
    .radio-btn {
      display: block;
      margin-top: 0.5rem;
    }
    label {
      width: 12rem;
    }
  }
`;
const DoubleModal = styled.div`
  font-family: NotoSansJP;
  line-height: 1.33;
  letter-spacing: 0.4px;
  padding: 4px 4px 4px 0;
  margin: 0;
  font-size: 20px;
  font-weight: bold;
`;

class EditMultiSet extends Component {
  constructor(props) {
    super(props);
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    var groups = makeList_codeName(code_master["グループ"],1);
    this.bulk_deployment = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data").prescription_schedule_bulk_deployment_by_select_the_day_of_the_week;
    this.bulk_deployment_day = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data").prescription_schedule_bulk_deployment_one_day;
    let deploy_kind = 0;
    if (this.bulk_deployment_day != "ON") 
    deploy_kind = 1;
    this.state = {
      search_date: this.props.schedule_date,
      all_check_flag: 0,
      selected_patients_list: [],
      patients_list: this.props.patients_same_day,
      prescript_kind: 1,
      usage_weeks: 1,
      time_zone_list: getTimeZoneList(),
      isConfirmComplete: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      groups,
      deploy_kind,
    };
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
  };

  changeKindPrescript = (e) => {
    this.setState({
      prescript_kind: e.target.value,
    });
  };
  
  changeDeploy = (e) => {
    this.setState({
      deploy_kind: e.target.value,
    });
  };

  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
  };

  saveEditedSchedule = () => {
    if (this.state.selected_patients_list.length < 1) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    let confirm_message = "一括設定しますか？";
    if (this.bulk_deployment != undefined && this.bulk_deployment == "ON" && this.state.deploy_kind == 1) {
      let start_date = formatJapanDate(this.state.search_date);
      let end_date = new Date(this.state.search_date);
      end_date.setDate(end_date.getDate() + (parseInt(this.state.usage_weeks) * 7 -1));
      end_date = formatJapanDate(end_date);
      confirm_message = "同じパターンに基づく、" + start_date + "～" +  end_date + "のスケジュールを削除しますか？"; 
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message,
    });    
  }  

  handleSaveEditedSchedule = async (delete_flag = 0) => {
    if (this.state.selected_patients_list.length < 1) {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
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
        };
        req.push(arr);
      });

    this.openConfirmCompleteModal("保存中");
    let path = "/app/api/v2/dial/schedule/dial_prescription_change_kind_multi";
    const post_data = {
      params: {
        patients: req,
        new_pres_kind: this.state.prescript_kind,
        schedule_date: this.state.search_date,
        usage_weeks: this.state.usage_weeks,
        deploy_kind: this.state.deploy_kind,
        delete_flag,
      },
    };
    await apiClient
      .post(path, post_data)
      .then((res) => {
        this.props.closeModal();
        this.setState({ isConfirmComplete: false });
        var title = "処方スケジュール一括設定完了##";
        window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        this.props.handleOk(this.state.search_date);
      })
      .catch(() => {
        this.setState({ isConfirmComplete: false });
        window.sessionStorage.setItem("alert_messages", "失敗しました");
      });
  };

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
  };

  selectTimezone = (e) => {
    this.setState({ time_zone: parseInt(e.target.value) }, () => {
      this.extractPatients(this.state.time_zone, this.state.selected_group);
    });
  };

  getGroup = (e) => {
    this.setState({ selected_group: e.target.id }, () => {
      this.extractPatients(this.state.time_zone, this.state.selected_group);
    });
  };

  selectAllTimes = () => {
    this.setState(
      {
        time_zone: 0,
        selected_group: 0,
      },
      () => {
        this.extractPatients(this.state.time_zone, this.state.selected_group);
      }
    );
  };

  extractPatients = (time_zone, group) => {
    var temp = this.props.patients_same_day;
    var new_list = {};
    Object.keys(temp).map((patient_id) => {
      var patient = temp[patient_id];
      if (time_zone > 0) {
        if (patient.time_zone == time_zone) {
          if (group > 0) {
            if (patient.group == group) new_list[patient_id] = patient;
          } else {
            new_list[patient_id] = patient;
          }
        }
      } else {
        if (group > 0) {
          if (patient.group == group) new_list[patient_id] = patient;
        } else {
          new_list[patient_id] = patient;
        }
      }
    });
    this.setState({ patients_list: new_list });
  };

  getUsageWeeks = (e) => {
    this.setState({
      usage_weeks: parseInt(e.target.value),
    });
  };

  onHide = () => {};

  confirmCancel = () => {
    this.setState({
      confirm_message: "",
      isUpdateConfirmModal: false
    });
  }

  confirmOk = (delete_flag) => {
    this.setState({
      confirm_message: "",
      isUpdateConfirmModal: false
    });
    this.handleSaveEditedSchedule(delete_flag); 
  };

  render() {
    let { patients_list } = this.state;
    var weeks_options = [];
    for (var i = 1; i <= 24; i++) {
      weeks_options.push({ id: "week_" + i, value: i });
    }    
    return (
      <>
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal prescription-multiSet-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>処方スケジュール一括設定</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <Col md="4" className="left">
              <div className="schedule_date">
                <div className={'date'}>{formatJapanDate(this.state.search_date)}</div>
                <div>の定期処方</div>
              </div>
              <div>対象の処方区分</div>
              <div className="flex schedule_time">
                <RadioButton
                  id="regulart_presc_101"
                  value={1}
                  label="定期1"
                  name="schedule_time"
                  getUsage={this.changeKindPrescript}
                  checked={this.state.prescript_kind == 1 ? true : false}
                />
                <RadioButton
                  id="regulart_presc_102"
                  value={2}
                  label="定期2"
                  name="schedule_time"
                  getUsage={this.changeKindPrescript}
                  checked={this.state.prescript_kind == 2 ? true : false}
                />
                <RadioButton
                  id="regulart_presc_103"
                  value={3}
                  label="定期3"
                  name="schedule_time"
                  getUsage={this.changeKindPrescript}
                  checked={this.state.prescript_kind == 3 ? true : false}
                />
              </div>
              <div className="sub-title">服用日数</div>
              <div className="flex input_area">
                <SelectorWithLabel
                  options={weeks_options}
                  title=""
                  getSelect={this.getUsageWeeks.bind(this)}
                  departmentEditCode={this.state.usage_weeks}
                />
                <div className="count">週間分</div>
              </div>
              {this.bulk_deployment_day == "ON" && (
                <div className="deploy-radio">
                 <RadioButton
                  id="regulart_presc_104"
                  value={0}
                  label="この日に展開"
                  name="deploy_kind"
                  getUsage={this.changeDeploy}
                  checked={this.state.deploy_kind == 0 ? true : false}
                />
                </div>
              )}
              {this.bulk_deployment == "ON" && (
                <div className="deploy-radio">
                <RadioButton
                  id="regulart_presc_106"
                  value={1}
                  label="この曜日に展開"
                  name="deploy_kind"
                  getUsage={this.changeDeploy}
                  checked={this.state.deploy_kind == 1 ? true : false}
                />
                 <RadioButton
                  id="regulart_presc_105"
                  value={2}
                  label="パターンの曜日に展開"
                  name="deploy_kind"
                  getUsage={this.changeDeploy}
                  checked={this.state.deploy_kind == 2 ? true : false}
                />
                </div>
              )}
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
                  {/* <div className="search">
                    <Icon icon={faSearch} />
                    検索
                  </div> */}
                </div>
                <div className="main_part">
                  {Object.keys(patients_list).map((patient_id) => {
                    return (
                      <>
                        <RadioGroupButton
                          id={'patent_' + patient_id}
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
                              id={`male_${item.id}`}
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
                    <Button type="mono" onClick={this.selectAllTimes}>
                      すべて
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Wrapper>
          {this.state.isConfirmComplete !== false && (
            <CompleteStatusModal message={this.state.complete_message} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.saveEditedSchedule}>一括設定</Button>
        </Modal.Footer>
      </Modal>
      {this.state.isUpdateConfirmModal !== false && this.state.confirm_message != "" && (
        <Modal show={true} className='system-confirm master-modal'>
        <Modal.Header><Modal.Title>&nbsp;&nbsp;</Modal.Title></Modal.Header>
        <Modal.Body>
          <DoubleModal>
          <div>              
            {this.state.confirm_message}
          </div>
          </DoubleModal>
        </Modal.Body>        
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.confirmCancel}>キャンセル</Button>
          {this.bulk_deployment == "ON" && this.state.deploy_kind == 1 ? (
            <>
              <Button className="red-btn" onClick={this.confirmOk.bind(this,1)}>削除して展開</Button>
              <Button className="red-btn" onClick={this.confirmOk.bind(this,0)}>残したまま展開</Button>
            </>
          ):(
            <Button className="red-btn" onClick={this.confirmOk.bind(this,1)}>はい</Button>
          )}
        </Modal.Footer>
      </Modal>
      )}
      </>
    );
  }
}

EditMultiSet.contextType = Context;

EditMultiSet.propTypes = {
  closeModal: PropTypes.func,
  saveDailysisSchedule: PropTypes.func,
  schedule_date: PropTypes.string,
  patients_same_day: PropTypes.array,
  handleOk: PropTypes.func,
};

export default EditMultiSet;