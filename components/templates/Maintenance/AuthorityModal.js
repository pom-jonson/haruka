import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { masterValidate } from "~/helpers/validate";
import { removeRedBorder, } from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import MenuSettingModal from "./MenuSettingModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  label {
    text-align: right;
    width: 190px;
    cursor: pointer;
  }
  input {
    width: 20rem;
    font-size: 1rem;
  }
  .menu-button{
    button{
      margin-left: 20px;
      padding: 0px;
      height: 35px;
      margin-top: 9px;
      padding-left:8px;
      padding-right:8px;
      span{
        font-size:1rem;
      }
    }
  }
  .disease_classification {
    display: flex;
    font-size: 1rem;
    margin-left: 15px;
    margin-top: 8px;
    .radio-btn label {
      width: 60px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
    }
    .checkbox-label {
      width: 69px;
      text-align: right;
      margin-top: 8px;
    }
  }
  .checkbox-label {
    width: 30%;
    text-align: left;
  }
  .add-button {
    text-align: center;
  }
  .checkbox_area {
    padding-left: 30px;
    label{
      font-size: 1rem;
    }
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    input {
      font-size: 1rem;
      width: 155px;
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .label-title {
    font-size: 1rem;
  }
  .name_area {
    padding-top: 20px;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .auth-area {
    height: 60vh;
    overflow-y: scroll;
  }
  .auth_title {
    margin-top: 11px;
    margin-right: 8px;
  }
  .check-box-area {
    width: calc(100% - 200px);
    margin-top: 10px;
    label {
      width: 15rem !important;
      text-align: left;
      font-size: 1rem !important;
    }
  }
  .course-setting-width {
    width: 90%;
  }
  .select-ward {
    margin-top: 10px;
    .label-title {
      width:190px;
      font-size:1rem;
      margin:0;
      margin-right:8px;
      line-height:2rem;
      text-align: right;
    }
    .pullbox-label {
      margin:0;
      width: 10rem;
      .pullbox-select {
        width:10rem;
        height:2rem;
        font-size:1rem;
      }
    }
  }
`;

class AuthorityModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    var initState = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    this.config_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data");
    this.state = {
      is_enabled: modal_data != null ? modal_data.is_enabled : 1,
      number: modal_data != null ? modal_data.id : 0,
      name: modal_data != null ? modal_data.name : "",
      name_kana: modal_data != null ? modal_data.name_kana : "",
      feature_auth: modal_data != null ? modal_data.feature_auth : [],
      common_auth: modal_data != null ? modal_data.common_auth : [],
      ward_id: (modal_data != null && modal_data.ward_id != null) ? modal_data.ward_id : 0,
      isBackConfirmModal: false,
      isOpenMenuModal:false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      alert_message: "",
    };
    this.original = "";
    this.cur_system = this.enableHaruka(initState);
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    this.ward_master = [{id:0, value:""}];
    if (cache_ward_master != undefined && cache_ward_master != null && cache_ward_master.length > 0){
      cache_ward_master.map(ward=>{
        this.ward_master.push({id:ward.number, value: ward.name});
      });
    }
    this.change_flag = 0;
  }

  componentDidMount() {
    this.original = JSON.stringify(this.state);
    this.changeBackground();
  }
  enableHaruka = (initState) => {
      if (initState == null || initState == undefined) {
      return "haruka";
      }    
      if(initState.enable_ordering_karte == 1) return "haruka";
      if(initState.enable_dialysis == 1) return "dialysis";
      return "haruka";
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  changeBackground = () => {
    masterValidate("authority", this.state, 'background');
  };

  checkValidation = () => {
		removeRedBorder("name_id");
    let error_str_arr = [];
    let validate_data = masterValidate("authority", this.state);
		
    if (validate_data.error_str_arr.length > 0) {
			error_str_arr = validate_data.error_str_arr;
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
  };

  getAlwaysShow = (name, value) => {
    this.change_flag = 1;
    if (name === "alwaysShow") this.setState({ is_enabled: value });
  };

  getFeature = (name, value) => {
    this.change_flag = 1;
    let feature = [];
    this.state.feature_auth.map((item) => {
      feature.push(parseInt(item));
    });

    if (!feature.includes(value)) {
      feature.push(value);
    } else {
      var index = feature.indexOf(value);
      if (index !== -1) {
        feature.splice(index, 1);
      }
    }
    this.setState({
      feature_auth: feature,
    });
  };
  getCommon = (name, value) => {
    this.change_flag = 1;
    let common = [];
    this.state.common_auth.map((item) => {
      common.push(item);
    });

    if (!common.includes(value)) {
      common.push(value);
    } else {
      var index = common.indexOf(value);
      if (index !== -1) {
        common.splice(index, 1);
      }
    }
    this.setState({
      common_auth: common,
    });
  };

  getValue = (key, e) => {
    this.change_flag = 1;
    this.setState({[key]:e.target.value})
  };

  async registerMedicine() {
    let path = "/app/api/v2/dial/authority/register";
    const post_data = {
      params: this.state,
    };
    await apiClient.post(path, post_data);
  }

  handleOk = () => {
    var error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }
    let confirm_message =
      this.props.modal_data !== null
        ? "権限を変更しますか?"
        : "権限を登録しますか?";
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message,
    });
  };

  register = () => {
    this.confirmCancel();
    this.registerMedicine().then(() => {
      if (this.props.modal_data != null){
        window.sessionStorage.setItem("alert_messages", '変更完了##変更しました。');
      } else {
        window.sessionStorage.setItem("alert_messages", '登録完了##登録しました。');
      }
      this.props.handleOk();
    });
  };
  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal();
  };
  closeModal = () => {
    if (JSON.stringify(this.state) != this.original) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。変更内容を破棄して移動しますか？",
      });
    } else {
      this.props.closeModal();
    }
  };

  closeMenuModal = () => {
    this.setState({
      isOpenMenuModal:false
    })
  }
  confirmCancel = () => {
    this.setState({
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
    });
  };

  dialMenuDisplay = (item) => {
    let authority_config = this.config_data.authority;
    if (authority_config == undefined || authority_config == null || authority_config.length == 0 ) return false;
    let find_item = authority_config.find(x=>x.number == item);
    if (find_item == undefined || find_item == null) return false;
    if (find_item.is_enabled == 1) return true;
    else return false;
  }

  openMenuModal = () => {
    this.setState({
      isOpenMenuModal:true,
    })
  }
  
  setWard=(e)=>{
    this.setState({ward_id:parseInt(e.target.id)});
  };

  render() {
    let FEATURES_NAMES = this.context.FEATURES_NAMES;
    let FEATURES_AUTHS_MAP = this.context.FEATURES_AUTHS_MAP;
    let AUTHS_NAMES = this.context.AUTHS_NAMES;
    let COMMON_AUTHS_MAP = this.context.COMMON_AUTHS_MAP;
    let DIAL_FEATURES_AUTHS_MAP = this.context.DIAL_FEATURES_AUTHS_MAP;
    
    return (
      <Modal show={true} className="master-modal authority-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>
            権限{this.props.modal_data !== null ? "編集" : "登録"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label=""
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_enabled}
                checked={this.state.is_enabled === 1}
                name="alwaysShow"
              />
              <label className="checkbox-label">使用する</label>
            </div>
            <div className='flex menu-button'>
              <InputWithLabelBorder
                label="名称"
                type="text"
                className="name-area"
                getInputText={this.getValue.bind(this, "name")}
                diseaseEditData={this.state.name}
                id="name_id"
              />
              <div className='name_kana_area'>
                <InputWithLabelBorder
                  label="カナ名称"
                  type="text"
                  className="name-area"
                  getInputText={this.getValue.bind(this, "name_kana")}
                  diseaseEditData={this.state.name_kana}
                  id="name_kana_id"
                />
              </div>
              {this.state.number > 0 && (
                <><Button type="common" onClick={this.openMenuModal.bind(this)}>メニュー設定</Button></>
              )}
            </div>
            <div className={"auth-area"}>
              <div className={"feature-auth-area"}>
                {this.cur_system == "haruka" && (
                  <>
                    {Object.keys(FEATURES_AUTHS_MAP).map((feature) => {
                      if (feature <= 1031)
                        return (
                          <>
                            <div className={"flex"+(feature == this.context.FEATURES.COURSE_SETTING ? " course-setting-width" : "")}>
                              <label className={"auth_title"}>
                                {FEATURES_NAMES[feature]}
                              </label>
                              <div className={"check-box-area"}>
                                {FEATURES_AUTHS_MAP[feature].map((item) => {
                                  return (
                                    <>
                                      <Checkbox
                                        label={AUTHS_NAMES[item]}
                                        getRadio={this.getFeature.bind(this)}
                                        value={this.state.feature_auth.includes(
                                          parseInt(
                                            feature.toString() + item.toString()
                                          )
                                        )}
                                        checked={0}
                                        number={parseInt(
                                          feature.toString() + item.toString()
                                        )}
                                        name="feature_auth"
                                      />
                                    </>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        );
                      })
                    }
                    {Object.keys(FEATURES_AUTHS_MAP).map((feature) => {
                      if (feature == 1053)
                        return (
                          <>
                            <div className={"flex"+(feature == this.context.FEATURES.COURSE_SETTING ? " course-setting-width" : "")}>
                              <label className={"auth_title"}>
                                {FEATURES_NAMES[feature]}
                              </label>
                              <div className={"check-box-area"}>
                                {FEATURES_AUTHS_MAP[feature].map((item) => {
                                  return (
                                    <>
                                      <Checkbox
                                        label={AUTHS_NAMES[item]}
                                        getRadio={this.getFeature.bind(this)}
                                        value={this.state.feature_auth.includes(
                                          parseInt(
                                            feature.toString() + item.toString()
                                          )
                                        )}
                                        checked={0}
                                        number={parseInt(
                                          feature.toString() + item.toString()
                                        )}
                                        name="feature_auth"
                                      />
                                    </>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        );
                      })
                    }
                    {Object.keys(FEATURES_AUTHS_MAP).map((feature) => {
                      if (feature > 1031)
                        return (
                          <>
                            <div className={"flex"+(feature == this.context.FEATURES.COURSE_SETTING ? " course-setting-width" : "")}>
                              <label className={"auth_title"}>
                                {FEATURES_NAMES[feature]}
                              </label>
                              <div className={"check-box-area"}>
                                {FEATURES_AUTHS_MAP[feature].map((item) => {
                                  return (
                                    <>
                                      <Checkbox
                                        label={AUTHS_NAMES[item]}
                                        getRadio={this.getFeature.bind(this)}
                                        value={this.state.feature_auth.includes(
                                          parseInt(
                                            feature.toString() + item.toString()
                                          )
                                        )}
                                        checked={0}
                                        number={parseInt(
                                          feature.toString() + item.toString()
                                        )}
                                        name="feature_auth"
                                      />
                                    </>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        );
                      })
                    }
                  </>
                )}
              </div>
              {this.cur_system == "haruka" && (
                <div className={"common-auth-area"}>
                  <div className={"flex"}>
                    <label className={"auth_title"}>一括設定</label>
                    <div className={"check-box-area"}>
                      {COMMON_AUTHS_MAP.map((item) => {
                        return (
                          <>
                            <Checkbox
                              label={AUTHS_NAMES[item]}
                              getRadio={this.getCommon.bind(this)}
                              value={this.state.common_auth.includes(item)}
                              checked={0}
                              number={item}
                              name="common_auth"
                            />
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {this.cur_system == "dialysis" && Object.keys(DIAL_FEATURES_AUTHS_MAP).map((feature) => {
                  if(this.dialMenuDisplay(feature))
                    return (
                      <>
                        <div className={"flex"+(feature == this.context.FEATURES.COURSE_SETTING ? " course-setting-width" : "")}>
                          <label className={"auth_title"}>
                            {FEATURES_NAMES[feature] == "システム設定管理" ? "システム仕様変更" : FEATURES_NAMES[feature]}
                          </label>
                          <div className={"check-box-area"}>
                            {DIAL_FEATURES_AUTHS_MAP[feature].map((item) => {
                              return (
                                <>
                                  <Checkbox
                                    label={AUTHS_NAMES[item]}
                                    getRadio={this.getFeature.bind(this)}
                                    value={this.state.feature_auth.includes(
                                      parseInt(
                                        feature.toString() + item.toString()
                                      )
                                    )}
                                    checked={0}
                                    number={parseInt(
                                      feature.toString() + item.toString()
                                    )}
                                    name="feature_auth"
                                  />
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    );
                  })
                }
              {this.cur_system == "haruka" && (
                <div className={'select-ward'}>
                  <SelectorWithLabel
                    options={this.ward_master}
                    title="担当病棟"
                    getSelect={this.setWard}
                    departmentEditCode={this.state.ward_id}
                    id="category_id"
                  />
                </div>
              )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
          <Button onClick={this.handleOk} className={this.change_flag == 1 ? "red-btn" : "disable-btn"} isDisabled={this.change_flag == 0}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
        </Modal.Footer>
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.register.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isBackConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.closeConfirmModal}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isOpenMenuModal == true && (
          <MenuSettingModal
            closeModal = {this.closeMenuModal}
            authority_id = {this.state.number}
          />
        )}
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
      </Modal>
    );
  }
}

AuthorityModal.contextType = Context;

AuthorityModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data: PropTypes.object,
};

export default AuthorityModal;
