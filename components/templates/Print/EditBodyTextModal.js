import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  .flex {
    display: flex;
  }
  textarea {
    width: 100%;
    height: calc(100% - 15px);
  }
`;

const Footer = styled.div`
  display:flex;
  span{
    color: white;
    font-size: 16px;
  }
  button{
    float: right;
    padding: 5px;
    font-size: 16px;
    margin-right: 16px;
  }
`;

export class EditBodyTextModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert_messages: "",
      confirm_message: "",
      body: props.modal_data.body,
      isOpenConfirmModal: false,
      change_flag: 0,
    };
  }

  async componentDidMount() {
    this.setChangeFlag(0);
  }
  
  componentWillUnmount() {
    sessApi.delObjectValue('dial_change_flag', 'edit_body_text');
  }

  setChangeFlag=(change_flag)=>{      
      this.setState({change_flag});
      if (change_flag){
          sessApi.setObjectValue('dial_change_flag', 'edit_body_text', 1)
      } else {
          sessApi.remove('dial_change_flag');
      }
  };

  hideModal = () => {};

  confirmSave = () => {
    let base_modal = document.getElementsByClassName("edit-body-text-modal")[0];
    if (base_modal !== undefined && base_modal != null) {
      base_modal.style["z-index"] = 1040;
    }
    if (this.state.body === "") {
      this.setState({ alert_messages: "本文を入力してください。" });
      return;
    }
    this.setState({ confirm_message: "登録しますか？" });
  };

  confirmCancel = () => {
    let base_modal = document.getElementsByClassName("edit-body-text-modal")[0];
    if (base_modal !== undefined && base_modal != null) {
      base_modal.style["z-index"] = 1050;
    }
    this.setState({
      confirm_message: "",
      isOpenConfirmModal: false,
      alert_messages: "",
    });
  };

  setBody = (e) => {
    this.setChangeFlag(1);
    this.setState({ body: e.target.value });
  };

  register = async () => {
    let path = "/app/api/v2/dial/master/edit_regular_text";
    let post_data = {
      number: this.props.modal_data.number,
      body: this.state.body,
    };
    await apiClient
      .post(path, {
        params: post_data,
      })
      .then((res) => {
        if (res.alert_message === undefined) {
          this.setState({
            confirm_message: "",
            alert_messages: res.error_message,
          });
        } else {
          this.props.handleOk(res.body);
        }
      })
      .catch(() => {});
  };

  handleClose = () => {
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        confirm_message: "登録していない内容があります。変更内容を破棄して閉じますか？"
      });
      return;
    }

    this.props.closeModal();
  }

  confirmCloseOk = () => {
    this.setState({
      isOpenConfirmModal: false,
      confirm_message: ""
    },()=>{
      this.props.closeModal();
    });
  }

  render() {
    return (
      <Modal
        show={true}
        onHide={this.hideModal}
        tabIndex="0"
        id="prescription_dlg"
        className="custom-modal-sm patient-exam-modal edit-body-text-modal master-modal"
      >
        <Modal.Body>
          <Wrapper>
            <textarea
              onChange={this.setBody.bind(this)}
              value={this.state.body}
            ></textarea>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Footer>
              <Button className={'cancel-btn'} onClick={this.handleClose}>キャンセル</Button>
              <Button className={this.state.change_flag == 0 ? "disable-btn": "red-btn"} onClick={this.confirmSave}>確定</Button>
          </Footer>
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <SystemConfirmModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.register.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isOpenConfirmModal !== false &&  (
            <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmCloseOk}
                confirmTitle= {this.state.confirm_message}
            />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal={this.confirmCancel.bind(this)}
            handleOk={this.confirmCancel.bind(this)}
            showMedicineContent={this.state.alert_messages}
          />
        )}
      </Modal>
    );
  }
}

EditBodyTextModal.contextType = Context;

EditBodyTextModal.propTypes = {
  handleOk: PropTypes.func,
  closeModal: PropTypes.func,
  modal_data: PropTypes.array,
};

export default EditBodyTextModal;
