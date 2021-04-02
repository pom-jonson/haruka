import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  display: block;
  font-size: 18px;
  width: 100%;
  height: 50vh;
  overflow-y: auto;
  text-align: center;
  button {
    margin-left: auto;
    margin-right: auto;
  }
.no-result {
  padding: 120px;
  text-align: center;
  font-size: 1rem;
  span {
    padding: 10px;
    border: 2px solid #aaa;
  }
}
.set-title {
    td {
        background-color: blue;
        color:white;
    }
 }
 table {
    td {padding: 5px;}
 }
 
 `;

class PrescriptionPatternConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_json: null,
      is_loaded: false
    };
  }
  
  componentDidMount () {
    this.getFromPattern();
    let base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal != undefined) base_modal.style['z-index'] = 1040;
  }
  
  componentWillUnmount() {
    let base_modal = document.getElementsByClassName("edit-prescript-modal")[0];
    if (base_modal != undefined) base_modal.style['z-index'] = 1050;
  }
  
  getFromPattern = async () => {
    let path = "/app/api/v2/dial/pattern/get_prescription_from_pattern";
    const params = {
      system_patient_id: this.props.system_patient_id,
      schedule_date: this.props.schedule_date,
      regular_prescription_number:this.props.regular_prescription_number,
    };
    await apiClient.post(path, {params}).then(res=>{
      if(res.data_json != undefined){
        this.setState({
          data_json:res.data_json,
          current_pattern_number:res.number,
          is_loaded: true
        });
      } else {
        this.setState({is_loaded: true})
      }
    }).catch(()=>{
    });
  };
  
  onHide=()=>{};
  
  render() {
    let {data_json} = this.state;
    return  (
      <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal">
        <Modal.Header >
          <Modal.Title>パターン確認: 定期{this.props.regular_prescription_number}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {this.state.is_loaded ? (
              <table className="table-scroll table table-bordered" id="code-table">
                <tbody>
                {data_json != undefined && data_json !== null ? data_json.map((item, rp_index)=>{
                  return (
                    <>
                      <tr className="set-title" key={rp_index+1}>
                        <td className="text-center" style={{width:"5%"}}>{rp_index+1}</td>
                        <td className="text-left" colSpan={3}>{item.prescription_category}処方</td>
                      </tr>
                      {item.medicines !== undefined && item.medicines != null && item.medicines.length > 0 && item.medicines.map((medi_item, medi_index)=>{
                        return (
                          <tr key={medi_index}>
                            <td />
                            <td className="text-left" style={{width:"56%"}}>{medi_item.item_name}</td>
                            <td className="text-center" style={{width:"50px"}}>{medi_item.amount}</td>
                            <td className="text-left"><div className="ml-1">{medi_item.unit}{medi_item.is_not_generic == 1 ? "【後発変更不可】": ""}</div></td>
                          </tr>
                        )
                      })}
                      <tr>
                        <td />
                        <td className="text-left" colSpan={3}>
                          {item.usage_name}
                          {item.days !== undefined && item.days !== null && item.disable_days_dosing == 0? "("+item.days+(item.prescription_category === "頓服"? "回分)" : "日分)") : ""}
                        </td>
                      </tr>
                      {item.free_comment !== undefined && item.free_comment != null && item.free_comment.length > 0  && item.free_comment.map(com_item=> {
                        return (
                          <tr key={com_item}>
                            <td/>
                            <td className="text-left" colSpan={3}>{com_item}</td>
                          </tr>
                        )}
                      )}
                    </>
                  )
                }):(
                  <div className="no-result"><span>登録された処方パターンがありません。</span></div>
                )}
                </tbody>
              </table>
            ):(
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

PrescriptionPatternConfirmModal.contextType = Context;

PrescriptionPatternConfirmModal.propTypes = {
  closeModal:PropTypes.func,
  system_patient_id:PropTypes.number,
  schedule_date:PropTypes.string,
  regular_prescription_number:PropTypes.string,
};

export default PrescriptionPatternConfirmModal;
