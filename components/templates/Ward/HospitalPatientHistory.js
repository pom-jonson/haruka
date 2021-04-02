import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  .flex {display: flex;}
  .table-area {
    width:100%;
    table {
      margin:0;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc(60vh - 13.5rem);
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2;}
      }
      tr{
        display: table;
        width: 100%;
      }
      thead{
        display:table;
        width:100%;    
        border-bottom: 1px solid #dee2e6;    
        tr{width: calc(100% - 17px);}
      }
      th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
        white-space:nowrap;
        border:1px solid #dee2e6;
        border-bottom:none;
        border-top:none;
        vertical-align: middle;
      }
      td {
        padding: 0.25rem;
        word-break: break-all;
      }
    }  
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.div`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 1rem;
      font-weight: bold;
    }
    img {
      width: 2rem;
      height: 2rem;
    }
    svg {
      width: 2rem;
      margin: 8px 0;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
  .patient-info-table {
    width: 100%;
    table {
      margin-bottom: 0;
    }
    th {
      font-size: 1rem;
      vertical-align: top;
      padding: 0;
      text-align: right;
      width: 110px;
      padding-right: 0.2rem;
    }
    td {
      font-size: 1rem;
      vertical-align: top;
      padding: 0;
      text-align: left;
      padding-left: 0.2rem;
      width:15rem;
      word-break: break-all;
      word-wrap: break-word;
    }
  }
`;

