import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import RadioButtonWithFunc from "../../../../molecules/RadioButtonWithFunc";
import styled from "styled-components";
import { KEY_CODES } from "../../../../../helpers/constants";
import $ from "jquery";
import Button from "~/components/atoms/Button";

const TabContent = styled.div`
  display: block;
  max-width: 100%;
  width: 649px;
  height: 60vh;
  padding: 9px 9px 9px 2px;
  max-height: 700px;
  overflow: auto;
  position: relative;

  .usageListContainer {
    position: relative;
  }

  .usageListContainer > div {
    display: block;
  }
`;

export class SelectUsageSecondInjectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usageData: [],
      usageSelectIndex: -1,
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  async componentDidMount() {
    this.setState({ usageData: this.props.usageInjectData });
    if (
      document.getElementById("injection_dlg") !== undefined &&
      document.getElementById("injection_dlg") !== null
    ) {
      document.getElementById("injection_dlg").focus();
    }
  }

  onKeyPressed(e) {    
    if (
      e.keyCode === KEY_CODES.down ||
      e.keyCode === KEY_CODES.up ||
      e.keyCode === KEY_CODES.enter
    ) {
      let data = this.state.usageData;      

      if (e.keyCode === KEY_CODES.up) {
        this.setState(
          {
            usageSelectIndex:
              this.state.usageSelectIndex >= 1
                ? this.state.usageSelectIndex - 1
                : data.length - 1
          },
          () => {
            this.scrollToelement();
          }
        );
      }

      if (e.keyCode === KEY_CODES.down) {
        this.setState(
          {
            usageSelectIndex:
              this.state.usageSelectIndex + 1 == data.length
                ? 0
                : this.state.usageSelectIndex + 1
          },
          () => {
            this.scrollToelement();
          }
        );
      }

      if (e.keyCode === KEY_CODES.enter) {
        if (this.state.usageSelectIndex < 0) return;

        this.props.getUsageFromModal(
          data[this.state.usageSelectIndex].code,
          data[this.state.usageSelectIndex].name          
        );
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  selectUsageKind = e => {
    this.setState({ tab: parseInt(e.target.id), usageSelectIndex: -1 });
    if (
      document.getElementById("injection_dlg") !== undefined &&
      document.getElementById("injection_dlg") !== null
    ) {
      document.getElementById("injection_dlg").focus();
    }
  };

  onMouseOver = index => {
    this.setState({
      usageSelectIndex: index
    });
  };

  scrollToelement = () => {
    const els = $(".med-modal [class*=focused]");
    const pa = $(".med-modal .modal-body .usageList");
    if (els.length > 0 && pa.length > 0) {
      const elHight = $(els[0]).height();
      const elTop = $(els[0]).position().top;
      const paHeight = $(pa[0]).height();
      const scrollTop = elTop - (paHeight - elHight) / 2;
      $(pa[0]).scrollTop(scrollTop);
    }
  };

  render() {
    const usageList = [];
    
    this.state.usageData.map((usage, index) => {
      if(usage.is_enabled === 1){
          usageList.push(
              <RadioButtonWithFunc
                  key={index}
                  index={index}
                  id={usage.code}
                  label={usage.search_name}
                  name="usage"
                  requireBodyParts={usage.require_body_parts}
                  getUsage={this.props.getUsage}
                  checked={index === this.state.usageSelectIndex}
                  onMouseOver={this.onMouseOver}
                  receipt_key_if_precision={usage.receipt_key_if_precision !== undefined ? usage.receipt_key_if_precision : null}
              />
          );
      }
    });          
    return (
      <Modal
        show={true}
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
        id="injection_dlg"
        className="custom-modal-sm med-modal"
      >
        <Modal.Header>
          <Modal.Title>用法</Modal.Title>
        </Modal.Header>
        <Modal.Body>          
          <div className="categoryContent">            
            <TabContent className="usageList">
              <div className="usageListContainer">{usageList}</div>
            </TabContent>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeUsage}>キャンセル</Button>            
        </Modal.Footer>
      </Modal>
    );
  }
}

SelectUsageSecondInjectModal.propTypes = {
  closeUsage: PropTypes.func,
  getUsage: PropTypes.func,
  getUsageFromModal: PropTypes.func,
  usageInjectData: PropTypes.array
};

export default SelectUsageSecondInjectModal;
