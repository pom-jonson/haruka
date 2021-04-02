import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import * as colors from "../../_nano/colors";
import AddContactModal from "./modals/AddContactModal";
import Button from "../../atoms/Button";
import DialSideBar from "./DialSideBar";
import DialPatientNav from "./DialPatientNav";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as apiClient from "~/api/apiClient";
import RadioButton from "~/components/molecules/RadioInlineButton";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import {formatDateLine} from "~/helpers/date";
import PatientLedgerPrintModal from "~/components/templates/Print/Modal/PateintLedgerPrintModal";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
  cursor: pointer;
`;
const Card = styled.div`
  padding: 1.25rem;
  position: fixed;
  top: 70px;
  left: 200px;
  width: calc(100% - 390px);
  margin: 0px;
  height: calc(100% - 70px);
  float: left;
  .add-icon {
    margin-left: 10px;
    line-height: 2.5rem;
    cursor:pointer;
  }

  .disabled {
    opacity: 0.5;
    cursor: unset;
    svg {
      cursor: unset;
    }
  }
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
    margin-bottom: 10px;
    margin-top: -10px;
  }
  .others {
    position: absolute;
    right: 1.25rem;
    button {
      margin-left: 0.2rem;
      margin-bottom: 0px;
      margin-top: 0.3rem;
    }
    span {
      font-size: 1rem;
    }
  }
  .bodywrap {
    display: flex;
  }
  .footer {
    margin-top: 10px;
    text-align: right;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }

    span {
      color: white;
      font-size: 0.8rem;
      font-weight: 100;
    }
  }
  background-color: ${surface};
  button {
    margin-bottom: 10px;
    margin-left: 10px;
  }
  .radio-group {
    display: flex;
    float: right;
    label {
      width: 100px;
      font-size: 1.1rem;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      line-height:2.5rem;
      height: 2.5rem;
    }
    .radio-btn label {
      width: 8rem;
    }
  }
  .disable-button {
    background: rgb(101, 114, 117);
    cursor: auto;
  }
