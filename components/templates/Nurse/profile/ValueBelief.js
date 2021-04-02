import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
import {toHalfWidthOnlyNumber} from "~/helpers/dialConstants";

const Wrapper = styled.div`
  font-size: 1rem;
  width: 100%;
  height: auto;
  padding-top:3rem;
  padding-left:1rem;
  padding-right:1rem;  
 .react-datepicker-popper {
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
 } 
 label{
  font-size:1rem;
  margin-bottom:0;
 }
  .sub-title{
    font-size:1.1rem;
    margin-bottom:0.3rem;
  }
  
  .blog-title{
    font-size:1rem;    
  }
  .one-row{
    display:flex;
    margin-bottom:1rem;
    width:100%;
    justify-content: space-between;    
  }
  .one-blog{    
    width:30%;
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
      height:7rem;
    }
    label{
      margin-top:3px;      
    }
    .inputbox-area{
      width: calc( 100% - 85px);
      div{
        margin-top:0;
      }      
      .label-title{
        width:3rem;
        text-align:right;
        margin-right:0.5rem;
        margin-top:6px;
      }      
      input{
        width:100%;
        height:2rem;
      }
    }
  }
  .other-area{
    width:100%;
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

class ValueBelief extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        var belief_data = this.props.general_data.belief_data;        
        Object.keys(belief_data).map(key => {          
          this.state[key] = belief_data[key]
        });
        this.state['general_data'] = this.props.general_data;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      var state_variabel = {};
      Object.keys(nextProps.general_data.belief_data).map(key => {
        state_variabel[key] = nextProps.general_data.belief_data[key];
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
      general_data.belief_data[name] = input_value;
      this.props.handleGeneralOk(general_data);
    }
    selectCheckBox = (name, value) => {
      this.setState({[name]:value})
      var general_data = this.state.general_data;
      general_data.belief_data[name] = value;
      this.props.handleGeneralOk(general_data);
    }

    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;
      general_data.belief_data[name] = e.target.value;
      if (name == 'summary'){
        this.props.handleGeneralOk(general_data, true, 'belief_data');
      } else {
        this.props.handleGeneralOk(general_data);
      }
    }

    getSelect = (name, e) => {      
      this.setState({[name]:e.target.id});
      var general_data = this.state.general_data;
      general_data.belief_data[name] = e.target.id;
      this.props.handleGeneralOk(general_data);
    }
    
    render() {
        return (
            <Wrapper>
              <div className='one-row'>
                <div className = 'border-block' style={{width:'70%'}}>
                  <div className='title-label'>宗教</div>
                  <div className='flex'>
                    <div className='' style={{marginRight:'5rem', width:'8rem'}}>
                      <Radiobox
                        id = {'religion_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'religion')}
                        checked={this.state.religion == 0 ? true : false}
                        name={`religion`}
                      />
                      <Radiobox
                        id = {'religion_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'religion')}
                        checked={this.state.religion == 1 ? true : false}
                        name={`religion`}
                      />
                    </div>
                    <div className='one-blog' style={{width:'40%'}}>
                      <div className='flex'>
                        <label className='blog-title'>宗教的習慣</label>
                      </div>
                      <textarea disabled={this.state.religion != 1} onChange={this.getInputText.bind(this, 'religious_customs')} value={this.state.religious_customs}></textarea>
                    </div>
                    <div className='one-blog' style={{width:'40%'}}>
                      <div className='flex'>
                        <label className='blog-title'>生活習慣</label>
                      </div>
                      <textarea disabled={this.state.religion != 1} onChange={this.getInputText.bind(this, 'lifestyle')} value={this.state.lifestyle}></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>価値・信念</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'value')} value={this.state.value}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>人生目標</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'life_goal')} value={this.state.life_goal}></textarea>
                </div>
                <div className='one-blog'>                  
                </div>
              </div>
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>健康状態との関係</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'health_relationship')} value={this.state.health_relationship}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>治療への留意点</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'points_to_remember')} value={this.state.points_to_remember}></textarea>
                </div>
                <div className='one-blog'></div>
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
                <div className='one-blog'></div>
              </div>
              </Wrapper>
        );
    }
}

ValueBelief.contextType = Context;

ValueBelief.propTypes = {    
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,    
  cache_index:PropTypes.number,
  detailedPatientInfo : PropTypes.object,
  general_data:PropTypes.object,
  handleGeneralOk:PropTypes.func,
};

export default ValueBelief;
