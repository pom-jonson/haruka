import React, { Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "~/components/_nano/colors";
import { Modal } from "react-bootstrap";
import Context from "~/helpers/configureStore";
import * as apiClient from "~/api/apiClient";
import { makeList_data } from "~/helpers/dialConstants";
import {
  formatDateTimeIE,
  formatJapanDate,
} from "~/helpers/date";
import Button from "~/components/atoms/Button";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";


const Popup = styled.div`
    .flex {
      display: flex;
    }
    height: 96%;
  
    h2 {
      color: ${colors.onSurface};
      font-size: 1.1rem;
      font-weight: 500;
      margin: 6px 0;
    }
    .content-height-style{
      height: 32px;
      line-height: 32px;
    }
    .register-label{
      div:first-child{
        margin-top: 0px;
      }
      input{
        height: 32px;
        line-height: 32px;
        border: 1px solid #aaa;
      }
    }
    textarea{
      border-color: #aaa;
    }
    .one-row{
      display:flex;
      margin-top:10px;
      margin-bottom:10px;
      .label-title{
        width:100px;
        text-align:left;
        height: 32px;
        line-height: 32px;
        font-size:1.2rem;
      }
      .label-content{
        border:1px solid #aaa;
        width:12rem;
        .label-title{
          display:none;
        }
        .react-datepicker-wrapper, .react-datepicker__input-container{
          width:100%;
          margin-top:0px;
        }
        input{
          width:100%;
          border:none
        }
        label{
          margin-bottom:0px;
        }
        .pullbox{
          width:100%;
        }
        .pullbox-select{
          height: 32px;
          line-height: 32px;
          border: 1px solid #aaa;
        }
        .pullbox-select, .pullbox-label{
          width:100%;
        }
      }
      .label-big-content{
        width:500px;
        textarea{
          width:100%;
        }
        .label-title{
          display:none;
        }
        .pullbox-select, .pullbox-label{
          width:100%;
        }
      }
      .nurse_plan_area{
        border: 1px solid #aaa;
        height: 4rem;
      }
    }
  `;

class ProgressPlanModal extends Component {
  constructor(props) {
    super(props);
    let nurse_plan_item = this.props.nurse_plan_item;
    let value = "";
    if (nurse_plan_item.input_values !== undefined && nurse_plan_item.input_values.length > 0) {
      let find_item = nurse_plan_item.input_values.find(x=>x.input_date == this.props.nurse_plan_date);
      if (find_item !== undefined && find_item.value !== undefined && find_item.value !== "") value = find_item.value;
    }
    this.state = {
      departmentCode:1,
      number:0,
      select_category_code:0,
      // item_info: this.props.item_info,
      created_at : nurse_plan_item.created_at!='0000-00-00:00:00:00' && nurse_plan_item.created_at != undefined && nurse_plan_item.created_at != null?formatDateTimeIE(nurse_plan_item.created_at):null,
      evaluation_class_date : nurse_plan_item.evaluation_class_date!='0000-00-00:00:00:00' && nurse_plan_item.evaluation_class_date != undefined && nurse_plan_item.evaluation_class_date != null?formatDateTimeIE(nurse_plan_item.evaluation_class_date):null,
      next_evaluate_date:'',
      nurse_plan_item,
      evaluation:nurse_plan_item.evaluation_class_id,
      plan_id: 0,
      plan_class_id: 12,
      confirm_message: "",
      confirm_title: "",
      alert_messages: "",
      value,
    }
    this.categoryOptions = [
      {id:0, value:''},
    ];
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.class_options = [
      {id:12, value: "OP"},
      {id:13, value: "TP"},
      {id:14, value: "EP"},
    ]
  }
  async componentDidMount(){
    // await this.getEvaluationMasters();
    await this.getPlanMasters();
  }
  
  getEvaluationMasters = async() => {
    let path = "/app/api/v2/master/nurse/evaluation_master_search";
    let post_data = {};
    await apiClient.post(path, post_data)
      .then((res) => {
        this.setState({
          evaluation_class_master_options:makeList_data(res, 1),
        })
      });
  }
  getPlanMasters = async() => {
    let path = "/app/api/v2/master/nurse/searchPlanMaster";
    let post_data = {params: {progress_item_flg: 1}};
    await apiClient.post(path, post_data)
      .then((res) => {
        this.setState({
          plan_class_master_options:makeList_data(res, 1),
        })
      });
  }
  
  handleOk = () => {
    if (this.state.value == "") {
      this.setState({alert_messages: "登録値を入力してください。"});
      return;
    }
    this.setState({
      confirm_message: "経過看護計画を登録しますか？",
      confirm_title: "登録確認"
    });
  }
  
  getRegisterDate = (e) => {
    this.setState({
      created_at:e
    })
  }
  
  getEvaluateDate = (e) => {
    let nurse_plan_item = this.state.nurse_plan_item;
    nurse_plan_item.evaluation_class_date = e;
    this.setState({
      evaluation_class_date:e,
      nurse_plan_item,
    })
  }
  
  getEvaluation = (e) => {
    let nurse_plan_item = this.state.nurse_plan_item;
    nurse_plan_item.evaluation_class_id = parseInt(e.target.id);
    nurse_plan_item.evaluation_name = e.target.value;
    this.setState({
      evaluation:e.target.value,
      nurse_plan_item
    })
  }
  
  getComment = (e) => {
    this.setState({value:e.target.value});
  }
  
  confirmOk = async () => {
    this.confirmCancel();
    let path = "/app/api/v2/nurse/progress_chart/register_plan";
    let post_data = {
      patient_id: this.props.patientId,
      created_at: this.props.nurse_plan_date,
      nurse_plan_item: this.props.nurse_plan_item,
      value: this.state.value
    };
    await apiClient.post(path, {params:post_data})
      .then((res) => {
        if (res)
          this.props.handleOk(res.alert_message);
      });
  }
  getSelect = (name, e) => {
    this.setState({[name]:e.target.id});
  }
  confirmCancel = () => {
    this.setState({
      confirm_message: "",
      confirm_title: "",
      alert_messages: ""
    });
    if (this.state.close_main_modal) this.props.handleOk();
  }
  
  render() {
    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm notice-modal first-view-modal"
        >
          <Modal.Header>
            <Modal.Title style={{width:'20rem'}}>経過看護計画登録</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Popup>
              <div className='one-row'>
                <div className='label-title'>登録日</div>
                <div className='label-content register-label' style={{width:"10rem", lineHeight:"32px", paddingLeft:'0.5rem'}}>
                  {formatJapanDate(formatDateTimeIE(this.props.nurse_plan_date))}
                </div>
              </div>
              <div className='one-row'>
                {/*<div className='label-title'>看護問題</div>*/}
                <div className='label-title'>第二階層</div>
                <div className='label-content register-label' style={{width:"10rem", lineHeight:"32px", paddingLeft:'0.5rem'}}>
                  #{this.props.nurse_plan_item.tier_2nd_name}
                </div>
              </div>
              <div className='one-row'>
                {/*<div className='label-title'>計画区分</div>*/}
                <div className='label-title'>第三階層</div>
                <div className='label-content register-label' style={{width:"10rem", lineHeight:"32px", paddingLeft:'0.5rem'}}>
                  {this.props.nurse_plan_item.tier_3rd_name}
                </div>
              </div>
              {/*<div className='one-row'>*/}
              {/*  <div className='label-title'>看護計画</div>*/}
              {/*  <div className='label-big-content register-label' style={{border:"gray", lineHeight:"32px", paddingLeft:'0.5rem'}}>*/}
              {/*    {this.props.nurse_plan_item.plan_name}*/}
              {/*  </div>*/}
              {/*</div>*/}
              {/*<div className='one-row'>*/}
              {/*  <div className='label-title'>計画区分</div>*/}
              {/*  <div className='label-content register-label' style={{border:"none"}}>*/}
              {/*    <SelectorWithLabel*/}
              {/*      title=""*/}
              {/*      options={this.class_options}*/}
              {/*      getSelect={this.getSelect.bind(this, 'plan_class_id')}*/}
              {/*      departmentEditCode={this.state.plan_class_id}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}
              {/*<div className='one-row'>*/}
              {/*  <div className='label-title'>看護計画</div>*/}
              {/*  <div className='label-big-content register-label' style={{border:"none"}}>*/}
              {/*    <SelectorWithLabel*/}
              {/*      title=""*/}
              {/*      options={this.state.plan_class_master_options}*/}
              {/*      getSelect={this.getSelect.bind(this, 'plan_id')}*/}
              {/*      departmentEditCode={this.state.plan_id}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}
              <div className='one-row'>
                <div className='label-title'>登録値</div>
                <div className='label-big-content'>
                  <textarea onChange = {this.getComment.bind(this)} value = {this.state.value}></textarea>
                </div>
              </div>
            </Popup>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
            <Button className={this.state.value == "" ? "disable-btn":"red-btn"} onClick={this.handleOk}>確定</Button>
          </Modal.Footer>
        </Modal>
        {this.state.confirm_message != "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_title}
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
ProgressPlanModal.contextType = Context;

ProgressPlanModal.propTypes = {
  handleOk :  PropTypes.func,
  closeModal: PropTypes.func,
  confirmPlanOk: PropTypes.func,
  patientId: PropTypes.number,
  nurse_plan_item: PropTypes.object,
  nurse_plan_date: PropTypes.object
};

export default ProgressPlanModal;