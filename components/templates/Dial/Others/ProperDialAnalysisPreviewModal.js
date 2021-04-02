import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import ReactToPrint from 'react-to-print';
import Button from "~/components/atoms/Button";

const Card = styled.div`
    width: 100%;
    height: 100%;
    padding-left:30px;
    padding-right:30px;
    overflow-y: auto;
    .flex {
        display: flex;
        flex-wrap: wrap;
    }
    .table-area {
        height: 85%;
        width: 80%;
        padding: 0;
        margin: 0;
        margin-left: auto;
        margin-right: auto;
        margin-top: 5%;
        border:1px solid #aaa;
        .graph-area {
            width: 95%;
            height: 85%;
            padding-top: 5%;
            .value-line {
                width:10%;
                border-right:1px solid #aaa;
            }
            .graph-line {
                width:6%;
                height: 100%;
                margin-left:6%;
                margin-right:6%;
            }
        }
        .graph-value{
            height:10%;
            width:95%;
            .value-line {
                width:10%;
            }
            .graph-line {
                border-top:1px solid #aaa;
                width:18%;
                height: 100%;
                text-align:center
            }
        }
    }
    .graph-border {
        border-left:1px solid #aaa;
        border-right:1px solid #aaa;
        border-top:1px solid #aaa;
    }
    table {
        width:100%;
        td {
            padding:0;
            padding-left: 0.2rem;
            padding-right: 0.2rem;
        }
    }
    .div-title {
        line-height:30px;
        height: 30px;
    }
`;

class ProperDialAnalysisPreviewModal extends Component {
    constructor(props) {
        super(props);        
        this.state = {             
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
                    <Modal.Title>適正透析分析</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{width:"100%", height:"100%"}}>
                        <ComponentToPrint
                            ref={el => (this.componentRef = el)}
                            modal_data ={this.props.modal_data}
                            modal_type ={this.props.modal_type}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
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
        this.state={

        }
    }

    getHeight=(range, position)=>{
        let all_count = this.props.modal_data.patient_lsit.length;
        let range_count = 0;
        if(this.props.modal_data.range_data == null){
            if(this.props.modal_data.range_max === this.props.modal_data.range_min){
                let color_height = 0;
                if(range == 1){
                    color_height = (all_count/(((all_count/10)+1)*10))*100;
                }
                if(position === "up"){
                    return (100 - color_height)+"%";
                } else {
                    return color_height+"%";
                }
            }
            let interval = parseFloat((this.props.modal_data.range_max - this.props.modal_data.range_min)/5).toFixed(1);
            let range_value= interval*parseInt(range) + this.props.modal_data.range_min;
            this.props.modal_data.patient_lsit.map(patient=>{
                if(range == 5){
                    if(parseFloat(range_value - interval).toFixed(1) <= parseFloat(patient.value)){
                        range_count++;
                    }
                } else {
                    if((parseFloat(range_value - interval).toFixed(1) <= parseFloat(patient.value)) && (patient.value <= range_value)){
                        range_count++;
                    }
                }
            });
        } else {
            let range1_1= range == 1 ? 0 : this.props.modal_data.range_data['range'+range+'_1'];
            let range1_2= range == 5 ? 0 : this.props.modal_data.range_data['range'+range+'_2'];
            this.props.modal_data.patient_lsit.map(patient=>{
                if(range == 5){
                    if(parseFloat(range1_1) <= parseFloat(patient.value)){
                        range_count++;
                    }
                } else {
                    if((parseFloat(range1_1) <= parseFloat(patient.value)) && (parseFloat(patient.value) <= range1_2)){
                        range_count++;
                    }
                }
            });
        }
        let top = (parseInt(all_count/10) + 1)*10;
        let color_height = (range_count/top)*100;
        if(position === "up"){
            return (100 - color_height)+"%";
        } else {
            return color_height+"%";
        }
    };

