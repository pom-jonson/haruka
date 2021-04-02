import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";

const Wrapper = styled.div`  
    width: 100%;
    height: 100%;
    font-size: 16px;
    overflow-y:auto;
    .flex{
        display: flex;
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
`;

class AccountOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    render() {
        return (
            <>
                <Modal show={true} className="custom-modal-sm patient-exam-modal account-order-modal first-view-modal">
                    <Modal.Header><Modal.Title>会計オーダ―（外来）</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                        
                        </Wrapper>
                    </Modal.Body>
                    <Modal.Footer>
                        <Footer>
                            <>
                                <Button>確定</Button>
                                <Button type="mono" onClick={this.props.closeModal}>閉じる</Button>
                            </>
                        </Footer>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

AccountOrder.contextType = Context;
AccountOrder.propTypes = {
    patientId: PropTypes.number,
    patientInfo: PropTypes.object,
    closeModal: PropTypes.func,
};

export default AccountOrder;
