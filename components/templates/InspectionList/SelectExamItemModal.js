import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioInlineButtonsList from "~/components/molecules/RadioInlineButtonsList"
import Button from "~/components/atoms/Button";
// import Checkbox from "~/components/molecules/Checkbox";

const Wrapper = styled.div`  
  display: block;
  font-size: 16px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  text-align: center;
  .radio-btn{
    width: 100%;
    label{
      text-align: left;
      font-size:18px;
    }
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

class SelectExamItemModal extends Component {
  constructor(props) {
    super(props); 
    this.state = { 
        selected_master_number:0,
        MasterCodeData:this.props.MasterCodeData,   
    }
  }
  componentDidMount () {
      if (this.props.self_exam === undefined || this.props.self_exam !== true) return;
      let {MasterCodeData} = this.state;
      MasterCodeData.map(item=>{
          item.check_state=0;
      });
      this.setState({MasterCodeData})
  }
  
  selectMaster = (master, e) => {
    this.setState({
        selected_master_number:e.target.id,
        selected_master: master,
    });
      // if (this.props.self_exam !== undefined && this.props.self_exam) {
      //     let {MasterCodeData} = this.state;
      //     MasterCodeData[e.target.key].check_state=1;
      //     this.setState({MasterCodeData});
      // }
  };

    setCheckValue = (index,name,value) => {
        if (name=="urgent"){
        let {MasterCodeData} = this.state;
        MasterCodeData[index].check_state=value;
        this.setState({MasterCodeData});
        }
    };

    handleOk = () =>{
        if (this.state.selected_master === undefined || this.state.selected_master == null) {
            window.sessionStorage.setItem("alert_messages","項目を選択してください。");
            return;
        }
        this.props.selectMaster(this.state.selected_master);
    };

  render() {
    const {MasterCodeData} = this.state;
    return  (
        <Modal show={true} id="add_contact_dlg"  className="material-modal">
          <Modal.Header>
            <Modal.Title>{this.props.MasterName}選択</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: `500px`, overflowY: `auto` }}>
            <Wrapper>                            
              <div className="dialyser-list">
                {MasterCodeData !== undefined && MasterCodeData !== null && MasterCodeData.map((item, index) => {
                    return (
                        <div className={`d-flex ml-1`} style={{background:item.number == this.state.selected_master_number?"lightblue":"white"}} key={item} onClick={this.selectMaster.bind(this,item)}>
                            {/* {this.props.self_exam !== undefined && this.props.self_exam && (
                                <Checkbox
                                    label=""
                                    getRadio={this.setCheckValue.bind(this,index)}
                                    value={item.check_state}
                                    name="urgent"
                                />
                            )} */}
                            <RadioInlineButtonsList
                                key={index}
                                id={item.number}
                                label={item.name}
                                getUsage={this.selectMaster.bind(this, item)}
                                checked={item.number === this.state.selected_master_number}
                            />
                        </div>
                    );
                })}
              </div>
            </Wrapper>
          </Modal.Body>
            <Modal.Footer>
              <Button className='cancel-btn' onClick={this.props.closeModal}>キャンセル</Button>
              <Button className='red-btn' onClick={this.handleOk}>確定</Button>                
            </Modal.Footer>
        </Modal>
    );
  }
}

SelectExamItemModal.contextType = Context;

SelectExamItemModal.propTypes = {  
  closeModal: PropTypes.func,
  selectMaster: PropTypes.func,
  MasterCodeData:PropTypes.array,
  MasterName : PropTypes.string,
  self_exam: PropTypes.bool,
};

export default SelectExamItemModal;
