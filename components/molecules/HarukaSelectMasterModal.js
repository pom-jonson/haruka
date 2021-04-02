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
    display: block;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    label{
      font-size:18px;
      margin:0;
    }
  }
  .radio-btn:hover {
    background:lightblue !important;
  }
  .dialyser-list {
    border: solid 1px rgb(206,212,218);
    width:100%;
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

class HarukaSelectMasterModal extends Component {
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
  };

  render() {
    const {MasterCodeData} = this.state;
    let Master_list = [];
    if (MasterCodeData !== undefined && MasterCodeData !== null){
      MasterCodeData.map((item, index) => {
        if(item.name !== undefined){
          Master_list.push(
            <RadioInlineButtonsList
                key={index}
                id={item.number}
                label={item.name}
                getUsage={this.selectMaster.bind(this, item)}
                checked={item.number === this.state.selected_master_number}
            />   
          );
        }
      })
    }
    return  (
        <Modal show={true} id="add_contact_dlg"  className="material-modal">
          <Modal.Header>
            <Modal.Title>{this.props.MasterName}選択</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: `500px`, overflowY: `auto` }}>
            <Wrapper>                            
              <div className="dialyser-list">
                {Master_list}
              </div>
                { (this.props.clearItem != undefined && this.props.clearItem != null) && (
                    <div className={'btn-area'}>
                        <Button type="mono" onClick={this.props.clearItem}>クリア</Button>
                    </div>
                )
                }
            </Wrapper>
          </Modal.Body>
            <Modal.Footer><Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button></Modal.Footer>
        </Modal>
    );
  }
}

HarukaSelectMasterModal.contextType = Context;

HarukaSelectMasterModal.propTypes = {  
  closeModal: PropTypes.func,
  selectMaster: PropTypes.func,
  MasterCodeData:PropTypes.array,
  MasterName : PropTypes.string,
  clearItem: PropTypes.func,
};

export default HarukaSelectMasterModal;
