import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "../../_nano/colors";
import Button from "../../atoms/Button";
import * as apiClient from "~/api/apiClient";
import CKEditor from 'ckeditor4-react';
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";
import auth from "~/api/auth";
import * as colors from "~/components/_nano/colors";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as localApi from "~/helpers/cacheLocal-utils";

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;

    button {
        margin-bottom: 10px;
        margin-left: 10px;
    }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  padding: 20px;
  background-color: ${surface};
  border-width: 1px;
  border-style: solid;
  border-color: rgb(213, 213, 213);
  border-image: initial;
  border-radius: 4px;
  padding: 8px 8px 8px 0px;

  .cke_editor_editor2, .cke_editor_editor1{
    margin-left: 10px;
  }

  .cke_contents{
    height: 60vh !important;
  }
 `;

const Title = styled.div`
padding: 10px;
font-size: 14px;
display: flex;
margin-left: 5px;
width: 100%;
margin-bottom: 20px;
align-items: center;
button {
  background-color: ${colors.surface};
  min-width: auto;
  margin-left: 9px;
  padding: 8px 12px;
}
.tab-btn{
  background: rgb(208, 208, 208);
  span{
    font-weight: normal;
    color: black;
  }
}
.move-btn-area {
  margin-right:0;
  margin-left:auto;
  padding-top:0.5rem;
}
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 40vw;
  display: table-caption;
  position: absolute;
  top: 230px;
`;

const config = {
  
  toolbarGroups: [
    {name: 'document', groups: ['mode', 'document', 'doctools']},
    {name: 'clipboard', groups: ['clipboard', 'undo']},
    {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
    {name: 'forms', groups: ['forms']},
    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
    {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
    {name: 'links', groups: ['links']},
    {name: 'insert', groups: ['insert']},
    {name: 'styles', groups: ['styles']},
    {name: 'colors', groups: ['colors']},
    {name: 'tools', groups: ['tools']},
    {name: 'others', groups: ['others']},
    // {name: 'about', groups: ['about']},
    '/',
    '/'
  ],
  extraPlugins : ['colorbutton','font'],
  format_tags: 'p;h1;h2;h3;h4;h5;h6;pre;address;div',
  language:'ja',
  removeButtons: 'Maximize'
  // removeButtons: 'ImageButton,about'
};


class Bulletin extends Component {
  
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      content: '',
      isLoad: false,
      created_at: "",
      isConfirmModal: false,
    }
  }
  
  async componentDidMount() {
    if(!this.context.$canDoAction(this.context.FEATURES.NOTIFICATION,this.context.AUTHS.EDIT)) {
      this.props.history.replace("/");
    }
    let result;
    await apiClient.get("/app/api/v2/admin/entrance_bulletin_board/get").then((res) => {
      result = res;
    })
    this.setState({
      content: result.body !== undefined ? result.body : '',
      created_at: result.created_at !== undefined? result.created_at: '',
      isLoad: true,
    });
    auth.refreshAuth(location.pathname+location.hash);
  }
  
  onChange(evt){
    var newContent = evt.editor.getData();
    this.setState({
      content: newContent
    });
  }
  
  keyDown=(evt)=>{
    var newContent = evt.editor.getData();
    this.setState({
      content: newContent
    });
  }
  
  saveContent = () => {
    if(this.state.content.length == 0){
      window.sessionStorage.setItem("alert_messages", "お知らせコンテンツを入力してください。");
      return;
    }
    if (this.state.created_at.length > 0 ) {
      this.setState({
        isConfirmModal: true,
        confirm_message: "更新しますか？"
      });
    } else {
      this.registerBulletion();
    }
  }
  
  registerBulletion = async () => {
    this.setState({
      isConfirmModal: false,
      confirm_message: "",
    });
    let path = "/app/api/v2/admin/entrance_bulletin_board/edit";
    const post_data = {
      body: this.state.content
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res)
          window.sessionStorage.setItem("alert_messages", res.alert_message);
      })
      .catch(() => {
        window.sessionStorage.setItem("alert_messages", "通信に失敗しました。");
      });
  };
  
  confirmCancel() {
    this.setState({
      isConfirmModal: false,
      confirm_message: "",
    });
  }
  
  gotoSoap = () => {
    let patient_info = karteApi.getLatestVisitPatientInfo();
    if (patient_info == undefined || patient_info == null) {
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
      if (current_system_patient_id > 0) {
        this.props.history.replace(`/patients/${current_system_patient_id}/soap`);
      }
    } else {
      this.props.history.replace(`/patients/${patient_info.patient_id}/soap`);
    }
  }
  
  render() {
    let isLoad = this.state.isLoad;
    return (
      <Card>
        <Wrapper>
          {isLoad ? (
            <>
              <Title>
                <div>最終更新日時: {this.state.created_at.length > 0 ? this.state.created_at.replace(/-/g, "/"): ""}</div>
                {karteApi.getEditPatientList() != undefined && karteApi.getEditPatientList() != null && karteApi.getEditPatientList().length > 0 && (
                  <>
                    <div className={'move-btn-area'}>
                      <Button className="tab-btn button close-back-btn" onClick={this.gotoSoap}>閉じる</Button>
                    </div>
                  </>
                )}
              </Title>
              <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.saveContent.bind(this)}>更新</Button>
              <CKEditor
                activeClass="p10"
                data={this.state.content}
                config={config}
                onChange={this.onChange}
                onKey={this.keyDown}
              />
            </>
          ): (
            <div className='text-center'>
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            </div>
          )}
        </Wrapper>
        {this.state.isConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.registerBulletion.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
      </Card>
    )
  }
}
Bulletin.contextType = Context;

Bulletin.propTypes = {
  history: PropTypes.object
};
export default Bulletin