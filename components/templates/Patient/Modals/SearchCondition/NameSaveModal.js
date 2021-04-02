import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Button from "~/components/atoms/Button";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import Context from "~/helpers/configureStore";
import styled from "styled-components";

const Wrapper = styled.div`
  display: block;
  .label-title {
    font-size: 14px;
    width: 100px;
  }
`;

class NameSaveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      save_name: props.save_name !== undefined && props.save_name != null ? props.save_name: "",
        errMsg: "",
    }
  }

  saveName = () =>{
      if(this.state.save_name == ""){
          this.setState({errMsg:"検索条件名を入力してください。"});
          return;
      }
      this.props.saveName(this.state.save_name);
  };

  setValue = (e) =>{
      this.setState({save_name:e.target.value});
  };

  render() {  

    return  (
      <Modal show={true} className="custom-modal-sm name-save-modal">
        <Modal.Header>
          <Modal.Title>検索条件保存</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
              <InputWithLabel
                  label="検索条件名"
                  type="text"
                  getInputText={this.setValue.bind(this)}
                  diseaseEditData={this.state.save_name}
              />
              {this.state.errMsg && (
                  <div className="mt-3 ml-auto mr-auto warning">
                      <div className="alert alert-danger" role="alert">
                          {this.state.errMsg}
                      </div>
                  </div>
              )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          <Button className="red-btn" onClick={this.saveName}>保存</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

NameSaveModal.contextType = Context;

NameSaveModal.propTypes = {
  closeModal: PropTypes.func,
  saveName: PropTypes.func,
    save_name: PropTypes.name,
};

export default NameSaveModal;