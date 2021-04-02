import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import RadioButton from "~/components/molecules/RadioInlineButton"
// import RadioInlineButtonsList from "~/components/molecules/RadioInlineButtonsList"
import RadioGroupButton from "~/components/molecules/RadioGroup";
import Checkbox from "~/components/molecules/Checkbox";
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
    }
  }
  .flex{
    display:flex;
  }

  .dialyser-list {
    border: solid 1px rgb(206,212,218);
    text-align: left;
    width:100%;      
    .radio-group-btn label{
      font-size:15px;
      width:50%;
      text-align: left;
      padding-left: 30px;
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
  .checkbox_area {
    position: absolute;
    right: 20px;
    padding-left: 15px;
    margin-top:0px;
    margin-left:30%;
    .checkbox-label{
      text-align:left;
    }
    label{
      font-size:15px;
    }
  }
  .select-button{
    button{
      margin-bottom:5px;
      margin-right:10px;
      span{
        font-size:15px;
      }
    }

  }
  
 `;

class DialMultiSelectMasterModal extends Component {
  constructor(props) {
    super(props);

    this.state = {         
        MasterCodeData:this.props.MasterCodeData,
        selected_masters_list: this.props.selected_masters_list!=undefined?this.props.selected_masters_list:[],        
    }
  }
  
  componentDidMount(){
    if (this.state.selected_masters_list.length == this.state.MasterCodeData.length){
      this.setState({all_check_flag:1})
    } else {
      this.setState({all_check_flag:0})
    }
  }
  selectMasters = (e) => {
    var temp = [...this.state.selected_masters_list];
    if (temp.indexOf(parseInt(e.target.value)) < 0){
      temp.push(parseInt(e.target.value));
    } else {
      var index = temp.indexOf(parseInt(e.target.value));
      if (index !==-1){
        temp.splice(index, 1);
      }
    }

    if (temp.length == this.state.MasterCodeData.length){
      this.setState({all_check_flag:1});
    } else{
      this.setState({all_check_flag:0});
    }

    this.setState({selected_masters_list:temp});
  }

  getCheckAll = (name, value)=>{        
    var temp = [];
    if (name == 'select_all'){
      this.setState({all_check_flag:value})
    }    
    if (value ===1){
      this.state.MasterCodeData.map(item => {
        temp.push(parseInt(item.number));
      })
      this.setState({selected_masters_list:temp});
    } else {
      this.setState({
        selected_masters_list:[],
        all_check_flag:0
      })
    }
  }

  confirmSelect = () => {
    this.props.selectMasters(this.state.selected_masters_list);
  }

  render() {
    const {MasterCodeData} = this.state;
    let Master_list = [];
    if (MasterCodeData !== undefined && MasterCodeData !== null){
        MasterCodeData.map((item) => {
          Master_list.push(
            <RadioGroupButton                
                id={'patientID_'+item.number}
                value = {item.number}
                label={item.number + ' : ' + item.name}                
                getUsage={e => this.selectMasters(e)}
                checked={this.state.selected_masters_list.indexOf((item.number)) >=0 ? true : false}
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
          <Modal.Body>
            <Wrapper>
            <div className="flex">
              <div className='select-button'>
                  <Button type="mono" onClick={this.confirmSelect.bind(this)}>選択</Button>
                  <Button type="mono" onClick={this.props.closeModal}>キャンセル</Button>
              </div>
              <div className="checkbox_area">
                <Checkbox
                  label="全患者選択"
                  getRadio={this.getCheckAll.bind(this)}
                  value={this.state.all_check_flag}                    
                  name="select_all"
                />
                </div>
            </div>
            <div className="dialyser-list" style={{ maxHeight: `500px`, overflowY: `scroll` }}>
              {Master_list}
            </div>                
            </Wrapper>
          </Modal.Body>
        </Modal>
    );
  }
}

DialMultiSelectMasterModal.contextType = Context;

DialMultiSelectMasterModal.propTypes = {  
  closeModal: PropTypes.func,
  selectMasters: PropTypes.func,
  MasterCodeData:PropTypes.array,
  MasterName : PropTypes.string,  
  selected_masters_list : PropTypes.array,
};

export default DialMultiSelectMasterModal;
