import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import DatePicker,{ registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Checkbox from "~/components/molecules/Checkbox";
import Radiobox from "~/components/molecules/Radiobox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {toHalfWidthOnlyNumber} from "~/helpers/dialConstants";

const Wrapper = styled.div`
  font-size: 1rem;
  width: 100%;
  height: auto;
  padding-left:1rem;
  padding-right:1rem;
  padding-top:0.5rem;
  .flex{
    margin-bottom:0.2rem;
  }
  input[type="text"]{
    font-size:1rem!important;
  }
  label{
    font-size:1rem!important;
  }
 .react-datepicker-popper {
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
 } 
 .react-datepicker-wrapper{
   width:calc(100% - 3.5rem);
 }
 textarea{
  width: calc(100% - 6rem);
  height:4rem;
 }
 div{
   margin-top:0;
 }
  .sub-title{
    font-size:1.1rem;
    margin-bottom:0.3rem;
  }
  
  .blog-title{
    font-size:1rem;
    margin-bottom:0.2rem;
    font-weight:bold;
  }
  .one-row{
    // padding-left:1rem;
    // padding-right:1rem;
    margin-top:0.8rem;    
    display:flex;
    margin-bottom:0.3rem;
    width:100%;
    justify-content: flex-start;
  }
  .checkbox-blog{
    min-width:35%;
    label{
      font-size:1rem;
    }
  }
  .one-blog{
    width:45%;
    margin-right:5%;
    .flex{
      width:100%;
      position:relative;
    }
    .float-right{
      position:absolute;
      right:0px;      
    }
    .radio-title-label{
      margin-right:1rem;
    }    
  }
  .other-area{
    width:100%;    
  }
  .label-title{
    display:none;
  }
  input[type=text]{
    font-size:1rem;
    max-width:8rem;
    height:2rem;
    padding-top:0.1rem;
  }
  .label-unit{
    width:auto;
    margin-top:0.3rem;
    font-size:1rem;
  }
  .weight{    
    .num-label{
      margin-top:3px;
    }
  }
  .pullbox{
    width:22rem;
    margin-left:auto;
    margin-right:auto;
  }
  .pullbox-label, .pullbox-select{
    width:22rem;
    max-height:2rem;
    font-size:0.9rem;
  }
  .title-div{
    margin-right:1rem;
  }
  .border-block{
    border: 1px solid #aaa;
    position: relative;
    padding-left:0.5rem;
    padding-right:0.5rem;
    padding-top:0.7rem;
    padding-bottom:0.4rem;
    margin-right:3rem;
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
`;

class Excretion extends Component {
    constructor(props) {
        super(props);        
        this.stool_properties_options = [
          {id:0, value:""},
          {id:1, value:"コロコロ"},
          {id:2, value:"硬"},
          {id:3, value:"やや硬"},
          {id:4, value:"普通"},
          {id:5, value:"やや軟"},
          {id:6, value:"泥状"},
          {id:7, value:"水様"},
        ];
        
        this.state ={};
        var excertion_data = this.props.general_data.excertion_data;        
        Object.keys(excertion_data).map(key => {        
          this.state[key] = excertion_data[key]
        });
        this.state['general_data'] = this.props.general_data;
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
      var state_variabel = {};
      Object.keys(nextProps.general_data.excertion_data).map(key => {
        state_variabel[key] = nextProps.general_data.excertion_data[key];
      })
      state_variabel['general_data'] = nextProps.general_data;      
      this.setState(state_variabel);
    }

    getLastUrinationTime = (value) => {      
      this.setState({ last_urination_time: value });
      var general_data = this.state.general_data;
      general_data.excertion_data.last_urination_time = value;
      this.props.handleGeneralOk(general_data);
    };

    getLastUrination = (value) => {      
      this.setState({ last_urination: value });
      var general_data = this.state.general_data;
      general_data.excertion_data.last_urination = value;
      this.props.handleGeneralOk(general_data);
    };

    getLastDefecation = (value) => {      
      this.setState({ last_defecation: value });
      var general_data = this.state.general_data;
      general_data.excertion_data.last_defecation = value;
      this.props.handleGeneralOk(general_data);
    };
    //-------------------------------------------------------------------------
    getInputNumber =(name, e) => {      
      if (typeof e == 'number') e = e.toString();
      let input_value = e != null ? e.replace(/[^0-9０-９][/./][0-9０-９]/g, ""):'';       
      if (input_value != "") {
        input_value = (toHalfWidthOnlyNumber(input_value));
      } else {
        input_value = null;
      }
      this.setState({[name]:input_value})

      var general_data = this.state.general_data;
      general_data.excertion_data[name] = input_value;
      this.props.handleGeneralOk(general_data);
    }
    selectCheckBox = (name, value) => {
      this.setState({[name]:value})
      var general_data = this.state.general_data;
      general_data.excertion_data[name] = value;
      this.props.handleGeneralOk(general_data);
    }

    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;
      general_data.excertion_data[name] = e.target.value;
      if (name == 'summary'){
        this.props.handleGeneralOk(general_data, true, 'excertion_data');
      } else {
        this.props.handleGeneralOk(general_data);
      }
    }

    getSelect = (name, e) => {      
      this.setState({[name]:e.target.id});
      var general_data = this.state.general_data;
      general_data.excertion_data[name] = e.target.id;
      this.props.handleGeneralOk(general_data);
    }

    render() {
        return (
          <Wrapper>
              <div className='blog-title'>排便</div>
              <div className='one-row'>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>排便回数</div>
                    <div className='flex'>
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'回/'}
                        maxLength={ 4 }
                        max={9999}
                        min = {0}
                        className="form-control"
                        value={this.state.number_of_bowel_movements}
                        getInputText={this.getInputNumber.bind(this, 'number_of_bowel_movements')}
                        inputmode="numeric"
                      />
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'日'}
                        maxLength={ 4 }
                        max={9999}
                        min = {0}
                        className="form-control"
                        value={this.state.defecation_every_other_day}
                        getInputText={this.getInputNumber.bind(this, 'defecation_every_other_day')}
                        inputmode="numeric"
                      />
                    </div>
                  </div>
                </div>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>便の性状（ＢＳスコア）</div>
                    <SelectorWithLabel
                      options={this.stool_properties_options}
                      title={''}
                      getSelect={this.getSelect.bind(this, 'stool_properties')}
                      departmentEditCode={this.state.stool_properties}
                    />
                  </div>
                </div>
                <div>
                  <div className='border-block text-center'>
                    <div className='title-label'>最終排便日</div>
                    <InputWithLabelBorder
                      label=""
                      type="date"                      
                      getInputText={this.getLastDefecation.bind(this)}
                      diseaseEditData={this.state.last_defecation}
                    />
                  </div>
                </div>
              </div>
              <div className='flex' style={{width:'100%', marginTop:'1rem'}}>
                <div className='checkbox-blog border-block' style={{width:'50%'}}>
                  <div className=''>
                    <div className='title-label'>排便随伴症状</div>
                    <div className='flex' style={{width:'100%'}}>
                      <div className='' style={{width:'20%'}}>
                        <Radiobox
                          id = {'defecation_sysmptoms_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_defecation_concomitant_symptoms')}
                          checked={this.state.with_or_without_defecation_concomitant_symptoms == 0 ? true : false}
                          name={`defecation_sysmptoms`}
                        />
                        <Radiobox
                          id = {'defecation_sysmptoms_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_defecation_concomitant_symptoms')}
                          checked={this.state.with_or_without_defecation_concomitant_symptoms == 1 ? true : false}
                          name={`defecation_sysmptoms`}
                        />
                      </div>
                      <div className='' style={{width:'80%'}}>
                        <div className='flex'>
                        <Checkbox
                          label={'不快感'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.discomfort_flag}
                          name="discomfort_flag"
                          isDisabled = {this.state.with_or_without_defecation_concomitant_symptoms != 1}
                        />
                        <Checkbox
                          label={'残便感'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.feeling_of_residual_stool_flag}
                          name="feeling_of_residual_stool_flag"
                          isDisabled = {this.state.with_or_without_defecation_concomitant_symptoms != 1}
                        />
                        <Checkbox
                          label={'腹痛'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.abdominal_pain_flag}
                          name="abdominal_pain_flag"
                          isDisabled = {this.state.with_or_without_defecation_concomitant_symptoms != 1}
                        />
                        <Checkbox
                          label={'硬便触知'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.tactile_sensation_flag}
                          name="tactile_sensation_flag"
                          isDisabled = {this.state.with_or_without_defecation_concomitant_symptoms != 1}
                        />
                        </div>
                        <div className='flex'>
                          <Checkbox
                            label={'その他'}
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.other_defecation_concomitant_symptoms_flag}
                            name="other_defecation_concomitant_symptoms_flag"
                            isDisabled = {this.state.with_or_without_defecation_concomitant_symptoms != 1}
                          />
                          <textarea disabled={this.state.other_defecation_concomitant_symptoms_flag != 1 || this.state.with_or_without_defecation_concomitant_symptoms != 1}
                            onChange={this.getInputText.bind(this, 'other_defecation_concomitant_symptoms')} style={{width:'calc(100% - 5.5rem'}}
                            value={this.state.other_defecation_concomitant_symptoms}></textarea>
                        </div>
                    </div>
                    </div>
                  </div>                  
                </div>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>腸蠕動</div>
                    <div>
                      <Radiobox
                        id = {'peristalsis_no'}
                        label={'大過'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'gut_peristalsis')}
                        checked={this.state.gut_peristalsis == 0 ? true : false}
                        name={`peristalsis`}
                      />
                      <Radiobox
                        id = {'peristalsis_yes'}
                        label={'減弱'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'gut_peristalsis')}
                        checked={this.state.gut_peristalsis == 1 ? true : false}
                        name={`peristalsis`}
                      />
                    </div>
                  </div>
                </div>
              </div>                
              <div className='one-row'>
                <div className='' style={{width:'30%'}}>
                  <div className='border-block'>
                    <div className='title-label'>便通のための対処方法</div>
                    <textarea value={this.state.coping} onChange={this.getInputText.bind(this, 'coping')} style={{width:'100%'}}></textarea>
                  </div>
                </div>
                <div className='checkbox-blog' style={{width:'30%'}}>
                  <div className='border-block'>
                    <div className='title-label'>便入薬</div>
                    <div className='flex'>
                      <Checkbox
                        label={'緩下剤'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.laxative_flag}
                        name="laxative_flag"
                      />
                      <Checkbox
                        label={'浣腸'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.enema_flag}
                        name="enema_flag"
                      />
                      <Checkbox
                        label={'座薬'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.suppository_flag}
                        name="suppository_flag"
                      />
                      <Checkbox
                        label={'止痢剤'}
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.antidiarrheal_agent_flag}
                        name="antidiarrheal_agent_flag"
                      />                    
                    </div>
                    <div className='flex'>
                      <label style={{marginRight:'10px'}}>備考</label>
                      <textarea style={{width:'calc(100% - 3rem)'}} onChange={this.getInputText.bind(this, 'drug_delivery_remarks')} value={this.state.drug_delivery_remarks}></textarea>
                    </div>
                  </div>
                </div>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>オムツ</div>
                    <Radiobox
                      id = {'diapers_no'}
                      label={'無'}
                      value={0}
                      getUsage={this.getInputText.bind(this, 'diapers')}
                      checked={this.state.diapers == 0 ? true : false}
                      name={`diapers`}
                    />
                    <Radiobox
                      id = {'diapers_yes'}
                      label={'有'}
                      value={1}
                      getUsage={this.getInputText.bind(this, 'diapers')}
                      checked={this.state.diapers == 1 ? true : false}
                      name={`diapers`}
                    />
                  </div>
                </div>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>ストーマ</div>
                    <Radiobox
                      id = {'stoma_no'}
                      label={'無'}
                      value={0}
                      getUsage={this.getInputText.bind(this, 'stoma')}
                      checked={this.state.stoma == 0 ? true : false}
                      name={`stoma`}
                    />
                    <Radiobox
                      id = {'stoma_yes'}
                      label={'有'}
                      value={1}
                      getUsage={this.getInputText.bind(this, 'stoma')}
                      checked={this.state.stoma == 1 ? true : false}
                      name={`stoma`}
                    />
                  </div>
                </div>
              </div>
              
              <div className='blog-title'>排尿</div>

              <div className='one-row'>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>排尿回数</div>
                    <div className='flex'>
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'回/日'}
                        maxLength={ 4 }
                        max={9999}
                        min = {0}
                        className="form-control"
                        value={this.state.urination_frequency_day}
                        getInputText={this.getInputNumber.bind(this, 'urination_frequency_day')}
                        inputmode="numeric"
                      />
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'回/夜間'}
                        maxLength={ 4 }
                        max={9999}
                        min = {0}
                        className="form-control"
                        value={this.state.urination_frequency_night}
                        getInputText={this.getInputNumber.bind(this, 'urination_frequency_night')}
                        inputmode="numeric"
                      />
                    </div>
                  </div>                  
                </div>
                <div className=''>
                  <div className='border-block text-center'>
                    <div className='title-label'>最終排尿日</div>
                    <InputWithLabelBorder
                      label="評価日"
                      type="date"                      
                      getInputText={this.getLastUrination.bind(this)}
                      diseaseEditData={this.state.last_urination}
                    />
                  </div>    
                </div>
                <div className=''>
                  <div className='border-block text-center flex'>
                    <div className='title-label'>時刻</div>
                    <DatePicker
                      locale="ja"
                      selected={this.state.last_urination_time}
                      onChange={this.getLastUrinationTime.bind(this)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={10}
                      dateFormat="HH:mm"
                      timeFormat="HH:mm"
                      id='entry_time_id'
                      timeCaption='時刻'
                    />
                    <label style={{marginLeft:'1rem', paddingTop:'0rem'}}>時頃</label>
                  </div>
                </div>
              </div>
              
              <div className='one-row' style={{width: '60%'}}>
                <div className='' style={{width:'80%'}}>
                  <div className='border-block'>
                    <div className='title-label'>排尿状況の変化</div>
                    <textarea style={{width:'100%'}} onChange={this.getInputText.bind(this,'changes_in_urination_status')} value={this.state.changes_in_urination_status}></textarea>
                  </div>
                </div>
                <div className=''>
                  <div className='border-block text-center'>
                    <div className='title-label'>尿失禁</div>
                    <Radiobox
                      id = {'urine_no'}
                      label={'無'}
                      value={0}
                      getUsage={this.getInputText.bind(this, 'urinary_incontinence')}
                      checked={this.state.urinary_incontinence == 0 ? true : false}
                      name={`urine`}
                    />
                    <Radiobox
                      id = {'urine_yes'}
                      label={'有'}
                      value={1}
                      getUsage={this.getInputText.bind(this, 'urinary_incontinence')}
                      checked={this.state.urinary_incontinence == 1 ? true : false}
                      name={`urine`}
                    />
                  </div>
                </div>
              </div>

              <div className='one-row'>
                <div className='' style={{width:'48%'}}>
                  <div className='border-block'>
                    <div className='title-label'>排尿随伴症状</div>
                    <div className='flex' style={{width:'100%'}}>
                      <div className='' style={{width:'16%'}}>
                        <Radiobox
                          id = {'urination_symptoms_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_urinary_concomitant_symptoms')}
                          checked={this.state.with_or_without_urinary_concomitant_symptoms == 0 ? true : false}
                          name={`urination_symptoms`}
                        />
                        <Radiobox
                          id = {'urination_symptoms_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_urinary_concomitant_symptoms')}
                          checked={this.state.with_or_without_urinary_concomitant_symptoms == 1 ? true : false}
                          name={`urination_symptoms`}
                        />
                      </div>
                      <div className='checkbox-blog' style={{width:'84%'}}>
                        <div>
                          <Checkbox
                            label={'尿意圧迫'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.urinary_pressure_flag}
                            name="urinary_pressure_flag"
                            isDisabled={this.state.with_or_without_urinary_concomitant_symptoms != 1}
                          />
                          <Checkbox
                            label={'尿漏れ'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.urine_leak_flag}
                            name="urine_leak_flag"
                            isDisabled={this.state.with_or_without_urinary_concomitant_symptoms != 1}
                          />
                          <Checkbox
                            label={'継続の満感'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.full_feeling_of_continuation_flag}
                            name="full_feeling_of_continuation_flag"
                            isDisabled={this.state.with_or_without_urinary_concomitant_symptoms != 1}
                          />
                          <Checkbox
                            label={'残尿感'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.residual_urine_flag}
                            name="residual_urine_flag"
                            isDisabled={this.state.with_or_without_urinary_concomitant_symptoms != 1}
                          />
                        </div>
                        <div className='flex'>
                        <Checkbox
                          label={'その他'}
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.other_urinary_concomitant_symptoms_flag}
                          name="other_urinary_concomitant_symptoms_flag"
                          isDisabled={this.state.with_or_without_urinary_concomitant_symptoms != 1}
                        />
                        <textarea value={this.state.other_urinary_concomitant_symptoms}
                          disabled={this.state.with_or_without_urinary_concomitant_symptoms != 1 || this.state.other_urinary_concomitant_symptoms_flag != 1} onChange={this.getInputText.bind(this,'other_urinary_concomitant_symptoms')}>                        
                        </textarea>
                      </div>
                    </div>
                  </div>
                  </div>                  
                </div>

                <div className='checkbox-blog' style={{width:'50%'}}>
                  <div className='border-block'>
                    <div className='title-label'>排尿方法</div>
                    <div className=''>
                      <Checkbox
                        label={'間欠的導尿'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.intermittent_catheterization_flag}
                        name="intermittent_catheterization_flag"
                      />
                      <Checkbox
                        label={'留置カテーテル'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.indwelling_catheter_flag}
                        name="indwelling_catheter_flag"
                      />
                      <Checkbox
                        label={'尿路変更'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.urinary_tract_change_flag}
                        name="urinary_tract_change_flag"
                      />                                     
                    </div>
                    <div className='flex'>
                      <label style={{marginRight:'0.5rem'}}>備考</label>
                      <textarea value={this.state.urination_method_remarks} style={{width:'calc(100% - 2.5rem)'}} onChange={this.getInputText.bind(this, 'urination_method_remarks')}></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className='other-area flex'>
                <div className='one-blog'>                  
                  <div className='title-label'>その他</div>                  
                  <textarea style={{width:'100%'}} onChange={this.getInputText.bind(this, 'other')} value={this.state.other}></textarea>
                </div>
                <div className='one-blog'>                  
                  <div className='title-label'>要約</div>                  
                  <textarea onChange={this.getInputText.bind(this, 'summary')} value={this.state.summary}></textarea>
                </div>
              </div>
          </Wrapper>
        );
    }
}

Excretion.contextType = Context;

Excretion.propTypes = {    
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,    
  cache_index:PropTypes.number,
  detailedPatientInfo : PropTypes.object,
  general_data:PropTypes.object,
  handleGeneralOk:PropTypes.func,
};

export default Excretion;
