import React from 'react'
import styled from "styled-components";
import { surface } from "../../_nano/colors";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import * as colors from "~/components/_nano/colors";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as localApi from "~/helpers/cacheLocal-utils";

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
display:flex;
margin-left: 5px; 
width: 100%;
margin-bottom: 20px;
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
#bml_file, #btn{
    height:2rem;
}
`;

class Bml extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            file: null
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    onFormSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        formData.append('bml_file',this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("/app/api/v2/karte/inspection/results/upload/bml", formData, config)
        .then((response) => {
            if (response.data.result_count != undefined) {
                window.sessionStorage.setItem("alert_messages", "取り込み成功 "+(response.data.result_count.all_counts-response.data.result_count.skip_counts)+"行／依頼未登録 "+response.data.result_count.skip_counts+"行");
            } else if(response.data.alert_message) {
                window.sessionStorage.setItem("alert_messages", response.data.alert_message);
            }
        }).catch(() => {
            //  console.log(error);
        });
    }
    onChange(e) {
        this.setState({file:e.target.files[0]});
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
        return (
            <Card>
            <Wrapper>
                <Title>
                    <div>BML依頼・結果登録</div>
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
                    <label>依頼・結果DATファイル</label>
                    <input type="file" name="bml_file" id="bml_file" onChange= {this.onChange} accept=".dat" />
                    <button type="submit" id="btn">アップロード</button>
                </form>
                </FormUpload>
            </Wrapper>
            </Card>
        )
    }
}

Bml.contextType = Context;
Bml.propTypes = {
    history: PropTypes.object,
}
export default Bml