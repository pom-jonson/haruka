import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import {formatDateLine, formatDateSlash, formatTimeIE} from "~/helpers/date";
import * as sessApi from "~/helpers/cacheSession-utils";
import {displayLineBreak} from "~/helpers/dialConstants";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import EditPassingTime from "~/components/templates/Nurse/soap_focus/EditPassingTime";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";

const Wrapper = styled.div`  
  width: 100%;
  height: 100%;
  font-size: 1rem;
  .flex{display: flex;}
  .select-period {
    .period-title {
      line-height: 2rem;
      margin: 0;
      margin-right: 0.5rem;
      font-size:1rem;
    }
    div {margin-top: 0;}
    input {
      width:6rem;
      height:2rem;
      text-align:center;
      font-size:1rem;
    }
    .from-to{
      padding:0 0.5rem;
      line-height: 2rem;
      font-size:1rem;
    }
    .label-title {display:none;}
  }
  .table-area {
    margin-top:0.5rem;
    width: 100%;
    table {
     width:100%;
     margin:0;
     tbody{
       display:block;
       overflow-y: scroll;
       height: calc(70vh - 16.5rem);
       width:100%;
       tr{cursor:pointer;}
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
       border:none;
       border-right:1px solid #dee2e6;
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
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 16px;
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
`;

const ContextMenu = ({visible,x,y,record_data,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("change", record_data)}>編集</div></li>
          <li><div onClick={() => parent.contextMenuAction("delete", record_data)}>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class PassingTimeList extends Component {
  constructor(props) {
    super(props);
    let last_week = new Date();
    last_week.setDate(last_week.getDate() - 7);
    this.state = {
      load_flag:false,
      list_data:[],
      alert_messages:"",
      start_date:last_week,
      end_date:new Date(),
      isOpenEditPassingTime:false,
      confirm_message:"",
      confirm_alert_title:'',
    };
    this.staff_list = [];
    let staff_list = sessApi.getStaffList();
    if(staff_list != undefined && staff_list != null && Object.keys(staff_list).length > 0){
      Object.keys(staff_list).map(staff_number=>{
        this.staff_list[staff_number] = staff_list[staff_number]['name'];
      })
    }
  }

  async UNSAFE_componentWillMount () {
    await this.getPassingTimeData();
  }
  
  getPassingTimeData=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/nurse/progress_chart/get_passing_time_data";
    let post_data = {
      hos_number:this.props.hos_number,
      start_date:(this.state.start_date != null && this.state.start_date != "") ? formatDateLine(this.state.start_date) : "",
      end_date:(this.state.end_date != null && this.state.end_date != "") ? formatDateLine(this.state.end_date) : "",
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          load_flag:true,
          list_data:res,
        });
      })
      .catch(() => {
      });
  }

  async componentDidMount() {
    document.getElementById("cancel_btn").focus();
  }

  closeModal=(act, message=null)=>{
    this.setState({
      alert_messages:(act == "register" && message != null) ? message : "",
      isOpenEditPassingTime:false,
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:'',
    }, ()=>{
      if(act == "register"){
        this.getPassingTimeData();
      }
    });
  }
  
  setPeriod=(key,value)=>{
    this.setState({[key]:value});
  };
  
  handleClick=(e, record_data)=>{
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("passing_time_list").offsetLeft,
          y: e.clientY - document.getElementById("passing_time_list").offsetTop + window.pageYOffset,
          record_data,
        },
      })
    }
  };
  
  contextMenuAction = (act, record_data) => {
    if(act == "change"){
      this.setState({
        record_data,
        isOpenEditPassingTime:true,
      });
      return;
    }
    if(act == "delete"){
      this.setState({
        record_data,
        confirm_message:"経時記録を削除しますか？",
        confirm_alert_title:'削除確認',
      });
    }
  };
  
  delete=async()=>{
    this.setState({
      confirm_message:"",
      confirm_title:"",
      load_flag:false,
    });
    let path = "/app/api/v2/nurse/progress_chart/delete_passing_time";
    let post_data = {
      number:this.state.record_data.number,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          alert_messages:res.alert_messages,
        }, ()=>{
          this.getPassingTimeData();
        });
      })
      .catch(() => {
      
      });
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm passing-time-list first-view-modal" id={'passing_time_list'}>
          <Modal.Header><Modal.Title>経時記録一覧</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'select-period flex'}>
                <div className={'period-title'}>入院期間</div>
                <InputWithLabel
                  type="date"
                  getInputText={this.setPeriod.bind(this, 'start_date')}
                  diseaseEditData={this.state.start_date}
                />
                <div className={'from-to'}>～</div>
                <InputWithLabel
                  type="date"
                  getInputText={this.setPeriod.bind(this, 'end_date')}
                  diseaseEditData={this.state.end_date}
                />
                <button style={{marginLeft:"0.5rem"}} onClick={this.getPassingTimeData}>検索</button>
              </div>
              <div className={'table-area flex'}>
                <table className="table-scroll table table-bordered table-hover" id={'table_area'}>
                  <thead>
                    <tr>
                      <th style={{width:"3rem"}}/>
                      <th style={{width:"9rem"}}>記録日時</th>
                      <th>経時記録</th>
                      <th style={{width:"15rem"}}>作成者</th>
                      <th style={{width:"15rem"}}>更新者</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.load_flag ? (
                      <>
                        {this.state.list_data.length > 0 && (
                          this.state.list_data.map((item, index)=>{
                            return (
                              <>
                                <tr onContextMenu={e => this.handleClick(e, item)}>
                                  <td style={{width:"3rem", textAlign:"right"}}>{index+1}</td>
                                  <td style={{width:"9rem"}}>
                                    {formatDateSlash(item.record_date.split('-').join('/')) + " " + formatTimeIE(new Date(item.record_date.split('-').join('/')))}
                                  </td>
                                  <td>{displayLineBreak(item.passing_of_time)}</td>
                                  <td style={{width:"15rem"}}>{(item.created_by != null && this.staff_list[item.created_by] != undefined) ? this.staff_list[item.created_by] : ""}</td>
                                  <td style={{width:"15rem"}}>{(item.updated_by != null && this.staff_list[item.updated_by] != undefined) ? this.staff_list[item.updated_by] : ""}</td>
                                </tr>
                              </>
                            )
                          })
                        )}
                      </>
                    ):(
                      <tr>
                        <td colSpan={'4'}>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <div onClick={this.props.closeModal} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}} id='cancel_btn'>
              <span>閉じる</span>
            </div>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
          {this.state.isOpenEditPassingTime && (
            <EditPassingTime
              closeModal={this.closeModal}
              modal_data={this.state.record_data}
            />
          )}
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.delete.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title={this.state.confirm_title}
            />
          )}
        </Modal>
      </>
    );
  }
}

PassingTimeList.propTypes = {
  closeModal: PropTypes.func,
  hos_number: PropTypes.number,
};

export default PassingTimeList;
