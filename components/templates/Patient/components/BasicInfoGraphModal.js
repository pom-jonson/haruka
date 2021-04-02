import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import RadioButton from "~/components/molecules/RadioInlineButton";
import { formatJapanDate, formatDateLine, formatDateIE} from "~/helpers/date";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import * as apiClient from "~/api/apiClient";
import BasicChart from "./BasicChart"
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
registerLocale("ja", ja);

const Wrapper = styled.div`
  display: block;
  max-width: 100%;  
  height: 100%;
  padding: 9px 9px 9px 2px;
  max-height: 700px;
  // overflow: auto;
  position: relative;
  .flex{
    display:flex;
    
  }
  .radio-area{
    margin-right:20px;
    .radio-btn label{
      width: 55px;
      border: 1px solid black!important;
      border-radius: 0;
      font-size: 20px;
    }
  }
  .label-title {
    font-size: 16px !important;
  }
  .label-unit {
    font-size: 16px !important;
  }
  input{
    width: 100% !important;
  }
  .prev-after-dial{
    label{
      font-size:20px;    
      margin-bottom:0px;
      cursor:pointer;
      font-weight:bold;
    }
    margin-left:20px;
    margin-right:20px;
    cursor:pointer;
  }
  .disabled{
    cursor:auto;
    opacity:0.5;
  }
  .cur-date{
    font-size:20px;
  }
  .chat-image {
    width: 100%;
    margin-left: 10px;    
 }

`;

export class BasicInfoGraphModal extends Component {
  constructor(props) {
    super(props);
    var height_search_type_array = ["年", "月", "週"];
    var vital_search_type_array = ["年", "月", "週",'日']; 
    var height_search_type = 1;
    var vital_search_type = 2;
    var search_date = new Date();
    var selected_period_type = '';

    if (this.props.modal_type == 0){
      selected_period_type = height_search_type_array[height_search_type];
    } else {
      selected_period_type = vital_search_type_array[vital_search_type];
    }

    this.state = {
      height_search_type_array,
      vital_search_type_array,
      height_search_type,
      vital_search_type,
      search_date,
      selected_period_type
    };
  }
  componentDidMount() {
    var cur_date = new Date();
    this.checkBeforeData(cur_date);
    this.checkAfterData(cur_date);
    this.getPeriod(cur_date);    
  }

  checkBeforeData =  async(cur_date) => {
    let path='';
    if (this.props.modal_type == 0){
      path = "/app/api/v2/patients/basic_data/searchHeightPrev";
    } else {
      path = "/app/api/v2/patients/basic_data/searchVitalPrev";
    }
    let post_data = {
      system_patient_id: this.props.patientId,
      search_date:formatDateLine(cur_date),
    };

    await apiClient.post(path, {
      params: post_data
    }).then((res) => {
    if (res.search_date != undefined && res.search_date != null && res.search_date != ''){
        this.setState({
          before_date: new Date(formatDateIE(res.search_date)),
        })
      } else {
        this.setState({before_date:undefined})
      }
    });
  }

  checkAfterData = async(cur_date) => {
    let path='';
    if (this.props.modal_type == 0){
      path = "/app/api/v2/patients/basic_data/searchHeightNext";
    } else {
      path = "/app/api/v2/patients/basic_data/searchVitalNext";
    }

    let post_data = {
      system_patient_id: this.props.patientId,
      search_date:formatDateLine(cur_date),
    };

    await apiClient.post(path, {
      params: post_data
    }).then((res) => {
      if (res.search_date != undefined && res.search_date != null && res.search_date != ''){
        this.setState({
          after_date: new Date(formatDateIE(res.search_date)),
        })
      } else {
        this.setState({after_date:undefined})
      }
    });
  }

  getPeriod = (cur_date) => {
    var start_date = new Date();
    var end_date = new Date();
    var year = cur_date.getFullYear();
    var month = cur_date.getMonth();
    switch(this.state.selected_period_type){
      case '年':
        start_date =formatDateLine(new Date(year, 0, 1));
        end_date = formatDateLine(new Date(year, 12, 0));
        break;
      case '月':
        start_date = formatDateLine(new Date(year, month, 1));
        end_date = formatDateLine(new Date(year, month +1, 0));
        break;
      case '週':        
        var first = cur_date.getDate() - cur_date.getDay(); // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6
        
        start_date.setDate(first);
        end_date.setDate(last);
        start_date = formatDateLine(start_date);
        end_date = formatDateLine(end_date);
        break;
      default:
        start_date = new Date(cur_date);
        start_date.setHours(0);
        start_date.setMinutes(0);
        start_date.setSeconds(0);
        end_date = new Date(cur_date);
        end_date.setHours(24);
        end_date.setMinutes(0);
        end_date.setSeconds(0);
        break;
    }
    this.setState({
      start_date,
      end_date,
    },()=> {
      
      if (this.state.selected_period_type =='日'){
        this.getGraphData(formatDateLine(cur_date), formatDateLine(cur_date));
      } else {
        this.getGraphData(start_date, end_date);
      }
    })
  }