`;

const ContactsTableWrapper = styled.div`
  width: 100%;
  margin-bottom: 0.5rem;
  .table-header {
    background-color: ${colors.surface};
    border-bottom: 1px solid #bbbbbb;
    display: flex;
    align-items: center;
    font-size: 16px;
    padding: 8px 16px;
    width: 100%;
    z-index: 99;
  }

  .table-scroll {
    width: 100%;
    height: calc(100% - 9rem);
    overflow-y: auto;
    background-color: ${colors.surface};

    .no-result {
      padding: 200px;
      text-align: center;

      span {
        padding: 10px;
        border: 2px solid #aaa;
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
    .number {
      width: 5%;
      text-algin: right;
    }
    .department {
      width: 30%;
      margin: 0;
      margin-right: 0.5rem;
      div {
        word-break: break-all;
      }
    }
    .name {
      width: 10%;
      margin-right: 0.5rem;
      div {
        word-break: break-all;
      }
    }
    .tel-area {
      width: 20%;
      padding-right: 0.6rem;
      text-align: left;
      div {
        word-break: break-all;
      }
    }
  }

  table {
    thead {
      display: table;
      width: 100%;
    }
    tbody {
      display: block;
      overflow-y: auto;
      height: calc(100vh - 26rem);
      width: 100%;
    }
    tr {
      display: table;
      width: 100%;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr:hover{background-color:#e2e2e2 !important;}
    td {
      word-break: break-all;
      font-size: 0.9rem;
      padding: 0.25rem;
    }
    th {
      font-size: 0.9rem;
      position: sticky;
      text-align: center;
      padding: 0.3rem;
    }
    .table-check {
      width: 4.375rem;
    }
    .item-no {
      width: 3.125rem;
    }
    .code-number {
      width: 10rem;
    }
    .name {
      width: 6rem;
    }
    .no-result {
      padding: 200px;
      text-align: center;

      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
  }
`;

const ContextMenuUl = styled.ul`
  margin-bottom: 0;
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
const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 40vw;
  display: table-caption;
  position: absolute;
  top: 20rem;
`;

const ContextMenu = ({ visible, x, y, parent, favouriteMenuType }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() =>parent.contextMenuAction(favouriteMenuType, "edit")}>編集</div>
          </li>
          <li>
            <div onClick={() =>parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class DialEmergencyContactBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table_data: [],
      isAddContactModal: false,
      isOpenPrintModal: false,
      isDeleteConfirmModal: false,
      all_display: 0,
      confirm_alert_title:'',
      patientInfo:props.patientInfo,
      system_patient_id: (props.patientInfo != undefined && props.patientInfo != null) ? props.patientInfo.system_patient_id : null,
    };
  }

  async componentDidMount() {
    await this.getList().then(() => {
      this.setState({isLoaded: true});
    });
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      patientInfo:nextProps.patientInfo,
      system_patient_id: (nextProps.patientInfo != undefined && nextProps.patientInfo != null) ? nextProps.patientInfo.system_patient_id : null,
    });
  }
  
  async getList() {
    if(this.state.system_patient_id != null){
      let path = "/app/api/v2/dial/patient/emergency_contact";
      let post_data = {
        system_patient_id: this.state.system_patient_id,
        all_display: this.state.all_display,
      };
      let { data } = await axios.post(path, { params: post_data });
      this.setState({
        table_data: data,
        origin_data: [...data],
      });
    }
  }
  
  onClick = () => {
    if (this.state.system_patient_id == undefined || this.state.system_patient_id == null) {
      // window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
      return;
    }
    this.setState({
      isAddContactModal: true,
      modal_data: null,
    });
  };
  closeModal = () => {
    this.setState({
      isAddContactModal: false,
      isOpenPrintModal: false
    });
  };
  
  confirm = async (insert_param) => {
    this.setState({isAddContactModal: false,});
    insert_param.patient_number = this.state.patient_number;
    let path = "/app/api/v2/dial/patient/emergency_contact/register";
    await apiClient.post(path, { params: insert_param }).then(() => {
      if (insert_param.id == 0) {
        window.sessionStorage.setItem("alert_messages","登録完了##" + "登録しました。");
      } else {
        window.sessionStorage.setItem("alert_messages","変更完了##" + "変更しました。");
      }
    });
    await this.getList();
  };

  selectPatient = (patientInfo) => {
    this.setState({
      patientInfo: patientInfo,
      system_patient_id: patientInfo.system_patient_id,
    },async()=> {
      await this.getList();
    });
  };

  handleClick = (e, index) => {
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        contextMenu: { visible: false },
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    this.setState({
      contextMenu: {
        visible: true,
        x: e.clientX - 200,
        y:this.props.type != undefined && this.props.type == "page" ? e.clientY - 70 : e.clientY - 100,
      },
      favouriteMenuType: index,
    });
  };

  contextMenuAction = (index, type) => {
    if (type === "edit") {
      this.editData(index);
    }
    if (type === "delete") {
      // this.deleteData(this.state.table_data[index].id);
      this.setState({
        del_index: this.state.table_data[index].id,
      });
      this.delete();
    }
  };

  editData = (index) => {
    let modal_data = this.state.table_data[index];
    this.setState({
      modal_data,
      isAddContactModal: true,
    });
  };

  deleteData = async () => {
    this.confirmCancel();
    let path = "/app/api/v2/dial/patient/emergency_contact/delete";
    let post_data = {
      params: this.state.del_index,
      system_patient_id: this.state.system_patient_id,
    };
    await apiClient.post(path, post_data).then(() => {
      window.sessionStorage.setItem("alert_messages","削除完了##" + "削除しました。");
    });
    await this.getList();
  };
  delete = () => {
    this.setState({
      isDeleteConfirmModal: true,
      confirm_message: "これを削除して良いですか？",
      confirm_alert_title:'削除確認'
    });
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:'',
    });
  }

  getValue = (e) => {
    this.setState({all_display: parseInt(e.target.value)},async() => {
      await this.getList();
    });
  };

  goOtherPage = (url) => {
    if (this.props.type != undefined && this.props.type == "page") {
      this.props.history.replace(url);
    } else {
      this.props.goOtherPage(url);
    }
  };
  
  openPrintModal=()=>{
    this.setState({isOpenPrintModal:true});
  }

  render() {
    let { table_data } = this.state;
    const isLoaded = this.state.isLoaded;
    let { type } = this.props;

    let { patientInfo } = this.state;
    return (
      <>
        {type != undefined && type == "page" && (
          <>
            <DialSideBar 
              onGoto={this.selectPatient} 
              history = {this.props.history}
            />
            <DialPatientNav
              patientInfo={this.state.patientInfo}
              history = {this.props.history}/>
          </>
        )}
        <Card
          className={
            type == "modal"
              ? "modal_card emergency-contact-modal insurance-modal"
              : ""
          }
        >
          <div className="flex" style={{ marginBottom: "10px" }}>
            <div className="title">緊急連絡先</div>
            <div className="others">
              <Button onClick={this.goOtherPage.bind(this, "/dial/dial_patient?from_other=1")}>透析患者マスタ</Button>
              <Button onClick={this.goOtherPage.bind(this, "/dial/dial_insurance")}>保険情報</Button>
              <Button className="disable-button">緊急連絡先</Button>
              <Button onClick={this.goOtherPage.bind(this, "/dial/dial_family")}>家族歴</Button>
            </div>
          </div>
          <div className={`self-info`}>
            <div className={`d-flex`} style={{ width: "90%", minHeight: "5rem" }}>
              <div style={{ width: "40%" }}>
                <div className={`border-bottom`}>本人住所</div>
                <div className={`text-left`}>
                  {patientInfo != undefined &&
                  patientInfo != null &&
                  patientInfo.zip_code != null &&
                  patientInfo.zip_code != ""
                    ? "〒" + patientInfo.zip_code
                    : ""}
                </div>
                <div className={`text-left`}>
                  {patientInfo != undefined &&
                  patientInfo != null &&
                  patientInfo.address != null
                    ? patientInfo.address +' '+ patientInfo.building_name
                    : ""}
                </div>
              </div>
              <div style={{ width: "30%", marginLeft: "0.5rem" }}>
                <div className={`border-bottom`}>電話番号</div>
                <div className={`text-left`}>
                  {patientInfo != undefined &&
                  patientInfo != null &&
                  patientInfo.tel_number != null
                    ? patientInfo.tel_number
                    : ""}
                </div>
              </div>
              <div style={{ width: "30%", marginLeft: "0.5rem" }}>
                <div className={`border-bottom`}>携帯番号</div>
                <div className={`text-left`}>
                  {patientInfo != undefined &&
                  patientInfo != null &&
                  patientInfo.mobile_number != null
                    ? patientInfo.mobile_number
                    : ""}
                </div>
              </div>
            </div>
            <div className={`d-flex radio-group mb-2`}>
              <RadioButton
                id="disease_name_modal"
                value={1}
                label="全表示"
                name="disease_kind_modal"
                getUsage={this.getValue.bind(this)}
                checked={this.state.all_display === 1}
              />
              <RadioButton
                id="disease_name_modal_1"
                value={0}
                label="非表示を隠す"
                name="disease_kind_modal"
                getUsage={this.getValue.bind(this)}
                checked={this.state.all_display === 0}
              />
              <div
                className={
                  patientInfo!= undefined && patientInfo!= null && patientInfo.system_patient_id>0
                    ? "add-icon"
                    : "add-icon disabled"
                }
                onClick={this.onClick}
              >
                <Icon icon={faPlus} className="plus_icon" />
                緊急連絡先を追加
              </div>
            </div>
          </div>

          <ContactsTableWrapper className="wrapper">
            <table className="table table-bordered table-hover" id="code-table">
              <thead>
                <tr>
                  <th className="item-no" />
                  <th>連絡先</th>
                  <th className="name">続柄</th>
                  <th className="code-number">TEL①</th>
                  <th className="code-number">TEL②</th>
                </tr>
              </thead>
              <tbody>
                {!isLoaded ? (
                  <div className="text-center">
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                ) : (
                  <>
                    {table_data !== undefined && table_data !== null && table_data.length > 0 ? (
                      table_data.map((item, index) => {
                        return (
                          <>
                            <tr onContextMenu={(e) => this.handleClick(e, index)} onDoubleClick={this.editData.bind(this, index)}>
                              <td className="item-no text-right">{index + 1}</td>
                              <td>
                                <div>連絡先 : {item.name}</div>
                                <div className="pl-14">住所 : {item.address_1} {item.address_2}</div>
                              </td>
                              <td className="name">{item.relation}</td>
                              <td className="code-number">
                                <div>{item.phone_number_1_name}</div>
                                <div>{item.phone_number_1}</div>
                              </td>
                              <td className="code-number">
                                <div>{item.phone_number_2_name}</div>
                                <div>{item.phone_number_2}</div>
                              </td>
                            </tr>
                          </>
                        );
                      })
                    ) : (
                      <div className="no-result">
                        <span>登録された連絡先がありません。</span>
                      </div>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </ContactsTableWrapper>
          <div className="footer-buttons">
            {type != undefined && type == "modal" && (
              <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            )}
            <Button className={(table_data !== undefined && table_data !== null && table_data.length > 0) ? "red-btn" : "disable-btn"} onClick={this.openPrintModal}>一覧帳票プレビュー</Button>
          </div>
          {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.deleteData.bind(this)}
              confirmTitle={this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.isAddContactModal && (
            <AddContactModal
              closeModal={this.closeModal}
              saveContact={this.confirm}
              modal_data={this.state.modal_data}
              system_patient_id={this.state.system_patient_id}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
          />
          {this.state.isOpenPrintModal && (
            <PatientLedgerPrintModal
              handleOk={this.closeModal}
              closeModal={this.closeModal}
              patient_id = {this.state.system_patient_id}
              schedule_date = {formatDateLine(this.state.schedule_date)}
              print_data={this.state.patientInfo}
              modal_type={'emergency_table'}
              table_data = {this.state.table_data}
            />
          )}
        </Card>
      </>
    );
  }
}

DialEmergencyContactBody.propTypes = {
  closeModal: PropTypes.func,
  history: PropTypes.object,
  goOtherPage: PropTypes.func,
  patientInfo: PropTypes.object,
  type: PropTypes.string,  
};
export default DialEmergencyContactBody;
