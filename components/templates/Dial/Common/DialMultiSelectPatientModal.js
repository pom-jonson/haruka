import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioButton from "~/components/molecules/RadioInlineButton"
// import RadioInlineButtonsList from "~/components/molecules/RadioInlineButtonsList"
import RadioGroupButton from "~/components/molecules/RadioGroup";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";

import SearchBar from "~/components/molecules/SearchBar"
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import axios from "axios";
import * as sessApi from "~/helpers/cacheSession-utils";
import { makeList_codeName} from "~/helpers/dialConstants";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`  
  display: block;  
  font-size: 1rem;
  width: 100%;
  height: 100%;
  flex-direction: column;  
  text-align: center;

  .radio-btn{
    label{
      font-size:1.1rem;
    }
  }
  .flex{
    display:flex;
  }
  .search-box{
    input{
      width:290px;
    }
  }
  .pullbox-label, .pullbox-select{
    width:120px;
  }
  .label-title{
    width:4.375rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .title-label{
    padding-top:5px;
  }
  .search_type{
    display:flex;
    margin-left:0.625rem;
    margin-right:1.25rem;
  }
  .radio-btn{
    width:4.375rem;
  }
  .dialyser-list {
    border: solid 1px rgb(206,212,218);
    width:100%;
    text-align:left;
    .radio-group-btn label{
      font-size:1rem;
      width:50%;
      text-align: left;
      padding-left: 1.875rem;
    }
  }  
  .btn-area {
    margin: auto;
    button {
      margin-top: 0.625rem;
      text-align: center;
      border-radius: 0.25rem;
      background: rgb(105, 200, 225); 
      border: none;
    }      
    span {
      color: white;
      font-size: 0.8rem;
      font-weight: 100;
    }
  } 
  .checkbox_area {
    position: absolute;
    right: 1.25rem;
    padding-left: 1rem;
    margin-top:8px;
    margin-left:30%;
    .checkbox-label{
      text-align:left;
    }
    label{
      font-size:1rem;
    }
  }
  .select-button{
    button{
      margin-bottom:0.3rem;
      margin-right:0.625rem;
      span{
        font-size:1rem;
      }
    }

  }
  
 `;

class DialMultiSelectPatientModal extends Component {
  constructor(props) {
    super(props);
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    this.state = {                 
        selected_masters_list: this.props.selected_masters_list!=undefined?this.props.selected_masters_list:[],   

        schVal:'',
        search_by_day: 0,
        search_by_time: 0,
        curCommonCode:0,
        time_zone_list:getTimeZoneList(),

        dial_group_codes:makeList_codeName(code_master['グループ'], 1),
        is_loaded:false,
    }
  }
  
  componentDidMount(){
    this.getPatientList();
    // if (this.state.selected_masters_list.length == this.state.MasterCodeData.length){
    //   this.setState({all_check_flag:1})
    // } else {
    //   this.setState({all_check_flag:0})
    // }
  }

  getPatientList = async () => {
    this.setState({is_loaded:false, MasterCodeData:[]})
    let path = "/app/api/v2/dial/patient/list_condition";
    var params = {
      search_by_patient:0,
      search_by_name_letter: 0,      
      search_by_day: this.state.search_by_day,
      search_by_time: this.state.search_by_time,
      curCommonCode: this.state.curCommonCode,
    }

    var post_data = {
        keyword:this.state.schVal,
        sort_order:'kana_name',
        condition: params
    }
    const { data } = await axios.post(path, {param:post_data});
    this.setState({MasterCodeData:data, is_loaded:true,})
  }

  selectMasters = (e) => {
    var temp = [...this.state.selected_masters_list];
    if (temp.indexOf(parseInt(e.target.value)) < 0){
      temp.push(parseInt(e.target.value));
    } else {
      var index = temp.indexOf(parseInt(e.target.value));
      if (index !==-1){
        temp.splice(index, 1);
      }
    }    
    if (temp.length == this.state.MasterCodeData.length){
      this.setState({all_check_flag:1});
    } else{
      this.setState({all_check_flag:0});
    }
    
    this.setState({selected_masters_list:temp});
  }

