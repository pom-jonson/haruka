import React from 'react'
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import auth from "~/api/auth";
import {
    midEmphasis,
    highEmphasis,
} from "~/components/_nano/colors";
const axios = require("axios");

const Card = styled.div`
 position: fixed;
 margin: 16px 0;
 top: 32px;
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
border-left: 8px solid red;
padding: 10px;
font-size: 16px;
display: inline-block;
margin-left: 5px; 
width: 100%;
margin-bottom: 20px
`;

const FormUpload = styled.div`
padding: 10px;
label {
    padding-right: 20px;
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
`;

class DocotrDataUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            file: null,
            isConfirmComplete:false,
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount(){
        auth.refreshAuth(location.pathname+location.hash);
    }
    openConfirmCompleteModal =(message)=>{
        this.setState({
            isConfirmComplete:true,
            complete_message: message,
        });
    };
    onFormSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        formData.append('bml_file',this.state.file);
        this.openConfirmCompleteModal('アップロード中');
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("/app/api/v2/karte/doctor_data/upload", formData, config)
        .then((response) => {
            this.setState({isConfirmComplete:false});
            if (response.data.result_count != undefined) {
                window.sessionStorage.setItem("alert_messages", "取り込み成功 "+(response.data.result_count.all_counts-response.data.result_count.skip_counts)+"行／依頼未登録 "+response.data.result_count.skip_counts+"行");
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
            
                <Title>医師名マスタ取り込み</Title>
                <FormUpload>
                <form onSubmit={this.onFormSubmit}>
                    <label>医師名マスタファイル</label>
                    <input type="file" name="bml_file" id="bml_file" onChange= {this.onChange} accept=".csv" />
                    <button className="common-btn" type="submit" id="btn">アップロード</button>
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

export default DocotrDataUpload