import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Title from "../../atoms/Title";
import Context from "~/helpers/configureStore";
import TitleTabs from "../../organisms/TitleTabs";
import InjectionPresetTable from "../../organisms/InjectionPresetTable";
import InjectionSetDataSelection from "../../organisms/InjectionSetDataSelection";
import Button from "../../atoms/Button";
import * as colors from "../../_nano/colors";
import InjectionRemarks from "../../organisms/InjectionRemarks";
import InjectionInOutNav from "../../organisms/InjectionInOutNav";
import * as injectionMethods from "./methods";
import SelectUsageInjectModal from "./components/SelectUsageInjectModal";
import SelectDoctorModal from "./components/SelectDoctorModal";
import InjectCalc from "../../molecules/InjectCalc";
import BodyParts from "../../molecules/BodyParts";
import { getCurrentDate } from "../../../helpers/date";
import DepartmentModal from "../../organisms/DepartmentModal";
import { persistedState } from "../../../helpers/cache";
import auth from "~/api/auth";

const InjectionWrapper = styled.div`
  width: 100%;
  padding-top: 12px;
`;

const InjectionMain = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  width: 100%;
`;

const Col = styled.div`
  width: 48%;
`;

const WrapperContainer = styled.div`
  max-height: calc(100vh - 260px);
  overflow: auto;
`;

const Flex = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 4px 0;
  position: relative;  
  width: 100%;
  z-index: 100;
  .label-title {
    text-align: right;
    width: auto;
    margin: 0 8px 0 24px;
  }
  select {
    width: 120px;
  }
  label {
    margin: 0;
  }
  button {
    background-color: ${colors.surface};
    min-width: 80px;
    margin-left: 24px;
  }
`;

const InputBox = styled.div`
  display: flex;
  margin-left: 0px;
  width: 80%;
  label {    
    color: ${colors.onSecondaryDark};
    font-size: 14px;
    line-height: 38px;
    letter-spacing: 0.4px;
    margin-right: 12px;
    width: 80px;
  }
  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    background: ${colors.surface};
    color: ${colors.onSecondaryDark};    
    font-size: 12px;
    padding: 0 8px;
    width: 70%;
    height: 38px;
    margin-left: 12px;
  }
  input::-ms-clear {
    visibility: hidden;
  }
`;

