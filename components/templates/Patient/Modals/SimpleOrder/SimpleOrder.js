import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    .flex {
        display: flex;
    }
    .content-area {
        align-items: flex-start;
        justify-content: space-between;
    }
    .left-area {
        width: 58%;
        .select-order {
            width: 200px;
            margin-bottom: 5px;
            .label-title {
                font-size: 16px;
                width: 100px;
            }            
            .pullbox-label {
                width: calc(100% - 50px);
                .pullbox-select {
                    width:100%;
                }
            }
            label{
                margin-bottom: 0px;
            }
            
        }
    }
    .right-area {
        width: 40%;
        .select-item-title {
            height: 38px;
            line-height: 38px;
            margin-bottom: 5px;
        }
    }
    .table-area {
        th {
            text-align: center;
            padding:0;
        }
        td {
            padding:0;
            padding-left:5px;
        }
        .td-no {
            width: 30px;
        }
    }
`;


class SimpleOrder extends Component {
    constructor(props) {
        super(props);
        this.radiation_head=[{id:0, value:"撮影区分"},{id:1, value:"部位"},{id:2, value:"方向"},{id:3, value:"指示"}];
        this.inspection_head=[{id:0, value:"検査種別"},{id:1, value:"部位"}];
        this.endoscope_head=[{id:0, value:"検査種別"},{id:1, value:"検査項目"}];
        this.state = {
            order_type:0,
            head_title:this.radiation_head,
        };
        this.order_types = [{id:0, value:"放射線"},{id:1, value:"生理検査"},{id:2, value:"内視鏡"}];
    }

    async componentDidMount() {
    }

    setOrderType = e => {
        let order_type = parseInt(e.target.id);
        let head_title = this.state.head_title;
        switch (order_type){
            case 0:
                head_title = this.radiation_head;
                break;
            case 1:
                head_title = this.inspection_head;
                break;
            case 2:
                head_title = this.endoscope_head;
                break
        }
        this.setState({
            order_type,
            head_title,
        })
    };

    render() {
        return (
            <>
                <Modal
                    show={true}
                    className="custom-modal-sm patient-exam-modal simple-order first-view-modal"
                >
                    <Modal.Header><Modal.Title>簡易オーダー</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            <div className={'content-area flex'} style={{height:"100%"}}>
                                {/*<div className="order-type">
                                    <div className={'select-order'}>
                                        <SelectorWithLabel
                                            title="オーダ"
                                            options={this.order_types}
                                            getSelect={this.setOrderType}
                                            departmentEditCode={this.state.order_type}
                                        />
                                    </div>
                                </div>*/}
                                <div className={'left-area'}>
                                    <div className={'select-order'}>
                                        <SelectorWithLabel
                                            title="オーダー"
                                            options={this.order_types}
                                            getSelect={this.setOrderType}
                                            departmentEditCode={this.state.order_type}
                                        />
                                    </div>
                                    <div className={'table-area'}>
                                        <table className="table-scroll table table-bordered" id="code-table">
                                            <thead>
                                            <tr>
                                                <th> </th>
                                                {this.state.head_title.map((title, index)=>{
                                                    if(title.value !== ''){
                                                        return (
                                                            <>
                                                                <th>{index+1}</th>
                                                            </>
                                                        )
                                                    }
                                                })}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className={'td-no'}></td>
                                                {this.state.head_title.map((title)=>{
                                                    return (
                                                        <>
                                                            <td>{title.value}</td>
                                                        </>
                                                    )
                                                })}
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className={'right-area'}>
                                    <div className={'select-item-title'}>選択確定項目</div>
                                    <div className={'table-area'}>
                                        <table className="table-scroll table table-bordered" id="code-table">
                                            <thead>
                                            <tr>
                                                <th>種別</th>
                                                <th>項目</th>
                                                <th>数量</th>
                                                <th>単位</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Wrapper>
                    </Modal.Body>
                    <Modal.Footer>
                            <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                            <Button className="red-btn">確定</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

SimpleOrder.contextType = Context;
SimpleOrder.propTypes = {
    closeModal: PropTypes.func,
};

export default SimpleOrder;