  getGraphData = async(start_date, end_date) => {
    let post_data = {
      system_patient_id: this.props.patientId,
      start_date:start_date,
      end_date:end_date,
    };
    let path = ''
    if (this.props.modal_type == 0){
      path = "/app/api/v2/patients/basic_data/searchHeightPeriod";
    } else {
      path = "/app/api/v2/patients/basic_data/searchVitalPeriod";
    }
    
    await apiClient.post(path, {
      params: post_data
    }).then((res) => {
      this.setState({
        graph_data: res,        
      })
    });
  }

  getValue = (name, value) => {
    this.setState({[name]:value});
  };

  selectType = (modal_type, e) => {  
  if (modal_type == 0){
      this.setState({ 
        selected_period_type: this.state.height_search_type_array[parseInt(e.target.value)],
        height_search_type:parseInt(e.target.value),
      }, () => {
        this.getPeriod(this.state.search_date)
      });
    } else {
      this.setState({ 
        vital_search_type:parseInt(e.target.value),
        selected_period_type: this.state.vital_search_type_array[parseInt(e.target.value)],        
      }, ()=> {
        this.getPeriod(this.state.search_date);
      })
    }
  };

  getPrevData = async() =>{
    if (this.state.before_date != undefined){
      this.setState({
        after_date:this.state.search_date,
        search_date:this.state.before_date,
      }, () => {
        this.checkBeforeData(this.state.search_date);
        this.getPeriod(this.state.search_date);
      })
    } else {
      return false;
    }
  };

  getNextData = async() =>{  
    if (this.state.after_date != undefined){
      this.setState({
        before_date:this.state.search_date,
        search_date:this.state.after_date,
      }, () => {
        this.checkAfterData(this.state.search_date);
        this.getPeriod(this.state.search_date);
      })
    } else {
      return false;
    }  
  };

  getDate = value => {
    this.setState({
      search_date: value,
    }, () => {
      this.getPeriod(this.state.search_date);
    });
  };

