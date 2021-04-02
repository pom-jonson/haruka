import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Checkbox from "~/components/molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
// import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import {toHalfWidthOnlyNumber, setDateColorClassName} from "~/helpers/dialConstants";
import Spinner from "react-bootstrap/Spinner";
import DatePicker, { registerLocale } from "react-datepicker";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  font-size: 1rem;
  width: 100%;
  height: auto;
  padding-left:1rem;
  padding-top:0rem;
 .react-datepicker-popper {
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
 }

  input[type="text"]{
    font-size:1rem!important;
    height:1.5rem;
  }
  label{
    font-size:1rem!important;
    margin-bottom:0;
  }

  .sub-title{
    font-size:1rem;
  }
  .one-block{
    margin-right:3rem;
    div{
      margin-top:0.1rem;
    }
    .label-title{
      margin-top:0px;
      font-size:1rem;
      margin-bottom:0px;
      padding-top:0.2rem;
      text-align:right;    
    }  
    .react-datepicker__input-container{
      input{
        width:7rem;
        font-size:1rem;
      }
    }
  }
  .datetime-area{
    div{
      margin-top:0.1rem;
    }
    .label-title{
      width:14rem;
    }
    .react-datepicker-popper{
      // left:1.5rem!important;
    }
  }
  .blog-title{
    font-size:1rem;
    margin-bottom:0.1rem;
    margin-top:0rem;
    font-weight:bold;
  }
  .content-label{
    border:1px solid;
    min-width:4rem;
    min-height:1.2rem;  
    max-height:1.5rem;
    height:1.5rem;
    padding:0;
    padding-left:0.1rem;
  }
  .pullbox{
    width:calc(100% + 1rem);
  }
  .pullbox-label, .pullbox-select{
    // max-width:10rem;
    width:100%;
    max-height:1.6rem;
    font-size:1rem;
    max-width:57rem;
  }
  .pullbox-title{
    display:none;
  }
  .name-label{
    width:3.5rem;
  }
  .note-label{
    width:7rem;
  }
  .name-content{
    min-width:13rem; 
  }
  .note-content{
    width:9.5rem;
  }
  .one-row{
    margin-bottom:0rem;
  }
  .checkbox{
    label{
      width:5rem;
      font-size:1rem!important;
      height:1rem;
    }
    input[type='checkbox']{
      width:1rem!important;
      height:1rem!important;
    }
  }
  .title-label{
    margin-bottom:0;
    margin-top:0.2rem;  
    padding:0rem;
    margin-right:0.5rem;
    margin-left:0rem;
  }
  textarea{
    height:2rem;
  }
  .unit-label{
    margin-bottom:0;
    margin-top:0.3rem;
    margin-right:0.3rem;
    margin-left:0.3rem;    
  }  
  .border-block{
    border: 1px solid #aaa;
    position: relative;
    padding-left:0.5rem;
    padding-right:0.5rem;
    padding-top:0.7rem;
    padding-bottom:0.4rem;
    margin-right:1rem;
    .title-label{
      position:absolute;
      top:-0.8rem;
      left:0.5rem;
      background:white;
    }
    label{
      margin-right:0.5rem;
    }
    .border-label{
      margin-left:1rem;
    }
  }
  .date-block {
    position: static;
    .title-label {
      position: relative;
      margin-top: -0.5rem;
      width: 12rem;
      margin-bottom: -1rem;
    }
  }
  .select-block{
    padding-right:1rem;
  }
