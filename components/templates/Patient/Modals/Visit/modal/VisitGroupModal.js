import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import Spinner from "react-bootstrap/Spinner";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  min-height: 160px;
  label {
    text-align: right;
    width: 80px;
  }
  input {
    width: 400px;
    font-size: 1rem;
  }
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 1rem;
    width: 180px;
    text-align: right;
    margin: 0;
    margin-right: 8px;
    line-height: 38px;
   }
   .place-label {
    width: 180px;
    text-align: right;
    margin-right: 8px;
   }
   .label-name {
    width: calc(100% - 188px);
    word-break: break-all;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    padding-left: 180px;
    label{
        font-size: 16px;
        width: 100px;
    }
  }
  .short-input-group{
    display:flex;
    input{
        width:130px;
    }
  }
  .pullbox{
      margin-top:10px;
  }
  .pullbox-label, .pullbox-select{
      width:400px;
  }
  .label-unit{
      display:none;
  }
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }  
 `;

const SpinnerWrapper = styled.div`
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
 `;


class VisitGroupModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    var title = "", id;
    var place_list = [{id:0,value:''}];
    switch(this.props.kind){
      case 0:
        title = '訪問診療グループ';
        id = modal_data !== null ? modal_data.visit_group_id : '';
        break;
      case 1:
        title = '訪問診療先';
        id = modal_data !== null ? modal_data.visit_place_id : '';
        break;
    }

    this.state = {
      kind:this.props.kind,
      is_enabled: modal_data !== null?modal_data.is_enabled:1,
      number: modal_data !== null ? modal_data.number : 0,
      order: modal_data !== null ? modal_data.order : 0,
      visit_place_id: modal_data !== null ? modal_data.visit_place_id :(this.props.visit_place_id > 0? this.props.visit_place_id: undefined),
      visit_group_id: (modal_data !== null && modal_data.visit_group_id != undefined)? modal_data.visit_group_id : undefined,
      id,
      title,
      name:modal_data !== null?modal_data.name:undefined,
      long_name:modal_data !== null?modal_data.long_name:undefined,
      name_kana:modal_data !== null?modal_data.name_kana:undefined,
      short_name:modal_data !== null ? modal_data.short_name : undefined,
      isUpdateConfirmModal: false,
      isCloseConfirm: false,
      confirm_message:"",
      place_list,
      load_flag:props.kind == 0 ? false : true,
    }
    this.change_flag = 0;
  }

  async UNSAFE_componentWillMount (){
    if (this.props.kind == 0){
      await this.getPlaceInfo();
    }
  }

  getPlaceInfo = async() => {
    let path = '';
    let post_data;
    path = "/app/api/v2/visit/get/visit_place";
    post_data = {is_enabled:1};

    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        var place_list = [{id:0,value:''}];
        if (res.length>0){
          res.map(item => {
            place_list.push({id:item.visit_place_id, value:item.name});
          })
        }
        this.setState({
          place_list,
          load_flag:true
        });
      })
  }

  getAlwaysShow = (name, value) => {
    if(name==="alwaysShow"){
      this.setState({is_enabled: value})
    }
  };
  getMasterID = e => {
    switch(this.props.kind){
      case 0:
        this.setState({id:parseInt(e), visit_group_id:parseInt(e)});
        break;
      case 1:
        this.setState({id:parseInt(e), visit_place_id:parseInt(e)});
        break;
    }
  };

  getName = e => {
    this.change_flag = 1;
    if(e.target.value.length > 100){
      window.sessionStorage.setItem("alert_messages", this.state.title + '名は100文字以内で入力してください。');
    } else {
      this.setState({name: e.target.value});
    }
  };

  getNameKana = e => {
    this.change_flag = 1;
    if(e.target.value.length > 100){
      window.sessionStorage.setItem("alert_messages", 'カナ名称は100文字以内で入力してください。');
    } else {
      this.setState({name_kana: e.target.value});
    }
  };

  getLongName = e => {
    this.change_flag = 1;
    if(e.target.value.length > 100){
      window.sessionStorage.setItem("alert_messages", '訪問診療先正式名称は100文字以内で入力してください。');
    } else {
      this.setState({long_name: e.target.value});
    }
  };

  setShortName = e => {
    this.change_flag = 1;
    if(e.target.value.length > 100){
      window.sessionStorage.setItem("alert_messages", '略名は100文字以内で入力してください。');
    } else {
      this.setState({short_name: e.target.value});
    }
  };

  async registerMaster()  {
    let path = '';
    const post_data = {
      params: this.state
    };
    switch(this.props.kind){
      case 0:
        path = "/app/api/v2/visit/register_group";
        break;
      case 1:
        path = "/app/api/v2/visit/register_place";
        break;
    }
    await apiClient.post(path, post_data).then((res)=>{
      if (res){
        window.sessionStorage.setItem("alert_messages", res.alert_message);
        if (res.visit_group_id) {
          this.setState({
            id: res.visit_group_id
          });
        } else if(res.visit_place_id) {
          this.setState({
            id: res.visit_place_id
          });
        }
      }
    });
  }

  handleOk = () => {
    if(this.state.name === ''){
      window.sessionStorage.setItem("alert_messages", '名称を入力してください。');
      return;
    }
    if(this.props.kind==0 && (this.state.visit_place_id == undefined || this.state.visit_place_id ==0)){
      window.sessionStorage.setItem("alert_messages", '訪問診療先を選択してください。');
      return;
    }

    if(this.props.modal_data !== null){
      this.setState({
        isUpdateConfirmModal : true,
        confirm_message: this.state.title + "情報を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal : true,
        confirm_message: "この内容で登録しますか？",
      });
    }
  };

  register = () => {
    this.confirmCancel();
    this.registerMaster().then(() => {
      this.props.handleOk(this.state.id);
    });
  }

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isCloseConfirm: false,
      confirm_message: "",
    });
  }

  getOrder = e => {
    this.setState({order: parseInt(e)})
  };

  getHalfKana = e => {
    this.change_flag = 1;
    var converted_kana_name = this.zenkakuToHankaku(e.target.value);
    this.setState({name_kana: converted_kana_name});
  }

  zenkakuToHankaku = (mae) => {
    let zen = new Array(
      'ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ'
      ,'サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト'
      ,'ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ'
      ,'マ','ミ','ム','メ','モ','ヤ','ヰ','ユ','ヱ','ヨ'
      ,'ラ','リ','ル','レ','ロ','ワ','ヲ','ン'
      ,'ガ','ギ','グ','ゲ','ゴ','ザ','ジ','ズ','ゼ','ゾ'
      ,'ダ','ヂ','ヅ','デ','ド','バ','ビ','ブ','ベ','ボ'
      ,'パ','ピ','プ','ペ','ポ'
      ,'ァ','ィ','ゥ','ェ','ォ','ャ','ュ','ョ','ッ'
      ,'゛','°','、','。','「','」','ー','・',
    );
    let hirakana = new Array(
      'あ','い','う','え','お','か','き','く','け','こ'
      ,'さ','し','す','せ','そ','た','ち','つ','て','と'
      ,'な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ'
      ,'ま','み','む','め','も','や','い','ゆ','え','よ'
      ,'ら','り','る','れ','ろ','わ','を','ん'
      ,'が','ぎ','ぐ','げ','ご','ざ','じ','ず','ぜ','ぞ'
      ,'だ','ぢ','づ','で','ど','ば','び','ぶ','べ','ぼ'
      ,'ぱ','ぴ','ぷ','ぺ','ぽ'
      ,'ぁ','ぃ','ぅ','ぇ','ぉ','ゃ','ゅ','ょ','っ'
      ,'゛','°','、','。','「','」','ー','・',
    );

    let han = new Array(
      'ｱ','ｲ','ｳ','ｴ','ｵ','ｶ','ｷ','ｸ','ｹ','ｺ'
      ,'ｻ','ｼ','ｽ','ｾ','ｿ','ﾀ','ﾁ','ﾂ','ﾃ','ﾄ'
      ,'ﾅ','ﾆ','ﾇ','ﾈ','ﾉ','ﾊ','ﾋ','ﾌ','ﾍ','ﾎ'
      ,'ﾏ','ﾐ','ﾑ','ﾒ','ﾓ','ﾔ','ｲ','ﾕ','ｴ','ﾖ'
      ,'ﾗ','ﾘ','ﾙ','ﾚ','ﾛ','ﾜ','ｦ','ﾝ'
      ,'ｶﾞ','ｷﾞ','ｸﾞ','ｹﾞ','ｺﾞ','ｻﾞ','ｼﾞ','ｽﾞ','ｾﾞ','ｿﾞ'
      ,'ﾀﾞ','ﾁﾞ','ﾂﾞ','ﾃﾞ','ﾄﾞ','ﾊﾞ','ﾋﾞ','ﾌﾞ','ﾍﾞ','ﾎﾞ'
      ,'ﾊﾟ','ﾋﾟ','ﾌﾟ','ﾍﾟ','ﾎﾟ'
      ,'ｧ','ｨ','ｩ','ｪ','ｫ','ｬ','ｭ','ｮ','ｯ'
      ,'ﾞ','ﾟ','､','｡','｢','｣','ｰ','･'
    );

    let ato = "";
    for (let i=0;i<mae.length;i++){
      let maechar = mae.charAt(i);
      let zenindex = zen.indexOf(maechar);
      let hindex = hirakana.indexOf(maechar);
      if(zenindex >= 0){
        maechar = han[zenindex];
      } else if(hindex >= 0) {
        maechar = han[hindex];
      }
      ato += maechar;
    }
    return ato;
  }

  confirmClose=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        isCloseConfirm:true,
      });
    } else {
      this.props.closeModal();
    }
  }

  render() {
    return  (
      <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>{this.state.title}{this.props.modal_data != null?'編集':'登録'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {this.state.load_flag ? (
              <>
                <div className="checkbox_area">
                  <Checkbox
                    label="常に表示"
                    getRadio={this.getAlwaysShow.bind(this)}
                    value={this.state.is_enabled}
                    checked = {this.state.is_enabled ===1}
                    name="alwaysShow"
                  />
                </div>
                <div className="short-input-group">
                  {this.props.kind == 0 && (
                    <NumericInputWithUnitLabel
                      label="表示順"
                      value={this.state.order}
                      getInputText={this.getOrder.bind(this)}
                      inputmode="numeric"
                    />
                  )}
                </div>
                {this.props.kind == 0 && (
                  <div style={{display:"flex", paddingTop:"8px"}}>
                    <div className={'place-label'}>訪問診療先</div>
                    <div className={'label-name'}>{this.state.place_list.find(x => x.id === this.state.visit_place_id) !== undefined ? this.state.place_list.find(x => x.id === this.state.visit_place_id).value : ''}</div>
                  </div>
                )}
                <InputWithLabel
                  label={this.state.title + '名'}
                  type="text"
                  className="name-area"
                  getInputText={this.getName.bind(this)}
                  diseaseEditData={this.state.name}
                />
                {this.props.kind == 1 && (
                  <InputWithLabel
                    label='訪問診療先正式名称'
                    type="text"
                    className="name-area"
                    getInputText={this.getLongName.bind(this)}
                    diseaseEditData={this.state.long_name}
                  />
                )}
                <InputWithLabel
                  label={'カナ名称'}
                  type="text"
                  className="name-area"
                  getInputText={this.getNameKana.bind(this)}
                  onBlur={this.getHalfKana.bind(this)}
                  diseaseEditData={this.state.name_kana}
                />
                {this.props.kind == 0 && (
                  <InputWithLabel
                    label='略名'
                    type="text"
                    className="name-area"
                    getInputText={this.setShortName.bind(this)}
                    diseaseEditData={this.state.short_name}
                  />
                )}
              </>
            ):(
              <div style={{minHeight:this.props.kind == 0 ? "240px" : ""}}>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            )}
          </Wrapper>
          {this.state.isUpdateConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.register.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isCloseConfirm && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.props.closeModal}
              confirmTitle={this.state.confirm_message}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.confirmClose}>キャンセル</Button>
          <Button className="red-btn" onClick={this.handleOk}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

VisitGroupModal.contextType = Context;

VisitGroupModal.propTypes = {
  closeModal : PropTypes.func,
  handleOk : PropTypes.func,
  modal_data : PropTypes.object,
  kind : PropTypes.number,
  visit_place_id : PropTypes.number
};

export default VisitGroupModal;
