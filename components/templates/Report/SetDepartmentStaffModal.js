import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  font-size:1rem;
  padding: 1%;
  height: 20rem;
  display: flex;
  .selected {
    background: lightblue;
  }
  .left-area, .right-area {
    width: 48%;
    height: 100%;
    .content {
      overflow-y: auto;
      border: solid 1px gray;
      padding:0.5rem;
    }
  }
  .right-area {
    margin-left: 4%;
  }
`;

class SetDepartmentStaffModal extends Component {
    constructor(props) {
      super(props);
      this.departments = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
      this.state = {
        department_id: '',
        staff_id: '',
        is_loaded: false,
      };
    }

    async UNSAFE_componentWillMount () {
      await this.getStaff();
    }
    getStaff = async () =>{
      await apiClient.get("/app/api/v2/secure/staff/search?")
        .then((res) => {
            let staff_list_by_number = {};
            if (res != undefined){
                Object.keys(res).map((key) => {
                    staff_list_by_number[res[key].number] = res[key].name;
                });
            }
            this.setState({
                staffs: res,
                staff_list_by_number,
                is_loaded: true
            });
        });
  };
    setDepartment = (index) => {
      this.setState({department_id: this.departments[index].id});
    }
    setStaff = (index) => {
      this.setState({staff_index: index});
    }
    onHide = () => {};
    handleOk = () => {
      this.props.handleOk(this.state.staffs[this.state.staff_index]);
    }
    render() {
      let {staffs} = this.state;
      let departments = this.departments;
      return (
        <>
          <Modal show={true} className="prescription_confirm_modal" onHide={this.onHide}>
            <Modal.Header><Modal.Title>科・職員選択</Modal.Title></Modal.Header>
            <Modal.Body>
              <Wrapper>
                <div className="left-area">
                  <label>科</label>
                  <div className='content'>
                    {departments != undefined && departments.length > 0 && departments.map((item, index)=>{
                      return (
                        <div key={index} className={this.state.department_id == item.id ? "selected": ""} onClick={this.setDepartment.bind(this, index)}>{item.value}</div>
                      )
                    })}
                  </div>
                  
                </div>
                <div className="right-area">
                  <label>医師</label>
                  <div className='content'>
                    {staffs != undefined && staffs.length > 0 && staffs.map((item, index)=>{
                      return (
                        <div key={index} className={this.state.staff_index == index ? "selected": ""} onClick={this.setStaff.bind(this, index)}>{item.name}</div>
                      )
                    })}
                  </div>
                </div>
              </Wrapper>
            </Modal.Body>
            <Modal.Footer>
              <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
              <Button className="red-btn" onClick={this.props.handleOk}>確定</Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
}

SetDepartmentStaffModal.contextType = Context;
SetDepartmentStaffModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
};

export default SetDepartmentStaffModal;