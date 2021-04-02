import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import * as apiClient from "~/api/apiClient";
import TimeSeriesChart from "~/components/organisms/TimeSeriesChart";
import Button from "~/components/atoms/Button";

class ExamGraphModal extends Component {
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
    var inspectionResult = new Array();
    inspectionResult[0] = {values:[], label:'日付'};
    if (inspectionWithPastList != undefined ){
        inspectionWithPastList.map((item) => {
          inspectionResult[0].values.push({x:item.examination_date , y:item.value})
        })
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
          <Modal.Title>時系列</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {inspectionResult != undefined && inspectionResult[0].values.length>0 && (
            <TimeSeriesChart
              showData={inspectionResult}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ExamGraphModal.propTypes = {
  closeModal: PropTypes.func,
  system_patient_id : PropTypes.number,
  exam_item : PropTypes.object,
  selected_date : PropTypes.string
};

export default ExamGraphModal;
