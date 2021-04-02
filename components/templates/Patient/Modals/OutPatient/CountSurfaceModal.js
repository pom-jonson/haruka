import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import NumericInputWithUnitLabel from "../../../../molecules/NumericInputWithUnitLabel";
import { registerLocale } from "react-datepicker";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import InputWithLabel from "~/components/molecules/RemComponents/InputWithLabel";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);

const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;

const Wrapper = styled.div`
  .table-area {
    margin: auto;
    height: calc(100% - 200px);
    font-size: 14px;
    font-family: "Noto Sans JP", sans-serif;
    input{
      height: 2.375rem !important;
    }
    .detail-body-part{
      input{
        width: 12rem;
        margin: 0 auto;
      }
    }
    table {
        margin-bottom:0;
        thead{
          display: table;
          width:100%;
          tr{
            width: calc(100% - 17px) !important;
          }
        }
        tbody{
          height:50vh;
          overflow-y:scroll;
          display:block;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        tr{
          display: table;
          width: 100%;
          box-sizing: border-box;
        }
        td {
            padding: 0.25rem;
            text-align: left;
            position:relative;
            label{
                width:0px;
                margin-right:0px;
            }
            div{
                margin-top:0px;
            }
        }
        .tl {
            text-align: left;
        }
        .tr {
            text-align: right;
        }
        
        .react-datepicker__input-container{
            input{
                width: 100px !important;
                font-size: 16px;
                ime-mode: inactive;
            }
        }
        .react-numeric-input input{
            height: 30px;
            width: 5rem !important;
        }
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
    padding: 0px;
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

const ContextMenu = ({ visible, x,  y,  parent,  row_index,}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction(row_index,"register")}>追加</div></li>
          <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>          
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class CountSurfaceModal extends Component {
  constructor(props) {
    super(props);    
   
    let modal_data = [
      {x_value:0, y_value:0, body_part:"", total_x_y:0}
    ];
    if (props.modal_data !== undefined && props.modal_data != null && props.modal_data.length > 0) {
      modal_data = props.modal_data;
    }
    this.state = {
      modal_data,
      alert_messages:"",
      confirm_message:"",
      confirm_type:"",
      change_flag: 0
    }
    
  }
  async componentDidMount(){
    // componentDidMount
  }

  getBodyPart = (index, e) => {
    let val = e.target.value;
    let modal_data = this.state.modal_data;
    modal_data = modal_data.map((item, idx)=>{
      if (index == idx) {
        item.body_part = val;
      }
      return item;
    });

    this.setState({
      change_flag: 1,
      modal_data: modal_data
    });    
  }
  
  getValue = (key, index, value) => {
    let modal_data = this.state.modal_data;

    modal_data = modal_data.map((item, idx)=>{
      if (index == idx) {
        if (!(key == "total_x_y" && (item.x_value === "" || item.x_value == 0) && (item.y_value === "" || item.y_value === 0))) {
          item[key] = value;
          if (key == "x_value" || key == "y_value") {
            item['total_x_y'] = parseFloat(item.x_value * item.y_value).toFixed(2);
          } else if(key == "total_x_y" && item.y_value !== 0 && item.y_value !== "") {
            item.x_value = item.total_x_y / item.y_value;
            if (item.x_value.toString().length > 10) item.x_value = parseFloat(item.x_value).toFixed(2);
          }
        }
      }
      return item;
    });

    this.setState({
      change_flag: 1,
      modal_data: modal_data
    });
  };
  
  handleClick = (e, _index) => {
    if (this.props.view_only) return;
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({contextMenu: { visible: false }});
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({ contextMenu: { visible: false }});
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("basicdata-modal").offsetLeft,
          y: e.clientY + window.pageYOffset - 170
        },
        row_index: _index
      });
    }
  };
  
  contextMenuAction = (index, type) => {
    let {modal_data} = this.state;
    let new_record = {
      x_value: 0,
      y_value: 0,
      total_x_y: 0,
      body_part:""
    };
    if (type == "register") {
      modal_data.push(new_record);
    } else if(type == "delete") {
      modal_data = modal_data.filter((item, idx)=>{
        if (idx == index) {
          return false;
        } else {
          return true;
        }
      });
    }
    
    this.setState({modal_data:modal_data});
  };
  
  handleOk = () => {
    if (this.canConfirmModal() == 0) return;
    if (this.state.change_flag != 1) return;

    let {modal_data} = this.state;
    let result = modal_data.filter(x=>x.x_value != "" && x.y_value != "");
    if (modal_data.length != result.length) {
      this.setState({
        confirm_message: "一部しか入力されていない行があります。面積0の行を破棄して確定しますか？",
        confirm_type:"cancel_and_save"
      });
      return;
    }

    this.props.handleOk(this.getTotalSurface(), result);
  };

  canConfirmModal = () => {
    
    let {modal_data} = this.state;
    modal_data = modal_data.filter(x=>x.x_value != "" && x.y_value != "");
    if (modal_data.length == 0) return 0;

    return 1;
  }

  getTotalSurface = () => {
    let result = 0;
    this.state.modal_data.map(item=>{
      if (item.total_x_y > 0) {
      result += parseFloat(item.total_x_y);
      }
    });
    return parseFloat(result).toFixed(2);
  }

  createNewRecord = () => {
    if (this.props.view_only) return;
    let modal_data = this.state.modal_data;
    let new_record = {
      x_value: 0,
      y_value: 0,
      total_x_y: 0,
      body_part:""
    };
    modal_data.push(new_record);

    this.setState({
      modal_data: modal_data,
      change_flag: 1
    });
  }

  closeModal = () => {
    this.setState({
      confirm_message: "",
      confirm_type: ""
    });
  }

  handleCloseModal = () => {
    if (this.state.change_flag == 1) {
      this.setState({
        confirm_message: "入力内容を破棄しますか？",
        confirm_type: "cancel_input"
      })
      return;
    }
    this.props.closeModal();
  }

  confirmOk = () => {
    this.closeModal();
    if (this.state.confirm_type == "cancel_input") {
      this.props.closeModal();
    } else if(this.state.confirm_type == "cancel_and_save") {
      let {modal_data} = this.state;      
      let result = modal_data.filter(x=>x.total_x_y != "" && x.total_x_y != 0);      
      this.props.handleOk(this.getTotalSurface(), result);
    }
  }
  
  render() {
    let tooltip_msg = "面積の合計が0です。";
    return  (
      <Modal show={true} size="lg" className={this.fio2_require ? "basicdata-modal tag-add-modal oxygen-calculate-modal first-view-modal" : "basicdata-modal tag-add-modal oxygen-calculate-small-modal first-view-modal"} id="basicdata-modal">
        <Modal.Header>
          <Modal.Title>面積計算</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>           
            <div className="table-area">
              <table className="table-scroll table table-bordered mt-3" id="code-table">
                <thead>
                <tr className={'table-menu'}>
                  <td className="text-center" style={{width: "40%"}}>部位・名称</td>
                  <td className="text-center" style={{width: "20%"}}>縦(cm)</td>
                  <td className="text-center" style={{width: "20%"}}>横(cm)</td>
                  <td className="text-center" style={{width: "20%"}}>面積(㎠)</td>                  
                </tr>
                </thead>
                <tbody>
                  {this.state.modal_data.length > 0 && this.state.modal_data.map((item, index)=>{
                    return(
                      <>
                        <tr onContextMenu={e => this.handleClick(e, index)}>                                                                                                           
                          <td className="text-center" style={{width:"40%"}}>
                            <InputWithLabel
                              label=""
                              type="text"
                              getInputText={this.getBodyPart.bind(this, index)}
                              diseaseEditData={item.body_part}                              
                              className="detail-body-part"
                              isDisabled={this.props.view_only}
                            />
                          </td> 
                          <td className="text-center" style={{width:"20%"}}>
                            <NumericInputWithUnitLabel
                                label=""
                                className="form-control"
                                value={item.x_value}
                                getInputText={this.getValue.bind(this,"x_value", index)}
                                inputmode="numeric"
                                min={0}
                                max={9999}
                                disabled={this.props.view_only}
                              />
                          </td> 
                          <td className="text-center" style={{width:"20%"}}>
                            <NumericInputWithUnitLabel
                                label=""
                                className="form-control"
                                value={item.y_value}
                                getInputText={this.getValue.bind(this,"y_value", index)}
                                inputmode="numeric"
                                min={0}
                                max={9999}
                                disabled={this.props.view_only}
                              />
                          </td> 
                          <td className="text-center" style={{width:"20%"}}>
                            <NumericInputWithUnitLabel
                                label=""
                                className="form-control"
                                value={item.total_x_y}
                                getInputText={this.getValue.bind(this,"total_x_y", index)}
                                inputmode="numeric"
                                min={0}
                                max={9999}
                                disabled={this.props.view_only}
                              />
                          </td>                      
                        </tr>
                      </>
                    )
                  })}
                  <tr>                                                                                                           
                    <td colSpan={4} style={{width:"100%", textAlign:"center", cursor:"pointer"}} onClick={this.createNewRecord}>
                      新規作成
                    </td>                     
                  </tr>
                </tbody>
              </table>
            </div>            
            <div className={`d-flex mt-2 text-right d-flex mr-3`} style={{float:"right"}}>
              <div className="pt-1">合計 </div><div className="border pr-1 ml-1" style={{width: 100,height:30}}>{this.getTotalSurface()}</div><div className="ml-1">㎠</div>
            </div>
          </Wrapper>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            row_index={this.state.row_index}
          />
        </Modal.Body>
        <Modal.Footer>
          {/*<Button className="cancel-btn" id='cancel_id' onClick={this.props.closeModal}>キャンセル</Button>*/}
          {/*  <Button className="red-btn" onClick={this.handleOk}>確 定</Button>*/}
          <div onClick={this.handleCloseModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
            <span>キャンセル</span>
          </div>
          {this.props.view_only != true && (
            <>            
                {this.canConfirmModal() == 0 ? (
                  <>
                    <OverlayTrigger
                      placement={"top"}
                      overlay={renderTooltip(tooltip_msg)}
                    >
                      <div className={'custom-modal-btn disable-btn'} style={{cursor:"pointer"}}>
                        <span>確定</span>
                      </div>
                    </OverlayTrigger>
                  </>
                ):(
                  <>
                    <div className={this.state.change_flag == 1 ? 'custom-modal-btn red-btn' : 'custom-modal-btn disable-btn'} onClick={this.handleOk} style={{cursor:"pointer"}}>
                      <span>確定</span>
                    </div>
                  </>
                )}                              
            </>        
          )}
          
        </Modal.Footer>
        
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeAlertModal.bind(this)}
            handleOk= {this.closeAlertModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.confirm_message !== "" && this.state.confirm_type != "cancel_and_save" && (
          <SystemConfirmModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.confirm_message !== "" && this.state.confirm_type == "cancel_and_save" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title={'確認'}
          />
        )}
      </Modal>
    );
  }
}

CountSurfaceModal.contextType = Context;

CountSurfaceModal.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.array,
  handleOk:PropTypes.func,
  view_only:PropTypes.bool,
};

export default CountSurfaceModal;