import React from 'react'
import styled from "styled-components";
import { surface } from "../../_nano/colors";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import RadioButton from "~/components/molecules/RadioButton";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import * as colors from "~/components/_nano/colors";
import * as karteApi from "~/helpers/cacheKarte-utils";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import {toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import auth from "~/api/auth";
import * as localApi from "~/helpers/cacheLocal-utils";
import {
  midEmphasis,
  highEmphasis,
} from "~/components/_nano/colors";
const axios = require("axios");

const Card = styled.div`
 position: fixed;
 margin: 0;
 top: 0px;
 width: calc(100% - 190px);

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
 `;


const Title = styled.div`
border-left: solid 5px #69c8e1;
padding: 10px;
font-size: 30px;
margin-left: 5px;
width: 100%;
margin-bottom: 20px;
display:flex;
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
  .button{
    span{
      word-break: keep-all;
    }
  }
.move-btn-area {
    margin-right:0;
    margin-left:auto;
}
`;

const FormUpload = styled.div`
padding: 10px;
label {
    padding-right: 20px;
}
.gender{
    margin-left: 5%;
    label {
        margin-right: 0.625rem;
        padding-right:0;
    }
    .radio-btn{
        margin-left: 0.625rem;
        label{
            border: solid 1px gray;
            border-radius:0;
            margin-left: 0.625rem;
        }
    }
}
.common-btn{
  background-color: rgb(255, 255, 255);
  border: 1px solid ${highEmphasis};
  padding:0 0.5rem;
  min-width: auto;
  height:2rem;
  line-height:2rem;
  color: ${highEmphasis};
  &:hover {
    border: 1px solid ${midEmphasis};
  }
  &:hover , svg {
    color: ${midEmphasis};
  }
  font-size: 1rem;
  letter-spacing: 0;
  font-weight: normal;
  font-family: MS Gothic;
  border-radius: 4px;
}
#bml_file, #btn{
    height:2rem;
}
.inputbox-area{
    label{
        padding-right:0;
        width: 9rem;
        margin-right:1rem;
        text-align:right;
    }
    input{
        width:8rem;
        margin-right:3rem;
    }
}
`;

class InHospital extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      file: null,
      confirm_message:"",
      complete_message:"",
      skip_state: 1,
      alert_messages:'',
      alert_title:'',
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  
  async componentDidMount() {
    auth.refreshAuth(location.pathname+location.hash);
  }
  
  onFormSubmit(e){
    e.preventDefault();
    const formData = new FormData();
    formData.append('in_hospital_file',this.state.file);
    formData.append('skip_state',parseInt(this.state.skip_state));
    formData.append('skip_record_number',this.state.skip_record_number);
    formData.append('get_record_number',this.state.get_record_number);
    formData.append('file_name',this.state.file_name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    this.setState({
      formData:formData,
      config:config,
      confirm_message:"登録しますか？"
    });
  }
  
  confirmCancel=()=>{
    this.setState({
      confirm_message:""
    });
  }
  
  register=()=>{
    this.setState({
      confirm_message:"",
      complete_message:"登録中",
    });
    axios.post("/app/api/v2/karte/inspection/results/upload/in_hospital", this.state.formData, this.state.config)
      .then((response) => {
        this.setState({
          complete_message:"",
        });
        if(response.data.error_message !== undefined){
          this.setState({
            alert_messages:response.data.error_message,
            alert_title:'エラー'
          })
          //  window.sessionStorage.setItem("alert_messages", "エラー##" + response.data.error_message + "\n");
        }
        if(response.data.alert_message) {
          window.sessionStorage.setItem("alert_messages", response.data.alert_message + "\n");
        }
      }).catch(() => {
      this.setState({
        complete_message:"",
      });
      window.sessionStorage.setItem("alert_messages", "アップロード失敗しました。");
      
    });
    
  }
  
  onChange(e) {
    this.setState({
      file:e.target.files[0],
      file_name:e.target.files[0].name
    });
  }
  
  selectSkip = (e) => {
    this.setState({ skip_state:e.target.value});
  };
  
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
  
  getInputText = (name, e) => {
    let input_value = e.target.value.replace(/[^0-9０-９]/g, "");
    if (input_value != "") {
      input_value = parseInt(toHalfWidthOnlyNumber(input_value));
    }
    this.setState({[name]:input_value});
  }
  
  closeModal = () => {
    this.setState({
      alert_messages:'',
      alert_title:''
    })
  }
  
  render() {
    return (
      <Card>
        <Wrapper>
          <Title>
            <div>院内検体検査結果登録</div>
            {karteApi.getEditPatientList() != undefined && karteApi.getEditPatientList() != null && karteApi.getEditPatientList().length > 0 && (
              <>
                <div className={'move-btn-area'}>
                  <Button className="tab-btn button close-back-btn" onClick={this.gotoSoap}>閉じる</Button>
                </div>
              </>
            )}
          </Title>
          <FormUpload>
            <form onSubmit={this.onFormSubmit}>
              <div className='flex'>
                <label style={{paddingTop:'4px'}}>院内検体検査結果CSVファイル</label>
                <input type="file" name="bml_file" id="bml_file" onChange= {this.onChange} accept=".csv" />
                <button className="common-btn" type="submit" id="btn">アップロード</button>
                <div className="gender">
                  <label className="gender-label">同じ項目の取り扱い</label>
                  <RadioButton
                    id={0}
                    value={0}
                    label="上書き"
                    name="gender"
                    getUsage={this.selectSkip}
                    checked={this.state.skip_state == 0}
                  />
                  <RadioButton
                    id={1}
                    value={1}
                    label="スキップ"
                    name="gender"
                    getUsage={this.selectSkip}
                    checked={this.state.skip_state == 1}
                  />
                </div>
              </div>
              <div className="inputbox-area flex">
                <InputWithLabelBorder
                  label="スキップする行数"
                  type="text"
                  className=""
                  getInputText={this.getInputText.bind(this, 'skip_record_number')}
                  diseaseEditData={this.state.skip_record_number}
                />
                <InputWithLabelBorder
                  label="取り込む行数"
                  type="text"
                  className=""
                  getInputText={this.getInputText.bind(this, 'get_record_number')}
                  diseaseEditData={this.state.get_record_number}
                />
              </div>
            </form>
          </FormUpload>
        </Wrapper>
        {this.state.confirm_message !== "" && (
          <SystemConfirmModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.register.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title = {this.state.alert_title}
            showTitle = {true}
          />
        )}
      </Card>
    )
  }
}

InHospital.contextType = Context;
InHospital.propTypes = {
  history: PropTypes.object,
}
export default InHospital