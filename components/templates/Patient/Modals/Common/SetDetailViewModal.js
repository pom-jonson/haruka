import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";

const Wrapper = styled.div`  
    .flex{
        display:flex;
    }
    table {
        margin-bottom:0px;
        thead{
          display:table;
          width: calc(100% - 17px);
        }
        tbody{
          display:block;
          overflow-y: scroll;
          height:calc(100vh - 13rem);
          width:100%;
        }
        tr{
          display: table;
          width: 100%;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        td {
          word-break: break-all;
          padding: 0.25rem;
        }
        th {
            position: sticky;
            text-align: center;
            padding: 0.3rem;
        }
      }
    
    .table-area {
        width: 100%;
        .table-menu {
            background-color: #a0ebff;
        }        
    }
 `;

class SetDetailViewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isOpenOxygenModal: false,
            setDetailData:this.props.setDetailData,
        }
    }

    render() {        
        return  (
            <Modal show={true} id="set_detail_view_modal"  className="set-detail-view-modal patient-exam-modal">
                <Modal.Header>
                    <Modal.Title>個別指示</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="table-area">
                            <table className="table-scroll table table-bordered mt5" id="code-table">
                                <thead>
                                    <tr className={'table-menu'}>
                                        <td style={{width:"30px"}}/>
                                        <td className="text-center" style={{width:"150px"}}>分類</td>
                                        <td className="text-center">品名/名称</td>
                                        {this.props.modal_type !== undefined && this.props.modal_type === "rehabily" ? (
                                            <>
                                                <td className="text-center" style={{width:"120px"}}>設定値</td>
                                            </>
                                        ) : (
                                            <>
                                            <td className="text-center" style={{width:"105px"}}>数量</td>
                                            <td className="text-center" style={{width:"105px"}}>単位</td>
                                            <td className="text-center" style={{width:"105px"}}>ロット</td>
                                            <td className="text-center" style={{width:"150px"}}>フリーコメント</td>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                {Object.keys(this.state.setDetailData).map((index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={{width:"30px"}} className="text-center td-no">{parseInt(index) + 1}</td>
                                            <td style={{width:"150px"}} className="text-center select-class">{this.state.setDetailData[index]['classfic_name']}</td>
                                            <td className="text-center">{this.state.setDetailData[index]['item_name']}</td>
                                            {this.props.modal_type !== undefined && this.props.modal_type === "rehabily" ? (
                                                <>
                                                    <td style={{width:"120px"}} className="text-center">
                                                        <div>{this.state.setDetailData[index]['value1']}</div>
                                                        <div>{this.state.setDetailData[index]['value2']}</div>
                                                    </td>
                                                </>
                                            ):(
                                                <>
                                                    <td style={{width:"105px"}} className="text-center">{this.state.setDetailData[index]['count']}</td>
                                                    <td style={{width:"105px"}} className="text-center select-unit">{this.state.setDetailData[index]['unit_id'] === 0 ? this.state.setDetailData[index]['main_unit'] : this.state.setDetailData[index]['unit_name']}</td>
                                                    <td style={{width:"105px"}} className="text-center select-unit">{this.state.setDetailData[index]['lot']}</td>
                                                    <td style={{width:"150px"}} className="text-left select-unit">{this.state.setDetailData[index]['comment']}</td>
                                                </>
                                            )}
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </Wrapper>
                </Modal.Body>
                <Modal.Footer>
                  <div onClick={this.props.closeModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}><span>閉じる</span></div>
                </Modal.Footer>
            </Modal>
        );
    }
}

SetDetailViewModal.contextType = Context;

SetDetailViewModal.propTypes = {
    closeModal: PropTypes.func,
    setDetailData: PropTypes.array,
    SetDetailViewModal: PropTypes.array,
    modal_type: PropTypes.string,
    detail_view_practice: PropTypes.string,
};

export default SetDetailViewModal;