  render() {
    const ExampleCustomInput = ({ value, onClick }) => (
        <div className="cur-date example-custom-input" onClick={onClick}>
          {formatJapanDate(value)}
        </div>
    );
    let {modal_type} = this.props;
    let {height_search_type_array, vital_search_type_array} = this.state;    
    return (
      <Modal
        show={true}        
        className="custom-modal-sm edit-graph-modal"
      >
        <Modal.Header>
          <Modal.Title>{modal_type == 0  ? "身長・体重" : "バイタル"}グラフ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              {modal_type == 0 && (
                <>
                  <div className="d-flex">
                    <div className="radio-area flex">
                    {height_search_type_array.map((item, index)=>{
                      return (
                          <>
                            <RadioButton
                              id={`male_${index}`}
                              value={index}
                              label={item}
                              name="height_type"
                              getUsage={this.selectType.bind(this, modal_type)}
                              checked={this.state.height_search_type === index}
                            />
                          </>
                      )
                    })}
                    </div>
                    <div className="d-flex">
                      <div className={this.state.before_date != undefined?"prev-after-dial":"prev-after-dial disabled"}  onClick={this.getPrevData}>
                        <label>前回</label>
                        <p>←</p>
                      </div>
                      <DatePicker
                          locale="ja"
                          selected={this.state.search_date}
                          onChange={this.getDate.bind(this)}
                          dateFormat="yyyy/MM/dd"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dayClassName = {date => setDateColorClassName(date)}
                          customInput={<ExampleCustomInput />}
                      />
                      <div className={this.state.after_date != undefined?"prev-after-dial":"prev-after-dial disabled"} onClick={this.getNextData}>
                        <label>次回</label>
                        <p style={{textAlign:'right'}}>→</p>
                      </div>
                    </div>
                  </div>

                  <div className={`d-flex`}>
                    <div className="ml-1 mt-2" style={{fontSize:16, paddingTop:'65px'}}>
                        <div className="text-center ml-3 mt-1 d-flex" style={{marginBottom:'45px'}}>
                            <div>身長</div>
                            <div className="ml-2" style={{color:'red', paddingTop:'10px'}}>●</div>
                        </div>
                        <div className="text-center mt-1 ml-3 d-flex">
                            <div>体重</div>
                            <div className="ml-2" style={{color:'blue', paddingTop:'10px'}}>■</div>
                        </div>                      
                    </div>                  
                    <div className="chat-image">
                        <BasicChart
                            showData={this.state.graph_data}                           
                            start_date = {this.state.start_date}
                            end_date = {this.state.end_date}
                            graph_kind = {this.props.modal_type}
                            selected_period_type = {this.state.selected_period_type}
                            modal_type = {modal_type}
                        />
                    </div>
                </div>
                </>
              )}
              {modal_type == 1 && (
                <>
                  <div className="d-flex">
                    <div className="radio-area flex">
                      {vital_search_type_array.map((item, index)=>{
                        return (
                          <>
                            <RadioButton
                                id={`male_${index}`}
                                value={index}
                                label={item}
                                name="height_type"
                                getUsage={this.selectType.bind(this, modal_type)}
                                checked={this.state.vital_search_type === index}
                            />
                          </>
                        )
                      })}
                    </div>
                    <div className="d-flex">
                      <div className={this.state.before_date != undefined?"prev-after-dial":"prev-after-dial disabled"}  onClick={this.getPrevData}>
                        <label>前回</label>
                        <p>←</p>
                      </div>
                      <DatePicker
                          locale="ja"
                          selected={this.state.search_date}
                          onChange={this.getDate.bind(this)}
                          dateFormat="yyyy/MM/dd"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          dayClassName = {date => setDateColorClassName(date)}
                          customInput={<ExampleCustomInput />}
                      />
                      <div className={this.state.after_date != undefined?"prev-after-dial":"prev-after-dial disabled"} onClick={this.getNextData}>
                        <label>次回</label>
                        <p>→</p>
                      </div>
                    </div>
                    </div>
                    <div className={`d-flex`}>
                      <div className="ml-1 mt-2 y-label" style={{fontSize:16, zIndex:100, position:'absolute', left:'-13px'}}>
                        <div className="blood-pluse" style={{position:'absolute', left:'70px'}}>
                          <div className="text-center ml-3 mt-1 d-flex" style={{width:'20px', paddingTop:'40px'}}>
                              <div className={`mt-2`}>血圧</div>
                              <div className="" style={{paddingTop:'10px', marginLeft:'3px'}}>
                                <div style={{color: 'red'}}>▼</div>
                                <div style={{marginTop:"-8px",color:'red'}}>▲</div>
                              </div>
                          </div>
                          <div className="text-center mt-1 ml-3 d-flex" style={{width:'20px', paddingTop:'75px'}}>
                              <div>脈拍</div>
                              <div className="ml-2" style={{color:'blue', paddingTop:'8px', marginLeft:'3px'}}>■</div>
                          </div>
                        </div>
                        
                        <div className="text-center ml-3 mt-1 d-flex temperature" style={{position:'absolute', width:'20px', paddingTop:'100px', left:'-8px'}}>
                            <div>体温</div>
                            <div className="ml-2" style={{color:'#e612d7', fontSize:'25px', marginLeft:'3px'}}>●</div>
                        </div>                      
                    </div>
                    <div className="chat-image">
                      <BasicChart
                          showData={this.state.graph_data}                           
                          start_date = {this.state.start_date}
                          end_date = {this.state.end_date}
                          graph_kind = {this.props.modal_type}
                          selected_period_type = {this.state.selected_period_type}
                          modal_type = {modal_type}
                      />
                    </div>
                </div>
                  
                </>
              )}
                  
            </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <Button id="btnCancel" className='cancel-btn' onClick={this.props.closeModal}>閉じる</Button>
        </Modal.Footer>
      </Modal>
    );  
  }
}
BasicInfoGraphModal.contextType = Context;
BasicInfoGraphModal.propTypes = {
  closeModal: PropTypes.func,
  patientId: PropTypes.number,
  modal_type: PropTypes.string,
  graph_data: PropTypes.object,
};

export default BasicInfoGraphModal;
