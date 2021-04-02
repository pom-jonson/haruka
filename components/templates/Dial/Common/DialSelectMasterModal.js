import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioInlineButtonsList from "~/components/molecules/RadioInlineButtonsList"
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`  
  display: block;
  font-size: 16px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  text-align: center;
  .radio-btn{
    label{
      font-size:18px;
      text-align: left;
      padding-left: 4px;
      padding-top: 2px;
    }
  }
  .dialyser-list {
    border: solid 1px rgb(206,212,218);
    width:100%;
    height: 100%;
    overflow-y:auto;
    .radio-btn:hover{
      background-color: #e6f7ff;
    }
    input:hover + label {
      background-color: #e6f7ff;
    }
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
`;

class DialSelectMasterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selected_master_number:0,
        MasterCodeData:this.props.MasterCodeData,
    }
  }

  selectMaster = (master, e) => {
    this.setState({selected_master_number:e.target.id});
    this.props.selectMaster(master);
  }

  componentDidMount () {
    if (this.props.MasterName == "医師") {
      let {MasterCodeData}=this.props;
      MasterCodeData = MasterCodeData.filter(x=>x.is_enabled == 1);
      this.setState({MasterCodeData});
    }
    document.getElementById("cancel_id").focus();
  }

  onHide = () => {}

  render() {
    const {MasterCodeData} = this.state;
    let Master_list = [];
    if (MasterCodeData !== undefined && MasterCodeData !== null){
        MasterCodeData.map((item, index) => {
          Master_list.push(
            <RadioInlineButtonsList
                key={index}
                id={item.number}
                label={item.name}
                getUsage={this.selectMaster.bind(this, item)}
                checked={item.number === this.state.selected_master_number}
            />
            );
        })
    }

    return  (
        <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal dialyser-modal">
          <Modal.Header>
            <Modal.Title>{this.props.MasterName}選択</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{height:"500px", overflow:"hidden"}}>
            <Wrapper>
              <div className="dialyser-list">
                {Master_list}
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <div
              onClick={this.props.closeModal}
              className={"custom-modal-btn cancel-btn"}
              style={{cursor:"pointer"}}
              id='cancel_id'
            >
              <span>キャンセル</span>
            </div>
            {(this.props.clearItem != undefined && this.props.clearItem != null) && (
              <Button className="cancel-btn" onClick={this.props.clearItem}>クリア</Button>
            )}
          </Modal.Footer>
        </Modal>
    );
  }
}

DialSelectMasterModal.contextType = Context;

DialSelectMasterModal.propTypes = {
  closeModal: PropTypes.func,
  selectMaster: PropTypes.func,
  MasterCodeData:PropTypes.array,
  MasterName : PropTypes.string,
  clearItem: PropTypes.func,
};

export default DialSelectMasterModal;
