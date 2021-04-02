import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import DatePicker,{ registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
// import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import Checkbox from "~/components/molecules/Checkbox";
import {toHalfWidthOnlyNumber} from "~/helpers/dialConstants";

const Wrapper = styled.div`
  font-size: 1rem;
  width: 100%;
  height: auto;
  padding-left:1rem;
  padding-right:1rem;
  padding-top:1rem;
 .react-datepicker-popper {
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
 } 
 label{
   font-size:1rem;
 }
  .sub-title{
    font-size:1.0rem;
    margin-bottom:0.2rem;
    font-wieght:bold;
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
  .one-row{
    display:flex;
    margin-top:0.8rem;
    width:100%;
    justify-content: space-between;    
  }
  .label-title{
    display:none;
  }
  input[type='text']{
    font-size:1rem!important;
    max-width:5rem;
    height:1.5rem;
  }
  .label-unit{
    width:auto;
    margin-left:3px;
    margin-top:0.3rem;
    margin-left:0;
    font-size:1rem;
  }
  .title-label{
    font-size:1rem;
    width:auto;
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
      height:5rem;
    }
  }
  textarea{    
    height:5rem;
  }
  .spec-label{
    font-size:1rem;
    margin-bottom:0;
    padding-top:0.35rem;
    margin-right:0.3rem;
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
  .react-datepicker-wrapper{
    margin-top:0.5rem;
    input{
      height:1.75rem;
    }
  }
`;

class Rest extends Component {
    constructor(props) {
        super(props);        
        this.state ={};
        var rest_data = this.props.general_data.rest_data;
        Object.keys(rest_data).map(key => {
          this.state[key] = rest_data[key]
        });
        this.state['general_data'] = this.props.general_data;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      var state_variabel = {};
      Object.keys(nextProps.general_data.rest_data).map(key => {
        state_variabel[key] = nextProps.general_data.rest_data[key];
      })
      state_variabel['general_data'] = nextProps.general_data;      
      this.setState(state_variabel);
    }

    getInputNumber =(name, e) => {      
      if (typeof e == 'number') e = e.toString();
      let input_value = e != null ? e.replace(/[^0-9０-９][/./][0-9０-９]/g, ""):'';       
      if (input_value != "") {
        input_value = (toHalfWidthOnlyNumber(input_value));
      } else {
        input_value = null;
      }
      this.setState({
        [name]:input_value,
      })

      var general_data = this.state.general_data;
      general_data.rest_data[name] = input_value;
      this.props.handleGeneralOk(general_data);
    }
    selectCheckBox = (name, value) => {
      this.setState({[name]:value})
      var general_data = this.state.general_data;
      general_data.rest_data[name] = value;
      this.props.handleGeneralOk(general_data);
    }

    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;
      general_data.rest_data[name] = e.target.value;
      if (name == 'summary'){
        this.props.handleGeneralOk(general_data, true, 'rest_data');
      } else {
        this.props.handleGeneralOk(general_data);
      }
    }

    getSelect = (name, e) => {      
      this.setState({[name]:e.target.id});
      var general_data = this.state.general_data;
      general_data.rest_data[name] = e.target.id;
      this.props.handleGeneralOk(general_data);
    }

    getBedTime = (value) => {
      this.setState({bedtime:value});
      var general_data = this.state.general_data;
      general_data.rest_data.bedtime = value;
      this.props.handleGeneralOk(general_data);
    }
    
    getWakeUpTime = (value) => {
      this.setState({wake_up_time:value});
      var general_data = this.state.general_data;
      general_data.rest_data.wake_up_time = value;
      this.props.handleGeneralOk(general_data);
    }

    render() {
        return (
            <Wrapper>
              <div className='sub-title'>睡眠</div>  
              <div className='one-row' style={{width:'70%'}}>
                <div className='small-input'>
                  <div className='border-block'>
                    <div className='title-label'>睡眠時間</div>
                    <div className='flex'>
                      <label className='spec-label' style={{fontSize:'1rem'}}>約</label>
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'時間'}
                        maxLength={ 4 }
                        max={9999}
                        min = {0}
                        precision={1}
                        step={0.1}
                        className="form-control"
                        value={this.state.time_of_sleeping}
                        getInputText={this.getInputNumber.bind(this, "time_of_sleeping")}
                        inputmode="numeric"
                      />
                    </div>
                  </div>
                </div>
                <div className='small-input'>
                  <div className='flex border-block' style={{paddingBottom:'0.8rem'}}>
                    <div className='' style={{marginRight:'0.4rem'}}>
                      <div className='title-label'>就寝時刻</div>
                        <DatePicker
                          locale="ja"
                          selected={this.state.bedtime}
                          onChange={this.getBedTime.bind(this)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={10}
                          dateFormat="HH:mm"
                          timeFormat="HH:mm"
                          id='entry_time_id'
                          timeCaption='時刻'
                        />                      
                    </div>
                    <div className='' style={{marginLeft:'2rem'}}>
                      <div className='title-label' style={{left:'8rem'}}>起床時刻</div>
                        <DatePicker
                          locale="ja"
                          selected={this.state.wake_up_time}
                          onChange={this.getWakeUpTime.bind(this)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={10}
                          dateFormat="HH:mm"
                          timeFormat="HH:mm"
                          id='entry_time_id'
                          timeCaption='時刻'
                        />
                    </div>
                  </div>

                </div>                
                <div className='small-input'>
                  <div className='border-block'>
                    <div className='title-label'>入眠までの時間</div>
                    <NumericInputWithUnitLabel
                      label={''}
                      unit={'分'}
                      maxLength={ 4 }
                      max={9999}
                      min = {0}
                      className="form-control"
                      value={this.state.sleep_time}
                      getInputText={this.getInputNumber.bind(this, "sleep_time")}
                      inputmode="numeric"
                    />
                  </div>
                </div>
                <div className='small-input'>
                  <div className='border-block'>
                    <div className='title-label'>睡眠中断</div>
                    <div className='flex radio-area'>
                      <Radiobox
                        id = {'sleep_stop_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'with_or_without_sleep_interruption')}
                        checked={this.state.with_or_without_sleep_interruption == 0 ? true : false}
                        name={`sleep_stop`}
                      />
                      <Radiobox
                        id = {'sleep_stop_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'with_or_without_sleep_interruption')}
                        checked={this.state.with_or_without_sleep_interruption == 1 ? true : false}
                        name={`sleep_stop`}
                      />
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'回'}
                        maxLength={ 4 }
                        max={9999}
                        min = {0}
                        className="form-control"
                        value={this.state.number_of_sleep_interruptions}
                        getInputText={this.getInputNumber.bind(this, "number_of_sleep_interruptions")}
                        inputmode="numeric"
                        disabled = {this.state.with_or_without_sleep_interruption != 1}
                      />
                    </div>
                  </div>
                </div>
                <div className='small-input'>
                  <div className='border-block'>
                    <div className='title-label'>午睡習慣</div>
                    <div className='flex radio-area'>
                      <Radiobox
                        id = {'midday_habit_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'with_or_without_napping_habit')}
                        checked={this.state.with_or_without_napping_habit == 0 ? true : false}
                        name={`midday_habit`}
                      />
                      <Radiobox
                        id = {'midday_habit_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'with_or_without_napping_habit')}
                        checked={this.state.with_or_without_napping_habit == 1 ? true : false}
                        name={`midday_habit`}
                      />
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'時間'}
                        maxLength={ 4 }
                        max={9999}
                        min = {0}
                        className="form-control"
                        value={this.state.hours_of_napping}
                        getInputText={this.getInputNumber.bind(this, "hours_of_napping")}
                        inputmode="numeric"
                        disabled = {this.state.with_or_without_napping_habit != 1}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='one-row' style={{width:'100%'}}>
                <div className='border-block' style={{width:'100%'}}>
                  <div className='title-label'>睡眠状態</div>
                  <div className='flex' style={{width:'100%'}}>
                    <div className='flex' style={{width:'50%', marginRight:'3%'}}>
                      <div className='checkbox-area' style={{width:'8rem'}}>
                        <Radiobox
                          id = {'sleep_status_ok'}
                          label={'良好'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'sleep_state')}
                          checked={this.state.sleep_state == 0 ? true : false}
                          name={`sleep_status`}
                        />
                        <Radiobox
                          id = {'sleep_status_bad'}
                          label={'不眠'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'sleep_state')}
                          checked={this.state.sleep_state == 1 ? true : false}
                          name={`sleep_status`}
                        />
                      </div>
                      <div className='flex' style={{width:'calc(100% - 8rem)'}}>
                        <div style={{marginRight:'0.5rem'}}>理由・状況</div>
                        <textarea value={this.state.reason_for_insomnia} disabled={this.state.sleep_state != 1} style={{width:'calc(100% - 5.5rem'}} onChange={this.getInputText.bind(this, 'reason_for_insomnia')}></textarea>
                      </div>
                    </div>
                    <div className='' style={{width:'50%', marginRight:'0%'}}>
                      <div className='flex'>
                        <div style={{marginRight:'0.5rem'}}>対処法</div>
                        <textarea value={this.state.how_to_deal_with_insomnia} disabled={this.state.sleep_state != 1} onChange={this.getInputText.bind(this, 'how_to_deal_with_insomnia')} style={{width:'calc(100% - 4rem'}}></textarea>
                      </div>
                    </div>                  

                  </div>
                </div>
              </div>

              <div className='one-row' style={{width:'100%'}}>
                <div className='border-block' style={{width:'65%'}}>
                  <div className='title-label'>睡眠薬の使用</div>
                  <div className='flex'>
                    <div className='flex' style={{width:'72%'}}>
                      <div className='checkbox-area' style={{width:'8rem'}}>
                        <Radiobox
                          id = {'medicine_use_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_sleeping_pills')}
                          checked={this.state.with_or_without_sleeping_pills == 0 ? true : false}
                          name={`medicine_use`}
                        />
                        <Radiobox
                          id = {'medicine_use_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_sleeping_pills')}
                          checked={this.state.with_or_without_sleeping_pills == 1 ? true : false}
                          name={`medicine_use`}
                        />
                      </div>
                      <div className='flex' style={{width:'calc(100% - 8rem)'}}>
                        <div className='' style={{marginRight:'1rem'}}>使用薬名</div>
                        <textarea value={this.state.sleeping_pills_name} disabled={this.state.with_or_without_sleeping_pills != 1} style={{width:'calc(100% - 5.5rem'}} onChange={this.getInputText.bind(this, 'sleeping_pills_name')}></textarea>
                      </div>
                    </div>
                    <div className='checkbox-area' style={{marginLeft:'2rem'}}>
                      <label style={{fontSize:'1rem', marginRight:'0.5rem'}}>使用頻度</label>
                      <Radiobox
                        id = {'use_count_1'}
                        label={'時々'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'frequency_of_sleeping_pills')}
                        checked={this.state.frequency_of_sleeping_pills == 0 ? true : false}
                        name={`medicine_use_count`}
                      />
                      <Radiobox
                        id = {'use_count_2'}
                        label={'常用'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'frequency_of_sleeping_pills')}
                        checked={this.state.frequency_of_sleeping_pills == 1 ? true : false}
                        name={`medicine_use_count`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='one-row' style={{width:'47%'}}>
                <div className='border-block' style={{width:'100%'}}>
                  <div className='title-label'>覚醒時の症状</div>
                  <div className='flex'>
                    <div style={{width:'8rem'}}>
                      <Radiobox
                        id = {'wake_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'with_or_without_awake_symptoms')}
                        checked={this.state.with_or_without_awake_symptoms == 0 ? true : false}
                        name={`wake`}
                      />
                      <Radiobox
                        id = {'wake_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'with_or_without_awake_symptoms')}
                        checked={this.state.with_or_without_awake_symptoms == 1 ? true : false}
                        name={`wake`}
                      />
                    </div>
                    <div style={{width:'calc(100% - 8rem)'}}>
                      <div className = 'flex' style={{marginBottom:'0.2rem'}}>
                        <Checkbox
                          label={'眠気'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.sleepiness_flag}
                          name="sleepiness_flag"
                          isDisabled = {this.state.with_or_without_awake_symptoms != 1}
                        />
                        <Checkbox
                          label={'欠伸'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.yawn_flag}
                          name="yawn_flag"
                          isDisabled = {this.state.with_or_without_awake_symptoms != 1}
                        />
                        <Checkbox
                          label={'倦怠感'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.malaise_flag}
                          name="malaise_flag"
                          isDisabled = {this.state.with_or_without_awake_symptoms != 1}
                        />
                      </div>
                      <div className = 'flex'>
                        <div style={{width:'5.5rem'}}>
                          <Checkbox
                            label={'その他'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.other_awake_symptoms_flag}
                            name="other_awake_symptoms_flag"
                            isDisabled = {this.state.with_or_without_awake_symptoms != 1}
                          />
                        </div>
                        <textarea disabled={this.state.with_or_without_awake_symptoms != 1 || this.state.other_awake_symptoms_flag != 1}
                          style={{width:'calc(100% - 5.5rem'}} onChange={this.getInputText.bind(this, 'other_awake_symptoms')}
                          value={this.state.other_awake_symptoms}>                      
                        </textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='sub-title' style={{marginTop:'0.3rem'}}>休息</div>
              <div className='one-row'>
                <div className='one-blog flex' style={{width:'47%', marginRight:'3%'}}>
                  <div style={{width:'9rem'}}>
                    <div className='border-block text-center'>
                      <div className='title-label'>休息の満足感</div>
                      <Radiobox
                        id = {'rest_satisfy_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'rest_satisfaction')}
                        checked={this.state.rest_satisfaction == 0 ? true : false}
                        name={`rest_satisfy`}
                      />
                      <Radiobox
                        id = {'rest_satisfy_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'rest_satisfaction')}
                        checked={this.state.rest_satisfaction == 1 ? true : false}
                        name={`rest_satisfy`}
                      />
                    </div>
                  </div>
                  <div style={{width:'calc(100% - 8rem)'}}>
                    <div className='border-block'>
                      <div className='title-label'>健康時の休息状況</div>
                      <textarea onChange={this.getInputText.bind(this, 'rest_status_health_')} value={this.state.rest_status_health_}></textarea>
                    </div>
                  </div>
                </div>                
                <div className='one-blog' style={{width:'47%'}}>
                  <div className='border-block'>
                    <div className='title-label'>入院後の休息状況</div>
                    <textarea onChange={this.getInputText.bind(this, 'rest_status_hospitalization')} value={this.state.rest_status_hospitalization}></textarea>
                  </div>
                </div>
              </div>
              
              <div className='other-area one-row flex'>
                <div className='one-blog'>                  
                  <div className='title-label'>その他</div>                  
                  <textarea onChange={this.getInputText.bind(this, 'other')} value={this.state.other}></textarea>
                </div>
                <div className='one-blog'>                  
                  <div className='blog-title'>要約</div>                  
                  <textarea onChange={this.getInputText.bind(this, 'summary')} value={this.state.summary}></textarea>
                </div>                
              </div>
              </Wrapper>
        );
    }
}

Rest.contextType = Context;

Rest.propTypes = {    
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,    
  cache_index:PropTypes.number,
  detailedPatientInfo : PropTypes.object,
  general_data:PropTypes.object,
  handleGeneralOk:PropTypes.func,
};

export default Rest;
