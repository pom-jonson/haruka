import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
// import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import Checkbox from "~/components/molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";

const Wrapper = styled.div`  
  width: 100%;
  height: auto;
  padding-left:1rem;
  padding-right:1rem;
  padding-top:0.5rem;
  .react-datepicker-popper {
    .react-datepicker {
      .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
        height:10px !important;
      }
    }
  }
  font-size:1rem;
  input[type="text"]{
    font-size:1rem!important;
  }
  label{
    font-size:1rem!important;
  }
  .sub-title{
    font-size:1.0rem;
    margin-bottom:0.2rem;
    font-weight:bold;
  }
  .blog-title{
    font-size:1rem;    
  }
  .small-input{
    margin-right:10px;
    div{
      margin-top:2px;
    }
  }
  .radio-area{
    label{
      margin-top:0.2rem;   
    }
  }
  .title-label{
    font-size:1rem;
    margin-bottom:0.3rem;
  }
  .one-row{
    display:flex;
    margin-bottom:0;
    width:100%;
    justify-content: space-between;
    margin-top:0.75rem;
  }
  .label-title{
    display:none;
  }
  input[type=text]{
    font-size:1rem;
    max-width:5rem;
    height:1.5rem;
  }
  .label-unit{
    width:3.5rem;
    margin-left:3px;
    margin-top:0.3rem;
    margin-left:0;
    font-size:1rem;
  }
  .numeric-label{
    width:5rem;
    margin-right:0.5rem;
    text-align:right;
    font-size:1rem;
  }
  .one-blog{    
    width:47%;
    margin-right:3%;
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
    textarea{
      width:100%;
      height:3rem;
    }
  }
  textarea{    
    height:3rem;
  }
  .spec-label{
    font-size:1rem;
    margin-bottom:0;
    padding-top:0.35rem;
    margin-right:0.3rem;
  }
  .select-box-area{
    margin-right:1rem;    
    .pullbox-title{
      width:auto;
      text-align:left;
      margin-right:0.5rem;
      display:block;      
      font-size: 1rem;
      line-height: 1.7rem;
    }
    .pullbox-label {
      margin-bottom:0;
      width:auto;
      padding-right:1rem;
      margin-right:1rem;
      max-height:2rem;
      font-size:1rem;
    }
    .pullbox-select {
      width:calc(100% + 1rem);
      font-size:1rem;
      max-height:2rem;     
    }
  }
  .same-label{
    width:100%;
    label{
      margin-right:0.5rem;
      width:5rem;
    }
    input[type="text"]{
      width:calc(100% - 5.5rem);
    }
    textarea{
      width:calc(100% - 5.5rem);
      height:2rem;
    }
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
`;

class Exercise extends Component {
    constructor(props) {
        super(props); 
        this.state ={};
        var exercise_data = this.props.general_data.exercise_data;
        Object.keys(exercise_data).map(key => {
          this.state[key] = exercise_data[key]
        });
        this.state['general_data'] = this.props.general_data;
        this.adl_options = [
          {id:0, value:''},
          {id:1, value:'自立'},
          {id:2, value:'要監視'},
          {id:3, value:'部分介助'},
          {id:4, value:'全介助'},
        ];
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      var state_variabel = {};
      Object.keys(nextProps.general_data.exercise_data).map(key => {
        state_variabel[key] = nextProps.general_data.exercise_data[key];
      })
      state_variabel['general_data'] = nextProps.general_data;      
      this.setState(state_variabel);
    }
    
