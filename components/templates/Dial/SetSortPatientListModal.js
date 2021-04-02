import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import RadioButton from "~/components/molecules/RadioInlineButton";

const Wrapper = styled.div`
    width: 100%;
    .select-sort-type {
      display:table;
      width: 100%;
      .radio-btn{
        display:table-cell;
        text-align:center;
      }
      label {
        width: 6rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        padding: 0;
        font-size: 1.3rem;
        text-align: center;
        margin: 0;
        height: 2.5rem;
        line-height: 2.5rem;
      }
    }
`;

class SetSortPatientListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort_type:props.sort_type,
    };
    this.change_flag = 0;
  }

  setSortType = (e) => {
    this.change_flag = 1;
    this.setState({sort_type: e.target.value});
  };

  confrimOk=()=>{
    this.props.handleOk(this.state.sort_type);
  };

  render() {
    return  (
      <Modal show={true} id="add_contact_dlg"  className="master-modal set-sort-patient-list-modal">
        <Modal.Header><Modal.Title>並び替え</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={'select-sort-type'}>
              <RadioButton
                id={'kana_name'}
                value={'kana_name'}
                label={'カナ'}
                name="sort_type"
                getUsage={this.setSortType}
                checked={this.state.sort_type === "kana_name"}
              />
              <RadioButton
                id={'patient_number'}
                value={'patient_number'}
                label={'ID'}
                name="sort_type"
                getUsage={this.setSortType}
                checked={this.state.sort_type === "patient_number"}
              />
              <RadioButton
                id={'dial_group'}
                value={'dial_group'}
                label={'グループ'}
                name="sort_type"
                getUsage={this.setSortType}
                checked={this.state.sort_type === "dial_group"}
              />
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          {/* <Button className={this.change_flag == 1 ? "red-btn" : "disable-btn"} onClick={this.confrimOk}>{"設定"}</Button> */}
          <Button className={"red-btn"} onClick={this.confrimOk}>{"設定"}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SetSortPatientListModal.contextType = Context;

SetSortPatientListModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  sort_type: PropTypes.string,
};

export default SetSortPatientListModal;
