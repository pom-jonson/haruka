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
      font-size:16px;
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


class SelectDischargePath extends Component {
    constructor(props) {
        super(props);        
        this.state = {
            isUpdateConfirmModal: false,
            confirm_message:"",
            dischargeRouteList: this.props.masterData ? this.props.masterData : []
        }       
    }

    async componentDidMount() {
        // get master data            
        // let data = this.state.dischargeRouteList;
        // if (data != null && data != undefined && data.length > 0) {
        //     data.map(ele=>{
        //         ele.selected = false;
        //     });
        // }
        // this.setState({ dischargeRouteList: data });        
    }        

    selectDischargeRoute(number){

        let dischargeRouteList = this.state.dischargeRouteList;
        dischargeRouteList.map(item=>{
            if (item.number == number) {
                item.selected = !item.selected;
            }
        });
        
        this.setState({dischargeRouteList});
    }

    registerDischargeRoute = () => {
        // let dischargeRouteList = this.state.dischargeRouteList;
        // let return_array = [];
        
        // dischargeRouteList.map(item=>{
        //     if (item.selected == true) {
        //         return_array.push(item.number);
        //     }
        // });

        // this.props.registerDischargeRoute(return_array);
        this.props.registerDischargeRoute(this.state.dischargeRouteList);
    }

    confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            confirm_message: "",
        });
    }
    
    render() {
        let {
            dischargeRouteList
        } = this.state;

        let dischargeRouteContent = [];
        let dischargeRouteRow = [];
        if (dischargeRouteList != undefined && 
            dischargeRouteList != null && 
            dischargeRouteList.length > 0) {
            dischargeRouteList.map((item, index)=>{
                if ((index % 3 == 0 && index != 0) || index == (dischargeRouteList.length - 1)) {
                    if (index == (dischargeRouteList.length - 1)) {
                        if (index % 3 == 0) {
                            dischargeRouteContent.push(
                                <div className = "flex">
                                    {dischargeRouteRow}
                                </div>
                            );
                            dischargeRouteRow = [];
                        }
                        dischargeRouteRow.push(
                            <RadioButton
                                id={item.number}
                                value={item.number}
                                label={item.name}                                        
                                getUsage={()=>this.selectDischargeRoute(item.number)}
                                checked={item.selected == 1}
                            />   
                        );
                    }
                    dischargeRouteContent.push(
                        <div className = "flex">
                            {dischargeRouteRow}
                        </div>
                    );
                    dischargeRouteRow = [];
                }      
                dischargeRouteRow.push(
                    <RadioButton
                        id={item.number}
                        value={item.number}
                        label={item.name}                                        
                        getUsage={()=>this.selectDischargeRoute(item.number)}
                        checked={item.selected == 1}
                    />   
                );

            })
        }
        return  (
            <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>退院経路</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>                        
                        {dischargeRouteContent}
                    </Wrapper>                    
                </Modal.Body>
                <Modal.Footer>  
                    <Footer>                      
                      <Button type="mono" onClick={this.registerDischargeRoute}>登録</Button>
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

SelectDischargePath.contextType = Context;

SelectDischargePath.propTypes = {
    closeModal: PropTypes.func,  
    registerDischargeRoute: PropTypes.func,    
    masterData: PropTypes.array,      
};

export default SelectDischargePath;
