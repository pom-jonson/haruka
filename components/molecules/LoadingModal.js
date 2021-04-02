import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Spinner from "react-bootstrap/Spinner";
import $ from 'jquery';

const Wrapper = styled.div`
  display: block;
  font-size: 24px;
  width: 100%;
  height: 100%;
  float: left;
  .message {
    text-align: center;
    font-size: 40px;
    font-weight: bold;
    padding-top: 5vh;
    padding-bottom: 15px;
  }
`;

const SpinnerWrapper = styled.div`
    margin: auto;
`;

class LoadingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false
        }
    }
    componentDidMount() {
      // if ($('.modal-backdrop').hasClass('show'))
        $('.modal-backdrop').removeClass('show');
    }

    callVisible = (p_visible) => {
        this.setState({
            visible: p_visible
        });
    }

    render() {
        return  (
            <Modal show={this.state.visible} id="add_contact_dlg"  className={`master-modal confirm-read-modal ${this.props.fullOpacity == 1 ? "confirm-read-full-opacity-modal" : ""}`}>
                <Wrapper>
                    <div className={'message'}>{this.props.message}</div>
                    <div className='text-center'>
                        <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                    </div>
                </Wrapper>
            </Modal>
        );
    }
}

LoadingModal.contextType = Context;

LoadingModal.propTypes = {
    message: PropTypes.string,
    fullOpacity: PropTypes.number,
};

export default LoadingModal;
