import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { withRouter } from "react-router-dom";
import { CACHE_LOCALNAMES, ALLERGY_STATUS_ARRAY } from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import Radiobox from "~/components/molecules/Radiobox";
import AllergyListModal from "./AllergyListModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  
  flex-direction: column;
  display: flex;
  text-align: center;
  .content{
    height: 500px;
    overflow-y: auto;
    text-align: left;
    textarea{
        height: 180px !important;
    }
  }
  .special-content{
    height: 500px;
    overflow-y: auto;
    text-align: left;
    textarea{
      height: 165px !important;
    }
    
    .select-box{
      margin-top: 0.5rem;
      .pullbox-title, .label-title{
        margin-left:0rem;
        width:  4.5rem;
        text-align: right;
        margin-right:0.5rem;
        height:2.5rem;
        font-size: 1rem;
        line-height:2.5rem;
      }
      .pullbox-select{
        width:4rem;
        height:2.5rem;
        line-height:2.5rem;
        font-size: 1rem;
      }
    }
  }
   .radio-group{
    label {font-size: 1rem;}
   }
 `;

class AllergyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body_1: "",
      body_2: "",
      body1_title: '',
      body2_title: '',
      allergy_type: props.allergy_type != undefined ? props.allergy_type : '',
      modal_title:"",
      cache_index:this.props.cache_index,
      number:0,
      isConfirmModal: false,
      confirm_message: '',
      confirm_action: '',
      confirm_title: '',
      optional_json: {tpha: 0, hbs_ag: 0, hcv_Ab: 0, hiv: 0},
      karte_status: 0,
    };
    this.init_state = {
      body_1: "",
      body_2: "",
    };
    this.sampleOptions = [
      {id:0, value:''},
      {id:1, value:'(+)'},
      {id:2, value:'(-)'},
      {id:3, value:'(±)'},
    ];
  }
  
  UNSAFE_componentWillMount() {
    let karte_status = this.context.karte_status.code == 0 ? 1 : this.context.karte_status.code == 1 ? 3 : 2;
    if(this.state.cache_index == undefined && this.state.cache_index == null){
      this.setState({
        karte_status
      });
    }
    if(this.state.cache_index !== undefined && this.state.cache_index != null){
      this.loadFromCache(this.state.cache_index);
      return;
    }
    if(this.props.allergy_type !== undefined && this.props.allergy_type != null) {
      this.setTitle(this.props.allergy_type);
    }
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
  
  componentDidMount () {
    document.getElementById('allergy_cancel_id').focus();
  }
  
  setBody = (e) => {
    this.setState({
      body_1: e.target.value
    })
  };
  
  setBody2 = (e) => {
    this.setState({
      body_2: e.target.value
    })
  };
  
  setSearchType = (e) =>{
    this.setState({body_2:e.target.value})
  };
  
  saveData = () => {
    if (this.state.allergy_type === "past"){
      if (this.state.body_1 === "" && this.state.body_2 === "") {
        return;
      }
    } else if (this.state.allergy_type === "infection" || this.state.allergy_type === "alergy") {
      if (this.state.body_2 === ""){
        return;
      }
      if (this.state.body_1 === ""){
        return;
      }
    } else {
      if (this.state.body_1 === "") {
        return;
      }
    }
    this.setState({
      confirm_message: "カルテに展開しますか？",
      isConfirmModal: true,
      confirm_action: "register"
    });
    this.modalBlack();
  }
  
  gotoKarte = async () =>{
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let number = this.state.number;
    let isForUpdate = this.state.number > 0 ? 1 : 0;
    let params = {
      number,
      isForUpdate,
      karte_status:this.state.karte_status,
      system_patient_id: this.props.patientId,
      type: this.state.allergy_type,
      body_1: this.state.body_1,
      body_2: this.state.body_2,
      department_id: this.context.department.code == 0 ? 1 : this.context.department.code,
      department_name: this.state.department_name,
      doctor_code: authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
      doctor_name: authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name
    };
    if(isForUpdate === 1 && this.state.cache_index != null) {
      let allergyOrder = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_EDIT, this.state.cache_index);
      if(allergyOrder !== undefined && allergyOrder != null && allergyOrder.last_doctor_code !== undefined){
        params.last_doctor_code = allergyOrder.last_doctor_code;
        params.last_doctor_name = allergyOrder.last_doctor_name;
        params.visit_place_id = allergyOrder.visit_place_id;
      }
      if(this.props.cache_data !== undefined && this.props.cache_data != null){
        allergyOrder = JSON.parse(JSON.stringify(this.props.cache_data));
        params.last_doctor_code = allergyOrder.doctor_code;
        params.last_doctor_name = allergyOrder.doctor_name;
        params.visit_place_id = allergyOrder.visit_place_id;
      }
    }
    if (this.state.allergy_type == 'current_symptoms_on_admission') {
      params['optional_json'] = this.state.optional_json;
    }
    if(this.state.cache_index != null){
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_EDIT,this.state.cache_index, JSON.stringify(params), 'insert');
    } else {
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_EDIT, new Date().getTime(), JSON.stringify(params), 'insert');
    }
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  };
  
  loadFromCache = (index) => {
    let cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_EDIT, index);
    if (this.props.cache_data != undefined && this.props.cache_data != null) cache_data = JSON.parse(JSON.stringify(this.props.cache_data));
    this.setTitle(cache_data.type);
    this.setState({
      number:cache_data.number,
      body_1: cache_data.body_1,
      body_2: cache_data.body_2,
      karte_status: cache_data.karte_status
    });
    if (cache_data.type == 'current_symptoms_on_admission') {
      this.setState({optional_json: cache_data.optional_json});
      this.init_state.optional_json = cache_data.optional_json;
    }
    this.init_state.body_1 = cache_data.body_1;
    this.init_state.body_2 = cache_data.body_2;
    if (this.props.isExistCache == false){
      karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.ALLERGY_EDIT, index);
      this.setState({cache_index:null});
    }
  };
  
  showList = () => {
    this.setState({show_list: 1}, ()=>{
      this.cancelModal();
    })
  };
  
  closeModal = () => {
    this.modalBlackBack();
    this.setState({
      openListModal: false,
    })
  };
  
  confirmOK = () => {
    let {confirm_action} = this.state;
    if (confirm_action == 'clear') {
      this.setState({
        body_1: '',
        body_2: '',
        isConfirmModal: false,
        confirm_message: '',
        confirm_action: '',
        confirm_title: '',
        optional_json: {tpha: 0, hbs_ag: 0, hcv_Ab: 0, hiv: 0}
      });
    } else if (confirm_action == "cancel") {
      this.props.closeModal(this.state.show_list, this.state.allergy_type);
    } else if (confirm_action == "register") {
      this.gotoKarte();
    }
  }
  
  clearContent = () => {
    let changed = false;
    if (this.state.body_1 != "" || this.state.body_2 != "") changed = true;
    if (!changed) {
      return;
    }
    this.setState({
      confirm_message: "入力内容を消去しますか？",
      confirm_title:'消去確認',
      isConfirmModal: true,
      confirm_action: "clear"
    });
    this.modalBlack();
  };
  
  cancelModal = () => {
    let changed = false;
    Object.keys(this.init_state).map(index=>{
      if (this.init_state[index] != this.state[index]) {
        changed = true;
      }
    });
    if (!changed) {
      this.props.closeModal(this.state.show_list, this.state.allergy_type);
      return;
    }
    this.setState({
      confirm_message: "登録していない内容があります。\n変更内容を破棄して移動しますか？",
      confirm_title: '入力中',
      isConfirmModal: true,
      confirm_action: "cancel"
    });
    this.modalBlack();
  };
  
  confirmCancel() {
    this.modalBlackBack();
    this.setState({
      isConfirmModal: false,
      confirm_message: "",
      confirm_action: '',
      confirm_title: '',
      show_list: null
    });
  }
  
  modalBlack() {
    var base_modal = document.getElementsByClassName("allergy-dlg");
    for (let i = 0; i < base_modal.length; i++) {
      base_modal[i].style["z-index"] = 1040;
    }
  }
  
  modalBlackBack() {
    var base_modal = document.getElementsByClassName("allergy-dlg");
    for (let i = 0; i < base_modal.length; i++) {
      base_modal[i].style["z-index"] = 1050;
    }
  }
  
  getValue = (key, e) => {
    let {optional_json} = this.state;
    optional_json[key] = e.target.id;
    this.setState({optional_json});
  }
  
  render() {
    const { body1_title, body_1, body_2, body2_title, allergy_type, modal_title, optional_json } = this.state;
    let clear_disable = body_1 == '' && body_2 == '';
    let save_tooltip = "";
    if (this.state.allergy_type === "past"){
      if (this.state.body_1 === "" && this.state.body_2 === "") {
        save_tooltip = '既往歴やアレルギーを入力してください。';
      }
    } else if (this.state.allergy_type === "infection" || this.state.allergy_type === "alergy") {
      if (this.state.body_2 === ""){
        save_tooltip = '状態を選択してください。';
      }
      if (this.state.body_1 === ""){
        save_tooltip = this.state.body1_title + 'を入力してください。';
      }
    } else {
      if (this.state.body_1 === "") {
        save_tooltip = this.state.body1_title + 'を入力してください。';
      }
    }
    return  (
      <Modal show={true} size="lg" className="allergy-dlg">
        <Modal.Header>
          <Modal.Title>{modal_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={`content w-100 ${allergy_type == 'current_symptoms_on_admission' ? 'special-content' : ''}`}>
              <div className="text-right pr-2 w-100">
                <Button type="common" onClick={this.showList} style={{cursor:"pointer"}}>一覧表示</Button>
              </div>
              <label className="w-auto ml-2 text-left" style={{fontSize:"1.125rem"}}>{body1_title}</label>
              <textarea
                onChange={this.setBody.bind(this)}
                value={this.state.body_1}
                className="w-100"
              />
              {(allergy_type === "past" || allergy_type === "process_hospital" || allergy_type === "inter_summary" || allergy_type == 'current_symptoms_on_admission') && (
                <>
                  <label className="w-auto ml-2 text-left" style={{fontSize:"1.125rem"}}>{body2_title}</label>
                  {allergy_type == 'current_symptoms_on_admission' && (
                    <div className='flex select-box'>
                      <SelectorWithLabel
                        title="TPHA"
                        options={this.sampleOptions}
                        getSelect={this.getValue.bind(this, "tpha")}
                        departmentEditCode={optional_json.tpha}
                      />
                      <SelectorWithLabel
                        title="HBs-Ag"
                        options={this.sampleOptions}
                        getSelect={this.getValue.bind(this, "hbs_ag")}
                        departmentEditCode={optional_json.hbs_ag}
                      />
                      <SelectorWithLabel
                        title="HCV-Ab"
                        options={this.sampleOptions}
                        getSelect={this.getValue.bind(this, "hcv_Ab")}
                        departmentEditCode={optional_json.hcv_Ab}
                      />
                      <SelectorWithLabel
                        title="HIV"
                        options={this.sampleOptions}
                        getSelect={this.getValue.bind(this, "hiv")}
                        departmentEditCode={optional_json.hiv}
                      />
                    </div>
                  )}
                  <textarea
                    onChange={this.setBody2.bind(this)}
                    value={this.state.body_2}
                    className="w-100"
                  />
                </>
              )}
              {(allergy_type === "infection" || allergy_type === "alergy") && (
                <>
                  <div>
                    <label className="w-auto ml-2 text-left" style={{fontSize:"1.125rem"}}>状態</label>
                  </div>
                  <div className="radio-group">
                    {Object.keys(ALLERGY_STATUS_ARRAY).map((index)=>{
                      return (
                        <>
                          <Radiobox
                            label={ALLERGY_STATUS_ARRAY[index]}
                            value={index}
                            getUsage={this.setSearchType.bind(this)}
                            checked={this.state.body_2 == index}
                            name={`body_2`}
                          />
                        </>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </Wrapper>
          {this.state.openListModal && (
            <AllergyListModal
              allergy_type={this.state.allergy_type}
              closeModal={this.closeModal}
              patientId={this.props.patientId}
            />
          )}
          {this.state.isConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOK.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title={this.state.confirm_title}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.cancelModal} id='allergy_cancel_id'>キャンセル</Button>
          <Button onClick={this.clearContent.bind(this)} tooltip={clear_disable ? "内容を入力してください" :""} className={clear_disable?"disable-btn":"cancel-btn"}>クリア</Button>
          {save_tooltip != "" ? (
            <Button className="disable-btn" tooltip={save_tooltip}>カルテに展開</Button>
          ):(
            <Button className="red-btn" onClick={this.saveData.bind(this)}>カルテに展開</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

AllergyModal.contextType = Context;

AllergyModal.propTypes = {
  closeModal: PropTypes.func,
  patientId: PropTypes.number,
  modalName: PropTypes.string,
  modal_data: PropTypes.object,
  history: PropTypes.object,
  cache_index:PropTypes.number,
  from_list:PropTypes.number,
  allergy_type:PropTypes.string,
  isExistCache:PropTypes.bool,
  cache_data: PropTypes.object
};

export default withRouter(AllergyModal);