import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
// import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import SelectMedicineModal from "../Common/SelectMedicineModal"


const DepartOneWrapper = styled.div`
  height: 35vh;
  float:left;
  width: calc(26vw);
  fieldset{
    border: 1px solid #aaa;
  }
  legend{
    width: 160px;
    margin-left: 20px;
    padding-left: 10px;
    font-size: 20px;
  }

  .content-list{
    border:none;
    margin-top: 5px;
  }

  .field-1{    
    .div-textarea{
      margin-left: 10px;
      margin-top: 10px;
      margin-bottom: 10px;
      overflow: hidden;
      .txt-area-1{
        margin:0;
        float: left;
        width: calc(100% - 50px);      
        height: 110px !important;
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
    legend{
      width: 325px;
      font-size: 18px;
    }

    textarea{
      height: 110px !important;
      width: 98%;
      margin-left: 1%;
    }
  }
  

  button {
    margin-left: 10px;
    span{
      font-size: 16px;
    }

  }
`;

class RegionBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      patient_id: props.patient_id,
      isShowMedicineModal:false,
      dataList: []
    }
  }

  showMedicineModal = () => {
    this.setState({isShowMedicineModal:true});
  }

  closeModal = () => {
    this.setState({
      isShowMedicineModal:false
    });
  }

  render() {
    return (
      <>
        <DepartOneWrapper>
          <div className="content-list">
              <fieldset className="field-1">
                <legend>臨床診断、病名</legend>
                <Button onClick={this.showMedicineModal.bind(this)}>臨床診断</Button>
                <Button>病名新規登録</Button>
                <div className="div-textarea">
                  <textarea className="txt-area-1"
                  />
                  <Button className="clear-button">C</Button>
                </div>
             </fieldset>

             <fieldset className="field-2">
                <legend>主訴、臨床経過、検査目的、コメント</legend>
                <textarea
                />
             </fieldset>
          </div>
          {this.state.isShowMedicineModal && (
            <SelectMedicineModal
              closeModal = {this.closeModal}
            />
          )}
        </DepartOneWrapper>
      </>
    );
  }
}

RegionBottom.propTypes = {
  patient_id: PropTypes.number,
  type: PropTypes.string,
};

export default RegionBottom;
