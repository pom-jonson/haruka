import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import * as apiClient from "~/api/apiClient";

const Wrapper = styled.div`
  height: 10rem;
  font-size: 2rem;
`;
const DoubleModal = styled.div`
  font-family: NotoSansJP;
  line-height: 1.33;
  letter-spacing: 0.4px;
  padding: 4px 4px 4px 0;
  margin: 0;
  display: flex;
  height: 50vh;
  width: 100%;
  overflow-y: auto;

  .left-area {
    width: 60%;
    height: 100%;
  }
  .right-area {
    height: 100%;
    width: 40%;
  }
  label {
    width: 20%;
    font-size: 0.875rem;
  }
  .border-div {
    border: solid 1px lightgrey;
    width: 65%;
    border-radius: 4px;
    cursor: pointer;
    padding: 0.25rem;
  }
`;

class InspectionItemSelectModal extends Component {
  constructor(props) {
    super(props);
    this.btns = [];
    this.flag = 1;
    this.state = {
      calculation_items: {},
      isUpdateConfirmModal: false,
      openItemSelectModal: false,
      confirm_message: "",
      right_content: [],
      isOpenConfirmModal: false,
      calc_show_modal: false,
      calculation: '',
      change_flag: 0,
    };
  }

  async componentDidMount() {
    let path =
      "/app/api/v2/dial/medicine_information/examination_calculation_master";
    let master_data = await apiClient.post(path, {});
    let inspections = {};
    let calculation_master = master_data.examination_calculation_master;
    let examination_master = master_data.examination_master;
    if (calculation_master != null && calculation_master.length > 0) {
      calculation_master.map((item) => {
        if (item.calc_name == "URR" || item.calc_name == "TSAT" || item.calc_name == "TIBC"){
          item.is_selected = 1;
          inspections[item.examination_code] = item;
        }
      });
    }

    let { calculation_items } = this.state;
    let { right_content } = this.state;
    if (
      Object.keys(inspections).length > 0 && calculation_master != null &&
      calculation_master.length > 0
    ) {
      Object.keys(inspections).map((index) => {
        let calc_data = calculation_master.find((x) => x.examination_code == index);
        if (calc_data != undefined && calc_data != null) {
          if (calc_data.calc_name == "URR") {
            calculation_items[index] = calc_data;
            right_content.push(calculation_master.find((x) => x.examination_code == 12));
          } else if (calc_data.calc_name == "TSAT") {
            calculation_items[index] = calc_data;
            right_content.push(calculation_master.find((x) => x.examination_code == 54700));
            right_content.push(calculation_master.find((x) => x.examination_code == 21));
          } else if (calc_data.calc_name == "TIBC") {
            calculation_items[index] = calc_data;
            right_content.push(calculation_master.find((x) => x.examination_code == 99002));
          }
        }
      });
    }
    if (right_content.length > 0) {
      right_content.map(item=>{
        item.is_selected = 1;
      })
    }
    this.setState({
      inspections,
      examination_master,
      calculation_master,
      calculation_items,
      right_content,
    });
  }
  getRadio = (number, name, value) => {
    if (name === "check") {
      let { inspections} = this.state;
      let right_content = JSON.parse(JSON.stringify(this.state.right_content));
      inspections[number].is_selected = value;
      // calculation_items[number].is_selected = value;
      if (inspections[number].calc_name == "URR") {
        let find_index = right_content.findIndex(x=>x.examination_code == 12);
        if (find_index >= 0 && right_content[find_index].is_selected != value) {
          right_content[find_index].is_selected = value;
        }
      } else if (inspections[number].calc_name == "TSAT") {
        let find_index = right_content.findIndex(x=>x.examination_code == 54700);
        if (find_index >= 0 && right_content[find_index].is_selected != value) {
          let tibc_inspection = undefined;
          Object.keys(inspections).map(index=>{
            if (inspections[index].calc_name == "TIBC") {
              tibc_inspection = inspections[index];
            }
          });
          if (tibc_inspection != undefined && tibc_inspection.is_selected == 1) {
            right_content[find_index].is_selected = 1;
          } else {
            right_content[find_index].is_selected = value;
          }
        }
        find_index = right_content.findIndex(x=>x.examination_code == 21);
        if (find_index >= 0 && right_content[find_index].is_selected != value) {
          right_content[find_index].is_selected = value;
        }
      } else if (inspections[number].calc_name == "TIBC") {
        let find_index = right_content.findIndex(x=>x.examination_code == 54700);
        if (find_index >= 0 && right_content[find_index].is_selected != value) {
          let tast_inspection = undefined;
          Object.keys(inspections).map(index=>{
            if (inspections[index].calc_name == "TSAT") {
              tast_inspection = inspections[index];
            }
          });
          if (tast_inspection != undefined && tast_inspection.is_selected == 1) {
            right_content[find_index].is_selected = 1;
          } else {
            right_content[find_index].is_selected = value;
          }
        }
        find_index = right_content.findIndex(x=>x.examination_code == 99002);
        if (find_index >= 0 && right_content[find_index].is_selected != value) {
          right_content[find_index].is_selected = value;
        }
      }
      this.setState({ inspections, right_content });
    }
  };
  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  openInspectionItem = (index, from="") => {
    if(from == 'right') {
      this.setState({
        selected_right_index: index,
        openItemSelectModal: true,
      })
      return;
    }
    this.setState({
      selected_index: index,
      openItemSelectModal: true,
    });
  };

