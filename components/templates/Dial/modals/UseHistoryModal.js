import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 100%;
  float: left;

 `;
const Left = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 50%;
  height: 100%;
  float: left;
    border:solid 1px red;
    padding: 5px;

 `;
const Right = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 50%;
  height: 100%;
  float: left;
    border:solid 1px red;
 `;
const name_list = ['左手首, 左']
class UseHistoryModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { closeModal} = this.props;
        return  (
            <Modal show={true} onHide={closeModal} id="add_contact_dlg"  className="master-modal patient-popup-modal">
                <Modal.Header>
                    <Modal.Title>VA名称選択パネル</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <Left>
                            {name_list !== undefined && name_list !== null && name_list.length > 0 && (
                                name_list.map((item, index) => {
                                    return (
                                        <div onClick={()=>this.select(index)} key={index}>
                                            {item}
                                        </div>)
                                })
                            )}
                        </Left>
                        <Right>
                            <input type="text" />
                            <div className={`btn-group`}>
                                <div className={`flex`}>
                                    <p className={`pointer border w3`}>ア</p>
                                    <p className={`pointer border w3`}>か</p>
                                    <p className={`pointer border w3`}>サ</p>
                                </div>
                            </div>
                        </Right>
                    </Wrapper>
                </Modal.Body>
            </Modal>
        );
    }
}

UseHistoryModal.contextType = Context;

UseHistoryModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk: PropTypes.func,
};

export default UseHistoryModal;
