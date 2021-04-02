import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Button from "~/components/atoms/Button";
import SelectMedicineModal from "./SelectMedicineModal"
import DiseaseNameModal from "~/components/templates/Patient/Modals/Disease/DiseaseNameModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const DepartOneWrapper = styled.div`
  float:left;
  width: calc(26vw);
  fieldset{
    border: 1px solid #aaa;
  }
  legend{
    width: 10rem;
    margin-left: 20px;
    padding-left: 10px;
    font-size: 1.2rem;
  }
  .content-list{
    border:none;
    margin-top: 5px;
  }
  .field-1{
    .div-textarea{
      margin-left: 10px;
      margin-top: 0.4rem;
      margin-bottom: 0.4rem;
      overflow: hidden;
      .txt-area-1{
        margin:0;
        float: left;
        width: calc(100% - 50px);
        height: 5rem;
      }
    }
    .clear-button{
        min-width: 2rem;
        width: 2rem;
        height: 2rem;
        padding: 0rem;
        padding-top: 0.15rem;
        margin-left: 0.25rem;
        text-align: center;
        // line-height:2rem;
        span {
          font-size:1rem;
          letter-spacing:0;
          display:inline;
        }
    }
  }
  .field-2{
    height: 7rem;
    legend{
      width: 22rem;
      font-size: 1.2rem;
    }
    .div-textarea{
      margin: 0px;
      textarea {
        width: 95%;
        height:3.5rem;
        margin-left:2%;
      }
    }
  }
  .field-3{
    legend{
      font-size: 1.2rem;
      width: 6.5rem;
    }
    .div-textarea{
      margin: 0px;
      textarea {
        width: 95%;
        height:3.5rem;
        margin-left:2%;
      }
    }
  }
  button {
    margin-left: 10px;
    span{
      font-size: 1rem;
    }
  }
`;

class RegionBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMedicineModal:false,
      isAddDiseaseNameModal:false,
      isClearConfirmModal:false,
    }
  }
  
  showMedicineModal = () => {
    this.setState({isShowMedicineModal:true});
  }
  
  closeModal = () => {
    this.setState({
      isShowMedicineModal:false,
      isAddDiseaseNameModal:false,
    });
  }
  
  getEtcComment = (e) => {
    this.props.getEtcComment(e.target.value);
  }
  
  getSickName = (e) => {
    this.props.getSickName(e.target.value);
  }
  
  selectDiseaseName = (disease_name) => {
    if(this.props.sick_name !== '' && this.props.sick_name != undefined){
      this.props.getSickName(this.props.sick_name + "\n" + disease_name);
    } else {
      this.props.getSickName(disease_name);
    }
  }
  
  getSpecialPresentation = (e) => {
    this.props.getSpecialPresentation(e.target.value);
  }
  
  clearSickName = () => {
    if (this.props.sick_name == undefined || this.props.sick_name == null || this.props.sick_name == '') return;
    this.setState({
      isClearConfirmModal:true,
      confirm_message:'臨床診断、病名を削除しますか？',
      deleteTarget:'sick_name',
    });
  }
  confirmCancel() {
    this.setState({
      isClearConfirmModal: false,
      confirm_message: "",
    });
  }
  clearComment = () => {
    this.confirmCancel();
    this.props.getSickName('');
  };
  
  showAddDiseaseNameModal = () => {
    this.setState({isAddDiseaseNameModal:true});
  }
  
  render() {
    return (
      <>
        <DepartOneWrapper>
          <div className="content-list">
            <fieldset className="field-1">
              <legend>臨床診断、病名</legend>
              <Button type="common" onClick={this.showMedicineModal.bind(this)}>臨床診断</Button>
              <Button type="common" onClick={this.showAddDiseaseNameModal.bind(this)}>病名新規登録</Button>
              <div className="div-textarea">
                <textarea id='sick_name_id' className="txt-area-1"  onChange={this.getSickName.bind(this)} value={this.props.sick_name}></textarea>
                <Button type="mono" className="clear-button" onClick={this.clearSickName.bind(this)}>C</Button>
              </div>
            </fieldset>
            
            <fieldset className="field-2">
              <legend>主訴、臨床経過、検査目的、コメント</legend>
              <div className="div-textarea">
                <textarea id = 'etc_comment_id' onChange={this.getEtcComment.bind(this)} value={this.props.etc_comment}></textarea>
              </div>
            </fieldset>
            
            {this.props.inspection_id === 17 && (
              <fieldset className="field-2 field-3">
                <legend>特殊指示</legend>
                <div className="div-textarea">
                  <textarea id = 'special_presentation_id' onChange={this.getSpecialPresentation.bind(this)} value={this.props.special_presentation}></textarea>
                </div>
              </fieldset>
            )}
          </div>
          {this.state.isShowMedicineModal && (
            <SelectMedicineModal
              closeModal = {this.closeModal}
              system_patient_id={this.props.system_patient_id}
              selectDiseaseName={this.selectDiseaseName}
            />
          )}
          {this.state.isClearConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.clearComment.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isAddDiseaseNameModal && (
            <DiseaseNameModal
              closeModal = {this.closeModal}
              patientId={this.props.system_patient_id}
            />
          )}
        </DepartOneWrapper>
      </>
    );
  }
}

RegionBottom.propTypes = {
  etc_comment: PropTypes.string,
  getEtcComment: PropTypes.func,
  sick_name: PropTypes.string,
  getSickName: PropTypes.func,
  special_presentation: PropTypes.string,
  getSpecialPresentation: PropTypes.func,
  inspection_id: PropTypes.number,
  system_patient_id: PropTypes.number,
};

export default RegionBottom;
