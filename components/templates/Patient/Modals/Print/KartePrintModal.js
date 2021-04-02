import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import {formatDateLine, formatJapanDate} from "~/helpers/date";
import DatePicker from "react-datepicker";
import Checkbox from "~/components/molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import KartePrintPreviewModal from "./KartePrintPreviewModal";
import Radiobox from "~/components/molecules/Radiobox";
import {setDateColorClassName} from '~/helpers/dialConstants';
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 100%;
  min-height: 200px;
  .select_date_range{
    display:flex;
    .pullbox{
        margin-right:20px;
    }     
    span{
        padding-top:9px;
        margin: 0px 10px;
    }
  }
  .example-custom-input{
    font-size: 15px;
    width:180px;
    text-align:center;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    border: 1px solid;
    margin-left:5px;
    margin-right:5px;
  }
  .example-custom-input.disabled{
      background:lightgray;
  }
  .pullbox-label, .pullbox-select{
    width:100px;    
  }
  .label-title{
    width:100px;
    font-size:15px;
  }
  .radio-label{
    font-size:15px;
    padding-top:5px;
  }
  .ixnvCM {
    font-size:15px;
    margin-right:20px;
    padding-top:8px;
  }
  .condition-style1{
    label{
      padding-top: 0px;
    }
  }
 `;

class KartePrintModal extends Component {
  constructor(props) {
    super(props);
    let oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate()-7);
    this.state = {
      start_date:oneMonthAgo,
      end_date:new Date(),
      all_period:0,
      department_id:0,
      tag_flag: 0,
      enable_flag: 1,
    }
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
  }
  getStartDate = value => {
    this.setState({
      start_date: value
    });
  };

  getEndDate = value => {
    this.setState({
      end_date: value
    });
  };

  checkAllPeriod = (name, value) => {
    if (name == "period_all"){
      this.setState({all_period:value});
    }
  }

  getDepartment = e => {                 //表示区分
    this.setState({ department_id: parseInt(e.target.id)});
  };

  openPreviewModal=()=>{
    this.setState({isOpenPrintPreviewModal:true});
  }

  setEnableFlag = (val) => {
    this.setState({
      enable_flag: val
    });
  }

  closeModal = () => {
    this.setState({isOpenPrintPreviewModal:false});
  }

  setTargetFlag = () => {
    this.setState({
      tag_flag: (parseInt(this.state.tag_flag) + 1) % 2
    });
  }

  render() {
    var departments = [{id:0, value:"全科"}];
    departments = [...departments, ...this.departmentOptions];
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className={this.state.all_period?"example-custom-input disabled":"example-custom-input"} onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    return  (
      <Modal show={true} className="karte_print_modal">
        <Modal.Header>
          <Modal.Title><span>カルテ印刷</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              <div className = "select_date_range">
                <div className="radio-label">期間</div>
                <DatePicker
                  locale="ja"
                  selected={this.state.start_date}
                  onChange={this.getStartDate.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  disabled={this.state.all_period}
                  customInput={<ExampleCustomInput />}
                  dayClassName = {date => setDateColorClassName(date)}
                />
                <span>～</span>
                <DatePicker
                  locale="ja"
                  selected={this.state.end_date}
                  onChange={this.getEndDate.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  disabled={this.state.all_period}
                  customInput={<ExampleCustomInput />}
                  dayClassName = {date => setDateColorClassName(date)}
                />
                <Checkbox
                  label = "全期間を表示"
                  getRadio={this.checkAllPeriod.bind(this)}
                  value={this.state.all_period}
                  checked={this.state.all_period === 1}
                  name="period_all"
                />
                <SelectorWithLabel
                  options={departments}
                  title="表示対象科"
                  getSelect={this.getDepartment}
                  departmentEditCode={this.state.department_id}
                />
              </div>
              <div className="search-condition">
                <div className="condition-style1">
                  <Radiobox
                    label={'現行版'}
                    value={1}
                    getUsage={()=>this.setEnableFlag(1)}
                    checked={this.state.enable_flag == 1 ? true : false}
                    name={`enable_flag`}
                  />
                  <Radiobox
                    label={'変更履歴あり'}
                    value={0}
                    getUsage={()=>this.setEnableFlag(0)}
                    checked={this.state.enable_flag == 0 ? true : false}
                    name={`enable_flag`}
                  />
                  <Checkbox
                    label = "付箋・メモを表示する"
                    getRadio={this.setTargetFlag.bind(this)}
                    value={this.state.tag_flag}
                    checked={this.state.tag_flag === 1}
                    name="period_all"
                  />
                </div>
              </div>
            </Wrapper>
            {this.state.isOpenPrintPreviewModal && (
              <KartePrintPreviewModal
                closeModal={this.closeModal}
                patientId = {this.props.patientId}
                start_date = {formatDateLine(this.state.start_date)}
                end_date = {formatDateLine(this.state.end_date)}
                department_id = {this.state.department_id}
                all_period = {this.state.all_period}
                enable_flag = {this.state.enable_flag}
                tag_flag = {this.state.tag_flag}
              />
            )}
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          <Button className={"red-btn"} onClick={this.openPreviewModal}>帳票プレビュー</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

KartePrintModal.contextType = Context;

KartePrintModal.propTypes = {
  closeModal: PropTypes.func,
  modal_type: PropTypes.string,
  patientId: PropTypes.number,
  modal_data: PropTypes.object,
  patientInfo: PropTypes.object,
  history: PropTypes.object,
  cache_index:PropTypes.number,
};

export default withRouter(KartePrintModal);
