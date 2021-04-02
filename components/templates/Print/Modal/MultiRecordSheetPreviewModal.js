import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import * as methods from "~/components/templates/Dial/DialMethods";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import axios from "axios";
import {formatDateLine} from "~/helpers/date";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import DialRecord_A_Multi from "~/components/templates/Dial/Board/molecules/printSheets/DialRecord_A_Multi";
import Spinner from "react-bootstrap/Spinner";

const Modal_Body = styled.div`
    .print-area{
        height: calc(80vh - 1.5rem);
        max-height: 80vh;
        overflow-y:auto;
    }
    .w3-button{
        position:absolute;
        top:5rem;
    }
    .w3-button:hover{
        background: lightcyan;
    }
    .w3-display-right{
        right:2.5rem;
    }
`;

const SpinnerWrapper = styled.div`
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class MultiRecordSheetPreviewModal extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        this.state = {
            sheet_style:'A',
            isOpenPrintModal:false,
            is_loaded:false,
            isConfirmComplete:false,
        };
        this.ChartRef = [];        
        this.slideIndex = 1;
        this.count = 0;   
        var graph_axis = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").graph_axis;        
        this.graph_axis = {
            x_range_short:5,
            x_range_long:8
        }
        if (graph_axis != undefined && graph_axis != null && graph_axis != '') this.graph_axis = graph_axis;    
        var graph_table_show = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").graph_table_show;
        this.graph_table_show = graph_table_show; 
    }
    componentDidMount(){
        this.getStaffs();
        this.getDoctors();
        this.getPrintData();
    }
    getPrintData = async() => {
        let path = "/app/api/v2/dial/schedule/dial_period_get_schedule";
        let post_data = {
            params:{
                start_date:formatDateLine(this.props.start_date),
                end_date:formatDateLine(this.props.end_date),
                system_patient_id:this.props.patientInfo.system_patient_id
            },
        }
        await axios.post(path, post_data).then(res => {
            this.setState({
                schedule_datas:res.data,
                
            });
            this.count = res.data != undefined ? res.data.length:0;
            var dates = []; 
            if (this.count > 0){
                res.data.map(item => {
                    dates.push(item.schedule_date);
                })
            }

            path = "/app/api/v2/dial/generatepdf/getAllPrintSubData";
            post_data = {
                params:{
                    dates:dates,                    
                    system_patient_id:this.props.patientInfo.system_patient_id,
                },
            }
            axios.post(path, post_data).then(res => {                
                this.setState({
                    treat_monitor_list_multi:res.data.treat_monitor_list_multi,
                    showImange_multi:res.data.showImange_multi,
                    disease_history_multi:res.data.disease_history_multi,
                    instruction_list_multi:res.data.instruction_list_multi,
                    is_loaded:true,
                })
                // setTimeout(() => {
                //     this.showDivs(this.slideIndex);
                // }, 1000);
            })
        })
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

    savePDFServer = async () => {
        // var display_measure_data = [];
        // var graph_data_base64 = [];
        if (this.count == 0) return;
        var url = '/app/api/v2/dial/generatepdf/dial_record_a_multi';
        var rand_key = Math.random()* 9000 +1000;
        
        var total_graph = [];
        var total_display_measure_data = [];
        var total_dates = [];
        for (var i = 0; i<this.count;i++){
            total_graph.push(this.ChartRef[i].ChartRef.current.chart.ctx.canvas.toDataURL());
            total_display_measure_data.push(this.ChartRef[i].display_measure_data);
            total_dates.push(this.state.schedule_datas[i].schedule_date);
        }
        this.setState({
            isConfirmComplete:true,
            complete_message:'ダウンロード中(0/'+ this.count + ')',
        })
        for (i = 0; i<this.count;i++){
            await axios({
                url: url,
                method: 'POST',
                data:{
                    patient_id:this.props.patientInfo.system_patient_id,
                    start_date:this.state.schedule_datas[i].schedule_date,
                    end_date:this.state.schedule_datas[i].schedule_date,
                    graph:this.ChartRef[i].ChartRef.current.chart.ctx.canvas.toDataURL(),
                    display_measure_data:this.ChartRef[i].display_measure_data,
                    graph_table_show:this.graph_table_show,
                    x_range:this.graph_axis.x_range_long,
                    key:rand_key,
                    print_index :i,
                    last_flag:i==this.count-1?true:false,

                    total_display_measure_data,
                    total_graph,
                    total_dates
                }, 
                responseType: 'blob', // important
            }).then((response) => {
                var value = i+1;
                this.setState({
                    file: response.data,
                    complete_message:'ダウンロード中('+value+'/' + this.count + ')',
                });
            })
            .catch(() => {
                this.setState({isConfirmComplete:false, complete_message:''});
            });
        }
        this.setState({isConfirmComplete:false, complete_message:''});
        this.download(this.props.patientInfo.patient_number, rand_key);
    };

    download = async(patient_number, rand_key) => {
        let pdf_file_name = this.get_title_pdf();
        var url = '/app/api/v2/dial/generatepdf/dial_record_a_download';
        await axios({
            url: url,
            method: 'POST',
            data:{
                patient_number,                
                key:rand_key,
            }, 
            responseType: 'blob', // important
        }).then((response) => {
            if (response.data != null){
                const blob = new Blob([response.data], { type: 'application/octet-stream' });

                if(window.navigator.msSaveOrOpenBlob) {
                    //IE11 & Edge
                    window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
                }
                else{
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', pdf_file_name); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                }
            }
        })
        .catch(() => {           
        });        
    }

    plusDivs = (n) => {
        this.showDivs(this.slideIndex += n);
    }

    showDivs(n) {
        var i;
        var x = document.getElementsByClassName("one-item");
        if (n > x.length) {this.slideIndex = 1}
        if (n < 1) {this.slideIndex = x.length}
        for (i = 0; i < x.length; i++) {
          x[i].style.display = "none";  
        }
        x[this.slideIndex-1].style.display = "block";
      }

    get_title_pdf = () => {
      let server_time = this.props.start_date.split("-").join("") + "-" + this.props.end_date.split("-").join("");
      let pdf_file_name = "透析記録" + "_" + server_time + ".pdf";

      return pdf_file_name;
    }
    onHide = () => {};

    render() {
        var {treat_monitor_list_multi, showImange_multi, disease_history_multi, instruction_list_multi} = this.state;
        return  (
            <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal printer-modal first-view-modal">
              <Modal.Header>
                <Modal.Title>透析記録用紙</Modal.Title>
              </Modal.Header>              
                <Modal.Body>
                    <Modal_Body>
                        {this.state.schedule_datas != undefined && this.state.schedule_datas != null && this.state.schedule_datas.length > 0 && (
                            <>
                            <button className="w3-button w3-black w3-display-left" onClick={this.plusDivs.bind(this,-1)}>&#10094;</button>
                            <button className="w3-button w3-black w3-display-right" onClick={this.plusDivs.bind(this,1)}>&#10095;</button>
                            </>
                        )}                        
                        <div className="print-area">
                        {this.state.is_loaded && this.state.sheet_style =='A' && this.state.schedule_datas != undefined && this.state.schedule_datas != null && this.state.schedule_datas.length > 0 && (
                            this.state.schedule_datas.map((schedule_data, index) => {
                                return (
                                    <>
                                        <div className="one-item" id = {'item_' + index}>
                                            <DialRecord_A_Multi
                                                // ref={el => (this.componentRef = el)}
                                                rows_blood={schedule_data.handle_data.blood_data}
                                                rows_measure={schedule_data.handle_data.measure_data}
                                                rows_temp={schedule_data.handle_data.temperature_data}
                                                schedule_data={schedule_data}
                                                patientInfo = {this.props.patientInfo}
                                                schedule_date={schedule_data.schedule_date}
                                                treat_monitor_list = {treat_monitor_list_multi[index]}
                                                disease_history = {disease_history_multi[index]}
                                                showImage = {showImange_multi[index]}
                                                instruction_list = {instruction_list_multi[index]}
                                                staff_list_by_number = {this.state.staff_list_by_number}
                                                doctor_list_by_number = {this.state.doctor_list_by_number}
                                                ref={(ref) => this.ChartRef[index] = ref}
                                                index = {index}
                                            />
                                        </div>
                                        
                                    </>
                                )
                            })
                        )}
                        {this.state.is_loaded == false && (
                            <>
                            <SpinnerWrapper>
                                <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                            </>
                        )}
                        {this.state.is_loaded == true && this.state.schedule_datas.length == 0 && (
                            <div>登録された透析スケジュールがありません。</div>
                        )}
                        </div>
                    </Modal_Body>
                </Modal.Body>
                <Modal.Footer>
                  <Button className='cancel-btn' onClick={this.props.closeModal}>キャンセル</Button>
                  <Button className='red-btn' size="small" color="primary" onClick={this.savePDFServer.bind(this)}>印刷</Button>
                </Modal.Footer>
                {this.state.isConfirmComplete == true && (
                    <CompleteStatusModal
                        message = {this.state.complete_message}
                    />
                )}
            </Modal>
            
        );
    }
}

MultiRecordSheetPreviewModal.contextType = Context;

MultiRecordSheetPreviewModal.propTypes = {
    print_data: PropTypes.object,
    closeModal: PropTypes.func,
    patientInfo : PropTypes.object,
    start_date : PropTypes.string,
    end_date : PropTypes.string,
};

export default MultiRecordSheetPreviewModal;