    getRange=(range)=>{
        if(this.props.modal_data.range_data == null){
            if(this.props.modal_data.range_max === this.props.modal_data.range_min){
                if(range == 1){
                    return "～"+parseFloat((this.props.modal_data.range_max)).toFixed(1);
                } else {
                    return"";
                }
            }
            let interval = parseFloat((this.props.modal_data.range_max - this.props.modal_data.range_min)/5).toFixed(1);
            if(range == 1){
                let range_value = this.props.modal_data.range_min + (interval * 1);
                return "～"+range_value;
            }
            if(range == 2){
                let range_value = this.props.modal_data.range_min + (interval * 1);
                return range_value+"～"+parseFloat(this.props.modal_data.range_min + (interval *2)).toFixed(1);
            }
            if(range == 3){
                return parseFloat(this.props.modal_data.range_min + (interval *2)).toFixed(1)+"～"+parseFloat(this.props.modal_data.range_min + (interval *3)).toFixed(1);
            }
            if(range == 4){
                return parseFloat(this.props.modal_data.range_min + (interval *3)).toFixed(1)+"～"+parseFloat(this.props.modal_data.range_min + (interval *4)).toFixed(1);
            }
            if(range == 5){
                return parseFloat(this.props.modal_data.range_min + (interval *4)).toFixed(1)+"～";
            }
        } else {
            if(range == 1){
                return "～"+this.props.modal_data.range_data['range1_2'];
            }
            if(range == 5){
                return this.props.modal_data.range_data['range5_1']+"～";
            }
            return this.props.modal_data.range_data['range'+range+'_1']+"～"+this.props.modal_data.range_data['range'+range+'_2'];
        }
    };

    getRangeCount=(range)=>{
        let all_count = this.props.modal_data.patient_lsit.length;
        let range_count = 0;
        if(this.props.modal_data.range_data == null){
            if(this.props.modal_data.range_max === this.props.modal_data.range_min){
                if(range == 1){
                    return all_count;
                }
                return "";
            }
            let interval = parseFloat((this.props.modal_data.range_max - this.props.modal_data.range_min)/5).toFixed(1);
            let range_value= interval*parseInt(range) + this.props.modal_data.range_min;
            this.props.modal_data.patient_lsit.map(patient=>{
                if(range == 5){
                    if(parseFloat(range_value - interval).toFixed(1) <= parseFloat(patient.value)){
                        range_count++;
                    }
                } else {
                    if((parseFloat(range_value - interval).toFixed(1) <= parseFloat(patient.value)) && (parseFloat(patient.value) <= range_value)){
                        range_count++;
                    }
                }
            });
        } else {
            let range1_1= range == 1 ? 0 : this.props.modal_data.range_data['range'+range+'_1'];
            let range1_2= range == 5 ? 0 : this.props.modal_data.range_data['range'+range+'_2'];
            this.props.modal_data.patient_lsit.map(patient=>{
                if(range == 5){
                    if(parseFloat(range1_1) <= parseFloat(patient.value)){
                        range_count++;
                    }
                } else {
                    if((parseFloat(range1_1) <= parseFloat(patient.value)) && (parseFloat(patient.value) <= range1_2)){
                        range_count++;
                    }
                }
            });
        }
        return range_count === 0 ? "" : range_count;
    };

    getGraphLeft=()=>{
        let all_count = this.props.modal_data.patient_lsit.length;
        let top = (parseInt(all_count/10) + 1)*10;
        let ret_html = [];
        for(let i=top; i > 0; i-=10){
            let height = 95/(parseInt(top/10));
            ret_html.push(
                <div style={{textAlign:"right", height:height+"%"}}>{i}</div>
            )
        }
        ret_html.push(
            <div style={{textAlign:"right"}}>{"0"}</div>
        );
        return ret_html;
    };
    
