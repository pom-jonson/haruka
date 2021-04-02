import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioInlineButtonsList from "~/components/molecules/RadioInlineButtonsList";
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
  display: block;
  font-size: 16px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  text-align: center;
  .selected {
    label {
      background: #ddd;
    }
  }
  .radio-btn {
    label {
      font-size: 18px;
    }
  }
  .dialyser-list {
    border: solid 1px rgb(206, 212, 218);
    width: 100%;
    height: 410px;
    overflow-y: auto;
  }
  .btn-area {
    margin: auto;
    button {
      margin-top: 10px;
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
    }
    span {
      color: white;
      font-size: 0.8rem;
      font-weight: 100;
    }
  }

  .footer {
    display: flex;
    margin: 0 auto;
    width: 190px;
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 10px !important;
    }

    span {
      color: white;
      font-size: 16px;
      font-weight: 100;
    }
  }
`;

class DialSelectPunctureModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_master_number:
        props.selectPuncture != null &&
        props.selectPuncture != undefined &&
        props.selectPuncture > 0
          ? props.selectPuncture
          : 0,
      MasterCodeData: this.props.MasterCodeData,
    };
  }

  selectMaster = (master, e) => {
    this.setState({ selected_master_number: e.target.id });
  };

  registerPuncture = () => {
    this.props.registerPuncture(this.state.selected_master_number);
  };

  onHide = () => {};

  render() {
    const { MasterCodeData } = this.state;
    let Master_list = [];
    if (MasterCodeData !== undefined && MasterCodeData !== null) {
      MasterCodeData.map((item, index) => {
        Master_list.push(
          <div
            className={
              item.number == this.state.selected_master_number ? "selected" : ""
            }
          >
            <RadioInlineButtonsList
              key={index}
              id={item.number}
              label={item.name}
              getUsage={this.selectMaster.bind(this, item)}
              checked={item.number === this.state.selected_master_number}
            />
          </div>
        );
      });
    }

    const { closeModal } = this.props;
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal dialyser-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.MasterName}選択</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: `500px` }}>
          <Wrapper>
            <div className="dialyser-list">{Master_list}</div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={closeModal}>キャンセル</Button>
          {this.props.clearItem != undefined && this.props.clearItem != null && (
              <Button className="cancel-btn" onClick={this.props.clearItem}>
                クリア
              </Button>
          )}
            <Button className="red-btn" onClick={this.registerPuncture}>登録</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DialSelectPunctureModal.contextType = Context;

DialSelectPunctureModal.propTypes = {
  closeModal: PropTypes.func,
  selectMaster: PropTypes.func,
  MasterCodeData: PropTypes.array,
  MasterName: PropTypes.string,
  clearItem: PropTypes.func,
  selectPuncture: PropTypes.number,
  registerPuncture: PropTypes.func,
};

export default DialSelectPunctureModal;
