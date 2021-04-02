import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "~/components/_nano/colors";
import OrderDoneModal from "./OrderDoneModal"
import RehabilyOrderDoneModal from "./RehabilyOrderDoneModal"
import OrderDoneRaidationModal from "./OrderDoneRaidationModal"
import {formatJapanDate} from "~/helpers/date";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import Context from "~/helpers/configureStore";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import RadiationPrintModal from "./RadiationPrintModal";
import DoneModal from "~/components/organisms/DoneModal";
import Spinner from "react-bootstrap/Spinner";

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
    .row-item {        
      width: 100%;
    }
  .table-header {
    background-color: ${colors.surface};
    border-bottom: 1px solid #dee2e6;
    // display: flex;
    align-items: center;
    font-size: 1rem;
    width: 100%;
    z-index: 99;
    tr{
      width:calc(100% - 17px);
      display:table;
    }
    th{
      border:1px solid #dee2e6;
      border-bottom:none;
    }
  }

  .table-scroll {
    display:block;
    overflow-y:scroll;
    margin-bottom:0.5rem;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    background-color: ${colors.surface};

    .no-result {    
      height:100%;
      width:100%;
      div{
        height:100%;
        width:100%;
        text-align: center;
        vertical-align:middle;
        display:flex;
        align-items:center;
        justify-content:center; 
      }
      
      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
    tr{
      width:100%;
      display:table;
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
      width: 14rem;      
    }
    .patient-id {
      width: 8.5rem;
    }
    .sex{
      width: 3rem;
    }
    .birthday{
      width: 10rem;
    }
    .name {
      width: 10rem;
    }
    .karte-ward {
      width: 7rem;
    }
    .department-content {
      width: 10%;
    }
    .other-department {
      width: 11rem;
    }
    .acceptedlist {
      width: 6rem;
    }
  }
  td{
    padding-top:3px;
    padding-bottom:3px;
    word-break: break-all;
    padding-left:2px;
  }
  th{
    padding-top:3px;
    padding-bottom:3px;
    text-align:center;
    word-break: break-all;    
  }
`;

const TableItem = styled.tr`
  border-bottom: 1px solid ${colors.background};
  width: 100%;
  font-size: 1rem;
  // display: flex;
  cursor:pointer;
  &.row,
  .row {
    margin: 0;
  }

  &.end {
    background-color: #dedede;
    .department {
      opacity: 0.5;
    }
    .other-department .finished {
      opacity: 1;
    }
  }

  p {
    margin: 0 8px 0 0;
  }

  .accepted-time {
    font-size: 16px;
    align-self: center;
  }

  &:hover {
    background-color: ${colors.secondary200};
  }
  .department {
    width: 14rem;
    margin: 0;
  }
  .patient-id {
    width: 8.5rem;
  }
  .sex{
    width: 3rem;
  }
  .birthday{
    width: 10rem;
  }
  .name {
    width: 10rem;
  }
  .karte-ward {
    width: 7rem;
  }
  .department-content {
    width: 10%;
  }
  .other-department {
    width: 11rem;
  }
  .acceptedlist {
    width: 6rem;
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

const ContextMenu = ({ visible, x,  y, done_order,radiation_name, parent,  row_index, reception_or_done, modal_type}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction(row_index,"complete")}>詳細</div></li>
          <li><div onClick={() => parent.contextMenuAction(row_index,"karte_view")}>カルテを開く</div></li>
          {modal_type == 'radiation' && reception_or_done == 'done' && done_order == 1 && radiation_name != '他医撮影診断' && (
            <li><div onClick={() => parent.contextMenuAction(row_index,"print")}>照射録印刷</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class OrderTableList extends Component {
  constructor(props) {
    super(props);
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.state = {
      modal_title:this.props.modal_title,
      isOpenModal: false,
      isOpenDoneModal: false,
      isOpenKarteModeModal:false,
      isOpenRadiationModal:false,
      isOpenRehabilyDoneModal:false,
      isOpenPrintModal:false,
      table_list:props.table_list,
      selected_index:'',
      alert_messages:"",
    };
  }

  //部門の一覧メニューで、患者ID検索の結果が1件のみの場合、そのオーダーの詳細モーダルを開くようにする
  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.table_list != this.state.table_list){
      if(nextProps.keyword !== "" && nextProps.table_list.length === 1 && this.props.search_flag){
        if(this.props.modal_type == "guidance"){
          let patientInfo = {
            receId:nextProps.table_list[0]['patient_number'],
            name:nextProps.table_list[0]['patient_name'],
          };
          let modal_data = nextProps.table_list[0];
          modal_data.data = [];
          modal_data.data.done_order = modal_data.done_order;
          modal_data.data.order_data = modal_data.order_data;
          modal_data.data.is_enabled = modal_data.is_enabled;
          modal_data.data.history = modal_data.history;
          modal_data.data.medical_department_name = this.props.department_names[modal_data.order_data.order_data.department_id];
          this.setState({
            isOpenDoneModal: true,
            modal_data,
            selected_index:0,
            patientInfo,
          });
        } else {
          this.setState({
            isOpenModal: true,
            modal_data: nextProps.table_list[0],
            endoscope_image:"",
            selected_index:0,
          })
        }
      }
    }
    this.setState({
      table_list:nextProps.table_list,
    },()=>{
      this.props.changeSearchFlag();
    });
  }

  completeData = (index) => {
    if (this.props.modal_type == 'radiation'){
      if (this.props.reception_or_done == 'done') {
        this.setState({
          isOpenRadiationModal: true,
          modal_data: this.state.table_list[index],
          reception_or_done: this.props.reception_or_done,
          endoscope_image:"",
          selected_index:index,
        })
      } else {
        this.setState({
          isOpenModal: true,
          modal_data: this.state.table_list[index],
          reception_or_done: this.props.reception_or_done,
          endoscope_image:"",
          selected_index:index,
        })
      }
    } else if(this.props.modal_type == 'guidance'){
      let patientInfo = {
        receId:this.state.table_list[index]['patient_number'],
        name:this.state.table_list[index]['patient_name'],
      };
      let modal_data = this.state.table_list[index];
      modal_data.data = [];
      modal_data.data.done_order = modal_data.done_order;
      modal_data.data.order_data = modal_data.order_data;
      modal_data.data.is_enabled = modal_data.is_enabled;
      modal_data.data.history = modal_data.history;
      modal_data.data.medical_department_name = this.props.department_names[modal_data.order_data.order_data.department_id];
      this.setState({
        isOpenDoneModal: true,
        modal_data,
        selected_index:index,
        patientInfo,
      });
    } else if (this.props.modal_type == "rehabily") {
      this.setState({
        isOpenRehabilyDoneModal: true,
        modal_data: this.state.table_list[index],
        reception_or_done: this.props.reception_or_done,
        endoscope_image:"",
        selected_index:index,
      })
    } else {
      this.setState({
        isOpenModal: true,
        modal_data: this.state.table_list[index],
        reception_or_done: this.props.reception_or_done,
        endoscope_image:"",
        selected_index:index,
      });
    }
  };

  handleClick = (e, index, done_order,reception_or_done, order_data) => {
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
          done_order,
          radiation_name:order_data.radiation_name,
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
              done_order,
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
              done_order,
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
              done_order,
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
    if (type == 'print'){
      this.openPrintModal(index);
    }
  };

  openPrintModal = (index) => {
    this.setState({
      isOpenPrintModal:true,
      print_data:this.state.table_list[index],
    })
  }
  
  closeModal = (act) => {
    this.setState({
      isOpenModal: false,
      isOpenDoneModal: false,
      isOpenRadiationModal:false,
      isOpenPrintModal:false,
      isOpenRehabilyDoneModal:false,
      alert_messages: "",
      isOpenKarteModeModal: false,
    }, ()=>{
      if(act == "change"){
        this.props.refresh(this.state.modal_data);
      }
    })
  };

  goKartePage = async(index) => {
    let data = this.state.table_list[index];
    let patients_list = this.context.patientsList;
    let isExist = 0;
    if(patients_list !== undefined && patients_list != null && patients_list.length > 0){
      patients_list.map(item=>{
        if (item.system_patient_id == data.system_patient_id) {
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
        if(parseInt(department.id) == data['medical_department_code']){
          department_name = department.value;
          return;
        }
      });
      let modal_data = {
        systemPatientId:data['system_patient_id'],
        date:data['treatment_date'],
        medical_department_code:data['medical_department_code'],
        department_name,
      };
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
      });
    } else { // exist patient connect
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+data.system_patient_id+"/"+page);
    }
  }

  goToUrlFunc = (url) => {
    this.props.goToPage(url);
    this.setState({isOpenKarteModeModal: false});
  };

  selectedItem=(index)=>{
    this.setState({selected_index:index});
  };
  
  getBackGround=(background, status)=>{
    if(background != undefined){
      return background;
    } else {
      if(this.props.modal_type =="guidance"){
        return status == 0 ? this.props.row_color : this.props.row_done_color;
      } else {
        return status == 0 ? this.props.row_color : (status == 2 ? this.props.row_reception_color : this.props.row_done_color);
      }
    }
  }

  render() {
    const table_list = [];
    let message = '';
    if (this.props.is_loaded){
      if (this.state.table_list != null && this.state.table_list.length > 0) {
        this.state.table_list.map((item, index) => {
          var radiation_create_time = '';
          if (this.props.modal_type == 'radiation'){
            if (item.updated_at != undefined && item.updated_at != null){
              if (item.treatment_date == item.updated_at.split(' ')[0] && item.karte_ward == '外来'){
                radiation_create_time = ' ' + item.updated_at.split(' ')[1];
              } else {
                if (item.order_data.order_data.reserve_time != undefined && item.order_data.order_data.reserve_time == "時間未定"){
                  radiation_create_time = ''
                } else {
                  radiation_create_time = ' 時間未定';
                }
                
              }
            }
          }
          table_list.push(
            <TableItem key={index}
                       onClick={this.selectedItem.bind(this, index)}
                       onContextMenu={e => this.handleClick(e, index, item.done_order, this.props.reception_or_done, item.order_data.order_data)}
                       onDoubleClick={this.goKartePage.bind(this, index)}
                       className={this.state.selected_index === index ? 'selected row-item' : 'row-item'} style={{background:this.getBackGround(item.background, item.done_order)}}
            >
              <td className="department">
                {(item.treat_date != null && item.treat_date.length > 4)
                  ? (formatJapanDate(item.treat_date.split(" ")[0])
                    + (item.treat_date.split(" ")[1] != "00:00:00" ? (" "+item.treat_date.split(" ")[1].split(':')[0]+":"+item.treat_date.split(" ")[1].split(':')[1]) 
                      : radiation_create_time))
                  : "日未定"}
                {(this.props.modal_type =="radiation" && item.order_data.order_data.reserve_time != undefined && item.order_data.order_data.reserve_time == "時間未定") ? " 時間未定" : ""}
                {item.is_emergency == 1 && (<span style={{color:"red"}}>[当日緊急]</span>)}
              </td>
              {this.props.show_karte && (
                <td className="karte-ward">{item.karte_ward != undefined ? item.karte_ward : ""}</td>
              )}
              <td className="patient-id">{item.patient_number != "" && item.patient_number.replace(" ", "0")}</td>
              <td className="">{item.patient_name}</td>
              {this.props.modal_type =="radiation" && (
                <>
                  <td className="name">{item.patient_name_kana}</td>
                  <td className="sex">{item.gender != null && item.gender == 1 ? "男性":"女性"}</td>
                  <td className="birthday">{item.birthday != null && item.birthday != "" ? formatJapanDate(item.birthday):""}</td>
                  <td className="name">{item.order_data != undefined && item.order_data.order_data.radiation_name != undefined && item.order_data.order_data.radiation_name}</td>
                </>
              )}
              <td className="other-department">{item.order_data != undefined && item.order_data.order_data.doctor_name != undefined && item.order_data.order_data.doctor_name}</td>
              <td className="acceptedlist">{item.done_order == 0 ? (this.props.modal_type =="guidance" ? "未実施" : "未受付") : (item.done_order == 2 ? "受付済み" : "実施")}</td>            
            </TableItem>
          );
        });
      } else {
        message = <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>;
      }
    }
    
    return (
      <>
        <Wrapper>
          <table className="table-bordered" style={{width:'100%'}}>
            <thead className="table-header table-row">
              <tr>
                <th className="department">日付</th>
                {this.props.show_karte && (
                  <th className="karte-ward">入外</th>
                )}
                <th className="patient-id">患者ID</th>
                <th className="">名前</th>
                {this.props.modal_type == "radiation" && (
                  <>
                    <th className="name">カナ</th>
                    <th className="sex">性別</th>
                    <th className="birthday">生年月日</th>
                    <th className="name">オーダーの種類</th>
                  </>
                )}
                <th className="other-department">指示医師</th>
                <th className="acceptedlist">{this.props.reception_or_done == "done" ? "実施状態" : "受付状態"}</th>
              </tr>
            </thead>
            <tbody style={{height:this.props.modal_type === "radiation" ? "calc(100vh - 25rem)" : "calc(100vh - 22rem)"}} id="list-table" className='table-scroll'>
              {this.props.is_loaded && (
                <>
                {table_list}{message}
                </>
              )}
              {this.props.is_loaded != true && (
                <div style={{height:'100%',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </div>
              )}
            </tbody>
          </table>          
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            row_index={this.state.row_index}
            reception_or_done={this.state.reception_or_done}
            modal_type = {this.props.modal_type}
          />
          {this.state.isOpenModal && (
            <OrderDoneModal
              closeModal={this.closeModal}
              modal_title={this.state.modal_title}
              modal_type={this.props.modal_type}
              modal_data={this.state.modal_data}
              reception_or_done={this.props.reception_or_done}
            />
          )}
          {this.state.isOpenRehabilyDoneModal && (
            <RehabilyOrderDoneModal
              closeModal={this.closeModal}
              modal_title={this.state.modal_title}
              modal_type={this.props.modal_type}
              modal_data={this.state.modal_data}
              reception_or_done={this.props.reception_or_done}
            />
          )}
          {this.state.isOpenDoneModal && (
            <DoneModal
              modal_title={"汎用オーダー"}
              modal_type={"guidance"}
              modal_data={this.state.modal_data}
              closeModal={this.closeModal}
              patientId={this.state.modal_data.patient_id}
              patientInfo={this.state.patientInfo}
              fromPage={'no-soap'}
            />
          )}
          {this.state.isOpenRadiationModal == true && (
            <OrderDoneRaidationModal
              closeModal={this.closeModal}
              modal_title={this.state.modal_title}
              modal_type={this.props.modal_type}
              modal_data={this.state.modal_data}
              reception_or_done={this.props.reception_or_done}
              from_source = {'done_list'}
            />
          )}
          {this.state.isOpenPrintModal == true && (
            <RadiationPrintModal
              closeModal={this.closeModal}
              print_data={this.state.print_data}
            />
          )}
          {this.state.isOpenKarteModeModal == true && (
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
        </Wrapper>
      </>
    );
  }
}

OrderTableList.contextType = Context;
OrderTableList.propTypes = {
  table_list: PropTypes.array,
  is_endoscope: PropTypes.bool,
  refresh: PropTypes.func,
  reception_or_done: PropTypes.string,
  modal_title: PropTypes.string,
  modal_type: PropTypes.string,
  goToPage: PropTypes.func,
  keyword: PropTypes.string,
  search_flag: PropTypes.bool,
  changeSearchFlag: PropTypes.changeSearchFlag,
  history: PropTypes.object,
  department_names: PropTypes.object,
  show_karte:PropTypes.bool,
  row_color:PropTypes.string,
  row_reception_color:PropTypes.string,
  row_done_color:PropTypes.string,
  is_loaded:PropTypes.bool,
};

export default OrderTableList;