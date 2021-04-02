import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import Button from "~/components/atoms/Button";
import {getWeekday} from "~/helpers/dialConstants";
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  max-height: 64vh;
  flex-direction: column;
  display: flex;
  text-align: center;
  overflow-y: auto;
  .one-prescript-header {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }
  .search_type {
    font-size: 12px;
      margin-top: 5px;
      display: flex;

      .radio-btn {
        margin-right: 10px;
        width: 125px;
        label{
          width: 100%;
          border: solid 1px rgb(206, 212, 218);
          border-radius: 4px;
          margin-left: 5px;
        }
      }
    }
    .kind {
      .radio-btn {
        width: 80px;
      }
    }
    .patient-list {
      border: solid 1px rgb(206,212,218);
     }
     .search-box {
    input {
     width: 266px;
     margin-left: -24px;
    }
   }

  ul {
    padding-inline-start: 20px;
    li {

      span.medovername {
        display: inline-block;
        width: 240px;
      }
      span.btn {                                           
        display: inline;
        button {
          padding: 2px;
        }
      }
      span.chk {
        color: green;
      }
      .usage-permission-allow{
        background-color: #ffffcc; 
      }
      .usage-permission-reject{
        background-color: #ffddcc; 
      }

    }
  }

  .done_item{
    background-color:rgb(105, 200, 225);
  }
  .not_done_item{
    background-color:lightgrey;
  }
  .footer {
    margin-top: 10px;
    text-align: center;
    width:100%;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;  
      padding-left: 60px;
      padding-right: 60px;    
    }
    .add-button {
      text-align: center;
      button{
        margin-right:20px;
      }      
    }
    span {
      color: white;
      font-size: 16px;
      letter-spacing: 7px;
      margin-left:4px;
      font-weight: 100;
    }    
}
.no-padding{
  padding:0;
}
td label{
  display:none;
}
th, td{
  font-size:1rem;
  padding: 0.5rem;
}
 `;
const periodics = ["【臨時処方】", "【定期処方1】", "【定期処方2】", "【定期処方3】"];
class PrescriptionDetailModal extends Component {
  constructor(props) {
    super(props);
    this.state={
    }
  }

  async componentDidMount () {
      let prescriptionInfo = this.props.pattern_info;
      if (prescriptionInfo === undefined || prescriptionInfo == null) return;
      let temporary_rows = prescriptionInfo.filter(item=>{
          if (item.regular_prescription_number === 0) {
              return item;
          }
      });

      let regular_rows = prescriptionInfo.filter(item=>{
          if (item.regular_prescription_number !== 0) {
              return item;
          }
      });
      this.setState({
          temporary_rows,
          regular_rows,
      })
  }
  closeModal = () => {
    this.setState({isShowDoctorList:false})
  }

  onHide=()=>{}

  render() {
    let {pattern_info} = this.props;
    return  (
        <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal prescription-done-modal first-view-modal">
          <Modal.Header>
            <Modal.Title>処方詳細</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
            <table className="table-scroll table table-bordered">
              <thead>
                <th>No</th>
                <th>処方分類</th>
                <th>区分</th>
                <th>薬剤</th>
                <th>服用</th>
                <th>コメント</th>
              </thead>
              <tbody>
              {pattern_info != undefined && pattern_info != null && pattern_info.length >0 && pattern_info.map((item, index)=>{
                var week_days =null;
                var weekday_str = '';
                if (item.weekday>0) week_days = getWeekday(item.weekday);
                if (week_days != null){
                  week_days.map(val => {
                    weekday_str += val;
                  })
                }
                return (
                  <>
                      {item.data_json.map((pres_item, sub_index)=> {
                        return(
                          <>
                            <tr>
                              {sub_index==0 && (
                                <td className="text-left" rowSpan={item.data_json.length}>{index+1}</td>
                              )}
                              {sub_index==0 && (
                                <td className="text-left" rowSpan={item.data_json.length}>{item.regular_prescription_number != null && periodics[item.regular_prescription_number]}({weekday_str})</td>
                              )}
                              <td className="text-left">{pres_item.prescription_category}</td>
                              <td className="text-left">
                                {pres_item.medicines.map(medicine=>{
                                  return(
                                    <>
                                    <div>●{medicine.item_name}</div>
                                    </>
                                  )
                                })}
                              </td>
                              <td className="text-left">{pres_item.usage_name}</td>
                              {sub_index==0 && (
                                <td className="text-left" rowSpan={item.data_json.length}>{item.comment}</td>
                              )}                              
                            </tr>
                          </>  
                        )})
                      }
                  </>
                )
              })}
              </tbody>
            </table>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <div onClick={this.props.closeModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
              <span>キャンセル</span>
            </div>
            {/* <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button> */}
          </Modal.Footer>
        </Modal>
    );
  }
}

PrescriptionDetailModal.contextType = Context;

PrescriptionDetailModal.propTypes = {
  pattern_info: PropTypes.array,  
  closeModal:PropTypes.func,

};

export default PrescriptionDetailModal;
