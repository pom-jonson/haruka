import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import {formatDateSlash, formatTimeIE} from "~/helpers/date";
import Spinner from "react-bootstrap/Spinner";
import PatientStickyNote from "~/components/templates/Ward/PatientStickyNote";

const Wrapper = styled.div`
  width:100%;
  height:100%;
  font-size: 1rem;
  .table-area {
    table {
      font-size: 1rem;
      margin-bottom: 0;
    }
    thead{
      margin-bottom: 0;
      display:table;
      width:100%;        
      tr{width: calc(100% - 17px);}
    }
    tbody{
      height: calc(60vh - 14rem);
      overflow-y: scroll;
      display:block;
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;
        text-align: left;
        vertical-align: middle;
        border-bottom: 1px solid #dee2e6;
    }
    th {
        text-align: center;
        padding: 0.3rem;
        border-bottom: 1px solid #dee2e6;
    }  
    .new-td {
      text-align: center;
      color: blue;
      cursor: pointer;
    }
  }
 `;

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;


class SetBedBackgroundModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loaded:false,
      sticky_note_list:[],
      isOpenPatientStickyNote:false,
    };
    this.can_register = false;
    this.register_flag = false;
  }

  async componentDidMount () {
    if (this.context.$canDoAction(this.context.FEATURES.WARD_MAP_BED_BACKGROUND, this.context.AUTHS.REGISTER)) {
      this.can_register = true;
    }
    await this.getPatientStickyNote();
  }

  getPatientStickyNote=async()=>{
    if(this.state.is_loaded){
      this.setState({is_loaded:false});
    }
    let path = "/app/api/v2/ward/get/patient_sticky_note_info";
    let post_data = {
      patient_id:this.props.patient_info.patient_id,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          sticky_note_list:res,
          is_loaded:true,
        });
      })
      .catch(() => {

      });

  }

  openPatientStickyNote=()=>{
    this.setState({isOpenPatientStickyNote:true});
  }

  closeModal=(act)=>{
    this.setState({isOpenPatientStickyNote:false}, ()=>{
      if(act == "register"){
        this.register_flag = true;
        this.getPatientStickyNote();
      }
    });
  }

  confirmClose=()=>{
    if(this.register_flag){
      this.props.closeModal('register');
    } else {
      this.props.closeModal();
    }
  }

  render() {
    return  (
      <Modal show={true} id="add_contact_dlg"  className="first-view-modal set-bed-background">
        <Modal.Header>
          <Modal.Title>ベッド背景色</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={'table-area'}>
              <table className="table-scroll table table-bordered">
                <thead>
                <tr>
                  <th style={{width:"9rem"}}>記載日</th>
                  <th style={{width:"15rem"}}>種類名</th>
                  <th>概要</th>
                  <th style={{width:"20rem"}}>登録者名</th>
                </tr>
                </thead>
                <tbody>
                {this.state.is_loaded ? (
                  <>
                    {this.state.sticky_note_list.length > 0 && (
                      this.state.sticky_note_list.map(item=>{
                        return (
                          <>
                            <tr onContextMenu={e => this.handleClick(e, item)}>
                              <td style={{width:"9rem"}}>{formatDateSlash(item.start_datetime.split("-").join("/")) + " " + formatTimeIE(item.start_datetime.split("-").join("/"))}</td>
                              <td style={{width:"15rem"}}>{item.name}</td>
                              <td>{item.title}</td>
                              <td style={{width:"20rem"}}>{item.staff_name}</td>
                            </tr>
                          </>
                        )
                      })
                    )}
                    {this.can_register && (
                      <tr onClick={this.openPatientStickyNote.bind(this)}>
                        <td colSpan={'4'} className={'new-td'}>新規に入力</td>
                      </tr>
                    )}
                  </>
                ):(
                  <tr>
                    <td colSpan={'13'} style={{height:"10rem"}}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.confirmClose.bind(this)}>キャンセル</Button>
        </Modal.Footer>
        {this.state.isOpenPatientStickyNote && (
          <PatientStickyNote
            closeModal= {this.closeModal.bind(this)}
            system_patient_id={this.props.patient_info.patient_id}
          />
        )}
      </Modal>
    );
  }
}

SetBedBackgroundModal.contextType = Context;

SetBedBackgroundModal.propTypes = {
  closeModal: PropTypes.func,
  patient_info: PropTypes.func,
};

export default SetBedBackgroundModal;
