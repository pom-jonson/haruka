import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import TreatDoneModal from "./TreatDoneModal"
import Context from "~/helpers/configureStore";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {formatJapanDate} from "~/helpers/date";
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
        height: calc( 100vh - 20.5rem);
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

class TreatTableList extends Component {
  constructor(props) {
    super(props);
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.state = {
      tableLIst:props.tableLIst,
      isOpenModal: false,
      isOpenKarteModeModal:false,
      selected_index:'',
      alert_messages:"",
    };
  }
  //部門の一覧メニューで、患者ID検索の結果が1件のみの場合、そのオーダーの詳細モーダルを開くようにする
  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.tableLIst != this.state.tableLIst){
      if(nextProps.keyword !== "" && nextProps.tableLIst.length === 1 && this.props.search_flag){
        this.setState({
          isOpenModal: true,
          modal_data: nextProps.tableLIst[0],
          endoscope_image:"",
          selected_index:0
        })
      }
    }
    this.setState({
      tableLIst:nextProps.tableLIst,
    },()=>{
      this.props.changeSearchFlag();
    });
  }

  completeData = (index) => {
    this.setState({
      isOpenModal: true,
      modal_data: this.state.tableLIst[index],
      endoscope_image:"",
      selected_index:index
    });
  };

  handleClick = (e, index, state) => {
    if(state == 1) this.setState({done_state:state});
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
        selected_index:index
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
            selected_index:index
          })
        } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX,
              y: clientY - menu_height,
            },
            row_index: index,
            selected_index:index
          })
        } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX-menu_width,
              y: clientY + window.pageYOffset,
            },
            row_index: index,
            selected_index:index
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

  goKartePage = async(index) => {
    let data = this.state.tableLIst[index];
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

  closeModal = (act) => {
    this.setState({
      isOpenModal: false,
      isOpenKarteModeModal: false,
      alert_messages: "",
    }, ()=>{
      if(act === "change"){
        this.props.refresh(false);
      }
    })
  };

  selectedItem=(index)=>{
    this.setState({selected_index:index});
  }
  
  getBackGround=(background, status)=>{
    if(background != undefined){
      return background;
    } else {
      return status == 0 ? this.props.row_color : this.props.row_done_color;
    }
  }

  render() {
    return (
      <Wrapper>
        <div className={'table-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead className={'thead-area'}>
            <tr>
              <th className="department">予定日付</th>
              <th className="karte-ward">入外</th>
              <th className="patient-id">患者ID</th>
              <th className="name">名前</th>
              <th className="other-department">指示医師</th>
              <th className="done-status">実施状態</th>
              <th className="department">実施日時</th>
            </tr>
            </thead>
            <tbody className={'scroll-area'} id={`list-table`}>
            {this.props.is_loaded ? (
              <>
                {this.state.tableLIst != null && this.state.tableLIst.length > 0 ? (
                  this.state.tableLIst.map((item, index)=>{
                    return (
                      <>
                        <tr className={this.state.selected_index === index ? 'selected' : ''} style={{background:this.getBackGround(item.background, item.prescription)}}
                            onContextMenu={e => this.handleClick(e, index, item.state)}
                            onClick={this.selectedItem.bind(this, index)}
                            onDoubleClick={this.goKartePage.bind(this, index)}>
                          <td className="department">{item.start_time != null  && item.start_time.length != "" ? formatJapanDate(item.date) + " " + item.start_time: formatJapanDate(item.date)}</td>
                          <td className="karte-ward">{item.karte_ward != undefined ? item.karte_ward : ""}</td>
                          <td className="patient-id">{item.patient_number != "" && item.patient_number.replace(" ", "0")}</td>
                          <td className="name">{item.patient_name}</td>
                          <td className="other-department">{item.order_data != undefined && item.order_data.order_data.header.doctor_name != undefined && item.order_data.order_data.header.doctor_name}</td>
                          <td className="done-status">{item.state == 0 ? "未実施": "実施"}</td>
                          <td className="department">{item.completed_at != null && item.completed_at != "" ? item.completed_at : ""}</td>
                        </tr>
                      </>
                    )
                  })
                ):(
                  <tr style={{height:"calc(100vh - 20.5rem)"}}>
                    <td colSpan={'10'} style={{verticalAlign:"middle"}}>
                      <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
                    </td>
                  </tr>
                )}
              </>
            ):(
              <tr style={{height:"calc(100vh - 20.5rem)"}}>
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
        />
        {this.state.isOpenModal && (
          <TreatDoneModal
            closeModal={this.closeModal}
            modal_data={this.state.modal_data}
          />
        )}
        {this.state.isOpenKarteModeModal && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.closeModal}
            modal_type={'treat_order'}
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
    );
  }
}

TreatTableList.contextType = Context;

TreatTableList.propTypes = {
  tableLIst: PropTypes.array,
  need_inspection: PropTypes.bool,
  refresh: PropTypes.func,
  goToPage: PropTypes.func,
  keyword: PropTypes.string,
  search_flag: PropTypes.bool,
  changeSearchFlag: PropTypes.changeSearchFlag,
  is_loaded:PropTypes.bool,
  row_color:PropTypes.string,
  row_done_color:PropTypes.string,
};

export default TreatTableList;