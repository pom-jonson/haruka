import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioButton from "~/components/molecules/RadioInlineButton"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import axios from "axios";
import Button from "~/components/atoms/Button";
import * as methods from "../DialMethods";
import * as sessApi from "~/helpers/cacheSession-utils";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import {makeList_codeName} from "~/helpers/dialConstants";

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

  .title-label{
    display: flex;
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 5px;    
  }
  .search_type {
    font-size: 14px;
      margin-top: 5px;
      display: flex;
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
        // margin-right: 10px;
        // width: 125px;
        label{
          width: 100%;
          padding: 0px 10px;
          color: white;
          font-size: 14px;
          border: solid 1px rgb(206, 212, 218);
          border-radius: 0px;
          margin-left: 5px;
        }
      }
}

.search_type_letter {
    font-size: 14px;
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

      .first-butotons{
        label{
            border-bottom: none;
        }
      }
}
    .kind {
      .radio-btn {
        // width: 80px;
      }
    }

    .common_code{        
        display: inline-block;
        .pullbox{
            width: 100%;        
            display: inline-block;
            background: #383535;
        }
        .pullbox-label{
            width: 100%;
            border: none;
            height: 35px;
        }
        .pullbox-title{
            width: 0px;
        }
        .pullbox-select{
            width: 100%;
            border:none;  
            height: 100%;      
            font-size: 14px;
        }
        .div-wheelchair{
            padding: 10px;
            float: right;
        }
      }
  .patient-list {
    background: white;
    margin-top: 5px;
    height: 50vh;
    overflow-y: scroll;
    width: 100%;
    border: solid 1px rgb(206,212,218);
    .radio-btn {
        label{
          font-size: 14px;
        }
      }
  }
     .search-box {
    input {
     width: 266px;
     margin-left: -24px;
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
      width: 100%;
      label {
        margin-top: 5px;
        font-size: 18px;
        color:white;
      }
   }
 `;

class SelectPatientListModal extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        let code_master = sessApi.getObjectValue("dial_common_master","code_master");
        let initState = {                    
            search_by_patient: 0,
            search_by_day: 0,
            search_by_time: 0,
            search_by_name_letter: 0,
            curCommonCode: 0,            
        }
        let condition = sessApi.getObjectValue("dial_setting","condition");    
        if (condition != undefined && condition != null) {
            initState = condition;
        }

        this.state = {                    
            search_by_patient: initState.search_by_patient,
            search_by_day: initState.search_by_day,
            search_by_time: initState.search_by_time,
            search_by_name_letter: initState.search_by_name_letter,
            curCommonCode: initState.curCommonCode,
            time_zone_list:getTimeZoneList(),
            dialGroups: makeList_codeName(code_master['グループ'], 1),
        }
    }

    getCommonCodeSelect = e => {      
        this.setState({ curCommonCode: parseInt(e.target.id)});        
    };

    searchByPatient = (e) => {
        this.setState({ search_by_patient: parseInt(e.target.value)});
    };

    searchByDay = (e) => {
        this.setState({ search_by_day: parseInt(e.target.value)});
    };

    searchByTime = (e) => {
        this.setState({ search_by_time: parseInt(e.target.value)});
    };

    searchByNameLetter = (e) => {
        this.setState({ search_by_name_letter: parseInt(e.target.value)});
    };

    handleOk = () => {
        let postData={
            search_by_patient: this.state.search_by_patient,
            search_by_day: this.state.search_by_day,
            search_by_time: this.state.search_by_time,
            search_by_name_letter: this.state.search_by_name_letter,
            curCommonCode: this.state.curCommonCode
        }
        sessApi.setObjectValue("dial_setting","condition", postData);
        this.props.getPatient(postData);
    }

    render() {       
        const { closeModal } = this.props;        
        var {dialGroups} = this.state;
        return  (
            <Modal show={true} onHide={closeModal} id="add_contact_dlg"  className="search-patient-modal">               
                <Modal.Body>
                    <Wrapper>
                        {/*<div className="title-label">透析曜日</div>
                        <div className="search_type">
                            <RadioButton
                                id="patient-0"
                                value={0}
                                label="全患者"
                                name="search_by_patient"
                                getUsage={this.searchByPatient}
                                checked={this.state.search_by_patient == 0}
                            />
                            <RadioButton
                                id="patient-1"
                                value={1}
                                label="透析中"
                                name="search_by_patient"
                                getUsage={this.searchByPatient}
                                checked={this.state.search_by_patient == 1}
                            />
                            <RadioButton
                                id="patient-2"
                                value={2}
                                label="一時転出含む"
                                name="search_by_patient"
                                getUsage={this.searchByPatient}
                                checked={this.state.search_by_patient == 2}
                            />
                        </div>*/}
                        <div className="title-label">透析曜日</div>

                        <div className="search_type kind">
                            <RadioButton
                                id="day-0"
                                value={0}
                                label="全て"
                                name="search_by_day"
                                getUsage={this.searchByDay}
                                checked={this.state.search_by_day == 0}
                            />
                            <RadioButton
                                id="day-1"
                                value={1}
                                label="月水金"
                                name="search_by_day"
                                getUsage={this.searchByDay}
                                checked={this.state.search_by_day == 1}
                            />
                            <RadioButton
                                id="day-2"
                                value={2}
                                label="火木土"
                                name="search_by_day"
                                getUsage={this.searchByDay}
                                checked={this.state.search_by_day == 2}
                            />
                        </div>

                        <div className="title-label">透析時間帯</div>

                        <div className="search_type kind">
                            <RadioButton
                                id="time-all"
                                value={0}
                                label="全て"
                                name="search_by_time"
                                getUsage={this.searchByTime}
                                checked={this.state.search_by_time == 0}
                            />
                            {this.state.time_zone_list != undefined && this.state.time_zone_list.length>0 &&(
                                this.state.time_zone_list.map((item)=>{
                                    return (
                                        <>
                                            <RadioButton
                                                id={`male_${item.id}`}
                                                value={item.id}
                                                label={item.value}
                                                name="usage"
                                                getUsage={this.searchByTime}
                                                checked={this.state.search_by_time === item.id ? true : false}
                                            />
                                        </>
                                    );
                                })
                            )}
                            {/*<RadioButton*/}
                                {/*id="time-1"*/}
                                {/*value={1}*/}
                                {/*label="午前"*/}
                                {/*name="search_by_time"*/}
                                {/*getUsage={this.searchByDay}*/}
                                {/*checked={this.state.search_by_time == 1}*/}
                            {/*/>*/}
                            {/*<RadioButton*/}
                                {/*id="time-2"*/}
                                {/*value={2}*/}
                                {/*label="午後"*/}
                                {/*name="search_by_time"*/}
                                {/*getUsage={this.searchByTime}*/}
                                {/*checked={this.state.search_by_time == 2}*/}
                            {/*/>*/}
                            {/*<RadioButton*/}
                                {/*id="time-3"*/}
                                {/*value={3}*/}
                                {/*label="夜間"*/}
                                {/*name="search_by_time"*/}
                                {/*getUsage={this.searchByDay}*/}
                                {/*checked={this.state.search_by_time == 3}*/}
                            {/*/>*/}
                            {/*<RadioButton*/}
                                {/*id="time-4"*/}
                                {/*value={4}*/}
                                {/*label="深夜"*/}
                                {/*name="search_by_time"*/}
                                {/*getUsage={this.searchByTime}*/}
                                {/*checked={this.state.search_by_time == 4}*/}
                            {/*/>*/}
                        </div>
                        <div className="title-label">患者氏名</div>
                        <div className={`search_type_letter`}>
                            <div>
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
                        <div className="title-label">グループ</div>
                        <div className="search_type w96 common_code">                                
                            <SelectorWithLabel
                                options={dialGroups}
                                title=""
                                getSelect={this.getCommonCodeSelect}
                                departmentEditCode={this.state.curCommonCode}                                    
                            />                            
                        </div>  
                        <div className="search_type">
                            <Button onClick={this.handleOk}>確定</Button>
                        </div>
                    </Wrapper>
                </Modal.Body>
            </Modal>
        );
    }
}

SelectPatientListModal.contextType = Context;

SelectPatientListModal.propTypes = {
    closeModal: PropTypes.func,
    getPatient: PropTypes.func,
};

export default SelectPatientListModal;
