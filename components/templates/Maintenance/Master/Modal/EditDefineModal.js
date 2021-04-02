import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import axios from "axios";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DefineModal from "./DefineModal"
import $ from "jquery";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  .item-no {
    width: 3rem;
  }
  .table-check {
    text-align:center;
    width: 3rem;
    label {
      margin:0;
      input {margin:0;}
    }
  }
  .no-result {    
    height:calc(100% - 1px);
    width:100%;
    div{
      height:100%;
      width:100%;
      text-align: center;
      vertical-align:middle;
      display:flex;
      align-items:center;
      justify-content:center; 
    }
    
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
  table {
    margin:0;
    tbody{
      display:block;
      overflow-y: scroll;
      height: calc(50vh - 14rem);
      width:100%;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
    }
    tr{
      display: table;
      width: 100%;
    }
    thead{
      display:table;
      width:100%;
      border-bottom: 1px solid #dee2e6;
      tr{width: calc(100% - 17px);}
    }
    td {
      padding: 0.3rem;
      word-break: break-all;
      font-size: 1rem;
      vertical-align: middle;
    }
    th {
      position: sticky;
      text-align: center;
      padding: 0.25rem;
      font-size: 1rem;
      white-space:nowrap;
      border:1px solid #dee2e6;
      border-bottom:none;
      border-top:none;
      font-weight: normal;
    }
  }
 `;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 16px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0 20px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({ visible, x,  y,  parent, index,}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction(index,"edit")}>編集</div></li>
          <li><div onClick={() => parent.contextMenuAction(index, "delete")}>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class EditDefineModal extends Component {
  constructor(props) {
    super(props);
    let type = this.props.define_type;
    let title = '';
    switch(type){
      case 0:
        title = '検査目的定義';
        break;
      case 1:
        title = '現症定義';
        break;
      case 2:
        title = '依頼区分定義';
        break;
      case 3:
        title = '患者移動形態定義';
        break;
      case 4:
        title = '冠危険因子定義';
        break;
      case 5:
        title = '現病歴定義';
        break;
    }
    this.state = {
      table_data: [],
      isOpenModal: false,
      selected_index: 0,
      type,
      modal_data: {},
      search_class: 0,        //表示区分
      category:'',
      inspection_master_id:this.props.inspection_id,
      title,
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message:"",
      is_loaded: true,
    }
  }
  
  async componentDidMount(){
    this.getSearchResult();
  }
  // 検索
  getSearchResult = async () => {
    let path = "/app/api/v2/master/inspection/searchDefine";
    let post_data = {
      is_enabled: this.state.search_class,
      table_kind: this.state.type,
      inspection_id : this.state.inspection_master_id,
    };
    let {data} = await axios.post(path, {params: post_data});
    this.setState({table_data: data, is_loaded: false});
  };
  
  contextMenuAction = (index, type) => {
    if (type === "edit"){
      this.updateData(index);
    }
    if (type === "delete"){
      this.setState({
        selected_number:this.state.table_data[index].number,
        isDeleteConfirmModal : true,
        confirm_message: "「" + this.state.table_data[index].name + "」" + " これを削除して良いですか？",
      })
    }
  };
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }
  
  deleteData = async () => {
    let path = "/app/api/v2/master/inspection/deleteDefine";
    let post_data = {
      params:{
        number: this.state.selected_number,
        table_kind: this.state.type,
      }
    };
    await axios.post(path,  post_data);
    this.setState({
      is_loaded: true
    }, ()=>{      
      this.confirmCancel();
      this.getSearchResult();
    });
  };
  
  handleClick = (e, index) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX -$('.modal-dialog').offset().left,
          y: e.clientY -$('.modal-dialog').offset().top - 50,
          index,
        },
        
      });
    }
  };
  
  // モーダル
  openModal = () => {
    this.setState({
      modal_data: null,
      row_index: -1,
      isOpenModal: true,
    });
  };
  closeModal = () => {
    this.setState({isOpenModal: false});
  };
  handleOk = () => {
    this.setState({
      is_loaded: true,
      isOpenModal: false
    }, () => {
      this.getSearchResult()
    });    
  };
  updateData = (index) => {
    let modal_data = this.state.table_data[index];
    this.setState({
      modal_data,
      row_index: index,
      isOpenModal: true
    });
  };
  
  render() {
    let {table_data} = this.state;
    return  (
      <Modal show={true} id="add_contact_dlg"  className="inspection-define-master-list first-view-modal">
        <Modal.Header>
          <Modal.Title>{this.state.title}マスタ - {this.props.inspection_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {this.state.type == 0 && (        //検査目的
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                  <tr>
                    <th className="item-no"/>
                    <th className="table-check">表示</th>
                    <th style={{width:"6rem"}}>検査目的ID</th>
                    <th>検査目的名</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.is_loaded == true ? (
                    <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  ):(
                    <>
                      {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                        table_data.map((item, index) => {
                          return (
                            <>
                              <tr onContextMenu={e => this.handleClick(e, index)}>
                                <td className={'item-no'} style={{textAlign:"right"}}>{index+1}</td>
                                <td className="table-check">
                                  <Checkbox
                                    label=""
                                    // getRadio={this.getRadio.bind(this)}
                                    isDisabled={true}
                                    value={item.is_enabled}
                                    name="check"
                                  />
                                </td>
                                <td style={{width:"6rem", textAlign:"right"}}>{item.purpose_id}</td>
                                <td>{item.name}</td>
                              </tr>
                            </>)
                        })
                      )}
                      {table_data !== undefined &&
                      table_data !== null &&
                      table_data.length < 1 && (
                        <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            )}
            {this.state.type == 1 && (        //現症
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                <tr>
                  <th className="item-no"/>
                  <th className="table-check">表示</th>
                  <th style={{width:"4rem"}}>現症ID</th>
                  <th>現症名</th>
                </tr>
                </thead>
                <tbody>
                   {this.state.is_loaded == true ? (
                    <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  ):(
                    <>
                      {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                        table_data.map((item, index) => {
                          return (
                            <>
                              <tr onContextMenu={e => this.handleClick(e, index)}>
                                <td className={'item-no'} style={{textAlign:"right"}}>{index+1}</td>
                                <td className="table-check">
                                  <Checkbox
                                    label=""
                                    // getRadio={this.getRadio.bind(this)}
                                    isDisabled={true}
                                    value={item.is_enabled}
                                    name="check"
                                  />
                                </td>
                                <td style={{width:"4rem", textAlign:"right"}}>{item.symptoms_id}</td>
                                <td>{item.name}</td>
                              </tr>
                            </>)
                        })
                      )}
                      {table_data !== undefined &&
                      table_data !== null &&
                      table_data.length < 1 && (
                        <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            )}
            {this.state.type == 2 && (        //依頼区分
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                <tr>
                  <th className="item-no"/>
                  <th className="table-check">表示</th>
                  <th style={{width:"6rem"}}>依頼区分ID</th>
                  <th>依頼区分名</th>
                </tr>
                </thead>
                <tbody>
                   {this.state.is_loaded == true ? (
                    <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  ):(
                    <>
                      {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                        table_data.map((item, index) => {
                          return (
                            <>
                              <tr onContextMenu={e => this.handleClick(e, index)}>
                                <td className={'item-no'} style={{textAlign:"right"}}>{index+1}</td>
                                <td className="table-check">
                                  <Checkbox
                                    label=""
                                    // getRadio={this.getRadio.bind(this)}
                                    isDisabled={true}
                                    value={item.is_enabled}
                                    name="check"
                                  />
                                </td>
                                <td style={{width:"6rem", textAlign:"right"}}>{item.request_id}</td>
                                <td>{item.name}</td>
                              </tr>
                            </>)
                        })
                      )}
                      {table_data !== undefined &&
                      table_data !== null &&
                      table_data.length < 1 && (
                        <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            )}
            {this.state.type == 3 && (        //患者移動形態
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                <tr>
                  <th className="item-no"/>
                  <th className="table-check">表示</th>
                  <th style={{width:"8rem"}}>患者移動形態ID</th>
                  <th>患者移動形態名</th>
                </tr>
                </thead>
                <tbody>
                   {this.state.is_loaded == true ? (
                    <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  ):(
                    <>
                      {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                        table_data.map((item, index) => {
                          return (
                            <>
                              <tr onContextMenu={e => this.handleClick(e, index)}>
                                <td className={'item-no'} style={{textAlign:"right"}}>{index+1}</td>
                                <td className="table-check">
                                  <Checkbox
                                    label=""
                                    // getRadio={this.getRadio.bind(this)}
                                    isDisabled={true}
                                    value={item.is_enabled}
                                    name="check"
                                  />
                                </td>
                                <td style={{width:"8rem", textAlign:"right"}}>{item.movement_id}</td>
                                <td>{item.name}</td>
                              </tr>
                            </>)
                        })
                      )}
                      {table_data !== undefined &&
                      table_data !== null &&
                      table_data.length < 1 && (
                        <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            )}
            {this.state.type == 4 && (        //冠危険因子
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                <tr>
                  <th className="item-no"/>
                  <th className="table-check">表示</th>
                  <th style={{width:"5rem"}}>冠危険因子ID</th>
                  <th>冠危険因子名</th>
                </tr>
                </thead>
                <tbody>
                   {this.state.is_loaded == true ? (
                    <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  ):(
                    <>
                      {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                        table_data.map((item, index) => {
                          return (
                            <>
                              <tr onContextMenu={e => this.handleClick(e, index)}>
                                <td className={'item-no'} style={{textAlign:"right"}}>{index+1}</td>
                                <td className="table-check">
                                  <Checkbox
                                    label=""
                                    // getRadio={this.getRadio.bind(this)}
                                    isDisabled={true}
                                    value={item.is_enabled}
                                    name="check"
                                  />
                                </td>
                                <td style={{width:"5rem", textAlign:"right"}}>{item.risk_factors_id}</td>
                                <td>{item.name}</td>
                              </tr>
                            </>)
                        })
                      )}
                      {table_data !== undefined &&
                      table_data !== null &&
                      table_data.length < 1 && (
                        <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            )}
            {this.state.type == 5 && (        //患者移動形態
              <table className="table table-bordered table-hover" id="code-table">
                <thead>
                <tr>
                  <th className="item-no"/>
                  <th className="table-check">表示</th>
                  <th style={{width:"5rem"}}>現病歴ID</th>
                  <th>現病歴名</th>
                </tr>
                </thead>
                <tbody>
                   {this.state.is_loaded == true ? (
                    <div style={{height:'calc(100% - 1px)',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  ):(
                    <>
                      {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                        table_data.map((item, index) => {
                          return (
                            <>
                              <tr onContextMenu={e => this.handleClick(e, index)}>
                                <td className={'item-no'} style={{textAlign:"right"}}>{index+1}</td>
                                <td className="table-check">
                                  <Checkbox
                                    label=""
                                    // getRadio={this.getRadio.bind(this)}
                                    isDisabled={true}
                                    value={item.is_enabled}
                                    name="check"
                                  />
                                </td>
                                <td style={{width:"5rem", textAlign:"right"}}>{item.sick_history_id}</td>
                                <td>{item.name}</td>
                              </tr>
                            </>)
                        })
                      )}
                      {table_data !== undefined &&
                      table_data !== null &&
                      table_data.length < 1 && (
                        <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            )}
          </Wrapper>
          {this.state.isOpenModal && (
            <DefineModal
              table_kind = {this.state.type}
              modal_data = {this.state.modal_data}
              closeModal = {this.closeModal}
              handleOk = {this.handleOk}
              inspection_id = {this.props.inspection_id}
              inspection_name = {this.props.inspection_name}
            />
          )}
          {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.deleteData.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            favouriteMenuType={this.state.favouriteMenuType}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          <Button className={"red-btn"} onClick={this.openModal}>新規作成</Button>                    
        </Modal.Footer>
      </Modal>
    );
  }
}

EditDefineModal.contextType = Context;
EditDefineModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk:   PropTypes.func,
  define_type : PropTypes.number,
  inspection_id:PropTypes.string,
  inspection_name: PropTypes.string,
};

export default EditDefineModal;
