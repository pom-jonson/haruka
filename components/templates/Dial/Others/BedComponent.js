import React, { Component } from "react";
import PropTypes from "prop-types";
import * as sessApi from "~/helpers/cacheSession-utils";
import {makeList_code} from "~/helpers/dialConstants";
import $ from "jquery";


class BedComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      console_name:props.console_name,
    }
    this.bedRef = React.createRef();
    this.mousemove_flag = false;
    this.scroll_flag = false;
  }
  
  componentDidMount(){
    let console_master = sessApi.getObjectValue("dial_common_master","console_master");
    this.setState({
      console_master_code_list:makeList_code(console_master, 1),
    });
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener('dragover', function(e){
      if (that.mousemove_flag){
        var step = 10;
        var parent_top = $('.bed-table-area').offset().top;
        var body_height = $('.bed-table-area').height();
        that.scroll_flag = false;
        if ((e.clientY - parent_top) > body_height-100){
          that.scroll_flag = true;
          that.autoscroll(step);
        }
        if ((e.clientY-parent_top) < 100){
          that.scroll_flag = true;
          that.autoscroll(-step);
        }
      }
      
    }, false);
  }
  
  autoscroll(step){
    var scrollTop = $('.bed-table-area').scrollTop();
    $('.bed-table-area').scrollTop(scrollTop + step);
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      console_name: nextProps.console_name,
    });
  }
  
  onDragStart = (e, bed_data) => {
    if(bed_data['start_date'] == null && bed_data['console_start_date'] == null && bed_data['pre_start_confirm_at'] == null){
      this.mousemove_flag = true;
      // get clipboard data
      let before_data = "";
      if (window.clipboardData) {
        before_data = window.clipboardData.getData ("Text");
      }
      e.dataTransfer.setData("text", e.target.id );
      // set clipboardData
      if (window.clipboardData) {
        window.clipboardData.setData ("Text", before_data);
      }
      e.stopPropagation();
    } else {
      let alert_messages = '開始前確認が完了しているためベッド情報を変更できません。';
      if (bed_data.end_date != undefined && bed_data.end_date != null)
        alert_messages = 'スケジュールが完了しているためベッド情報を変更できません。';
      window.sessionStorage.setItem("alert_messages", alert_messages);
      e.preventDefault();
      //   e.stopPropagation();
    }
  };
  
  onDropEvent = e => {
    // initialize bed color
    this.bedRef.classList.remove("hover-bed-style");
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    var schedule_number = data.split("_")[0];
    var from_bedId= data.split("_")[1];
    var obj = e.target;
    var to_bedId = "";
    var to_schedule_number = "";
    var patient_name = "";
    do {
      if( obj.id != undefined && obj.id != null && obj.id != "" && to_bedId === ''){
        var bedBox = document.getElementById(obj.id);
        to_bedId = bedBox.getAttribute('bed_no');
        to_schedule_number = bedBox.getAttribute('schedule_number');
        patient_name = bedBox.getAttribute('patient_name');
      }
      obj = obj.parentElement;
    } while(obj.tagName.toLowerCase() !== "body");
    this.mousemove_flag = false;
    if(from_bedId == 100 && to_bedId == 100){
      return;
    }
    if(from_bedId !== undefined){
      this.props.changeBed(schedule_number,from_bedId, to_bedId, to_schedule_number, patient_name);
    }
  };
  
  onDragOver = (e, bed_obj) => {
    // paint enable moving bed color
    bed_obj.classList.add("hover-bed-style");
    e.preventDefault();
  };
  
  onDragLeave = (e, bed_obj) => {
    // paint original bed color
    bed_obj.classList.remove("hover-bed-style");
    e.preventDefault();
  };
  
  getFontSize=(patientName)=>{
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
    if(nLength < 21){
      return this.props.width_fontsize+"px";
    } else {
      return parseFloat(this.props.width_fontsize*20/nLength) + "px";
    }
  };
  
  render() {
    const {type, bedId, bed_no, bed_data, width_fontsize, height_fontsize} = this.props;
    const flag = (bed_data != undefined && bed_data != null ) ? true : false;
    if (flag) {
      if(bed_data.end_date !== undefined && bed_data.end_date != null){
        return (
          <>
            <div
              className={"flex padding-bed " + bed_data.system_patient_id+"-bed"}
              onContextMenu={e => {if(this.props.handleClick != null) this.props.handleClick(e,bed_data);}}
              onDragStart={e => this.onDragStart(e, bed_data)}
              draggable={true}
              onDoubleClick={e => {if(this.props.goBedside != null) this.props.goBedside(bed_data,e);}}
              id={bed_data['schedule_number'] + '_' + bed_data['bed_no']}
              bed_no={bed_no}
              schedule_number={bed_data['schedule_number']}
              patient_name={bed_data['patient_name']}
              onDragOver={e=>this.onDragOver(e, this.bedRef)}
              onDragLeave={e=>this.onDragLeave(e, this.bedRef)}
              ref={e => this.bedRef = e}
            >
              <div
                className={"border-1p " + (type ? "bed-id" : "no-bed-id")}
                style={{
                  backgroundColor:(bed_data['start_date'] != null || bed_data['console_start_date'] != null) ? "#F8ABA6" : (bed_data['pre_start_confirm_at'] != null ? "#00c9ff" : ""),
                  height:((height_fontsize*5.3)+"px"),
                  lineHeight:(height_fontsize*5.3)+"px",
                  fontSize:(width_fontsize*1.5)+"px"
                }}
              >
                {type ? bedId : ""}
              </div>
              <div className={"border-1p bed-info"} style={{height:(height_fontsize*5.3)+"px"}}>
                <div className="flex">
                  <div className="patient-id" style={{height:((height_fontsize*1.2)+"px")}}>{bed_data['patient_number']}</div>
                  <div className="dial-time" style={{backgroundColor:"black", color:"white", height:((height_fontsize*1.2)+"px")}}>{bed_data['reservation_time']}</div>
                </div>
                <div
                  className={"patient-name"}
                  style={{fontSize:this.getFontSize(bed_data['patient_name']), height:height_fontsize*1.5+"px", lineHeight:height_fontsize*1.5+"px"}}
                  onMouseOver={e => {if(this.props.patientNameHover != null) this.props.patientNameHover(e, (bed_data['patient_name'].length > 10 ? bed_data['patient_name'] : ""), bed_data['patient_number']);}}
                  onMouseOut={e => {if(this.props.closeNameHover != null) this.props.closeNameHover(e);}}
                >
                  {bed_data['patient_name']}</div>
                <div className="dial-method flex" style={{height:(height_fontsize*1.2)+"px", lineHeight:(height_fontsize*1.2)+"px"}}>
                  <div>{bed_data['dial_method']}</div>
                  {bed_data['instruct_flag'] == 1 && (<div className="instruction-mark text-right">指</div>)}
                </div>
                <div className="dial-method flex" style={{height:(height_fontsize*1.2)+"px", lineHeight:(height_fontsize*1.2)+"px"}}>
                  <div className={''} style={{color:'black'}}>{this.state.console_master_code_list != undefined ? this.state.console_master_code_list[bed_data['console']] : ''}</div>
                  <div className={'text-right'} style={{color:'blue', paddingRight:((width_fontsize*0.2)+"px")}}>{this.state.console_master_code_list != undefined ? this.state.console_master_code_list[bed_data['default_console_code']] : ''}</div>
                </div>
              </div>
            </div>
          </>
        );
      } else {
        return (
          <div className={"flex padding-bed " + bed_data.system_patient_id+"-bed"}
               draggable={true}
               onDragStart={e => this.onDragStart(e, bed_data)}
               onContextMenu={e => {if(this.props.handleClick != null) this.props.handleClick(e, bed_data);}}
               onDoubleClick={e => {if(this.props.goBedside != null) this.props.goBedside(bed_data,e);}}
               id={bed_data['schedule_number'] + '_' + bed_data['bed_no']}
               bed_no={bed_no}
               schedule_number={bed_data['schedule_number']}
               patient_name={bed_data['patient_name']}
               onDrop={e => this.onDropEvent(e)}
               onDragOver={e => this.onDragOver(e, this.bedRef)}
               onDragLeave={e=>this.onDragLeave(e, this.bedRef)}
               ref={e => this.bedRef = e}
          >
            <div
              className={"border-1p " + (type ? "bed-id" : "no-bed-id")}
              style={{
                backgroundColor:(bed_data['start_date'] != null || bed_data['console_start_date'] != null) ? "#F8ABA6" : (bed_data['pre_start_confirm_at'] != null ? "#00c9ff" : ""),
                height:(height_fontsize*5.3)+"px",
                lineHeight:(height_fontsize*5.3)+"px",
                fontSize:(width_fontsize*1.5)+"px"
              }}
            >
              {type ? bedId : ""}
            </div>
            <div className={"border-1p bed-info"}>
              <div className="flex">
                <div className="patient-id" style={{height:((height_fontsize*1.2)+"px")}}>{bed_data['patient_number']}</div>
                <div className="dial-time" style={{height:((height_fontsize*1.2)+"px")}}>{bed_data['reservation_time']}</div>
              </div>
              <div
                className={"patient-name"}
                style={{fontSize:this.getFontSize(bed_data['patient_name']), height:height_fontsize*1.5+"px", lineHeight:height_fontsize*1.5+"px"}}
                onMouseOver={e => {if(this.props.patientNameHover != null) this.props.patientNameHover(e, (bed_data['patient_name'].length > 10 ? bed_data['patient_name'] : ""), bed_data['patient_number']);}}
                onMouseOut={e => {if(this.props.closeNameHover != null) this.props.closeNameHover(e);}}
              >
                {bed_data['patient_name']}
              </div>
              <div className="dial-method flex" style={{height:(height_fontsize*1.2)+"px", lineHeight:(height_fontsize*1.2)+"px"}}>
                <div>{bed_data['dial_method']}</div>
                {bed_data['instruct_flag'] == 1 && (<div className="instruction-mark text-right">指</div>)}
              </div>
              <div className="dial-method flex" style={{height:(height_fontsize*1.2)+"px", lineHeight:(height_fontsize*1.2)+"px"}}>
                <div className={''} style={{ color:'black'}}>{this.state.console_master_code_list != undefined ? this.state.console_master_code_list[bed_data['console']] : ''}</div>
                <div className={'text-right'} style={{color:'blue', paddingRight:(width_fontsize*0.2)+"px"}}>{this.state.console_master_code_list != undefined ? this.state.console_master_code_list[bed_data['default_console_code']] : ''}</div>
              </div>
            </div>
          </div>
        );
      }
    } else {
      if(type) {
        return (
          <>
            <div className={"flex padding-bed bed-no-" + bedId} id={"no-bed" + bed_no} bed_no={bed_no} style={{height:((height_fontsize*5.3)+"px"), lineHeight:((height_fontsize*5.3)+"px")}}
                 onDrop={e => this.onDropEvent(e)}
                 onDragOver={e => this.onDragOver(e, this.bedRef)}
                 onDragLeave={e=>this.onDragLeave(e, this.bedRef)}
                 ref={e => this.bedRef = e}
            >
              <div className="border-1p bed-id" style={{height:(height_fontsize*5.3)+"px", lineHeight:(height_fontsize*5.3)+"px",fontSize:(width_fontsize*1.5)+"px"}}>{bedId}</div>
              <div className="border-1p bed-info" style={{height:(height_fontsize*5.3)+"px"}}>
                <div className="dial-method" style={{height:(height_fontsize*1.2)+"px", lineHeight:(height_fontsize*1.2)+"px", paddingTop:((height_fontsize*4)+"px")}}>
                  <div className={'text-right console'} style={{color:'blue', paddingRight:((width_fontsize*0.2)+"px")}}>{this.state.console_name}</div>
                </div>
              </div>
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="flex padding-bed" id={"no-bed" + bed_no} bed_no={bed_no}
                 onDrop={e => this.onDropEvent(e)}
                 onDragOver={e => this.onDragOver(e, this.bedRef)}
                 onDragLeave={e=>this.onDragLeave(e, this.bedRef)}
                 ref={e => this.bedRef = e}
            >
              <div className="border-1p no-bed-id" style={{height:((height_fontsize*5.3)+"px"), lineHeight:((height_fontsize*5.3)+"px")}}></div>
              <div className="border-1p bed-info" style={{height:(height_fontsize*5.3)+"px"}}></div>
            </div>
          </>
        );
      }
    }
  }
}

BedComponent.defaultProps = {
  bed_data: null,
  handleClick: null,
  goBedside: null,
  patientNameHover: null,
  closeNameHover: null,
};

BedComponent.propTypes = {
  type: PropTypes.number,
  bed_no: PropTypes.number,
  bedId: PropTypes.number,
  width_fontsize: PropTypes.number,
  height_fontsize: PropTypes.number,
  bed_data: PropTypes.object,
  changeBed: PropTypes.func,
  handleClick: PropTypes.func,
  goBedside: PropTypes.func,
  patientNameHover: PropTypes.func,
  closeNameHover: PropTypes.func,
  console_name: PropTypes.string,
};

export default BedComponent;
