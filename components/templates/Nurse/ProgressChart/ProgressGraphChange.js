import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Checkbox from "~/components/molecules/Checkbox";
import * as apiClient from "~/api/apiClient";
import {formatTimeIE } from "~/helpers/date";
import $ from "jquery";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  font-size:1rem;
  padding: 1%;
  height: 20rem;
  .check-box {
    label{
      font-size: 1rem !important;
    }
  }
  table {
    margin-bottom:0;
    overflow-x: auto;
    td {
      padding: 0.25rem;
      vertical-align: middle;
    }
    .td-check {
      width: 2.5rem;
      text-align: center;
      label {
        margin-right: 0;
      }
    }
    .td-name {
      text-align: center;
    }
    .td-value {
      width: 6rem;
      input {
        width: 100%;
        ime-mode: inactive;
      }
    }
  }
`;
const ContextMenuUl = styled.div`
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
    line-height: 1.125rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 1rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const ContextMenu = ({visible,x,y,row_index, col_index, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction('insert', row_index, col_index)}>挿入</div></li>
          <li><div onClick={() => parent.contextMenuAction('delete', row_index, col_index)}>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class ProgressGraphChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
          check_array:[
            {id:1, title:'心拍数', line_check: 0, table_check: 0, values:[]},
            {id:2, title:'非観血（収縮期）', line_check: 0, table_check: 0, values:[]},
            {id:3, title:'非観血（拡張期）', line_check: 0, table_check: 0, values:[]},
            {id:4, title:'体温（表皮）', line_check: 0, table_check: 0, values:[]},
            {id:5, title:'呼吸数', line_check: 0, table_check: 0, values:[]},
          ],
          display_check: 0,
          openCreateModal: false,
          origin_display_check: 0,
          alert_messages: '',
          confirm_message: "",
          confirm_alert_title: "",
          confirm_type: "",
      };
        this.max_min_constants = props.max_min_constants;
    }

    async UNSAFE_componentWillMount () {
      await this.getVitalData();
    }
    getVitalData = async () => {
      let path = "/app/api/v2/patients/basic_data/search_vital_data";
      let post_data = {
        system_patient_id: this.props.system_patient_id,
        cur_date: this.props.cur_date
      };      
      await apiClient.post(path, post_data).then(res=>{
        if (res.length > 0) {
          let time_array = [];
          let {check_array} = this.state;
          res.map((item)=>{
            time_array.push(formatTimeIE(item.measure_at));
            check_array[0].values.push(item.pluse);
            check_array[1].values.push(item.min_blood);
            check_array[2].values.push(item.max_blood);
            check_array[3].values.push(item.temperature);
            check_array[4].values.push(item.respiratory);
          });
          this.setState({
            time_array,
            check_array,
            origin_value: JSON.stringify(check_array)
          })
        }
      })
    }
    onHide = () => {};
    getCheck = (index, sub_index, name, value) => {
      if (name == 'check') {
        let {check_array} = this.state;
        check_array[index][sub_index] = value;
        this.setState({check_array});
      }
    };
    getDisplayCheck = (name,value) => {
      if (name == 'check')
      this.setState({display_check:value});
    };
    
    handleClick=(e, index, sub_index)=>{
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
            x: e.clientX - document.getElementById("graph-change-modal").offsetLeft,
            y: e.clientY - document.getElementById("graph-change-modal").offsetTop - 250,
            row_index: index,
            col_index: sub_index
          },
        })
      }
    };
    
    contextMenuAction = (act, row_index, col_index) => {
      if (act == 'insert') {
        this.setState({
          select_row_index: row_index,
          select_col_index: col_index,
        }, () => {
          $("#" + "vital_input_" + this.state.select_row_index + "_" + this.state.select_col_index).focus();
        });
      } else if (act == "delete") {
        let {check_array} = this.state;
        check_array[row_index].values[col_index] = null;
        this.setState({check_array});
      }
    };
    closeModal = () => {
      this.setState({openCreateModal: false});
    };
    createTd = (length) => {
      if (length >= 6) return;
      let td_array = [];
      for (var i = 0; i < 6 - length; i++) {
        td_array.push(<td className="td-value">&nbsp;</td>);
      }
      return td_array;
    };
    getChangeValue = (e) => {
      var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
      if (e.target.value != "" && !RegExp.test(e.target.value)) {
        return;
      }
      let {check_array, select_col_index, select_row_index} = this.state;
      if (select_col_index !== undefined && select_row_index !== undefined) {
        if (check_array[select_row_index] !== undefined && check_array[select_row_index].values !== undefined)
          check_array[select_row_index].values[select_col_index] = e.target.value;
      }
      this.setState({check_array});
    };
    onBlurValue = () => {
      let err_str = this.validate();
      if (err_str != '') {
        this.setState({alert_messages: err_str});
        this.modalBlack();
        return;
      }
      this.setState({
        select_col_index: undefined,
        select_row_index: undefined,
      });
    };
    closeSystemAlertModal () {
      this.modalBlackBack();
      this.setState({
        alert_messages: '',
      }, ()=>{
        if (this.state.select_col_index !== undefined && this.state.select_row_index !== undefined) {
          $("#" + "vital_input_" + this.state.select_row_index + "_" + this.state.select_col_index).focus();
        }
      });
    }
    validate = () => {
      let {check_array, select_col_index, select_row_index} = this.state;
      var max_min_constants = this.max_min_constants;
      let select_data = check_array[select_row_index];
      if (select_data !== undefined) {
        let check_value = select_data.values[select_col_index];
        if (select_data.title === "心拍数" && check_value > max_min_constants.pulse_max_limit) {
          return '心拍数を'+max_min_constants.pulse_max_limit+'以下で登録してください。';
        }
        if (select_data.title === "心拍数" && check_value < max_min_constants.pulse_min_limit) {
          return '心拍数を'+max_min_constants.pulse_min_limit+'以上で登録してください。';
        }
        if (select_data.title === "非観血（収縮期）" && check_value > max_min_constants.low_blood_max_limit) {
          return '非観血（収縮期）を'+max_min_constants.low_blood_max_limit+'以下で登録してください。';
        }
        if (select_data.title === "非観血（収縮期）" && check_value < max_min_constants.low_blood_min_limit) {
          return '非観血（収縮期）を'+max_min_constants.low_blood_min_limit+'以上で登録してください。';
        }
        if (select_data.title === "非観血（拡張期）" && check_value > max_min_constants.high_blood_max_limit) {
          return '非観血（拡張期）を'+max_min_constants.high_blood_max_limit+'以下で登録してください。';
        }
        if (select_data.title === "非観血（拡張期）" && check_value < max_min_constants.high_blood_min_limit) {
          return '非観血（拡張期）を'+max_min_constants.high_blood_min_limit+'以上で登録してください。';
        }
        if (select_data.title === "体温（表皮）" && check_value > max_min_constants.temperature_max_limit) {
          return '体温（表皮）を'+max_min_constants.temperature_max_limit+'以下で登録してください。';
        }
        if (select_data.title === "体温（表皮）" && check_value < max_min_constants.temperature_min_limit) {
          return '体温（表皮）を'+max_min_constants.temperature_min_limit+'以上で登録してください。';
        }
        if (select_data.title === "呼吸数" && check_value > max_min_constants.respiratory_max_limit) {
          return '呼吸数を'+max_min_constants.respiratory_max_limit+'以下で登録してください。';
        }
        if (select_data.title === "呼吸数" && check_value < max_min_constants.respiratory_min_limit) {
          return '呼吸数を'+max_min_constants.respiratory_min_limit+'以上で登録してください。';
        }
      }
      return "";
    }
    modalBlack() {
      var base_modal = document.getElementsByClassName("graph-change-modal")[0];
      if (base_modal !== undefined && base_modal != null)
        base_modal.style["z-index"] = 1040;
    }
    modalBlackBack() {
      var base_modal = document.getElementsByClassName("graph-change-modal")[0];
      if (base_modal !== undefined && base_modal != null)
        base_modal.style["z-index"] = 1050;
    }
    handleOk = () => {
      let change_value = JSON.stringify(this.state.check_array);
      if (this.state.origin_value === change_value && this.state.origin_display_check === this.state.display_check){
        return;
      }
      this.props.handleOk(this.state.check_array, this.state.display_check);
    };
    mainCloseModal = () => {
      let change_value = JSON.stringify(this.state.check_array);
      if (this.state.origin_value === change_value && this.state.origin_display_check === this.state.display_check){
        this.props.closeModal();
        return;
      }
      this.setState({
        confirm_message: "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type: "close",
        confirm_alert_title:'入力中',
      });
    };
    confirmCancel() {
      this.setState({
        confirm_message: "",
        confirm_alert_title: ""
      });
    }
    confirmOk = () => {
      this.confirmCancel();
      if (this.state.confirm_type === "close") this.props.closeModal();
    };
    
    render() {
      let {check_array, time_array, select_row_index, select_col_index} = this.state;
      let disabled = this.state.origin_value === JSON.stringify(this.state.check_array) && this.state.origin_display_check === this.state.display_check;
      return (
        <>
          <Modal show={true} className="validate-alert-modal graph-change-modal" id='graph-change-modal' onHide={this.onHide}>
            <Modal.Header><Modal.Title>グラフデータ修正</Modal.Title></Modal.Header>
            <Modal.Body>
              <Wrapper>
                <div className="mt-3 mb-3 check-box">
                  <Checkbox
                    label='グラフチェックボックスがついている項目のみ表示'
                    id={`display_check`}
                    getRadio={this.getDisplayCheck.bind(this)}
                    value={this.state.display_check}
                    name="check"
                  /></div>
                <div className="w-100">
                  <table className="table-scroll table table-bordered" id="code-table">
                    <tr>
                      <td className="td-check" style={{background:"lightgray"}}>線</td>
                      <td className="td-check" style={{background:"lightgray"}}>表</td>
                      <td className="td-name" style={{background:"lightgray"}}>測定時刻</td>
                      {time_array !== undefined && time_array.length > 0 && time_array.map((item,index)=>{
                        return (
                          <td key={index} className='text-center td-value'>{item}</td>
                        )
                      })}
                      {this.createTd(time_array !== undefined ? time_array.length : 0)}
                    </tr>
                    {check_array !== undefined && check_array.length > 0 && check_array.map((item,index)=>{
                      return (
                        <tr key={index}>
                          <td className="td-check">
                            <Checkbox
                              label=''
                              id={`line_check_${index}`}
                              getRadio={this.getCheck.bind(this,index, 'line_check')}
                              value={item.line_check}
                              name="check"
                            />
                          </td>
                          <td className="td-check">
                            <Checkbox
                              label=''
                              id={`table_check_${index}`}
                              getRadio={this.getCheck.bind(this,index, 'table_check')}
                              value={item.table_check}
                              name="check"
                            />
                          </td>
                          <td className="td-name" style={{background:"lightgray"}}>{item.title}</td>
                          {item.values !== undefined && item.values.length > 0 && item.values.map((sub_item, sub_index)=>{
                            return (<>
                              {select_row_index === index && select_col_index === sub_index ? (
                                <td className="td-value text-right p-0">
                                  <input id={`vital_input_${select_row_index}_${select_col_index}`} type="text" value={sub_item} onBlur={this.onBlurValue.bind(this)} onChange={this.getChangeValue.bind(this)}/>
                                </td>
                              ):(
                                <td className="td-value text-right" onContextMenu={e => this.handleClick(e, index, sub_index)}>{sub_item != null ? sub_item : ''}</td>
                              )}
                            </>)
                          })}
                          {this.createTd(time_array !== undefined ? time_array.length : 0)}
                        </tr>
                      )
                    })}
                  </table>
                </div>
              </Wrapper>
            </Modal.Body>
            <Modal.Footer>
              <div className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}} onClick={this.mainCloseModal}><span>キャンセル</span></div>
              <div className={`custom-modal-btn ${disabled ? "disable-btn":"red-btn"}`} style={{cursor:"pointer"}} onClick={this.handleOk}><span>確定</span></div>
            </Modal.Footer>
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
            />
            {this.state.alert_messages !== "" && (
              <AlertNoFocusModal
                hideModal= {this.closeSystemAlertModal.bind(this)}
                handleOk= {this.closeSystemAlertModal.bind(this)}
                showMedicineContent= {this.state.alert_messages}
              />
            )}
            {this.state.confirm_message !== "" && this.state.confirm_type === "close" && (
              <ConfirmNoFocusModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmOk}
                confirmTitle= {this.state.confirm_message}
                title = {this.state.confirm_alert_title}
              />
            )}
          </Modal>
        </>
      );
    }
}

ProgressGraphChange.contextType = Context;
ProgressGraphChange.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  system_patient_id: PropTypes.number,
  cur_date: PropTypes.string,
  max_min_constants: PropTypes.array,
};

export default ProgressGraphChange;