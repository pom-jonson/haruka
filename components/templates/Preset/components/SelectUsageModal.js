import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import RadioButtonWithFunc from "../../../molecules/RadioButtonWithFunc";
import IconWithCaption from "../../../molecules/IconWithCaption";
import { faAlarmClock } from "@fortawesome/pro-regular-svg-icons";
import styled from "styled-components";
import UsageKindNav from "../../../organisms/UsageKindNav";
import { KEY_CODES } from "../../../../helpers/constants";
import { diagnosis } from "../../../../helpers/departments";
import $ from "jquery";
import Button from "~/components/atoms/Button";

const TabContent = styled.div`
  display: block;
  max-width: 100%;
  width: 649px;
  height: calc(100vh*0.65);
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

export class SelectUsageModal extends Component {
  constructor(props) {
    super(props);
    let selTab = 2;
    switch(this.props.diagnosis_division) {
      case 21:
        selTab = 2;
        break;
      case 23:
        selTab = 5;
        break;
      case 30:
      case 50:
        selTab = 6;
        break;
      default:
        selTab = 2;
        break;

    }

    this.state = {
      usageData: {
        internal: {
          times_1: [],
          times_2: [],
          times_3: [],
          internal_other: []
        },
        external: {
          all: []
        },
        when_necessary: {
          all: []
        },
        injection: {
          all: []
        }
      },
      tab: selTab,
      usageSelectIndex: -1,
      diagnosis: diagnosis
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  async componentDidMount() {
    this.setState({ usageData: this.props.usageData });
    if (
      document.getElementById("prescription_dlg") !== undefined &&
      document.getElementById("prescription_dlg") !== null
    ) {
      document.getElementById("prescription_dlg").focus();
    }
  }

  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left) {
      this.setState({
        tab:
          this.state.tab >= 1
            ? this.state.tab - 1
            : this.state.diagnosis.length - 1,
        usageSelectIndex: -1
      });
    }

    if (e.keyCode === KEY_CODES.right) {
      this.setState({
        tab:
          this.state.tab + 1 === this.state.diagnosis.length
            ? 0
            : this.state.tab + 1,
        usageSelectIndex: -1
      });
    }

    if (
      e.keyCode === KEY_CODES.down ||
      e.keyCode === KEY_CODES.up ||
      e.keyCode === KEY_CODES.enter
    ) {
      let data = [];
      switch (this.state.tab) {
        case 0:
          data = this.state.usageData.internal.times_1;
          break;
        case 1:
          data = this.state.usageData.internal.times_2;
          break;
        case 2:
          data = this.state.usageData.internal.times_3;
          break;
        case 3:
          data = this.state.usageData.internal.internal_other;
          break;
        case 4:
          data = this.state.usageData.when_necessary.all;
          break;
        case 5:
          data = this.state.usageData.external.all;
          break;
        case 6:
          data = this.state.usageData.injection.all;
          break;
      }

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
          data[this.state.usageSelectIndex].name,
          this.state.tab,
          data[this.state.usageSelectIndex].days_suffix,
          data[this.state.usageSelectIndex].enable_days,
          data[this.state.usageSelectIndex].require_body_parts
        );
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  selectUsageKind = e => {
    this.setState({ tab: parseInt(e.target.id), usageSelectIndex: -1 });
    if (
      document.getElementById("prescription_dlg") !== undefined &&
      document.getElementById("prescription_dlg") !== null
    ) {
      document.getElementById("prescription_dlg").focus();
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
    switch (this.state.tab) {
      case 0:
        this.state.usageData.internal.times_1.map((usage, index) => {
          usageList.push(
            <RadioButtonWithFunc
              key={index}
              index={index}
              id={usage.code}
              label={usage.name}
              name="usage"
              usageType={this.state.tab}
              suffix={usage.days_suffix}
              enableDays={usage.enable_days}
              requireBodyParts={usage.require_body_parts}
              getUsage={this.props.getUsage}
              checked={index === this.state.usageSelectIndex}
              onMouseOver={this.onMouseOver}
              usageName={usage.name}
            />
          );
        });
        break;
      case 1:
        this.state.usageData.internal.times_2.map((usage, index) => {
          usageList.push(
            <RadioButtonWithFunc
              key={index}
              id={usage.code}
              label={usage.name}
              name="usage"
              usageType={this.state.tab}
              suffix={usage.days_suffix}
              enableDays={usage.enable_days}
              requireBodyParts={usage.require_body_parts}
              getUsage={this.props.getUsage}
              checked={index === this.state.usageSelectIndex}
              onMouseOver={this.onMouseOver}
              usageName={usage.name}
            />
          );
        });
        break;
      case 2:
        this.state.usageData.internal.times_3.map((usage, index) => {
          usageList.push(
            <RadioButtonWithFunc
              key={index}
              index={index}
              id={usage.code}
              label={usage.name}
              name="usage"
              usageType={this.state.tab}
              suffix={usage.days_suffix}
              enableDays={usage.enable_days}
              requireBodyParts={usage.require_body_parts}
              getUsage={this.props.getUsage}
              checked={index === this.state.usageSelectIndex}
              onMouseOver={this.onMouseOver}
              usageName={usage.name}
            />
          );
        });
        break;
      case 3:
        this.state.usageData.internal.internal_other.map((usage, index) => {
          usageList.push(
            <RadioButtonWithFunc
              key={index}
              index={index}
              id={usage.code}
              label={usage.name}
              name="usage"
              usageType={this.state.tab}
              suffix={usage.days_suffix}
              enableDays={usage.enable_days}
              requireBodyParts={usage.require_body_parts}
              getUsage={this.props.getUsage}
              checked={index === this.state.usageSelectIndex}
              onMouseOver={this.onMouseOver}
              usageName={usage.name}
            />
          );
        });
        break;
      case 4:
        this.state.usageData.when_necessary.all.map((usage, index) => {
          usageList.push(
            <RadioButtonWithFunc
              key={index}
              index={index}
              id={usage.code}
              label={usage.name}
              name="usage"
              usageType={this.state.tab}
              suffix={usage.name.includes("ＸＸ")?"":usage.days_suffix}
              enableDays={usage.enable_days}
              requireBodyParts={usage.require_body_parts}
              getUsage={this.props.getUsage}
              checked={index === this.state.usageSelectIndex}
              onMouseOver={this.onMouseOver}
              usageName={usage.name}
            />
          );
        });
        break;
      case 5:
        this.state.usageData.external.all.map((usage, index) => {
          usageList.push(
            <RadioButtonWithFunc
              key={index}
              index={index}
              id={usage.code}
              label={usage.name}
              name="usage"
              usageType={this.state.tab}
              suffix={usage.days_suffix}
              enableDays={usage.enable_days}
              requireBodyParts={usage.require_body_parts}
              getUsage={this.props.getUsage}
              checked={index === this.state.usageSelectIndex}
              onMouseOver={this.onMouseOver}
              usageName={usage.name}
            />
          );
        });
        break;
      case 6:
        this.state.usageData.injection.all.map((usage, index) => {
          usageList.push(
            <RadioButtonWithFunc
              key={index}
              index={index}
              id={usage.code}
              label={usage.name}
              name="usage"
              usageType={this.state.tab}
              suffix={usage.days_suffix}
              enableDays={usage.enable_days}
              requireBodyParts={usage.require_body_parts}
              getUsage={this.props.getUsage}
              checked={index === this.state.usageSelectIndex}
              onMouseOver={this.onMouseOver}
              usageName={usage.name}
            />
          );
        });
        break;
    }
    return (
      <Modal
        show={true}
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
        id="prescription_dlg"
        className="custom-modal-sm med-modal"
      >
        <Modal.Header>
          <Modal.Title>用法</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <IconWithCaption
            className="categoryName"
            icon={faAlarmClock}
            word="用法"
          />
          <div className="categoryContent">
            <UsageKindNav
              selectUsageKind={this.selectUsageKind}
              id={this.state.tab}
              diagnosis={this.state.diagnosis}
            />
            <TabContent className="usageList">
              <div className="usageListContainer">{usageList}</div>
            </TabContent>
          </div>
        </Modal.Body>
        <Modal.Footer>
            <Footer>
                <Button className="cancel-btn" onClick={this.props.closeUsage}>閉じる</Button>
            </Footer>
        </Modal.Footer>
      </Modal>
    );
  }
}

SelectUsageModal.propTypes = {
  closeUsage: PropTypes.func,
  getUsage: PropTypes.func,
  getUsageFromModal: PropTypes.func,
  usageData: PropTypes.array,
  diagnosis_division: PropTypes.number
};

export default SelectUsageModal;
