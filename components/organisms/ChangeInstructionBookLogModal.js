import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import {displayLineBreak} from "~/helpers/dialConstants"
import {getStaffName} from "~/helpers/constants";
import * as apiClient from "~/api/apiClient";

const Wrapper = styled.div`
  height: 96%;
  padding:1.5rem;
  .clickable{
    cursor:pointer;
  }
  table {
    margin-bottom:0px;
    thead{
      display:table;
      width:100%;
    }
    tbody{
      display:block;
      overflow-y: auto;
      height: 33rem;
      width:100%;
    }
    tr{
      display: table;
      width: 100%;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    td {
      word-break: break-all;
      padding: 0.25rem;
    }
    th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
    }
    .no{
      width:2rem;
    }
    .date{
      width:12rem;
      text-align:center;
    }
    .content{
      width:15rem;
    }
    .updated_by{
      width:15rem;
    }
  }
  .selected{
    background: lightblue!important;
  }
`;

export class ChangeInstructionBookLogModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outputs: [],
      is_loaded: false
    };
    this.history_list = null;
  }
  async UNSAFE_componentWillMount() {
    var path = "/app/api/v2/instruction_book/search_history";
    await apiClient._post(path, {params: {
        history: this.props.history_number
      }})
      .then((res) => {
        if (res){
          this.setState({
            history_list: res,
            is_loaded: true
          })
        }
      })
      .catch(() => {
      });
    
  }
  componentDidMount(){
    document.getElementById("log_cancel_id").focus();
  }

  checkDifference = (results) => {
    let outputs = [];
    let result = results.filter(x=>x.history_show==1);
    if (result.length > 0) {
      result.map((order, index) => {
        let version = this.history_list.findIndex(x=>x.number == order.number);
        version = this.history_list.length - version;
        let current = order;
        current.doctor_name = "";
        current.department_name = this.props.getDepartmentName("");
        current.substitute_name = order.is_doctor_consented == 2 ? "": getStaffName(order.updated_by);
        current.version = version;
        if (index < result.length - 1) {
          current.prev = result[index + 1];
          let output = current;
          output.history_show = 1;          
          outputs.push(output);
        } else {
          current.prev = null;
          let output = current;
          output.history_show = 1;          
          outputs.push(output);
        }
      });
    }
    return {
      outputs: outputs
    };
  };
  getRadio = async (number,name,value) => {
    if (name === "check") {
      let {history_list, outputs} = this.state;
      history_list.find(x=>x.number == number).history_show = value;
      outputs.find(x=>x.number == number).history_show = value;
      this.setState({
        history_list,
        outputs
      });
    }
  };

  getChangePart = (cur, prev) => {
    if (cur == prev) {
      return (
        <>
          <div>{cur != undefined ? displayLineBreak(cur) : ""}</div>
        </>
      )
    } else {
      if (cur == undefined || cur == null || cur == '') {
        return (
          <>
          {prev != undefined && (
            <div className="deleted-order">{displayLineBreak(prev)}</div>
          )}
          </>
        )
      } else if (prev == undefined || prev == null || prev == '') {
        return (
          <div className="text-blue">{cur != undefined ? displayLineBreak(cur) : ""}</div>
        )
      } else {
        return (
          <>
            <div className="text-blue">{cur != undefined ? displayLineBreak(cur) : ""}</div>
            <div className='deleted-order'>{prev != undefined ? displayLineBreak(prev) : ""}</div>
          </>
        )
      }
    }
  };

  render() {
    let history_data = this.state.history_list;
    
    return (
      <Modal show={true} size="lg" className="prescription_confirm_modal">
        <Modal.Header>
          <Modal.Title>変更履歴</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <table className="table-scroll table table-bordered">
              <thead>
              <tr>
                <th className='no'/>
                <th className='date'>更新日時</th>
                <th className='content'>伝票種別</th>
                <th className='content'>指示内容</th>
                <th className='content'>用法</th>
                <th className='updated_by'>更新者</th>
              </tr>
              </thead>
              <tbody>
              {history_data != undefined && history_data != null && history_data.length > 0 && (
                history_data.map((item, index) => {
                  return(
                    <>
                      <tr>
                        <td className='no text-right'>{index + 1}</td>
                        <td className='date'>{item.updated_at}</td>
                        <td className='content'>{this.props.getSubCategoryName(item.subcatergory_detail_id)}</td>
                        <td className="content">{this.props.getContentName(item.drug_content_id)}</td>
                        <td className="content">{this.props.getUsage(item)}</td>
                        <td className="updated_by">{getStaffName(item.updated_by)}</td>
                      </tr>
                    </>
                  )
                })
              )}
              </tbody>
            </table>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} id='log_cancel_id' className="cancel-btn">閉じる</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
ChangeInstructionBookLogModal.contextType = Context;

ChangeInstructionBookLogModal.propTypes = {
  closeModal: PropTypes.func,
  getDepartmentName: PropTypes.func,
  getUsage: PropTypes.func,
  getContentName: PropTypes.func,
  getSubCategoryName: PropTypes.func,
  orderNumber: PropTypes.number,
  insuranceTypeList: PropTypes.array,
  historySoapList: PropTypes.array,
  history_number:PropTypes.string
};

export default ChangeInstructionBookLogModal;