import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import * as sessApi from "~/helpers/cacheSession-utils";

import EditInspectionModal from "./modals/EditInspectionModal";
import { withRouter } from "react-router-dom";
import xp_image from "~/components/_demo/xp.jpg";
import heart from "~/components/_demo/heart.jpg";
import renderHTML from 'react-render-html';
import {Dial_tab_index} from "~/helpers/dialConstants";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import {makeList_code} from "~/helpers/dialConstants";
import {formatDateLine} from "~/helpers/date";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 0.75rem;
  width: 100%;  
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 10px;
  label {
      text-align: right;
  }
  table {
    margin:0;    
    .week_day:hover{
      background:#F2F2F2!important;
    }
    thead{
      display: table;
      width: calc(100% - 17px);
      th{
        border: 1px solid #dee2e6;
        border-right:none;
        label{
          width:100%;
          border-bottom:1px solid #dee2e6;
          text-align:center;
          margin:0px;          
        }
      }
    }
    tbody{
      height: calc(100vh - 11.25rem);  
      overflow-y:scroll;
      display:block;
    }
    td {
      vertical-align:middle;
      text-align:center;      
      padding: 0;
      width:3%;
      font-size:0.8rem;
      word-break:break-all;
      word-wrap:break-word;
      .cell{
        width:50%;
        text-align: center;
      }
      border: 1px solid #dee2e6;
      border-right:none;
    }
    th {
      text-align: center;
      font-size: 1rem;
      padding: 0;
      width:3%;
      word-break:break-all;
      word-wrap:break-word;
    }
    .number_name{
      width:7%;
      padding-left:2px;      
      span{
        font-size:0.9rem;
      }
    }
    .selected_color{
      background: darkcyan!important;
      color: white;
      span{
        color:white;
      }
    }
    tr {
      box-sizing: border-box;
    }
  }
  .morning{
    background-color:lightyellow;
  }
  .afternoon{
    background-color:lightgreen;
  }
  .evening{
    background-color:lightblue;
  }
  .night{
    background-color:lightgrey;
  }
  .updated{
    color:red;
  }   
  .temporary span{
    border:1px solid red;
  }
 `;

  const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 300;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: normal;
    line-height: 1.2rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    border-bottom: 1px solid #cfcbcb;
    div {
      padding: 0.75rem;
    }    
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;
const TooltipTitleMenuUl = styled.ul`
    margin-bottom: 0px !important;
  .context-menu {    
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 15px;
    position: absolute;
    text-align: left;
    overflow-y: auto;
    max-height: 35rem;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    width: 30rem;    
    border: 2px solid #807f7f;
    border-radius: 12px;
    margin-bottom: 0px !important;
  }
  font-size: 1rem;
