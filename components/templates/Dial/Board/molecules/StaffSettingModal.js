import React, { Component } from "react";
import { Modal, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioButton from "~/components/molecules/RadioInlineButton"
import Button from "~/components/atoms/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { faWindowClose } from "@fortawesome/pro-solid-svg-icons";
import DoctorMasterModal from "./DoctorMasterModal"
import StaffMasterModal from "./StaffMasterModal"

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;  
  margin-left:20px;  
`;

 const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;  
  height: calc( 75vh - 250px);
  padding: 2px;
  float: left;
  overflow-y: auto;
  border: solid 1px lightgrey;
  .table-row {
    font-size: 12px;
    margin 5px 0;
    &:nth-child(2n) {
      background-color: #f2f2f2;
    }
    label{
      border-radius:0px;
      text-align:left;
    }
  }  
  
  `;
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
  .doctor_list,.staff_list{
    height:calc(38vh - 140px);
    padding-top:30px;
  }
  .sub_title{
    padding-top:20px;
    clear: both;
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

class StaffSettingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staff_type: 0,
      staff_list: staff_list,
      staff_number: 0,
      selected_staff_list:[],
      isShowDoctorMasterModal:false,
      isShowStaffMasterModal:false,
    }
  }  

  getStaff = (e) => {
    this.setState({staff_number: parseInt(e.target.value)});
  };

  showDoctorMaster = () => {
    this.setState({isShowDoctorMasterModal:true});
  }
  showStaffMaster = () => {
    this.setState({isShowStaffMasterModal:true});
  }
  closeModal = () => {
    this.setState({
        isShowDoctorMasterModal:false,
        isShowStaffMasterModal:false,
    });
  }

  onHide=()=>{}

  render() {
    const staff_list = [];
    this.state.staff_list.map((staff, index) => {
      staff_list.push(
          <RadioButton
              key={index}
              id={index}
              label={staff.name}
              value={index}
              getUsage={this.getStaff}
              checked={index === this.state.staff_number}
          />
      );
    });

    let {selected_staff_list} = this.state;
    return  (
        <Modal show={true} onHide={this.onHide}  className="master-modal staff-setting-modal">
          <Modal.Header >
            <Modal.Title>スタッフ設定</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <Col md="5" className="left">
                <div className="sub_title flex">
                  <div>本日勤務者一覧</div>
                  <div className="right_area">
                    <Icon icon={faWindowClose} className="clear_icon"></Icon>一覧クリア
                  </div>                                    
                </div>
              <List>              
                {selected_staff_list !== undefined && selected_staff_list !== null && selected_staff_list.length > 0 && (
                  selected_staff_list.map(item => {
                    return (
                      <>
                      <div className="table-row">{item}</div>
                      </>
                    )
                  })
                )}
                </List>
              </Col>
              <Col md="1" className="left">
                <div className="doctor_list">
                  <div className="transition_buttons">
                    <button>＜</button>
                    <button>＞</button>
                  </div>
                  
                </div>
                <div className="staff_list">
                  <div className="transition_buttons">
                    <button>＜</button>
                    <button>＞</button>
                  </div>                  
                </div>
              </Col>
              <Col md="6" className="right">
                <div className="sub_title flex">
                  <div>医者リスト</div>
                  <div className="right_area" onClick={this.showDoctorMaster}>
                    <Icon icon={faPlus}></Icon>医者を追加
                  </div>                  
                </div>
                <List className="doctor_list">              
                  {this.state.staff_list !== undefined && this.state.staff_list !== null && this.state.staff_list.length > 0 && (
                    this.state.staff_list.map((item, index) => {                      
                      if (item.type==1){
                        return (
                          <>
                          <div className="table-row">{staff_list[index]}</div>
                          </>
                        )
                      }                      
                    })
                  )}
                </List>
                <div className="sub_title flex">
                  <div>スタッフリスト</div>
                  <div className="right_area" onClick={this.showStaffMaster}>
                    <Icon icon={faPlus}></Icon>スタッフを追加
                  </div>                  
                </div>
                <List className="staff_list">              
                  {staff_list !== undefined && staff_list !== null && staff_list.length > 0 && (
                    staff_list.map(item => {
                      return (
                        <>
                        <div className="table-row">{item}</div>
                        </>
                      )
                    })
                  )}
                </List>
              </Col>                            
              <div className="footer footer-buttons text-center">
                <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                <Button className="red-btn" >選択</Button>
              </div>
              {this.state.isShowDoctorMasterModal && (
                    <DoctorMasterModal
                        staff_list={this.state.staff_list}                        
                        closeModal={this.closeModal}                        
                    />
                )}
              {this.state.isShowStaffMasterModal && (
                    <StaffMasterModal
                        staff_list={this.state.staff_list}
                        closeModal={this.closeModal}
                    />
                )}
            </Wrapper>
          </Modal.Body>
        </Modal>
    );
  }
}

StaffSettingModal.contextType = Context;

StaffSettingModal.propTypes = {
  closeModal: PropTypes.func,
};

export default StaffSettingModal;
