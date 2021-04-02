import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import RadioButton from "~/components/molecules/RadioInlineButton";
import { formatJapanDate } from "~/helpers/date";

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
    background: lightgray;
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
`;

class PrescriptionScheduleDeployModal extends Component {
  constructor(props) {
    super(props);
    let deploy_kind = 0;
    this.state = {
      search_date: this.props.schedule_date,
      all_check_flag: 0,
      prescript_kind: 1,
      usage_weeks: 1,
      isConfirmComplete: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      deploy_kind,
    };
  }

  changeKindPrescript = (e) => {
    this.setState({
      prescript_kind: e.target.value,
    });
  };

  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
  };

  saveEditedSchedule = () => {
    this.props.handleOk(this.state.usage_weeks);
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
    var weeks_options = [];
    for (var i = 1; i <= 24; i++) {
      weeks_options.push({ id: "week_" + i, value: i });
    }    
    return (
      <Modal show={true} onHide={this.onHide} className="master-modal small_addProgress_modal">
        <Modal.Header>
          <Modal.Title>処方スケジュール展開</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
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
                checked={this.props.regular_prescription_number == 1 ? true : false}
              />
              <RadioButton
                id="regulart_presc_102"
                value={2}
                label="定期2"
                name="schedule_time"
                getUsage={this.changeKindPrescript}
                checked={this.props.regular_prescription_number == 2 ? true : false}
              />
              <RadioButton
                id="regulart_presc_103"
                value={3}
                label="定期3"
                name="schedule_time"
                getUsage={this.changeKindPrescript}
                checked={this.props.regular_prescription_number == 3 ? true : false}
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
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.saveEditedSchedule}>確定</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

PrescriptionScheduleDeployModal.contextType = Context;

PrescriptionScheduleDeployModal.propTypes = {
  closeModal: PropTypes.func,
  schedule_date: PropTypes.string,
  patients_same_day: PropTypes.array,
  handleOk: PropTypes.func,
  regular_prescription_number: PropTypes.number,
};

export default PrescriptionScheduleDeployModal;