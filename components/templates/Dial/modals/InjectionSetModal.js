import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectPannelModal from "~/components/templates/Dial/Common/SelectPannelModal";
import { makeList_code } from "~/helpers/dialConstants";
import RadioButton from "~/components/molecules/RadioInlineButton";
// import InputBoxTag from "~/components/molecules/InputBoxTag";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import Checkbox from "~/components/molecules/Checkbox";
import axios from "axios";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import * as sessApi from "~/helpers/cacheSession-utils";
import { masterValidate } from "~/helpers/validate";
import {
  addRedBorder,
  addRequiredBg,
  removeRequiredBg,
  removeRedBorder,
  displayInjectionName
} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import CalcDial from "~/components/molecules/CalcDial";
import renderHTML from "react-render-html";

const Wrapper = styled.div`
  display: block;
  width: 100%;
  height: calc(62vh);
  max-height: 700px;
  overflow: hidden;
  position: relative;
  .label-title{
    width: 100px;
    margin-top: 5px;
    font-size: 1rem;
    text-align: right;
  }
  input{
    width:400px;
  }
    .medicine-area {
    .medicine-label{
      margin-top: 12px;
      width: 100px;
      text-align: right;
      label{
        padding-top:3px;
        font-size: 1rem;
      }
      margin-right:8px;
    }
    .name-area {
      width: 50%;
      .inject-name{
        height:38px;
        display:flex;
        align-items:center;
        width: calc(100% - 2.5rem);
        border: 1px solid #7e7e7e;
      }
      .label-title {
          width: 0;
          margin-bottom: 0;
          margin-top: 0;
      }        
      .clickable {
        margin-top:8px;
        input {
          height: 2.3rem;
        }
        .label-title {
            width: 0;
            margin:0;
        }
      }
      .delete-button{
        margin-left:0.5rem;
        margin-top:14px;
        button{
          margin-bottom:0;
        }
      }
    }
    .amount-area {
      width: 35%;
      input {
        font-size: 1rem;
        width:76px!important;
      }
      label {
        width: 40px;
        font-size: 1rem;
        margin-bottom:0;
        margin-top:10px;
      }
    }
        .unit-area {
            width: 8%;
            text-align: left;
            .flex {    
                margin-top: 0.5rem;
                padding-left: 0.3rem;
                line-height: 2.5rem;
                height: 2.5rem;
            }
        }
        .pattern-export {
            width: 30%;
        }
    }
    
    .radio-btn {
        margin-top: 0.3rem;
    }
    .radio-btn label{
        font-size: 1rem;
        width: 5rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        padding: 0.25rem;
        text-align:center;
        margin: 0 0.2rem;
    }
    .kind .label-div {
        width: 100px;
        // padding-right: 0.3rem;
        text-align: right;
        margin-top: 0.625rem;
        margin-right:8px;
    }
    .checkbox_area {
        padding-left: 15px;
        label{
            margin-left:93px;
        }
    }
    .kana_area {
    padding-top: 10px;
  }
    }
  .name_area {
    padding-top: 20px;
  }
  .checkbox_area{
    label{font-size:1rem;}
  }
`;
const sortations = ["静注", "筋注", "点滴", "処置薬剤", "麻酔", "処置行為"];
export class InjectionSetModal extends Component {
  constructor(props) {
    super(props);
    var injectionMasterData = sessApi.getObjectValue("dial_common_master","injection_master");
    let injectionSetData = props.injectionSetData;
    let category = props.category;
    this.state = {
      number:
        injectionSetData != null && injectionSetData.number !== undefined
          ? injectionSetData.number
          : null,
      is_enabled:
        injectionSetData != null && injectionSetData.is_enabled !== undefined
          ? injectionSetData.is_enabled
          : 1,
      name: injectionSetData != null ? injectionSetData.name : "",
      name_kana: injectionSetData != null ? injectionSetData.name_kana : "",
      category_name: category != null ? category.name : "",
      category_code: category != null ? category.code : "",
      injection_category: "",
      injectionCode1: "",
      injectionCode2: "",
      injectionCode3: "",
      injectionCode4: "",
      injectionCode5: "",
      injectionName1: "",
      injectionName2: "",
      injectionName3: "",
      injectionName4: "",
      injectionName5: "",
      injectionAmount1: "",
      injectionAmount2: "",
      injectionAmount3: "",
      injectionAmount4: "",
      injectionAmount5: "",
      injectionUnit1: "",
      injectionUnit2: "",
      injectionUnit3: "",
      injectionUnit4: "",
      injectionUnit5: "",
      isUpdateConfirmModal: false,
      confirm_message: "",
      isOpenConfirmModal: false,
      change_flag: 0,
      alert_message: "",
      isOpenCalcModal: false,
      calcUnit: "",
      calcTitle: "",
      injectionMasterData,
      injection_codes: makeList_code(injectionMasterData),
      sort_number: injectionSetData != null && injectionSetData.sort_number !== undefined
      ? injectionSetData.sort_number
      : null,
    };
  }

