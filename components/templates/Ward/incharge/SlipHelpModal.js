import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
// import {formatDateLine, formatDateSlash} from "~/helpers/date";
import {formatDateLine} from "~/helpers/date";
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .title-label{
   width: 8rem;
   font-weight:bold;
   margin-right:1rem;
 }
 td{
   vertical-align:middle;
 }
`;

class SlipHelpModal extends Component {
  constructor(props) {
    super(props);  
    this.state = {
      course_date:new Date(),
      order_list:[],   
      discharge_list:[],      
    }
  }

  async componentDidMount() {    
  }

  getOrderData =async()=>{
    this.setState({list_data: []});
    let path = "/app/api/v2/nurse/get_all_order";
    let post_data = {
      search_date: formatDateLine(this.state.course_date)
    };
    await apiClient
        ._post(path, {
            params: post_data
        })
        .then((res) => {
            if(res.length > 0){
                this.setState({
                  order_list: res,
                });
            } else {
                this.setState({
                  order_list: [],
                });
            }
        })
        .catch(() => {
        });
}
  
  render() {
    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm patient-help-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>伝票説明</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div>伝票文字色・背景色説明</div>
              <div className={'flex'}>
                <div className="title-label">実施伝票：</div>
                <div className="user-content-css">実施入力対象伝票です。（注射、処置、処方、指示欄、看護指示 etc）</div>
              </div>
              <div className={'flex'}>
                <div className="title-label">実施不可伝票：</div>
                <div className="user-content-css">実施入力対象外の伝票です。</div>
              </div>
              <div className={'flex'}>
                <div className="title-label">外来伝票：</div>
                <div className="user-content-css">外来区分で指示された伝票です。</div>
              </div>

              <div className={'table-area'}>
                <table className="table-scroll table table-bordered">
                  <thead>
                    <tr>
                      <th colSpan='3'></th>
                      <th>未指示受け</th>
                      <th>指示受け済</th>
                      <th>指示確認済</th>
                      <th>実施中</th>
                      <th>実施済</th>
                      <th>実施済</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td rowSpan='4'>入<br/>院</td>
                      <td style={{borderBottom:'none'}}>実施</td>
                      <td>当日受付指示</td>
                      <td style={{background:'lightyellow', color:'limegreen'}}>〇指示</td>
                      <td style={{color:'blue'}}>〇指示</td>
                      <td style={{color:'blue'}}>○指示</td>
                      <td style={{color:'magenta'}}>◎指示</td>
                      <td style={{color:'magenta'}}>●指示</td>
                      <td style={{color:'pink'}}>×指示</td>
                    </tr>
                    <tr>
                      <td style={{borderTop:'none'}}>伝票</td>
                      <td>３時間以内発行指示</td>
                      <td style={{background:'lightgreen', color:'limegreen'}}>○指示</td>
                      <td style={{color:'blue'}}>○指示</td>
                      <td style={{color:'blue'}}>○指示</td>
                      <td style={{color:'magenta'}}>◎指示</td>
                      <td style={{color:'magenta'}}>●指示</td>
                      <td style={{color:'pink'}}>×指示</td>
                    </tr>
                    <tr>
                      <td style={{borderBottom:'none'}}>実施</td>
                      <td>当日受付指示</td>
                      <td style={{background:'lightyellow'}}>〇指示○指示</td>
                      <td>○指示</td>
                      <td>○指示</td>
                      <td></td>
                      <td>●指示</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td style={{borderTop:'none'}}>不可</td>
                      <td>３時間以内発行指示</td>
                      <td style={{background:'lightgreen'}}>○指示</td>
                      <td>○指示</td>
                      <td>○指示</td>
                      <td></td>
                      <td>●指示</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td rowSpan='4'>外<br/>来</td>
                      <td style={{borderBottom:'none'}}>実施</td>
                      <td>当日受付指示</td>
                      <td style={{background:'lightyellow', color:'gold'}}>〇指示○指示</td>
                      <td style={{color:'gold'}}>○指示</td>
                      <td style={{color:'gold'}}>○指示</td>
                      <td></td>
                      <td style={{color:'pink'}}>●指示</td>
                      <td style={{color:'pink'}}>×指示</td>
                    </tr>
                    <tr>
                      <td style={{borderTop:'none'}}>伝票</td>
                      <td>３時間以内発行指示</td>
                      <td style={{background:'lightgreen', color:'gold'}}>○指示</td>
                      <td style={{color:'gold'}}>○指示</td>
                      <td style={{color:'gold'}}>○指示</td>
                      <td></td>
                      <td style={{color:'pink'}}>●指示</td>
                      <td style={{color:'pink'}}>×指示</td>
                    </tr>
                    <tr>
                      <td style={{borderBottom:'none'}}>実施</td>
                      <td>当日受付指示</td>
                      <td style={{background:'lightyellow', color:'gold'}}>〇指示指示</td>
                      <td style={{color:'gold'}}>○指示</td>
                      <td style={{color:'gold'}}>○指示</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td style={{borderTop:'none'}}>不可</td>
                      <td>３時間以内発行指示</td>                      
                      <td style={{background:'lightgreen', color:'gold'}}>○指示</td>
                      <td style={{color:'gold'}}>○指示</td>
                      <td style={{color:'gold'}}>○指示</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className='cancel-btn' onClick={this.props.closeModal}>キャンセル</Button>            
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

SlipHelpModal.propTypes = {
    patientId: PropTypes.number,
    patientInfo: PropTypes.object,  
    closeModal: PropTypes.func,
    detailedPatientInfo : PropTypes.object
};

export default SlipHelpModal;