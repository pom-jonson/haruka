import React, { Component, useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {formatJapanDate} from "~/helpers/date";
import {EXAM_DONE_STATUS, EXAM_STATUS_OPTIONS} from "~/helpers/constants";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import Context from "~/helpers/configureStore";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import ExaminationDoneModal from "~/components/templates/OrderList/ExaminationDoneModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import Spinner from "react-bootstrap/Spinner";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import axios from "axios";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  background-color: rgb(241, 243, 244);
  padding-left: 10px;
    .selected{
        background: lightblue;
    }
    
  .table-area {
    width: 100%;
    padding-left: 0.5rem;
    margin-bottom:0.5rem;
    table {
      background-color: white;
      margin:0px;
      font-size: 1rem;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc( 100vh - 24.5rem);
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
      }
      tr{
        display: table;
        width: 100%;
      }
      thead{
        display:table;
        width:100%;
        tr{width: calc(100% - 17px);}
        border-bottom: 1px solid #dee2e6;
      }
      td {
        padding: 0.25rem;
        word-break: break-all;
        font-size: 1rem;
        vertical-align: top;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
      }
      th {
        font-size: 1.25rem;
        text-align: center;
        padding: 0.3rem;
        border-bottom: none;
        border-top: none;
        font-weight: normal;
      }
    }
  }
  .no-result {
    text-align: center;
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
  .department {
    width: 15rem;
  }
  .patient-id {
    width: 6.5rem;
  }
  .name {
    width: 12rem;
  }
  .other-department {
    width: 11rem;
  }
  .done-status {
    width: 8rem;
  }
  .acceptedlist {
    width: 14rem;
  }
  .karte-ward{
    width: 6rem;
  }
    
  .sort-symbol{
    margin-left:10px;
    font-size:1rem;
    cursor:pointer;
  }
`;

const ContextMenuUl = styled.ul`
  margin-bottom:0px!important;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
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

const ContextMenu = ({ visible, x,  y,  parent,  row_index}) => {
  
  if (visible) {
    const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
    let exam_item = parent.state.examination_list[row_index].prescription;
    let exist_result = exam_item.order_data.order_data.exist_result;
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {parent.props.last_url == "done" && $canDoAction(FEATURES.EXAMORDER,AUTHS.DONE_OREDER) != false &&
          exam_item !== undefined && exam_item.done_order == 1 && exist_result != 1 && (
            <li><div onClick={() => parent.contextMenuAction(row_index,"done_insert")}>検査実施登録</div></li>
          )}
          <li><div onClick={() => parent.contextMenuAction(row_index,"showDetail")}>詳細</div></li>
          <li><div onClick={() => parent.contextMenuAction(row_index,"karte_view")}>カルテを開く</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class ExaminationTableList extends Component {
  constructor(props) {
    super(props);
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.state = {
      examination_list:props.examination_list,
      isOpenModal: false,
      isOpenKarteModeModal:false,
      selected_index:'',
      alert_messages:'',
      confirm_message:'',
      confirm_title:'',
    };
    this.sort_data = sessApi.getObjectValue('haruka_sort', "list").examination;
    this.sort_data = this.sort_data.accept;
    
  }
  
  //部門の一覧メニューで、患者ID検索の結果が1件のみの場合、そのオーダーの詳細モーダルを開くようにする
  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.examination_list != this.state.examination_list){
      if(nextProps.keyword !== "" && nextProps.examination_list.length === 1 && this.props.search_flag){
        this.setState({
          isOpenModal: true,
          modal_data: nextProps.examination_list[0],
          endoscope_image:"",
          selected_index:0,
        })
      }
    }
    this.setState({
      examination_list:nextProps.examination_list,
    },()=>{
      this.props.changeSearchFlag();
    });
  }
  
  showDetailData = (index) => {
    let modal_data = this.state.examination_list[index]['prescription'];
    modal_data.patient_number = this.state.examination_list[index]['patient']['patientNumber'];
    modal_data.patient_name = this.state.examination_list[index]['patient']['name'];
    this.setState({
      isOpenModal: true,
      modal_data,
      endoscope_image:"",
      selected_index:index,
    });
  };
  
  handleClick = (e, index, state,reception_or_done) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("list-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("list-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      
      let clientY = e.clientY;
      let clientX = e.clientX;
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
        },
        row_index: index,
        reception_or_done,
        selected_index:index,
      }, ()=>{
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
        let window_height = window.innerHeight;
        let window_width = window.innerWidth;
        if (clientY + menu_height > window_height && clientX + menu_width + 200 > window_width) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX-menu_width,
              y: clientY - menu_height,
            },
            row_index: index,
            reception_or_done,
            selected_index:index,
          })
        } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX,
              y: clientY - menu_height,
            },
            row_index: index,
            reception_or_done,
            selected_index:index,
          })
        } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX-menu_width,
              y: clientY + window.pageYOffset,
            },
            row_index: index,
            reception_or_done,
            selected_index:index,
          })
        }
      });
    }
  };
  
  contextMenuAction = (index, type) => {
    if (type === "showDetail"){
      this.showDetailData(index);
    } else if (type === "karte_view"){
      this.goKartePage(index);
    } else if (type === "done_insert"){
      this.setState({
        confirm_message:'このオーダーを実施済みにしますか？',
        confirm_title:'実施確認',
      })
    }
  };
  closeModal = (act) => {
    this.setState({
      isOpenModal: false,
      isOpenKarteModeModal: false,
      alert_messages: "",
      confirm_message: "",
      confirm_title: "",
    }, ()=>{
      if(act === "change"){
        this.props.refresh();
      }
    })
  };
  
  goKartePage = async(index) => {
    let data = this.state.examination_list[index]['prescription'];
    let patients_list = this.context.patientsList;
    let isExist = 0;
    if(patients_list !== undefined && patients_list != null && patients_list.length > 0){
      patients_list.map(item=>{
        if (item.system_patient_id == data.patient_id) {
          isExist = 1;
        }
      });
    }
    if (patients_list != undefined && patients_list != null && patients_list.length > 3 && isExist == 0) {
      this.setState({alert_messages: '4人以上の患者様を編集することはできません。'});
      return;
    }
    if (isExist == 0) { // new patient connect
      let department_name = "";
      this.departmentOptions.map(department=>{
        if(parseInt(department.id) == data.order_data.order_data.department_code){
          department_name = department.value;
          return;
        }
      });
      let modal_data = {
        systemPatientId:data.patient_id,
        date:data['treatment_date'],
        medical_department_code:data.order_data.order_data.department_code,
        department_name,
      };
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
      });
    } else { // exist patient connect
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+data.patient_id+"/"+page);
    }
  }
  
  goToUrlFunc = (url) => {
    this.props.goToPage(url);
    this.setState({isOpenKarteModeModal: false});
  };
  
  selectedItem=(index)=>{
    this.setState({selected_index:index});
  };
  
  // 「至急」チェックボックスがオンや、至急オンの検査を含む場合、一覧の採取日付の右に赤文字で「[至急]」と表示する
  getUrgentName = (_orderComponentUrgent, _examinations) => {
    let result = false;
    
    if (_orderComponentUrgent == 1) return true;
    
    if (_examinations != null && _examinations != undefined && _examinations.length > 0) {
      _examinations.map(item=>{
        if (item.urgent != undefined && item.urgent != null && item.urgent == 1) {
          result = true;
        }
      });
    }
    
    
    return result;
  }
  
  refresh = (order, asc_desc) => {
    if (this.props.is_loaded != true) return;
    this.props.refresh(order, asc_desc);
  }
  resultDone = () => {
    this.closeModal();
    let {selected_index, examination_list} = this.state;
    if (examination_list[selected_index] === undefined) return;
    let number = examination_list[selected_index].prescription.number;
    let path = "/app/api/v2/order/examination/result_done";
    axios.post(path, {params: {number:number}})
      .then(() => {
        window.sessionStorage.setItem("alert_messages", "実施しました。");
        this.props.refresh();
      })
      .catch(() => {
      });
  }
  
  getBackGround=(background, status)=>{
    if(background != undefined){
      return background;
    } else {
      let color = this.props.row_color;
      if (status.done_order == EXAM_DONE_STATUS.COLLECTION_WAIT) {
        color = this.props.row_wait_color;
      } else if (status.done_order == EXAM_DONE_STATUS.COLLECTION_DONE) {
        color = this.props.row_collection_color;
      } else if (status.done_order == EXAM_DONE_STATUS.RECEPTION_DONE) {
        color = this.props.row_reception_color;
      } else if (status.done_order == EXAM_DONE_STATUS.COMPLETE_DONE) {
        color = this.props.row_done_color;
      }
      if (status.is_done == 1) color = this.props.row_reception_color;
      if (status.order_data.order_data.in_out_state == 0) color = this.props.row_in_result_color;
      else if (status.order_data.order_data.in_out_state == 1 ) color = this.props.row_out_result_color;
      else if (status.order_data.order_data.in_out_state == 2) color = this.props.row_inout_result_color;
      return color;
    }
  }
  
  render() {
    return (
      <Wrapper>
        <div className={'table-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead className={'thead-area'}>
            <tr>
              <th className="department">
                採取日時
                {this.sort_data.collect_at == 'ON' &&
                (
                  <>
                    {this.props.order == 'collect_at' && this.props.asc_desc == 'desc' ? (
                      <>
                        <span className='sort-symbol' onClick={this.refresh.bind(this,'collect_at', 'asc')}>▼</span>
                      </>
                    ):(
                      <>
                        <span className='sort-symbol' onClick={this.refresh.bind(this,'collect_at', 'desc')}>▲</span>
                      </>
                    )}
                  </>
                )}
              </th>
              {(this.props.last_url == "done" || this.props.last_url == "collect_reception" || this.props.last_url == "collect_done") && (
                <th className="karte-ward">入外</th>
              )}
              {this.props.last_url == "hospital_collect_reception" && (
                <th className="karte-ward">病室</th>
              )}
              {this.props.last_url == "hospital_collect_done" && (
                <th className="karte-ward">病室</th>
              )}
              <th className="karte-ward">区分</th>
              <th className="patient-id">患者ID
                {this.sort_data.patient_id == 'ON' &&
                (
                  <>
                    {this.props.order == 'patient_id' && this.props.asc_desc == 'desc' ? (
                      <>
                        <span className='sort-symbol' onClick={this.refresh.bind(this,'patient_id', 'asc')}>▼</span>
                      </>
                    ):(
                      <>
                        <span className='sort-symbol' onClick={this.refresh.bind(this,'patient_id', 'desc')}>▲</span>
                      </>
                    )}
                  </>
                )}
              </th>
              <th className="name">氏名</th>
              <th className="done-status">実施状態</th>
              <th className="other-department">指示医師</th>
              <th className="acceptedlist">
                指示日時
                {this.sort_data.created_at == 'ON' &&
                (
                  <>
                    {this.props.order == 'created_at' && this.props.asc_desc == 'desc' ? (
                      <>
                        <span className='sort-symbol' onClick={this.refresh.bind(this,'created_at', 'asc')}>▼</span>
                      </>
                    ):(
                      <>
                        <span className='sort-symbol' onClick={this.refresh.bind(this,'created_at', 'desc')}>▲</span>
                      </>
                    )}
                  </>
                )}
              </th>
              <th className="acceptedlist">実施日時</th>
            </tr>
            </thead>
            <tbody className={'scroll-area'} id={`list-table`}>
            {this.props.is_loaded ? (
              <>
                {this.state.examination_list != null && this.state.examination_list.length > 0 ? (
                  this.state.examination_list.map((item, index)=>{
                    let status_text = EXAM_STATUS_OPTIONS.NOT_RECEPTION;
                    if (item.prescription.done_order == EXAM_DONE_STATUS.COLLECTION_WAIT) {
                      status_text = EXAM_STATUS_OPTIONS.COLLECTION_WAIT;
                    } else if (item.prescription.done_order == EXAM_DONE_STATUS.COLLECTION_DONE) {
                      status_text = EXAM_STATUS_OPTIONS.COLLECTION_DONE;
                    } else if (item.prescription.done_order == EXAM_DONE_STATUS.RECEPTION_DONE) {
                      status_text = EXAM_STATUS_OPTIONS.RECEPTION_DONE;
                    } else if (item.prescription.done_order == EXAM_DONE_STATUS.COMPLETE_DONE) {
                      status_text = EXAM_STATUS_OPTIONS.COMPLETE_DONE;
                    }
                    if (item.prescription.is_done == 1) status_text = EXAM_STATUS_OPTIONS.RECEPTION_DONE;
                    if (item.prescription.order_data.order_data.in_out_state == 0) status_text = EXAM_STATUS_OPTIONS.OUT_RESULT_DONE;
                    else if (item.prescription.order_data.order_data.in_out_state == 1 ) status_text = EXAM_STATUS_OPTIONS.IN_RESULT_DONE;
                    else if (item.prescription.order_data.order_data.in_out_state == 2) status_text = EXAM_STATUS_OPTIONS.INOUT_RESULT_DONE;
                    return (
                      <>
                        <tr className={this.state.selected_index === index ? 'selected' : ''} style={{background:this.getBackGround(item.background, item.prescription)}}
                            onClick={this.selectedItem.bind(this, index)}
                            onContextMenu={e => this.handleClick(e, index, item.prescription.done_order)}
                            onDoubleClick={this.goKartePage.bind(this, index)}>
                          <td className="department">
                            {item.prescription.order_data.order_data.collected_date != null && item.prescription.order_data.order_data.collected_date.length > 4 ? formatJapanDate(item.prescription.order_data.order_data.collected_date): "日未定"}
                            {" "}{(item.prescription.order_data.order_data.collected_date != null && item.prescription.order_data.order_data.collected_date.length > 4
                            && item.prescription.order_data.order_data.collected_time != null && item.prescription.order_data.order_data.collected_time != "") ?
                            item.prescription.order_data.order_data.collected_time.split(":")[0]+":"+item.prescription.order_data.order_data.collected_time.split(":")[1] : "" }{this.getUrgentName(item.prescription.order_data.order_data.order_comment_urgent, item.prescription.order_data.order_data.examinations) == true && (<span style={{color:"red"}}>[至急]</span>) }
                          </td>
                          {(this.props.last_url == "done" || this.props.last_url == "collect_reception" || this.props.last_url == "collect_done") && (
                            <td className="karte-ward">{item.prescription.karte_ward != undefined ? item.prescription.karte_ward : "　"}</td>
                          )}
                          {this.props.last_url == "hospital_collect_reception" && (
                            <td className="karte-ward">{item.prescription.ward_name != undefined ? item.prescription.ward_name + "/" : ""}{item.prescription.room_name != undefined ? item.prescription.room_name : ""}</td>
                          )}
                          {this.props.last_url == "hospital_collect_done" && (
                            <td className="karte-ward">{item.prescription.ward_name != undefined ? item.prescription.ward_name + "/" : ""}{item.prescription.room_name != undefined ? item.prescription.room_name : ""}</td>
                          )}
                          <td className={`karte-ward`}>{item.prescription.order_data.order_data.modalName != undefined ? item.prescription.order_data.order_data.modalName : "検体検査"}</td>
                          <td className="patient-id">{item.patient.patientNumber != "" && item.patient.patientNumber.replace(" ", "0")}</td>
                          <td className="name">{item.patient.name}</td>
                          <td className="done-status">{status_text}</td>
                          <td className="other-department">{item.prescription.order_data.doctor_name != undefined && item.prescription.order_data.doctor_name}</td>
                          <td className="acceptedlist">
                            {item.prescription.created_at != null  && item.prescription.created_at.length > 4 ? formatJapanDate(item.prescription.created_at.split(" ")[0]): ""}
                            {" "}{(item.prescription.created_at != null && item.prescription.created_at != "") ?
                            (item.prescription.created_at.split(" ")[1]): "" }
                          </td>
                          <td className="acceptedlist">
                            {item.prescription.order_data.order_data.collected_date != null && item.prescription.order_data.order_data.collected_date.length > 4 ? formatJapanDate(item.prescription.order_data.order_data.collected_date): "日未定"}
                            {" "}{(item.prescription.order_data.order_data.collected_date != null && item.prescription.order_data.order_data.collected_date.length > 4
                            && item.prescription.order_data.order_data.collected_time != null && item.prescription.order_data.order_data.collected_time != "") ?
                            item.prescription.order_data.order_data.collected_time.split(":")[0]+":"+item.prescription.order_data.order_data.collected_time.split(":")[1] : "" }{this.getUrgentName(item.prescription.order_data.order_data.order_comment_urgent, item.prescription.order_data.order_data.examinations) == true && (<span style={{color:"red"}}>[至急]</span>) }
                          </td>
                        </tr>
                      </>
                    )
                  })
                ):(
                  <tr style={{height:"calc(100vh - 24.5rem)"}}>
                    <td colSpan={'10'} style={{verticalAlign:"middle"}}>
                      <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
                    </td>
                  </tr>
                )}
              </>
            ):(
              <tr style={{height:"calc(100vh - 24.5rem)"}}>
                <td colSpan={'10'} style={{verticalAlign:"middle"}}>
                  <div className='spinner_area no-result'>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          row_index={this.state.row_index}
          inspection_DATETIME={this.state.menu_inspection_DATETIME}
          reception_or_done={this.state.reception_or_done}
        />
        {this.state.isOpenModal == true && (
          <ExaminationDoneModal
            closeModal={this.closeModal}
            modal_data={this.state.modal_data}
            from_page={'done'}
            done_status={this.props.status}
            page_title = {this.props.page_title}
            last_url = {this.props.last_url}
          />
        )}
        {this.state.isOpenKarteModeModal == true && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.closeModal}
            modal_type={'inspection'}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm={this.closeModal.bind(this)}
            confirmCancel={this.closeModal.bind(this)}
            confirmOk={this.resultDone.bind(this)}
            confirmTitle={this.state.confirm_message}
            title={this.state.confirm_title}
          />
        )}
      </Wrapper>
    );
  }
}
ExaminationTableList.contextType = Context;

ExaminationTableList.propTypes = {
  examination_list: PropTypes.array,
  refresh: PropTypes.func,
  goToPage: PropTypes.func,
  keyword: PropTypes.string,
  status: PropTypes.string,
  search_flag: PropTypes.bool,
  changeSearchFlag: PropTypes.changeSearchFlag,
  page_title : PropTypes.string,
  last_url : PropTypes.string,
  order: PropTypes.string,
  asc_desc: PropTypes.string,
  is_loaded:PropTypes.bool,
  row_color:PropTypes.string,
  row_wait_color:PropTypes.string,
  row_collection_color:PropTypes.string,
  row_reception_color:PropTypes.string,
  row_done_color:PropTypes.string,
  row_in_result_color:PropTypes.string,
  row_out_result_color:PropTypes.string,
  row_inout_result_color:PropTypes.string,
};

export default ExaminationTableList;