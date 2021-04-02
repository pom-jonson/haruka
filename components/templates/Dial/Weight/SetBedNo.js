import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import { formatDateLine } from "~/helpers/date";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Wrapper = styled.div`
  .content {
    height: 160px;
    .label-title {
      margin-right: 10px;
      text-align: right;
      font-size: 16px;
    }
    label {
      width: 50%;
      select {
        width: 100%;
      }
    }

    .pullbox {
      margin-top: 30px;
    }
  }
  .footer {
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 20px;
    }
    span {
      color: white;
      font-size: 16px;
      font-weight: 100;
    }
  }
  .no-padding {
    padding: 0;
  }
  td label {
    display: none;
  }
`;

class SetBedNo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bed_nos: [],
      consoles: [],
      bed_no: this.props.bed_no,
      console: this.props.console,
      confirm_message:"",
      confirm_alert_title:'',
    };
    this.change_flag = 0;
  }
  async UNSAFE_componentWillMount() {
    let path = "/app/api/v2/dial/pattern/getDialConditionInfo";
    let post_data = {};
    let { data } = await axios.post(path, { params: post_data });
    this.setState({
      bed_nos: data[0],
      consoles: data[1],
    });
  }

  getValue = (key, e) => {
    let default_console = null;
    this.change_flag = 1;
    switch (key) {
      case "bed_no":
        this.state.bed_nos.map((item) => {
          if (e.target.id == item.id) {
            default_console = item.console;
          }
        });
        if (
          default_console != null &&
          default_console != undefined &&
          default_console != ""
        ) {
          this.setState({
            bed_no: parseInt(e.target.id),
            console: parseInt(default_console),
          });
        } else {
          this.setState({
            bed_no: parseInt(e.target.id),
            console: 100, // 未設定
          });
        }
        break;
      case "console":
        this.setState({
          console: parseInt(e.target.id),
        });
        break;
    }
  };

  confirmSetBed=()=>{
    if(this.change_flag == 0){
      return;
    }
    this.setState({
      confirm_message:"登録しますか？",
      confrim_type:"set_bed"
    });
  }

  setBedNo = () => {
    let path = "/app/api/v2/dial/patient/changeBedInfo";
    let post_data = {
      schedule_number: this.props.schedule_number,
      to_bedId: this.state.bed_no,
      console: this.state.console,
      cur_date: formatDateLine(this.props.cur_date),
      type: "weight",
    };
    apiClient
      .post(path, {
        params: post_data,
      })
      .then(() => {
        this.props.closeModal();
      })
      .catch(() => {
        this.confirmCancel();
      });
  };

  closeModal = () => {
    if(this.change_flag == 1){
       this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confrim_type:"close",
        confirm_alert_title:'入力中',
       }); 
    } else {
      this.props.closeModal();
    }
  };

  goBedTable = () => {
    if(this.change_flag == 1){
      this.setState({
       confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
       confrim_type:"go_bed_table",
       confirm_alert_title:'入力中',
      }); 
   } else {
    this.props.goBedTable();
   }
  };

  confirmOk=()=>{
    if(this.state.confrim_type == "close"){
      this.props.closeModal();
    }
    if(this.state.confrim_type == "go_bed_table"){
      this.props.goBedTable();
    }
    if(this.state.confrim_type == "set_bed"){
      this.setBedNo();
    }
  }

  confirmCancel=()=>{
    this.setState({
      confirm_message:"",
      confrim_type:"",
      confirm_alert_title:'',
     }); 
  }

  onHide = () => {};

  render() {
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>ベッドNo設定</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="content">
              {this.state.bed_nos != null &&
                this.state.bed_nos != undefined &&
                this.state.bed_nos.length > 0 && (
                  <SelectorWithLabel
                    options={this.state.bed_nos}
                    title="ベッドNo"
                    getSelect={this.getValue.bind(this, "bed_no")}
                    departmentEditCode={this.state.bed_no}
                  />
                )}
              {this.state.consoles != null &&
                this.state.consoles != undefined &&
                this.state.consoles.length > 0 && (
                  <SelectorWithLabel
                    options={this.state.consoles}
                    title="コンソール"
                    getSelect={this.getValue.bind(this, "console")}
                    departmentEditCode={this.state.console}
                  />
                )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
            <Button className="red-btn" onClick={this.goBedTable.bind(this)}>
              ベッド配置表に移動
            </Button>
          <Button className="cancel-btn" onClick={this.closeModal}>
            キャンセル
          </Button>
            <Button className={this.change_flag == 0 ? 'disable-btn' : "red-btn"} onClick={this.confirmSetBed.bind(this)}>設定</Button>
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmOk}
                confirmTitle= {this.state.confirm_message}
                title = {this.state.confirm_alert_title}
            />
        )}
      </Modal>
    );
  }
}

SetBedNo.contextType = Context;

SetBedNo.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  goBedTable: PropTypes.func,
  schedule_number: PropTypes.number,
  bed_no: PropTypes.number,
  console: PropTypes.number,
  cur_date: PropTypes.string,
  history: PropTypes.object,
};

export default SetBedNo;
