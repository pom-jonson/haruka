import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import InsulinBody from "~/components/templates/Dial/MedicalInformation/InsulinBody";
import { surface } from "~/components/_nano/colors";

const Card = styled.div`
  width: 100%;
  height: 100%;
  margin: 0px;
  float: left;
  background-color: ${surface};
  .left{
    float:left;
  }
  .right{
    float:right;
  }
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .footer {
    margin-top: 10px;
    text-align: center;
    clear:both;
  }
  .flex{
    display:flex;
  }
  .history, .context{
    height: calc( 50vh - 150px);
    width:100%;
  }
  .sub_title{
    padding-top:20px;
    clear: both;
  }
  .right_area{
    position:absolute;
    right:18px;
    cursor: pointer;
  }
`;
class InsulinManageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    onHide =()=>{}

    render() {
        const { closeModal } = this.props;
        return  (
            <Modal show={true} onHide={this.onHide}  className="wordPattern-modal master-modal medical-history-modal insulin-manage-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>インスリン管理</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <InsulinBody
                            patientInfo={this.props.patientInfo}
                            type={'modal'}
                            closeModal={closeModal}
                            handleOk= {this.props.handleOk}
                            selected_item = {this.props.selected_item}
                            is_edit = {this.props.is_edit}
                            source = {this.props.source}
                            special = {this.props.special}
                            from_source = {this.props.from_source}
                        />
                    </Card>
                </Modal.Body>
            </Modal>
        );
    }
}

InsulinManageModal.contextType = Context;

InsulinManageModal.propTypes = {
    handleOk: PropTypes.func,
    closeModal: PropTypes.func,
    patientInfo:PropTypes.array,
    selected_item:PropTypes.object,
    is_edit:PropTypes.bool,
    source : PropTypes.string,
    special: PropTypes.bool,
    from_source : PropTypes.string,
};
export default InsulinManageModal;
