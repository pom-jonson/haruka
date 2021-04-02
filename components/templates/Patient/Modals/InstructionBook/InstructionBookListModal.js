import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
// import Spinner from "react-bootstrap/Spinner";
import Button from "~/components/atoms/Button";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import * as apiClient from "~/api/apiClient";
// import Context from "~/helpers/configureStore";
// import DatePicker, { registerLocale } from "react-datepicker";
// import ja from "date-fns/locale/ja";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
// import RadioButton from "~/components/molecules/RadioInlineButton";
// import Radiobox from "~/components/molecules/Radiobox";
// import Checkbox from "~/components/molecules/Checkbox";
// import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";

// registerLocale("ja", ja);
// import SelectPannelHarukaModal from "../Common/SelectPannelHarukaModal";
// import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
// import SetDetailViewModal from "~/components/templates/Patient/Modals/Common/SetDetailViewModal";
// import axios from "axios/index";
// import $ from "jquery";
// import {KARTEMODE} from "~/helpers/constants";



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
  .disable-button {
    background: rgb(101, 114, 117);
    }
`;




class InspectionBookListModal extends Component {
    constructor(props) {
      super(props);              
    }

    async componentDidMount() {
        
    }
   

    render() {
        return (
            <>
                <Modal
                    show={true}                    
                    id="outpatient"
                    className="custom-modal-sm patient-exam-modal outpatient-modal first-view-modal"
                >
                    <Modal.Header>
                        <Modal.Title>
                            指示簿一覧
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Footer>
                          <Button className="ok">確定(指示)</Button>
                          <Button className="ok">確定(指示& 実施)</Button>
                          <Button className="cancel" onClick={this.props.closeModal}>閉じる</Button>
                        </Footer>
                    </Modal.Footer>
                    
                </Modal>
               
            </>
        );
    }
}

// InspectionBookListModal.contextType = Context;
InspectionBookListModal.propTypes = {
    patientId: PropTypes.number,
    patientInfo: PropTypes.object,
    closeModal: PropTypes.func,
    cache_index:PropTypes.number,
};

export default InspectionBookListModal;
