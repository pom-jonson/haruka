import React, { Component } from "react";
import { Modal,  } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import RadioButton from "~/components/molecules/RadioInlineButton"
import Button from "~/components/atoms/Button";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/pro-solid-svg-icons";
// import { faWindowClose } from "@fortawesome/pro-solid-svg-icons";

import TitleTabs from "~/components/organisms/TitleTabs";
import WholeSetting from "./generalSetting/WholeSetting"
import PrescriptionSetting from "./generalSetting/PrescriptionSetting"
import DoctorTouch from "./generalSetting/DoctorTouch"
import FootcareSetting from "./generalSetting/FootcareSetting"
import InspectionSetting from "./generalSetting/InspectionSetting"
import KarteSetting from "./generalSetting/KarteSetting"
import CertificateSetting from "./generalSetting/CertificateSetting"
import TouchSendFolder from "./generalSetting/TouchSendFolder"


// const Icon = styled(FontAwesomeIcon)`
//   color: blue;
//   font-size: 15px;
//   margin-right: 5px;  
//   margin-left:20px;  
// `;

  const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 100%;
  flex-direction: column;  
  text-align: center;
  .clear_icon{
    background-color:blue;
    color:white;
  }
  .flex{
    display:flex;
  }
  .left{
    float:left;
  }
  .right{
    float:right;
  }
  .right_area{
    position:absolute;
    right:15px;
    cursor:pointer;
  }
  .sub_title{
    padding-top:20px;
    clear: both;
  }
  .nav-tabs .nav-link{
    background-color:lightgray!important;
    width:auto;
    padding-top: 2px;
    padding-buttom: 2px;
    padding-bottom: 2px;
    padding-left: 5px;
    padding-right: 5px;
  }
  .nav-tabs .nav-link.active{
    background-color:white!important;
    border:1px dotted lightgray;
  }
  .main-body{
    height:auto;
    min-height:400px;
  }
   .footer {
     padding-top:20px;     
     clear:both;      
    span {
      font-weight: normal;
    }
    button {
      margin-right:20px;
    }
   }
   .transition_buttons{
     padding-top: calc(19vh - 120px);
     button{
       margin-top:20px;
     }
   }
 `;

 const tabs = [
  {
      id: 0,
      title: "全般設定"
  },
  {
      id: 1,
      title: "処方設定"
  },
  {
      id: 2,
      title: "検査設定"
  },
  {
    id: 3,
    title: "カルテ記事"
  },
  {
    id: 4,
    title: "フットケア"
  },
  {
    id: 5,
    title: "医事連携"
  },
  {
    id: 6,
    title: "認証設定"
  },
  {
    id: 7,
    title: "連携送信フォルダ"
  },
];

const staff_list = [
    {number:22,name:"透析 洋子", type: 1},
    {number:23,name:"透析 二郎", type: 2},
    {number:24,name:"透析 理子", type: 1},
    {number:25,name:"透析 三郎", type: 4},
    {number:27,name:"透析 五郎", type: 1},
    {number:29,name:"透析 京子", type: 2},
    {number:30,name:"透析 花子", type: 3},
    {number:184,name:"透析 太郎", type: 1},
    {number:185,name:"透析 花子", type: 2},
    {number:196,name:"透析 嘉一", type: 1},
    {number:199,name:"透析 弘美", type: 3},
    {number:205,name:"透析 貴広", type: 4},
    {number:208,name:"透析 英樹", type: 1},
    {number:210,name:"透析 隆信", type: 5},
    {number:211,name:"透析 正悟", type: 1},
];

class GeneralSettingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      staff_list: staff_list,
      tabs:tabs,
      tabIndex:0,
    }
  }  

  getStaff = (e) => {
    this.setState({staff_number: parseInt(e.target.value)});
  };

  selectTitleTab = e => {
    this.setState({tabIndex: parseInt(e.target.id)});
  };

  onHide=()=>{}

  render() {
    return  (
        <Modal show={true} onHide={this.onHide}  className="master-modal general-setting-modal">
          <Modal.Header >
            <Modal.Title>全体設定</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <TitleTabs
                tabs={this.state.tabs}
                selectTitleTab={this.selectTitleTab}
                id={this.state.tabIndex}
              />
              <div className="main-body">
              {this.state.tabIndex == 0 && (
                <WholeSetting/>
              )}
              {this.state.tabIndex == 1 && (
                <PrescriptionSetting/>
              )}
              {this.state.tabIndex == 2 && (
                <InspectionSetting/>
              )}
              {this.state.tabIndex == 3 && (
                <KarteSetting/>
              )}
              {this.state.tabIndex == 4 && (
                <FootcareSetting/>
              )}
              {this.state.tabIndex == 5 && (
                <DoctorTouch/>
              )}
              {this.state.tabIndex == 6 && (
                <CertificateSetting/>
              )}
              {this.state.tabIndex == 7 && (
                <TouchSendFolder/>
              )}
              </div>
              <div className="footer footer-buttons text-center">
                <Button className="red-btn" >登録</Button>
                <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
              </div>              
            </Wrapper>
          </Modal.Body>
        </Modal>
    );
  }
}

GeneralSettingModal.contextType = Context;

GeneralSettingModal.propTypes = {
  closeModal: PropTypes.func,
  
};

export default GeneralSettingModal;
