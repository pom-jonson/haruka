import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioInlineButtonsList from "~/components/molecules/RadioInlineButtonsList"
import * as methods from "../DialMethods";
import axios from "axios/index";

const Wrapper = styled.div`  
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 40rem;
  overflow-y: auto;
  flex-direction: column;
  text-align: center;
  .radio-btn{
    label{
      font-size:18px;
      text-align:left;
      padding-left:10px;
      border-radius:0;
    }
  }
  .dialyser-list {
    border: solid 1px rgb(206,212,218);
    width:100%;    
  }  
 `;

class DialSelectFacilityModal extends Component {
  constructor(props) {
    super(props);
      Object.entries(methods).forEach(([name, fn]) =>
          name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
      );
    this.state = { 
        selected_master_number:0,
    }
  }
  
  selectMaster = (master, e) => {      
    this.setState({selected_master_number:e.target.id});
    this.props.selectMaster(master);
  }
    async componentDidMount() {
        this.getOtherFacilitiesData();        
    }
    getOtherFacilitiesData = async() => {
      const { data } = await axios.post(
        "/app/api/v2/dial/master/getOtherFacilitiesOrder",
        {
          params: {
            order:"sort_number",
            is_enabled:1,
          }
        }
      );      
      if (data != undefined && data != null && data.length>0){
        this.setState({
          facility_data:data,          
        })
      }
    }
    onHide = () => {};

  render() {
    const {facility_data} = this.state;
    let Master_list = [];    
    if (facility_data !== undefined && facility_data !== null){
        facility_data.map((item, index) => {
          Master_list.push(
            <RadioInlineButtonsList
                key={index}
                id={index.number}
                label={item.name}
                getUsage={this.selectMaster.bind(this, item.name)}
                checked={index === this.state.selected_master_number}
            />   
            );
        })
    }    

    const { closeModal } = this.props;
    return  (
        <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal dialyser-modal">
          <Modal.Header>
            <Modal.Title>実施施設選択</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>                            
              <div className="dialyser-list">
                {Master_list}
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <div onClick={closeModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
              <span>キャンセル</span>
            </div>
          </Modal.Footer>
        </Modal>
    );
  }
}

DialSelectFacilityModal.contextType = Context;

DialSelectFacilityModal.propTypes = {  
  closeModal: PropTypes.func,
  selectMaster: PropTypes.func,
  MasterCodeData:PropTypes.array,
};

export default DialSelectFacilityModal;
