import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import InputWithLabel from "~/components/molecules/InputWithLabel";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 100%;
  float: left;
  label {
      text-align: right;
      width: 80px;
  }
  input {
    width: 400px;
    font-size: 16px;
  }
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 16px;
    width: 120px;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    padding-left: 15px;
  }
  .medicine_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    margin-left: -20px;
    input {
      font-size: 16px;
      width: 155px;
    }
    label {
      width: 120px;
      font-size: 15px;
    }
    .husei-code label {
      width: 100px;
      margin-left: 10px;
    }
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      height: 38px;
      margin-top: 8px;
      margin-left: 10px;
    }
    span {
      color: white;
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }
  .gender {
    font-size: 16px;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 8px;
      float: left;
  }
    .radio-btn label{
        width: 100px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
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
      font-size: 16px;
      font-weight: 100;
    }
}
 `;

class AddressModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {            
      is_enabled: modal_data !== null?modal_data.is_enabled:1,
      number: modal_data !== null ? modal_data.number : 0,
      zip_code: modal_data !== null?modal_data.zip_code:"",
      prefecture: modal_data !== null?modal_data.prefecture:"",
      city:modal_data !== null?modal_data.city:"",
      address:modal_data !== null?modal_data.address:"",      
    }
  }

    
    
    getCityName = e => {
        this.setState({city: e.target.value})
    };
    getAddressName = e => {
        this.setState({address: e.target.value})
    };
    
    async registerAddress()  {
      let path = "/app/api/v2/dial/master/zipcode_register";
      const post_data = {
          params: this.state
      };              
      await apiClient.post(path, post_data);
    }

    handleOk = () => {
        this.registerAddress().then(() => {
            this.props.handleOk();
        });
    };

    onHide=()=>{}

  render() {    
    return  (
      <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal">
        <Modal.Header>
          <Modal.Title>編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Wrapper>                                
                <InputWithLabel
                    label="郵便番号"
                    type="text"
                    isDisabled={true}
                    // getInputText={this.getMedicineCode.bind(this)}
                    diseaseEditData={this.state.zip_code}
                />                                        
                
                <InputWithLabel
                    label="都道府県"
                    type="text"
                    className="name-area"
                    isDisabled={true}
                    diseaseEditData={this.state.prefecture}
                />
                <InputWithLabel
                    label="市町村"
                    type="text"
                    className="name-area"
                    getInputText={this.getCityName.bind(this)}
                    diseaseEditData={this.state.city}
                />
                <InputWithLabel
                    label="番地"
                    type="text"
                    className="kana_area"
                    getInputText={this.getAddressName.bind(this)}
                    diseaseEditData={this.state.address}
                />
                
                <div className="footer-buttons">
                    <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                    <Button className="red-btn" onClick={this.handleOk}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
                </div>
            </Wrapper>
        </Modal.Body>        
      </Modal>
    );
  }
}

AddressModal.contextType = Context;

AddressModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk:   PropTypes.func,  
  modal_data:PropTypes.object
};

export default AddressModal;
