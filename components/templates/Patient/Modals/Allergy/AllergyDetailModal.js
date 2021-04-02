import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import {displayLineBreak} from "~/helpers/dialConstants"
import { ALLERGY_STATUS_ARRAY } from "~/helpers/constants";
import {formatJapanSlashDateTime} from "~/helpers/date";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  
  flex-direction: column;
  display: flex;
  text-align: center;
  .content{
    margin-top: 10px;
    height: 520px;
    overflow-y: auto;
    text-align: left;
    width: 100%;
  }
 `;

const WEEKDAYS = ['日','月','火','水','木','金','土'];
class AllergyDetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body_1: "",
      body_2: "",
      body1_title: '',
      body2_title: '',
      modal_title:"",
    }
  }

  componentDidMount() {
    var base_modal = document.getElementsByClassName("allergy-list-modal")[0];
    if(base_modal !== undefined && base_modal != null)
      base_modal.style['z-index'] = 1040;
    var second_modal = document.getElementsByClassName("allergy-modal")[0];
    if (second_modal !== undefined && second_modal != null)
      second_modal.style['z-index'] = 1040;
    let data = this.props.modal_data;
    if(data.order_data.order_data.type !== undefined && data.order_data.order_data.type != null) {
      this.setTitle(data.order_data.order_data.type);
    }
  }

  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
  }

  setTitle (allergy_type) {
    let body1_title = "";
    let body2_title = "";
    let modal_title = "";
    switch (allergy_type) {
      case "past":
        body1_title = "既往歴";
        body2_title = "アレルギー";
        modal_title = "既往歴・アレルギー";
        break;
      case "foodalergy":
        body1_title = "食物アレルギー";
        modal_title = "食物アレルギー";
        break;
      case "drugalergy":
        body1_title = "薬剤アレルギー";
        modal_title = "薬剤アレルギー";
        break;
      case "disabled":
        body1_title = "障害情報";
        modal_title = "障害情報";
        break;
      case "vaccine":
        body1_title = "患者ワクチン情報";
        modal_title = "患者ワクチン情報";
        break;
      case "adl":
        body1_title = "ADL情報";
        modal_title = "ADL情報";
        break;
      case "infection":
        body1_title = "感染症";
        modal_title = "感染症";
        break;
      case "alergy":
        body1_title = "一般アレルギー";
        modal_title = "一般アレルギー";
        break;
      case "contraindication":
        body1_title = "禁忌";
        modal_title = "禁忌";
        break;
      case "process_hospital":
        body1_title = "主訴";
        body2_title = "現病歴";
        modal_title = "入院までの経過";
        break;
      case "inter_summary":
        body1_title = "臨床経過";
        body2_title = "治療方針";
        modal_title = "中間サマリー";
        break;
      case "current_symptoms_on_admission":
        body1_title = "入院時身体所見";
        body2_title = "入院時検査所見";
        modal_title = "入院時現症";
        break;
    }
    this.setState({
      body2_title,
      body1_title,
      allergy_type,
      modal_title,
    });
  }
  
  componentWillUnmount() {
    var base_modal = document.getElementsByClassName("allergy-list-modal")[0];
    if(base_modal !== undefined && base_modal != null)
      base_modal.style['z-index'] = 1050;
    var second_modal = document.getElementsByClassName("allergy-modal")[0];
    if (second_modal !== undefined && second_modal != null)
      second_modal.style['z-index'] = 1050;
  }
  getOptional = (optional_json) => {
    let optional_str = '';
    if (optional_json != undefined && optional_json['tpha'] != 0) {
      optional_str = optional_str + "TPHA：" + (optional_json['tpha'] == 1 ? "(+)": optional_json['tpha'] == 2 ? "(-)" : "(±) ");
    }
    if (optional_json != undefined && optional_json['hbs_ag'] != 0) {
      optional_str = optional_str + "HBs-Ag：" + (optional_json['hbs_ag'] == 1 ? "(+)": optional_json['hbs_ag'] == 2 ? "(-)" : "(±) ");
    }
    if (optional_json != undefined && optional_json['hcv_Ab'] != 0) {
      optional_str = optional_str + "HCV-Ab：" + (optional_json['hcv_Ab'] == 1 ? "(+)": optional_json['hcv_Ab'] == 2 ? "(-)" : "(±) ");
    }
    if (optional_json != undefined && optional_json['hiv'] != 0) {
      optional_str = optional_str + "HIV：" + (optional_json['hiv'] == 1 ? "(+)": optional_json['hiv'] == 2 ? "(-)" : "(±) ");
    }
    return optional_str;
  }

  render() {
    const { modal_data } = this.props;
    const { body1_title, body2_title, allergy_type, modal_title } = this.state;
    return  (
      <Modal show={true} className="custom-modal-sm">
        <Modal.Header>
          <Modal.Title>{modal_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="content w-100">
              <div className="w-auto ml-2 text-left">
                {modal_data.updated_at !== undefined && modal_data.updated_at !== "" ? formatJapanSlashDateTime(modal_data.updated_at):""}
              </div>
              <label className="w-auto ml-2 text-left">{body1_title}</label>
              <div className={`mb-2 border p-2`} style={{overflowY:"auto", height:"180px"}}>{displayLineBreak(modal_data.order_data.order_data.body_1)}</div>
              {allergy_type === "past" || allergy_type == "process_hospital" || allergy_type === "current_symptoms_on_admission" ? (
                <>
                  <label className="w-auto ml-2 text-left">{body2_title}</label>
                  {allergy_type == "current_symptoms_on_admission" && (
                    <div>{this.getOptional(modal_data.order_data.order_data.optional_json)}</div>
                  )}
                  <div className={`mb-2 border p-2`} style={{overflowY:"auto", height:"180px"}}>{displayLineBreak(modal_data.order_data.order_data.body_2)}</div>
                </>
              ):(<></>)}
              {(allergy_type === "infection" || allergy_type === "alergy") && (
                <>
                  <div>
                    <label className="w-auto ml-2 text-left">状態</label>
                    <div>{modal_data.order_data.order_data.body_2 !== undefined ? ALLERGY_STATUS_ARRAY[parseInt(modal_data.order_data.order_data.body_2)] : ""}</div>
                  </div>
                </>
              )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

AllergyDetailModal.contextType = Context;

AllergyDetailModal.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
};

export default AllergyDetailModal;