`;
const TooltipTitle = ({visible,x,y,title}) => {
    if (visible) {
      let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
      let examination_codes = makeList_code(examinationCodeData);
        return (
            <TooltipTitleMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    {title.map((pres_item)=>{
                        return (
                            <>
                                <div>
                                    {pres_item.is_temporary != null && pres_item.is_temporary == 0 ? "【定期検査】" :"【臨時検査】"}
                                </div>
                                {pres_item.examination_code != null && (
                                <>
                                    <div>
                                        {pres_item.is_completed==1?"済) ":"未) "}{pres_item.examination_code != null && examination_codes[pres_item.examination_code]}
                                    </div>
                                </>
                                )}
                            </>
                        )
                    })}
                </ul>
            </TooltipTitleMenuUl>
        );
    } else {
        return null;
    }
};
const ContextMenu = ({visible, x, y,parent,  system_patient_id, schedule_date, patientInfo}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.showEditModal(system_patient_id, schedule_date, patientInfo)}>編集</div></li>
          <li><div onClick={() => parent.goOtherPattern("/dial/pattern/inspection", system_patient_id)}>検査パターンへ</div></li>
          <li><div onClick={() => parent.move_to_doctor_karte(schedule_date, system_patient_id)}>Drカルテへ</div></li>  
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu_patient = ({visible, x, y,parent,  system_patient_id}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.goOtherPattern("/dial/pattern/inspection", system_patient_id)}>検査パターンへ</div></li>
          <li><div onClick={() => parent.move_to_doctor_karte(formatDateLine(new Date()), system_patient_id)}>Drカルテへ</div></li>          
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu_move_to_bed = ({visible, x, y,parent, date}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li> <div onClick={() => parent.move_to_bed(date)}>ベッド配置表に移動</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu_other = ({visible, x, y,parent, day, patient_id}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li> <div onClick={() => parent.showAddModal(day, patient_id)}>検査スケジュール追加</div></li>
          <li><div onClick={() => parent.goOtherPattern("/dial/pattern/inspection", patient_id)}>検査パターンへ</div></li>
          <li><div onClick={() => parent.move_to_doctor_karte(day, patient_id)}>Drカルテへ</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};
const holidays_color = JSON.parse(window.sessionStorage.getItem("init_status")).dial_schedule_date_color;

class Inspection extends Component {
    constructor(props) {            
      super(props);  
      var holidays = this.props.holidays!= undefined? Object.keys(this.props.holidays):null;           
      this.state = {                             
          list_date_week:this.props.list_date_week,
          list_dialysis_schedule:this.props.list_schedule,    
          list_matrix: this.props.list_matrix,
          new_list_matrix: this.props.new_list_matrix,
          list_by_date: this.props.list_by_date,
          patient_list: this.props.patient_list,      
          isOpenEditScheduleModal: false,          
          schedule_item:[],            
          patients_same_day:[],                         
          schGroup: 0,
          schOrder: 0,
          holidays
      };
      this.tr_index = null;
      this.td_index = null;
      this.setbackColorFlag = null;
    }
    
    UNSAFE_componentWillReceiveProps(nextProps) {      
      var holidays = nextProps.holidays!= undefined? Object.keys(nextProps.holidays):null;
      this.setState({
         list_date_week: nextProps.list_date_week,
         list_dialysis_schedule:nextProps.list_schedule,
         holidays,
       });
       this.scrollHorizontalToElement();
    }

    scrollHorizontalToElement() {
      var obj_target = document.getElementsByClassName('today-th');
      if (obj_target == undefined || obj_target == null || obj_target.length == 0) return;
      obj_target = obj_target[0];
      var wrapper = document.getElementById('wrapper');
      if (wrapper != undefined){
        var wrapper_width = wrapper.offsetWidth;
        var obj_left = obj_target.offsetLeft;
        var obj_width = obj_target.offsetWidth;
        wrapper.scrollLeft = obj_left - (wrapper_width - obj_width)/2;
      }
    }

    closeModal = () => {
        this.setState({
          isOpenEditScheduleModal: false,
        })
    };

    setBackcolor = (date, day_of_week) => {
      var holidays = this.state.holidays;
      if (holidays == undefined || holidays == null || holidays.length == 0 || !holidays.includes(date)){
        if (holidays_color.days[day_of_week] == undefined || holidays_color.days[day_of_week] == null){
          return holidays_color.default.schedule_date_cell_back;  
        } else {
          return holidays_color.days[day_of_week].schedule_date_cell_back;
        }
      } else {
        return holidays_color.holiday.schedule_date_cell_back;
      }
    }

    setFontcolor = (date, day_of_week) => {
      var holidays = this.state.holidays;
      if (holidays == undefined || holidays == null || holidays.length > 0 || !holidays.includes(date)){
        if (holidays_color.days[day_of_week] == undefined || holidays_color.days[day_of_week] == null){
          return holidays_color.default.schedule_date_cell_font;  
        } else {
          return holidays_color.days[day_of_week].schedule_date_cell_font;
        }
      } else {
        return holidays_color.holiday.schedule_date_cell_font;
      }
    }

    showEditModal=(system_patient_id, schedule_date, patientInfo) =>{
        this.setState({
          system_patient_id:system_patient_id,
          schedule_date:schedule_date,
          patientInfo,
          isOpenEditScheduleModal: true,
          temporary:0,
          add_flag:false,
        });
    };

    showAddModal (schedule_date, patient_id) {
      this.setState({
        isOpenEditScheduleModal:true,
        schedule_date,
        system_patient_id:patient_id,
        temporary:0,
        add_flag:true,
        patientInfo:this.props.patient_list[patient_id]
      })
    }

    handleClick_patient = (e, system_patient_id, tr_index, td_index) => {
      e.preventDefault();
      this.changeBackgroundColor(tr_index, td_index);
      // eslint-disable-next-line consistent-this
      var that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu_patient: { visible: false } }, ()=>{
            that.moveArea('remove-back-color');
        });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({contextMenu_patient: { visible: false }}, ()=>{
            that.moveArea('remove-back-color');
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("schedule-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu_patient: { visible: false },
          }, ()=>{
              that.moveArea('remove-back-color');
          });
          document
            .getElementById("schedule-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      
      document
        .addEventListener("wheel", function onScrollOutside() {
          that.setState({
            contextMenu_patient: { visible: false },
          }, ()=>{
            that.moveArea('remove-back-color');
          });
        document
          .getElementById("schedule-table")
          .removeEventListener(`wheel`, onScrollOutside);
      });
      this.setState({
        contextMenu_patient: {
          visible: true,
          x: e.clientX-200,
          y: e.clientY + window.pageYOffset,
          system_patient_id:system_patient_id},
          contextMenu_other:{visible:false},
          contextMenu_move_to_bed:{visible:false},
          contextMenu:{visible:false},
        })
    }

    handleClick = (e, system_patient_id, schedule_date, patientInfo, tr_index, td_index) => {
      this.setbackColorFlag = null;
      this.changeBackgroundColor(tr_index, td_index);
      // if (e.type === "contextmenu") {
        // e.preventDefault();
        // eslint-disable-next-line consistent-this
        const that = this;
        document.addEventListener(`click`, function onClickOutside() {
          that.setState({ contextMenu: { visible: false } }, ()=>{
            that.moveArea('remove-back-color');
        });
          document.removeEventListener(`click`, onClickOutside);
        });
        window.addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          }, ()=>{
            that.moveArea('remove-back-color');
        });
          window.removeEventListener(`scroll`, onScrollOutside);
        });
        document
            .getElementById("schedule-table")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                contextMenu: { visible: false }
              }, ()=>{
                that.moveArea('remove-back-color');
            });
              document
                .getElementById("schedule-table")
                .removeEventListener(`scroll`, onScrollOutside);
            });
        document
          .addEventListener("wheel", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false },
            }, ()=>{
              that.moveArea('remove-back-color');
            });
          document
            .getElementById("schedule-table")
            .removeEventListener(`wheel`, onScrollOutside);
        });
        let clientY = e.clientY;
        let clientX = e.clientX;
        this.setState({
            contextMenu: {
                visible: true,
                x: e.clientX-200,
                y: e.clientY + window.pageYOffset,
                system_patient_id:system_patient_id,
                schedule_date:schedule_date,
                patientInfo:patientInfo,
            },
            contextMenu_other:{visible:false},
            contextMenu_move_to_bed:{visible:false},
            contextMenu_patient:{visible:false},
        }, ()=>{
            let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
            let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
            let window_height = window.innerHeight;
            let window_width = window.innerWidth;
            if (clientY + menu_height > window_height && clientX + menu_width + 200 > window_width) {
                this.setState({
                    contextMenu: {
                        visible: true,
                        x: clientX-200-menu_width,
                        y: clientY - menu_height,
                        system_patient_id:system_patient_id,
                        schedule_date:schedule_date,
                        patientInfo:patientInfo,
                    },
                    contextMenu_other:{visible:false},
                    contextMenu_move_to_bed:{visible:false},
                    contextMenu_patient:{visible:false},
                })
            } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
                this.setState({
                    contextMenu: {
                        visible: true,
                        x: clientX-200,
                        y: clientY - menu_height,
                        system_patient_id:system_patient_id,
                        schedule_date:schedule_date,
                        patientInfo:patientInfo,
                    },
                    contextMenu_other:{visible:false},
                    contextMenu_move_to_bed:{visible:false},
                    contextMenu_patient:{visible:false},
                })
            } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
                this.setState({
                    contextMenu: {
                        visible: true,
                        x: clientX-200-menu_width,
                        y: clientY + window.pageYOffset,
                        system_patient_id:system_patient_id,
                        schedule_date:schedule_date,
                        patientInfo:patientInfo,
                    },
                    contextMenu_other:{visible:false},
                    contextMenu_move_to_bed:{visible:false},
                    contextMenu_patient:{visible:false},
                })
            }

        });
    }

    handleClick_other = (e, day, patient_id, tr_index, td_index) => {
      this.setbackColorFlag = null;
      this.changeBackgroundColor(tr_index, td_index);
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      var that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu_other: { visible: false } }, ()=>{
          that.moveArea('remove-back-color');
      });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_other: { visible: false }
        }, ()=>{
          that.moveArea('remove-back-color');
      });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
          .getElementById("schedule-table")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu_other: { visible: false }
            }, ()=>{
              that.moveArea('remove-back-color');
          });
            document
              .getElementById("schedule-table")
              .removeEventListener(`scroll`, onScrollOutside);
          });      
      document
        .addEventListener("wheel", function onScrollOutside() {
          that.setState({
            contextMenu_other: { visible: false },
          }, ()=>{
            that.moveArea('remove-back-color');
          });
        document
          .getElementById("schedule-table")
          .removeEventListener(`wheel`, onScrollOutside);
      });
      let clientY = e.clientY;
      let clientX = e.clientX;
      this.setState({
          contextMenu_other: {
              visible: true,
              x: e.clientX-200,
              y: e.clientY + window.pageYOffset,
              day:day,
              patient_id:patient_id
          },
          contextMenu:{visible:false},
          contextMenu_move_to_bed:{visible:false},
          contextMenu_patient:{visible:false},
      }, ()=>{
          let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
          let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
          let window_height = window.innerHeight;
          let window_width = window.innerWidth;
          if (clientY + menu_height > window_height && clientX + menu_width + 200 > window_width) {
              this.setState({
                  contextMenu_other: {
                      visible: true,
                      x: clientX-200-menu_width,
                      y: clientY - menu_height,
                      day:day,
                      patient_id:patient_id
                  },
                  contextMenu:{visible:false},
                  contextMenu_move_to_bed:{visible:false},
                  contextMenu_patient:{visible:false},
              })
          } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
              this.setState({
                  contextMenu_other: {
                      visible: true,
                      x: clientX-200,
                      y: clientY - menu_height,
                      day:day,
                      patient_id:patient_id
                  },
                  contextMenu:{visible:false},
                  contextMenu_move_to_bed:{visible:false},
                  contextMenu_patient:{visible:false},
              })
          } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
              this.setState({
                  contextMenu_other: {
                      visible: true,
                      x: clientX-200-menu_width,
                      y: clientY + window.pageYOffset,
                      day:day,
                      patient_id:patient_id
                  },
                  contextMenu:{visible:false},
                  contextMenu_move_to_bed:{visible:false},
                  contextMenu_patient:{visible:false},
              })
          }

      });
  }
    
    
    handleOk = (schedule_item) => {
      this.props.getSearchResult(new Date(schedule_item.schedule_date), 4);
      this.closeModal();
    };

    goOtherPattern = (url, systemPatientId) => {
        sessApi.delObjectValue("dial_setting","patient", "");
        sessApi.setObjectValue("dial_setting","patientById", systemPatientId);
        this.props.history.replace(url);
    }

    handleClick_move_to_bed = (e, date, tr_index, td_index) => {
        e.preventDefault();  
        this.changeBackgroundColor(tr_index, td_index);   
        // eslint-disable-next-line consistent-this
        var that = this; 
        document.addEventListener(`click`, function onClickOutside() {
          that.setState({ contextMenu_move_to_bed: { visible: false } });
          document.removeEventListener(`click`, onClickOutside);
        });
        window.addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu_move_to_bed: { visible: false }
          });
          window.removeEventListener(`scroll`, onScrollOutside);
        });
        document
            .getElementById("schedule-table")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                contextMenu_move_to_bed: { visible: false }
              });
              document
                .getElementById("schedule-table")
                .removeEventListener(`scroll`, onScrollOutside);
            });

        document
          .addEventListener("wheel", function onScrollOutside() {
            that.setState({
              contextMenu_move_to_bed: { visible: false },
            }, ()=>{
              that.moveArea('remove-back-color');
            });
          document
            .getElementById("schedule-table")
            .removeEventListener(`wheel`, onScrollOutside);
        });
        let clientY = e.clientY;
        let clientX = e.clientX;
        this.setState({
          contextMenu_move_to_bed: {
            visible: true,
            x: e.clientX-200,
            y: e.clientY + window.pageYOffset,
            date:date
          },
          contextMenu:{visible:false},
          contextMenu_other:{visible:false},
          contextMenu_patient:{visible:false},
        }, () =>{
            let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
            let window_width = window.innerWidth;
            if (clientX + menu_width + 200 > window_width) {
                this.setState({
                    contextMenu_move_to_bed: {
                        visible: true,
                        x: clientX-200-menu_width,
                        y: clientY,
                        date:date
                    },
                    contextMenu:{visible:false},
                    contextMenu_other:{visible:false},
                    contextMenu_patient:{visible:false},
                })
            }
        });
    }

    move_to_bed = (date) => {      
      var url = "/dial/others/bed_table";
      sessApi.setObjectValue("dial_bed_table", "schedule_date", date);
      setTimeout(()=>{
        this.props.history.replace(url);
      }, 500);
      
    }

    move_to_doctor_karte = (date, system_patient_id) => {      
      var url = "/dial/board/system_setting";
      sessApi.setObjectValue("from_print", "schedule_date", date);
      sessApi.setObjectValue("from_print", "system_patient_id", system_patient_id);
      sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.DRMedicalRecord);
      setTimeout(()=>{
        this.props.history.replace(url);
      }, 500);
      
    }

    showTitle = (e, item, tr_index, td_index) => {
        this.cellHover(e, tr_index, td_index)
        if (item == undefined || item == null) return;
        let clientY = e.clientY;
        let clientX = e.clientX;
        this.setState({
            tooltipTitle: {
                visible: true,
                x: e.clientX-200,
                y: e.clientY + window.pageYOffset,
                title: item
            },
        }, ()=>{
            let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
            let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
            let window_height = window.innerHeight;
            let window_width = window.innerWidth;
            if (clientY + menu_height > window_height && clientX + menu_width + 200 > window_width) {
                this.setState({
                    tooltipTitle: {
                        visible: true,
                        x: clientX-200-menu_width,
                        y: clientY - menu_height,
                        title: item
                    },
                })
            } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
                this.setState({
                    tooltipTitle: {
                        visible: true,
                        x: clientX-200,
                        y: clientY - menu_height,
                        title: item
                    },
                })
            } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
                this.setState({
                    tooltipTitle: {
                        visible: true,
                        x: clientX-200-menu_width,
                        y: clientY + window.pageYOffset,
                        title: item
                    },
                })
            }
          });
      };

    hideTooltip = () => {
      this.setState({ 
            tooltipTitle: { visible: false}
        });
    };

    cellHover=(e, tr_index, td_index)=>{
        let contextMenu = this.state.contextMenu;
        let contextMenu_other = this.state.contextMenu_other;
        let contextMenu_move_to_bed = this.state.contextMenu_move_to_bed;
        var contextMenu_patient = this.state.contextMenu_patient;
        if((contextMenu !== undefined && contextMenu.visible) || (contextMenu_patient !== undefined && contextMenu_patient.visible) || 
          (contextMenu_other !== undefined && contextMenu_other.visible) || (contextMenu_move_to_bed !== undefined && contextMenu_move_to_bed.visible)){
            return;
        }
        if(e){
            this.changeBackgroundColor(tr_index, td_index);
        }
    };

    changeBackgroundColor=(tr_index, td_index)=>{
      //#F2F2F2
      let tr_obj = document.getElementsByClassName("tr-"+tr_index)[0];
      if(tr_obj !== undefined && tr_obj != null){
          tr_obj.style['background-color'] = "#F2F2F2";
      }
      if(this.tr_index != null && this.tr_index !== tr_index){
          let tr_obj = document.getElementsByClassName("tr-"+this.tr_index)[0];
          if(tr_obj !== undefined && tr_obj != null){
              tr_obj.style['background-color'] = "";
          }
      }
      this.tr_index = tr_index;
      let td_obj = document.getElementsByClassName("td-"+td_index);
      if(td_obj !== undefined && td_obj != null){
          for (let j = 0; j < td_obj.length; j++){
              if(td_obj[j] !== undefined && td_obj[j] != null){
                  let schedule_flag = td_obj[j].getAttribute("schedule_flag");
                  if(schedule_flag != 1){
                      td_obj[j].style['background-color'] = "#F2F2F2";
                  }
              }
          }
      }
      if(this.td_index != null && this.td_index !== td_index){
          let td_obj = document.getElementsByClassName("td-"+this.td_index);
          // if(tr_obj !== undefined && tr_obj != null){
              for (let j = 0; j < td_obj.length; j++){
                  if(td_obj[j] !== undefined && td_obj[j] != null){
                      let schedule_flag = td_obj[j].getAttribute("schedule_flag");
                      if(schedule_flag != 1){
                          td_obj[j].style['background-color'] = "";
                      }
                  }
              }
          // }
      }
      this.td_index = td_index;
  };

    moveArea=(e)=>{
        let contextMenu = this.state.contextMenu;
        let contextMenu_other = this.state.contextMenu_other;
        let contextMenu_move_to_bed = this.state.contextMenu_move_to_bed;
        var contextMenu_patient = this.state.contextMenu_patient;
        if((contextMenu !== undefined && contextMenu.visible) || (contextMenu_patient !== undefined && contextMenu_patient.visible) || 
          (contextMenu_other !== undefined && contextMenu_other.visible) || (contextMenu_move_to_bed !== undefined && contextMenu_move_to_bed.visible)){
            return;
        }
        if(this.setbackColorFlag === 'contextmenu'){
            return;
        }
        if(e){
            if(this.tr_index == null){
                return;
            }
            let tr_obj = document.getElementsByClassName("tr-"+this.tr_index)[0];
            if(tr_obj !== undefined && tr_obj != null){
                tr_obj.style['background-color'] = "";
            }
            this.tr_index = null;
            let td_obj = document.getElementsByClassName("td-"+this.td_index);
            if(tr_obj !== undefined && tr_obj != null){
                for (let j = 0; j < td_obj.length; j++){
                    if(td_obj[j] !== undefined && td_obj[j] != null){
                        let schedule_flag = td_obj[j].getAttribute("schedule_flag");
                        if(schedule_flag != 1){
                            td_obj[j].style['background-color'] = "";
                        }
                    }
                }
            }
            this.td_index = null;
        }
    };
    
    render() {
      let {list_date_week, list_dialysis_schedule, new_list_matrix, patient_list} = this.state;
      let cur_patient = "";
      if (this.props.patientInfo != undefined && this.props.patientInfo != null && this.props.patientInfo.patient_number != undefined){
        cur_patient = this.props.patientInfo.patient_number;
      }
      var today = formatDateLine(new Date());
      return (        
        <Wrapper id = 'wrapper'>
          <table className="table-scroll table table-bordered" id="schedule-table">
              <thead>
              <tr>
                  <th className="number_name">患者番号<br/>氏名</th>
                  {list_date_week !==undefined && list_date_week !== null && list_date_week.length >0 && (
                      list_date_week.map((item, index) => {
                          return (
                              <>
                                  <th className={today==item.date?'today-th week_day':'week_day'} 
                                    onContextMenu={e => this.handleClick_move_to_bed(e, item.date, null, index)}
                                    style={{background:this.setBackcolor(item.date,item.day_of_week), color:this.setFontcolor(item.date, item.day_of_week)}}
                                    onMouseOver={e => this.cellHover(e, null, index)}>
                                  <label>{item.week}</label><br/><label>{item.day}</label></th>
                              </>
                          )
                      }
                  ))
                  }
              </tr>
              </thead>
              <tbody className="table-body" onMouseOut={e=>this.moveArea(e)}>
              {list_dialysis_schedule !== undefined && list_dialysis_schedule !== null && Object.keys(list_dialysis_schedule).length>0 
                && patient_list != undefined && patient_list != null && Object.keys(patient_list).length > 0 && (
                    new_list_matrix.map((item1,  patient_index)=> {                                                              
                      var idx = item1.patient_id;                      
                      return (
                      <>
                      <tr className={'tr-'+idx + (cur_patient == patient_list[idx].patient_number ? " selected_tr":"")}>
                          <td className={cur_patient == patient_list[idx].patient_number ? "text-left number_name selected_color":"text-left number_name"}
                            onMouseOver={e => this.cellHover(e, idx, null)}
                            onContextMenu={e => this.handleClick_patient(e, patient_list[idx].system_patient_id, idx, null)}>
                            {patient_list[idx].patient_number}<br/><span>{patient_list[idx].patient_name}</span>
                          </td>
                          {list_date_week.map((day, index)=>{
                            var check_last_row_flag = ((new_list_matrix.length == patient_index + 1) && (today==day.date));
                              if (item1[day.date] !== undefined){
                                var one_date_item = item1[day.date];
                                var one_sub_item1 = '';
                                var one_sub_item2 = '';
                                var one_sub_item3 = '';
                                var one_sub_item4 = '';
                                if (one_date_item[0] ==undefined){
                                  one_sub_item1 = '';
                                } else {
                                  if (one_date_item[0].schedule_icon == 'テキスト'){
                                      if (one_date_item[0].schedule_icon_text != null && one_date_item[0].schedule_icon_text != ''){
                                        one_sub_item1 = one_date_item[0].schedule_icon_text;
                                      } else {
                                        one_sub_item1 = '検';
                                      }
                                  }
                                   else if (one_date_item[0].schedule_icon == '胸部X-P'){
                                    one_sub_item1= '<img style="width:100%;" src = "' + xp_image +'"/>';
                                  } else if (one_date_item[0].schedule_icon == '心電図'){
                                    one_sub_item1= '<img style="width:100%;" src = "' + heart +'"/>';
                                  } else {
                                    one_sub_item1 = '検';
                                  }
                                }
                                if (one_date_item[1] ==undefined){
                                  one_sub_item2 = '';
                                } else {
                                  if (one_date_item[1].schedule_icon == 'テキスト'){
                                      if (one_date_item[1].schedule_icon_text != null && one_date_item[1].schedule_icon_text != ''){
                                        one_sub_item2 = one_date_item[1].schedule_icon_text;
                                      } else {
                                        one_sub_item2 = '検';
                                      }
                                  }
                                   else if (one_date_item[1].schedule_icon == '胸部X-P'){
                                    one_sub_item2= '<img style="width:100%;" src = "' + xp_image +'"/>';
                                  } else if (one_date_item[1].schedule_icon == '心電図'){
                                    one_sub_item2= '<img style="width:100%;" src = "' + heart +'"/>';
                                  } else {
                                    one_sub_item2 = '検';
                                  }
                                }
                                if (one_date_item[2] ==undefined){
                                  one_sub_item3 = '';
                                } else {
                                  if (one_date_item[2].schedule_icon == 'テキスト'){
                                      if (one_date_item[2].schedule_icon_text != null && one_date_item[2].schedule_icon_text != ''){
                                        one_sub_item3 = one_date_item[2].schedule_icon_text;
                                      } else {
                                        one_sub_item3 = '検';
                                      }
                                  }
                                   else if (one_date_item[2].schedule_icon == '胸部X-P'){
                                    one_sub_item3= '<img style="width:100%;" src = "' + xp_image +'"/>';
                                  } else if (one_date_item[2].schedule_icon == '心電図'){
                                    one_sub_item3= '<img style="width:100%;" src = "' + heart +'"/>';
                                  } else {
                                    one_sub_item3 = '検';
                                  }
                                }
                                if (one_date_item[3] ==undefined){
                                  one_sub_item4 = '';
                                } else {
                                  if (one_date_item[3].schedule_icon == 'テキスト'){
                                      if (one_date_item[3].schedule_icon_text != null && one_date_item[3].schedule_icon_text != ''){
                                        one_sub_item4 = one_date_item[3].schedule_icon_text;
                                      } else {
                                        one_sub_item4 = '検';
                                      }
                                  }
                                   else if (one_date_item[3].schedule_icon == '胸部X-P'){
                                    one_sub_item4= '<img style="width:0.9375rem;" src = "' + xp_image +'"/>';
                                  } else if (one_date_item[3].schedule_icon == '心電図'){
                                    one_sub_item4= '<img style="width:0.9375rem;" src = "' + heart +'"/>';
                                  } else {
                                    one_sub_item4 = '検';
                                  }
                                }                                
                                return (
                                  <>
                                    <td 
                                      onDoubleClick={this.showEditModal.bind(this,patient_list[idx].system_patient_id, day.date, patient_list[idx])} 
                                      onContextMenu={e => this.handleClick(e, patient_list[idx].system_patient_id, day.date, patient_list[idx], idx, index)} 
                                      onMouseOver={e=>this.showTitle(e, item1[day.date], idx, index)} 
                                      onMouseOut={this.hideTooltip}
                                      className={(today==day.date?"today-td td-"+ index:"td-"+ index) + ' ' + (check_last_row_flag?'today-last-row-td':'')}
                                      style={{background:one_date_item.length>4?'yellow':'none'}}
                                      schedule_flag={one_date_item.length>4 ? 1 : 0}
                                    >
                                      <label className="cell">{renderHTML(one_sub_item1)}</label>
                                      <label className="cell">{renderHTML(one_sub_item2)}</label><br/>
                                      <label className="cell">{renderHTML(one_sub_item3)}</label>
                                      <label className="cell">{renderHTML(one_sub_item4)}</label>                                        
                                    </td>
                                  </>
                                )
                              } else {
                                return(
                                  <td
                                    onContextMenu = {e => this.handleClick_other(e, day.date, idx, idx, index)}
                                    onMouseOver={e => this.cellHover(e, idx, index)}
                                    className={(today==day.date?"today-td td-"+ index:"td-"+ index) + ' ' + (check_last_row_flag?'today-last-row-td':'')}
                                  />
                                )
                              }
                          }                                        
                          )}                                                                                    
                      </tr>
                      </>)
                  })
              )}
              </tbody>
          </table>
      
          {this.state.isOpenEditScheduleModal && (
              <EditInspectionModal
                  handleOk={this.handleOk}
                  closeModal={this.closeModal}                                    
                  // schedule_item = {this.state.schedule_item} 
                  schedule_date={this.state.schedule_date}
                  system_patient_id={this.state.system_patient_id}
                  patientInfo={this.state.patientInfo}
                  temporary={this.state.temporary}
                  add_flag = {this.state.add_flag}
                  from_source = "schedule"
              />
          )}
          
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
          />

          <ContextMenu_other
            {...this.state.contextMenu_other}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
          />
          <ContextMenu_move_to_bed
            {...this.state.contextMenu_move_to_bed}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
          />
          <ContextMenu_patient
            {...this.state.contextMenu_patient}
            parent={this}
          />
          <TooltipTitle
              {...this.state.tooltipTitle}
              parent={this}                       
          />
        </Wrapper>                    
      )
    }
}

Inspection.contextType = Context;

Inspection.propTypes = {
  list_date_week : PropTypes.array,
  list_schedule : PropTypes.array,
  list_matrix : PropTypes.array,
  list_by_date : PropTypes.array,
  patient_list : PropTypes.array,
  getSearchResult : PropTypes.func,
  history: PropTypes.object,
  holidays: PropTypes.object,
  patientInfo: PropTypes.object,
  new_list_matrix : PropTypes.array,
};

export default withRouter(Inspection)