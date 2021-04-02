import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import * as colors from "~/components/_nano/colors";

const Wrapper = styled.div`
  display: block;
  max-width: 100%;
  overflow: auto;
  position: relative;
  .search_type_no {
    padding-top:5px;
    padding-bottom:5px;
    label {
        font-size: 0.875rem;
    }
  }
  .div-left{
    width: 20%
  }
  .div-right{
    width: 80%;
  }
  .flex-center{
    display: flex;
    justify-content: center;
  }
  .btn-add{
    width: 120px;
    height: 30px;
    line-height: 30px;    
    text-align: center;
    background: #ddd;
    border: 1px solid black;    
  }
  .btn-add:hover{
    cursor: pointer;      
  }
  .medicine-comment{
    width: 400px;
    height: 150px;
    border: 1px solid #6d6d6d;
  }
  th {
    // background-color: ${colors.midEmphasis};
    // color: ${colors.surface};
    text-align: center;
    font-weight: normal;
    label {
      color: ${colors.surface};
    }
  }

  th,
  td {
    border: 1px solid #6d6d6d;
    padding: 4px 8px;
  }
  .full-table{
    width: 100%;
  }
  .align-center{
    text-align: center;
    // background-color: #ddd;
    background-color: #b1acac;
    border: 1px solid #3c3b3b;
  }
  .text-center{
    text-align: center;
  }
`;

export class PotionReportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDeleteConfirmModal: false,
      is_loaded:false,
    };
  }

  async componentDidMount() {
  }

  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }

  onHide=()=>{};

    selectSearchTypeNo = (e) => {
        this.setState({ search_type: parseInt(e.target.value)}, ()=>{
        });
    };

  render() {
    return (
      <Modal show={true} className="custom-modal-sm routine-input-panel-modal first-view-modal" onHide={this.onHide}>
        <Modal.Header>
          <Modal.Title>持参薬報告</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
              <div className={'search_type_no flex'} style={{marginBottom:"20px"}}>
                  <label className='mr-2'>薬品情報</label>
                  <Radiobox
                      value={0}
                      label={'前方一致'}
                      name="search_type_no"
                      getUsage={this.selectSearchTypeNo.bind(this)}
                      checked={this.state.search_type === 0}
                  />
                  <Radiobox
                      value={1}
                      label={'後方一致'}
                      name="search_type_no"
                      getUsage={this.selectSearchTypeNo.bind(this)}
                      checked={this.state.search_type === 1}
                  />
            </div>
            <div className="flex" style={{marginBottom:"20px"}}>
              <div className="div-left">
                <div className="search-left-results">
                  <table>
                      <tr>
                        <th>オーダー受付</th>
                        <th>記載種別</th>
                      </tr>
                      <tr>
                        <td>YYYY/MM/DD</td>
                        <td>持参薬報告</td>
                      </tr>
                      <tr>
                        <td>YYYY/MM/DD</td>
                        <td>持参薬報告</td>
                      </tr>
                      <tr>
                        <td>YYYY/MM/DD</td>
                        <td>持参薬報告</td>
                      </tr>
                  </table>
                </div>
                <div className="">

                </div>
            </div>
            <div className="div-right" style={{marginBottom:"20px"}}>
              <div className="search-right-results">
                <table>
                    <tr>
                      <th>RP</th>
                      <th>薬剤名</th>
                      <th>用量</th>
                      <th>単位</th>
                      <th>用法</th>
                      <th>持込量</th>
                      <th>単位</th>
                      <th>残日数</th>
                      <th>単位</th>
                      <th>採用</th>
                    </tr>
                    <tr>
                      <td></td>
                      <td>アダラートL錠 10ｍｇ</td>
                      <td>0</td>
                      <td>錠</td>
                      <td>１日１回起床時</td>
                      <td>0</td>
                      <td>錠</td>
                      <td>0</td>
                      <td></td>
                      <td>無</td>
                    </tr>
                </table>
              </div>
            </div>
          </div>
          <div className="flex-center" style={{marginBottom:"20px"}}>
            <div className="btn-add"> ↓ 追加</div>
          </div>
          <div className="medicines-area" style={{marginBottom:"20px"}}>
          <table className="full-table">
            <tr>
              <th></th>
              <th>持参薬品名</th>
              <th>用量</th>
              <th>単位</th>
              <th></th>
              <th>用法</th>
              <th>持込量</th>
              <th>単位</th>
              <th></th>
              <th>残日数</th>
              <th>単位</th>
              <th></th>
              <th>服用不可</th>
              <th>採用</th>
              <th>同成分採用薬</th>
            </tr>
            <tr>
              <td>1</td>
              <td>内服 アダラートL錠 10ｍｇ</td>
              <td>0</td>
              <td>錠</td>
              <td><div className="align-center">変更</div></td>
              <td>１日１回起床時</td>
              <td>0</td>
              <td>錠</td>
              <td><div className="align-center">変更</div></td>
              <td>0</td>
              <td>錠</td>
              <td><div className="align-center">変更</div></td>
              <td><div className="text-center">
                <Checkbox
                    label=""
                    value=""
                    name="check"
                />
                </div></td>
              <td>無</td>
              <td></td>

            </tr>
            <tr>
              <td>2</td>
              <td>内服 アダラートL錠 5ｍｇ</td>
              <td>0</td>
              <td>錠</td>
              <td><div className="align-center">変更</div></td>
              <td>１日１回起床時</td>
              <td>0</td>
              <td>錠</td>
              <td><div className="align-center">変更</div></td>
              <td>0</td>
              <td>錠</td>
              <td><div className="align-center">変更</div></td>
              <td><div className="text-center">
                <Checkbox
                    label=""
                    value=""
                    name="check"
                />
                </div></td>
              <td>有</td>
              <td>エースコール錠1ｇ</td>

            </tr>
            <tr>
              <td>3</td>
              <td>内服 アダラートL錠 3ｍｇ</td>
              <td>0</td>
              <td>錠</td>
              <td><div className="align-center">変更</div></td>
              <td>１日１回起床時</td>
              <td>0</td>
              <td>錠</td>
              <td><div className="align-center">変更</div></td>
              <td>0</td>
              <td>錠</td>
              <td><div className="align-center">変更</div></td>
              <td><div className="text-center">
                <Checkbox
                    label=""
                    value=""
                    name="check"
                />
                </div></td>
              <td>無</td>
              <td></td>

            </tr>
        </table>
          </div>
          <div className="">
            <div>薬剤師コメント</div>
            <div className="medicine-comment"></div>
          </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
          <Button className="red-btn" onClick={this.props.closeModal}>確定</Button>
        </Modal.Footer>
        {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.deleteData.bind(this)}
                confirmTitle= {this.state.confirm_message}
            />
        )}
      </Modal>
    );
  }
}
PotionReportModal.contextType = Context;
PotionReportModal.propTypes = {
  closeModal: PropTypes.func,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
};

export default PotionReportModal;
