import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import RadioButton from "../../../molecules/RadioButton";
import styled from "styled-components";
import DoctorKindNav from "../../../organisms/DoctorKindNav";
import $ from "jquery";
import Button from "~/components/atoms/Button";

import { KEY_CODES } from "../../../../helpers/constants";

const TabContent = styled.div`
  display: flex;
  max-width: 100%;
  width: 649px;
  height: calc(100vh - 200px);
  padding: 9px 9px 9px 2px;
  flex-direction: column;  
  .radio-btn{
    label{
      font-size:1rem;
      line-height:16px;
    }
`;

export class SelectDoctorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      showDoctors: [],
      tab: 0,
      usageSelectIndex: -1,
      tabs: []
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  async componentDidMount() {
    const doctors = this.props.doctors;
    this.setState({ doctors: this.props.doctors });
    let tabs = [];

    doctors.forEach(function(item) {
      let exists = false;
      tabs.forEach(function(tab) {
        if (tab.diagnosis_code === item.diagnosis_department) {
          exists = true;
        }
      });
      if (exists === false) {
        tabs.push({
          id: tabs.length,
          diagnosis_code: item.diagnosis_department,
          name:
            item.diagnosis_department_name === ""
              ? "その他"
              : item.diagnosis_department_name
        });
      }
    });
    if (tabs.length > 0) {
      if (tabs[0].diagnosis_code === 0) {
        tabs[0].id = tabs.length - 1;
        tabs[tabs.length - 1].id = 0;
        tabs.sort(function(a, b) {
          return a.id - b.id;
        });
      }
    }

    let startIndex = 0;
    tabs.map((tab, index) => {
      if (tab.name === "内科") startIndex = index;
    });

    this.setState({ tabs: tabs, tab: startIndex }, function() {
      this.getShowDoctorList(startIndex);
    });

    if (
      document.getElementById("prescription_dlg") !== undefined &&
      document.getElementById("prescription_dlg") !== null
    ) {
      document.getElementById("prescription_dlg").focus();
    }
  }

  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left) {
      this.setState(
        {
          tab:
            this.state.tab >= 1
              ? this.state.tab - 1
              : this.state.tabs.length - 1,
          usageSelectIndex: -1
        },
        () => {
          this.getShowDoctorList(this.state.tab);
        }
      );
    }

    if (e.keyCode === KEY_CODES.right) {
      this.setState(
        {
          tab:
            this.state.tab + 1 === this.state.tabs.length
              ? 0
              : this.state.tab + 1,
          usageSelectIndex: -1
        },
        () => {
          this.getShowDoctorList(this.state.tab);
        }
      );
    }

    if (e.keyCode === KEY_CODES.up) {
      this.setState(
        {
          usageSelectIndex:
            this.state.usageSelectIndex >= 1
              ? this.state.usageSelectIndex - 1
              : this.state.showDoctors.length - 1
        },
        () => {
          this.scrollToelement();
        }
      );
    }

    if (e.keyCode === KEY_CODES.down) {
      this.setState(
        {
          usageSelectIndex:
            this.state.usageSelectIndex + 1 == this.state.showDoctors.length
              ? 0
              : this.state.usageSelectIndex + 1
        },
        () => {
          this.scrollToelement();
        }
      );
    }

    if (e.keyCode === KEY_CODES.enter) {
      // enter
      if (this.state.usageSelectIndex < 0) return;

      this.props.selectDoctorFromModal(
        this.state.showDoctors[this.state.usageSelectIndex].doctor_code,
        this.state.showDoctors[this.state.usageSelectIndex].name
      );
    }
  }

  setSelectIndex = (index) => {        
    this.setState({usageSelectIndex:index})
  }

  selectUsageKind = e => {
    this.setState({ tab: parseInt(e.target.id), usageSelectIndex: -1 });
    this.getShowDoctorList(e.target.id);
    if (
      document.getElementById("prescription_dlg") !== undefined &&
      document.getElementById("prescription_dlg") !== null
    ) {
      document.getElementById("prescription_dlg").focus();
    }
  };

  getShowDoctorList = index => {
    let showDoctors = [];
    this.state.doctors.forEach(item => {
      if (item.diagnosis_department === this.state.tabs[index].diagnosis_code) {
        showDoctors.push(item);
      }
    });
    this.setState({ showDoctors: showDoctors });
  };
  /* eslint-disable no-console */
  scrollToelement = () => {
    const els = $(".med-modal [class*=focused]");
    const pa = $(".med-modal .doctors-area");
    if (els.length > 0 && pa.length > 0) {
        const scrollTop = 16 * this.state.usageSelectIndex;            
        $(pa[0]).scrollTop(scrollTop);
    }
  };

  render() {
    const doctorList = [];
    this.state.showDoctors.map((doctor, index) => {
      doctorList.push(
        <RadioButton
          key={index}
          id={doctor.doctor_code}
          label={doctor.name}
          name="usage"
          usageType={this.state.tab}
          getUsage={this.props.getDoctor}
          mouseHover = {this.setSelectIndex.bind(this, index)}
          checked={index === this.state.usageSelectIndex}
        />
      );
    });

    return (
      <Modal
        show={true}
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
        id="prescription_dlg"
        className="custom-modal-sm med-modal patient-exam-modal"
      >
        <Modal.Header>
          <Modal.Title>ドクター</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span className="categoryName">ドクター</span>
          <div className="categoryContent">
            <DoctorKindNav
              selectUsageKind={this.selectUsageKind}
              id={this.state.tab}
              diagnosis={this.state.tabs}
            />
            <TabContent className='doctors-area'>{doctorList}</TabContent>
          </div>
        </Modal.Body>
        <Modal.Footer>
            <Button className="ok" onClick={this.closeDoctor}>閉じる</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SelectDoctorModal.propTypes = {
  selectDoctorFromModal: PropTypes.func,
  closeDoctor: PropTypes.func,
  getDoctor: PropTypes.func,
  doctors: PropTypes.array
};

export default SelectDoctorModal;
