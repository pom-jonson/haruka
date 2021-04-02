import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Checkbox from "../../../molecules/Checkbox";
import Button from "../../../atoms/Button";

export class SelectExaminationSetModal extends Component {
  constructor(props) {
    super(props);
    // console.log("this.props.preset", this.props.preset);
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
    // let sel_exams = this.props.selExams;
    let temp = [];
    exam.forEach(function(item){
        item.is_selected = true;        
        // sel_exams.map(sel_item=>{
        //   if (item.examination_code == sel_item.examination_code) {
        //     item.is_selected = true;    
        //   }
        // });
        temp.push(item.examination_code)
    });
    this.setState({
      examinations: exam,
      exam_array: temp
    });
  }

  getRadio = (index, value) => {
    let examination = this.state.examinations;
    let exam_index = examination[index];        

    let temp_array = this.state.exam_array;
    if (value) {
      temp_array.push(exam_index.examination_code);
      examination[index].is_selected = true;
    } else {
      temp_array.splice(temp_array.indexOf(exam_index.examination_code));
      examination[index].is_selected = false;
    }
    this.setState({
      examinations: examination,
      exam_array: temp_array
    });
  }

  handleOk = () => {
    this.props.handleOk(this.state.examinations);
  }

  selectAll = () => {
    var temp = [];
    this.state.examinations.map(item => {
      item.is_selected = true;
      temp.push(item.examination_code);
    })
    this.setState({exam_array:temp})
  }

  deselectAll = () => {
    var temp = [];
    this.state.examinations.map(item => {
      item.is_selected = false;
    })
    this.setState({exam_array:temp});
  }

  render() {
    const presetData = this.state.examinations;
    const pressetList = [];
    presetData.map((exam, index) => {
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
        className="custom-modal-sm preset-modal haruka-preset-modal"
      >
        <Modal.Header>
          <Modal.Title>検査セット</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button type="mono" style={{marginRight:'10px', marginBottom:'10px'}} onClick={this.selectAll.bind(this)}>すべて選択</Button>
          <Button type="mono" onClick={this.deselectAll.bind(this)}>すべて解除</Button>
          <div className="preset-title">{presetData.name}</div>
          <div className="preset">
            <div className="preset-content">{pressetList}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className={`cancel-btn`} onClick={this.props.closeExaminationSet}>キャンセル</Button>
          <Button className={`red-btn`} onClick={this.handleOk}>確定</Button>
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
  selExams: PropTypes.array,
  examOrderList: PropTypes.array,
  handleOk: PropTypes.func,
};

export default SelectExaminationSetModal;
