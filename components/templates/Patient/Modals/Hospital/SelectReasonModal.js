import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import RadioButton from "~/components/molecules/RadioButton";
// import * as apiClient from "~/api/apiClient";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 100%;
  float: left;
  .flex{
      display:flex;
      margin-bottom:5px;
      justify-content: space-around;
  }
  .sub-title{
    
  }
  .content{
    padding-left:5%;
    padding-left:5%;
  }
  .label-title{
    text-align: left;
    width: 160px;
    font-size:16px;
   }
  .pullbox-select{
    width:150px;
  }
  .radio-btn{
    margin-left: 0.625rem;
    label{
        border: solid 1px gray;
        border-radius:0;
        margin-left: 0.625rem;
        width:150px;
        background: #ddd;
    }    
  }

  input:checked + label {
    background: yellow;
  }
}
 `;

 const Footer = styled.div`
    display: flex;    
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
    .ixnvCM{
        font-size: 15px;
        padding-top: 8px;
    }
  `;


class SelectReasonModal extends Component {
    constructor(props) {
        super(props);        
        this.state = {
            isUpdateConfirmModal: false,
            confirm_message:"",
            outcomeReasonList: this.props.masterData ? this.props.masterData : []
        }        
    }

    getAlwaysShow = (name, value) => {
        if(name==="alwaysShow"){
            this.setState({is_enabled: value})
        }
    };

    async componentDidMount() {
        // get master data    
        // let data = this.state.outcomeReasonList;
        // if (data != null && data != undefined && data.length > 0) {
        //     data.map(ele=>{
        //         ele.selected = false;
        //     });
        // }        
        // this.setState({ outcomeReasonList: data });
    }    

    confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            confirm_message: "",
        });
    } 
    
    selectOutcomeReason(number){

        let outcomeReasonList = this.state.outcomeReasonList;
        outcomeReasonList.map(item=>{
            if (item.number == number) {
                item.selected = !item.selected;
            }
        });

        this.setState({outcomeReasonList});
    }

    registerOutcomeReason = () => {
        // let outcomeReasonList = this.state.outcomeReasonList;
        // let return_array = [];
        
        // outcomeReasonList.map(item=>{
        //     if (item.selected == true) {
        //         return_array.push(item.number);
        //     }
        // });

        // this.props.registerOutcomeReason(return_array);
        this.props.registerOutcomeReason(this.state.outcomeReasonList);
    }
    
    render() {
        let {
            outcomeReasonList
        } = this.state;

        let outcomeReasonContent = [];
        let outcomeReasonRow = [];
        if (outcomeReasonList != undefined && 
            outcomeReasonList != null && 
            outcomeReasonList.length > 0) {
            outcomeReasonList.map((item, index)=>{
                if ((index % 3 == 0 && index != 0) || index == (outcomeReasonList.length - 1)) {
                    if (index == (outcomeReasonList.length - 1)) {
                        if (index % 3 == 0) {
                            outcomeReasonContent.push(
                                <div className = "flex">
                                    {outcomeReasonRow}
                                </div>
                            );
                            outcomeReasonRow = [];
                        }
                        outcomeReasonRow.push(
                            <RadioButton
                                id={item.number}
                                value={item.number}
                                label={item.name}                                        
                                getUsage={()=>this.selectOutcomeReason(item.number)}
                                checked={item.selected == 1}
                            />   
                        );
                    }
                    outcomeReasonContent.push(
                        <div className = "flex">
                            {outcomeReasonRow}
                        </div>
                    );
                    outcomeReasonRow = [];
                }      
                outcomeReasonRow.push(
                    <RadioButton
                        id={item.number}
                        value={item.number}
                        label={item.name}                                        
                        getUsage={()=>this.selectOutcomeReason(item.number)}
                        checked={item.selected == 1}
                    />   
                );

            })
        }
        return  (
            <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>転帰コメント</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        {outcomeReasonContent}
                    </Wrapper>                    
                </Modal.Body>
                <Modal.Footer>  
                    <Footer>                      
                      <Button type="mono" onClick={this.registerOutcomeReason}>{"登録"}</Button>
                      <Button type="mono" onClick={this.props.closeModal}>閉じる</Button>
                    </Footer>
                </Modal.Footer>
                {this.state.isUpdateConfirmModal !== false && (
                    <SystemConfirmJapanModal
                        hideConfirm= {this.confirmCancel.bind(this)}
                        confirmCancel= {this.confirmCancel.bind(this)}
                        // confirmOk= {this.register.bind(this)}
                        confirmTitle= {this.state.confirm_message}
                    />
                )}
            </Modal>
        );
    }
}

SelectReasonModal.contextType = Context;

SelectReasonModal.propTypes = {
    closeModal: PropTypes.func,    
    registerOutcomeReason: PropTypes.func,    
    masterData: PropTypes.array,      
};

export default SelectReasonModal;
