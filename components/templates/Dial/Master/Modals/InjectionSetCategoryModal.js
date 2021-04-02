import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import InjectionSetCategoryInputModal from "../../modals/InjectionSetCategoryInputModal";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Checkbox from "~/components/molecules/Checkbox";
import checkStateMaster from "../../DialMethods/checkStateMaster";

const Wrapper = styled.div`
  display: block;
  max-width: 100%;
  width: 649px;
  height: calc(55vh);
  padding: 9px 9px 9px 2px;
  max-height: 700px;
  overflow: auto;
  position: relative;
  table {
    overflow-y: auto;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
          padding: 0.25rem;
          font-size:0.9rem
      }
      th {
          font-size: 0.9rem;
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
      .table-check {
          width: 3.75rem;
          label {
            margin-right: 0
          }
      }
      .item-no {
        width: 3rem;
        text-align: center;
      }
      .code-number {
          width: 6rem;
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
            <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
            <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>
          </ul>
        </ContextMenuUl>
    );
  } else {
    return null;
  }
};

export class InjectionSetCategoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenInputModal: false,
      isDeleteConfirmModal: false,
      table_data: null,
      modal_data: null,
    };
  }

  async componentDidMount() {
    var base_modal = document.getElementsByClassName("basicdata-modal")[0];
    if(base_modal !== undefined) base_modal.style['z-index'] = 1040;
    this.searchList();
  }

  openInputModal = () => {
    this.setState({
      isOpenInputModal: true,
      modal_data:null,
    });
    var base_modal = document.getElementsByClassName("basic-info-view-modal")[0];
    if(base_modal !== undefined) base_modal.style['z-index'] = 1030;
  };

  closeModal = () => {
    this.setState({
      isOpenInputModal: false,
    });
    var base_modal = document.getElementsByClassName("basic-info-view-modal")[0];
    if(base_modal !== undefined) base_modal.style['z-index'] = 1040;
  };

  searchList = async () => {
    let post_data = {
        table_kind: 11,
        order:'name_kana'
    };
    let path = "/app/api/v2/dial/master/material_search";
    await apiClient.post(path, {
      params: post_data
    }).then((res) => {
        this.setState({table_data: res});
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
          .getElementById("basic-data-table")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
                .getElementById("basic-data-table")
                .removeEventListener(`scroll`, onScrollOutside);
          });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("basicdata-modal").offsetLeft,
          y: e.clientY + window.pageYOffset - 190
        },
        row_index: index, 
      });
    }
  };

  contextMenuAction = (index, type) => {
    if (type === "edit"){
      this.editData(index);
    }
    if (type === "delete"){
      this.setState({
        selected_number: this.state.table_data[index].number
      }, ()=> {
        this.delete();
      })
    }
  };

  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }

  editData = (index) => {    
    let modal_data = this.state.table_data[index];
    this.setState({
      modal_data,
      isOpenInputModal: true,
    });
  };

  delete = () => {    
    this.setState({
      isDeleteConfirmModal : true,
      confirm_message: "削除しますか？",
    });
  };

  deleteData = async () => {
      let path = "/app/api/v2/dial/master/dial_method_register";
      let post_data = {
          params: this.state.selected_number,
          table_kind: 11,
          type: "delete"
      };
      await apiClient.post(path,  post_data);
      this.confirmCancel();
      this.searchList();
  };
    handleOk = () => {
        this.searchList();
        this.closeModal();
    };

    getRadio = (number,name,value) => {
        if (name === "check") {
            checkStateMaster("dial_injection_set_category",number,value).then(()=>{
                this.searchList();
            });
        }
    };

  render() {
    let {table_data} = this.state;
    return (
      <Modal
        show={true}        
        className="custom-modal-sm basicdata-modal basic-info-view-modal first-view-modal master-modal"
        id="basicdata-modal"
      >
        <Modal.Header>
          <Modal.Title>注射セット分類</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
              <table className="table table-bordered table-scroll" id="basic-data-table">
                <tr className="table-menu">
                    <th className="item-no"/>
                    <th className="table-check">表示</th>
                    <th>分類名称</th>
                    <th>カナ名称</th>
                </tr>
                {table_data != null && table_data.length > 0 && table_data.map((item,index) => {
                  return (
                    <tr key={item.number} onContextMenu={e => this.handleClick(e, index, 0)}>
                        <td className="text-center">{index+1}</td>
                        <td className="text-center table-check">
                            <Checkbox
                                label=""
                                getRadio={this.getRadio.bind(this,item.number)}
                                value={item.is_enabled}
                                name="check"
                            />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.name_kana}</td>
                    </tr>
                  )
                })}
              </table>
            <ContextMenu
                {...this.state.contextMenu}
                parent={this}
                row_index={this.state.row_index}
            />
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button id="btnCancel" className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button id="btnCancel" className="red-btn" onClick={this.openInputModal}>登録</Button>
        </Modal.Footer>
          {this.state.isOpenInputModal && (
            <InjectionSetCategoryInputModal
                modal_data={this.state.modal_data}
                handleOk={this.handleOk}
                closeModal={this.closeModal}
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
      </Modal>
    );  
  }
}
InjectionSetCategoryModal.contextType = Context;
InjectionSetCategoryModal.propTypes = {
  closeModal: PropTypes.func,
};

export default InjectionSetCategoryModal;
