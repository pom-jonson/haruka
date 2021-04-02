import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import InputWithUnitLabel from "~/components/molecules/InputWithUnitLabel";
import RadioButton from "~/components/molecules/RadioInlineButton";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 100%;
  float: left;
  label {
      text-align: right;
      width: 80px;
  }
  input {
    width: 400px;
    hei
    font-size: 14px;
  }
  
  .checkbox-label{
    width: 50%;
    text-align: left;
  }
  .label-title{
    font-size: 14px;
    width: 120px;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    padding-left: 15px;
    label{
      font-size: 15px;
      margin-left: 120px;
    }
  }
  .medicine_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    margin-left: -20px;
    input {
      font-size: 14px;
      width: 155px;
    }
    label {
      width: 120px;
      font-size: 15px;
    }
    .husei-code label {
      width: 100px;
      margin-left: 10px;
    }
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      height: 38px;
      margin-top: 8px;
      margin-left: 10px;
    }
    span {
      color: white;
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }
  .gender {
    font-size: 14px;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 8px;
      float: left;
  }
    .radio-btn label{
        width: 75px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
    }
  }
  .footer {
    display: flex;    
    margin-top: 10px;
    text-align: center;    
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      margin-right: 30px;
    }
    
    span {
      color: white;
      font-size: 14px;
      font-weight: 100;
    }
}
 .w80 {width: 80%;}
    .w50 {
        width: 50%;
    }
    .w30 {
        width: 30%;
    }
    .w70 {
        width: 70%;
    }
    .border-left: {
        border-left: solid 1px #ddd;
    }
    .w60p { width: 60px;}
    .flex {display: flex}
    .w100 { width: 100%;}
    .w100p { width: 100px;}
    .display_class { margin-left: 40%;}
    .no-margin {
        .dKLdmM input{
            width: 400px! important;
        }
        .hvMNwk { margin-top: -4px;}
    }
    .check-group{
        margin: 10px 12px 10px 125px;
    }
    
 `;
const sortations = ["内服", "頓服", "外用", "処置", "麻酔", "インスリン"];
class PresetPrescriptionModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
        number: (modal_data !== null && modal_data !== undefined ) ? modal_data.number : 0,
        name: (modal_data !== null && modal_data !== undefined) ? modal_data.name : "",
        name_kana: (modal_data !== null && modal_data !== undefined) ? modal_data.name_kana : "",
        is_enabled:  (modal_data !== null && modal_data !== undefined) ? modal_data.is_enabled : 1,
        title: (this.props.title !== null && this.props.title !== undefined) ? this.props.title: "",

    }
  }

    getAlwaysShow = (name, value) => {
        if(name==="alwaysShow"){
          this.setState({is_enabled: value})
        }        
    };
    getCategoryName = e => {
        this.setState({name: e.target.value})
    };
    getCategoryNameKana = e => {
        this.setState({name_kana: e.target.value})
    };

    getOtherMedicineCode = e => {
        this.setState({mhlw_code: e.target.value})
    };
    getDisplayName = e => {
        this.setState({name_view: e.target.value})
    };
    getMedicineName = e => {
        this.setState({name: e.target.value})
    };
    getMedicineShortName = e => {
        this.setState({name_short: e.target.value})
    };
    getMedicineGeneralName = e => {
        this.setState({generic_name: e.target.value})
    };
    getMedicineProperty = e => {
        this.setState({medicinal_properties: e.target.value})
    };

    getMedicineCategory = e => {
      this.setState({category: e.target.value})
    };
    
    async registerCategory()  {
      let path = "/app/api/v2/dial/master/register_prescription_category";
      const post_data = {
          params: this.state
      };      
      await apiClient.post(path, post_data);
    }

    handleOk = () => {
        this.registerCategory().then(() => {
            this.props.handleOk();
        });
    };

    changeMedicineKind = (value) => {
        this.setState({medicine_kind: value});
    };

    onHide=()=>{}

  render() {    
    const is_set = this.state.title == "処方セット 変更" ? 1 : 0;
    return  (
      <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal first-view-modal" style={{top: `10%`}}>
        <Modal.Header>
          <Modal.Title>{this.state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Wrapper>
                <div className="checkbox_area">
                    <Checkbox
                    label={is_set ? "この処方セットを常に表示" : "この処方分類を常に表示"}
                    getRadio={this.getAlwaysShow.bind(this)}
                    value={this.state.is_enabled}
                    checked = {this.state.is_enabled ===1}
                    name="alwaysShow"
                    />
                </div>
                <InputWithLabel
                    label={is_set ? "処方分類" : "分別名称"}
                    type="text"
                    getInputText={this.getCategoryName.bind(this)}
                    diseaseEditData={this.state.name}
                />
                <InputWithLabel
                    label={is_set ? "セット名称" : "カナ名称"}
                    type="text"
                    className="name-area"
                    getInputText={this.getCategoryNameKana.bind(this)}
                    diseaseEditData={this.state.name_kana}
                />
                {is_set ? (
                    <>
                        <div className="flex kind gender">
                            <label className="label">区分</label>
                            <>
                                {sortations.map((item, key)=>{
                                    return (
                                        <>
                                            <RadioButton
                                                id={`sortation${key}`}
                                                value={key}
                                                label={item}
                                                name="sortation"
                                                getUsage={this.changeMedicineKind.bind(this, key)}
                                                checked={this.state.medicine_kind === key ? true : false}
                                            />
                                        </>
                                    );
                                })}
                            </>
                        </div>
                        <div className={`no-margin`}>
                            <InputWithUnitLabel
                                label="薬剤"
                                unit="瓶"
                                type="text"
                                className={`membrane_area`}
                                // getInputText={this.getMedicineCode.bind(this,"membrane_area")}
                                // diseaseEditData={this.state.membrane_area}
                            />
                            <InputWithLabel
                                label=""
                                type="text"
                                // getInputText={this.getMedicineName.bind(this)}
                                // diseaseEditData={this.state.name}
                            /><InputWithLabel
                                label=""
                                type="text"
                                // getInputText={this.getMedicineName.bind(this)}
                                // diseaseEditData={this.state.name}
                            /><InputWithLabel
                                label=""
                                type="text"
                                // getInputText={this.getMedicineName.bind(this)}
                                // diseaseEditData={this.state.name}
                            /><InputWithLabel
                                label=""
                                type="text"
                                // getInputText={this.getMedicineName.bind(this)}
                                // diseaseEditData={this.state.name}
                            />
                        </div>
                        <div className={'flex check-group'}>
                            <input type="text" className={`w100p`}/>
                            <div>回分</div>
                            <Checkbox
                                label=""
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.is_enabled}
                                checked = {this.state.is_enabled ===1}
                                name="alwaysShow1"
                            />
                            <label className="checkbox-label">服用日数を表示しない</label>
                        </div>
                        <div className={`no-margin`}>
                            <InputWithLabel
                                label="服用"
                                type="text"
                                // getInputText={this.getMedicineName.bind(this)}
                                // diseaseEditData={this.state.name}
                            /><InputWithLabel
                                label=""
                                type="text"
                                // getInputText={this.getMedicineName.bind(this)}
                                // diseaseEditData={this.state.name}
                            />
                        </div>
                        <div className={`no-margin`}>
                            <InputWithLabel
                                label="コメント"
                                type="text"
                                // getInputText={this.getMedicineName.bind(this)}
                                // diseaseEditData={this.state.name}
                            /><InputWithLabel
                                label=""
                                type="text"
                                // getInputText={this.getMedicineName.bind(this)}
                                // diseaseEditData={this.state.name}
                            />
                        </div>

                    </>
                ):(<></>)}

                <div className="footer-buttons">
                  <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                    <Button className="red-btn" onClick={this.handleOk}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
                </div>
            </Wrapper>
        </Modal.Body>        
      </Modal>
    );
  }
}

PresetPrescriptionModal.contextType = Context;

PresetPrescriptionModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk:   PropTypes.func,
  medicine_type_name:PropTypes.array,
  title: PropTypes.string,
  modal_data:PropTypes.object
};

export default PresetPrescriptionModal;
