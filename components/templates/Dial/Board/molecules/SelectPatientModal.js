import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioButton from "~/components/molecules/RadioInlineButton"
// import RadioInlineButtonsList from "~/components/molecules/RadioInlineButtonsList"
import SearchBar from "../../../../molecules/SearchBar";
import * as sessApi from "~/helpers/cacheSession-utils";
import axios from "axios";
import {formatDateLine} from "~/helpers/date";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  .patient-number{
    width:150px;
  }
  .patient-name{
    width:100%;
  }
  .search-box {
    margin-top:3px;
    margin-left: 0px;
    input {
      width: 474px;      
    }
  }
  .search_type {
    font-size: 14px;
    margin-top: 5px;
    display: flex;

    .radio-btn {
      margin-right: 10px;
      width: 230px;
      label{
        width: 100%;
        color: white;
        font-size: 14px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0px;
        margin-left: 5px;
      }
    }
  }

  .kind {
    .radio-btn {
      width: 150px;        
    }
  }

  .patient-list {
    background: white;
    margin-top: 5px;
    height: 47vh;
    overflow-y: scroll;
    width: 100%;
    border: solid 1px rgb(206,212,218);
    text-align: left;
    padding-left: 3px;
    font-size: 16px;
    color:black;
    div:hover{
      background-color: lightblue;
    }
    div{
      padding-top:3px;
      cursor:pointer;
    }
  }
  
  .letter_group{
    span{
      margin: 5px 15px;
      cursor: pointer;
    }
  }
  .all-patient{
    border: solid 1px rgb(206,212,218);
    width: 470px;
    margin-left:5px;
    label {
      margin-top: 5px;
      font-size: 18px;
      color:white;
    }
  }
  .disabled{
    opacity:0.3;
  }
  .search_type_letter {
    font-size: 13px;
    margin-top: 5px;
    display: inline-block;
    width: 100%;
    .focused{
      label{
        color: black !important;
      }
    }
    button{
        width:100%;
        padding: 10px 0px;
        span{
            font-size: 16px;
        }
    }
    .radio-btn {
      width: 40px;
      display: block;
      float: left;
      label{
        width: 100%;
        padding: 0px 10px;
        color: white;
        font-size: 14px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0px;
        margin-left: 5px;
        margin-bottom: 0px;
      }
    }
    .all-letters{
      .radio-btn{
        width:70px;
      }
    }

    .first-butotons{
      label{
          // border-bottom: none;
      }
    }
}
 `;
class SelectPatientModal extends Component {
    constructor(props) {
        super(props);
        let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
        if(schedule_date == undefined || schedule_date == null) schedule_date = new Date();
        this.search_end = false;
        this.cnt_request = 0;
        this.cnt_response = 0;
        this.state = {
            schVal: "",
            search_by_date: 0,
            search_by_order: 0,
            search_by_name_letter: 0,
            schedule_date:formatDateLine(schedule_date),
            is_loaded: false,
        }
    }
    async componentDidMount(){
        let server_time = await getServerTime();
        this.cnt_request = 0;
        this.cnt_response = 0;
        let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
        if(schedule_date == undefined || schedule_date == null) schedule_date = new Date(server_time);
        this.searchPatientList();
        this.setState({
            schedule_date:formatDateLine(schedule_date),
        })
    }

    getPatient = (patient) => {
        this.props.getPatient(patient);
    };

    searchByDate = (e) => {
        this.search_end = false;
        if (e.target.value == 1 && this.state.search_by_order ==2 ){
            this.setState({
                search_by_date:parseInt(e.target.value),
                search_by_order:0,
                is_loaded:false,
                patientList:[]
            }, () => {
                this.searchPatientList();    
            })
        } else {
            this.setState({ search_by_date: parseInt(e.target.value), patientList:[], is_loaded:false}, () => {
                this.searchPatientList();
            });
        }
    };
    searchByKind = (e) => {
        this.search_end = false;
        this.setState({ search_by_order: parseInt(e.target.value), is_loaded:false, patientList:[]}, () =>{
            this.searchPatientList();
        });    
    };
    getAllPatient = () => {
        this.search_end = false;
        this.setState({
            keyword:'',
            search_by_name_letter:0,
            search_by_date:1,
            search_by_order:0,
            patientList:[],
            is_loaded:false,
        }, () => {
            this.searchPatientList();
        })
    }
    enterPressed = e => {        
        let code = e.keyCode || e.which;
        if (code === 13) {
            this.search_end = false;
            this.setState({patientList:[], is_loaded:false}, () => {
                this.searchPatientList();
            })            
        }
    };
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };
    
    searchPatientList = () => {
        this.cnt_request++;
        let path = "/app/api/v2/dial/patient/list";
        let post_data = {
            schDate: this.state.search_by_date,
            keyword: this.state.schVal,
            search_by_name_letter:this.state.search_by_name_letter,
            search_by_order:this.state.search_by_order,
            schedule_date:this.state.schedule_date,
            cnt_request: this.cnt_request,
        };
        axios.post(path,{param:post_data}).then((res) => {            
            this.cnt_response++;            
            if(this.cnt_request == res.data.cnt_response) {
                this.setState({patientList:res.data.data, is_loaded:true});
                this.search_end = true;                
                this.cnt_request = 0;
                this.cnt_response = 0;
            }            
        }).catch((err)=>{            
            this.cnt_response++;
            if(this.cnt_request == err.data.cnt_response) {
                this.setState({patientList:[], is_loaded:true});
                this.search_end = true;                
                this.cnt_request = 0;
                this.cnt_response = 0;
            }            
        });
        
    };

    searchByNameLetter = (e) => {
        this.search_end = false;
        this.setState({ search_by_name_letter: parseInt(e.target.value), patientList:[], is_loaded:false,}, ()=> {
            this.searchPatientList();
        });
    };

    render() {
        const patientList = [];
        if(this.state.patientList != undefined && this.state.patientList != null && this.state.patientList.length>0){
            this.state.patientList.map((patient) => {
                patientList.push(
                    // <RadioInlineButtonsList
                    //     key={index}
                    //     id={index}
                    //     label={patient.patient_number + " : " + patient.patient_name}
                    //     getUsage={this.getPatient}
                    //     // checked={index === this.state.usageSelectIndex}
                    // />
                    <>
                    <div style={{display:'flex'}} onClick={this.getPatient.bind(this,patient)}>
                      <div className='patient-number'>{patient.patient_number}</div>
                      <div className='patient-name'>{patient.patient_name}</div>
                    </div>
                    </>
                );
            });
        }

        const { closeModal } = this.props;
        return  (
            <Modal show={true} onHide={closeModal} id="add_contact_dlg"  className="master-modal patient-modal">
                <Modal.Header>
                    <Modal.Title>患者未選択</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="search_type">
                            <RadioButton
                                id="cur-date"
                                value={0}
                                label="本日透析"
                                name="search_by_date"
                                getUsage={this.searchByDate}
                                checked={this.state.search_by_date === 0}
                            />
                            <RadioButton
                                id="whole-date"
                                value={1}
                                label="全体"
                                name="search_by_date"
                                getUsage={this.searchByDate}
                                checked={this.state.search_by_date === 1}
                            />
                        </div>
                        <div className="search_type kind">
                            <RadioButton
                                id="kana-search"
                                value={0}
                                label="かな順"
                                name="search_by_order"
                                getUsage={this.searchByKind}
                                checked={this.state.search_by_order === 0}
                            />
                            <RadioButton
                                id="number-search"
                                value={1}
                                label="患者番号順"
                                name="search_by_order"
                                getUsage={this.searchByKind}
                                checked={this.state.search_by_order === 1}
                            />
                            <RadioButton
                                id="bed-search"
                                value={2}
                                label="ベッド順"
                                name="search_by_order"
                                isDisabled = {this.state.search_by_date ==1?true:false}
                                className= {this.state.search_by_date ==1?"disabled":""}
                                getUsage={this.searchByKind}
                                checked={this.state.search_by_order === 2}
                            />
                        </div>
                        <div className={`all-patient`}>
                            <RadioButton
                                id="all-search"
                                value={0}
                                label="全患者"
                                name="all_search"
                                getUsage={this.getAllPatient}
                                checked={this.state.all_search === 1}
                            />
                        </div>
                        <div className="title-label" style={{marginTop:'7px'}}>患者氏名</div>
                        <div className={`search_type_letter`}>
                            <div className='all-letters'>
                                <RadioButton
                                    id="letter-0"
                                    value={0}
                                    label="全て"
                                    name="search_by_name_letter"
                                    getUsage={this.searchByNameLetter.bind(this)}
                                    checked={this.state.search_by_name_letter == 0}
                                />
                            </div>
                            <div className="first-butotons">
                                <RadioButton
                                    id="letter-1"
                                    value={1}
                                    label="あ"
                                    name="search_by_name_letter"
                                    getUsage={this.searchByNameLetter}
                                    checked={this.state.search_by_name_letter == 1}
                                />
                                <RadioButton
                                    id="letter-2"
                                    value={2}
                                    label="か"
                                    name="search_by_name_letter"
                                    getUsage={this.searchByNameLetter}
                                    checked={this.state.search_by_name_letter == 2}
                                />
                                <RadioButton
                                    id="letter-3"
                                    value={3}
                                    label="さ"
                                    name="search_by_name_letter"
                                    getUsage={this.searchByNameLetter}
                                    checked={this.state.search_by_name_letter == 3}
                                />
                                <RadioButton
                                    id="letter-4"
                                    value={4}
                                    label="た"
                                    name="search_by_name_letter"
                                    getUsage={this.searchByNameLetter}
                                    checked={this.state.search_by_name_letter == 4}
                                />
                                <RadioButton
                                    id="letter-5"
                                    value={5}
                                    label="な"
                                    name="search_by_name_letter"
                                    getUsage={this.searchByNameLetter}
                                    checked={this.state.search_by_name_letter == 5}
                                />    
                            </div>
                            <div>
                                <RadioButton
                                    id="letter-6"
                                    value={6}
                                    label="は"
                                    name="search_by_name_letter"
                                    getUsage={this.searchByNameLetter}
                                    checked={this.state.search_by_name_letter == 6}
                                />
                                <RadioButton
                                    id="letter-7"
                                    value={7}
                                    label="ま"
                                    name="search_by_name_letter"
                                    getUsage={this.searchByNameLetter}
                                    checked={this.state.search_by_name_letter == 7}
                                />
                                <RadioButton
                                    id="letter-8"
                                    value={8}
                                    label="や"
                                    name="search_by_name_letter"
                                    getUsage={this.searchByNameLetter}
                                    checked={this.state.search_by_name_letter == 8}
                                />
                                <RadioButton
                                    id="letter-9"
                                    value={9}
                                    label="ら"
                                    name="search_by_name_letter"
                                    getUsage={this.searchByNameLetter}
                                    checked={this.state.search_by_name_letter == 9}
                                />
                                <RadioButton
                                    id="letter-10"
                                    value={10}
                                    label="わ"
                                    name="search_by_name_letter"
                                    getUsage={this.searchByNameLetter}
                                    checked={this.state.search_by_name_letter == 10}
                                />    
                            </div>                            
                        </div>  
                        
                        {/* <div className={`letter_group`}>
                            {letterData.map((item, index)=> {
                                return (
                                    <span key={index}>{item.value}</span>
                                )
                            })}
                        </div> */}
                        <SearchBar
                            placeholder=""
                            search={this.search}
                            enterPressed={this.enterPressed}
                        />
                        
                        <div className="patient-list">
                            {patientList}
                            {this.state.is_loaded !==true && (
                                <>
                                    <SpinnerWrapper>
                                        <Spinner animation="border" variant="secondary" />
                                    </SpinnerWrapper>
                                </>
                            )}
                        </div>
                        
                    </Wrapper>
                    
                </Modal.Body>
            </Modal>
        );
    }
}

SelectPatientModal.contextType = Context;

SelectPatientModal.propTypes = {
    // patientList: PropTypes.array,
    closeModal: PropTypes.func,
    getPatient: PropTypes.func,
};

export default SelectPatientModal;
