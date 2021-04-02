import React, {} from 'react'
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
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
margin-bottom: 1.25rem
`;

const FormUpload = styled.div`
padding: 0.625rem;
label {
    padding-right: 1.25rem;
}
`;

class ClinicalMasterUpdate extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            file: null,
            isConfirmComplete:false,
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    openConfirmCompleteModal =(message)=>{
        this.setState({
            isConfirmComplete:true,
            complete_message: message,
        });
    };
    onFormSubmit(e){
        e.preventDefault();
        if(this.state.file == null){
            window.sessionStorage.setItem("alert_messages", "マスタデータファイルを選択してください。");
            return;
        }
        if (this.context.$canDoAction(this.context.FEATURES.DIAL_CLINICAL_MASTER,this.context.AUTHS.EDIT, 0) === false) {
            window.sessionStorage.setItem("alert_messages","権限がありません。");
            return;
        }
        const formData = new FormData();
        formData.append('jcl_file',this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        this.openConfirmCompleteModal('アップロード中');
        axios.post("/app/api/v2/dial/master/jcl_inspection/results/upload", formData, config)
        .then((response) => {
            this.setState({isConfirmComplete:false,})
            if (response.data.result_count != undefined) {
                window.sessionStorage.setItem("alert_messages", "取り込み成功 "+(response.data.result_count.all_counts-response.data.result_count.skip_counts)+"行／未登録 "+response.data.result_count.skip_counts+"行");
            } else if(response.data.alert_message) {
                window.sessionStorage.setItem("alert_messages", response.data.alert_message);
            }
        }).catch(() => {
            this.setState({isConfirmComplete:false});
            window.sessionStorage.setItem("alert_messages", "アップロード失敗しました。");
        });
    }
    onChange(e) {
        this.setState({file:e.target.files[0]});
    }

    render() {
        return (
            <Card>
            <Wrapper>
                <Title>日本臨床検査マスタ更新</Title>
                <FormUpload>
                <form onSubmit={this.onFormSubmit}>
                    <label>マスタデータファイル</label>
                    <input type="file" name="jcl_file" id="jcl_file" onChange= {this.onChange} accept=".csv" />
                    <button type="submit" id="btn">アップロード</button>
                </form>

                </FormUpload>
                {this.state.isConfirmComplete !== false && (
                    <CompleteStatusModal
                        message = {this.state.complete_message}
                    />
                )}
            </Wrapper>
            </Card>
        )
    }
}
ClinicalMasterUpdate.contextType = Context;

export default ClinicalMasterUpdate