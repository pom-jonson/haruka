import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import PropTypes from "prop-types";
import { Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import PresetPrescriptionModal from "../modals/PresetPrescriptionModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import axios from "axios/index";
import Context from "~/helpers/configureStore";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  .footer {
    margin-left: 40%;
  }
  .footer button {
    margin-right: 0.625rem;
    background-color: rgb(38, 159, 191);
    border-color: rgb(38, 159, 191);
    span {
        color: white;
        font-size: 1.25rem;
    }
  }
`;

const ListTitle = styled.div`
    display: flex;
    height: 1.875rem;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    float: left;
    font-size: 1rem;
    span {
        color: blue;
    }
    .left-area {
        font-size: 1rem;
        padding-top: 0.3rem;
        width: 30%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .right-area {
        width: 35%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
        .display_class {
            width: 85%;
            .pullbox {
                label {
                    width: 100%;
                    select {
                        width: 100%;
                        height: 1.875rem;
                    }
                }
                .label-title {
                    width: 16rem;
                    line-height: 1.875rem;
                    text-align: right;
                    margin-right: 8px;
                }
            }
        }
    }
    .tl {
        width: 50%;
        text-align: left;
    }
    .tr {
        width: 50%;
        text-align: right;
        cursor: pointer;
        padding: 0;
    }
`;

const Content = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    margin-bottom: 1.25rem;
    height: 80%;
    width: 35%;
    // float: left;
    .classific {
        margin-bottom: 0.625rem;
        margin-top: 0.625rem;
    }
    label {
        margin: 0;
    }
    .div-with-label {
        display: flex;
        label {
            width: 5.625rem;
            text-align: right;
            margin-right: 0.625rem;
            padding: 0.3rem 0;
        }
    }
    .border-div {
        border: solid 1px #ddd;
        padding: 0.3rem 0.625rem;
    }
    .w80 {width: 80%;}
    .w50 {
        width: 50%;
    }
    .w30 {
        width: 30%;
    }
    .w70 {
        width: 70%;
    }
    .border-left: {
        border-left: solid 1px #ddd;
    }
    .w60p { width: 2.5rem;}
    .flex {display: flex}
    .w100 {    
        width: calc(100% - 13.75rem);
    }
    .w100p { width: 6.25rem;}
    .display_class { margin-left: 40%;}
 `;

const List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    width: 30%;
    margin-right: 2%;
    height: 80%;
    margin-bottom: 1.25rem;
    float: left;
    border: solid 1px lightgrey;
    label {
        margin: 0;
    }
    table {
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        td {
            padding: 0.25rem;
            text-align: center;
            input {
                margin: 0;
            }
        }
        th {
            text-align: center;
            padding: 0.3rem;
        }
        .table-check {
            width: 3.75rem;
        }
        .code-number {
            width: 7.5rem;
        }
    }
    .tl {
        text-align: left;
    }
    .tr {
        text-align: right;
    }
 `;

const display_class = [
    { id: 0, value: "全て" },
    { id: 1, value: "表示のみ" },
    { id: 2, value: "非表示のみ" },
];

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);    
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;    
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0 0rem;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({
                         visible,
                         x,
                         y,
                         parent,
                         favouriteMenuType,
                     }) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    <li>
                        <div onClick={() =>parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div>
                    </li>
                    <li>
                        <div onClick={() =>parent.contextMenuAction(favouriteMenuType, "edit")}>編集</div>
                    </li>
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

class PresetPrescription extends Component {
    constructor(props) {
        super(props);
        let list_item = [
            { id: 0, simple_name: "Ｋ－尿" },
            { id: 1, simple_name: "ＩＰ－尿" },
            { id: 2, simple_name: "鉄（Ｆｅ）－尿" },
            { id: 3, simple_name: "Ｃｕ－尿" },
            { id: 4, simple_name: "Ｎａ－尿" },
            { id: 5, simple_name: "Ｃａ－尿" },
            { id: 6, simple_name: "Ｃｌ－尿" },
            { id: 7, simple_name: "尿酸－尿（ｍｇ）" },
            { id: 8, simple_name: "ＣＲＥ－尿　ｍｇ" },

        ];
        let list_array = [];
        this.state = {
            schVal: "",
            list_array,
            list_item,
            isOpenPatternModal: false,
            title: '',
            modal_data: {},
        }
    }


    createPattern = () => {
        this.setState({
            isOpenPatternModal: true,
            title: "処方分類 変更",
            modal_data:null
        });
    }
    createSet = () => {
        this.setState({
            isOpenPatternModal: true,
            title: "処方セット 変更"
        });
    }
    closeModal = () => {
        this.setState({
            isOpenPatternModal: false,
            isOpenSetModal: false,
        })
    }

    getRadio = (name) => {
        if (name === "check") {
            // console.log(name)
        }
    };
    getPrescriptionClassificList = async () => {
        let path = "/app/api/v2/dial/master/get_prescription_category";
        let post_data = {
            is_enabled: 1,
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({list_array: data});
    };

    handleClick = (e, type) => {
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
                    x: e.clientX - 300,
                    y: e.clientY - 150 + window.pageYOffset
                },
                favouriteMenuType: type
            });
        }
    }
    contextMenuAction = (index, type) => {
        if (type === "edit"){
            this.editData(index);
        }
        if (type === "delete"){
            if(this.state.list_array !== null && this.state.list_array !== undefined && this.state.list_array.length > 0){
                this.deleteData(this.state.list_array[index].number);
            } else {
                this.deleteData(this.props.modal_data[index].number);
            }
        }
    };
    handleOk = () => {
        this.setState({
            isOpenPatternModal: false
        });
        this.getPrescriptionClassificList();
    };
    editData = (index) => {
        let modal_data = [];
        if(this.state.list_array !== null && this.state.list_array !== undefined && this.state.list_array.length > 0){
            modal_data = this.state.list_array[index];
        } else {
            modal_data = this.props.modal_data[index];
        }
        this.setState({
            modal_data,
            // row_index: index,
            isOpenPatternModal: true
        });
    };
    deleteData = async (index) => {
        let path = "/app/api/v2/dial/master/delete_prescription_category";
        let post_data = {
            params: index,
        };
        await axios.post(path,  post_data);
        window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
        this.getPrescriptionClassificList();
    };

    onHide=()=>{}

    render() {
        let list_array = [];
        if(this.state.list_array !== null && this.state.list_array !== undefined && this.state.list_array.length > 0){
            list_array = this.state.list_array;
        } else {
            list_array = this.props.modal_data;
        }
        return (
            <Modal show={true} onHide={this.onHide}  className="wordPattern-modal master-modal preset-prescription-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>処方セット</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <ListTitle>
                            <div className="left-area">
                                <div className="tl">処方分類一覧</div>
                                <Col className="tr" onClick={this.createPattern}>
                                    <Icon icon={faPlus} />処方分類を追加
                                </Col>
                            </div>
                            <div className="left-area">
                                <div className="tl">処方セット一覧</div>
                                <div className="tr" onClick={this.createSet}><Icon icon={faPlus} />処方セットを追加</div>
                            </div>
                            <div className="right-area">
                                <div className="display_class">
                                    <SelectorWithLabel
                                        options={display_class}
                                        title="表示区分"
                                        // getSelect={this.getPrescriptionSelect}
                                        // departmentEditCode={diagnosisOption[this.state.diagnosisDivision].id}
                                    />
                                </div>
                            </div>
                        </ListTitle>
                        <List>
                            <table className="table-scroll table table-bordered" id="code-table">
                                <thead>
                                <tr>
                                    <th/>
                                    <th className="table-check">表示</th>
                                    <th className="">処方分類</th>
                                </tr>
                                </thead>
                                <tbody>

                                {list_array !== null && list_array !== undefined && list_array.length > 0 && (
                                    list_array.map((item, index) => {
                                        return (
                                        <>
                                        <tr onContextMenu={e => this.handleClick(e, index)}>
                                            <td>{index+1}</td>
                                            <td>
                                                <Checkbox
                                                label=""
                                                getRadio={this.getRadio.bind(this)}
                                                value={this.state.allChecked}
                                                name="check"
                                                />
                                            </td>
                                            <td className="tl">{item.name}</td>
                                        </tr>
                                        </>)
                                    })
                                )}
                                </tbody>
                            </table>
                        </List>
                        <List>
                            <table className="table-scroll table table-bordered">
                                <thead>
                                <tr>
                                    <th/>
                                    <th className="table-check">表示</th>
                                    <th className="">処方分類</th>
                                </tr>
                                </thead>
                                <tbody>

                                {list_array !== null && list_array !== undefined && list_array.length > 0 && (
                                    list_array.map((item, index) => {
                                        return (
                                        <>
                                        <tr>
                                            <td>{index+1}</td>
                                            <td>
                                                <Checkbox
                                                label=""
                                                getRadio={this.getRadio.bind(this)}
                                                value={this.state.allChecked}
                                                name="check"
                                                />
                                            </td>
                                            <td className="tl">{item.name}</td>
                                        </tr>
                                        </>)
                                    })
                                )}
                                </tbody>
                            </table>
                        </List>
                        <Content>
                            <div className={`div-with-label classific`}>
                                <label>区分</label>
                                <div className={`border-div w100`}>区分1</div>
                            </div>
                            <div className={`div-with-label`}>
                                <label>薬剤1</label>
                                <div className={`border-div w100`}>リスミック瓶10mg</div>
                                <div className={`border-div w60p`}>1</div>
                                <label className={`text-left`}>瓶</label>
                            </div><div className={`div-with-label`}>
                                <label>薬剤2</label>
                                <div className={`border-div w100`}></div>
                                <div className={`border-div w60p`}></div>
                                <label className={`text-left`}> </label>
                            </div><div className={`div-with-label`}>
                                <label>薬剤3</label>
                                <div className={`border-div w100`}></div>
                                <div className={`border-div w60p`}></div>
                                <label className={`text-left`}> </label>
                            </div><div className={`div-with-label`}>
                                <label>薬剤4</label>
                                <div className={`border-div w100`}></div>
                                <div className={`border-div w60p`}></div>
                                <label className={`text-left`}> </label>
                            </div><div className={`div-with-label`}>
                                <label>薬剤5</label>
                                <div className={`border-div w100`}></div>
                                <div className={`border-div w60p`}></div>
                                <label className={`text-left`}> </label>
                            </div>

                            <div className="display_class mt-4 flex">
                                <input type="text" value={10} className={`w100p`}/>
                                <div>回分</div>
                            </div>
                            <div className={`div-with-label mt-4`}>
                                <label>服用1</label>
                                <div className={`border-div w100`}></div>
                            </div><div className={`div-with-label `}>
                                <label>服用2</label>
                                <div className={`border-div w100`}></div>
                            </div>
                            <div className={`div-with-label mt-4`}>
                                <label>コメント1</label>
                                <div className={`border-div w100`}></div>
                            </div><div className={`div-with-label `}>
                                <label>コメント2</label>
                                <div className={`border-div w100`}></div>
                            </div>
                        </Content>
                        <div className="footer-buttons">
                          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                          {/* <span className='right-btn'>
                            <Button>登録</Button>
                          </span> */}
                        </div>
                        {this.state.isOpenPatternModal && (
                            <PresetPrescriptionModal
                                handleOk={this.handleOk}
                                closeModal={this.closeModal}
                                title={this.state.title}
                                modal_data = {this.state.modal_data}
                            />
                        )}
                        <ContextMenu
                            {...this.state.contextMenu}
                            parent={this}
                            favouriteMenuType={this.state.favouriteMenuType}
                        />
                </Wrapper>
            </Modal.Body>
        </Modal>
    );
    }
}
PresetPrescription.contextType = Context;

PresetPrescription.propTypes = {
    modal_data: PropTypes.object,
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,
    saveDailysisSchedule:PropTypes.func,
    schedule_item:PropTypes.object
};

export default PresetPrescription