  handleOk = () => {
    if (!this.validate()) {
      window.sessionStorage.setItem(
        "alert_messages",
        "検査項目コードを設定してください。"
      );
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: "登録しますか？",
    });
  };
  validate = () => {
    let {inspections} = this.state;
    if (inspections == undefined || inspections == null) return false;
    if (Object.keys(inspections).length == 0) return false;
    let ret_value = false;
    Object.keys(inspections).map(index=>{
      if (inspections[index].is_selected == 1) ret_value = true;
    });
    return ret_value;
  }
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isOpenConfirmModal: false,
      confirm_message: "",
    });
  }

  saveData = async () => {
    let { calculation_items } = this.state;
    Object.keys(calculation_items).map((index) => {
      if (this.state.inspections[index].is_selected != 1) {
        delete calculation_items[index];
      }
    });
    let path =
      "/app/api/v2/dial/medicine_information/examination_calculation/register_calculation_item";
    await apiClient.post(path, {params: calculation_items}).then(res=>{
      if (res) {
        window.sessionStorage.setItem("alert_messages", res.alert_message);
        this.props.handleOk(calculation_items);
      }
    })
  };

  closeModal = () => {
    this.setState({
      openItemSelectModal: false,
      calc_show_modal: false,
      selected_right_content: undefined
    });
  };
  selectMaster = (item) => {
    if (this.state.selected_right_index != undefined) {
      let {right_content, selected_right_index} = this.state;
      right_content[selected_right_index].code = item.code;
      right_content[selected_right_index].examination_code = item.code;
      right_content[selected_right_index].calc_name = item.name;
      right_content[selected_right_index].name = item.name;
      right_content[selected_right_index].master_number = item.number;
      right_content[selected_right_index].name_kana = item.name_kana;
      right_content[selected_right_index].name_short = item.name_short;
      this.setState({right_content});
    } else {
      let { calculation_items } = this.state;
      calculation_items[this.state.selected_index] = item;
      this.setState({ calculation_items });
    }
    this.closeModal();
  };

  handleClose = () => {
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        confirm_message: "登録していない内容があります。変更内容を破棄して閉じますか？",
      });
      return;
    }
    this.props.closeModal();
  }  

  confirmCloseOk = () => {
    this.setState({
      isOpenConfirmModal: false,
      confirm_message: ""
    },()=>{
      this.props.closeModal();
    });
  }
  openCalculationModal = (item) => {
    if (item.calc_name == undefined) return;
    let {calculation} = this.state;
    if (item.calc_name == "URR") {
      calculation = "((透析前BUN - 透析後BUN) / 透析前BUN ) * 100";
    } else if (item.calc_name == "TSAT") {
      calculation = "(s-Fe / TIBC) * 100";
    } else if (item.calc_name == "TIBC") {
      calculation = "s-Fe + UIBC";
    }
    this.setState({
      calc_show_modal: true,
      calculation
    })
  }


  render() {
    let { right_content, inspections, calculation_items } = this.state;
    let can_save = this.validate();
    return (
      <>
      <Modal show={true} id="system_alert_dlg" className="master-modal width-70vw-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>検査データ計算 項目設定</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DoubleModal>
            <div className="left-area">
              <div className={`d-flex w-100`}>
                <div className="title">検査項目コード設定</div>
              </div>
              {inspections != undefined && Object.keys(inspections).length > 0 &&
                Object.keys(inspections).map((index) => {
                  let item = inspections[index];
                  return (
                    <div key={item} className="d-flex mt-1">
                      <Checkbox
                        label={item.name}
                        getRadio={this.getRadio.bind(this, index)}
                        value={item.is_selected == 1}
                        name="check"
                      />
                      <div
                        className="border-div mr-1"
                        onClick={this.openInspectionItem.bind(this, index)}
                      >
                        {calculation_items[index] != null
                          ? calculation_items[index].code + "：" + calculation_items[index].name
                          : ""}
                      </div>
                      <button onClick={this.openCalculationModal.bind(this, item)}>計算式</button>
                    </div>
                  );
                })}
            </div>
            <div className={`right-area`}>
              <div className="title">計算に必要な項目</div>
              {right_content.map((sub_item, sub_index)=>{
                return (
                  <>
                    {sub_item.is_selected == 1 && (
                      <div className="d-flex w-100">
                        <div className="w-25">{sub_item.calc_name}</div>
                      <div className="border-div w-75 mr-1 ml-1 mb-1" key={sub_item} onClick={this.openInspectionItem.bind(this, sub_index, "right")}>
                        {sub_item.name_short != undefined &&
                        sub_item.code != undefined
                          ? sub_item.code + "：" + sub_item.name_short
                          : ""}
                      </div>
                        </div>
                    )}
                  </>
                );
              })}
            </div>
          </DoubleModal>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.handleClose}>キャンセル</Button>
            <Button className={can_save ? "red-btn": "disable-btn"} onClick={this.handleOk}>登録</Button>
        </Modal.Footer>
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.saveData.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isOpenConfirmModal !== false &&  (
            <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmCloseOk}
                confirmTitle= {this.state.confirm_message}
            />
          )}
        {this.state.examination_master != null &&
          this.state.openItemSelectModal !== false && (
            <DialSelectMasterModal
              selectMaster={this.selectMaster}
              closeModal={this.closeModal}
              MasterCodeData={this.state.examination_master}
              MasterName="検査項目"
            />
          )}
      </Modal>
      <Modal show={this.state.calc_show_modal} className="master-modal validate-alert-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>計算式</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={`mt-5 text-center w-100`}>{this.state.calculation}</div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>閉じる</Button>
        </Modal.Footer>
      </Modal>
    </>
    );
  }
}
InspectionItemSelectModal.propTypes = {
  hideConfirm: PropTypes.func,
  handleOk: PropTypes.func,
  closeModal: PropTypes.func,
  modal_data: PropTypes.array,
};

export default InspectionItemSelectModal;