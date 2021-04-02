import React from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import RadioButton from "../../../molecules/RadioButton";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import { medicalInformationValidate } from '~/helpers/validate'
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import Context from "~/helpers/configureStore";

const axios = require("axios");

const Card = styled.div`
  position: fixed;
  margin: 1rem 0;
  top: 2rem;
  width: calc(100% - 190px);
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  padding: 1.25rem;
  background-color: ${surface};

  border-width: 1px;
  border-style: solid;
  border-color: rgb(213, 213, 213);
  border-image: initial;
  border-radius: 0.25rem;
  padding: 0.5rem 0.5rem 0.5rem 0px;
`;

const Title = styled.div`
  border-left: 0.5rem solid red;
  padding: 0.625rem;
  font-size: 2rem;
  display: inline-block;
  margin-left: 0.3rem;
  width: 100%;
  margin-bottom: 1.25rem;
`;

const FormUpload = styled.div`
  display: flex;
  padding: 0.625rem;
  label {
    padding-right: 1.25rem;
  }
  .gender {
    margin-left: 50px;
    label {
      margin-right: 0.625rem;
      padding-right: 0;
    }
    .radio-btn {
      margin-left: 0.625rem;
      label {
        border: solid 1px gray;
        border-radius: 0;
        margin-left: 0.625rem;
      }
    }
  }
`;

class JCLExamUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      skip_state: 0,
      isConfirmComplete: false,
      check_message:"",
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  
  componentDidMount() {
    this.changeBackground();
  }

  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {
    medicalInformationValidate("JCLExamUpload", this.state, "background");
  }

  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
  };

  closeAlertModal = () => {
    this.setState({check_message: ''});
    $("#" + this.state.first_tag_id).focus();
  }

  onFormSubmit(e) {
    e.preventDefault();
    let validate_data = medicalInformationValidate("JCLExamUpload", this.state);
    if (validate_data['error_str_arr'].length > 0 ) {
        this.setState({
          check_message:validate_data['error_str_arr'].join('\n'),
          first_tag_id:validate_data['first_tag_id']
        });
        return;
    }
    const formData = new FormData();
    formData.append("jcl_file", this.state.file);
    formData.append("skip_state", parseInt(this.state.skip_state));
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    this.openConfirmCompleteModal("アップロード中");
    axios
      .post("/app/api/v2/dial/jcl_exam/results/upload", formData, config)
      .then((response) => {
        this.setState({ isConfirmComplete: false });
        if (response.data.result_count != undefined) {
          window.sessionStorage.setItem(
            "alert_messages",
            "取り込み成功 " +
              (response.data.result_count.all_counts -
                response.data.result_count.skip_counts) +
              "行／未登録 " +
              response.data.result_count.skip_counts +
              "行"
          );
        } else if (response.data.alert_message) {
          window.sessionStorage.setItem(
            "alert_messages",
            response.data.alert_message
          );
        }
      })
      .catch(() => {
        this.setState({ isConfirmComplete: false });
        window.sessionStorage.setItem(
          "alert_messages",
          "アップロード失敗しました。"
        );
      });
  }
  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }
  selectSkip = (e) => {
    this.setState({ skip_state: e.target.value });
  };

  render() {
    return (
      <Card>
        <Wrapper>
          <Title>日本臨床検査結果登録</Title>
          <FormUpload>
            <form onSubmit={this.onFormSubmit}>
              <label>検査データファイル</label>
              <input
                type="file"
                name="jcl_file"
                // id="jcl_file"
                id="file_id"
                onChange={this.onChange}
                accept=".dat"
              />
              <button type="submit" id="btn">
                アップロード
              </button>
            </form>
            <div className="gender">
              <label className="gender-label">同一項目</label>
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
          </FormUpload>
          {this.state.isConfirmComplete !== false && (
            <CompleteStatusModal message={this.state.complete_message} />
          )}
          {this.state.check_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.check_message}
            />
          )}
        </Wrapper>
      </Card>
    );
  }
}
JCLExamUpload.contextType = Context;

export default JCLExamUpload;
