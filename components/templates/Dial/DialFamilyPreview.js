import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import ReactToPrint from 'react-to-print';
import PersonCell from "./PersonCell"
import {Row, Col } from "react-bootstrap";
import { FAMILY_CLASS } from "~/helpers/constants";
import Button from "~/components/atoms/Button";
import {formatJapan} from "~/helpers/date"

const LandscapeOrientation = () => (
    <style type="text/css">
      {"@media print{@page {size: landscape}}"}
    </style>
);

const Wrapper = styled.div`  
  height: calc( 100vh - 13.75rem);
  padding-top:0px;
  width:100%;
  font-size:12px;
  .header{
      text-align:center;
      font-size:13px;
  }
  .left{
    float:left;
  }
  .right{
    float:right;
  }
  .title{
    font-size:24px;
    span{
      font-size:18px;
    }
  }
  .header{
    span{
      text-decoration:underline;
    }
    .kana_name{
      text-decoration:none;
      font-size:10px;
      letter-spacing:2px;
    }
  }
  .flex{
    display:flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .padding-50{
    margin-left:3.125rem;
    width:90%;
  }
  .row{
    margin-top:8px;
    height:90px;
  }
  .topic.row{
    text-align: right;
    padding-right: 12px;
    vertical-align: middle;
    display: block;
    padding-top: 25px;
  }
  .cell{
      border:1px solid black!important;
      div{
        width:70px;
        font-size:10px;
        .note{
          font-size:8px!important;
        }
      }
      .color{
        height:7px;
      }
      .main-body{
        height:56px;
      }
  }
  .cell > div{
    height:70px;    
  }
 `; 


 class DialFamilyPreview extends Component {
    constructor(props) {
        super(props);        
        this.state = {            
        }        
    }

    onHide={}

    render() {
        // const { closeModal} = this.props;        
        return  (
            <Modal show={true} id="add_contact_dlg"  className="master-modal family-printview-modal">
                <Modal.Header>
                    <Modal.Title>家族歴</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>                        
                        <ComponentToPrint
                            ref={el => (this.componentRef = el)}
                            family_info = {this.props.family_info}
                            family_codes = {this.props.family_codes}
                            patientInfo = {this.props.patientInfo}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                    <ReactToPrint
                      trigger={() => <Button className="red-btn">印刷</Button>}
                      content={() => this.componentRef}                            
                      pageStyle={LandscapeOrientation}
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}
const odd_row =[0,1,2,3,4,5,6,7,8];
const even_row =[0,1,2,3,4,5,6,7];

class ComponentToPrint extends React.Component {
    constructor(props) {
        super(props);
    }
    searchPersonInfo = (row_index, col_index) => {
        var i = 0;
        var person_info = null;
        let family_info = this.props.family_info;
        if (family_info.length > 0){
          for (i = 0; i < family_info.length; i++){
            if(family_info[i].generation == row_index && family_info[i].colmun_number == col_index){
              person_info = family_info[i];
              break;
            }
          }
          return person_info;
        } else {
          return null;
        }
    }
    render() {
        let {family_info, family_codes} = this.props;
        var person_info;
        var patientInfo = this.props.patientInfo;
        return (
            <Wrapper>
              <div className="header">
                <div className='title'>家族歴<span style={{position:'absolute', right:'10px'}}>作成日{formatJapan(new Date())}</span></div>
                <div>
                  <span style={{marginRight:'8rem'}}>ID:{patientInfo.patient_number}</span>
                  <span >患者氏名:</span>
                  <label style={{textAlign:'left', marginLeft:'6px'}}>
                    <span className='kana_name'>{patientInfo.kana_name}</span><br/>
                    <span className='name'>{patientInfo.patient_name}</span>
                  </label>
                </div>
              </div>
                <Col md="1" className="left">
                <Row className="grandparents topic"><span>祖父母</span></Row>
                <Row className="parents topic"><span>両親</span></Row>
                <Row className="self topic"><span>本人兄弟</span></Row>
                <Row className="child topic"><span>子供</span></Row>
                <Row className="grandchild topic"><span>孫</span></Row>                         
                </Col>
                <Col md="11" className="right" id="right">
                <Row className="grandparents contents flex">
                    {family_info.length>0 && odd_row.map((item) => {
                    person_info = this.searchPersonInfo(FAMILY_CLASS.GRAND_PARENT, item);
                    return (
                        <div key = {item} className={` cell row-0-col-${item}`}>
                        <PersonCell className='cell' person_info={person_info} family_codes={family_codes}/>
                        </div>
                    )
                    })}
                </Row>
                <Row className="parents contents flex padding-50">
                    {family_info.length>0 && even_row.map((item) => {
                    person_info = this.searchPersonInfo(FAMILY_CLASS.PARENT, item);
                    return (
                        <div key = {item} className={`cell row-1-col-${item}`}>
                        <PersonCell className='cell' person_info={person_info} family_codes={family_codes}/>
                        </div>
                    )
                    })}
                </Row>
                <Row className="self contents flex">
                    {family_info.length>0 && odd_row.map((item) => {                  
                    person_info = this.searchPersonInfo(FAMILY_CLASS.SAME, item);
                    return (
                        <div key = {item} className={`cell row-2-col-${item}`}>
                        <PersonCell className='cell' person_info={person_info} family_codes={family_codes}/>
                        </div>
                    )
                    })}
                </Row>
                <Row className="child contents flex padding-50">
                    {family_info.length>0 && even_row.map((item) => {
                    person_info = this.searchPersonInfo(FAMILY_CLASS.CHILD, item);
                    return (
                        <div key = {item} className={`cell row-3-col-${item}`}>
                        <PersonCell className='cell' person_info={person_info} family_codes={family_codes}/>
                        </div>
                    )
                    })}
                </Row>
                <Row className="grandchild contents flex">
                    {family_info.length>0 && odd_row.map((item) => {
                    person_info = this.searchPersonInfo(FAMILY_CLASS.GRAND_CHILD, item);
                    return (
                        <div key = {item} className={`cell row-4-col-${item}`}>
                        <PersonCell className='cell' person_info={person_info} family_codes={family_codes}/>
                        </div>
                    )
                    })}
                </Row>
                </Col>
            </Wrapper>
        );
    }
}

DialFamilyPreview.contextType = Context;

DialFamilyPreview.propTypes = {
    closeModal: PropTypes.func,
    family_info : PropTypes.object, 
    family_codes : PropTypes.array,
    patientInfo : PropTypes.object,
};

ComponentToPrint.contextType = Context;

ComponentToPrint.propTypes = {
    closeModal: PropTypes.func,
    family_info : PropTypes.object, 
    family_codes : PropTypes.array,
    patientInfo : PropTypes.object,
};

export default DialFamilyPreview;
