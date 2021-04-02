import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import RadioButton from "~/components/molecules/RadioButton";
import Radiobox from "~/components/molecules/Radiobox";
import {formatJapanDate} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
// import {formatDateSlash} from "~/helpers/date";
import ja from "date-fns/locale/ja";    
registerLocale("ja", ja);
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 100%;
  float: left;
  .flex{
      display:flex;
      margin-bottom:5px;
      font-size:18px;
      padding-left:40px;
  }
  .sub-title{
    
  }
  .calendar-area{
    .react-datepicker{
        width:80%;
        margin-left:10%;
    }
  }
  
  .react-datepicker-wrapper {
    width: 100%;
    .react-datepicker__input-container {
        width: 100%;
        input {
            font-size: 14px;
            width: 100%;
            height: 38px;
            border-radius: 4px;
            border-width: 1px;
            border-style: solid;
            border-color: rgb(206, 212, 218);
            border-image: initial;
            padding: 0px 8px;
        }
    }
}
  .content{
    padding-left:5%;
    padding-left:5%;
  }
  .label-title{
    text-align: left;
    width: 160px;
    font-size:16px;
   }
  .pullbox-select{
    width:150px;
  }
  .radio-area{
    justify-content: space-around;
  }
  .radio-btn{
    margin-left: 0.625rem;
    label{
        border: solid 1px gray;
        border-radius:0;
        margin-left: 0.625rem;
        width:70px
    }
  }
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
    .ixnvCM{
        font-size: 15px;
        padding-top: 8px;
    }
  `;


class SelectDateModal extends Component {
    constructor(props) {
        super(props);        
        this.state = {
            isUpdateConfirmModal: false,
            confirm_message:"",
            gensa_date: new Date()
        }
        this.sampleOptions = [
            {id:0, value:''},
            {id:1, value:'サンプル1'},
            {id:2, value:'サンプル2'},
            {id:3, value:'サンプル3'},
            {id:4, value:'サンプル4'},
        ];
        this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }

    getAlwaysShow = (name, value) => {
        if(name==="alwaysShow"){
            this.setState({is_enabled: value})
        }
    };
    
    

    async registerMaster()  {
        let path = "/app/api/v2/master/inspection/registerMasterData";
        const post_data = {
            params: this.state
        };        
        await apiClient.post(path, post_data).then((res)=>{
          if (res)
                window.sessionStorage.setItem("alert_messages", res.alert_message);
        });
    }

    confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            confirm_message: "",
        });
    }
    getInputText = (index, e) => {
      if (e.target.value != '') return;
      switch(index){
        case 0:
          this.setState({discharge_date:''});
          break;
        case 1:
          this.setState({reason:''});
          break;        
      }
    }

    getFreeCommnet(e) {
      this.setState({free_comment:e.target.value});
    }

    getKind (e) {
        this.setState({kind_id:e.target.value})
    }

    selectPeriod(e){
        this.setState({period:e.target.value})
    }

    getGensaDate = (value) => {
      this.setState({
          gensa_date:value,
      });
    }

    registerDate = () => {
      if (this.state.gensa_date != "") {
        this.props.registerOutHospitalDate(this.state.gensa_date);
      }
    }
    
    render() {
        const ExampleCustomInput = ({ value, onClick }) => (
            <div className="cur-date morning example-custom-input" onClick={onClick}>
                {formatJapanDate(value)}
            </div>
        );
        return  (
            <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>日付選択</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <DatePickerBox style={{width:"100%", height:"100%"}}>
                    <Wrapper>
                      <div className = "flex radio-area">
                        <RadioButton
                            id={0}
                            value={0}
                            label="当日"
                            name="date"
                            getUsage={this.selectPeriod}
                            checked={this.state.period == 0}
                        />
                        <RadioButton
                            id={1}
                            value={1}
                            label="2時間後"
                            name="date"
                            getUsage={this.selectPeriod}
                            checked={this.state.period == 1}
                        />
                        <RadioButton
                            id={2}
                            value={2}
                            label="4時間後"
                            name="date"
                            getUsage={this.selectPeriod}
                            checked={this.state.period == 2}
                        />
                        <RadioButton
                            id={3}
                            value={3}
                            label="3時間後"
                            name="date"
                            getUsage={this.selectPeriod}
                            checked={this.state.period == 3}
                        />
                        <RadioButton
                            id={4}
                            value={4}
                            label="12時間後"
                            name="date"
                            getUsage={this.selectPeriod}
                            checked={this.state.period == 4}
                        />
                      </div>
                      <div className='flex' style={{marginLeft:'50px'}}>
                        <Radiobox
                            id = {'kind_1'}
                            label={'1ヶ月表示'}
                            value={1}
                            getUsage={this.getKind.bind(this)}
                            checked={this.state.kind_id == 1 ? true : false}
                            name={`kind`}
                        />
                        <Radiobox
                            id = {'kind_2'}
                            label={'2ヶ月表示'}
                            value={2}
                            getUsage={this.getKind.bind(this)}
                            checked={this.state.kind_id == 2 ? true : false}
                            name={`kind`}
                        />
                      </div>
                      <div className='flex'>
                        <div className="date" style={{marginRight:'10px', width:'60px'}}>日付</div>
                        <DatePicker
                            locale="ja"
                            selected={this.state.gensa_date}
                            onChange={this.getGensaDate}
                            dateFormat="yyyy/MM/dd"                        
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>

                      <div className='calendar-area'>
                        <DatePicker
                            showPopperArrow={false}
                            locale="ja"
                            selected={this.state.schedule_date}
                            onChange={this.getDate}
                            dateFormat="yyyy/MM/dd"
                            inline
                            customInput={<ExampleCustomInput />}
                            dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>
                    </Wrapper>                    
                  </DatePickerBox>
                </Modal.Body>
                <Modal.Footer>  
                    <Footer>                      
                      <Button type="mono" onClick={this.registerDate}>{"登録"}</Button>
                      <Button type="mono" onClick={this.props.closeModal}>閉じる</Button>
                    </Footer>
                </Modal.Footer>
                {this.state.isUpdateConfirmModal !== false && (
                    <SystemConfirmJapanModal
                        hideConfirm= {this.confirmCancel.bind(this)}
                        confirmCancel= {this.confirmCancel.bind(this)}
                        // confirmOk= {this.register.bind(this)}
                        confirmTitle= {this.state.confirm_message}
                    />
                )}                
            </Modal>
        );
    }
}

SelectDateModal.contextType = Context;

SelectDateModal.propTypes = {
    closeModal: PropTypes.func,       
    registerOutHospitalDate: PropTypes.func,       
};

export default SelectDateModal;
