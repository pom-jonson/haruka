import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";
import Spinner from "react-bootstrap/Spinner";
import PropTypes from "prop-types";
import auth from "~/api/auth";
import renderHTML from 'react-render-html';
import Button from "~/components/atoms/Button";
import * as colors from "~/components/_nano/colors";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as localApi from "~/helpers/cacheLocal-utils";

const Card = styled.div`
  width: 100%;
  margin: 0px;
  height: 100vh;
  background-color: ${surface};
  padding: 20px;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
    margin-bottom: 20px;
    display:flex;
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
  }
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 40%;
  display: table-caption;
  position: absolute;
  top: 30%;
`;
class BulletinRead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content:'',
      isLoad: false,
    };
  }
  
  async UNSAFE_componentWillMount() {
    await apiClient.get("/app/api/v2/admin/entrance_bulletin_board/get").then((res) => {
      this.setState({
        content: res.body !== undefined ? res.body : '',
        isLoad: true,
      });
    });
    auth.refreshAuth(location.pathname+location.hash);
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
    let {content, isLoad} = this.state;
    return (
      <Card>
        <div className="title">
          <div>お知らせ閲覧</div>
          {karteApi.getEditPatientList() != undefined && karteApi.getEditPatientList() != null && karteApi.getEditPatientList().length > 0 && (
            <>
              <div className={'move-btn-area'}>
                <Button className="tab-btn button close-back-btn" onClick={this.gotoSoap}>閉じる</Button>
              </div>
            </>
          )}
        </div>
        {isLoad ?(
          <div>{renderHTML(content)}</div>
        ):(
          <div className='text-center'>
            <SpinnerWrapper>
              <Spinner animation="border" variant="secondary" />
            </SpinnerWrapper>
          </div>
        )}
      </Card>
    )
  }
}
BulletinRead.contextType = Context;

BulletinRead.propTypes = {
  history: PropTypes.object
};

export default BulletinRead