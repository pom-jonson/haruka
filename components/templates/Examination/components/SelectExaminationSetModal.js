import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Checkbox from "../../../molecules/Checkbox";
import Button from "../../../atoms/Button";

export class SelectExaminationSetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      examinations: this.props.preset,
      showDoctors: [],
      tab: 0,
      usageSelectIndex: -1,
      tabs: [],
      preset: [],
      exam_array: []
    };
  }

  componentDidMount() {
    let exam = this.props.preset;
    let temp = [];
    exam.examinations.forEach(function(item){
        item.is_selected = true;
        temp.push(item.examination_code)
    });
    this.setState({
      examinations: exam,
      exam_array: temp
    });
  }

  getRadio = (index, value) => {
    let examination = this.state.examinations;
    let temp_array = this.state.exam_array;
    let exam_index = examination.examinations[index];
    if (value) {
      temp_array.push(exam_index.examination_code);
      examination.examinations[index].is_selected = true;
    } else {
      temp_array.splice(temp_array.indexOf(exam_index.examination_code));
      examination.examinations[index].is_selected = false;
    }
    this.setState({
      examinations: examination,
      exam_array: temp_array
    });
  }

  handleOk = () => {
    this.props.handleOk(this.state.examinations.examinations);
  }

  render() {
    const presetData = this.state.examinations;
    const pressetList = [];
    presetData.examinations.map((exam, index) => {
      pressetList.push(
        <>
        <Checkbox
          key={index}
          id={exam.examination_code}
          label={exam.name}
          name={index}
          usageType={this.state.tab}
          getRadio={this.getRadio}
          value={exam.is_selected}
        />
        <br />
        </>
      );
    });

    return (
      <Modal
        show={true}        
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
        id="prescription_dlg"
        className="custom-modal-sm preset-modal"
      >
        <Modal.Header>
          <Modal.Title>検査セット</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="preset-title">{presetData.name}</div>
          <div className="preset">
            <div className="preset-content">{pressetList}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.props.closeExaminationSet}>キャンセル</Button>
          <Button id="btnOk" className={this.state.curFocus === 0?"focus": ""} onClick={this.handleOk}>確定</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SelectExaminationSetModal.propTypes = {
  selectDoctorFromModal: PropTypes.func,
  closeExaminationSet: PropTypes.func,
  getDoctor: PropTypes.func,
  preset: PropTypes.array,
  handleOk: PropTypes.func,
};

export default SelectExaminationSetModal;
