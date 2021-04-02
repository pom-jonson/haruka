import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import RadioButton from "~/components/molecules/RadioInlineButton"
import InputWithLabel from "~/components/molecules/InputWithLabel";
import axios from "axios/index";
import * as methods from "~/components/templates/Dial/DialMethods";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 100%;
  float: left;
  label {
      text-align: right;
      width: 130px;
      font-size: 18px;
  }
  input {
    width: 419px;
    font-size: 18px;
  }
  
  .add-button {
      text-align: center;
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px 0 20px 0;
    pointer-events: none;
    input {
      font-size: 18px;
      width: 135px;
    }
  }
  .footer {
    display: flex;    
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      margin-right: 30px;
    }
    
    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
}
  .patient-list {
    background: white;
    margin-top: 15px;
    height: 300px;
    overflow-y: auto;
    width: 100%;
    border: solid 1px rgb(206,212,218);
    .radio-btn {
        label{
          font-size: 14px;
        }
      }
  }
 `;

class InspectionPatternItemModal extends Component {
  constructor(props) {
    super(props);
      Object.entries(methods).forEach(([name, fn]) =>
          name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
      );
    this.state = {
      patternCode: this.props.patternCode,

    }
  }
    async componentDidMount() {
        let { data } = await axios.post(
            "/app/api/v2/dial/master/inspection_search",
            {
                params: {
                    // category: category
                    order:'name_kana'
                }
            }
        );
        this.setState({
            inspection_item_list: data,
            isLoaded: 1
        });
    }

       
    register = () => {
      if (this.props.patternCode === "" || this.state.itemCode === "" || this.state.item_number == undefined || this.state.item_number == null || this.state.item_number === "") {
         window.sessionStorage.setItem("alert_messages", "項目を選択してください。");
      } else {
        this.registerExamPatternItem(this.state, "item");
        this.props.handleOk(this.state.patternCode);
      }
    };

    getItem = (e) => {
      this.setState({
          item_number: parseInt(e.target.id),
          itemCode: this.state.inspection_item_list[parseInt(e.target.id)].code
      })
    };

    onHide=()=>{}

    closeModal=()=>{
        this.props.closeModal();
    };

  render() {
    const { closeModal } = this.props;
      const inspection_item_list = [];
      if (this.state.isLoaded){
          this.state.inspection_item_list.map((item, index) => {
              inspection_item_list.push(
                  <RadioButton
                      key={index}
                      id={index}
                      label={item.name}
                      getUsage={this.getItem.bind(this)}
                      checked={index === this.state.item_number}
                  />
              );
          });
      }
    return  (
      <Modal show={true} onHide={this.onHide}  className="master-modal inspection-pattern-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>検査項目マスタ選択パネル</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Wrapper>
                <div className="pattern_code">
                    <InputWithLabel
                        label="パターンコード"
                        type="text"
                        diseaseEditData={this.props.patternCode}
                    />
                </div>
                <div className="patient-list">
                    {inspection_item_list}
                </div>
                <div className="footer-buttons mt-3">
                  <Button className="cancel-btn" onClick={closeModal}>キャンセル</Button>
                  <Button className="red-btn" onClick={this.register}>登録</Button>
                </div>
            </Wrapper>
        </Modal.Body>        
      </Modal>
    );
  }
}

InspectionPatternItemModal.contextType = Context;

InspectionPatternItemModal.propTypes = {
  patternCode: PropTypes.string,
  closeModal: PropTypes.func,
  handleOk : PropTypes.func,
};

export default InspectionPatternItemModal;
