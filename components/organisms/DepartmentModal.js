import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import RadioButtonOver from "../molecules/RadioButtonOver";
import styled from "styled-components";
import { KEY_CODES } from "../../helpers/constants";
import Button from "../atoms/Button";
import $ from "jquery";

const TabContent = styled.div`
  display: block;
  max-width: 100%;
  width: 649px;
  height: calc(100% - 1rem);
  padding: 9px 9px 9px 2px;
  max-height: 700px;
  overflow: auto;
  position: relative;

  .usageListContainer {
    position: relative;
    label {
      font-size: 1rem;
    }
  }

  .usageListContainer > div {
    display: block;
  }
`;


export class DepartmentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      selectedDepartmentIndex: -1,
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  async componentDidMount() {
    this.setState({
      selectedDepartmentIndex: this.props.departmentCode - 1 
    });
    if (
      document.getElementById("prescription_dlg") !== undefined &&
      document.getElementById("prescription_dlg") !== null
    ) {
      document.getElementById("prescription_dlg").focus();
    }
  }

  onKeyPressed(e) {
    if (
      e.keyCode === KEY_CODES.down ||
      e.keyCode === KEY_CODES.up ||
      e.keyCode === KEY_CODES.enter
    ) {      
      if (e.keyCode === KEY_CODES.up) {
        this.setState(
          {
            selectedDepartmentIndex:
              this.state.selectedDepartmentIndex >= 1
                ? this.state.selectedDepartmentIndex - 1
                : this.props.departmentList.length - 1
          },
          () => {
            this.scrollToelement();
          }
        );
      }

      if (e.keyCode === KEY_CODES.down) {
        this.setState(
          {
            selectedDepartmentIndex:
              this.state.selectedDepartmentIndex + 1 == this.props.departmentList.length
                ? 0
                : this.state.selectedDepartmentIndex + 1
          },
          () => {
            this.scrollToelement();
          }
        );
      }

      if (e.keyCode === KEY_CODES.enter) {        
        // e.preventDefault();
        // e.stopPropagation();
      }
    }
  } 

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

  selectDepartment = (e) => {
    this.setState({
      selectedDepartmentIndex: parseInt(e.target.id)
    });
  } 

  changeDeparment = () => {
    if (this.props.departmentList[this.state.selectedDepartmentIndex] != undefined)
      this.props.handleChangeDeparment(this.props.departmentList[this.state.selectedDepartmentIndex].id);
  };
  onHide = () => {};

  render() {
    const arrayDeparmentList = [];    
    this.props.departmentList.map((deparment, index) => {
      arrayDeparmentList.push(
        <RadioButtonOver
          key={index}
          index={index}
          id={index}
          label={deparment.value}
          getUsage={this.selectDepartment}
          name="deparment"          
          checked={index === this.state.selectedDepartmentIndex}
          // onMouseOver={this.onMouseOver}
        />
      );
    });
      
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
        id="prescription_dlg"
        className="custom-modal-sm med-modal"
      >
        <Modal.Header>
          <Modal.Title>診療科修正</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="info">
            <ul>
              <li>
                  {this.props.departmentDate.substr(0, 4)}年
                  {this.props.departmentDate.substr(5, 2)}月
                  {this.props.departmentDate.substr(8, 2)}日
                  {this.props.departmentDate.substr(11, 2)}時
                  {this.props.departmentDate.substr(14, 2)}分
              </li>
              <li>元の診療科:{this.props.departmentName}</li>
              <li>新しい診療科を選んでください。</li>
            </ul>
          </div>
          <div className="categoryContent">           
            <TabContent className="usageList">
              <div className="usageListContainer">{arrayDeparmentList}</div>
            </TabContent>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button id="btnCancel"className="cancel-btn" onClick={this.props.handleCancel}>キャンセル</Button>
          <Button id="btnOk"className="red-btn" onClick={this.changeDeparment}>確定</Button>
        </Modal.Footer>
      </Modal>
    );  
  }
}

DepartmentModal.propTypes = {
  handleCancel: PropTypes.func,  
  hideModal: PropTypes.func,  
  handleChangeDeparment: PropTypes.func,  
  departmentList: PropTypes.array,
  departmentName: PropTypes.string,
  departmentCode: PropTypes.number,
  departmentDate: PropTypes.string,
};

export default DepartmentModal;
