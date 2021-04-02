import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import * as methods from "../../DialMethods";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import RadioButton from "~/components/molecules/RadioInlineButton"
import * as apiClient from "~/api/apiClient";
import { Row, Col  } from "react-bootstrap";
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import {makeList_code} from "~/helpers/dialConstants";
import {formatDateSlash, formatDateLine} from "~/helpers/date";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";

const Wrapper = styled.div`  
  display: block;
  // align-items: flex-start;
  // justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  // display: flex;
  text-align: center;
  .radio-btn{
    label{
      font-size:18px;
      text-align: left;
      padding-left: 4px;
      padding-top: 2px;
    }
  }
  .dialyser-list {
    border: solid 1px rgb(206,212,218);
    width:100%;
    min-height:400px;
    margin-bottom:5px;
  }  
  .btn-area {
    margin: auto;
    button {
      margin-top: 10px;
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
    }      
    span {
      color: white;
      font-size: 0.8rem;
      font-weight: 100;
    }
  } 
 `;
 const week_days = ["日", "月", "火", "水", "木", "金", "土"];

class InspectionPatternListModal extends Component {
  constructor(props) {
    super(props); 
    Object.entries(methods).forEach(([name, fn]) =>
        name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let code_master = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"code_master");
    let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
    this.examination_codes = makeList_code(examinationCodeData);
    this.timing_codes = makeList_code(code_master['実施タイミング']);
    this.state = {         
        showHistory: 1,
    }
  }
  async componentDidMount () {
    this.getExaminationPattern(this.props.patient.system_patient_id);
  }

  getShowHistory = (name, value) => {
    if (name === "schedule"){
      if (value == 0) {
        let tmp = [];
        let today = new Date();                
        tmp = this.getPatternListByDateCondition(this.state.examination_pattern, formatDateLine(today), 'time_limit_from', 'time_limit_to');
        this.setState({
          showHistory: value,
          examination_pattern: tmp
        });
      } else {
        this.setState({
          showHistory: value,
          examination_pattern: this.state.origin_pattern_list
        });
      }
    }
};

  async getExaminationPattern(patient_id){
    let path = "/app/api/v2/dial/pattern/getExaminationPattern";
    const post_data = {
        patient_id:patient_id
    };
    await apiClient
        ._post(path, {
            params: post_data
        })
        .then((res) => {
            if (res){
                let tmp = res;
                if (this.state.showHistory == 0) {
                    let today = new Date();
                    tmp = this.getPatternListByDateCondition(res, formatDateLine(today), 'time_limit_from', 'time_limit_to');
                }
                this.setState({
                    examination_pattern : tmp,
                    origin_pattern_list: res,
                });
            }
        })
        .catch(() => {

        });
}

  render() {
    var {examination_pattern} = this.state;
    
    let Pattern_List = [];
    var message = '';
    if (examination_pattern !== undefined && examination_pattern !== null && examination_pattern.length > 0){
        examination_pattern.map((item) => {
            let weekday = "";
            for (let i = 0; i < 7; i++) {
                weekday += item.weekday & Math.pow(2, i) ? week_days[i] : "";
            }
          Pattern_List.push(
              <>
                <Row>
                    <Col md="3">{ (this.examination_codes != undefined && this.examination_codes != null && this.examination_codes[item.examination_code] != undefined ) ? this.examination_codes[item.examination_code] : '' }</Col>
                    <Col md="3">{ (this.timing_codes != undefined && this.timing_codes != null && this.timing_codes[item.timing_code] != undefined ) ? this.timing_codes[item.timing_code] : '' }</Col>
                    <Col md="2">{weekday}</Col>
                    <Col md="2">{formatDateSlash(item.time_limit_from)}</Col>
                    <Col md="2">{item.time_limit_to == null ? "～ 無期限" : formatDateSlash(item.time_limit_to)}</Col>
                </Row>            
            </>
            );
        })
    } else {
        message = <div className="no-result"><span>登録された検査パターンがありません。</span></div>;
    }

    const { closeModal } = this.props;
    return  (
        <Modal show={true} onHide={closeModal} id="add_contact_dlg"  className="master-modal dialyser-modal inspection-pattern-list-modal">
          <Modal.Header>
            <Modal.Title>検査パターン</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: `500px`, overflowY: `scroll` }}>
            <Wrapper>              
              <div className="dialyser-list">
                {Pattern_List}{message}
              </div>
              <div className="last-history">
                <Checkbox
                    label="期限切れも表示"
                    getRadio={this.getShowHistory.bind(this)}
                    value={this.state.showHistory}
                    name="schedule"
                />
            </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" style={{background:'rgb(105, 200, 225)'}} onClick={this.props.closeModal}>キャンセル</Button>
          </Modal.Footer>
        </Modal>
    );
  }
}

InspectionPatternListModal.contextType = Context;

InspectionPatternListModal.propTypes = {  
  closeModal: PropTypes.func,
  patient : PropTypes.object,
};

export default InspectionPatternListModal;
