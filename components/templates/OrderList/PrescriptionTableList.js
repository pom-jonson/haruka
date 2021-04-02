import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "~/components/_nano/colors";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import Context from "~/helpers/configureStore";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import { HOSPITALIZE_PRESCRIPTION_TYPE } from "~/helpers/constants";
import PrescriptionDoneModal from "~/components/organisms/PrescriptionDoneModal";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TableHeader = styled.div`
  width: 100%;
  background-color: rgb(241, 243, 244);
  padding-left: 10px;
    .selected{
        background: lightblue;
    }
    .row-item {
        display: flex;
        width: 100%;
        padding: 8px 16px;
    }
    .no-result {
      text-align: center;
      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
    .table-area {
      width: 100%;
      padding-left: 0.5rem;
      margin-bottom: 0.5rem;
      table {
        background-color: white;
        margin:0px;
        font-size: 1rem;
        tbody{
          display:block;
          overflow-y: scroll;
          height: calc( 100vh - 22rem);
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
          word-break: break-all;
          font-size: 1rem;
          vertical-align: middle;
          padding: 0.25rem;
          font-size: 1rem;
        }        
        th {
          position: sticky;
          text-align: center;
          font-size: 1.25rem;
          white-space:nowrap;
          font-weight: normal;
          padding: 0.3rem;
          border:1px solid #dee2e6;
          border-bottom:none;
          border-top:none;
          font-weight: normal;
        }
      }
    }

  .registerList {
    margin-left: 24px;
  }

  .table-item {
    color: ${colors.onSurface};
    &:hover {
      color: ${colors.onSurface};
      text-decoration: none;
    }
  }

  .table-row {
    .department {
      width: 15%;
      margin: 0;
    }
    .patient-id {
      width: 8%;
    }
    .name {
      width: 15%;
    }
    .department-content {
      width: 10%;
    }
    .other-department {
      width: 15%;
    }
    .acceptedlist {
      width: 8%;
    }
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
    font-size: 16px;
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
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction(row_index,"complete")}>詳細</div></li>
          <li><div onClick={() => parent.contextMenuAction(row_index,"karte_view")}>カルテを開く</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class PrescriptionTableList extends Component {
  constructor(props) {
    super(props);
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.state = {
      modal_title:this.props.modal_title,
      isOpenModal: false,
      isOpenKarteModeModal:false,
      table_list:props.table_list,
      selected_index:'',
      alert_messages:"",
      msg_act:"",
    };
  }

  //部門の一覧メニューで、患者ID検索の結果が1件のみの場合、そのオーダーの詳細モーダルを開くようにする
  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.table_list != this.state.table_list){
      if(nextProps.keyword !== "" && nextProps.table_list.length === 1 && this.props.search_flag){
        let selectedMedPatientInfo = {};
        selectedMedPatientInfo.receId = nextProps.table_list[0].patient.patientNumber;
        selectedMedPatientInfo.name = nextProps.table_list[0].patient.name;
        this.setState({
          isOpenModal: true,
          modal_data: nextProps.table_list[0],
          endoscope_image:"",
          selected_index:0,
          selectedMedPatientInfo,
        })
      }
    }
    this.setState({
      table_list:nextProps.table_list,
    },()=>{
      this.props.changeSearchFlag();
    });
  }

  completeData = (index) => {
    let selectedMedPatientInfo = {};
    selectedMedPatientInfo.receId = this.state.table_list[index].patient.patientNumber;
    selectedMedPatientInfo.name = this.state.table_list[index].patient.name;
    this.setState({
      isOpenModal: true,
      modal_data: this.state.table_list[index],
      reception_or_done: this.props.reception_or_done,
      endoscope_image:"",
      selected_index:index,
      selectedMedPatientInfo,
    })
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
    if (type === "complete"){
      this.completeData(index);
    }
    if (type === "karte_view"){
      this.goKartePage(index);
    }
  };

  closeModal = (act) => {
    let _msg_act = JSON.parse(JSON.stringify(this.state.msg_act));
    let _state = {};
    _state.isOpenModal = false;
    _state.alert_messages = "";
    _state.isOpenKarteModeModal = false;
    _state.msg_act = null;

    if (act == "change") {
      _state.alert_messages = "実施しました。";
    }
    this.setState(_state, ()=>{
      if(act == "change" || _msg_act == "prescription_done"){
        this.props.refresh();
      }
    })
  };

  closeDoneModal = (_msg='') => {
    this.setState()
    let _state = {};
    _state.isOpenModal = false;
    _state.alert_messages = _msg == "prescription_done" ? "実施しました。" : "";
    _state.isOpenKarteModeModal = false;
    // YJ234 処方受付で、実施完了時に「実施しました」アラートがない
    // ・処方の実施も完了アラートを出すように。
    _state.msg_act = _msg;

    // this.setState(_state, ()=>{
    //   if (_msg == "prescription_done") {
    //     this.props.refresh();
    //   }
    // })
    this.setState(_state);
  }

  goKartePage = async(index) => {
    let data = this.state.table_list[index];
    let patients_list = this.context.patientsList;
    let isExist = 0;
    if(patients_list !== undefined && patients_list != null && patients_list.length > 0){
      patients_list.map(item=>{
        if (item.system_patient_id == data.patient.systemPatientId) {
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
        if(parseInt(department.id) == data.prescription.order_data.department_code){
          department_name = department.value;
          return;
        }
      });
      let modal_data = {
        systemPatientId:data.patient.systemPatientId,
        date:data['treatment_date'],
        medical_department_code:data.prescription.order_data.department_code,
        department_name,
      };
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
      });
    } else { // exist patient connect
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+data.patient.systemPatientId+"/"+page);
    }
  }

  goToUrlFunc = (url) => {
    this.props.goToPage(url);
    this.setState({isOpenKarteModeModal: false});
  };

  selectedItem=(index)=>{
    this.setState({selected_index:index});
  };

  getConvertDateTime = (_date=null) => {
    let result = "";
    if(_date == undefined || _date == null || _date == "") return result;

    result = _date.substr(0, 4) + "/" + _date.substr(5, 2) + "/" + _date.substr(8, 2) + " ";
    if (_date.length > 10) {
      result = result + _date.substr(11, 2) + ":" + _date.substr(14, 2);
    }

    return result
  }

  getConvertStartDate = (_date=null) => {
    let result = "";
    if(_date == undefined || _date == null || _date == "") return result;

    result = _date.substr(0, 4) + "/" + _date.substr(4, 2) + "/" + _date.substr(6, 2) + " ";
    return result
  }

  // convert data for PrescriptionDoneModal display style
  getModalData = (_modal_data) => {

    let ret = {};
    ret.target_number = _modal_data.prescription.number;
    ret.patient_id = _modal_data.prescription.patient_id;
    ret.updated_at = _modal_data.prescription.updated_at;
    ret.treatment_datetime = _modal_data.prescription.treat_date;
    ret.is_doctor_consented = _modal_data.prescription.is_doctor_consented;
    ret.input_staff_name = _modal_data.prescription.proxy_input_staff_name;
    ret.doctor_name = _modal_data.prescription.order_data.doctor_name;
    ret.data = _modal_data.prescription;
    return ret;
  }

  getImplementDate = (_doneOrder, _treatDate, _updatedAt) => {
    let result = "";
    if (_doneOrder == 1) {
      if (_treatDate != undefined && _treatDate != null && _treatDate != "" && _treatDate.length > 4) {
        result = this.getConvertDateTime(_treatDate);
      } else {
        result = this.getConvertDateTime(_updatedAt);
      }
    }
    return result;
  }
  
  getBackGround=(background, status)=>{
    if(background != undefined){
      return background;
    } else {
      return status == 0 ? this.props.row_color : (status == 2 ? this.props.row_reception_color : this.props.row_done_color);
    }
  }

  render() {    
    return (
      <TableHeader>
        <div className={'table-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead className={'thead-area'}>
              <tr>
                <th style={{width:"8rem"}}>処方開始日</th>
                <th style={{width:"8rem"}}>患者ID</th>
                <th style={{width:"14rem"}}>氏名</th>
                <th style={{width:"7rem"}}>実施状態</th>
                <th>区分</th>
                <th style={{width:"10rem"}}>区分詳細</th>
                <th style={{width:"14rem"}}>指示医師</th>
                <th style={{width:"12rem"}}>実施日時</th>
                <th style={{width:"12rem"}}>指示日時</th>              
              </tr>
            </thead>
            <tbody className={'scroll-area'} id={'table-body'}>
            {this.props.is_loaded ? (
              <>
                {(this.state.table_list == undefined || this.state.table_list == null || this.state.table_list.length === 0) ? (
                  <tr style={{height:"calc(100vh - 22rem)"}}>
                    <td colSpan={'9'}>
                      <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {this.state.table_list != undefined && this.state.table_list != null && this.state.table_list.length > 0 && this.state.table_list.map((item, index) => {
                      return (
                        <>
                          <tr
                            id="list-table"
                            className={this.state.selected_index === index ? 'selected row-item' : 'row-item'}
                            style={{background:this.getBackGround(item.background, item.prescription.done_order)}}
                            onClick={this.selectedItem.bind(this, index)}
                            onContextMenu={e => this.handleClick(e, index, item.state, this.props.reception_or_done)}
                            onDoubleClick={this.goKartePage.bind(this, index)}
                          >
                            <td style={{width:"8rem"}}>
                              {item.prescription.order_data.order_data[0].start_date == null ? "日未定" : (item.prescription.order_data.order_data[0].start_date.length > 4 ? this.getConvertStartDate(item.prescription.order_data.order_data[0].start_date): "")}
                            </td>
                            <td style={{width:"8rem",textAlign: "right"}}>
                              {item.patient.patientNumber != "" && item.patient.patientNumber.replace(" ", "0")}
                            </td>
                            <td style={{width:"14rem"}}>
                              {item.prescription.patient_name}
                            </td>
                            <td style={{width:"7rem"}}>
                              {item.prescription.done_order == 0 ? "未実施" : (item.prescription.done_order == 2 ? "受付済み" : "実施済み")}
                            </td>
                            <td>
                              {item.prescription.karte_status == 1 ? item.prescription.order_data.is_internal_prescription == 0 ? "院外" : "院内" : "" }
                            </td>
                            <td style={{width:"10rem"}}>
                              {item.prescription.karte_status == 3 ? HOSPITALIZE_PRESCRIPTION_TYPE[item.prescription.order_data.is_internal_prescription].value + "処方" : ""}
                            </td>
                            <td style={{width:"14rem"}}>
                              {item.prescription.order_data != undefined && item.prescription.order_data.doctor_name != undefined && item.prescription.order_data.doctor_name}
                            </td>
                            <td style={{width:"12rem"}}>
                              {this.getImplementDate(item.prescription.done_order, item.prescription.treat_date, item.prescription.updated_at)}
                            </td>
                            <td style={{width:"12rem"}}>
                              {item.prescription.created_at == null ? "日未定" : (item.prescription.created_at.length > 4 ? this.getConvertDateTime(item.prescription.created_at): "")}
                            </td>
                          </tr>
                        </>
                      )
                    })}
                  </>
                )}
              </>
            ):(
              <tr style={{height:"calc(100vh - 22rem)"}}>
                <td colSpan={'9'}>
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
          reception_or_done={this.state.reception_or_done}
        />
        {/*{this.state.isOpenModal == true && (
          <OrderDoneModal
            closeModal={this.closeModal}
            modal_title={this.state.modal_title}
            modal_type={this.props.modal_type}
            modal_data={this.state.modal_data}
            reception_or_done={this.props.reception_or_done}
          />
         )}*/}
        {this.state.isOpenModal == true && (
          <PrescriptionDoneModal
            patientId={this.state.modal_data.patient.systemPatientId}
            closeModal={this.closeDoneModal}
            // modal_type={this.state.done_modal_type}
            modal_type={"prescription"}
            modal_title={this.state.modal_title}
            modal_data={this.getModalData(this.state.modal_data)}
            patientInfo = {this.state.selectedMedPatientInfo}
            // donePrescription={()=>this.closeModal("change")}
          />
        )}
        {this.state.isOpenKarteModeModal && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.closeModal}
            modal_type={'order'}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </TableHeader>
    );
  }
}

PrescriptionTableList.contextType = Context;
PrescriptionTableList.propTypes = {
  table_list: PropTypes.array,
  is_endoscope: PropTypes.bool,
  is_loaded: PropTypes.bool,
  refresh: PropTypes.func,
  prescription_type: PropTypes.number,
  reception_or_done: PropTypes.string,
  modal_title: PropTypes.string,
  modal_type: PropTypes.string,
  goToPage: PropTypes.func,
  keyword: PropTypes.string,
  search_flag: PropTypes.bool,
  changeSearchFlag: PropTypes.changeSearchFlag,
  row_color:PropTypes.string,
  row_reception_color:PropTypes.string,
  row_done_color:PropTypes.string,
};

export default PrescriptionTableList;
