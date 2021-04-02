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

const Wrapper = styled.div`
  font-size: 1rem;
  width: 100%;
  height: auto;
  padding:1rem;  
  padding-top:0.1rem;
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
    font-size:1.1rem;
    margin-bottom:0.2rem;
  }
  
  .blog-title{
    font-size:1rem;    
  }
  .small-input{
    // margin-right:10px;
    div{
      margin-top:2px;
    }
  }
  .radio-area{
    label{
      margin-top:0.2rem;   
    }
  }
  .numerical-title{
    font-size:1rem;
    margin-bottom:0.3rem;
  }
  .one-row{
    display:flex;
    margin-bottom:0.2rem;
    margin-top:0.6rem;
    width:100%;
    justify-content: space-between;    
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
      height:4.6rem;
    }
  }
  textarea{    
    height:4.6rem;
  }
  .spec-label{
    font-size:1rem;
    margin-bottom:0;
    padding-top:0.35rem;
    margin-right:0.3rem;
  }
  .short-label{
    width:2rem;
    text-align:center;
  }
  .short-input{
    width:6rem;
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

class Perception extends Component {
    constructor(props) {
        super(props);        
        this.state ={};
        var perception_data = this.props.general_data.perception_data;
        Object.keys(perception_data).map(key => {
          this.state[key] = perception_data[key]
        });
        this.state['general_data'] = this.props.general_data;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      var state_variabel = {};
      Object.keys(nextProps.general_data.perception_data).map(key => {
        state_variabel[key] = nextProps.general_data.perception_data[key];
      })
      state_variabel['general_data'] = nextProps.general_data;      
      this.setState(state_variabel);
    }

    selectCheckBox = (name, value) => {
      this.setState({[name]:value})
      var general_data = this.state.general_data;
      general_data.perception_data[name] = value;
      this.props.handleGeneralOk(general_data);
    }

    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;
      general_data.perception_data[name] = e.target.value;
      if (name == 'summary'){
        this.props.handleGeneralOk(general_data, true, 'perception_data');
      } else {
        this.props.handleGeneralOk(general_data);
      }
    }

    getSelect = (name, e) => {      
      this.setState({[name]:e.target.id});
      var general_data = this.state.general_data;
      general_data.perception_data[name] = e.target.id;
      this.props.handleGeneralOk(general_data);
    }
    
    render() {
        return (
            <Wrapper>              
              <div className='one-row' style={{width:'80%'}}>
                <div className='small-input'>
                  <div className='border-block'>
                    <div className='title-label'>瞳孔</div>
                    <div className='flex'>
                      <label className='short-label'>R</label>
                      <input className='short-input' onChange={this.getInputText.bind(this,'pupil_r')} value={this.state.pupil_r}></input>
                      <label className='short-label'>L</label>
                      <input className='short-input' onChange={this.getInputText.bind(this,'pupil_l')} value={this.state.pupil_l}></input>
                    </div>
                  </div>
                </div>
                <div className='small-input'>
                  <div className='border-block'>
                    <div className='title-label'>視覚障害</div>
                    <div className='flex'>
                      <div>
                        <Radiobox
                          id = {'visual_impair_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_visual_impairment')}
                          checked={this.state.with_or_without_visual_impairment == 0 ? true : false}
                          name={`visual_impair`}
                        />
                        <Radiobox
                          id = {'visual_impair_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_visual_impairment')}
                          checked={this.state.with_or_without_visual_impairment == 1 ? true : false}
                          name={`visual_impair`}
                        />
                      </div>
                      <div>
                        <Checkbox
                          label={'R'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.visual_impairment_r_flag}
                          name="visual_impairment_r_flag"
                          isDisabled = {this.state.with_or_without_visual_impairment!= 1}
                        />
                        <Checkbox
                          label={'眼鏡の使用'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.glasses_flag}
                          name="glasses_flag"
                          isDisabled = {this.state.with_or_without_visual_impairment!= 1}
                        />
                        <br/>
                        <Checkbox
                          label={'L'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.visual_impairment_l_flag}
                          name="visual_impairment_l_flag"
                          isDisabled = {this.state.with_or_without_visual_impairment!= 1}
                        />
                        <Checkbox
                          label={'コンタクトレンズの使用'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.contact_flag}
                          name="contact_flag"
                          isDisabled = {this.state.with_or_without_visual_impairment!= 1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='small-input'>
                  <div className='border-block'>
                    <div className='title-label'>聴覚障害</div>                  
                    <div className='flex'>
                      <div>
                        <Radiobox
                          id = {'hearing_impair_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_hearing_impairment')}
                          checked={this.state.with_or_without_hearing_impairment == 0 ? true : false}
                          name={`hearing_impair`}
                        />
                        <Radiobox
                          id = {'hearing_impair_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_hearing_impairment')}
                          checked={this.state.with_or_without_hearing_impairment == 1 ? true : false}
                          name={`hearing_impair`}
                        />
                      </div>
                      <div>
                        <Checkbox
                          label={'R'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.hearing_impairment_r_flag}
                          name="hearing_impairment_r_flag"
                          isDisabled = {this.state.with_or_without_hearing_impairment!= 1}
                        />
                        <Checkbox
                          label={'補聴器の使用'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.hearing_aid_flag}
                          name="hearing_aid_flag"
                          isDisabled = {this.state.with_or_without_hearing_impairment!= 1}
                        />
                        <br/>
                        <Checkbox
                          label={'L'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.hearing_impairment_l_flag}
                          name="hearing_impairment_l_flag"
                          isDisabled = {this.state.with_or_without_hearing_impairment!= 1}
                        />                      
                      </div>
                    </div>
                  </div>
                </div>
                <div className='small-input' style={{width:'12rem'}}>
                  <div className='border-block text-center'>
                    <div className='title-label'>眩暈・ふらつきの有無</div>
                    <div>
                      <Radiobox
                        id = {'dizziness_wobbling_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'dizziness_wobbling')}
                        checked={this.state.dizziness_wobbling == 0 ? true : false}
                        name={`dizziness_wobbling`}
                      />
                      <Radiobox
                        id = {'dizziness_wobbling_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'dizziness_wobbling')}
                        checked={this.state.dizziness_wobbling == 1 ? true : false}
                        name={`dizziness_wobbling`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='one-row' style={{justifyContent:'start'}}>
                <div className='border-block flex' style={{width:'49%'}}>
                  <div className='title-label'>嗅覚障害</div>
                  <div className='small-input' style={{width:'17%'}}>
                    <div className='flex'>
                      <Radiobox
                        id = {'olfactory_disorder_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'with_or_without_olfactory_disorder')}
                        checked={this.state.with_or_without_olfactory_disorder == 0 ? true : false}
                        name={`olfactory_disorder`}
                      />
                      <Radiobox
                        id = {'olfactory_disorder_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'with_or_without_olfactory_disorder')}
                        checked={this.state.with_or_without_olfactory_disorder == 1 ? true : false}
                        name={`olfactory_disorder`}
                      />
                    </div>
                  </div>                
                  <div className='small-input' style={{width:'83%'}}>
                    <div className='flex' style={{width:'100%'}}>
                      <div className='' style={{marginRight:'0.6rem'}}>症状</div>
                      <textarea value={this.state.olfactory_disorder} disabled={this.state.with_or_without_olfactory_disorder != 1} style={{width:'calc(100% - 3rem)'}} onChange={this.getInputText.bind(this,'olfactory_disorder')}></textarea>
                    </div>
                  </div>
                </div>
                <div className='small-input' style={{width:'48%', marginLeft:'2%'}}>
                  <div className='border-block'>
                    <div className='title-label'>味覚障害</div>
                    <div className='flex' style={{width:'100%'}}>
                      <div style={{width:'8rem'}}>
                        <Radiobox
                          id = {'taste_disorders_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_taste_disorders')}
                          checked={this.state.with_or_without_taste_disorders == 0 ? true : false}
                          name={`taste_disorders`}
                        />
                        <Radiobox
                          id = {'taste_disorders_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_taste_disorders')}
                          checked={this.state.with_or_without_taste_disorders == 1 ? true : false}
                          name={`taste_disorders`}
                        />
                      </div>
                      <div className='flex' style={{width:'calc(100% - 8rem)'}}>
                        <div className='' style={{marginRight:'0.6rem'}}>症状</div>
                        <textarea value={this.state.taste_disorders} disabled={this.state.with_or_without_taste_disorders != 1} onChange={this.getInputText.bind(this,'taste_disorders')} style={{width:'calc(100% - 2.8rem)'}}></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='one-row' style={{width:'55%'}}>
                <div className='small-input'>
                  <div className='border-block'>
                    <div className='title-label'>言語障害</div>
                    <div className='flex' style={{width:'100%'}}>
                      <div style={{width:'7rem'}}>
                        <Radiobox
                          id = {'language_disorder_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'language_disorder')}
                          checked={this.state.language_disorder == 0 ? true : false}
                          name={`language_disorder`}
                        />
                        <Radiobox
                          id = {'language_disorder_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'language_disorder')}
                          checked={this.state.language_disorder == 1 ? true : false}
                          name={`language_disorder`}
                        />
                      </div>
                      <div>
                        <Checkbox
                          label={'手話'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.sign_language_flag}
                          name="sign_language_flag"
                          isDisabled={this.state.language_disorder != 1}
                        />
                        <br/>
                        <Checkbox
                          label={'文字盤'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.dial_flag}
                          name="dial_flag"
                          isDisabled={this.state.language_disorder != 1}
                        />
                        <br/>
                        <Checkbox
                          label={'筆談'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.written_conversation_flag}
                          name="written_conversation_flag"
                          isDisabled={this.state.language_disorder != 1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='small-input'>
                  <div className='border-block'>
                    <div className='title-label'>見当識障害</div>
                    <div className='flex'>
                      <div>
                        <Radiobox
                          id = {'disorientation_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_disorientation')}
                          checked={this.state.with_or_without_disorientation == 0 ? true : false}
                          name={`disorientation`}
                        />
                        <Radiobox
                          id = {'disorientation_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_disorientation')}
                          checked={this.state.with_or_without_disorientation == 1 ? true : false}
                          name={`disorientation`}
                        />
                      </div>                      
                      <div>
                        <Checkbox
                          label={'人'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.man_flag}
                          name="man_flag"
                          isDisabled={this.state.with_or_without_disorientation != 1}
                        />
                        <br/>
                        <Checkbox
                          label={'場所'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.place_flag}
                          name="place_flag"
                          isDisabled={this.state.with_or_without_disorientation != 1}
                        />
                        <br/>
                        <Checkbox
                          label={'時間'}                      
                          getRadio={this.selectCheckBox.bind(this)}
                          value = {this.state.time_flag}
                          name="time_flag"
                          isDisabled={this.state.with_or_without_disorientation != 1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='small-input' style={{width:'70%%'}}>
                  <div className='border-block'>
                    <div className='title-label'>知覚障害</div>
                    <div className='flex' style={{width:'100%'}}>
                      <div style={{width:'8rem'}}>
                        <Radiobox
                          id = {'paresthesia_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_paresthesia')}
                          checked={this.state.with_or_without_paresthesia == 0 ? true : false}
                          name={`paresthesia`}
                        />
                        <Radiobox
                          id = {'paresthesia_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_paresthesia')}
                          checked={this.state.with_or_without_paresthesia == 1 ? true : false}
                          name={`paresthesia`}
                        />
                      </div>
                      <div className='flex' style={{width:'calc(100% - 8rem)'}}>
                        <div className='' style={{marginRight:'0.6rem', marginLeft:'1rem'}}>部位</div>
                        <textarea value={this.state.paresthesia_site} disabled={this.state.with_or_without_paresthesia != 1} style={{width:'calc(100% - 3.8rem)'}} onChange={this.getInputText.bind(this,'paresthesia_site')}></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='one-row' style={{marginTop:'1.2rem'}}>
                <div className='border-block flex' style={{width:'100%'}}>
                  <div className='title-label'>身体可動性障害</div>
                  <div className='small-input' style={{width:'21%'}}>                  
                  <div className=''>
                    <Radiobox
                      id = {'pain_no'}
                      label={'無'}
                      value={0}
                      getUsage={this.getInputText.bind(this, 'with_or_without_pain')}
                      checked={this.state.with_or_without_pain == 0 ? true : false}
                      name={`pain`}
                    />
                    <Radiobox
                      id = {'pain_yes'}
                      label={'有'}
                      value={1}
                      getUsage={this.getInputText.bind(this, 'with_or_without_pain')}
                      checked={this.state.with_or_without_pain == 1 ? true : false}
                      name={`pain`}
                    />
                    <label style={{float:'right'}}>部位・症状<br/>(持続時間・発現状況など)</label>
                  </div>
                </div>
                  <div className='small-input' style={{width:'40%'}}>
                    <textarea value={this.state.pain_site} disabled={this.state.with_or_without_pain != 1} style={{width:'100%'}} onChange={this.getInputText.bind(this,'pain_site')}></textarea>
                  </div>
                  <div className='small-input' style={{width:'40%'}}>
                    <div className='flex' style={{width:'100%'}}>
                      <div className='' style={{marginRight:'0.6rem', marginLeft:'1rem'}}>対処法</div>
                      <textarea value={this.state.how_to_deal_with_pain} disabled={this.state.with_or_without_pain != 1} style={{width:'calc(100% - 5rem)'}} onChange={this.getInputText.bind(this,'how_to_deal_with_pain')}></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className='one-row'>
                <div className='small-input' style={{width:'47%'}}>
                  <div className='border-block'>
                    <div className='title-label'>意識障害</div>
                    <div className='flex' style={{width:'100%'}}>
                      <div style={{width:'7rem'}}>
                        <Radiobox
                          id = {'consciousness_disorder_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_consciousness_disorder')}
                          checked={this.state.with_or_without_consciousness_disorder == 0 ? true : false}
                          name={`consciousness_disorder`}
                        />
                        <Radiobox
                          id = {'consciousness_disorder_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_consciousness_disorder')}
                          checked={this.state.with_or_without_consciousness_disorder == 1 ? true : false}
                          name={`consciousness_disorder`}
                        />
                      </div>
                      <textarea value={this.state.consciousness_disorder} disabled={this.state.with_or_without_consciousness_disorder != 1} style={{width:'calc(100% - 7rem)'}} onChange={this.getInputText.bind(this,'consciousness_disorder')}></textarea>
                    </div>
                  </div>
                </div>
                <div className='small-input' style={{width:'47%'}}>
                  <div className='border-block' style={{width:'100%'}}>
                    <div className='title-label'>認知障害</div>
                    <div className='flex' style={{width:'100%'}}>
                      <div style={{width:'7rem'}}>
                        <Radiobox
                          id = {'cognitive_impair_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_cognitive_impairment')}
                          checked={this.state.with_or_without_cognitive_impairment == 0 ? true : false}
                          name={`cognitive_impair`}
                        />
                        <Radiobox
                          id = {'cognitive_impair_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_cognitive_impairment')}
                          checked={this.state.with_or_without_cognitive_impairment == 1 ? true : false}
                          name={`cognitive_impair`}
                        />
                      </div>
                      <textarea value={this.state.cognitive_impairment} disabled={this.state.with_or_without_cognitive_impairment != 1} style={{width:'calc(100% - 7rem)'}} onChange={this.getInputText.bind(this,'cognitive_impairment')}></textarea>
                    </div>
                  </div>
                </div>                
              </div>
              
              <div className='one-row'>
                <div className='small-input' style={{width:'30%'}}>
                  <div className='numerical-title'>記憶力</div>
                  <textarea style={{width:'100%'}} onChange={this.getInputText.bind(this, 'memory')} value={this.state.memory}></textarea>
                </div>
                <div className='small-input' style={{width:'30%'}}>
                  <div className='numerical-title'>判断能力</div>
                  <textarea style={{width:'100%'}} onChange={this.getInputText.bind(this, 'judgment_ability')} value={this.state.judgment_ability}></textarea>
                </div>
                <div className='small-input' style={{width:'30%'}}>
                  <div className='numerical-title'>会話能力</div>
                  <textarea style={{width:'100%'}} onChange={this.getInputText.bind(this, 'conversational_ability')} value={this.state.conversational_ability}></textarea>
                </div>
              </div>
              
              <div className='other-area one-row flex'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>その他</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'other')} value={this.state.other}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>要約</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'summary')} value={this.state.summary}></textarea>
                </div>                
              </div>
              </Wrapper>
        );
    }
}

Perception.contextType = Context;

Perception.propTypes = {    
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,    
  cache_index:PropTypes.number,
  detailedPatientInfo : PropTypes.object,
  general_data:PropTypes.object,
  handleGeneralOk:PropTypes.func,
};

export default Perception;