// @enhance
class Injection extends Component {
  constructor(props) {
    super(props);
    // Object.entries(methods).forEach(([name, fn]) =>
    //   name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    // );
    Object.entries(injectionMethods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
  }

  componentDidUpdate() {
    if (
      document.getElementById("Injection_dlg") !== undefined &&
      document.getElementById("Injection_dlg") !== null
    ) {
      document.getElementById("Injection_dlg").focus();
    }
  }

  async componentDidMount() {
    this.resetState();
    window.localStorage.setItem("injection_selection_wrapper_scroll", 0);
    window.localStorage.removeItem("haruka_inject_edit_cache");
    if(this.context.department.code == 0){
      this.context.department.code = 1;
      this.context.department.name = "内科";
    }    
    await this.getInjectionSetData(0, 0, 0, 1);
    await this.getHistoryInjectionApi({
      id: this.props.match.params.id,
      limit: 10,
      offset: this.state.offset
    });
    this.setState(
      {
        isLoaded: true,
        changeDepartmentModal: false,
        departmentName: "内科",
        departmentDate: "",
        departmentNumber: 0,
      },
      () => {
        this.getDoctorsList();
        this.getUsageInjectData();
        this.context.$updateStaffCategory(this.state.staff_category);
        let injectData = this.state.injectData;
        injectData[0].start_date = getCurrentDate();
        this.setState({
          departmentId: this.context.department.code,
          department: this.context.department.name,
          injectData
        });
        this.state.injectionDBHistory.map(medicine => {
          if (medicine.history != "") {
            this.getTrackData(medicine.number);
          }
        });
        
        this.loadInjectCachedData();
      }
    );

    let { cacheDelState } = persistedState();
    if (cacheDelState) {
      this.getDelData(cacheDelState);
    }
    auth.refreshAuth(location.pathname+location.hash);
  }

  getFreeComment = e =>  
    this.setState({ free_comment: e.target.value }, function() {
      this.storeInjectionDataInCache();
    });

  dayCancel = () =>
    this.setState({ isDaysOpen: false, daysInitial: 0, daysLabel: "" });

  onDragOver = e => {
    e.preventDefault();
  };

  onDropEvent = e => {  
    this.onInjectionDrop(e.dataTransfer.getData("text"));            
  }

  openBodyParts = index =>
    this.setState({ isBodyPartOpen: true, indexOfEditPres: index });

  //usage
  onSelectUsage = indexOfInject => {
    this.setState({
      amountTyped: false,
      usageOpen: true,
      usageModal: true,
      indexOfEditPres: indexOfInject
    });
  }

  closeBodyParts = () =>
    this.setState({ isBodyPartOpen: false, indexOfEditPres: -1 });


  closeUsage = () => this.setState({ usageModal: false, usageOpen: false });

  getDoctor = async (e) => {
    this.selectInjectDoctorFromModal(e.target.id, e.target.getAttribute("label"));    
    this.setState(
      {
        isLoaded: false
      });  

    await this.getInjectionSetData(e.target.id, this.context.department.code, 0, 0);    
  }

  handleClose = () => {
    this.setState({
      changeDepartmentModal: false,
    });
  }

  handleChange = (e) => {
    this.setState({
      preset_name: e.target.value
    });
  } 

  handleClick = () => {
    this.sendRegisterSetData();
  }

  handleDeleteOrder = injection => {     
    this.deleteInjectOrders(injection.preset_number);
  }

  handleChangeDeparment = (code) => {
    this.setState({
      changeDepartmentModal: false,
    });
    this.setDepartment(this.state.departmentNumber, code);
  }

  handleEditOrder = injection => {       
    this.setState({
      isForUpdate:true,
      preset_name: injection.preset_name
    });       

    
    this.editInjectOrders(injection);
  }

  changeDepartment = (injection) => {
    this.setState({
      changeDepartmentModal: true,
      departmentDate: injection.updated_at,
      departmentNumber: injection.number,
      departmentCode: injection.order_data.department_code,
      departmentName: injection.order_data.department      
    });
  }

  render() {   
    const { indexOfInsertPres, indexOfInsertMed, injectData } = this.state;
    const indexPres =
      indexOfInsertPres === -1 || indexOfInsertPres >= injectData.length
        ? injectData.length - 1
        : indexOfInsertPres;
    var indexMed =
      indexOfInsertMed === -1 ||
      indexOfInsertMed >= injectData[indexPres].medicines.length
        ? injectData[indexPres].medicines.length - 1
        : indexOfInsertMed;
    var units = [];    
    const tabs = [
      {
        id: 0,
        title: "セット"
      }
    ];

    if (injectData[indexPres].medicines[indexMed] == undefined) {
      indexMed = injectData[indexPres].medicines.length - 1;
    }
    if (injectData[indexPres].medicines[indexMed].main_unit === undefined) {
      if (
        injectData[indexPres].medicines[indexMed].units_list !== undefined &&
        injectData[indexPres].medicines[indexMed].units_list.length > 0
      ) {
        units = injectData[indexPres].medicines[indexMed].units_list;
      } else {
        units = [
          {
            name: injectData[indexPres].medicines[indexMed].unit,
            main_unit_flag: 0              
          }
        ];
      }
    } else {
      units = injectData[indexPres].medicines[indexMed].units;
    }
    return (
      <>
        <InjectionWrapper>        
          <InjectionMain>
            <Col>
              <TitleTabs
                tabs={tabs}
                id={this.state.titleTab}
              />  
              {this.state.titleTab == 0 && this.state.isLoaded === true && (
                <InjectionSetDataSelection
                  isLoaded={this.state.isLoaded}
                  patientId={this.props.match.params.id}
                  allPrescriptionOpen={this.state.allPrescriptionOpen}
                  doctors={this.state.doctors}
                  doctor_code={this.context.selectedDoctor.code}
                  doctor_name={this.context.selectedDoctor.name}
                  setDoctorInfo={this.setDoctorInfo}
                  injectionHistory={this.state.injectionSetData}
                  consent={this.consent}
                  copyOrder={this.copyInjectionOrder}
                  copyOrders={this.copyInjectionOrders}
                  editOrders={this.handleEditOrder}
                  deleteOrders={this.handleDeleteOrder}
                />
              )}
            </Col>
            <Col>
              <Title title="注射" />
              <Flex>
                <InputBox>
                  <label>セット名</label>
                  <input type="text"
                    onChange={this.handleChange}
                    value={this.state.preset_name}
                  />               
                </InputBox>
                <Button type="mono"
                  onClick={this.handleClick}
                >
                  登録
                </Button>              
              </Flex>
              <InjectionInOutNav
                selectInOut={this.selectInOut}
                id={this.state.inOut}
                unusedDrugSearch={this.state.unusedDrugSearch}
                profesSearch={this.state.profesSearch}
                normalNameSearch={this.state.normalNameSearch}
                getRadio={this.getInjectRadio}
                patientId={this.props.patientId}
              />     
              <WrapperContainer
                id="prescribe-container"
                onDrop={e => this.onDropEvent(e)}
                onDragOver={e => this.onDragOver(e)}
              >
                <InjectionPresetTable
                  injectData={this.state.injectData} 
                  onSelectUsage={this.onSelectUsage} 
                  changeAmountOrDays={this.changeInjectAmountOrDays}  
                  unusedDrugSearch={this.state.unusedDrugSearch}
                  profesSearch={this.state.profesSearch}
                  normalNameSearch={this.state.normalNameSearch} 
                  setDoctorInfo={this.setDoctorInfo}
                  doctors={this.state.doctors}
                  doctor_code={this.context.selectedDoctor.code}
                  doctor_name={this.context.selectedDoctor.name}  
                  storeDataInCache={this.storeInjectionDataInCache} 
                  insertMed={this.insertInjectMed}         
                  openBodyParts={this.openBodyParts}
                  resetPresData={this.resetInjectData}
                  bodyPartData={this.state.bodyPartData}
                  selectDoctorFromModal={this.selectInjectDoctorFromModal}
                  patientInfo={this.state.patientInfo}
                  confirm={this.confirm}
                  patientId={this.props.patientId}
                />               
                <Title title="備考・その他" />
                <InjectionRemarks
                  getFreeComment={this.getFreeComment}
                  free_comment={this.state.free_comment}
                /> 
              </WrapperContainer>             
            </Col>
            {this.context.autoLogoutModalShow === false &&
            this.state.usageOpen ? (
              <SelectUsageInjectModal
                closeUsage={this.closeUsage}
                getUsage={this.getInjectUsage}
                getUsageFromModal={this.getUsageInjectFromModal}
                usageInjectData={this.state.usageInjectData}
              />
            ) : (
              ""
            )} 
            {this.context.autoLogoutModalShow === false &&
            this.context.needSelectDoctor === true ? (
              <SelectDoctorModal
                closeDoctor={this.closeDoctor}
                getDoctor={this.getDoctor}
                selectDoctorFromModal={this.selectInjectDoctorFromModal}
                doctors={this.state.doctors}
              />
            ) : (
              ""
            )}
            {this.context.autoLogoutModalShow === false && this.state.isDaysOpen ? (
              <InjectCalc
                calcConfirm={this.daysInjectConfirm}
                units={[]}
                daysSelect={true}
                calcCancel={this.dayCancel}
                daysInitial={this.state.daysInitial}
                daysLabel={this.state.daysLabel}
                daysSuffix={this.state.daysSuffix}
                usageData={this.state.usageInjectData}
              />
            ) : (
              ""
            )} 
            {this.context.autoLogoutModalShow === false &&
            this.state.isAmountOpen ? (
              <InjectCalc
                calcConfirm={this.amountInjectConfirm}
                units={units}
                calcCancel={this.amountInjectCancel}
                daysSelect={false}
                daysInitial={this.state.daysInitial}
                daysLabel=""
                daysSuffix=""
                usageData={this.state.usageInjectData}
                bodyPartData={this.state.bodyPartData}
                showedPresData={this.state.showedPresData}
              />
            ) : (
              ""
            )}  
            {this.context.autoLogoutModalShow === false &&
            this.state.isBodyPartOpen ? (
              <BodyParts
                bodyPartData={this.state.bodyPartData}
                closeBodyParts={this.closeBodyParts}
                usageName={
                  this.state.injectData[this.state.indexOfEditPres].usageName
                }
                body_part={
                  this.state.injectData[this.state.indexOfEditPres].body_part
                }
                bodyPartConfirm={this.bodyPartInjectConfirm}
              />
            ) : (
              ""
            )}  
            {this.state.changeDepartmentModal && (
              <DepartmentModal
                hideModal={this.handleClose}
                handleCancel={this.handleClose}
                handleChangeDeparment={this.handleChangeDeparment}
                departmentList={this.departmentOptions}
                departmentName={this.state.departmentName}
                departmentCode={this.state.departmentCode}
                departmentDate={this.state.departmentDate}
              />
            )}  
          </InjectionMain>        
        </InjectionWrapper>        
      </>
    );
  }
}
Injection.contextType = Context;

Injection.propTypes = {
  patientInfo: PropTypes.object.isRequired,
  patientId: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  history: PropTypes.object
};

export default Injection;
