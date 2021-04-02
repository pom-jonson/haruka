import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
// import styled from "styled-components";
import Button from "../../../atoms/Button";
import DialRecord_A from "~/components/templates/Dial/Board/molecules/printSheets/DialRecord_A";
// import DialRecord_A_spec from "~/components/templates/Dial/Board/molecules/printSheets/DialRecord_A_spec";
import DialRecord_B from "~/components/templates/Dial/Board/molecules/printSheets/DialRecord_B";
import DialRecord_C from "~/components/templates/Dial/Board/molecules/printSheets/DialRecord_C";
import PrintModal from "~/components/templates/Dial/Board/molecules/printSheets/PrintModal";
import * as sessApi from "~/helpers/cacheSession-utils";

// const Modal_Top = styled.div`
//     .sheet_button{
//         margin-left: 20px;        
//         opacity: 0.5;
//     }
//     .selected.sheet_button{
//         opacity: 1;
//         border: 2px dotted;
//     }
// `;

class RecordSheetModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sheet_style:'A',
            isOpenPrintModal:false,
        };
        this.ChartRef = React.createRef();
        this.display_measure_data = [];
        var x_range =sessApi.getObject("from_graph_monitor");
        if (x_range != undefined && x_range != null){
            this.x_range = x_range.x_range;
        } else{
            this.x_range = 5;
        }
    }

    closePrintModal = () => {
        this.setState({
            isOpenPrintModal:false
        });
    };
    closeModal = () =>{        
        this.props.closeModal();
    };

    switchSheet = (sheet) => {
        this.setState({
            sheet_style:sheet,
        });
    };

    openPrintModal = () => {
        this.display_measure_data = this.ChartRef.current.display_measure_data;        
        this.setState({
            graph_base64 : this.ChartRef.current.ChartRef.current.chart.ctx.canvas.toDataURL(),            
            isOpenPrintModal:true
        });
    };

    render() {
        return  (
            <Modal show={true} onHide={this.closeModal.bind(this)} id="add_contact_dlg"  className="master-modal printer-modal first-view-modal">
                <Modal.Body>
                    {/* <Modal_Top>
                        
                        <Button onClick={this.switchSheet.bind(this, 'A')} className = {this.state.sheet_style=='A'?"selected sheet_button":"sheet_button"}>A</Button>
                        <Button onClick={this.switchSheet.bind(this, 'B')} className = {this.state.sheet_style=='B'?"selected sheet_button":"sheet_button"}>B</Button>
                        <Button onClick={this.switchSheet.bind(this, 'C')} className = {this.state.sheet_style=='C'?"selected sheet_button":"sheet_button"}>C</Button>
                    </Modal_Top> */}
                    {this.state.sheet_style =='A' && (
                        <DialRecord_A
                            // ref={el => (this.componentRef = el)}
                            rows_blood={this.props.rows_blood}
                            rows_measure={this.props.rows_measure}
                            rows_temp={this.props.rows_temp}
                            schedule_data={this.props.schedule_data}
                            patientInfo = {this.props.patientInfo}
                            schedule_date={this.props.schedule_date}
                            disease = {this.props.disease}
                            disease_history = {this.props.disease_history}
                            x_range = {this.x_range>0?this.x_range:5}
                            ref={this.ChartRef}
                        />
                    )}
                    {this.state.sheet_style =='B' && (
                        <DialRecord_B
                            // ref={el => (this.componentRef = el)}
                            print_data={this.props.print_data}
                            rows_blood={this.props.rows_blood}
                            rows_measure={this.props.rows_measure}
                            rows_temp={this.props.rows_temp}
                            schedule_data={this.props.schedule_data}
                            patientInfo = {this.props.patientInfo}
                            schedule_date={this.props.schedule_date}
                            x_range = {this.x_range>0?this.x_range:5}
                            ref={this.ChartRef}
                        />
                    )}
                    {this.state.sheet_style =='C' && (
                        <DialRecord_C
                            // ref={el => (this.componentRef = el)}
                            print_data={this.props.print_data}
                            rows_blood={this.props.rows_blood}
                            rows_measure={this.props.rows_measure}
                            rows_temp={this.props.rows_temp}
                            schedule_data={this.props.schedule_data}
                            patientInfo = {this.props.patientInfo}
                            schedule_date={this.props.schedule_date}
                            x_range = {this.x_range>0?this.x_range:5}
                            ref={this.ChartRef}
                        />
                    )}
                </Modal.Body>
                {this.state.isOpenPrintModal && (
                    <PrintModal
                        sheet_style = {this.state.sheet_style}
                        closeModal = {this.closePrintModal}
                        graph_base64 = {this.state.graph_base64}
                        display_measure_data = {this.display_measure_data}
                        x_range = {this.x_range>0?this.x_range:5}
                    />
                )}
                <Modal.Footer>
                    <Button onClick={this.closeModal.bind(this)} className="cancel-btn">キャンセル</Button>
                    <Button className="red-btn" onClick={this.openPrintModal.bind(this)}>印刷</Button>
                </Modal.Footer>
            </Modal>
            
        );
    }
}

RecordSheetModal.contextType = Context;

RecordSheetModal.propTypes = {
    print_data: PropTypes.object,
    closeModal: PropTypes.func,
    rows_blood: PropTypes.array,
    rows_measure: PropTypes.array,
    rows_temp: PropTypes.array,
    schedule_data: PropTypes.object,
    disease : PropTypes.array,
    disease_history : PropTypes.array,
    patientInfo:PropTypes.object,
    schedule_date: PropTypes.string,
};

export default RecordSheetModal;