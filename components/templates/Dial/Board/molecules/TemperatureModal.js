import React, { Component, useContext } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Spinner from "react-bootstrap/Spinner";
import {formatTimeIE, formatDateTimeIE} from "../../../../../helpers/date";
import TemperatureEditModal from "./TemperatureEditModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as apiClient from "~/api/apiClient";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 400px;
  overflow-y: auto;
  flex-direction: column;
  display: flex;
  text-align: center;
  .footer {
    display: flex;
    margin-top: 10px;
    margin-left: 40%;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      margin-left: 10px;
      background: rgb(105, 200, 225); 
      border: none;
    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
    }
   }
.no-result {
      padding: 120px;
      text-align: center;

      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
table {
    margin-bottom:0px;
    thead{
        display: table;
        width:100%;
    }
    tbody{
        height: 285px;  
        overflow-y:auto;
        display:block;
    }
    tr{
        display: table;
        width: 100%;
        box-sizing: border-box;
    }    
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
    td {
        font-size: 16px;
        padding: 0.25rem;
    }
    th {
        font-size: 16px;
        position: sticky;
        text-align: center;
        padding: 0.3rem;
    } 
    .item-no {
        width: 30px;
    }
  }
 `;

const ContextMenuUl = styled.ul`
      margin-bottom:0;
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
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 33vw;
  display: table-caption;
  position: absolute;
  top: 230px;
`;
const ContextMenu = ({ visible, x,  y,  parent,  row_index,}) => {
    if (visible) {
        const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    {$canDoAction(FEATURES.DIAL_SYSTEM, AUTHS.EDIT) && (
                        <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
                    )}
                    {$canDoAction(FEATURES.DIAL_SYSTEM, AUTHS.DELETE) && (
                    <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>
                    )}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};
class   TemperatureModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: this.props.rows_temp,
            is_loaded: false,
            isOpenModal: false,
            isDeleteConfirmModal: false,
            confirm_message: "",
        }
        this.double_click = false;
    }
    componentDidMount () {
        this.setState({is_loaded: true})
    }

    inputValue = (index) => {
        this.setState({
            isOpenModal: true,
            modal_data: this.state.rows[index],
            table_index: index,
        });
    };
    getData = async () => {
        let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
        if(patientInfo.system_patient_id == undefined){
            return;
        }
        let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
        if(schedule_data.number == undefined){
            return;
        }
        let path = "/app/api/v2/dial/board/get_request_data";
        const post_data = {
            schedule_id:schedule_data.number,
            system_patient_id:patientInfo.system_patient_id,
        };
        let data = await apiClient.post(path, {params: post_data});
        let rows_temp = data.rows_temp;
        this.setState({rows: rows_temp});
    };
    closeModal = () => {
        this.setState({isOpenModal: false})
    };

    handleClick = (e, index) => {
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
                .getElementById("temperature-table")
                .addEventListener("scroll", function onScrollOutside() {
                    that.setState({
                        contextMenu: { visible: false }
                    });
                    document
                        .getElementById("temperature-table")
                        .removeEventListener(`scroll`, onScrollOutside);
                });
            this.setState({
                contextMenu: {
                    visible: true,
                    x: e.clientX - document.getElementById("temperature_dlg").offsetLeft,
                    y: e.clientY + window.pageYOffset - document.getElementById("temperature_dlg").offsetTop -  document.getElementsByClassName("modal-content")[0].offsetTop - 150,
                },
                row_index: index
            });
        }
    };

    contextMenuAction = (index, type) => {
        if (type === "edit"){
            this.setState({
                selected_index:index
            })
            this.editData(index);
        }
        if (type === "delete"){
            this.setState({selected_number:this.state.rows[index].number}, () => {
                this.delete(this.state.rows[index].temperature);
            })
        }
    };

    delete = (name) => {
        this.setState({
            isDeleteConfirmModal : true,
            confirm_message: " 削除しますか？",
            deleted_name: name
        });
    };

    editData = (index) => {
        let modal_data = this.state.rows[index];
        this.setState({
            modal_data,
            isOpenModal: true
        });
    };

    deleteData = async () => {
        let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
        if(schedule_data.number == undefined){
            return;
        }
        let row_data = this.state.rows;
        let del_data = row_data.filter(item=>{
            if (item.number != this.state.selected_number)
                return item;
        });
        let path = "/app/api/v2/dial/board/register_handle_data";
        const post_data = {
            params: {
                temperature_data: row_data,
                del_number:this.state.selected_number,
            }
        };
        if (this.double_click == true) return;
        this.double_click = true;
        await apiClient.post(path, post_data).then((res) => {
            window.sessionStorage.setItem("alert_messages", "削除完了##" + res.alert_message);
            this.props.setHandleTempData(del_data);
            this.setState({
                rows:del_data
            });
            this.confirmCancel();
        }).finally(()=>{
            this.double_click=false;
        });
    };

    confirmCancel() {
        this.setState({
            isDeleteConfirmModal: false,
            confirm_message: "",
        });
    }
    handleOk = () => {
        this.props.handleOk(this.state.rows);
    };

    updateTemperature = async (data) =>{
        this.closeModal();
        let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
        if(schedule_data.number == undefined){
            return;
        }
        let row_data = this.state.rows;
        row_data[this.state.selected_index] = data;

        let path = "/app/api/v2/dial/board/register_handle_data";
        const post_data = {
            params: {
                temperature_data: data,
                schedule_id: schedule_data.number,
                is_update:1,
            }
        };
        await apiClient.post(path, post_data).then((res) => {
            window.sessionStorage.setItem("alert_messages","変更完了##" +  res.alert_message);
            this.props.setHandleTempData(row_data);
            this.setState({
                isOpenModal: false,
                rows: row_data
            });
        });
    }

    onHide=()=>{}

    render() {
        const { closeModal } = this.props;
        let list_item = this.state.rows;
        let message;
        if (list_item == null || list_item.length ==0) {
            message = <div className="no-result"><span>体温データがありません</span></div>;
        }
        return  (
            <Modal show={true} onHide={this.onHide} id="temperature_dlg"  className="master-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title style={{fontSize: "25px"}}>体温一覧</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                            <table className="table-scroll table table-bordered " id="temperature-table">
                                <thead>
                                <tr>
                                    <th className={`item-no`}/>
                                    <th style={{width:'150px'}}>入力時間</th>
                                    <th style={{width:'75px'}}>体温</th>
                                    <th>スタッフ</th>
                                </tr>
                                </thead>
                                {this.state.is_loaded ? (
                                    <>
                                        <tbody>
                                        {list_item !== undefined && list_item !== null && list_item.length > 0 ? (
                                            list_item.map((item, index) => {
                                                return (
                                                    <>
                                                        <tr onContextMenu={e => this.handleClick(e, index)}>
                                                            <td className={`item-no`}>{index + 1}</td>
                                                            <td style={{width:'150px'}} className="text-center">{formatTimeIE(formatDateTimeIE(item.input_time))}</td>
                                                            <td style={{width:'75px'}} className="text-center">{parseFloat(item.temperature).toFixed(1)}</td>
                                                            <td className="text-center">{item.staff}</td>
                                                        </tr>
                                                    </>)
                                            })
                                        ): (
                                            <tr>
                                                <td colSpan={4}>
                                                    {message}
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </>
                                ): (
                                    <div className='text-center'>
                                        <SpinnerWrapper>
                                            <Spinner animation="border" variant="secondary" />
                                        </SpinnerWrapper>
                                    </div>
                                )}
                            </table>
                        {this.state.isOpenModal && (
                            <TemperatureEditModal
                                title="体温編集"
                                closeModal={this.closeModal}
                                handleModal={this.updateTemperature}
                                modal_data={this.state.modal_data}
                                start_time = {this.props.start_time}
                            />
                        )}
                        {this.state.isDeleteConfirmModal !== false && (
                            <SystemConfirmJapanModal
                                hideConfirm= {this.confirmCancel.bind(this)}
                                confirmCancel= {this.confirmCancel.bind(this)}
                                confirmOk= {this.deleteData.bind(this)}
                                confirmTitle= {this.state.confirm_message}
                            />
                        )}
                    </Wrapper>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel-btn" onClick={closeModal}>閉じる</Button>
                </Modal.Footer>
                <ContextMenu
                    {...this.state.contextMenu}
                    parent={this}
                    row_index={this.state.row_index}
                />
            </Modal>
        );
    }
}

TemperatureModal.contextType = Context;

TemperatureModal.propTypes = {
    closeModal: PropTypes.func,
    setHandleTempData: PropTypes.func,
    handleOk: PropTypes.func,
    rows_temp: PropTypes.array,
    schedule_data:PropTypes.object,
    start_time : PropTypes.object,
};

export default   TemperatureModal;
