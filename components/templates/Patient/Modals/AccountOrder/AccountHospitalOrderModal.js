import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DatePicker from "react-datepicker";
import ja from "date-fns/locale/ja";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
  height: 100%;
  .panel-menu {
    width: 100%;
    margin-bottom: 1rem;
    font-weight: bold;
    position: relative;
    display: block;
    .menu-btn {
        text-align: center;
        border-top: 1px solid rgba(200, 194, 194, 0.22);
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
        padding: 5px 10px;
        cursor: pointer;
        display: inline-block;
    }
    .active-menu {
        text-align: center;
        border-top: 1px solid black;
        border-right: 1px solid black;
        border-left: 1px solid black;
        padding: 5px 10px;
        display: inline-block;
    }
  }
  .select-department{
    .pullbox-title{
      font-size: 1rem;
      width: 5rem;
      height: 2.5rem;
      line-height: 2.5rem;
    }
    .pullbox-select {
      width: 10rem;
      height: 2.5rem;
    }
  }
  .label-title {
    width: 5rem;
    font-size: 1rem;
    line-height: 2.5rem;
  }
  .select-schedule-date {
    input {
      height: 2.5rem;
      border: solid 1px lightgray;
      border-radius: 4px;
    }
  }
.search-text{
  label {
    width: 12rem;
    margin-top: -4px;
    line-height: 2.5rem;
  }
  input {
    height: 2.5rem;
    margin-top: -0.5rem;
  }
}
.search-btn {
  height: 2.5rem;
}
.content {
  height: calc(100% - 9rem);
  .blue-area {
    width: 100%;
    height: 3rem;
    background: lightblue;
  }
  .btn-area {
    width: 100%;
    margin-top: 0.5rem;
    .name-btn {
      height: 3.5rem;
      width: 80%;
    }
    .detail-btn {
      height: 3.5rem;
      width: 20%;
    }
  }
}
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 40vw;
  display: table-caption;
  position: absolute;
  top: 230px;
