import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import EditBodyTextModal from "~/components/templates/Print/EditBodyTextModal";
import {displayLineBreak} from "~/helpers/dialConstants";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    .flex {
        display: flex;
    }
    .title-area {
        width: 40%;
        margin-right:2%;
        overflow-y: auto;
    }
    .body-area {
        padding:5px;
        width:58%;
        border:1px solid #aaa;
        overflow-y: auto; 
    }
    .selected {
        background: rgb(105, 200, 225) !important;
    }
    .row-item {
        cursor:pointer;
    }
    .row-item:hover {
        background:lightblue !important;
    }
`;

const Footer = styled.div`
  display:flex;
  span{
    color: white;
    font-size: 16px;
  }
  button{
    float: right;
    padding: 5px;
    font-size: 16px;
    margin-right: 16px;
  }
`;

const ContextMenuUl = styled.div`
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
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 16px;
      font-weight: bold;
    }
    img {
      width: 30px;
      height: 30px;
    }
    svg {
      width: 30px;
      margin: 8px 0;
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
  .patient-info-table {
        width: 100%;
        table {
            margin-bottom: 0;
        }
        th {
            font-size: 16px;
            vertical-align: middle;
            padding: 0;
            text-align: right;
            width: 110px;
            padding-right: 5px;
        }
        td {
            font-size: 16px;
            vertical-align: middle;
            padding: 0;
            text-align: left;
            padding-left: 5px;
        }
  }
`;

const ContextMenu = ({visible,x,y,parent}) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    <li><div onClick={() => parent.contextMenuAction()}>編集</div></li>
                </ul>
            </ContextMenuUl>
        );
    } else { return null; }
};

class EditRegularTextModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert_messages:"",
            selected_index:"",
            openEditBodyModal:false,
        };
        this.edit_flag = false;
    }

    async componentDidMount() {
    }

    editBody=(index)=>{
        this.setState({
            selected_index:parseInt(index),
        });

    };

    handleClick=(e, )=>{
        if (e.type === "contextmenu") {
            e.preventDefault();
            // eslint-disable-next-line consistent-this
            const that = this;
            document.addEventListener(`click`, function onClickOutside() {
                that.setState({contextMenu: {visible: false}});
                document.removeEventListener(`click`, onClickOutside);
            });
            window.addEventListener("scroll", function onScrollOutside() {
                that.setState({
                    contextMenu: {visible: false}
                });
                window.removeEventListener(`scroll`, onScrollOutside);
            });
            document
                .getElementById("body_area")
                .addEventListener("scroll", function onScrollOutside() {
                    that.setState({
                        contextMenu: {visible: false}
                    });
                    document
                        .getElementById("body_area")
                        .removeEventListener(`scroll`, onScrollOutside);
                });
            this.setState({
                contextMenu: {
                    visible: true,
                    x: e.clientX - 450,
                    y: e.clientY - 115,
                },
            })
        }
    };

    contextMenuAction = () => {
        this.setState({openEditBodyModal:true});
    };

    closeModal=()=>{
        this.setState({
            openEditBodyModal:false,
            alert_messages:"",
        });
    };

    closeCurModal=()=>{
        this.props.closeModal(this.edit_flag ? 'edit_regular' : "");
    };

    updateBody=(body)=>{
        this.props.modal_data[this.state.selected_index]['body'] = body;
        this.edit_flag = true;
        this.setState({
            openEditBodyModal:false,
            alert_messages:"登録しました。",
        });
    };

    render() {
        return (
            <>
                <Modal
                    show={true}
                    className="master-modal edit-regular-text-modal first-view-modal"
                >
                    <Modal.Header><Modal.Title>定型文設定</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            <div className={'flex'} style={{height:"100%"}}>
                                <div className={'title-area'}>
                                    <table className="table-scroll table table-bordered">
                                        <tr>
                                            <th>欄名</th>
                                            <th>タイトル</th>
                                        </tr>
                                        {this.props.modal_data.map((item, index)=>{
                                            return (
                                                <>
                                                    <tr onClick={this.editBody.bind(this, index)} className={'row-item '+(this.state.selected_index === index ? 'selected' : "")}>
                                                        <td>{item.label}</td>
                                                        <td>{item.title}</td>
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </table>
                                </div>
                                <div className={'body-area'} id={'body_area'} onContextMenu={e=>this.handleClick(e)}>
                                    {this.state.selected_index !== "" ? displayLineBreak(this.props.modal_data[this.state.selected_index]['body']) : ""}
                                </div>
                            </div>
                        </Wrapper>
                    </Modal.Body>
                    <Modal.Footer>
                        <Footer>
                            <Button className={'cancel-btn'} onClick={this.closeCurModal}>キャンセル</Button>
                        </Footer>
                    </Modal.Footer>
                    <ContextMenu
                        {...this.state.contextMenu}
                        parent={this}
                    />
                    {this.state.openEditBodyModal && (
                        <EditBodyTextModal
                            handleOk={this.updateBody}
                            closeModal={this.closeModal}
                            modal_data={this.props.modal_data[this.state.selected_index]}
                        />
                    )}
                    {this.state.alert_messages !== "" && (
                        <SystemAlertModal
                            hideModal= {this.closeModal.bind(this)}
                            handleOk= {this.closeModal.bind(this)}
                            showMedicineContent= {this.state.alert_messages}
                        />
                    )}
                </Modal>
            </>
        );
    }
}

EditRegularTextModal.contextType = Context;
EditRegularTextModal.propTypes = {
    closeModal: PropTypes.func,
    modal_data:PropTypes.array,
};

export default EditRegularTextModal;
