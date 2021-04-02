import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
// import {formatJapanDate} from "~/helpers/date";
import ReactToPrint from 'react-to-print';
import * as methods from "~/components/templates/Dial/DialMethods";
import renderHTML from 'react-render-html';

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  padding: 25px;
  .add-button {
      text-align: center;
      .first {
        margin-left: -30px;
      }
  }
.flex {
  display: flex;
  flex-wrap: wrap;  
}

.patterns{
    display:inline;
    width:100%;
    .one_pattern_blog{
        width:25%!important;
        display: inline-block;
        margin-bottom:20px;
        padding-left:25px;
        div{
            white-space: nowrap;
          }
    } 
}
.patient_name{
  word-break: break-all;
  white-space: normal!important;
}
.aggregate{
    padding-left:20px;
}
.title{
    text-align:center;
    font-size:20px;
}

.aggregate_title{
    font-size:20px;
}
.header {
    display:inline;
    text-align:right;
    margin-right:20px;
}
`;

// const Footer = styled.div`
//   display:flex;
//   span{
//     color: white;
//     font-size: 16px;
//   }
//   button{
//     float: right;
//     padding: 5px;
//     font-size: 16px;
//     margin-right: 16px;
//   }
// `;


class SealPreviewModal extends Component {
    constructor(props) {
        super(props);        
        this.state = {
            patterns:this.props.patterns,
            aggregate: this.props.aggregate,    
            schedule_date:this.props.schedule_date, 
        }        
    }
    closeModal = () => {
        this.props.closeModal();
    };

    render() {
        const { closeModal} = this.props;        
        return  (
            <Modal show={true} onHide={closeModal} id="add_contact_dlg"  className="master-modal medical-info-doc-preview-modal">
                <Modal.Header>
                    <Modal.Title>シール</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>                        
                        <ComponentToPrint
                            ref={el => (this.componentRef = el)}
                            patterns ={this.state.patterns}
                            aggregate = {this.state.aggregate}
                            schedule_date = {this.state.schedule_date}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                    <ReactToPrint
                        trigger={() => <Button className="red-btn">印刷</Button>}
                        content={() => this.componentRef}
                    />
                </Modal.Footer>                
            </Modal>
        );
    }
}

class ComponentToPrint extends React.Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        this.state={
            patterns:this.props.patterns,
            aggregate:this.props.aggregate,
            schedule_date:this.props.schedule_date,
        }
    }

    UNSAFE_componentWillMount() {
        this.getFacility();
    }
    filter = (item, index) => {
        switch(index){
            case 1:
                if (item.label_1_text != undefined && item.label_1_text != null && item.label_1_text !='') return item.label_1_text;
                if (item.label_2_text != undefined && item.label_2_text != null && item.label_2_text !='') return item.label_2_text;
                break;
            // case 2:
            //     if (item.label_2_text != undefined && item.label_2_text != null && item.label_2_text !='') return item.label_2_text;
            //     break;
            // case 3:
            //     if (item.label_3_text != undefined && item.label_3_text != null && item.label_3_text !='') return item.label_3_text;
            //     break;                
            default:
                if (item.label_1_text != undefined && item.label_1_text != null && item.label_1_text !='') return item.label_1_text;
                if (item.label_2_text != undefined && item.label_2_text != null && item.label_2_text !='') return item.label_2_text;
                break;
        }
        if (item.name_short != undefined && item.name_short != null && item.name_short !='') return item.name_short;
        return item.name
    }
    
    render() {
        let {patterns, aggregate} = this.state;
        return (
            <Wrapper>                
                <div className="header">
                    {/* <div className='date'>{formatJapanDate(this.state.schedule_date)}</div>
                    <div className="institute_name">{facilityInfo != undefined && facilityInfo[0].medical_institution_name}</div> */}
                </div>
                <div className="content">
                            <div className="patterns">
                                {patterns != undefined && patterns != null && patterns.length>0 && (
                                    patterns.map((item, index) => {
                                        return (                                            
                                            <div className="one_pattern_blog" key={index}>
                                                <div className="patient_name">{item.patient_name}</div>
                                                <div className="label label_1" style={item.label_1_is_colored_font?{color:'#'+item.label_color}:{background:'none'}}>{this.filter(item,1)}</div>
                                                <div className="IP_velocity">{item.anti_items != null && item.anti_items.amount != ''?item.anti_items.amount+item.anti_items.unit:renderHTML('<br/>')}</div>
                                                <div className="label label_2" style={item.label_2_is_colored_font?{color:'#'+item.label_color}:{background:'none'}}>{item.label_2_text}</div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                            <div className="aggregate">
                                <div className="aggregate_title">《集計》</div>
                                {aggregate != undefined && aggregate != null && aggregate.length>0 && (
                                    aggregate.map((item, index) => {
                                        return(
                                            <div key ={index} className="one_group" style={{color:'#'+item.label_color}}>{item.name}&nbsp;:&nbsp;{item.count}本</div>
                                        )
                                    })
                                )}
                            </div>
                            
                        </div>
                        
            </Wrapper>
        );
    }
}

SealPreviewModal.contextType = Context;

SealPreviewModal.propTypes = {
    closeModal: PropTypes.func,
    patterns: PropTypes.array,
    aggregate : PropTypes.array,
    schedule_date : PropTypes.string,
};

ComponentToPrint.contextType = Context;

ComponentToPrint.propTypes = {
    closeModal: PropTypes.func,
    patterns: PropTypes.array,
    aggregate : PropTypes.array, 
    schedule_date : PropTypes.string,   
};

export default SealPreviewModal;
