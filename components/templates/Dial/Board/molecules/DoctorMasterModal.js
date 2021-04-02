import React, { Component } from "react";
import { Modal, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioButton from "~/components/molecules/RadioInlineButton"
import Checkbox from "~/components/molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import InputBoxTag from "~/components/molecules/InputBoxTag";

 const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;  
  height: calc( 75vh - 250px);
  padding: 2px;
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
  
  .sub_title{
    padding-top:20px;
    clear: both;
  }
  .label-title{
    width:125px;
    text-align:right;
  }
  .pullbox-select, .pullbox-label{
    width:100%;
  }
  .pullbox, .permission_area{
    margin-top:12px;
    .label-title{
      margin-right:10px;
    }
    text-align: left;
    .permission_label{
      width: 87px;
      text-align: right;
      margin-right: 10px;
    }
  }
  .date_area{
    .label-title{
      display:none;
    }
    .react-datepicker-wrapper{
      input{
        width:90px;
      }
    }
    .date_label{
      width: 90px;
      text-align: right;
      margin-right: 10px;
      margin-top: 10px;
    }
    ._label{
      margin-top: 10px;
      margin-left: 5px;
      margin-right: 5px;
    }

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
     padding-top: calc(17vh - 100px);
     button{
       margin-top:20px;
     }
   }
   .staff-search {
    width: 100%;
    label {
      width: 0;
      margin: 0;
    }
    input {
      font-size: 12px;
    }
   }
 `;

const position_list = [
  {id:1, value:"医者"},
  {id:2, value:"看護師"},
];
class DoctorMasterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staff_type: 0,
      staff_list: this.props.staff_list,
      staff_number: 0,    
      position:0,     
      startDate:'',
      endDate:''
    }
  }  

  getStaff = (e) => {
    this.setState({staff_number: parseInt(e.target.value)});
  };

  selectType = (e) => {
    let filterData = this.props.staff_list.filter(
        option => option.type === parseInt(e.target.value)
    );
    this.setState({staff_list:filterData});
  };

  getValue = () => {
    // console.log(e.target.value);
  }

  getCheckedPermission = () => {

  }

  getStartDate = (value) => {
    this.setState({startDate:value})
  }
  getEndDate = (value) => {
    this.setState({endDate:value})
  }
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
    
    return  (
        <Modal show={true} className="master-modal staff-setting-modal">
          <Modal.Header >
            <Modal.Title>医者マスタ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <Col md="3" className="left">
                <div className="sub_title flex">
                  <div>スタッフ一覧</div>                                
                </div>
              <List>              
                {this.state.staff_list !== undefined && this.state.staff_list !== null && this.state.staff_list.length > 0 && (
                  this.state.staff_list.map(item => {
                    if (item.type==1){
                      return (
                        <>
                        <div className="table-row">{item.name}</div>
                        </>
                      )
                    }                    
                  })
                )}
                </List>
                  <div className="staff-search">
                      <InputBoxTag
                          label=""
                          type="text"
                          placeholder="スタッフ検索"
                          // getInputText={this.getValue.bind(this)}
                          // value = {value}
                      />
                  </div>
              </Col>              
              <Col md="9" className="right">                                
                <InputBoxTag
                    label="スタッフ番号"
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                />          
                <InputBoxTag
                    label="氏名"
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                />          
                <InputBoxTag
                    label="カナ氏名"
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                />          
                <InputBoxTag
                    label="略称"
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                />          
                <InputBoxTag
                    label="並び順"
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                />          
                <InputBoxTag
                    label="パスワード"
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                />
                <InputBoxTag
                    label="パスワード(確認)"
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                />
                <SelectorWithLabel
                    options={position_list}
                    title="職種"
                    // getSelect={this.getPosition.bind(this)}
                    // departmentEditCode={this.state.position}
                />
                <div className="date_area flex">
                  <label className="date_label">所属期間</label>
                  <InputBoxTag
                      label=""
                      type="date"
                      getInputText={this.getStartDate.bind(this)}
                      value = {this.state.startDate}
                  />
                  <label className="_label">～</label>
                  <InputBoxTag
                      label=""
                      type="date"
                      getInputText={this.getEndDate.bind(this)}
                      value = {this.state.endDate}
                  />
                </div>
                
                <InputBoxTag
                    label="カード登録"
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                />
                <div className='permission_area'>
                  <label className="permission_label">権限</label>
                  <Checkbox
                    label="各種マスター変更"
                    getRadio={this.getCheckedPermission.bind(this)}
                    // value={this.state.DM}
                    name="master_permission"
                  />
                  <Checkbox
                    label="システム限定"
                    getRadio={this.getCheckedPermission.bind(this)}
                    // value={this.state.DM}
                    name="system_permission"
                  />
                </div>

              </Col>                            
              <div className="footer footer-buttons text-center">
                <Button className="cancel-btn" >クリア（新規入力）</Button>
                <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
              </div>              
            </Wrapper>
          </Modal.Body>
        </Modal>
    );
  }
}

DoctorMasterModal.contextType = Context;

DoctorMasterModal.propTypes = {
  staff_list: PropTypes.array,  
  closeModal: PropTypes.func,
  
};

export default DoctorMasterModal;