  getCheckAll = (name, value)=>{        
    var temp = [];
    if (name == 'select_all'){
      this.setState({all_check_flag:value})
    }    
    if (value ===1){
      this.state.MasterCodeData.map(item => {
        temp.push(parseInt(item.system_patient_id));
      })
      this.setState({selected_masters_list:temp});
    } else {
      this.setState({
        selected_masters_list:[],
        all_check_flag:0
      })
    }
  }

  getCommonCodeSelect = e => {      
    this.setState({ curCommonCode: parseInt(e.target.id)}, () => {
      this.getPatientList();
    });
  };

  confirmSelect = () => {
    this.props.selectMasters(this.state.selected_masters_list);
  }

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

  searchByDay = (e) => {
    this.setState({ search_by_day: parseInt(e.target.value)}, () => {
      this.getPatientList();
    });
  };

  searchByTime = (e) => {
    this.setState({ search_by_time: parseInt(e.target.value)}, () => {
      this.getPatientList();
    });
  };

  render() {
    let dialGroups = this.state.dial_group_codes;     

    const {MasterCodeData} = this.state;
    let Master_list = [];
    if (MasterCodeData !== undefined && MasterCodeData !== null){
        MasterCodeData.map((item) => {          
          Master_list.push(
            <RadioGroupButton                
                id={'patientID_' + item.system_patient_id}
                value = {item.system_patient_id}
                label={item.patient_number + ' : ' + item.patient_name}                
                getUsage={e => this.selectMasters(e)}
                checked={this.state.selected_masters_list.indexOf(item.system_patient_id) >=0 ? true : false}
            />
            );
        })
    }    
    const { closeModal } = this.props;
    return  (
        <Modal show={true} onHide={closeModal} id="add_contact_dlg"  className="master-modal general-setting-modal">
          <Modal.Header>
            <Modal.Title>患者選択</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
            <div className="flex">              
              <SearchBar
                  placeholder=""
                  search={this.search}
                  enterPressed={this.enterPressed}
              />
              <div className="search_type w96 common_code">                                
                  <SelectorWithLabel
                      options={dialGroups}
                      title="グループ"
                      getSelect={this.getCommonCodeSelect}
                      departmentEditCode={this.state.curCommonCode}                                    
                  />                            
              </div>
              <div className="checkbox_area">
                <Checkbox
                  label="全患者選択"
                  getRadio={this.getCheckAll.bind(this)}
                  value={this.state.all_check_flag}                    
                  name="select_all"
                />
                </div>
            </div>
            <div className="flex">
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

              <div className="title-label" style={{marginLeft:'6.25rem'}}>透析時間帯</div>

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
              </div>              
            </div>
            <div className="dialyser-list" style={{ maxHeight: `31.25rem`, overflowY: `scroll` }}>
                {this.state.is_loaded !== true && (
                  <>
                    <SpinnerWrapper>
                      <Spinner
                        animation="border"
                        variant="secondary"
                      />
                    </SpinnerWrapper>
                  </>
                )}
                {this.state.is_loaded && Master_list}              
            </div>                
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className='cancel-btn' onClick={this.props.closeModal}>キャンセル</Button>
            <Button className='red-btn' onClick={this.confirmSelect.bind(this)}>選択</Button>            
          </Modal.Footer>
            {/* <div className='select-button'>
            </div> */}
        </Modal>
    );
  }
}

DialMultiSelectPatientModal.contextType = Context;

DialMultiSelectPatientModal.propTypes = {  
  closeModal: PropTypes.func,
  selectMasters: PropTypes.func,
  selected_masters_list : PropTypes.array,
};

export default DialMultiSelectPatientModal;