`;
class AccountHospitalOrderModal extends Component {
    constructor(props) {
      super(props);  
      let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
      let department_codes = [{id:0, value:"全て"}];
      let diagnosis = {};
      departmentOptions.map(department=>{
          department_codes.push(department);
          diagnosis[parseInt(department.id)] = department.value;
      });
      this.state={
        department_id:0,
        department_codes,
        tab_id: 0,
        collected_date: new Date(),
        search_val: '',
        is_loaded: false,
        practice_master: null,
        classification_master: null,
      }
      this.tab_item = ['看護師用処置（その他）', '看護師用処置（内科）', '看護師用一般処置検査', '看護師用救急処置（循環器）', '看護師用救急処置（内科）', '看護師用検査（救急外来）', '看護師用処置（外科）','外来処置', '看護師用処置（救急外来）'];
    }

  async componentDidMount() {
    let path = "/app/api/v2/master/treat";
    let post_data = {
        general_id: 1
    };
    await apiClient._post(
        path,
        {params: post_data})
        .then((res) => {
            if (res) {
              let practice_master = res.treat_practice;
              let selected_classfiation_item = res.treat_classification[0];
              let filteredArray = practice_master.filter(item => {
                  if (item.classification_id === selected_classfiation_item.classification_id) return item;
              });
                this.setState({
                    all_data: res,
                    classification_master:res.treat_classification,
                    treat_item_unit:res.treat_item_unit,
                    treat_set:res.treat_set,
                    treat_item:res.treat_item,
                    practice_master:filteredArray,
                    is_loaded:true,
                });
            }
        })
        .catch(() => {
        });
  }
   setTab = ( e, val ) => {
      let master_data = this.state.all_data;
      let practice_master = master_data.treat_practice;
      let selected_classfiation_item = this.state.classification_master[val];
      let filteredArray = practice_master.filter(item => {
          if (item.classification_id === selected_classfiation_item.classification_id) return item;
      });
      this.setState({
          tab_id:parseInt(val),
          practice_master:filteredArray,
      });
  };
    getDepartment = e => {
        this.setState({
            department_id:e.target.id,
        })
    };
    setValue = (key,e) => {
        this.setState({[key]: e.target.value});
    }
    setValue = (key,value) => {
        this.setState({[key]: value});
    }
    //分類選択
    selectClassification = (id,name) => {
        let master_data = this.state.all_data;
        let practice_master = master_data.treat_practice;
        let filteredArray = practice_master.filter(item => {
            if (item.classification_id === id) return item;
        });
        this.setState({
            classification_id: id,
            classification_name: name,
            practice_master:filteredArray,
            practice_id: 0,
            practice_name: '',
            request_id: 0,
            request_name: '',
            request_master:[],
            part_id:0,
            part_name:'',
            position_id:0,
            position_name:'',
            position_master:[],
            side_id:0,
            side_name:'',
        })
    };
    // 行為名選択
    selectPractice = (id,name,enable_body_part) => {
        let master_data = this.state.all_data;
        let request_master = master_data.treat_request;
        request_master = request_master.filter(item => {
            if (item.practice_id === id) return item;
        });
        let set_master = [
            { id: 0, value: "" },
        ];
        let treat_set = this.state.treat_set;
        treat_set.filter(item => {
            if (item.practice_id === id && item.classification_id === this.state.classification_id){
                let set_master_info = {id: item.number, value: item.treat_set_name};
                set_master.push(set_master_info);
            }
        });

        this.setState({
            set_master,
            practice_id: id,
            practice_name: name,
            request_master: request_master,
            request_id: 0,
            request_name: '',
            enable_body_part,
        })
    };

    render() {
      let {classification_master,practice_master} = this.state;
        return (
            <>
                <Modal show={true} className="custom-modal-sm patient-exam-modal outpatient-modal first-view-modal">
                    <Modal.Header>
                        <Modal.Title>
                            会計オーダ―
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <DatePickerBox style={{width:"100%", height:"100%"}}>
                        <Wrapper>
                          <div className="search-area d-flex">
                            <div className={'select-department'}>
                                <SelectorWithLabel
                                    title="診療科"
                                    options={this.state.department_codes}
                                    getSelect={this.getDepartment}
                                    departmentEditCode={this.state.department_id}
                                />
                            </div>
                            <div className="select-schedule-date ml-5">
                              <label className="label-title">指示日</label>
                                <DatePicker
                                    locale="ja"
                                    selected={this.state.collected_date}
                                    onChange={(e)=>this.setDate(e,"collected_date")}
                                    dateFormat="yyyy/MM/dd"
                                    placeholderText="年/月/日"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    dayClassName = {date => setDateColorClassName(date)}
                                />
                            </div>
                            <div className="search-text ml-5">
                              <InputBoxTag
                                  label="文字列処置検索"
                                  type="text"
                                  getInputText={this.setValue.bind(this, "search_val")}
                                  value = {this.state.search_val}
                                  className="input-box-tag"
                              />
                            </div>
                            <button className="search-btn">検索</button>
                          </div>
                          {this.state.is_loaded ? (
                            <>
                            <div className="panel-menu">
                              {classification_master != null && classification_master.length > 0 && classification_master.map((item,index)=> {
                                return (
                                  <>
                                    {this.state.tab_id == index ? (
                                      <div className="active-menu">{item.name}</div> 
                                    ) : (
                                      <div className="menu-btn" onClick={e => {this.setTab(e, index);}}>{item.name}</div>  
                                    )}
                                  </>
                                )
                              })}
                            </div>
                            <div className="content w-100 flex">
                              <div style={{width: "20%"}}>
                                {practice_master != null && practice_master.length > 0 && practice_master.map((item, index)=>{
                                  return (
                                    <>
                                    {index <5 && (
                                      <div key={index} className="p-2">
                                        <div className="blue-area">{item.name}</div>
                                        <div className="btn-area flex">
                                          <button className="name-btn">{item.name}</button>
                                          <button className="detail-btn">詳細</button>
                                        </div>
                                      </div>
                                    )}
                                    </>
                                  )
                                })}
                              </div>
                              <div style={{width: "20%"}}>
                                {practice_master != null && practice_master.length > 0 && practice_master.map((item, index)=>{
                                  return (
                                    <>
                                    {index >=5 && index <10 && (
                                      <div key={index} className="p-2">
                                        <div className="blue-area">{item.name}</div>
                                        <div className="btn-area flex">
                                          <button className="name-btn">{item.name}</button>
                                          <button className="detail-btn">詳細</button>
                                        </div>
                                      </div>
                                    )}
                                    </>
                                  )
                                })}
                              </div>
                              <div style={{width: "20%"}}>
                                {practice_master != null && practice_master.length > 0 && practice_master.map((item, index)=>{
                                  return (
                                    <>
                                    {index >=10 && index <15 && (
                                      <div key={index} className="p-2">
                                        <div className="blue-area">{item.name}</div>
                                        <div className="btn-area flex">
                                          <button className="name-btn">{item.name}</button>
                                          <button className="detail-btn">詳細</button>
                                        </div>
                                      </div>
                                    )}
                                    </>
                                  )
                                })}
                              </div>
                            </div>
                            </>
                          ): (
                            <div className='text-center'>
                                <SpinnerWrapper>
                                    <Spinner animation="border" variant="secondary" />
                                </SpinnerWrapper>
                            </div>
                          )}
                        </Wrapper>                        
                      </DatePickerBox>
                    </Modal.Body>   
                    <Modal.Footer>  
                      <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                      <Button className="red-btn" onClick={this.props.closeModal}>確定</Button>
                    </Modal.Footer>                                       
                </Modal>
               
            </>
        );
    }
}

AccountHospitalOrderModal.contextType = Context;
AccountHospitalOrderModal.propTypes = {
    patientId: PropTypes.number,
    patientInfo: PropTypes.object,
    closeModal: PropTypes.func,
    cache_index:PropTypes.number,
};

export default AccountHospitalOrderModal;
