import React, { Component } from "react";
import PropTypes from "prop-types";
import DoneGeneralModal from "~/components/templates/Dial/Board/molecules/DoneGeneralModal"
import DonePrescriptionModal from "~/components/templates/Dial/Board/molecules/DonePrescriptionModal"
import * as apiClient from "~/api/apiClient";

class BedMonitorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isOpenPrescDoneModal:false,
          isOpenDoneModal:false,
          title:'',          
        }
    }

    getFontSize=(patientName)=>{
      if(patientName === ""){
          return;
      }
      let kanaregexp = new RegExp('[\uff00-\uff9f]');
      let zenkaku_number = ["０","１","２","３","４","５","６","７","８","９"];
      let nLength = 0;
      for (let i = 0; i < patientName.length; i++) {
        if(kanaregexp.test(patientName[i]) != true){
          nLength += 2;
        } else if(zenkaku_number.includes(patientName[i])) {
          nLength += 2;
        } else {
          nLength += 1;
        }
      }
      if(nLength < 27){
        return (this.props.width_fontsize*0.8)+"px";
      } else {
        return parseFloat(this.props.width_fontsize*0.8*26/nLength) + "px";
      }
    };

    getMethodStyle=(type, infection_status, bed_data)=>{
      let width_fontsize = this.props.width_fontsize;
      if(type === "width"){
        let sub_length = 0;
        if(infection_status !== ""){
            sub_length++;
        }
        if(bed_data != null && bed_data['instruct_flag'] !== undefined && bed_data['instruct_flag'] === 1){
            sub_length++;
        }
        return "calc(100% - "+(width_fontsize*sub_length)+"px)";
      }
      if(type === "font-size"){
        if(this.props.view_content == 1){
            let sub_length = 0;
            if(infection_status !== ""){
                sub_length++;
            }
            if(bed_data != null && bed_data['instruct_flag'] !== undefined && bed_data['instruct_flag'] === 1){
                sub_length++;
            }
            return sub_length === 0 ? (width_fontsize*0.45)+"px" : (sub_length === 1 ? (width_fontsize*0.4)+"px" : (width_fontsize*0.35)+"px");
        } else {
            return (width_fontsize*0.75)+"px";
        }
      }
      if (type == 'border'){
        if(this.props.view_content == 3){
          if (bed_data != null && bed_data['check_blood_flag'] == false) return '1px dotted red';
        }
        return 'none';
      }
    }

    openDoneModal = (done_list, title) => {
      if (done_list == undefined || done_list == null || done_list.length == 0) return;
      this.setState({
        isOpenDoneModal:true,
        done_list:done_list,
        title, 
      })
    }
    openPrescDoneModal = (done_list, title) => {
      if (done_list == undefined || done_list == null || done_list.length == 0) return;
      this.setState({
        isOpenPrescDoneModal:true,
        done_list:done_list,
        title,
      })
    }

    closeModal = () => {
      this.setState({
        isOpenDoneModal:false,
        isOpenPrescDoneModal:false,
        title:'',
        done_list:[],
      })
    }

    saveEditedSchedule = async (updated_data, title) => {
      let post_data = {
        title: title,
        updated_data: updated_data,
        date: this.props.bed_data.schedule_date,
        system_patient_id: this.props.bed_data.system_patient_id,
      };
      let path = "/app/api/v2/dial/schedule/update_done_status";
      await apiClient.post(path, { params: post_data }).then(() => {        
        this.props.refresh();
      });
    };

    render() {
      const {
        bed_data, bedId, patientName, exam_status, injection_status, dialprescription_status, prescription_status, sendingPrescription,
        roundFinish_status, dialTime, finishTime, infection_status, showTimeStatus, width_fontsize, height_fontsize, exam_list, injection_list,
        dialprescription_list, prescription_list
      } = this.props;
      return (
        <div className={"box-bed " + (bed_data != null ? bed_data.system_patient_id+"-bed" : "")}
          onContextMenu={e => {if(this.props.handleClick != null) this.props.handleClick(e, bed_data);}}
          onDoubleClick={e => {if(this.props.goBedside != null) this.props.goBedside(bed_data,e);}}
          // onMouseOver={e => {if(this.props.patientNameHover != null && bed_data != null) this.props.patientNameHover(e, bed_data, bed_data.system_patient_id+"-bed");}}
          // onMouseOut={e => {if(this.props.closeNameHover != null) this.props.closeNameHover(e);}}
        >
          <div className="bed-id" style={{fontSize:(width_fontsize*1.5)+"px", height:(height_fontsize*5.3)+"px", lineHeight:(height_fontsize*5.3)+"px"}}>{bedId}</div>
          <div className={'bed-info'} style={{height:(height_fontsize*5.3)+"px"}}>
            <div className="flex dial-finish" style={{height:(height_fontsize*1.295)+"px", lineHeight:(height_fontsize*1.295)+"px"}}>
              <div className={roundFinish_status ? "finish-status blue" : "finish-status"}>{bed_data != null ? bed_data.patient_number : ""}</div>
              { showTimeStatus == 0 ? (
                  <div className={dialTime ? "finish-time grey" : "finish-time"}>{dialTime}</div>
              ) : (
                  <div className={finishTime ? "finish-time grey" : "finish-time"}>{"終 : "+ finishTime}</div>
              )}
            </div>
            <div
              className="patient-name"
              style={{height:(height_fontsize*1.295)+"px", lineHeight:(height_fontsize*1.295)+"px", fontSize:this.getFontSize(patientName)}}
            >
              {patientName}
            </div>
            <div className="flex execution-status" style={{height:(height_fontsize*1.295)+"px", lineHeight:(height_fontsize*1.295)+"px"}}>
              <div onClick={this.openDoneModal.bind(this, exam_list, '検査')} className={exam_status === 2 ? "status-box blue clickable" : exam_status === 1 ? "status-box pink clickable" : "status-box"}>
                  {(exam_status === 2 || exam_status === 1) ? "検" : ""}
              </div>
              <div onClick={this.openDoneModal.bind(this, injection_list, '注射')} className={injection_status === 2 ? "status-box blue clickable" : injection_status === 1 ? "status-box pink clickable" : "status-box"}>
                  {(injection_status === 2 || injection_status === 1) ? "注":""}
              </div>
              <div onClick={this.openDoneModal.bind(this, dialprescription_list, '透析中処方')} className={dialprescription_status === 2 ? "status-box blue clickable" : dialprescription_status === 1 ? "status-box pink clickable" : "status-box"}>
                  {(dialprescription_status === 2 || dialprescription_status === 1) ? "薬":""}
              </div>
              <div onClick={this.openPrescDoneModal.bind(this, prescription_list, '処方')} className={prescription_status === 2 ? "status-box blue clickable" : prescription_status === 1 ? "status-box pink clickable" : "status-box"}>
                  {(prescription_status === 2 || prescription_status === 1) ? "処":""}
              </div>
              <div className={sendingPrescription === 2 ? "status-box blue" : sendingPrescription === 1 ? "status-box pink" : "status-box"}>
                  {(sendingPrescription === 2 || sendingPrescription === 1) ? "中" : ""}
              </div>
            </div>
            <div className="flex dial-status"  style={{height:(height_fontsize*1.295)+"px", lineHeight:(height_fontsize*1.295)+"px", alignItems:"none"}}>
              {infection_status !== '' && (
                  <div className={"infectious-status red-block"}>{infection_status === 1 ? "-" : "☆"}</div>
              )}
              <div className="dial-method" style={{
                width:this.getMethodStyle('width', infection_status,bed_data), 
                paddingRight:"0.1rem", 
                fontSize:this.getMethodStyle('font-size', infection_status,bed_data),
                border:this.getMethodStyle('border', infection_status,bed_data)
              }}>
                {(bed_data != null && bed_data['content'] != null && bed_data['content'][this.props.view_content] !== undefined) ? bed_data['content'][this.props.view_content] : ""}
              </div>
              {(bed_data != null && bed_data['instruct_flag'] !== undefined && bed_data['instruct_flag'] === 1) && (<div className="instruction-mark text-right" style={{width:"1rem", fontSize:"0.7rem", lineHeight:"1.2rem"}}>指</div>)}
            </div>
          </div>
        {this.state.isOpenDoneModal && (
          <DoneGeneralModal
            done_list={this.state.done_list}
            modal_title ={this.state.title}
            closeModal={this.closeModal}            
            saveEditedSchedule={this.saveEditedSchedule}
          />
        )}
        {this.state.isOpenPrescDoneModal && (
          <DonePrescriptionModal
            done_list={this.state.done_list}
            modal_title ={this.state.title}
            closeModal={this.closeModal}            
            saveEditedSchedule={this.saveEditedSchedule}
          />
        )}
        </div>
      );
    }
}

BedMonitorComponent.defaultProps = {
    bed_data: null,
    handleClick: null,
    goBedside: null,
    patientNameHover: null,
    closeNameHover: null,
};

BedMonitorComponent.propTypes = {
    bed_data: PropTypes.array,
    bedId: PropTypes.number,
    patientName: PropTypes.string,
    exam_status: PropTypes.number,
    injection_status: PropTypes.number,
    dialprescription_status: PropTypes.number,
    prescription_status: PropTypes.number,
    sendingPrescription: PropTypes.number,
    roundFinish_status: PropTypes.number,
    width_fontsize: PropTypes.number,
    height_fontsize: PropTypes.number,
    dialTime: PropTypes.string,
    finishTime: PropTypes.number,
    infection_status: PropTypes.string,
    view_content: PropTypes.string,
    showTimeStatus: PropTypes.number,
    handleClick: PropTypes.func,
    goBedside: PropTypes.func,
    patientNameHover: PropTypes.func,
    closeNameHover: PropTypes.func,

    exam_list: PropTypes.array,
    injection_list: PropTypes.array,
    dialprescription_list: PropTypes.array,
    prescription_list: PropTypes.array,
    refresh:PropTypes.func
  };

export default BedMonitorComponent;
                        