const HoverMenu = ({
                     visible,
                     x,
                     y,
                     change_responsibility,
                   }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu hover-menu" style={{ left: ('calc('+x+'px + 1rem)'), top: ('calc('+ y+'px + 4rem)')}}>
          <li>
            <div className={'patient-info-table'}>
              <table className="table-scroll table table-bordered" id="code-table">
                <tbody>
                <tr><th>主担当医</th><td>{change_responsibility.mainDoctor_name}</td></tr>
                {change_responsibility.doctors_name.length > 0 && (
                  change_responsibility.doctors_name.map((name, index)=>{
                    return (
                      <>
                        <tr><th>{index == 0 ? "担当医" : ""}</th><td>{name}</td></tr>
                      </>
                    )
                  })
                )}
                {change_responsibility.nurse_id_in_charge_name != "" && (
                  <tr><th>担当看護師</th><td>{change_responsibility.nurse_id_in_charge_name}</td></tr>
                )}
                {change_responsibility.deputy_nurse_name != "" && (
                  <tr><th>副担当看護師</th><td>{change_responsibility.deputy_nurse_name}</td></tr>
                )}
                {change_responsibility.comment != "" && (
                  <tr><th>フリーコメント</th><td>{change_responsibility.comment}</td></tr>
                )}
                </tbody>
              </table>
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class HospitalPatientHistory extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.diagnosis = {};
    departmentOptions.map(department=>{
      this.diagnosis[parseInt(department.id)] = department.value;
    });
    this.state = {
      move_history:[],
      first_load:false,
    };
    this.ward_master = [];
    this.room_master = [];
    this.bed_master = [];
  }

  async componentDidMount() {
    await this.getData();
  }

  getData=async()=>{
    let path = "/app/api/v2/ward/get/hospital_move_history";
    let post_data = {
      hos_number:this.props.patient_info.hos_number,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.ward_master != undefined && res.ward_master.length > 0){
          res.ward_master.map(ward=>{
            this.ward_master[ward.number] = ward.name;
          })
        }
        if(res.room_master != undefined && res.room_master.length > 0){
          res.room_master.map(room=>{
            this.room_master[room.number] = room.name;
          })
        }
        if(res.bed_master != undefined && res.bed_master.length > 0){
          res.bed_master.map(bed=>{
            this.bed_master[bed.number] = bed.name;
          })
        }
        this.setState({
          move_history:res.move_history,
          first_load:true,
        });
      })
      .catch(() => {

      });
  };
  
  viewResponsibilityInfo = (e, change_responsibility, index) => {
    if(change_responsibility === undefined){return;}
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    let clientY = e.clientY;
    let clientX = e.clientX;
    let state_data = {};
    state_data['hoverMenu'] = {
      visible: true,
      x: clientX - 200,
      y: clientY + window.pageYOffset
    };
    state_data['change_responsibility'] = change_responsibility;
    this.setState(state_data, ()=>{
      let table_top = document.getElementsByClassName("table-area")[0].offsetTop;
      let tr_top = document.getElementsByClassName("tr-"+index)[0].offsetTop;
      let tr_height = document.getElementsByClassName('tr-'+index)[0].offsetHeight;
      let menu_height = document.getElementsByClassName("hover-menu")[0].offsetHeight;
      state_data['hoverMenu']['y'] = tr_top + table_top + tr_height - menu_height;
      let td_width = document.getElementsByClassName('movement_name-'+index)[0].offsetWidth;
      let td_left = document.getElementsByClassName('movement_name-'+index)[0].offsetLeft;
      state_data['hoverMenu']['x'] = td_width + td_left;
      this.setState(state_data);
    });
  };
  
  closeViewResponsibilityInfo=()=>{
    let hoverMenu = this.state.hoverMenu;
    if(hoverMenu !== undefined && hoverMenu.visible){
      this.setState({
        hoverMenu: {
          visible: false,
        }
      });
    }
  };

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal hospitalization-patient-history first-view-modal">
          <Modal.Header><Modal.Title>移動履歴</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.state.first_load ? (
                <>
                  <div className={'table-area'}>
                    <table className="table-scroll table table-bordered" id="code-table">
                      <thead>
                      <tr>
                        <th style={{width:"3rem"}}>&nbsp;</th>
                        <th style={{width:"3rem"}}>状態</th>
                        <th style={{width:"8rem"}}>実施日</th>
                        <th style={{width:"3rem"}}>時間</th>
                        <th style={{width:"10rem"}}>区分</th>
                        <th style={{width:"4rem"}}>病棟</th>
                        <th style={{width:"4rem"}}>病室</th>
                        <th style={{width:"10rem"}}>ベッド</th>
                        <th>診療科</th>
                      </tr>
                      </thead>
                      <tbody>
                      {this.state.move_history.length > 0 && (
                        this.state.move_history.map((detail, index)=>{
                          return (
                            <>
                              <tr className={'tr-'+index}>
                                <td style={{width:"3rem"}} className={'text-right'}>{index+1}</td>
                                <td style={{width:"3rem"}}>{new Date(detail.moving_day+" "+detail.moving_time+":00").getTime() >= new Date().getTime() ? "未" : "済"}</td>
                                <td style={{width:"8rem"}}>{detail.moving_day}</td>
                                <td style={{width:"3rem"}}>{detail.moving_time == "00:00" ? "" : detail.moving_time}</td>
                                <td
                                  style={{width:"10rem"}} className={'movement_name-'+index}
                                  onMouseOver={e => this.viewResponsibilityInfo(e, detail.change_responsibility, index)}
                                  onMouseOut={e => {this.closeViewResponsibilityInfo(e)}}
                                >{detail.movement_name}</td>
                                <td style={{width:"4rem"}}>{detail.ward_name}</td>
                                <td style={{width:"4rem"}}>{detail.room_name}</td>
                                <td style={{width:"10rem"}}>{detail.bed_name}</td>
                                <td>{this.diagnosis[detail.department_id]}</td>
                              </tr>
                            </>
                          )
                        })
                      )}
                      </tbody>
                    </table>
                  </div>
                </>
              ):(
                <>
                  <div style={{width:"100%"}}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                </>
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.props.closeModal}>閉じる</Button>
          </Modal.Footer>
          <HoverMenu
            {...this.state.hoverMenu}
            change_responsibility={this.state.change_responsibility}
          />
        </Modal>
      </>
    );
  }
}

HospitalPatientHistory.contextType = Context;
HospitalPatientHistory.propTypes = {
  closeModal: PropTypes.func,
  patient_info:PropTypes.object,
};

export default HospitalPatientHistory;
