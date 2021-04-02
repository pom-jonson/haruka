import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import * as methods from "../DialMethods";
import Checkbox from "../../../molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import axios from "axios";
import { KEY_CODES } from "../../../../helpers/constants";
import $ from "jquery";
import CalcDial from "~/components/molecules/CalcDial";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 12rem;
  flex-direction: column;
  display: flex;
  text-align: center;
  .form-control {
    width: 216px;
    font-size: 1rem;
  }
  .pullbox-title,
  .label-title {
    font-size: 1rem;
    text-align: right;
    margin-right: 0.4rem;
    width: 9rem;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 2.37rem;
  }
  .label-unit {
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 2.37rem;
  }
  .pullbox-select {
    width: 20rem;
    font-size: 1rem;
    height: 2.37rem;
  }
  .days-numeric {
    input {
      height: 2.37rem;
      ime-mode: inactive;
    }
  }
  .checkbox-div {
    label {
      margin-left: 9.5rem;
      font-size: 1rem;
      margin-top: 7px;
    }
  }
`;
const SpinnerWrapper = styled.div`
  height: 12rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const sortations = ["内服", "頓服", "外用", "処置", "麻酔", "インスリン"];
class SelectUsageModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.onKeyPressed = this.onKeyPressed.bind(this);
    let modal_data = this.props.modal_data;
    this.state = {
      days: modal_data != null ? modal_data.days : "",
      usage_name: modal_data != null ? modal_data.usage_name : "",
      usage_code: modal_data != null ? modal_data.usage_code : "",
      disable_days_dosing:
        modal_data != null ? modal_data.disable_days_dosing : 0,
      prescription_category:
        modal_data != null ? modal_data.prescription_category : "",
      alert_messages: "",
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      isOpenCalcModal: false,
      calcUnit: "",
      calcTitle: "",
      confirm_alert_title:'',
      is_loaded: false
    };
    this.origin_usage = null;
    this.btns = [];
    this.flag = 0;
    this.focused = "";
    this.original = '';
    this.change_flag = 0;
  }
  register = () => {
    if (this.state.usage_name === "") {
      this.focused = "usage";
      return;
    }
    if (this.state.days === "" && this.state.disable_days_dosing === 0) {
      return;
    }
    if (this.state.days !== "" && isNaN(parseFloat(this.state.days))) {
      this.focused = "numeric";
      return;
    }
    if (this.change_flag == 0) {
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: "登録しますか？",
    });
    var base_modal = document.getElementsByClassName("staff-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
    var edit_prescript_modal = document.getElementsByClassName(
      "edit-prescript-modal"
    )[0];
    if (edit_prescript_modal !== undefined && edit_prescript_modal != null)
      edit_prescript_modal.style["z-index"] = 1040;
  };

  

  async componentDidMount() {
    let prescription_category = "";
    if (
      this.props.medicine_kind !== undefined &&
      this.props.medicine_kind != null &&
      this.props.medicine_kind !== ""
    ) {
      prescription_category = sortations[this.props.medicine_kind];
    } else {
      prescription_category = this.state.prescription_category;
    }
    let path = "/app/api/v2/dial/master/usage_search";
    let post_data = {
      category: prescription_category,
      order:'sort_number'
    };
    let { data } = await axios.post(path, { params: post_data });
    let usage_codes = [{ id: 0, value: "" }];
    let origin_usage = [];
    let usage_group_codes = [{ id: 0, value: "" }];
    if (data.usage_data != null && data.usage_data.length > 0) {
      data.usage_data.map((item) => {
        let code = {};
        code.id = item.code;
        code.value = item.name;
        code.usage_group_code = item.usage_group_code;
        usage_codes.push(code);
        origin_usage.push(code);
      });
    }
    if (data.usage_group_data != null && data.usage_group_data.length > 0) {
      data.usage_group_data.map((item) => {
        let code = {};
        code.id = item.code;
        code.value = item.name;
        if (
          data.usage_data != null &&
          data.usage_data.findIndex((x) => x.usage_group_code == item.code) > -1
        )
          usage_group_codes.push(code);
      });
    }
    this.setState(
      {
        usage_codes,
        usage_group_codes,
        is_loaded: true
      },
      () => {
        this.original = JSON.stringify(this.state);
      }
    );
    this.origin_usage = origin_usage;
    $(".usage-group-select select").focus();
    this.focused = "usage_group";
  }

  selectType = (e) => {
    var usage_code = e.target.id;
    var usage_name = e.target.value;
    this.setState({
      usage_name,
      usage_code,
    });
    this.change_flag = 1;
  };

  selectGroup = (e) => {
    let usage_codes = JSON.parse(JSON.stringify(this.origin_usage));
    let filtered_codes = [];
    if (e.target.id > 0) {
      filtered_codes = usage_codes.filter(
        (x) => x.usage_group_code == e.target.id
      );
    } else {
      filtered_codes = usage_codes;
    }
    filtered_codes.unshift({ id: 0, value: "" });
    this.setState({
      usage_codes: filtered_codes,
      usage_code_group: e.target.id,
      usage_code: null,
      usage_name: '',
    });
    this.change_flag = 1;
  };

  onChange = (value) => {
    if (value == null || value == '') {
      this.setState({days: ''});
      this.change_flag = 1;
      return;
    }
    if (value != null && value != '' && value.toString().length > 4) return;
    this.setState({ days: value });
    this.change_flag = 1;
  };

  disableDaysDoing = (name, value) => {
    if (name === "disable")
      this.setState({
        disable_days_dosing: value,
      });
    this.change_flag = 1;
  };

  onHide = () => {};

  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (
        document.getElementById("system_alert_dlg") !== undefined &&
        document.getElementById("system_alert_dlg") != null
      ) {
        this.setState({ alert_messages: "" });
        if (this.focused == "numeric") {
          $(".days-numeric input").focus();
        } else if (this.focused == "usage") {
          $(".usage-select select").focus();
        }
        return;
      }
      if (this.focused === "usage_group") {
        $(".usage-select select").focus();
        this.focused = "usage";
      } else if (this.focused === "usage") {
        $(".days-numeric input").focus();
        this.focused = "numeric";
      } else if (this.focused === "numeric") {
        this.register();
      }
    }
  }

  confirmCancel() {
    this.setState({
      alert_messages: "",
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_alert_title:'',
    });
    var base_modal = document.getElementsByClassName("staff-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
    if (this.focused == "numeric") {
      $(".days-numeric input").focus();
    } else if (this.focused == "usage") {
      $(".usage-select select").focus();
    }
  }

  getUsageName = (usage_code) => {
    let result = "";
    if (usage_code == null || usage_code == undefined) return result;
    if (
      this.state.usage_codes == null ||
      this.state.usage_codes == undefined ||
      this.state.usage_codes.length <= 0
    )
      return result;

    this.state.usage_codes.map((item) => {
      if (item.id == usage_code) {
        result = item.value;
      }
    });

    return result;
  };

  openCalc = (type, val, unit) => {
    let calcTitle = this.getUsageName(this.state.usage_code);
    this.setState({
      calcInit: val != undefined && val != null && val > 0 ? val : 0,
      calcValType: type,
      calcUnit: unit,
      calcTitle: calcTitle,
      isOpenCalcModal: true,
    });
    var base_modal = document.getElementsByClassName("staff-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
    var edit_prescript_modal = document.getElementsByClassName(
      "edit-prescript-modal"
    )[0];
    if (edit_prescript_modal !== undefined && edit_prescript_modal != null)
      edit_prescript_modal.style["z-index"] = 1040;
  };

  calcCancel = () => {
    this.setState({
      isOpenCalcModal: false,
      calcValType: "",
      calcTitle: "",
      calcUnit: "",
      calcInit: 0,
    });
  };

  calcConfirm = (val) => {
    let _state = { isOpenCalcModal: false };
    if (this.state.calcValType == "") {
      _state.days = val;
    }
    _state.calcValType = "";
    _state.calcTitle = "";
    _state.calcUnit = "";
    _state.calcInit = 0;
    this.setState(_state);
    this.change_flag = 1;
  };
  closeModal = () => {
    if (this.props.usage_only) {
      if (this.original != JSON.stringify(this.state)) {
        this.setState({
          isBackConfirmModal: true,
          confirm_message:
            "登録していない内容があります。\n変更内容を破棄して移動しますか？",
          confirm_alert_title:'入力中',
        });
        var base_modal = document.getElementsByClassName("staff-modal")[0];
        if (base_modal !== undefined && base_modal != null)
          base_modal.style["z-index"] = 1040;
        var edit_prescript_modal = document.getElementsByClassName(
          "edit-prescript-modal"
        )[0];
        if (edit_prescript_modal !== undefined && edit_prescript_modal != null)
          edit_prescript_modal.style["z-index"] = 1040;
      } else {
        this.props.closeModal();
      }
    } else {
      this.setState({
          isBackConfirmModal: true,
          confirm_message:
            "登録していない内容があります。\n変更内容を破棄して移動しますか？",
          confirm_alert_title:'入力中',
        });
        base_modal = document.getElementsByClassName("staff-modal")[0];
        if (base_modal !== undefined && base_modal != null)
          base_modal.style["z-index"] = 1040;
        edit_prescript_modal = document.getElementsByClassName("edit-prescript-modal")[0];
        if (edit_prescript_modal !== undefined && edit_prescript_modal != null)
          edit_prescript_modal.style["z-index"] = 1040;
    }
  };

  getTooltip = () => {
    if (this.state.usage_name === "") {
      return "服用名称を入力してください。";
    }
    if (this.state.days === "" && this.state.disable_days_dosing === 0) {
      return "服用日数を入力してください。";
    }
    if (this.state.days !== "" && isNaN(parseFloat(this.state.days))) {
      return "服用日数を数字で入力してください。";
    }
    if (this.change_flag == 0) {
      return "変更内容がありません。";
    }
    return "";
  };
  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal();
  };

  registerConfirm = () => {
    this.props.handleOk(this.state);
  }

  render() {
    const { usage_codes, usage_group_codes } = this.state;
    let title = "服用名称";
    if (sortations[this.props.medicine_kind] == "外用") title = "使用部位";
    let unit = "日分";
    if (sortations[this.props.medicine_kind] == "頓服") unit = "回分";
    let tooltip = "";
    if (this.state.usage_name === "") {
      tooltip = "服用名称を入力してください。";
    }
    if (this.state.days === "" && this.state.disable_days_dosing === 0) {
      tooltip = "服用日数を入力してください。";
    }
    if (this.state.days !== "" && isNaN(parseFloat(this.state.days))) {
      tooltip = "服用日数を数字で入力してください。";
    }
    if (this.change_flag == 0) {
      tooltip = "変更内容がありません。";
    }
    
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal staff-modal"
        onKeyDown={this.onKeyPressed}
      >
        <Modal.Header>
          <Modal.Title>服用入力</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.is_loaded ? (
            <Wrapper>
              <div className="search-box d-flex usage-group-select">
                {usage_group_codes != undefined && (
                  <SelectorWithLabel
                    options={usage_group_codes}
                    title="服用グループ"
                    getSelect={this.selectGroup}
                    departmentEditCode={this.state.usage_code_group}
                    className="usage-group-select"
                  />
                )}
              </div>
              <div className="search-box d-flex usage-select">
                {usage_codes != undefined && (
                  <SelectorWithLabel
                    options={usage_codes}
                    title={title}
                    getSelect={this.selectType}
                    departmentEditCode={this.state.usage_code}
                    className="usage-select"
                  />
                )}
              </div>
              <div className="days-numeric">
                <NumericInputWithUnitLabel
                  label=""
                  value={this.state.days}
                  unit={unit}
                  getInputText={this.onChange.bind(this)}
                  onClickEvent={() => this.openCalc("", this.state.days, unit)}
                  min={0}
                  step={1}
                  inputmode="numeric"
                />
              </div>
              <div className="checkbox-div">
                <Checkbox
                  label="服用日数・回数を表示しない"
                  name="disable"
                  getRadio={this.disableDaysDoing.bind(this)}
                  value={this.state.disable_days_dosing}
                />
              </div>
            </Wrapper>
          ):(
            <SpinnerWrapper>
            <Spinner animation="border" variant="secondary" />
            </SpinnerWrapper>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
            <Button
              className={tooltip != "" ? "disable-btn" : "red-btn"}
              tooltip={tooltip}
              onClick={this.register}
            >
              登録
            </Button>
        </Modal.Footer>
        {this.state.isOpenCalcModal ? (
          <CalcDial
            calcConfirm={this.calcConfirm}
            units={this.state.calcUnit}
            calcCancel={this.calcCancel}
            daysSelect={true}
            daysInitial={0}
            daysLabel=""
            daysSuffix=""
            maxAmount={100000}
            calcTitle={this.state.calcTitle}
            calcInitData={this.state.calcInit}
          />
        ) : (
          ""
        )}
        {this.state.isBackConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.closeConfirmModal}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.registerConfirm.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
      </Modal>
    );
  }
}

SelectUsageModal.contextType = Context;

SelectUsageModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  medicine_kind: PropTypes.number,
  modal_data: PropTypes.Object,
  usage_only: PropTypes.Object,
};

export default SelectUsageModal;