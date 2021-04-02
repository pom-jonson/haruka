import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/pro-solid-svg-icons";
import SearchBar from "~/components/molecules/SearchBar"
import { withRouter } from "react-router-dom";
import * as sessApi from "~/helpers/cacheSession-utils";
// import auth from "~/api/auth";
import SelectPatientListModal from "../templates/Dial/modals/SelectPatientListModal";
import * as localApi from "~/helpers/cacheLocal-utils";

const Icon = styled(FontAwesomeIcon)`
  color: white;
  font-size: 26px;
  margin-right: 5px;
  cursor: pointer;
`;

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: 200px;
  margin: 0px;
  height: 100vh;
  float: left;
  background: rgb(63,16,64);
.title {
  font-size: 20px;
  color : white;
  font-weight: bolder;
  padding: 20px 7px 20px 7px;
  background: rgb(43,0,44);
  text-align: center;
}
.patient-item {
    font-size: 15px;
    text-align: left;
    margin-top: 5px;
    color: rgb(248, 250,252)! important;
    padding: 0 10px;
    display: flex;
    cursor: pointer;
}
.patient-name {
     width: 70%;
     text-align:left;
}
.patient-id {
     width: 30%;
     text-align: right;
}
.patient-list {
    div:nth-child(odd) {background-color: rgb(77, 43, 77);}
    padding-top: 10px;
    overflow-y: auto;
    // overflow-x: hidden;
    height: calc(100vh - 270px);
}
 p{
    margin: 0;
 }
 .list-title {
    display: flex;
    color: white;
    margin-left:15px;
    margin-right:7px;
 }
 .footer {
    color: white;
    text-align: center;
    .flex-title {
        display: flex;
        margin-bottom: 2px;
    }
    .border {
        width: 33%;
        font-size: 14px;
        border: solid 1px #744e74 !important;
    }
 }
 .ptm-2 {
    padding: 15px 0;
 }
 .patient-item::-webkit-scrollbar-thumb {
  background-color: rgb(43,0,44);
  outline: 1px solid slategrey;
}
.search_patient{
    display:flex;
    input{
        background: wheat;
        height: 33px;
        margin-left: 3px;
    }
    .search-box{
        width: 167px;
        input{
            width: 100%;
        }
    }
}
.click{
    cursor:pointer;
}
.patient-item.selected{
    background: darkcyan!important;
}
 `;


class DialSideBar extends Component {
  constructor(props) {
    super(props);
    let patientInfo = sessApi.getObjectValue("dial_setting","patient");
    // let sortOrder = sessApi.getObjectValue("dial_setting","order");
    this.state = {
      patientList: [],
      schVal:'',
      // sort_order:sortOrder != undefined && sortOrder != null ? sortOrder : true,
      sort_order:true, // default: kana_name
      selected_id:patientInfo != undefined && patientInfo != null?patientInfo.system_patient_id:0,
      isOpenSearchPatientListModal:false,
    }
  }
  
  async componentDidMount(){
    let patientInfo = sessApi.getObjectValue("dial_setting","patient");
    if(patientInfo != undefined && patientInfo != null){
      localApi.setValue("current_system_patient_id", patientInfo.system_patient_id);
    }
    var path = window.location.href.split("/");
    if (path[path.length - 2] != "#") { // if url: front/dist/#/ not run
      this.getPatientList();
    }
  }
  
  getPatientList = async (params) => {
    this.setState({
      isOpenSearchPatientListModal: false
    });
    
    if (params == null || params == undefined || params == "") {
      params = sessApi.getObjectValue("dial_setting","condition");
      if (params == null || params == undefined || params == "") {
        params = {
          search_by_patient: 0,
          search_by_day: 0,
          search_by_time: 0,
          search_by_name_letter: 0,
          curCommonCode: 0,
        }
      }
    }
    let path = "/app/api/v2/dial/patient/list_condition";
    var post_data = {
      keyword:this.state.schVal,
      sort_order:this.state.sort_order,
      condition: params
    }
    const { data } = await axios.post(path, {param:post_data});
    if(data != undefined && data !=null){
      this.setState({
        patientList:data
      });
    } else {
      this.setState({
        patientList:[]
      });
    }
    return data
  };
  
  // async UNSAFE_componentWillMount(){
  //     if (auth.isAuthenticated()){
  //         this.getPatientList();
  //     }
  // }
  
  onPatientClick = (patient, id) => {
    this.setState({selected_id:id});
    localApi.setValue("current_system_patient_id", id);
    sessApi.setObjectValue("dial_setting", "patient", patient);
    this.props.history.replace(`/patients/${id}/soap`);
  };
  
  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.getPatientList();
    }
  };
  search = word => {
    word = word.toString().trim();
    this.setState({ schVal: word });
  };
  
  sortByName = () => {
    sessApi.setObjectValue("dial_setting","order", !this.state.sort_order);
    this.setState({sort_order:!this.state.sort_order}, () => {
      this.getPatientList();
    })
  }
  
  handleSearchPatientByCondition = () => {
    this.setState({
      isOpenSearchPatientListModal: true
    });
  }
  
  closeModal = () => {
    this.setState({
      isOpenSearchPatientListModal: false
    });
  }
  
  changeSelectedPatient = () => {
    let arr_patient_list = this.state.patientList;
    if (arr_patient_list.length < 1) {
      return;
    }
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    let patientInfo = "";
    arr_patient_list.map(item=>{
      if (item.system_patient_id == current_system_patient_id) {
        patientInfo = item;
      }
    });
    
    if (patientInfo != undefined && patientInfo != null){
      this.setState({
        selected_id: patientInfo.system_patient_id
      });
      sessApi.setObjectValue("dial_setting", "patient", patientInfo);
    }
  }
  
  render() {
    var path = window.location.href.split("/");
    let nIdx = path.indexOf("patients");
    let nIndex = path.indexOf("dial_patients");
    if ((nIdx > 0 && nIdx != path.length - 1 && this.context.currentSystem == "dialysis") || nIndex >= 0 ) { // 透析 (show->DialSideBar)
      this.props.setDesign("dial_patient");
    } else { // HARUKA (hide->DialSideBar)
      this.props.setDesign("patient");
    }
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    if (current_system_patient_id != this.state.selected_id && current_system_patient_id != 0) {
      this.changeSelectedPatient();
    }
    
    return (
      <>
        {(nIdx > 0 && nIdx != path.length - 1 && this.context.currentSystem == "dialysis") || nIndex >= 0 ? (
          <Card>
            <div className="title">透析支援システム</div>
            <div className="list-title ptm-2">
              <p className="patient-name">患者一覧</p>
              <p className="patient-id">{this.state.patientList.length}名</p>
            </div>
            <div className="patient-list">
              {this.state.patientList.map((patient,index) => {
                return (
                  <div className={this.state.selected_id == patient.system_patient_id?"patient-item selected":"patient-item"} key={index}  onClick={()=>this.onPatientClick(patient, patient.system_patient_id)}>
                    <p className="patient-name" >{patient.patient_name}</p>
                    <p className="patient-id">{patient.patient_number}</p>
                  </div>
                )
              })}
            </div>
            <div className="footer">
              <div className="ptm-2 click">全患者</div>
              <div className="flex-title">
                <div className="border ptm-2" onClick={this.handleSearchPatientByCondition} style={{width:"50%"}}>絞り込み</div>
                <div className="border ptm-2" onClick={this.sortByName} style={{width:"50%"}}>並び替え</div>
              </div>
              <div className="search_patient">
                <Icon icon={faUser}></Icon>
                <SearchBar
                  placeholder=""
                  search={this.search}
                  enterPressed={this.enterPressed}
                />
              </div>
            </div>
            {this.state.isOpenSearchPatientListModal && (
              <SelectPatientListModal
                closeModal={this.closeModal}
                getPatient={this.getPatientList}
              />
            )}
          </Card>
        ):(
          <></>
        )}
      </>
    )
  }
}

DialSideBar.contextType = Context;

DialSideBar.propTypes = {
  getPatientList: PropTypes.func,
  onGoto: PropTypes.func,
  updateFavouriteList: PropTypes.func,
  setDesign: PropTypes.func,
  history: PropTypes.object
};

export default withRouter(DialSideBar)