  async componentDidMount() {
    this.setChangeFlag(0);
    this.changeBackground();
    let injectionSetData = this.props.injectionSetData;
    if (
      injectionSetData === undefined ||
      injectionSetData == null ||
      injectionSetData.data_json === undefined ||
      injectionSetData.data_json == null
    )
      return;
    this.setState({
      injection_category: injectionSetData.injection_category,
      injectionCode1: injectionSetData.data_json[0].item_code,
      injectionCode2: injectionSetData.data_json[1].item_code,
      injectionCode3: injectionSetData.data_json[2].item_code,
      injectionCode4: injectionSetData.data_json[3].item_code,
      injectionCode5: injectionSetData.data_json[4].item_code,
      injectionName1: injectionSetData.data_json[0].item_name,
      injectionName2: injectionSetData.data_json[1].item_name,
      injectionName3: injectionSetData.data_json[2].item_name,
      injectionName4: injectionSetData.data_json[3].item_name,
      injectionName5: injectionSetData.data_json[4].item_name,
      injectionAmount1: injectionSetData.data_json[0].amount,
      injectionAmount2: injectionSetData.data_json[1].amount,
      injectionAmount3: injectionSetData.data_json[2].amount,
      injectionAmount4: injectionSetData.data_json[3].amount,
      injectionAmount5: injectionSetData.data_json[4].amount,
      injectionUnit1:
        injectionSetData.data_json[0].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === injectionSetData.data_json[0].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === injectionSetData.data_json[0].item_code
            ).unit
          : "",
      injectionUnit2:
        injectionSetData.data_json[1].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === injectionSetData.data_json[1].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === injectionSetData.data_json[1].item_code
            ).unit
          : "",
      injectionUnit3:
        injectionSetData.data_json[2].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === injectionSetData.data_json[2].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === injectionSetData.data_json[2].item_code
            ).unit
          : "",
      injectionUnit4:
        injectionSetData.data_json[3].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === injectionSetData.data_json[3].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === injectionSetData.data_json[3].item_code
            ).unit
          : "",
      injectionUnit5:
        injectionSetData.data_json[4].item_code &&
        this.state.injectionMasterData != undefined &&
        this.state.injectionMasterData.find(
          (x) => x.code === injectionSetData.data_json[4].item_code
        ) != undefined
          ? this.state.injectionMasterData.find(
              (x) => x.code === injectionSetData.data_json[4].item_code
            ).unit
          : "",
    });
  }

  componentDidUpdate() {
    this.changeBackground();
  }
  
  componentWillUnmount() {
    // sessApi.delObjectValue('dial_change_flag', 'word_pattern');
    sessApi.remove("dial_change_flag");
  }

  changeBackground = () => {    
    masterValidate("dial_injection_set", this.state, 'background');
    if (this.state.injection_category  == '') {
      addRequiredBg('injection_set_category_id');
    } else {
      removeRequiredBg("injection_set_category_id");
    }
    if (this.state.injectionCode1 < 1) {
      addRequiredBg('injectionCode1_set_id')
    } else {
      removeRequiredBg("injectionCode1_set_id");
    }
    if (!(this.state.injectionAmount1 > 0)) {
      addRequiredBg('injectionAmount1_set_id')
    } else {
      removeRequiredBg("injectionAmount1_set_id");
    }
  };

  initRedBorder() {
    removeRedBorder('injectionAmount1_set_id');
    removeRedBorder('injectionAmount2_set_id');
    removeRedBorder('injectionAmount3_set_id');
    removeRedBorder('injectionAmount4_set_id');
    removeRedBorder('injectionAmount5_set_id');
    removeRedBorder('injectionCode1_set_id');
    removeRedBorder('injectionCode2_set_id');
    removeRedBorder('injectionCode3_set_id');
    removeRedBorder('injectionCode4_set_id');
    removeRedBorder('injectionCode5_set_id');
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    removeRedBorder("injection_set_category_id");
  }

  checkValidation = () => {
    this.initRedBorder();
    let error_str_arr = [];
    let validate_data = masterValidate("dial_injection_set", this.state);

    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (this.state.injection_category == undefined || this.state.injection_category == null || this.state.injection_category =='') {
      error_str_arr.push("区分を選択してください。");
      addRedBorder('injection_set_category_id');
    }
    if (
      this.state.injectionCode1 < 1 &&
      this.state.injectionCode2 < 1 &&
      this.state.injectionCode3 < 1 &&
      this.state.injectionCode4 < 1 &&
      this.state.injectionCode5 < 1
    ) {
      error_str_arr.push("注射を選択してください。");
      addRedBorder('injectionCode1_set_id');
      if (!(this.state.injectionAmount1 > 0)) {
        error_str_arr.push("数量を入力してください。");
        addRedBorder('injectionAmount1_set_id');
      }
    }
    if (this.state.injectionCode1 > 0 && !(this.state.injectionAmount1 > 0)) {
      error_str_arr.push(this.state.injectionName1 + 'の数量を入力してください。');
      addRedBorder('injectionAmount1_set_id');
    }
    if (this.state.injectionCode2 > 0 && !(this.state.injectionAmount2 > 0)) {
      error_str_arr.push(this.state.injectionName2 + 'の数量を入力してください。')
      addRedBorder('injectionAmount2_set_id')
    }
    if (this.state.injectionCode3 > 0 && !(this.state.injectionAmount3 > 0)) {
      error_str_arr.push(this.state.injectionName3 + 'の数量を入力してください。')
      addRedBorder('injectionAmount3_set_id')
    }
    if (this.state.injectionCode4 > 0 && !(this.state.injectionAmount4 > 0)) {
      error_str_arr.push(this.state.injectionName4 + 'の数量を入力してください。')
      addRedBorder('injectionAmount4_set_id')
    }
    if (this.state.injectionCode5 > 0 && !(this.state.injectionAmount5 > 0)) {
      error_str_arr.push(this.state.injectionName5 + 'の数量を入力してください。')
      addRedBorder('injectionAmount5_set_id')
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };

  closeAlertModal = () => {
    this.setState({ alert_message: "" });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
    this.modalBlackBack();
  };

  setChangeFlag = (change_flag) => {
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "injection_set", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isOpenConfirmModal: false,
      confirm_message: "",
    });
    this.modalBlackBack();
  }
  changeMedicineKinds = (value) => {
    this.setChangeFlag(1);
    this.setState({ injection_category: sortations[value] });
  };

  getinjectionAmount1 = (e) => {
    this.setChangeFlag(1);
    if (parseFloat(e) < 0) e = 0;
    this.setState({ injectionAmount1: parseFloat(e) });
  };

  getinjectionAmount2 = (e) => {
    this.setChangeFlag(1);
    if (parseFloat(e) < 0) e = 0;
    this.setState({ injectionAmount2: parseFloat(e) });
  };

  getinjectionAmount3 = (e) => {
    this.setChangeFlag(1);
    if (parseFloat(e) < 0) e = 0;
    this.setState({ injectionAmount3: parseFloat(e) });
  };

  getinjectionAmount4 = (e) => {
    this.setChangeFlag(1);
    if (parseFloat(e) < 0) e = 0;
    this.setState({ injectionAmount4: parseFloat(e) });
  };

  getinjectionAmount5 = (e) => {
    this.setChangeFlag(1);
    if (parseFloat(e) < 0) e = 0;
    this.setState({ injectionAmount5: parseFloat(e) });
  };

  openInjectionSelectModal = (val) => {
    if (this.state['injectionCode' + (val - 1)] < 1){
      return;
    }
    this.setState({
      isOpenInjectionSelectModal: true,
      select_injection_tag: val,
    });
    this.modalBlack();
  };

  selectInjectionCode = (item) => {
    this.setChangeFlag(1);
    let name = "";
    let unit = "";
    if (this.state.injectionMasterData !== undefined) {
      name = this.state.injectionMasterData.find((x) => x.code === item.code)
        .name;
      unit = this.state.injectionMasterData.find((x) => x.code === item.code)
        .unit;
      switch (this.state.select_injection_tag) {
        case 1:
          this.setState({
            injectionCode1: item.code,
            injectionName1: name ? name : "",
            injectionUnit1: unit ? unit : "",
          });
          break;
        case 2:
          this.setState({
            injectionCode2: item.code,
            injectionName2: name ? name : "",
            injectionUnit2: unit ? unit : "",
          });
          break;
        case 3:
          this.setState({
            injectionCode3: item.code,
            injectionName3: name ? name : "",
            injectionUnit3: unit ? unit : "",
          });
          break;
        case 4:
          this.setState({
            injectionCode4: item.code,
            injectionName4: name ? name : "",
            injectionUnit4: unit ? unit : "",
          });
          break;
        case 5:
          this.setState({
            injectionCode5: item.code,
            injectionName5: name ? name : "",
            injectionUnit5: unit ? unit : "",
          });
          break;
      }
    }
    this.closeModal();
  };

  closeModal = () => {
    this.setState({ isOpenInjectionSelectModal: false });
  };
  grayOut = (type, index) => {
    let ret_val = false;
    if (index > 1) {
      if (type == "injectionCode") {
        if (this.state[type + (index - 1)] < 1){
          ret_val = true;
          // this.setState({[type + (index - 1)]: ''});
        }
      } else if (type == "injectionAmount") {
        if (this.state['injectionCode' + index] < 1){
          ret_val = true;
          // this.setState({[type + index]: ''});
        }
      }
    }
    return ret_val;
  }

  register = () => {
    if (this.state.change_flag == 0) return;
    var error = this.checkValidation();

    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      this.modalBlack();
      return;
    }

    let str_msg = this.props.injectionSetData != null ? "変更" : "登録";
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: str_msg + "しますか？",
    });
    this.modalBlack();
  };

  saveData = async () => {
    this.confirmCancel();
    let post_data = {
      number: this.state.number,
      injection_category: this.state.injection_category,
      name: this.state.name,
      name_kana: this.state.name_kana,
      category_code: this.state.category_code,
      data_json: [
        {
          item_code: this.state.injectionCode1,
          item_name: this.state.injectionName1,
          amount: this.state.injectionAmount1,
          unit: this.state.injectionUnit1,
        },
        {
          item_code: this.state.injectionCode2,
          item_name: this.state.injectionName2,
          amount: this.state.injectionAmount2,
          unit: this.state.injectionUnit2,
        },
        {
          item_code: this.state.injectionCode3,
          item_name: this.state.injectionName3,
          amount: this.state.injectionAmount3,
          unit: this.state.injectionUnit3,
        },
        {
          item_code: this.state.injectionCode4,
          item_name: this.state.injectionName4,
          amount: this.state.injectionAmount4,
          unit: this.state.injectionUnit4,
        },
        {
          item_code: this.state.injectionCode5,
          item_name: this.state.injectionName5,
          amount: this.state.injectionAmount5,
          unit: this.state.injectionUnit5,
        },
      ],
      sort_number: this.state.sort_number
    };
    await axios
      .post("/app/api/v2/dial/pattern/registerInjectionSet", {
        params: post_data,
      })
      .then((res) => {
        if (res)
          window.sessionStorage.setItem(
            "alert_messages",
            "登録完了##" + "注射セット情報を保存しました。"
          );
      });
    this.props.handleOk();
  };

  getAlwaysShow = (name, value) => {
    this.setChangeFlag(1);
    if (name === "alwaysShow") {
      this.setState({ is_enabled: value });
    }
  };
  getMedicineName = (e) => {
    this.setChangeFlag(1);
    this.setState({ name: e.target.value });
  };
  getMedicineKanaName = (e) => {
    this.setChangeFlag(1);
    this.setState({ name_kana: e.target.value });
  };

  deleteInjectName = (index) => {    
    switch (index) {
      case 1:
        this.setState({ injectionCode1: "", injectionName1: "", injectionUnit1:'', injectionAmount1:'' });
        break;
      case 2:
        this.setState({ injectionCode2: "", injectionName2: "", injectionUnit2:'', injectionAmount2:''  });
        break;
      case 3:
        this.setState({ injectionCode3: "", injectionName3: "", injectionUnit3:'', injectionAmount3:''  });
        break;
      case 4:
        this.setState({ injectionCode4: "", injectionName4: "", injectionUnit4:'', injectionAmount4:''  });
        break;
      case 5:
        this.setState({ injectionCode5: "", injectionName5: "", injectionUnit5:'', injectionAmount5:''  });
        break;
    }
    this.setChangeFlag(1);
  };

  confirmCloseOk = () => {
    this.setState(
      {
        isOpenConfirmModal: false,
        confirm_message: "",
      },
      () => {
        this.props.closeModal();
      }
    );
  };

  handleClose = () => {
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        confirm_message:
          "登録していない内容があります。変更内容を破棄して閉じますか？",
      });
      this.modalBlack();
      return;
    }
    this.props.closeModal();
  };

  openCalc = (type, val, unit) => {
    let _state = {
      calcInit: val != undefined && val != null && val > 0 ? val : 0,
      calcValType: type,
      isOpenCalcModal: true,
      calcUnit:unit
    };
    this.modalBlack();
    if (
      this.state.injection_codes != undefined &&
      this.state.injection_codes != null
    ) {
      if (type == "amount1") {
        if (this.state.injectionCode1 !== "") {
          _state.calcTitle = this.state.injection_codes[
            this.state.injectionCode1
          ];
        }
      } else if (type == "amount2") {
        if (this.state.injectionCode2 !== "") {
          _state.calcTitle = this.state.injection_codes[
            this.state.injectionCode2
          ];
        }
      } else if (type == "amount3") {
        if (this.state.injectionCode3 !== "") {
          _state.calcTitle = this.state.injection_codes[
            this.state.injectionCode3
          ];
        }
      } else if (type == "amount4") {
        if (this.state.injectionCode4 !== "") {
          _state.calcTitle = this.state.injection_codes[
            this.state.injectionCode4
          ];
        }
      } else if (type == "amount5") {
        if (this.state.injectionCode5 !== "") {
          _state.calcTitle = this.state.injection_codes[
            this.state.injectionCode5
          ];
        }
      }
    }

    this.setState(_state);
  };

  calcCancel = () => {
    this.setState({
      isOpenCalcModal: false,
      calcValType: "",
      calcTitle: "",
      calcUnit: "",
      calcInit: 0,
    });
    this.modalBlackBack();
  };

  calcConfirm = (val) => {
    let _state = { isOpenCalcModal: false };
    if (this.state.calcValType == "amount1") {
      _state.injectionAmount1 = val;
    } else if (this.state.calcValType == "amount2") {
      _state.injectionAmount2 = val;
    } else if (this.state.calcValType == "amount3") {
      _state.injectionAmount3 = val;
    } else if (this.state.calcValType == "amount4") {
      _state.injectionAmount4 = val;
    } else if (this.state.calcValType == "amount5") {
      _state.injectionAmount5 = val;
    }
    _state.calcValType = "";
    _state.calcTitle = "";
    _state.calcUnit = "";
    _state.calcInit = 0;
    this.setChangeFlag(1);
    this.setState(_state);
  };

  modalBlackBack() {
    var base_modal = document.getElementsByClassName("injection-set-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  }
  modalBlack() {
    var base_modal = document.getElementsByClassName("injection-set-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  }
  getSortNumber = (e) => {
    if (parseFloat(e) < 0) e = 0;
    this.setState({ sort_number: parseInt(e) });
    this.setChangeFlag(1);
  };

  render() {    
    return (
      <Modal show={true} className="master-modal injection-set-modal">
        <Modal.Header>
          <Modal.Title>注射セット</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label="この注射セットを常に表示"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_enabled}
                checked={this.state.is_enabled === 1}
                name="alwaysShow"
              />
            </div>
            <NumericInputWithUnitLabel
              label="表示順"
              value={this.state.sort_number}
              getInputText={this.getSortNumber.bind(this)}
              inputmode="numeric"
            />
            <InputWithLabelBorder
              label="分類名称"
              type="text"
              className="name-area"
              diseaseEditData={this.state.category_name}
            />
            <InputWithLabelBorder
              label="セット名称"
              type="text"
              className="kana_area"
              getInputText={this.getMedicineName.bind(this)}
              diseaseEditData={this.state.name}
              id="name_id"
            />
            <InputWithLabelBorder
              label="カナ名称"
              type="text"
              className="kana_area"
              getInputText={this.getMedicineKanaName.bind(this)}
              diseaseEditData={this.state.name_kana}
              id="name_kana_id"
            />
            <div className="flex kind" style={{ marginTop: "0.5rem" }}>
              <label className="label-div">区分</label>
              <div id='injection_set_category_id'>
                {sortations.map((item, key) => {
                  return (
                    <>
                      <RadioButton
                        id={`sortation_${key}`}
                        value={key}
                        label={item}
                        name="injection_category"
                        getUsage={this.changeMedicineKinds.bind(this, key)}
                        checked={
                          this.state.injection_category === item ? true : false
                        }
                      />
                    </>
                  );
                })}
              </div>
            </div>
            <div className="medicine-area d-flex">
              <div className="medicine-label">
                <label>注射名</label>
              </div>
              <div className={"name-area"}>
                <div className='flex'>
                  <div id="injectionCode1_id" className="clickable flex inject-name" onClick={this.openInjectionSelectModal.bind(this, 1)}>
                    {renderHTML(displayInjectionName(this.state.injectionCode1, this.state.injectionName1, true))}
                  </div>
                  <div className='delete-button'>
                    <Button className={this.state.injectionName1==''?'disable-btn':''} isDisabled={this.state.injectionName1==''} type="common" onClick={this.deleteInjectName.bind(this, 1)}>C</Button>
                  </div>                      
                </div>
                <div className='flex'>
                  <div id="injectionCode2_id" className={"clickable flex inject-name " + (this.grayOut('injectionCode', 2)?'disabled-general':'')} onClick={this.openInjectionSelectModal.bind(this, 2)}>
                    {renderHTML(displayInjectionName(this.state.injectionCode2, this.state.injectionName2, true))}
                  </div>
                  <div className='delete-button'>
                    <Button className={this.state.injectionName2==''?'disable-btn':''} isDisabled={this.state.injectionName2==''} type="common" onClick={this.deleteInjectName.bind(this, 2)}>C</Button>
                  </div>                      
                </div>
                <div className='flex'>
                  <div id="injectionCode3_id" className={"clickable flex inject-name " + (this.grayOut('injectionCode', 3)?'disabled-general':'')} onClick={this.openInjectionSelectModal.bind(this, 3)}>
                    {renderHTML(displayInjectionName(this.state.injectionCode3, this.state.injectionName3, true))}
                  </div>
                  <div className='delete-button'>
                    <Button className={this.state.injectionName3==''?'disable-btn':''} isDisabled={this.state.injectionName3==''} type="common" onClick={this.deleteInjectName.bind(this, 3)}>C</Button>
                  </div>
                </div>
                <div className='flex'>
                  <div id="injectionCode4_id" className={"clickable flex inject-name " + (this.grayOut('injectionCode', 4)?'disabled-general':'')} onClick={this.openInjectionSelectModal.bind(this, 4)}>
                    {renderHTML(displayInjectionName(this.state.injectionCode4, this.state.injectionName4, true))}
                  </div>
                  <div className='delete-button'>
                    <Button className={this.state.injectionName4==''?'disable-btn':''} isDisabled={this.state.injectionName4==''} type="common" onClick={this.deleteInjectName.bind(this, 4)}>C</Button>
                  </div>
                </div>
                <div className='flex'>
                  <div id="injectionCode5_id" className={"clickable flex inject-name " + (this.grayOut('injectionCode', 5)?'disabled-general':'')} onClick={this.openInjectionSelectModal.bind(this, 5)}>
                    {renderHTML(displayInjectionName(this.state.injectionCode5, this.state.injectionName5, true))}
                  </div>
                  <div className='delete-button'>
                    <Button className={this.state.injectionName5==''?'disable-btn':''} isDisabled={this.state.injectionName5==''} type="common" onClick={this.deleteInjectName.bind(this, 5)}>C</Button>
                  </div>
                </div>
              </div>
              <div className={"amount-area"}>
                <div className="flex">
                  <NumericInputWithUnitLabel
                    label="数量"
                    value={this.state.injectionAmount1}
                    getInputText={this.getinjectionAmount1.bind(this)}
                    inputmode="numeric"
                    unit={this.state.injectionUnit1}
                    onClickEvent={() =>
                      this.openCalc("amount1", this.state.injectionAmount1, this.state.injectionUnit1)
                    }
                    min={0}
                    id="injectionAmount1_set_id"
                    disabled={this.grayOut('injectionAmount', 1)}
                  />
                </div>
                <div className="flex">
                  <NumericInputWithUnitLabel
                    label=""
                    value={this.state.injectionAmount2}
                    getInputText={this.getinjectionAmount2.bind(this)}
                    inputmode="numeric"
                    unit={this.state.injectionUnit2}
                    onClickEvent={() =>
                      this.openCalc("amount2", this.state.injectionAmount2, this.state.injectionUnit2)
                    }
                    min={0}
                    id = 'injectionAmount2_set_id'
                    disabled={this.grayOut('injectionAmount', 2)}
                  />
                </div>
                <div className="flex">
                  <NumericInputWithUnitLabel
                    label=""
                    value={this.state.injectionAmount3}
                    getInputText={this.getinjectionAmount3.bind(this)}
                    inputmode="numeric"
                    unit={this.state.injectionUnit3}
                    onClickEvent={() =>
                      this.openCalc("amount3", this.state.injectionAmount3, this.state.injectionUnit3)
                    }
                    min={0}
                    id = 'injectionAmount3_set_id'
                    disabled={this.grayOut('injectionAmount', 3)}
                  />
                </div>
                <div className="flex">
                  <NumericInputWithUnitLabel
                    label=""
                    value={this.state.injectionAmount4}
                    getInputText={this.getinjectionAmount4.bind(this)}
                    inputmode="numeric"
                    unit={this.state.injectionUnit4}
                    onClickEvent={() =>
                      this.openCalc("amount4", this.state.injectionAmount4, this.state.injectionUnit4)
                    }
                    min={0}
                    id = 'injectionAmount4_set_id'
                    disabled={this.grayOut('injectionAmount', 4)}
                  />
                </div>
                <div className="flex">
                  <NumericInputWithUnitLabel
                    label=""
                    value={this.state.injectionAmount5}
                    getInputText={this.getinjectionAmount5.bind(this)}
                    inputmode="numeric"
                    unit={this.state.injectionUnit5}
                    onClickEvent={() =>
                      this.openCalc("amount5", this.state.injectionAmount5, this.state.injectionUnit5)
                    }
                    min={0}
                    id = 'injectionAmount5_set_id'
                    disabled={this.grayOut('injectionAmount', 5)}
                  />
                </div>
              </div>
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" id="btnCancel" onClick={this.handleClose}>
            キャンセル
          </Button>
            <Button
              className={this.state.change_flag == 0 ? "disable-btn" : "red-btn"}
              id="btnCancel"
              onClick={this.register}
            >
              {this.props.injectionSetData != null ? "変更" : "登録"}
            </Button>
        </Modal.Footer>
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.saveData.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isOpenConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmCloseOk}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isOpenInjectionSelectModal && (
          <SelectPannelModal
            selectMaster={this.selectInjectionCode}
            closeModal={this.closeModal}
            MasterName={"注射"}
          />
        )}
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
        {this.state.isOpenCalcModal && (
          <CalcDial
            calcConfirm={this.calcConfirm}
            units={this.state.calcUnit}
            calcCancel={this.calcCancel}
            daysSelect={false}
            daysInitial={0}
            daysLabel=""
            daysSuffix=""
            maxAmount={100000}
            calcTitle={this.state.calcTitle}
            calcInitData={this.state.calcInit}
          />
        )}
      </Modal>
    );
  }
}
InjectionSetModal.contextType = Context;
InjectionSetModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  injectionSetData: PropTypes.object,
  category: PropTypes.object,
};

export default InjectionSetModal;