`;

class ProfileComp extends Component {
    constructor(props) {
        super(props);
        this.state ={};
        var profile_data = this.props.general_data.profile_data;
        var emergency_contact_data_1 = this.props.general_data.emergency_contact_data_1;
        var emergency_contact_data_2 = this.props.general_data.emergency_contact_data_2;
        var emergency_contact_data_3 = this.props.general_data.emergency_contact_data_3;
        Object.keys(profile_data).map(key => {
          this.state[key] = profile_data[key]
        });
        Object.keys(emergency_contact_data_1).map(key => {
          this.state[key] = emergency_contact_data_1[key]
        });
        Object.keys(emergency_contact_data_2).map(key => {
          this.state[key] = emergency_contact_data_2[key]
        });
        Object.keys(emergency_contact_data_3).map(key => {
          this.state[key] = emergency_contact_data_3[key]
        });
        this.state['general_data'] = this.props.general_data;                
        this.state['patientDetail'] = this.props.detailedPatientInfo.patient[0];
        if (this.props.detailedPatientInfo.address.length > 0){
          var address = this.props.detailedPatientInfo.address.filter(x => x.address_type_number == 1);
          this.state['address'] = address;
        } else {
          this.state['address'] = [];
        }
        this.state['is_loaded'] = true;
        
        this.criteria_options = [
          {id:0, value:''},
          {id:1, value:'Ⅰ'},
          {id:2, value:'Ⅱ'},
          {id:3, value:'Ⅱa'},
          {id:4, value:'Ⅱb'},
          {id:5, value:'Ⅲ'},
          {id:6, value:'Ⅲa'},
          {id:7, value:'Ⅲb'},
          {id:8, value:'Ⅳ'},
          {id:9, value:'M'},
        ]
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      var state_variabel = {};
      Object.keys(nextProps.general_data.profile_data).map(key => {
        state_variabel[key] = nextProps.general_data.profile_data[key];
      })
      Object.keys(nextProps.general_data.emergency_contact_data_1).map(key => {
        state_variabel[key] = nextProps.general_data.emergency_contact_data_1[key];
      })
      Object.keys(nextProps.general_data.emergency_contact_data_2).map(key => {
        state_variabel[key] = nextProps.general_data.emergency_contact_data_2[key];
      })
      Object.keys(nextProps.general_data.emergency_contact_data_3).map(key => {
        state_variabel[key] = nextProps.general_data.emergency_contact_data_3[key];
      })
      state_variabel['general_data'] = nextProps.general_data;      
      this.setState(state_variabel);
    }

    getEnforcementdate=(e)=> {
      this.setState({replacement_enforcement_date:e});

      var general_data = this.state.general_data;
      general_data.profile_data.replacement_enforcement_date = e;
      this.props.handleGeneralOk(general_data);
    }

    getNextScheduleddate=(e)=> {
      this.setState({next_scheduled_replacement_date:e});

      var general_data = this.state.general_data;
      general_data.profile_data.next_scheduled_replacement_date = e;
      this.props.handleGeneralOk(general_data);
    }

    getDisease = (e) => {
      this.setState({
        disease_name:e.target.value,
        medical_history_id:e.target.id
      })
      var general_data = this.state.general_data;
      general_data.profile_data.medical_history_id = e.target.id;
      this.props.handleGeneralOk(general_data);
    }

    getHospitalPurpose = (e) => {
      this.setState({
        // purpose_number:e.target.id,
        purpose_of_hospitalization:e.target.id,
      })

      var general_data = this.state.general_data;
      general_data.profile_data.purpose_of_hospitalization = e.target.id;
      this.props.handleGeneralOk(general_data);
    }

    getCriteria = (e) => {
      this.setState({
        criteria:e.target.id
      })
      var general_data = this.state.general_data;
      general_data.profile_data.criteria = e.target.id;
      this.props.handleGeneralOk(general_data);
    }

    getScale = (e) => {
      let input_value = e.target.value.replace(/[^0-9０-９]/g, "");
      if (input_value != "") {
        input_value = parseInt(toHalfWidthOnlyNumber(input_value));
      }
      this.setState({
        braden_scale:input_value
      })

      var general_data = this.state.general_data;
      general_data.profile_data.braden_scale = input_value;
      this.props.handleGeneralOk(general_data);
    }

    getNurse = (e) => {
      this.setState({
        hearing_nurse_id:e.target.id,        
      })
      var general_data = this.state.general_data;
      general_data.profile_data.hearing_nurse_id = e.target.id;      
      this.props.handleGeneralOk(general_data);
    }

    selectCheckBox = (name, value) => {
      this.setState({[name]:value})
      var general_data = this.state.general_data;
      general_data.profile_data[name] = value;
      this.props.handleGeneralOk(general_data);
    }

    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;
      general_data.profile_data[name] = e.target.value;
      this.props.handleGeneralOk(general_data);
    }

    getSelect = (name, e) => {      
      this.setState({[name]:e.target.id});
      var general_data = this.state.general_data;
      general_data.profile_data[name] = e.target.id;
      this.props.handleGeneralOk(general_data);
    }

    getEmergenCy = (name, sub_key, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;
      general_data[sub_key][name] = e.target.value;
      this.props.handleGeneralOk(general_data);
    }

    render() {      
      var patientInfo = this.props.patientInfo;
      var address = this.state.address;
        return (
          <DatePickerBox>
            <Wrapper>
              {this.state.is_loaded == true && (
                <>
                  <div className='main-info'>
                    <div className='blog-title'>基本情報</div>
                    <div className='flex' style={{marginTop:'0.5rem'}}>
                      <div className='one-block border-block'>
                        <div className='title-label'>ID</div>
                        <div className='content-label name-content'>{patientInfo.receId}</div>
                      </div>
                      <div className='one-block border-block'>
                        <div className='title-label'>氏名</div>
                        <div className='content-label name-content'>{patientInfo.name}</div>
                      </div>
                      <div className='one-block border-block'>
                        <div className='title-label'>カナ氏名</div>
                        <div className='content-label name-content'>{patientInfo.kana}</div>
                      </div>
                      <div className='one-block border-block'>
                        <div className='title-label'>性別</div>
                        <div className='content-label'>{patientInfo.sex==1?'男':'女'}</div>
                      </div>
                      <div className='one-block border-block'>
                        <div className='title-label'>生年月日</div>
                        <div className='content-label name-content'>{patientInfo.birthDate}</div>
                      </div>
                      <div className='one-block border-block'>
                        <div className='title-label'>血液	</div>
                        <div className='flex'>
                          <label style={{marginRight:'3px', marginBottom:'0px', padding:'0px', marginTop:'0.1rem'}}>血液型</label>
                          <div className='content-label'></div>
                          <label style={{marginRight:'10px', marginTop:'0.1rem', marginBottom:'0px', padding:'0px'}}>型</label>
                          <label style={{marginRight:'3px',marginTop:'0.1rem', marginBottom:'0px', padding:'0px'}}>Rh型</label>
                          <div className='content-label'></div>
                        </div>
                      </div>
                    </div>
                    <div className='flex' style={{marginTop:'1rem'}}>
                      <div className='one-block border-block'>
                        <div className='title-label'>入院日</div>
                        <div className='content-label'>{this.state.hospitalization_date}</div>
                      </div>
                      <div className='one-block border-block'>
                        <div className='title-label'>入院時間</div>
                        <div className='flex'>
                          <div className='content-label'>{this.state.hospitalization_time_hour}</div>
                          <label className='unit-label'>時</label>
                          <div className='content-label'>{this.state.hospitalization_time_minute}</div>
                          <label className='unit-label'>分</label>
                        </div>
                      </div>
                      <div className='one-block border-block' style={{width:''}}>
                        <div className='title-label'>入院回数</div>
                        <div className='content-label'>{this.state.number_of_hospitalizations}</div>
                      </div>
                      <div className='one-block border-block'>
                        <div className='title-label'>郵便番号</div>
                        <div className='content-label name-content'>{address.length > 0? address[0].postal_code:''}</div>
                      </div>
                      <div className='one-block border-block'>
                        <div className='title-label'>居住地</div>
                        <div className='content-label name-content' style={{minWidth:'20rem'}}>{address.length > 0? address[0].address:''}</div>
                      </div>
                      <div className='one-block border-block'>
                        <div className='title-label'>自宅電話番号</div>
                        <div className='content-label name-content'>{address.length > 0? address[0].phone_number_1:''}</div>
                      </div>
                    </div>
                  </div>
                  <div className='flex' style={{marginTop:'0.8rem'}}>
                    <div className='contact-info border-block'>
                      <div className='title-label'>緊急連絡先</div>
                      <div className='flex' style={{paddingTop:'0.5rem'}}>
                        <div className='one-block'>
                          <div className='one-row flex'>
                            <label className='name-label'>シメイ</label>
                            <input className='content-label name-content' value={this.state.name_kana_1} onChange={this.getEmergenCy.bind(this, 'name_kana_1', 'emergency_contact_data_1')}></input>
                            {/* <div className='content-label name-content'></div> */}
                          </div>
                          <div className='one-row flex'>
                            <label className='name-label'>氏名</label>
                            <input className='content-label name-content' value={this.state.name_1} onChange={this.getEmergenCy.bind(this, 'name_1', 'emergency_contact_data_1')}></input>
                            {/* <div className='content-label name-content'></div> */}
                          </div>
                          <div className='one-row flex'>
                            <label className='note-label'>本人との間柄</label>
                            <input className='content-label note-content' value={this.state.relations_1} onChange={this.getEmergenCy.bind(this, 'relations_1', 'emergency_contact_data_1')}></input>
                            {/* <div className='content-label note-content'></div> */}
                          </div>
                          <div className='one-row flex'>
                            <label className='note-label'>備考</label>                            
                            {/* <div className='content-label note-content'></div> */}
                            <textarea className='content-label note-content' onChange={this.getEmergenCy.bind(this, 'remarks_1', 'emergency_contact_data_1')} value={this.state.remarks_1}></textarea>
                          </div>
                        </div>
                        <div className='one-block'>
                          <div className='one-row flex'>
                            <label className='name-label'>シメイ</label>
                            <input className='content-label name-content' value={this.state.name_kana_2} onChange={this.getEmergenCy.bind(this, 'name_kana_2', 'emergency_contact_data_2')}></input>
                            {/* <div className='content-label name-content'></div> */}
                          </div>
                          <div className='one-row flex'>
                            <label className='name-label'>氏名</label>
                            <input className='content-label name-content' value={this.state.name_2} onChange={this.getEmergenCy.bind(this, 'name_2', 'emergency_contact_data_2')}></input>
                            {/* <div className='content-label name-content'></div> */}
                          </div>
                          <div className='one-row flex'>
                            <label className='note-label'>本人との間柄</label>
                            <input className='content-label note-content' value={this.state.relations_2} onChange={this.getEmergenCy.bind(this, 'relations_2', 'emergency_contact_data_2')}></input>
                            {/* <div className='content-label note-content'></div> */}
                          </div>
                          <div className='one-row flex'>
                            <label className='note-label'>備考</label>
                            {/* <div className='content-label note-content'></div> */}
                            <textarea className='content-label note-content' onChange={this.getEmergenCy.bind(this, 'remarks_2', 'emergency_contact_data_2')} value={this.state.remarks_2}></textarea>
                          </div>
                        </div>
                        <div className='one-block' style={{marginRight:0}}>
                          <div className='one-row flex'>
                            <label className='name-label'>シメイ</label>
                            <input className='content-label name-content' value={this.state.name_kana_3} onChange={this.getEmergenCy.bind(this, 'name_kana_3', 'emergency_contact_data_3')}></input>
                            {/* <div className='content-label name-content'></div> */}
                          </div>
                          <div className='one-row flex'>
                            <label className='name-label'>氏名</label>
                            <input className='content-label name-content' value={this.state.name_3} onChange={this.getEmergenCy.bind(this, 'name_3', 'emergency_contact_data_3')}></input>
                            {/* <div className='content-label name-content'></div> */}
                          </div>
                          <div className='one-row flex'>
                            <label className='note-label'>本人との間柄</label>
                            <input className='content-label note-content' value={this.state.relations_3} onChange={this.getEmergenCy.bind(this, 'relations_3', 'emergency_contact_data_3')}></input>
                            {/* <div className='content-label note-content'></div> */}
                          </div>
                          <div className='one-row flex'>
                            <label className='note-label'>備考</label>
                            {/* <div className='content-label note-content'></div> */}
                            <textarea className='content-label note-content' onChange={this.getEmergenCy.bind(this, 'remarks_3', 'emergency_contact_data_3')} value={this.state.remarks_3}></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='visitor-hospital border-block'>
                      <div className='title-label'>来院者</div>
                      <div className='one-row checkbox'>                    
                        <Checkbox
                          label={'本人'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.myself_flag}
                          name="myself_flag"
                        />
                      </div>
                      <div className='one-row checkbox'>                    
                        <Checkbox
                          label={'配偶者'}                      
                          getRadio={this.selectCheckBox.bind(this)}                      
                          value = {this.state.spouse_flag}
                          name="spouse_flag"
                        />
                        <Checkbox
                          label={'母親'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          className='checkbox'
                          value = {this.state.mother_flag}
                          name="mother_flag"
                        />
                        <Checkbox
                          label={'父親'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          className='checkbox'
                          value = {this.state.father_flag}
                          name="father_flag"
                        />
                      </div>
                      <div className='one-row checkbox'>                    
                        <Checkbox
                          label={'子供'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.children_flag}
                          name="children_flag"
                        />
                        <input type='text' disabled={this.state.children_flag != true} onChange={this.getInputText.bind(this, 'other_children')} value={this.state.other_children}></input>
                      </div>                  
                      <div className='one-row checkbox'>                    
                        <Checkbox
                          label={'兄弟'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.brother_flag}
                          name="brother_flag"
                        />
                        <input type='text' disabled={this.state.brother_flag != true} onChange={this.getInputText.bind(this, 'other_brother')} value={this.state.other_brother}></input>
                      </div>
                      <div className='one-row checkbox'>                    
                        <Checkbox
                          label={'その他'}                      
                          getRadio={this.selectCheckBox.bind(this)}                      
                          value = {this.state.other_flag}
                          name="other_flag"
                        />
                        <input type='text' disabled={this.state.other_flag != true} onChange={this.getInputText.bind(this, 'other_visitor')} value={this.state.other_visitor}></input>
                      </div>
                    </div>
                  </div>
                  <div className='flex' style={{marginTop:'0.9rem'}}>
                    <div className='one-block disease-name-area border-block' style={{paddingRight:'1rem'}}>
                      <div className='title-label'>病歴</div>
                      <SelectorWithLabel
                        options={this.props.diseaseName_options}
                        title={''}
                        getSelect={this.getDisease.bind(this)}
                        departmentEditCode={this.state.medical_history_id}
                      />
                    </div>
                    <div className='one-block border-block'>
                      <div className='title-label'>キーパーソン</div>
                      <div className='flex'>
                        <label className='border-label'>氏名</label>
                        <input className='content-label note-content' onChange={this.getInputText.bind(this, 'key_pearson')} value={this.state.key_pearson}></input>
                        <label className='border-label'>本人との間柄</label>
                        <input className='content-label note-content' onChange={this.getInputText.bind(this, 'relation')} value ={this.state.relation}></input>
                      </div>
                    </div>
                  </div>
                  <div className='doctor-info'>
                    <div className='blog-title' style={{marginTop:'0.5rem'}}>医療情報</div>
                    <div className='flex' style={{marginTop:'1rem'}}>
                      <div className='one-block'>
                        <div className='border-block select-block'>
                          <div className='title-label'>入院目的</div>
                          <SelectorWithLabel
                            options={this.props.hosptial_purpose_master_options}
                            title={''}
                            getSelect={this.getHospitalPurpose.bind(this)}
                            departmentEditCode={this.state.purpose_of_hospitalization}
                          />
                        </div>
                      </div>                  
                      <div className='one-block border-block'>
                        <div className='title-label'>バイタルサイン</div>
                        <div className='flex'>
                          <label className='border-label' style={{paddingTop:'0.2rem'}}>R</label>
                          <div className='content-label'></div>
                          <label className='border-label' style={{paddingTop:'0.2rem'}}>P</label>
                          <div className='content-label'>{patientInfo.pluse}</div>
                          <label className='border-label' style={{paddingTop:'0.2rem'}}>HR</label>
                          <div className='content-label'></div>
                          <label className='border-label' style={{paddingTop:'0.2rem'}}>DBP</label>
                          <div className='content-label'>{patientInfo.max_blood}</div>
                          <label className='border-label' style={{paddingTop:'0.2rem'}}>SBP</label>
                          <div className='content-label'>{patientInfo.min_blood}</div>
                        </div>
                        <div className='flex' style={{marginTop:'0.5rem'}}>
                          <label className='' style={{marginRight:'0.6rem', marginLeft:'1rem'}}>測定禁止部位・備考</label>
                          <input onChange={this.getInputText.bind(this, 'measurement_prohibited_area')} value={this.state.measurement_prohibited_area} className='content-label' style={{width:'60rem'}}></input>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  <div className='flex' style={{marginTop:'1rem'}}>
                    <div className='one-block border-block'>
                      <div className='title-label'>入院歴</div>
                      <Radiobox
                        id = {'inhospital_no'}
                        label={'なし'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'hospitalization_history')}
                        checked={this.state.hospitalization_history == 0 ? true : false}
                        name={`inhospital`}
                      />
                      <Radiobox
                        id = {'inhospital_yes'}
                        label={'あり'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'hospitalization_history')}
                        checked={this.state.hospitalization_history == 1 ? true : false}
                        name={`inhospital`}
                      />
                      <label className='border-label'>入院履歴等その他備考</label>
                      <textarea className='note-content' value={this.state.hospitalization_history_reference} disabled={this.state.hospitalization_history != 1} onChange={this.getInputText.bind(this,'hospitalization_history_reference')}></textarea>
                    </div>
                    <div className='one-block border-block'>
                      <div className='title-label'>院外処方があるか</div>
                      <Radiobox
                        id = {'outhospital_no'}
                        label={'いいえ'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'external_prescription')}
                        checked={this.state.external_prescription == 0 ? true : false}
                        name={`outhospital`}
                      />
                      <Radiobox
                        id = {'outhospital_yes'}
                        label={'はい'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'external_prescription')}
                        checked={this.state.external_prescription == 1 ? true : false}
                        name={`outhospital`}
                      />
                      <textarea className='note-content' value={this.state.external_prescription_reference} disabled={this.state.external_prescription != 1} onChange={this.getInputText.bind(this, 'external_prescription_reference')}></textarea>
                    </div>                
                    <div className='one-block border-block'>
                      <div className='title-label'>入院までの経緯</div>
                      <div>
                        <textarea className='note-content' value={this.state.background_of_hospitalization} disabled={this.state.hospitalization_history != 1} onChange={this.getInputText.bind(this, 'background_of_hospitalization')}></textarea>
                      </div>
                    </div>
                    <div className='one-block border-block'>
                      <div className='title-label'>現病歴</div>
                      <div className='content-label' style={{maxHeight:'2rem', height:'2rem'}}>{this.state.current_medical_history}</div>
                    </div>
                    <div className='one-block border-block'>
                      <div className='title-label'>備考</div>
                      <div>
                        <textarea className='note-content' disabled={this.state.hospitalization_history != 1} onChange={this.getInputText.bind(this, 'remarks')} value={this.state.remarks}></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className='flex' style={{marginTop:'1rem'}}>
                    <div className='one-block'>
                      <div className='border-block'>
                        <div className='title-label'>留意してほしいこと</div>
                        <div>
                          <textarea onChange={this.getInputText.bind(this, 'attention')} value={this.state.attention}></textarea>
                        </div>
                        
                      </div>
                    </div>
                    <div className='one-block'>
                      <div className='border-block'>
                        <div className='title-label'>治療経過中の配慮</div>
                        <div>
                          <textarea onChange={this.getInputText.bind(this, 'consideration_during_treatment')} value={this.state.consideration_during_treatment}></textarea>
                        </div>
                      </div>
                    </div>
                    <div className='one-block'>
                      <div className='border-block'>
                        <div className='title-label'>褥瘡</div>
                        <div className='flex'>
                          <div className=''>
                            <Radiobox
                              id = {'bedsoil_no'}
                              label={'無'}
                              value={0}
                              getUsage={this.getInputText.bind(this, 'pressure_sore')}
                              checked={this.state.pressure_sore == 0 ? true : false}
                              name={`bedsoil`}
                            />
                            <Radiobox
                              id = {'bedsoil_yes'}
                              label={'有'}
                              value={1}
                              getUsage={this.getInputText.bind(this, 'pressure_sore')}
                              checked={this.state.pressure_sore == 1 ? true : false}
                              name={`bedsoil`}
                            />
                          </div>
                          <div className=''>                      
                            <Checkbox
                              label={'仙骨部'}                      
                              getRadio={this.selectCheckBox.bind(this)}
                              value = {this.state.sacral_region_flag}
                              isDisabled = {this.state.pressure_sore != 1}
                              name="sacral_region_flag"
                            />
                            <Checkbox
                              label={'坐骨部'}                      
                              getRadio={this.selectCheckBox.bind(this)}
                              value = {this.state.ischium_flag}
                              isDisabled = {this.state.pressure_sore != 1}
                              name="ischium_flag"
                            />
                            <Checkbox
                              label={'尾骨部'}                      
                              getRadio={this.selectCheckBox.bind(this)}
                              value = {this.state.coccyx_flag}
                              isDisabled = {this.state.pressure_sore != 1}
                              name="coccyx_flag"
                            />
                            <br/>                      
                            <Checkbox
                              label={'腸骨部'}                      
                              getRadio={this.selectCheckBox.bind(this)}
                              value = {this.state.ilium_flag}
                              isDisabled = {this.state.pressure_sore != 1}
                              name="ilium_flag"
                            />
                            <Checkbox
                              label={'大転子部'}                      
                              getRadio={this.selectCheckBox.bind(this)}
                              value = {this.state.greater_trochanter_club_flag}
                              isDisabled = {this.state.pressure_sore != 1}
                              name="greater_trochanter_club_flag"
                            />
                            <Checkbox
                              label={'踵骨部'}                      
                              getRadio={this.selectCheckBox.bind(this)}
                              value = {this.state.calcaneus_flag}
                              isDisabled = {this.state.pressure_sore != 1}
                              name="calcaneus_flag"
                            />
                            <br/>                      
                            <Checkbox
                              label={'その他'}                      
                              getRadio={this.selectCheckBox.bind(this)}
                              value = {this.state.pressure_sore_other_flag}
                              isDisabled = {this.state.pressure_sore != 1}
                              name="pressure_sore_other_flag"
                            />
                            <textarea disabled={this.state.pressure_sore_other_flag != true} onChange={this.getInputText.bind(this, 'other')} value={this.state.other}></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='one-block'>
                      <div className='border-block'>
                        <div className='title-label'>評価スケール</div>
                        <div>
                          <input className='eval-input' onChange={this.getScale.bind(this)} value={this.state.braden_scale}></input><span className=''>点</span>
                        </div>
                      </div>
                    </div>
                    <div className='one-block'>
                      <div className='border-block select-block' style={{width:'6rem'}}>
                        <div className='title-label'>日常生活</div>
                        <SelectorWithLabel
                          options={this.criteria_options}
                          title={''}
                          getSelect={this.getCriteria.bind(this)}
                          departmentEditCode={this.state.criteria}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex' style={{marginTop:'0.8rem'}}>
                    <div className='one-block datetime-area border-block date-block'>
                      <div className='title-label'>ＰＥＧ（ＥＤチューブ）</div>
                      <div className='d-flex'>
                        <label className="label-title">建設日又は交換（挿入）施行日</label>
                        <DatePicker
                            locale="ja"
                            selected={this.state.replacement_enforcement_date}
                            onChange={this.getEnforcementdate.bind(this)}
                            dateFormat="yyyy/MM/dd"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dayClassName = {date => setDateColorClassName(date)}
                            // popperPlacement="bottom-start"
                            // orientation = "left bottom"
                            // popperModifiers={{
                            //   offset: {
                            //     enabled: false,
                            //     offset: "0px, 10px"
                            //   },
                            //   preventOverflow: {
                            //     enabled: false,
                            //     escapeWithReference: false,
                            //     boundariesElement: "scrollParent"
                            //   }
                            // }}
                        />
                      </div>
                      <div className='d-flex'>
                        <label className="label-title">次回交換（挿入）予定日</label>
                        <DatePicker
                            locale="ja"
                            selected={this.state.next_scheduled_replacement_date}
                            onChange={this.getNextScheduleddate.bind(this)}
                            dateFormat="yyyy/MM/dd"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"                            
                            // orientation = "right bottom"
                        />
                      </div>
                    </div>
                    <div className='one-block' style={{width:'9rem'}}>
                      <div className='border-block'>
                        <div className='title-label'>タオルリース</div>
                        <Radiobox
                          id = {'towel_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'towel_lease')}
                          checked={this.state.towel_lease == 0 ? true : false}
                          name={`towel`}
                        />
                        <Radiobox
                          id = {'towel_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'towel_lease')}
                          checked={this.state.towel_lease == 1 ? true : false}
                          name={`towel`}
                        />
                      </div>
                    </div>                
                    <div className='one-block'>
                      <div className = 'border-block'>
                        <div className='title-label'>衣類リース</div>
                          <Radiobox
                            id = {'clothe_no'}
                            label={'無'}
                            value={0}
                            getUsage={this.getInputText.bind(this, 'clothing_lease')}
                            checked={this.state.clothing_lease == 0 ? true : false}
                            name={`clothe`}
                          />
                          <Radiobox
                            id = {'clothe_yes'}
                            label={'有'}
                            value={1}
                            getUsage={this.getInputText.bind(this, 'clothing_lease')}
                            checked={this.state.clothing_lease == 1 ? true : false}
                            name={`clothe`}
                          />
                      </div>
                    </div>
                    <div className='one-block'>
                      <div className='border-block'>
                        <div className='title-label'>転院元</div>
                        <div>
                          <input className='hospital-origin-input' onChange={this.getInputText.bind(this, 'hospital_change_source')} value={this.state.hospital_change_source}></input>
                        </div>
                      </div>
                      
                    </div>
                    <div className='one-block'>
                      <div className='border-block select-block'>
                        <div className='title-label'>聴取看護師</div>
                        <SelectorWithLabel
                          options={this.props.nurse_staff_options}
                          title={''}
                          getSelect={this.getNurse.bind(this)}
                          departmentEditCode={this.state.hearing_nurse_id}
                        />
                      </div>
                    </div>                    
                  </div>
                </>
              )}
              {this.state.is_loaded != true && (
                <>
                <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
                </>
              )}
            </Wrapper>
          </DatePickerBox>
        );
    }
}

ProfileComp.contextType = Context;

ProfileComp.propTypes = {    
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,    
  cache_index:PropTypes.number,
  detailedPatientInfo : PropTypes.object,
  general_data:PropTypes.object,
  handleGeneralOk:PropTypes.func,
  diseaseName_options:PropTypes.array,
  nurse_staff_options:PropTypes.array,
  hosptial_purpose_master_options:PropTypes.array,
};

export default ProfileComp;
