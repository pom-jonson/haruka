import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import RadioButton from "./RadioButton";
import styled from "styled-components";
import DoctorKindNav from "../organisms/DoctorKindNav";
import $ from "jquery";
import Button from "~/components/atoms/Button";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import { KEY_CODES } from "~/helpers/constants";
import * as apiClient from "../../api/apiClient";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as localApi from "~/helpers/cacheLocal-utils";

const TabContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem;
  flex-direction: column;
  .radio-btn {
    label {
        font-size: 1rem;
        line-height:16px;
    }
  }
  .radio-btn label:hover {
    background: rgba(160,235,255,1);
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
        div {
          width: calc(100% - 70px);
        }
        input {
          ime-mode:active;
          font-size: 14px;
          margin-top:0;
        }
    }
    label {
        width: 0;
        margin-bottom: 3px;
    }
`;

const Wrapper = styled.div`
    width:100%;
    height:calc(100% - 60px);
`;

export class SelectDoctorModal extends Component {
  constructor(props) {
    super(props);
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    this.main_doctor_id = 0;
    if(current_system_patient_id > 0){
      var patientInfo = karteApi.getPatient(current_system_patient_id);
      if (patientInfo.main_doctor_id > 0){
        this.main_doctor_id = patientInfo.main_doctor_id;
      }
    }
    
    this.state = {
      doctors: [],
      showDoctors: [],
      tab: 0,
      usageSelectIndex: -1,
      tabs: [],
      search_word:'',
      search_id:'',
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }
  
  async componentDidMount() {
    if (this.props.doctors != undefined && this.props.doctors != null && this.props.doctors.length > 0) {
      this.setState({doctors: this.props.doctors});
      this.setDoctors(this.props.doctors);
    } else if (sessApi.getDoctorList() != null) {
      let data = sessApi.getDoctorList();
      this.setState({doctors: data});
      this.setDoctors(data);
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
    if (this.main_doctor_id > 0){
      tabs.push({
        id:tabs.length,
        diagnosis_code:'main',
        name:'主治医'
      })
    }
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
      this.setDoctorAreaHeight();
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
          usageSelectIndex: -1,
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
          usageSelectIndex: -1,
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
    if (e.target.id == this.state.tabs.length -1){
      var main_doctors = this.state.doctors.filter(x => x.number == this.main_doctor_id);
      if (main_doctors.length > 0){
        var temp = [];
        temp.push(main_doctors[0]);
        main_doctors = temp;
      }
      this.setState({
        tab: e.target.id,
        usageSelectIndex: -1,
        showDoctors:main_doctors,
      });
    } else {
      this.setState({ tab: parseInt(e.target.id), usageSelectIndex: -1,});
      this.getShowDoctorList(e.target.id);
    }
    
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
  
  searchId = e => {
    var word = e.target.value;
    word = word.toString().trim();
    this.convertStr(word);
    // this.context.$updateSchIdVal(word);
    this.setState({
      is_kana: 0,
      search_id:word
    });
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
  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.searchStaffList();
    }
  };
  enterPressedKana = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.searchStaffListKana();
    }
  };
  
  convertStr = str => {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
  };
  
  searchStaffList = async () => {
    let post_data = {
      schValId: this.state.search_id,
    };
    let data = await apiClient.post("/app/api/v2/secure/doctor/search_by_condition",{params:post_data});
    this.setState({ doctors: data });
    this.setDoctors(data);
  };
  
  searchStaffListKana = async () => {
    let post_data = {
      schValKana: this.state.search_word,
    };
    let data = await apiClient.post("/app/api/v2/secure/doctor/search_by_condition", {params:post_data});
    this.setState({ doctors: data });
    this.setDoctors(data);
    $('#search_input').focus();
    var strlength = $('#search_input').val().length * 2;
    $('#search_input')[0].setSelectionRange(strlength, strlength);
  };
  
  setDoctorAreaHeight=()=>{
    let doctor_kind_area_obj = document.getElementsByClassName("doctor-kind-area")[0];
    let doctor_name_area_obj = document.getElementsByClassName("doctor-name-area")[0];
    if(doctor_kind_area_obj != undefined && doctor_kind_area_obj != null && doctor_name_area_obj !== undefined && doctor_name_area_obj != null){
      let kind_area_height = 0;
      kind_area_height = doctor_kind_area_obj.offsetHeight;
      doctor_name_area_obj.style['height'] = "calc(100% - "+kind_area_height+"px)";
    }
  }
  
  render() {
    return (
      <Modal
        show={true}
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
        id="prescription_dlg"
        className="patient-exam-modal custom-modal-sm med-modal"
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
          <Wrapper>
            <div className={'doctor-kind-area'}>
              <DoctorKindNav
                selectUsageKind={this.selectUsageKind}
                id={this.state.tab}
                diagnosis={this.state.tabs}
              />
            </div>
            <div className={'doctor-name-area'}>
              <TabContent className='doctors-area'>
                {this.state.showDoctors.map((doctor, index) => {
                  return (
                    <RadioButton
                      key={index}
                      id={doctor.doctor_code}
                      label={doctor.name}
                      name="usage"
                      usageType={this.state.tab}
                      getUsage={this.props.getDoctor}
                      checked={index === this.state.usageSelectIndex}
                    />
                  );
                })}
              </TabContent>
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="ok cancel-btn" onClick={this.props.closeDoctor}>キャンセル</Button>
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
