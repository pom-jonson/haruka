import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioInlineButtonsList from "~/components/molecules/RadioInlineButtonsList"
import Button from "~/components/atoms/Button";
import axios from "axios";
import {makeList_code} from "~/helpers/dialConstants";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
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
  .label-title{
    font-size:18px;
  }
  .dialyser-list {
    border: solid 1px rgb(206,212,218);
    width:100%;
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
class DialSelectRegularExamMasterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_master_number:0,
      search_order: 1,        //表示順
      is_loaded: false,
    }
  }
  
  
  componentDidMount() {
    this.getExamData();
  }
  
  getExamData = async() => {
    await axios.post(
      "/app/api/v2/dial/master/search_examination",
      {
        params: {
          is_enabled:1,
          order:"sort_number"
        }
      }
    ).then((res) => {
      this.setState({
        examinationCodeData:res.data,
        MasterCodeData:res.data,
        examination_codes:makeList_code(res.data),
        is_loaded: true
      })
    })
  }
  
  selectMaster = (master, e) => {
    this.setState({selected_master_number:e.target.id});
    this.props.selectMaster(master);
  }
  
  getOrderSelect = e => {                 //表示順
    this.setState({ search_order: parseInt(e.target.id) }, () => {
      this.getExamData();
    });
  };
  
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
    
    const { closeModal } = this.props;
    return  (
      <Modal show={true} onHide={closeModal} id="add_contact_dlg"  className="master-modal dialyser-modal">
        <Modal.Header>
          <Modal.Title>{this.props.MasterName}選択</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{height: 500, maxHeight: `500px`, overflowY: `scroll` }}>
          <Wrapper>
            {this.state.is_loaded ? (
              <div className="dialyser-list">
                {Master_list}
              </div>
            ):(
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          { (this.props.clearItem != undefined && this.props.clearItem != null) && (
            // <div className={'btn-area'}>
            <Button className="cancel-btn" onClick={this.props.clearItem}>クリア</Button>
            // </div>
          )}
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DialSelectRegularExamMasterModal.contextType = Context;

DialSelectRegularExamMasterModal.propTypes = {
  closeModal: PropTypes.func,
  selectMaster: PropTypes.func,
  MasterName : PropTypes.string,
  clearItem: PropTypes.func,
};

export default DialSelectRegularExamMasterModal;