    selectCheckBox = (name, value) => {
      this.setState({[name]:value})
      var general_data = this.state.general_data;
      general_data.exercise_data[name] = value;
      this.props.handleGeneralOk(general_data);
    }

    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;      
      general_data.exercise_data[name] = e.target.value;
      if (name == 'summary'){
        this.props.handleGeneralOk(general_data, true, 'exercise_data');
      } else {
        this.props.handleGeneralOk(general_data);
      }
    }

    getSelect = (name, e) => {      
      this.setState({[name]:e.target.id});
      var general_data = this.state.general_data;
      general_data.exercise_data[name] = e.target.id;
      this.props.handleGeneralOk(general_data);
    }

    render() {
        return (
            <Wrapper>
              <div className='sub-title'>呼吸</div>  
              <div className='one-row' style={{width:'80%', justifyContent:'flex-start'}}>
                <div className='small-input' style={{width:'auto'}}>
                  <div className='border-block text-center'>
                    <div className='title-label'>リズム</div>
                    <Radiobox
                      id = {'rithm_ok'}
                      label={'規則的'}
                      value={0}
                      getUsage={this.getInputText.bind(this, 'breathing_rhythm')}
                      checked={this.state.breathing_rhythm == 0 ? true : false}
                      name={`rithm`}
                    />
                    <Radiobox
                      id = {'rithm_no'}
                      label={'不規則'}
                      value={1}
                      getUsage={this.getInputText.bind(this, 'breathing_rhythm')}
                      checked={this.state.breathing_rhythm == 1 ? true : false}
                      name={`rithm`}
                    />
                  </div>
                </div>
                <div className='small-input' style={{width:'60%'}}>
                  <div className='border-block'>
                    <div className='title-label'>呼吸器症状</div>
                    <div className='flex' style={{width:'100%'}}>
                      <div className='radio-area' style={{width:'20%'}}>
                        <Radiobox
                          id = {'breathe_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_respiratory_symptoms')}
                          checked={this.state.with_or_without_respiratory_symptoms == 0 ? true : false}
                          name={`breathe`}
                        />
                        <Radiobox
                          id = {'breathe_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_respiratory_symptoms')}
                          checked={this.state.with_or_without_respiratory_symptoms == 1 ? true : false}
                          name={`breathe`}
                        />
                      </div>
                      <div className='checkbox-area' style={{width:'80%'}}>
                        <div>
                          <Checkbox
                            label={'呼吸困難'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.difficult_flag}
                            name="difficult_flag"
                            isDisabled={this.state.with_or_without_respiratory_symptoms != 1}
                          />
                          <Checkbox
                            label={'咳'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.cough_flag}
                            name="cough_flag"
                            isDisabled={this.state.with_or_without_respiratory_symptoms != 1}
                          />
                          <Checkbox
                            label={'淡'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.sputum_flag}
                            name="sputum_flag"
                            isDisabled={this.state.with_or_without_respiratory_symptoms != 1}
                          />
                        </div>
                        <div className='flex'>
                          <div style={{width:'6rem'}}>
                            <Checkbox
                              label={'その他'}                      
                              getRadio={this.selectCheckBox.bind(this)}
                              value = {this.state.other_respiratory_symptoms_flag}
                              name="other_respiratory_symptoms_flag"
                              isDisabled={this.state.with_or_without_respiratory_symptoms != 1}
                            />
                          </div>
                          <textarea disabled={this.state.other_respiratory_symptoms_flag != 1 || this.state.with_or_without_respiratory_symptoms != 1}
                            style={{width:'calc(100% - 6rem)'}} onChange={this.getInputText.bind(this, 'other_respiratory_symptoms')}
                            value={this.state.other_respiratory_symptoms}></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='small-input' style={{width:'auto'}}>
                  <div className='border-block text-center' style={{width:'8rem'}}>
                    <div className='title-label'>呼吸音の異常</div>
                      <Radiobox
                        id = {'rest_satisfy_ok'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'abnormal_breath_sounds')}
                        checked={this.state.abnormal_breath_sounds == 0 ? true : false}
                        name={`rest_satisfy`}
                      />
                      <Radiobox
                        id = {'rest_satisfy_no'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'abnormal_breath_sounds')}
                        checked={this.state.abnormal_breath_sounds == 1 ? true : false}
                        name={`rest_satisfy`}
                      />
                    </div>
                  </div>
                </div>
              <div className='sub-title'>循環</div>
              <div className='one-row' style={{width:'80%', justifyContent:'flex-start'}}>
                <div className='small-input' style={{width:'auto'}}>
                  <div className='border-block text-center'>
                    <div className='title-label'>リズム</div>
                    <Radiobox
                      id = {'cirular_rithm_good'}
                      label={'整'}
                      value={0}
                      getUsage={this.getInputText.bind(this, 'circular_rhythm')}
                      checked={this.state.circular_rhythm == 0 ? true : false}
                      name={`cirular_rithme`}
                    />
                    <Radiobox
                      id = {'cirular_rithm_bad'}
                      label={'不整'}
                      value={1}
                      getUsage={this.getInputText.bind(this, 'circular_rhythm')}
                      checked={this.state.circular_rhythm == 1 ? true : false}
                      name={`cirular_rithme`}
                    />
                  </div>
                </div>
                <div className='small-input' style={{width:'80%'}}>
                  <div className='border-block'>
                    <div className='title-label'>循環器症状</div>
                    <div className='flex' style={{width:'100%'}}>
                      <div className='radio-area' style={{width:'15%'}}>
                        <Radiobox
                          id = {'cardio_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_cardiovascular_symptoms')}
                          checked={this.state.with_or_without_cardiovascular_symptoms == 0 ? true : false}
                          name={`cardio`}
                        />
                        <Radiobox
                          id = {'cardio_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_cardiovascular_symptoms')}
                          checked={this.state.with_or_without_cardiovascular_symptoms == 1 ? true : false}
                          name={`cardio`}
                        />
                      </div>
                      <div className='checkbox-area' style={{width:'85%'}}>
                        <div>
                          <Checkbox
                            label={'動機'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.palpitations}
                            name="palpitations"
                            isDisabled={this.state.with_or_without_cardiovascular_symptoms != 1}
                          />
                          <Checkbox
                            label={'息切れ'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.shortness_of_breath}
                            name="shortness_of_breath"
                            isDisabled={this.state.with_or_without_cardiovascular_symptoms != 1}
                          />
                          <Checkbox
                            label={'胸痛'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.chest_pain}
                            name="chest_pain"
                            isDisabled={this.state.with_or_without_cardiovascular_symptoms != 1}
                          />
                        </div>
                        <div className='flex'>
                          <div style={{width:'6rem'}}>
                            <Checkbox
                              label={'その他'}                      
                              getRadio={this.selectCheckBox.bind(this)}
                              value = {this.state.other_cardiovascular_symptoms_flag}
                              name="other_cardiovascular_symptoms_flag"
                              isDisabled={this.state.with_or_without_cardiovascular_symptoms != 1}
                            />
                          </div>
                          <textarea disabled={this.state.with_or_without_cardiovascular_symptoms != 1 || this.state.other_cardiovascular_symptoms_flag != 1}
                            style={{width:'calc(100% - 6rem)'}} onChange={this.getInputText.bind(this, 'other_cardiovascular_symptoms')}
                            value={this.state.other_cardiovascular_symptoms}></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='sub-title'>身体状態</div>
              <div className='one-row' style={{width:'100%'}}>
                <div className='small-input' style={{width:'auto'}}>
                  <div className='border-block text-center' style={{width:'8rem'}}>
                    <div className='title-label'>利き手</div>
                    <Radiobox
                      id = {'dominant_hand_right'}
                      label={'右'}
                      value={0}
                      getUsage={this.getInputText.bind(this, 'dominant_hand')}
                      checked={this.state.dominant_hand == 0 ? true : false}
                      name={`dominant`}
                    />
                    <Radiobox
                      id = {'dominant_hand_left'}
                      label={'左'}
                      value={1}
                      getUsage={this.getInputText.bind(this, 'dominant_hand')}
                      checked={this.state.dominant_hand == 1 ? true : false}
                      name={`dominant`}
                    />
                  </div>
                </div>
                <div className='small-input' style={{width:'40%'}}>
                  <div className='border-block'>
                    <div className='title-label' style={{width:'7rem'}}>関節運動域制限</div>
                    <div className='flex' style={{width:'100%'}}>
                      <div style={{width:'20%'}}>
                        <Radiobox
                          id = {'range_motion_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_range_of_motion')}
                          checked={this.state.with_or_without_range_of_motion == 0 ? true : false}
                          name={`range_motion`}
                        />
                        <Radiobox
                          id = {'range_motion_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_range_of_motion')}
                          checked={this.state.with_or_without_range_of_motion == 1 ? true : false}
                          name={`range_motion`}
                        />  
                      </div>
                      <div style={{width:'80%'}}>
                        <textarea value={this.state.range_of_motion} disabled={this.state.with_or_without_range_of_motion != 1} style={{width:'100%'}} onChange={this.getInputText.bind(this, 'range_of_motion')}></textarea>
                      </div>
                    </div>
                  </div>                  
                </div>
                <div className='small-input' style={{width:'auto'}}>
                  <div className='border-block text-center' style={{width:'8rem'}}>
                    <div className='title-label'>身体障害</div>
                    <Radiobox
                      id = {'disability_no'}
                      label={'無'}
                      value={0}
                      getUsage={this.getInputText.bind(this, 'with_or_without_disability')}
                      checked={this.state.with_or_without_disability == 0 ? true : false}
                      name={`disability`}
                    />
                    <Radiobox
                      id = {'disability_yes'}
                      label={'有'}
                      value={1}
                      getUsage={this.getInputText.bind(this, 'with_or_without_disability')}
                      checked={this.state.with_or_without_disability == 1 ? true : false}
                      name={`disability`}
                    />
                  </div>
                </div>
                <div className='small-input' style={{width:'40%'}}>
                  <div className='border-block'>
                    <div className='title-label'>部位・状態</div>
                    <div className='flex same-label'>
                      <Checkbox
                        label={'麻痺'}
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.paralyzed_area_flag}
                        name="paralyzed_area_flag"
                        isDisabled={this.state.with_or_without_disability != 1}
                      />
                      <input disabled={this.state.with_or_without_disability != 1 || this.state.paralyzed_area_flag != 1}
                        onChange={this.getInputText.bind(this, 'paralysis_site')} value={this.state.paralysis_site}></input>
                    </div>
                    <div className='flex same-label'>
                      <Checkbox
                        label={'欠損'}
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.defective_site_flag}
                        name="defective_site_flag"
                        isDisabled={this.state.with_or_without_disability != 1}
                      />
                      <input disabled={this.state.with_or_without_disability != 1 || this.state.defective_site_flag != 1}
                        onChange={this.getInputText.bind(this, 'defect_site')} value={this.state.defect_site}></input>
                    </div>
                    <div className='flex same-label'>
                      <Checkbox
                        label={'拘縮'}
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.contracture_site_flag}
                        name="contracture_site_flag"
                        isDisabled={this.state.with_or_without_disability != 1}
                      />
                      <input disabled={this.state.with_or_without_disability != 1 || this.state.contracture_site_flag != 1}
                        onChange={this.getInputText.bind(this, 'contracture_site')} value={this.state.contracture_site}></input>
                    </div>
                    <div className='flex same-label'>
                      <Checkbox
                        label={'その他'}
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.other_parts_flag}
                        name="other_parts_flag"
                        isDisabled={this.state.with_or_without_disability != 1}
                      />
                      <textarea disabled={this.state.with_or_without_disability != 1 || this.state.other_parts_flag != 1}
                        onChange={this.getInputText.bind(this, 'other_site')} value={this.state.other_site}></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className='border-block' style={{marginTop:'0.3rem', width:'80rem'}}>
                <div className='title-label'>ADL (0 自立、1 要監視、2 部分介助、3 全介助)</div>
                <div className='flex'>
                  <div className='small-input select-box-area'>
                    <SelectorWithLabel
                      options={this.adl_options}
                      title={'食事'}
                      getSelect={this.getSelect.bind(this, 'meal')}
                      departmentEditCode={this.state.meal}
                    />
                  </div>
                  <div className='small-input select-box-area'>
                    <SelectorWithLabel
                      options={this.adl_options}
                      title={'清潔'}
                      getSelect={this.getSelect.bind(this, 'clean')}
                      departmentEditCode={this.state.clean}
                    />
                  </div>
                  <div className='small-input select-box-area'>
                    <SelectorWithLabel
                      options={this.adl_options}
                      title={'更衣'}
                      getSelect={this.getSelect.bind(this, 'changing_clothes')}
                      departmentEditCode={this.state.changing_clothes}
                    />
                  </div>
                  <div className='small-input select-box-area'>
                    <SelectorWithLabel
                      options={this.adl_options}
                      title={'排泄'}
                      getSelect={this.getSelect.bind(this, 'excretion')}
                      departmentEditCode={this.state.excretion}
                    />
                  </div>
                  <div className='small-input select-box-area'>
                    <SelectorWithLabel
                      options={this.adl_options}
                      title={'移動'}
                      getSelect={this.getSelect.bind(this, 'move')}
                      departmentEditCode={this.state.move}
                    />
                  </div>
                  <div className='small-input select-box-area'>
                    <SelectorWithLabel
                      options={this.adl_options}
                      title={'寝返り'}
                      getSelect={this.getSelect.bind(this, 'rolling_over')}
                      departmentEditCode={this.state.rolling_over}
                    />
                  </div>
                  <div className='small-input select-box-area'>
                    <SelectorWithLabel
                      options={this.adl_options}
                      title={'家事'}
                      getSelect={this.getSelect.bind(this, 'housework')}
                      departmentEditCode={this.state.housework}
                    />
                  </div>
                </div>              
              </div>
              <div className='one-row'>
                <div className='one-blog flex border-block' style={{width:'47%'}}>                  
                  <div className='title-label'>自助具</div>
                  <textarea style={{width:'calc(100% - 0rem)'}} onChange={this.getInputText.bind(this,'self_help_devices')} value={this.state.self_help_devices}></textarea>
                </div>
                <div className='one-blog flex border-block' style={{width:'47%'}}>
                  <div className='title-label'>備考</div>
                  <textarea onChange={this.getInputText.bind(this,'adl_remarks')} style={{width:'calc(100% - 0rem)'}} value={this.state.adl_remarks}></textarea>
                </div>
              </div>
              <div className='one-row'>
                <div className='one-blog border-block' style={{width:'47%'}}>                  
                    <div className='title-label'>運動習慣</div>
                    <div className='flex'>
                      <div className='radio-area' style={{width:'8rem'}}>
                        <Radiobox
                          id = {'habit_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_exercise_habits')}
                          checked={this.state.with_or_without_exercise_habits == 0 ? true : false}
                          name={`habit`}
                        />
                        <Radiobox
                          id = {'habit_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_exercise_habits')}
                          checked={this.state.with_or_without_exercise_habits == 1 ? true : false}
                          name={`habit`}
                        />
                      </div>
                      <textarea disabled={this.state.with_or_without_exercise_habits != 1}
                        style={{width:'calc(100% - 8rem'}} onChange={this.getInputText.bind(this, 'exercise_habits')} value={this.state.exercise_habits}></textarea>
                    </div>
                </div>
                <div className='one-blog border-block' style={{width:'47%'}}>                  
                  <div className='title-label'>活動の制限</div>  
                  <div className='flex'>
                    <div className='radio-area' style={{width:'8rem'}}>
                      <Radiobox
                        id = {'restrict_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'with_or_without_activity_restrictions')}
                        checked={this.state.with_or_without_activity_restrictions == 0 ? true : false}
                        name={`restrict`}
                      />
                      <Radiobox
                        id = {'restrict_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'with_or_without_activity_restrictions')}
                        checked={this.state.with_or_without_activity_restrictions == 1 ? true : false}
                        name={`restrict`}
                      />
                    </div>
                    <textarea disabled={this.state.with_or_without_activity_restrictions != 1}
                      onChange={this.getInputText.bind(this, 'activity_restrictions')} style={{width:'calc(100% - 8rem'}} value={this.state.activity_restrictions}></textarea>
                  </div>
                </div>
              </div>
              
              <div className='other-area one-row flex'>
                <div className='one-blog'>                  
                  <div className='title-label'>その他</div>                  
                  <textarea onChange={this.getInputText.bind(this, 'other')} value={this.state.other}></textarea>
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

Exercise.contextType = Context;

Exercise.propTypes = {    
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,    
  cache_index:PropTypes.number,
  detailedPatientInfo : PropTypes.object,
  general_data:PropTypes.object,
  handleGeneralOk:PropTypes.func,
};

export default Exercise;