    render() {
        return (
            <Card>
                <div className={'table-area'}>
                    {this.props.modal_data.patient_lsit.length > 0 && this.props.modal_type === "graph" && (
                        <>
                            <div className={'graph-area flex'}>
                                <div className={'value-line'}>{this.getGraphLeft()}</div>
                                <div className={'graph-line'}>
                                    <div style={{width:"100%",height:this.getHeight(1, 'up')}}> </div>
                                    <div className={'graph-border'} style={{width:"100%",backgroundColor:"rgb(151,243,247)",height:this.getHeight(1, 'down')}}> </div>
                                </div>
                                <div className={'graph-line'}>
                                    <div style={{width:"100%",height:this.getHeight(2, 'up')}}> </div>
                                    <div className={'graph-border'} style={{width:"100%",backgroundColor:"rgb(142,198,195)",height:this.getHeight(2, 'down')}}> </div>
                                </div>
                                <div className={'graph-line'}>
                                    <div style={{width:"100%",height:this.getHeight(3, 'up')}}> </div>
                                    <div className={'graph-border'} style={{width:"100%",backgroundColor:"rgb(246,235,170)",height:this.getHeight(3, 'down')}}> </div>
                                </div>
                                <div className={'graph-line'}>
                                    <div style={{width:"100%",height:this.getHeight(4, 'up')}}> </div>
                                    <div className={'graph-border'} style={{width:"100%",backgroundColor:"rgb(239,213,193)",height:this.getHeight(4, 'down')}}> </div>
                                </div>
                                <div className={'graph-line'}>
                                    <div style={{width:"100%",height:this.getHeight(5, 'up')}}> </div>
                                    <div className={'graph-border'} style={{width:"100%",backgroundColor:"rgb(232,223,234)",height:this.getHeight(5, 'down')}}> </div>
                                </div>
                            </div>
                            <div className={'graph-value flex'}>
                                <div className={'value-line'}> </div>
                                <div className={'graph-line'}>{this.getRange(1)}</div>
                                <div className={'graph-line'}>{this.getRange(2)}</div>
                                <div className={'graph-line'}>{this.getRange(3)}</div>
                                <div className={'graph-line'}>{this.getRange(4)}</div>
                                <div className={'graph-line'}>{this.getRange(5)}</div>
                            </div>
                        </>
                    )}
                    {this.props.modal_data.patient_lsit.length > 0 && this.props.modal_type === "data" && (
                        <>
                            <table className="table-scroll table table-bordered">
                                <tr>
                                    {this.getRange(1) !== "" && (
                                        <td>{this.getRange(1)}</td>
                                    )}
                                    {this.getRange(2) !== "" && (
                                        <td>{this.getRange(2)}</td>
                                    )}
                                    {this.getRange(3) !== "" && (
                                        <td>{this.getRange(3)}</td>
                                    )}
                                    {this.getRange(4) !== "" && (
                                        <td>{this.getRange(4)}</td>
                                    )}
                                    {this.getRange(5) !== "" && (
                                        <td>{this.getRange(5)}</td>
                                    )}
                                </tr>
                                <tr>
                                    {this.getRange(1) !== "" && (
                                        <td style={{textAlign:"right"}}>{this.getRangeCount(1)}</td>
                                    )}
                                    {this.getRange(2) !== "" && (
                                        <td style={{textAlign:"right"}}>{this.getRangeCount(2)}</td>
                                    )}
                                    {this.getRange(3) !== "" && (
                                        <td style={{textAlign:"right"}}>{this.getRangeCount(3)}</td>
                                    )}
                                    {this.getRange(4) !== "" && (
                                        <td style={{textAlign:"right"}}>{this.getRangeCount(4)}</td>
                                    )}
                                    {this.getRange(5) !== "" && (
                                        <td style={{textAlign:"right"}}>{this.getRangeCount(5)}</td>
                                    )}
                                </tr>
                            </table>
                        </>
                    )}
                </div>
            </Card>
        );
    }
}

ProperDialAnalysisPreviewModal.contextType = Context;

ProperDialAnalysisPreviewModal.propTypes = {
    closeModal: PropTypes.func,
    modal_data : PropTypes.array,
    modal_type : PropTypes.string,
};

ComponentToPrint.contextType = Context;

ComponentToPrint.propTypes = {
    closeModal: PropTypes.func,
    modal_data : PropTypes.array,
    modal_type : PropTypes.string,
};

export default ProperDialAnalysisPreviewModal;
