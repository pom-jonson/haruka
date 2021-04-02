import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import styled from "styled-components";
import DoctorKindNav from "../organisms/DoctorKindNav";
import $ from "jquery";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import * as apiClient from "~/api/apiClient";
import { KEY_CODES } from "~/helpers/constants";

const TabContent = styled.div`
  display: flex;
  max-width: 100%;
  width: 100%;
  height: auto;
  max-height: 95%;
  overflow-y: auto;
  padding: 9px 9px 9px 2px;
  flex-direction: column;
  .radio-btn {
    label { font-size: 1rem;}
  }
`;

const SearchPart = styled.div`
    display: flex;
    font-size: 4px;
    margin-bottom: 2px;
    button{
        padding: 4px;
        min-width: 60px;
        span{
            font-weight: 100;
            font-size: 14px;
        }
    }
    .select-id{
        width:40%;
        .dLPwli{
            width: 70%;
        }
        input {
          ime-mode:active;
        }
    }
    .select-word{
        width:60%;
        .dLPwli {
            width: 100%;
        }  
        input {
          ime-mode:active;
          font-size: 14px;
        }  
    }
    label {
        width: 0;
        margin-bottom: 3px;
    }
`;

export class SelectNonAccountDoctorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      showDoctors: this.props.doctors,
      tab: 0,
      usageSelectIndex: -1,
      search_word:'',
      tabs: []
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  async componentDidMount() {
    if (this.props.doctors != undefined && this.props.doctors != null) {
      this.setState({doctors: this.props.doctors});
      this.setDoctors(this.props.doctors);
    }
    else this.searchStaffListKana();
  }

  setDoctors = (doctors) => {
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
    const pa = $(".med-modal .modal-body");
    if (els.length > 0 && pa.length > 0) {
      const scrollTop = 29 * this.state.usageSelectIndex;
      $(pa[0]).scrollTop(scrollTop);
    }
  };

  searchKana = e => {
    var word = e.target.value;
    let search_input_obj = document.getElementById("search_input");
    let cur_caret_pos = search_input_obj.selectionStart;
    word = word.toString().trim();
    // this.context.$updateSchKanaVal(word);
    this.setState({
        search_word:word,
        is_kana: 1,
        cur_caret_pos:cur_caret_pos
    });
  };

  enterPressedKana = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
        this.searchStaffListKana();
    }
  };

  searchStaffListKana = async () => {
    let post_data = {
        schValKana: this.state.search_word,
    };
    let data = await apiClient.post("/app/api/v2/secure/doctor/non_staff_search", {params:post_data});
    this.setState({ doctors: data });
    this.setDoctors(data);
  };

  render() {
    return (
      <Modal
        show={true}
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
        id="prescription_dlg"
        className="custom-modal-sm med-modal"
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>ドクター</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SearchPart>              
            <div className="select-word d-flex ml-2 border p-1 border-dark">
                <InputKeyWord
                    id={'search_input'}
                    type="text"
                    label=""
                    onChange={this.searchKana.bind(this)}
                    onKeyPressed={this.enterPressedKana}
                    onClick={this.onClickInputWord}
                    value={this.state.search_word}
                />
                <Button type="mono" className="search-btn ml-2" onClick={this.searchStaffListKana.bind(this)}>検索</Button>
            </div>
          </SearchPart>
          <div className="categoryContent" style={{height:"calc(100% - 60px)"}}>
            <DoctorKindNav
              selectUsageKind={this.selectUsageKind}
              id={this.state.tab}
              diagnosis={this.state.tabs}
            />
            <TabContent>
                {this.state.showDoctors.map((doctor, index) =>{
                  return (
                      <div
                          key={index}
                          id={doctor.code}
                          label={doctor.name}
                          // usageType={this.state.tab}
                          onClick={this.props.getDoctor}
                          className={`text-center mt-1 ${index === this.state.usageSelectIndex ? "checked" : ""}`}
                          // checked={index === this.state.usageSelectIndex}
                          style={{cursor:"pointer"}}
                      >{doctor.name}</div>
                  )
                })}
            </TabContent>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeDoctor}>キャンセル</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SelectNonAccountDoctorModal.propTypes = {
  selectDoctorFromModal: PropTypes.func,
  closeDoctor: PropTypes.func,
  getDoctor: PropTypes.func,
  doctors: PropTypes.array
};

export default SelectNonAccountDoctorModal;
