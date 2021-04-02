import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import ReactToPrint from 'react-to-print';
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 100%;
  float: left;
  padding: 25px;
.flex {
  display: flex;
  flex-wrap: wrap;
  
}
.doc_name {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
}
.fs-20 {
    font-size: 20px;
}
.fs-25 {
    font-size: 25px;
}
.td-w-50 {
    width: 50px;
    font-size: 20px;
    vertical-align: middle;
}
.td-w-100 {
    width: 100px;
    font-size: 20px;
    vertical-align: middle;
    text-align: center;
}
.td-w-150 {
    width: 150px;
    font-size: 20px;
    vertical-align: middle;
    text-align: center;
}
.patient_name {
    font-size: 28px;
    font-weight: bold;
    vertical-align: middle;
}
.td-content {
    width: calc(100% - 150px);
}
.wp-50 {
    width: 50%;
}
.wp-10 {
    width: 10%;
}
.wp-40 {
    width: 40%;
}
.table-bordered th, .table-bordered td {
    border: 1px solid black;
}
.patient_info {
    padding-top: 25px;
    text-align:center;

    th{
        font-size: 20px;
    }
}
td div {
    word-break: break-all;
}
td{ 
    font-size: 16px;
    padding: 5px;
}
.table th, .table td{
    vertical-align: middle;    
}

.facility-div{
    width: 50%;
    float: left;
    font-size: 20px;
}
`;


class AggregateAgePreviewModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }
    }
    closeModal = () => {
        this.props.closeModal();
    };

    render() {
        const { closeModal } = this.props;
        return (
          <Modal
            show={true}
            onHide={closeModal}
            id="add_contact_dlg"
            className="master-modal medical-info-doc-preview-modal"
          >
            <Modal.Header>
              <Modal.Title>年齢別 月間透析実績表</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <ComponentToPrint
                  contents={this.props.contents}
                  japan_year={this.props.japan_year}
                  group_name={this.props.group_name}
                  ref={(el) => (this.componentRef = el)}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
            <Button className="cancel-btn" onClick={closeModal}>キャンセル</Button>
            <ReactToPrint
                trigger={() => <Button className='red-btn'>印刷</Button>}
                content={() => this.componentRef}
            />
            </Modal.Footer>
          </Modal>
        );
    }
}

class ComponentToPrint extends React.Component {
    render() {
        return (
            <Wrapper>
                <div className={'doc_name'}>年齢別 月間透析実績表</div>
                <div className="facility-div">
                    <span>{this.props.japan_year}</span>
                    <span>{"　"}グループ: {this.props.group_name != undefined ? this.props.group_name : "全て"}</span>
                </div>
                <div className={'patient_info'}>
                    <table className="table-scroll table table-bordered">
                        <tr>                            
                            <th className="td-w-150">年齢</th>
                            <th className="td-w-130">男性</th>
                            <th className="td-w-60">女性</th>
                            <th className="td-w-60">合計</th>
                            <th className="td-w-130">年齢比</th>
                        </tr>
                        {Object.keys(this.props.contents).map(index => {
                            let item = this.props.contents[index];
                            return (
                            <>
                            <tr>
                                <td className="text-center">{item.title}</td>
                                <td>{item.man}</td>
                                <td>{item.woman}</td>
                                <td>{item.all}</td>
                                <td>{item.percent}</td>
                            </tr>
                            </>)
                        })}
                    </table>
                </div>               
            </Wrapper>
        );
    }
}

AggregateAgePreviewModal.contextType = Context;

AggregateAgePreviewModal.propTypes = {
    closeModal: PropTypes.func,
    contents: PropTypes.object,
    japan_year: PropTypes.string,
    group_name: PropTypes.string,
};

ComponentToPrint.contextType = Context;

ComponentToPrint.propTypes = {
    closeModal: PropTypes.func,
    contents: PropTypes.object,
    japan_year: PropTypes.string,
    group_name: PropTypes.string,
};

export default AggregateAgePreviewModal;
