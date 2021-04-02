import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
import Button from "../atoms/Button";
import { KEY_CODES } from "../../helpers/constants";
import MedicineDetailModal from "../organisms/MedicineDetailModal";
const DoubleModal = styled.div`
  font-family: NotoSansJP;
  font-size: 20px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
  p{
    margin-bottom: 5px !important;
  }
  max-height: 70vh;
  overflow-y: auto;
`;

class DiagnosisModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this);    
    let rpIdx = 0;
    let medIdx = 0;
    Object.keys(this.props.diagnosisData).map(key=>{
      rpIdx = parseInt(key);
      medIdx = this.props.diagnosisData[key][0];
    });

    this.state = {
      curFocus: 1,
      rpIdx: rpIdx,
      medIdx: medIdx,
      usageMedDetailModal: false
    }
    this.btns = [];  
    this.flag = 1;
    this.medicine = this.props.presData[this.state.rpIdx].medicines[this.state.medIdx];
    if(this.medicine.diagnosis_permission == -1) {
      this.btns = ["diagnosis_btn_Detail","diagnosis_btn_Cancel","diagnosis_btn_Ok"];
      this.content = "RP" + (this.state.rpIdx + 1) + "の用法の区分は「"+this.props.presData[this.state.rpIdx].usage_category_name +"」ですが、\n"
        + "「" + this.medicine.medicineName + "」を処方してもよろしいですか？";

    } else {
      this.btns = ["diagnosis_btn_Detail","diagnosis_btn_Ok"];
      this.content = "「" + this.medicine.medicineName + "」が\n区分「"+this.props.presData[this.state.rpIdx].usage_category_name +"」の用法に登録されています。";
    }

  }

  async componentDidMount() {
    if (
      document.getElementById("usage_alert_dlg") !== undefined &&
      document.getElementById("usage_alert_dlg") !== null
    ) {
      document.getElementById("usage_alert_dlg").focus();
    } 

    // let modal_container = document.getElementsByClassName("usage-alert-modal")[0];    
    // if(modal_container !== undefined && modal_container != null){
    //     let modal_content = document.getElementsByClassName("modal-content")[0];
    //     if (modal_content !== undefined && modal_content != null) {
    //       let margin_top = parseInt((modal_container.offsetHeight - modal_content.offsetHeight) / 2);
    //       modal_container.style['margin-top'] = margin_top.toString()+"px";          
    //     }
    // }   
  }

  //
  handleDetail = ()=> {
    if(this.medicine.exists_detail_information === 1) {
      this.setState({
        usageMedDetailModal: true,
      }); 
    }
  }
  handleUsageMedDetailOK = () => {
    this.setState({
      usageMedDetailModal: false,
    }); 
  }

  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {      
      let fnum = this.flag; 
      if(e.keyCode === KEY_CODES.left){
        fnum = (this.flag - 1 + this.btns.length) % this.btns.length; 
      }else{
        fnum = (this.flag + 1) % this.btns.length; 
      }      

      this.setState({curFocus : fnum});
      this.flag = fnum;   
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if(this.medicine.diagnosis_permission == -1) {
        if (this.flag === 0) {
          this.props.handleDetail();
        }else if(this.flag === 1){
          this.props.handleCancel();
        }else{
          this.props.handleOk();
        }   
      } else {
        if (this.flag === 0) {
          this.props.handleDetail();
        } else{
          this.props.handleOk();
        }   
      }
    }
  }


  render() { 
    return (
      <Modal
        show={true}       
        id="usage_alert_dlg"
        // onHide={this.props.hideModal}
        // className = "usage-alert-modal"
        className = "alert-modal"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >

        <Modal.Body>
          <div className="auto-logout">  
              <DoubleModal>
              <div>              
                {this.content.replace(/[\n\r]+/g, '\\n').split("\\n").map((item, key) => {
                  return (
                    <>
                    {item == "" ? (<br />) : (<p key={key}>{item}</p>) }
                    </>
                  )
                })}
              </div>
              </DoubleModal>
              {this.state.usageMedDetailModal && this.medicine.exists_detail_information === 1 && (
                <MedicineDetailModal
                  hideModal={this.handleUsageMedDetailOK}
                  handleCancel={this.handleUsageMedDetailOK}
                  medicineDetailList={[this.medicine.medDetail]}
                />
              )}             
          </div>
        </Modal.Body>        
        <Modal.Footer>
          {this.medicine.diagnosis_permission == -1 ? (
            <>
            <Button className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} id="diagnosis_btn_Cancel" onClick={this.props.handleCancel}>キャンセル</Button>
            <Button className={`btnDetail ${this.state.curFocus === 0?" focus": ""}  ${this.medicine.exists_detail_information === 1 ? "red-btn" : "disable-btn"}`} id="diagnosis_btn_Detail" onClick={this.handleDetail.bind(this)} tooltip={this.medicine.exists_detail_information === 1? "" : "詳細情報未登録"}>詳細を見る</Button>
            <Button className={this.state.curFocus === 2?"red-btn focus": "red-btn"} id="diagnosis_btn_Ok" onClick={this.props.handleOk}>OK</Button>
            </>
          ) : (
            <>
            <Button className={`btnDetail ${this.state.curFocus === 0?" focus": ""} ${this.medicine.exists_detail_information === 1 ? "red-btn" : "disable-btn"}`} tooltip={this.medicine.exists_detail_information === 1? "" : "詳細情報未登録"} id="diagnosis_btn_Detail" onClick={this.handleDetail.bind(this)}>詳細を見る</Button>
            <Button className={this.state.curFocus === 1?"red-btn focus": "red-btn"} id="diagnosis_btn_Ok" onClick={this.props.handleOk}>OK</Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

DiagnosisModal.propTypes = {  
  hideModal: PropTypes.func,
  diagnosisData : PropTypes.object,
  presData : PropTypes.array,
  handleCancel : PropTypes.func,
  handleOk : PropTypes.func,
  handleDetail : PropTypes.func,
  type: PropTypes.string,
};

export default DiagnosisModal;
