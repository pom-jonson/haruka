import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import * as methods from "../DialMethods";
import axios from "axios/index";
import Button from "../../../atoms/Button";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`  
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 100%;
  .radio-btn{
    label{
      font-size:18px;
    }
  }
  .label-title{
      font-size:18px;
  }
  .dialyser-list {
    border: solid 1px rgb(206,212,218);
    width:100%;
  }  
  p{
      cursor:pointer;
  }
    .area-1 {
        width: 32%;
        border:1px solid black;
        height: 100%;
        p {
            margin: 0;
            padding-left: 5px; 
        }
        p:hover {
            background-color: rgb(246, 252, 253);
        }
        height: 100%;
        overflow-y:auto;
    }
    .selected, .selected:hover{
        background:lightblue!important;      
    }
    .footer {
    margin-top: 10px;
    position: absolute;
    margin-left: 36%;
    button {
        margin-right: 10px;
        background-color: rgb(38, 159, 191);
        border-color: rgb(38, 159, 191);
        span {
            color: white;
            font-size: 18px;
        }
    }
  }
 `;

const init_other_facilities_department_datas = [
  { id: 0, value: "" },
];

const init_other_facilities_doctors = [
  { id: 0, value: "" },
];

class DialSelectFacilityOtherModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      selected_facility_number: 0,
      selected_depart_number: "",
      selected_staff_number: "",
      selected_facility_name: "",
      selected_depart_name: "",
      selected_staff_name: "",
      other_facilities_department_datas:init_other_facilities_department_datas,
      other_facilities_doctors:init_other_facilities_doctors,
      search_order:1,
      is_loaded: false,
    }
  }

  async componentDidMount() {
    var base_modal = document.getElementsByClassName("input-panel-modal")[0];
    if(base_modal !== undefined)base_modal.style['z-index'] = 1040;
    await this.getOthers();
    this.setState({is_loaded: true});
  }

  getOthers = async() => {
    await this.getOtherFacilitiesData();
    await this.getDepartsFromFacility();
    await this.getStaffFromDepart();
  }

  getOtherFacilitiesData = async() => {
    const { data } = await axios.post(
      "/app/api/v2/dial/master/getOtherFacilitiesOrder",
      {
        params: {
          order:"sort_number",
          is_enabled:1,
        }
      }
    );
    if (data != undefined && data != null && data.length>0){
      this.setState({
        facility_data:data,
        selected_facility_name:data[0].name
      })
    }
  }

  selectFacility = (item) => {
    this.setState({
      selected_facility_number:item.number,
      selected_facility_name:item.name,
      // selected_depart_number: 0,
      // selected_staff_number: 0,
      // other_facilities_department_datas:init_other_facilities_department_datas,
      // other_facilities_doctors:init_other_facilities_doctors,
    });
  };

  getDepartsFromFacility = async (number = undefined) => {
    let path = "/app/api/v2/dial/master/other_facilities_department_search";
    let post_data = {
      other_facilities_number: number,
      is_enabled: 1,
      order:"sort_number"
    };
    let { data } = await axios.post(path, { params: post_data });
    let department_datas = init_other_facilities_department_datas;
    data.map((item, index) => {
      let department_info = {id: item.number, value: item.name};
      department_datas[index+1]= department_info;
    });
    this.setState({
      other_facilities_department_datas:data,
    });
  };

  selectDepart = (selected_depart_number) => {
    this.setState({
      selected_depart_number,
      // selected_staff_number: 0,
      // other_facilities_doctors:init_other_facilities_doctors,
      selected_depart_name:this.state.other_facilities_department_datas.find(x=>x.number == selected_depart_number).name
    });
  };

  getStaffFromDepart =async( facility_number = undefined, depart_number = undefined ) => {
    let path = "/app/api/v2/dial/master/other_facilities_doctor_search";
    let post_data = {
      other_facilities_number: facility_number,
      other_facilities_department_number: depart_number,
      is_enabled: 1,
      order:"sort_number"
    };
    let { data } = await axios.post(path, { params: post_data });
    let doctor_datas = [
      { id: 0, value: "" },
    ];

    data.map((item, index) => {
      let doctor_info = {id: item.number, value: item.name};
      doctor_datas[index+1]= doctor_info;
    });
    this.setState({other_facilities_doctors:data});
  };

  selectStaff = (selected_staff_number) => {
    this.setState({
      selected_staff_number,
      selected_staff_name: this.state.other_facilities_doctors.find(x=>x.number===selected_staff_number).name,
    });
  };

  saveBody = () => {
    let post_data =
      this.state.selected_facility_name +
      this.state.selected_depart_name +
      this.state.selected_staff_name;
    if (post_data == ""){
      window.sessionStorage.setItem("alert_messages", "他施設マスを選択してください。");
      return;
    }
    this.props.handleOk(post_data);
  };

  getOrderSelect = e => {                 //表示順
    this.setState({ search_order: parseInt(e.target.id) }, () => {
      this.getOtherFacilitiesData();
    });
  };

  onHide=()=>{}

  render() {
    const { closeModal } = this.props;
    let {facility_data, other_facilities_department_datas, other_facilities_doctors } = this.state;
    return  (
      <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal add-contact-modal">
        <Modal.Header>
          <Modal.Title>{this.props.MasterName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.is_loaded ? (
            <Wrapper>
              <div className="area-1">
                {facility_data != undefined && facility_data.length>0 && (
                  facility_data.map((item) => {
                    return (
                      <>
                        <p className={item.number==this.state.selected_facility_number?"selected":""}
                           onClick = {this.selectFacility.bind(this, item)}>{item.name}</p>
                      </>
                    )
                  })
                )}
              </div>
              <div className="area-1">
                {other_facilities_department_datas != undefined && other_facilities_department_datas.length>0 && (
                  other_facilities_department_datas.map(item => {
                    return (
                      <p className={item.number==this.state.selected_depart_number?"selected":""}
                         key = {item.number} onClick = {this.selectDepart.bind(this, item.number)}>{item.name}</p>
                    )
                  })
                )}
              </div>
              <div className="area-1">
                {other_facilities_doctors != undefined && other_facilities_doctors.length>0 && (
                  other_facilities_doctors.map(item => {
                    return (
                      <p className={item.number==this.state.selected_staff_number?"selected":""}
                         key = {item.number} onClick = {this.selectStaff.bind(this, item.number)}>{item.name}</p>
                    )
                  })
                )}
              </div>
            </Wrapper>
          ):(
            <SpinnerWrapper>
              <Spinner animation="border" variant="secondary" />
            </SpinnerWrapper>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={closeModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.saveBody.bind(this)}>登録</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DialSelectFacilityOtherModal.contextType = Context;

DialSelectFacilityOtherModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  MasterName:PropTypes.string,
};

export default DialSelectFacilityOtherModal;