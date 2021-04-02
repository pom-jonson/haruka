import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
// import {formatDateLine} from "~/helpers/date";
import * as sessApi from "~/helpers/cacheSession-utils";
import {makeList_data,makeList_value, extract_enabled} from "~/helpers/dialConstants";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 100%;
  float: left;
  padding: 25px;
  .add-button {
      text-align: center;
      .first {
        margin-left: -30px;
      }
  }

.lb-top-title{
    text-decoration: underline;
}
.flex {
  display: flex;
  flex-wrap: wrap;
  
}
.top-area{
    .label-title{
        width:70px;
        font-size:15px;  
        text-align:right;
        margin-right:10px;      
    }
    .pullbox-label, .pullbox-select{
        width:100px;
    }
    margin-bottom:20px;
}

.footer {
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
        font-size: 16px;
        font-weight: 100;
    }
  }

`;


class XRayRecordModal extends Component {
    constructor(props) {
        super(props);
        let code_master = sessApi.getObjectValue("dial_common_master","code_master");
        var patient_list = this.props.contents;
        
        var KVP_codes = makeList_value(extract_enabled(code_master['照射録KVP']));
        var mA_codes = makeList_value(extract_enabled(code_master['照射録mA']));
        var sec_codes = makeList_value(extract_enabled(code_master['照射録sec']));
        var FED_codes = makeList_value(extract_enabled(code_master['照射録FED']));
        this.state = {
            patient_list,
            radiation_parts : code_master['照射録部位'],
            radiation_part_codes : makeList_data(extract_enabled(code_master['照射録部位'])),
            KVP_data: code_master['照射録KVP'],
            KVP_codes,
            mA_data: code_master['照射録mA'],
            mA_codes,
            sec_data: code_master['照射録sec'],
            sec_codes,
            FED_data: code_master['照射録FED'],
            FED_codes,
            radi_part:'',
            radi_part_name:'',
            kvp:KVP_codes.length>1?KVP_codes[1].id:'',
            ma:mA_codes.length>1?mA_codes[1].id:'',
            sec:sec_codes.length>1?sec_codes[1].id:'',
            fed:FED_codes.length>1?FED_codes[1].id:'',
            print_number:1,

            kvp_value:KVP_codes.length>1?KVP_codes[1].value:'',
            mA_value:mA_codes.length>1?mA_codes[1].value:'',
            sec_value:sec_codes.length>1?sec_codes[1].value:'',
            fed_value:FED_codes.length>1?FED_codes[1].value:'',

            isSaveConfirmModal:false,
            isCloseConfirmModal:false,
            confirm_message:'',            
        }
        this.change_flag = false;
    }
    closeModal = () => {
      this.confirmCancel();
      this.change_flag = false;
      this.props.closeModal();
    };

    close = () => {
      if (this.change_flag){
        this.setState({
          isCloseConfirmModal:true,
          confirm_message:'登録していない内容があります。変更を破棄して移動しますか？',
        })
      } else {
        this.closeModal();
      }
    }

    getRadiationPart = e => {
        this.setState({radi_part:e.target.value, radi_part_name:''})
        this.change_flag = true;
    }

    getDirection = e => {
        this.setState({radi_direct:e.target.id})
        this.change_flag = true;
    }

    getPrintNumber = e => {
        this.setState({print_number: parseInt(e)})
        this.change_flag = true;
    }

    getRadiPartName = e => {
        this.setState({radi_part_name: e.target.value})
        this.change_flag = true;
    }

    getFED = e => {
        this.setState({fed:e.target.value, fed_value:''})        
    }

    getmA = e => {
        this.setState({ma:e.target.value, mA_value:''})
        this.change_flag = true;
    }

    getSec = e => {
        this.setState({sec:e.target.value, sec_value:''})
        this.change_flag = true;
    }

    getKVP = e => {
        this.setState({kvp:e.target.value, kvp_value:''})
        this.change_flag = true;
    }

    getKVPName = e => {
        this.setState({kvp_value:e.target.value})
        this.change_flag = true;
    }

    getmAName = e => {
        this.setState({mA_value:e.target.value})
        this.change_flag = true;
    }

    getsecName = e => {
        this.setState({sec_value:e.target.value})
        this.change_flag = true;
    }

    getFEDName = e => {
        this.setState({fed_value:e.target.value})
        this.change_flag = true;
    }

    confirmCancel = () => {
      this.setState({
        confirm_message:'',
        isSaveConfirmModal:false,
        isCloseConfirmModal:false,
      })
    }

    confirmSave = async() => {
      this.confirmCancel();
      let path = "/app/api/v2/dial/print/x_ray_register";
      const post_data = {
          params: {
              patients:this.state.patient_list,
              body_part:this.state.radi_part_name!=''?this.state.radi_part_name:this.state.radi_part,
              number_of_directions:this.state.radi_direct,
              count:this.state.print_number,
              kvp:this.state.kvp_value!=''?this.state.kvp_value:this.state.kvp,
              ma:this.state.mA_value!=''?this.state.mA_value:this.state.ma,
              sec:this.state.sec_value!=''?this.state.sec_value:this.state.sec,
              fed:this.state.fed_value!=''?this.state.fed_value:this.state.fed,
          }
      };        
      await apiClient.post(path, post_data).then(()=>{            
          window.sessionStorage.setItem("alert_messages", "登録完了##" +  '照射録を登録しました。');
          this.props.handleOK();
      });
    }

    save = async() => {
        if (this.change_flag == false) return;
        if (this.state.radi_part_name != '' && this.state.radi_part_name.length>50){
            window.sessionStorage.setItem("alert_messages", '撮影部位は全角50文字以内で入力してください。');            
            return;
        }

        if (this.state.kvp_value != '' && this.state.kvp_value.length>10){
            window.sessionStorage.setItem("alert_messages", 'KVPは全角10文字以内で入力してください。');            
            return;
        }

        if (this.state.mA_value != '' && this.state.mA_value.length>10){
            window.sessionStorage.setItem("alert_messages", 'mAは全角10文字以内で入力してください。');            
            return;
        }

        if (this.state.sec_value != '' && this.state.sec_value.length>10){
            window.sessionStorage.setItem("alert_messages", 'secは全角10文字以内で入力してください。');            
            return;
        }

        if (this.state.fed_value != '' && this.state.fed_value.length>10){
            window.sessionStorage.setItem("alert_messages", 'FEDは全角10文字以内で入力してください。');            
            return;
        }
        this.setState({
          isSaveConfirmModal:true,
          confirm_message:'登録しますか？'
        })
    }

    render() {        
        let {radiation_part_codes, KVP_codes, mA_codes, sec_codes, FED_codes} = this.state;
        var directions = [
            {id:0, value:''},
            {id:1, value:'1'},
            {id:2, value:'2'},
            {id:3, value:'3'},
        ]
        return  (
            <Modal show={true} id="add_contact_dlg"  className="master-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>X線照射録登録</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className ="top-area">
                            <div className="flex">
                                <SelectorWithLabel
                                    options={radiation_part_codes}
                                    title="撮影部位"
                                    getSelect={this.getRadiationPart}
                                    departmentEditCode={this.state.radi_part}
                                />
                                <InputWithLabel
                                    label=''
                                    type="text"
                                    className="name-area"
                                    isDisabled = {this.state.radi_part!=''?true:false}
                                    getInputText={this.getRadiPartName.bind(this)}
                                    diseaseEditData={this.state.radi_part!=''?'':this.state.radi_part_name}
                                />
                            </div>                            
                            <SelectorWithLabel
                                options={directions}
                                title="方向"
                                getSelect={this.getDirection}
                                departmentEditCode={this.state.radi_direct}
                            />
                            <NumericInputWithUnitLabel
                                label='枚数'
                                value={this.state.print_number}                            
                                getInputText={this.getPrintNumber.bind(this)}
                                inputmode="numeric"
                            />
                        </div>
                        <div className="top-area">
                            <div className="flex">
                                <SelectorWithLabel
                                    options={KVP_codes}
                                    title="KVP"
                                    getSelect={this.getKVP}
                                    departmentEditCode={this.state.kvp}
                                />
                                <InputWithLabel
                                    label=''
                                    type="text"
                                    className="name-area"
                                    isDisabled = {this.state.kvp!=''?true:false}
                                    getInputText={this.getKVPName.bind(this)}
                                    diseaseEditData={this.state.kvp!=''?'':this.state.kvp_value}
                                />
                            </div>
                            <div className="flex">
                                <SelectorWithLabel
                                    options={mA_codes}
                                    title="mA"
                                    getSelect={this.getmA}
                                    departmentEditCode={this.state.ma}
                                />
                                <InputWithLabel
                                    label=''
                                    type="text"
                                    className="name-area"
                                    isDisabled = {this.state.ma!=''?true:false}
                                    getInputText={this.getmAName.bind(this)}
                                    diseaseEditData={this.state.ma!=''?'':this.state.mA_value}
                                />
                            </div>

                            <div className="flex">
                                <SelectorWithLabel
                                    options={sec_codes}
                                    title="sec"
                                    getSelect={this.getSec}
                                    departmentEditCode={this.state.sec}
                                />
                                <InputWithLabel
                                    label=''
                                    type="text"
                                    className="name-area"
                                    isDisabled = {this.state.sec!=''?true:false}
                                    getInputText={this.getsecName.bind(this)}
                                    diseaseEditData={this.state.sec!=''?'':this.state.sec_value}
                                />
                            </div>
                            <div className="flex">
                                <SelectorWithLabel
                                    options={FED_codes}
                                    title="FED"
                                    getSelect={this.getFED}
                                    departmentEditCode={this.state.fed}
                                />
                                <InputWithLabel
                                    label=''
                                    type="text"
                                    className="name-area"
                                    isDisabled = {this.state.fed!=''?true:false}
                                    getInputText={this.getFEDName.bind(this)}
                                    diseaseEditData={this.state.fed!=''?'':this.state.fed_value}
                                />
                            </div>
                        </div>                        
                    </Wrapper>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="cancel-btn" onClick={this.close}>キャンセル</Button>
                  <Button className={this.change_flag? 'red-btn':'disable-btn'} onClick={this.save}>照射録登録</Button>
                </Modal.Footer>
                {this.state.isCloseConfirmModal !== false && (
                  <SystemConfirmJapanModal
                      hideConfirm= {this.confirmCancel.bind(this)}
                      confirmCancel= {this.confirmCancel.bind(this)}
                      confirmOk= {this.closeModal.bind(this)}
                      confirmTitle= {this.state.confirm_message}
                  />
                )}
                {this.state.isSaveConfirmModal !== false && (
                  <SystemConfirmJapanModal
                      hideConfirm= {this.confirmCancel.bind(this)}
                      confirmCancel= {this.confirmCancel.bind(this)}
                      confirmOk= {this.confirmSave.bind(this)}
                      confirmTitle= {this.state.confirm_message}
                  />
                )}
            </Modal>
        );
    }
}

XRayRecordModal.contextType = Context;

XRayRecordModal.propTypes = {
    handleOK: PropTypes.func,
    closeModal: PropTypes.func,
    contents: PropTypes.array,
    cur_date: PropTypes.string,    
};

export default XRayRecordModal;
