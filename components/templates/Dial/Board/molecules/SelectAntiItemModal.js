import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioButton from "~/components/molecules/RadioInlineButton"
import axios from "axios";

// import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  .form-control {
    width: 100%;
    font-size: 12px;
   }
   .staff-list {
    width: 100%;
    height: 50vh;
    overflow-y: scroll;
    border: solid 1px rgb(206,212,218);
    label{
      font-size:18px;
    }
   }
   svg {
    width: 46px;
    margin-top: -7px;
   }
   .footer {
    button {
      margin-left: 77%;
      margin-top: 10px;
    }
    span {
      font-weight: normal;
    }
   }
 `;
const DIAL_MASTER_ANTICOAGULATION = 2;
class SelectAntiItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anti_item_list: [],
      item_number: 0,
    }
  }

  async UNSAFE_componentWillMount(){
    this.getSearchResult();
  }

  getSearchResult = async () => {
    let path = "/app/api/v2/dial/master/material_search";
    let post_data = {
      table_kind: DIAL_MASTER_ANTICOAGULATION,
      order:'sort_number'
    };
    let { data } = await axios.post(path, {params: post_data});
    this.setState({anti_item_list: data});
  };
  register = () => {
    this.props.getAntiItem(this.state.item_number);
  };

  getAntiItem = (e) => {
    this.setState({item_number: parseInt(e.target.value)}, () => {
      this.props.getAntiItem(this.state.anti_item_list[this.state.item_number]);
    });
  };

  render() {
    const anti_item_list = [];
    this.state.anti_item_list.map((anti_item, index) => {
      if (anti_item.is_enabled == 1)
      anti_item_list.push(
          <RadioButton
              key={index}
              id={index}
              label={anti_item.name}
              value={index}
              getUsage={this.getAntiItem}
              checked={index === this.state.item_number}
          />
      );
    });

    const { closeModal} = this.props;
    return  (
        <Modal show={true} onHide={closeModal} id="add_contact_dlg"  className="master-modal staff-modal">
          <Modal.Header closeButton>
            <Modal.Title>抗凝固法を追加</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className="staff-list">
                {anti_item_list}
              </div>
              {/*<div className="footer text-center">*/}
              {/*  <Button onClick={this.register}>登録</Button>*/}
              {/*</div>*/}
            </Wrapper>
          </Modal.Body>
        </Modal>
    );
  }
}

SelectAntiItemModal.contextType = Context;

SelectAntiItemModal.propTypes = {
  closeModal: PropTypes.func,
  getAntiItem: PropTypes.func,
};

export default SelectAntiItemModal;
