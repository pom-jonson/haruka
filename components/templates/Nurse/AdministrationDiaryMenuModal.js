import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import WardMapDiary from "./WardMapDiary";

registerLocale("ja", ja);

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .selected {
   background: rgb(105, 200, 225) !important;
 }  
 .label-title{
  margin:0;
  width:4rem;
  margin-right:0.5rem;
  text-align:right;
  line-height:2rem;
  height:2rem;
  font-size:1rem;
  margin-top:0.1rem;
}
 .date-area{
   width:50%;
   div{
     margin-top:0
   }
  input{
    width:8rem;
    padding-top:0;
    height:2rem;
    font-size:1rem;
  }
 }
 .select-ward{
   width:auto;
   div{
    margin-top:0
   }
   .label-title{
     margin-top:0.1rem;
   }
   .pullbox-label, .pullbox-select{
    width:100%;
    height:2rem;
    font-size:1rem;
   }
   .pullbox-label{
     margin-top:0rem;
     margin-bottom:0px;
   }
   .pullbox{
     width:auto;
   }
 }
 .list-area{
    border:1px solid black;
    height:15rem;
    margin-bottom:1rem;
    margin-top:1rem;
    overflow-y:auto;
    .selected {
      background: lightblue;
    }
    li {
      cursor: pointer;
    }
}
  
`;

class AdministrationDiaryMenuModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openWardDiary: false,
      first_ward_id:1,      
      ward_master:[{id:0, value:""}],
      search_date:new Date(), 
      diary_master: [],
      select_index: 0
    }
  }

  async componentDidMount() {
    this.getMaster();
  }

  getMaster = async()=> {
    let path = "/app/api/v2/nurse/get_diary_master";
    await apiClient.post(path, {params: {}})
    .then(res => {
      let ward_master = this.state.ward_master;
      if(res.ward_master.length > 0){
        res.ward_master.map(ward=>{
          ward_master.push({id:ward.number, value:ward.name});          
        });
      }
      let diary_master = res.diary_master;
      this.setState({
        ward_master,
        diary_master
      });
    })
  }

  closeWardModal=()=>{
    this.setState({      
      openWardDiary:false, 
    });
  };

  setWard=(e)=>{
    this.setState({first_ward_id:e.target.id});
  };

  getDate = (e) => {
    this.setState({
      search_date:e
    })
  };
  openWardModal = () => {
    if(this.state.select_index != 0) return;
    if (this.state.first_ward_id>0){
      this.setState({openWardDiary: true});
    } else {
      window.sessionStorage.setItem('alert_messages', '病棟を選択してください。');
    }
  }
  selectDiary = (index) => {
    this.setState({select_index: index});
  }

  render() {
    let {diary_master} = this.state;
    return (
      <>
        <Modal
          show={true}          
          className="custom-modal-sm adminitration-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>管理日誌メニュー</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className='flex'>
                <div className='date-area'>
                  <InputWithLabelBorder
                    label="日付"
                    type="date"                      
                    getInputText={this.getDate.bind(this)}
                    diseaseEditData={this.state.search_date}
                  />
                </div>
                <div className={'select-ward'}>
                  <SelectorWithLabel
                    title="病棟"
                    options={this.state.ward_master}
                    getSelect={this.setWard}
                    departmentEditCode={this.state.first_ward_id}
                  />
                </div>
              </div>
              <div className='list-area'>
                <ul>
                {diary_master != undefined && diary_master != null && diary_master.length > 0 && (
                  diary_master.map((item, index) => {
                    return(
                      <li key={index} onClick={this.selectDiary.bind(this, index)} className={this.state.select_index == index ? "selected" : ""}>{item.diary_name}</li>
                    )
                  })
                )}
                </ul>
              </div>
              
              </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            {/* <Button className="cancel-btn" onClick={this.props.closeModal}>一括印刷</Button>
            <Button className="cancel-btn" onClick={this.props.closeModal}>印刷</Button> */}
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className="red-btn" onClick={this.openWardModal.bind(this)}>確定</Button>
          </Modal.Footer>
          {this.state.openWardDiary ? (
            <WardMapDiary
              closeModal={this.closeWardModal}
              handleOk={this.closeWardModal}
              ward_master={this.state.ward_master}
              first_ward_id={this.state.first_ward_id}
              search_date={this.state.search_date}
            />
          ):<></>}
        </Modal>

      </>
    );
  }
}

AdministrationDiaryMenuModal.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,  
  closeModal: PropTypes.func,
  cache_index:PropTypes.number,  
  detailedPatientInfo : PropTypes.object
};

export default AdministrationDiaryMenuModal;