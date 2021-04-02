import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { surface, secondary, secondary200, disable } from "~/components/_nano/colors";
import { Modal } from "react-bootstrap";
import * as apiClient from "~/api/apiClient";
import renderHTML from 'react-render-html';
import Button from "~/components/atoms/Button";

const Table = styled.table`
  font-size: 14px;
  font-family: "Noto Sans JP", sans-serif;
  max-height: 60vh;  
  display: inline-block;
  overflow-y: auto;
  overflow-x: scroll;
  margin-bottom: 10px;
  white-space: nowrap
  // width: 100%;
  // width: 1100px;

  a.timeCode:hover{
    cursor: pointer !important;
    color: blue !important;
  }

  .code-label{
    text-align: left;    
    // width: 52%;
    width: 200px;
  }
  .code-label1{
    text-align: left;    
    // width: 82%; 
    width: 500px; 
  }

  .code-value{
    text-align: right;
    // width: 16%; 
    width: 200px; 
  }

  tr {
    &:nth-child(2n + 1) {
      background-color: ${secondary200};
    }
  }

  th{
    position: sticky;
    width: 200px;
    top: 0px;
  }

  th,
  td {
    border: 1px solid ${disable};
    padding: 4px;
  }

  th {
    background-color: ${secondary};
    color: ${surface};
  }
  .selDate {
    background-color : #5f9ea0;
  }
`;

class ExamTimeSeriesModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
        inspectionWithPastList:undefined,
    }
  }

  async componentDidMount() {
    let path = "/app/api/v2/master/examination/searchExamResult";
    const post_data = {
        params: {            
            system_patient_id:this.state.system_patient_id,
            examination_code : this.props.exam_item.examination_code,
        }
    };

    await apiClient.post(path, post_data).then((res)=>{        
        this.setState({
            inspectionWithPastList:res,
        })
    });
  }    

  render() {
    let {inspectionWithPastList} = this.state;
    var inspectionResult = '<></>';
    if (inspectionWithPastList != undefined ){
        inspectionResult = '<tr><td className="code-label">' + this.props.exam_item.name +'</td>';
        inspectionWithPastList.map((item) => {
               inspectionResult += '<td className="';
               if (item.examination_date == this.props.selected_date){
                   inspectionResult += 'selDate code-value">';
               } else {
                   inspectionResult += 'code-value">'
               }
               inspectionResult += item.value;
               inspectionResult += '</td>';
        });
        inspectionResult += '</tr>';
    }
    
    return (
      <Modal
        show={true}        
        id="inspectionWithPast_dlg"
        centered
        size="xl"   
        className="inspectionPast-modal"
      >
        <Modal.Header>
          <Modal.Title>検査結果比較</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {inspectionWithPastList != undefined && (
            <>
            <Table>
                <tr>
                    <th></th>
                    {inspectionWithPastList.map((item, key) => {
                        return(
                            <th key = {key} className={item.examination_date == this.props.selected_date ? 'selDate code-value' : 'code-value '}>{item.examination_date}</th>
                        )
                    })}
                </tr>
            {renderHTML(inspectionResult)}
            </Table>
            </>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ExamTimeSeriesModal.propTypes = {
  closeModal: PropTypes.func,
  system_patient_id : PropTypes.number,
  exam_item : PropTypes.object,
  selected_date : PropTypes.string
};

export default ExamTimeSeriesModal;
