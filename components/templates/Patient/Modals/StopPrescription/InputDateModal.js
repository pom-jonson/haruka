import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import Button from "~/components/atoms/Button";
import * as colors from "~/components/_nano/colors";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import { formatDateSlash } from "~/helpers/date";
registerLocale("ja", ja);
import {setDateColorClassName} from '~/helpers/dialConstants';
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  display: flex;
  .date-select {
    border: solid 1px #999;
    text-align: center;
    height: 30px;
    margin: 0;        
  }

  .div-flex{
    display: flex;
  }

  .date-input{
    .label-title{      
      width: 90px;
      font-size: 1rem;
      margin-top: 7px;
    }
  }

  .date-input-label{
    padding: 13px;
    margin-left: 20px;
  }

  .no-border{
    border: none !important;
    input{
      border: none !important;
      padding: 4px;
      width: 100%;
    }
  }

  .calendar-area{
    .react-datepicker{
        width:80%;
        margin-left:10%;
    }
  }
  .react-datepicker {
    .react-datepicker__day--highlighted-custom-1 {      
      background: #c8eef8;
      color: black;
    }
    .react-datepicker__day--highlighted-custom-2 {
      color: black;
      background: #fde9d9;
    }
    .react-datepicker__day--highlighted-custom-3 {
      color: black;
      background: #f4c2d5;
    }
    .react-datepicker__day--selected {
      background: #899cac;
    }
  }

  .moved-content-area{
    width: 100%;
    border: 1px solid black;
    height: 60vh;
    background: #ddd;
  }

  .middle-col{
    display: flex;
    flex-direction: column;
    height: 75vh;
    justify-content: flex-end;
    
    .btn-add{
      width: 30px;
      padding: 40px 5px;
      margin-left: 10px;
      background: #ddd;
      border: 1px solid black;
    }
  }

  .stop-date-area{
    display:flex;
    overflow: hidden;
    justify-content: center;
    .date-select{
      float: left;
      width: 110px;
    }
  }

  .search-order-results{
    overflow-y: auto;
    height: 25vh;
    width: 100%;
    margin-bottom: 10px;
    background: #ddd;
    border: 1px solid black;
  }

  .search-order-contents{
    overflow-y: auto;
    height: 35vh;
    width: 100%;
    background: #ddd;
    border: 1px solid black;
    table{
      background: white;
    }
  }

  table{
    width: 100%;
  }

  th {
    background-color: ${colors.midEmphasis};
    color: ${colors.surface};
    text-align: center;
    font-weight: normal;
    label {
      color: ${colors.surface};
    }
  }

  th,
  td {
    border: 1px solid ${colors.background};
    padding: 4px 8px;
  }

  .order-info-area{
    width: 100%;
    display: flex;
  }

  .order-info-area{
    justify-content: space-between;
  }

  .order-title{
    font-weight: bold;
    margin: 10px auto;
  }

  .current-disease{
    width: 50px;
    border: 1px solid black;
    background: #c8eef8;
  }
  .mid-disease{
    width: 50px;
    border: 1px solid black;
    background: #fde9d9;
  }
  .mid-implement-disease{
    width: 50px;
    border: 1px solid black;
    background: #f4c2d5;
  }
`;



class InputDateModal extends Component {
    constructor(props) {
      super(props);  
      this.state = {
        schedule_date:'',
        prescription_order_content_list:this.props.selected_rps,
      }
    }

    getDate = (value) => {
      this.setState({
        schedule_date:value,
      })
    }

    handleOk = () => {
      if (this.state.schedule_date == ''){
        window.sessionStorage.setItem("alert_messages", '中止日を入力してください。');
        return;
      }
      this.props.handleOk(this.state.schedule_date);
    }

    render() {
      var highlightWithRanges = [
        {
          "react-datepicker__day--highlighted-custom-1":
            this.props.progress_dates,
        },
        {
          "react-datepicker__day--highlighted-custom-2":
          this.props.stopping_dates,
        },
        {
          "react-datepicker__day--highlighted-custom-3":
          this.props.stopped_dates,
        },
      ];      
        return (
            <>
                <Modal show={true} id="outpatient" className="custom-modal-sm patient-exam-modal outpatient-modal stop-date-prescription first-view-modal">
                  <Modal.Header><Modal.Title>中止処方</Modal.Title></Modal.Header>
                    <Modal.Body>
                      <DatePickerBox>
                        <Wrapper>
                          <div className="left-col" style={{width:"50%"}}>
                            <div className="search-order-contents">
                                <table>
                                    <tr>
                                      <th>Rp</th>
                                      <th>内容</th>
                                      <th>数量</th>
                                      <th>単位</th>
                                    </tr> 
                                    {this.state.prescription_order_content_list.length > 0 && this.state.prescription_order_content_list.map((item, index)=>{                                                                            
                                      return(
                                        <tr key={index}>
                                          <td>{index + 1}</td>
                                          <td>
                                            {item.med.map(ele=>{
                                              return(
                                                <><div>{ele.item_name}</div></>
                                              );
                                            })}
                                          </td>
                                          <td>
                                            {item.med.map(ele=>{
                                              return(
                                                <><div style={{textAlign:"right"}}>{ele.amount}</div></>
                                              );
                                            })}
                                          </td>
                                          <td>
                                            {item.med.map(ele=>{
                                              return(
                                                <><div>{ele.unit}</div></>
                                              );
                                            })}
                                          </td>                                          
                                        </tr>
                                      );    
                                    })}          
                                </table>
                            </div>

                          </div>                        
                          <div className="right-col" style={{width:"50%"}}>
                            <div className='calendar-area'>
                              <DatePicker
                                  showPopperArrow={false}
                                  locale="ja"
                                  selected={this.state.schedule_date}
                                  onChange={this.getDate}
                                  dateFormat="yyyy/MM/dd"
                                  highlightDates={highlightWithRanges}
                                  inline
                                  dayClassName = {date => setDateColorClassName(date)}
                              />
                            </div> 
                            <div className="div-flex date-input" style={{marginLeft:"10%"}}>
                              <InputBoxTag
                                label="中止日"
                                type="text"
                                // getInputText={this.getFreeCommnet.bind(this)}
                                value={formatDateSlash(this.state.schedule_date)}
                              />
                              <div className="date-input-label">より中止</div>
                            </div>   
                            </div>                  
                        </Wrapper>
                      </DatePickerBox>
                    </Modal.Body>
                    <Modal.Footer>                        
                        <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                        <Button className="red-btn" onClick={this.handleOk}>確定</Button>
                    </Modal.Footer>
                    
                </Modal>
               
            </>
        );
    }
}

InputDateModal.contextType = Context;
InputDateModal.propTypes = {    
    handleOk: PropTypes.func,
    closeModal: PropTypes.func,    
    selected_rps : PropTypes.array,
    progress_dates : PropTypes.array,
    stopping_dates : PropTypes.array,
    stopped_dates : PropTypes.array,
};

export default InputDateModal;
