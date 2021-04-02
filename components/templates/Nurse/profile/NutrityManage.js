import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Checkbox from "~/components/molecules/Checkbox";
import Radiobox from "~/components/molecules/Radiobox";
// import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import {toHalfWidthOnlyNumber} from "~/helpers/dialConstants";

const Wrapper = styled.div`
  font-size: 1rem;
  width: 100%;
  height: auto;
  padding-left:1rem;
  padding-right:1rem;
  padding-top:0.3rem;
  .flex{
    margin-bottom:0.2rem;
  }
  
 .react-datepicker-popper {
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
 }
 input[type="text"]{
  font-size:1rem!important;
}
label{
  font-size:1rem!important;
}
 textarea{
  width:calc(100% - 5.2rem);
  height:3rem;
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
    margin-bottom:0rem;
    width:100%;
    justify-content: space-between;    
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
  .one-third{    
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
      height:3.5rem;
    }
  }
  .other-area{
    width:100%;
    margin-top:0.2rem;
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
    width:auto;
    margin-top:0;
  }
  .weight{    
    .num-label{
      margin-top:3px;
      margin-right:3px;
    }
  }
  .no-unit-numeric{
    .label-unit{
      display:none;
    }
    margin-right:5px;
    input{
      width:10rem;
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

class NutrityManage extends Component {
    constructor(props) {
        super(props);
        this.state ={};
        var nutrition_data = this.props.general_data.nutrition_data;
        Object.keys(nutrition_data).map(key => {
          this.state[key] = nutrition_data[key]
        });
        this.state['general_data'] = this.props.general_data;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      var state_variabel = {};
      Object.keys(nextProps.general_data.nutrition_data).map(key => {
        state_variabel[key] = nextProps.general_data.nutrition_data[key];
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
      general_data.nutrition_data[name] = input_value;
      this.props.handleGeneralOk(general_data);
    }
    selectCheckBox = (name, value) => {
      this.setState({[name]:value})
      var general_data = this.state.general_data;
      general_data.nutrition_data[name] = value;
      this.props.handleGeneralOk(general_data);
    }

    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;
      general_data.nutrition_data[name] = e.target.value;
      if (name == 'summary'){
        this.props.handleGeneralOk(general_data, true, 'nutrition_data');
      } else {
        this.props.handleGeneralOk(general_data);
      }
    }

    getSelect = (name, e) => {      
      this.setState({[name]:e.target.id});
      var general_data = this.state.general_data;
      general_data.nutrition_data[name] = e.target.id;
      this.props.handleGeneralOk(general_data);
    }

    
    render() {
        return (
          <Wrapper>
              <div className='flex'>
                <label className='blog-title'>食事形態</label>
              </div>
              <div className='one-row'>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>一日の食事回数</div>                  
                    <NumericInputWithUnitLabel
                      label={''}
                      unit={'回'}
                      maxLength={4}
                      max={9999}
                      min = {0}
                      className="form-control"
                      value={this.state.number_of_meals}
                      getInputText={this.getInputNumber.bind(this, "number_of_meals")}
                      inputmode="numeric"
                    />
                  </div>                  
                </div>
                <div className='checkbox-blog border-block'>                  
                  <div className='title-label'>主食</div>                  
                  <div className='flex'>
                    <Checkbox
                      label={'米飯'}                      
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.rice_flag}
                      name="rice_flag"
                    />
                    <Checkbox
                      label={'全粥'}                      
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.whole_porridge_flag}
                      name="whole_porridge_flag"
                    />
                    <Checkbox
                      label={'重湯'}                      
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.heavy_water_flag}
                      name="heavy_water_flag"
                    />
                    <Checkbox
                      label={'パン'}                      
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.bread_flag}
                      name="bread_flag"
                    />
                  </div>
                  <div className='flex'>
                    <Checkbox
                      label={'その他'}                      
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.other_staple_food_flag}
                      name="other_staple_food_flag"
                    />
                    <textarea disabled={this.state.other_staple_food_flag != 1} onChange={this.getInputText.bind(this, 'other_staple_food')} value={this.state.other_staple_food}></textarea>
                  </div>
                </div>
                <div className='checkbox-blog border-block'>                  
                  <div className='title-label'>副食</div>                  
                  <div className='flex'>
                    <Checkbox
                      label={'普通'}                      
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.usually_flag}
                      name="usually_flag"
                    />
                    <Checkbox
                      label={'軟菜'}                      
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.soft_vegetables_flag}
                      name="soft_vegetables_flag"
                    />
                    <Checkbox
                      label={'きざみ'}                      
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.shredded_flag}
                      name="shredded_flag"
                    />                    
                  </div>
                  <div className='flex'>
                    <Checkbox
                      label={'その他'}                      
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.other_side_dish_flag}
                      name="other_side_dish_flag"
                    />
                    <textarea disabled={this.state.other_side_dish_flag != 1} onChange={this.getInputText.bind(this,'other_side_dish')} value={this.state.other_side_dish}></textarea>
                  </div>
                </div>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>間食の有無</div>
                    <div className='flex'>
                      <Radiobox
                        id = {'snack_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'with_or_without_eat_between_meals')}
                        checked={this.state.with_or_without_eat_between_meals == 0 ? true : false}
                        name={`snack`}
                      />
                      <Radiobox
                        id = {'snack_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'with_or_without_eat_between_meals')}
                        checked={this.state.with_or_without_eat_between_meals == 1 ? true : false}
                        name={`snack`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex' style={{marginTop:'1rem'}}>
                <div className='checkbox-blog'>
                  <div className='border-block'>
                    <div className='title-label'>摂取状況・方法</div>
                    <div className='flex'>
                      <Checkbox
                        label={'経口摂取'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.oral_ingestion_flag}
                        name="oral_ingestion_flag"
                      />
                      <Checkbox
                        label={'経管栄養'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.tube_feeding_flag}
                        name="tube_feeding_flag"
                      />
                      <Checkbox
                        label={'胃瘻'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.gastrostomy_flag}
                        name="gastrostomy_flag"
                      />
                      <Checkbox
                        label={'腸瘻'}
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.enteric_fistula_flag}
                        name="enteric_fistula_flag"
                      />
                      <Checkbox
                        label={'TPN(total parenteral nutrition:完全静脈栄養法)'}
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.tpn_flag}
                        name="tpn_flag"
                      />
                    </div>
                    <div className='flex'>
                      <Checkbox
                        label={'その他'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.other_ingestion_status_flag}
                        name="other_ingestion_status_flag"
                      />
                      <textarea disabled={this.state.other_ingestion_status_flag != 1} onChange={this.getInputText.bind(this, 'other_ingestion_status')} value={this.state.other_ingestion_status}></textarea>
                    </div>
                  </div>
                </div>                
                <div className='checkbox-blog'>
                  <div className='border-block'>
                    <div className='title-label'>水分摂取状況</div>
                    <NumericInputWithUnitLabel
                      label={''}
                      unit={'mL/d'}                    
                      max={9999}
                      min = {0}
                      precision={2}
                      step={0.01}
                      className="form-control"
                      value={this.state.moisture}
                      getInputText={this.getInputNumber.bind(this, "moisture")}
                      inputmode="numeric"
                    />
                    <div className='flex'>
                      <label className=''>（循環器系・泌尿器科系の場合は必要情報）</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='one-row'>
                <div className='one-third'>
                  <div className='border-block'>
                    <div className='title-label'>偏食の有無</div>                  
                    <textarea onChange={this.getInputText.bind(this, 'unbalanced_diet')} value={this.state.unbalanced_diet}></textarea>
                  </div>
                </div>
                <div className='one-third'>
                  <div className='border-block'>
                    <div className='title-label'>食欲の有無</div>                  
                    <textarea onChange={this.getInputText.bind(this, 'appetite')} value={this.state.appetite}></textarea>                    
                  </div>
                </div>
                <div className='one-third'>
                  <div className='border-block'>
                    <div className='title-label'>嚥下困難の有無</div>                  
                    <textarea onChange={this.getInputText.bind(this, 'difficulty_swallowing')} value={this.state.difficulty_swallowing}></textarea>
                  </div>
                </div>
              </div>

              <div className='blog-title'>口腔内の状態</div>              
              <div className='one-row' style={{width:'96%'}}>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>歯の数</div>
                    <NumericInputWithUnitLabel
                      label={''}
                      unit={'本'}
                      maxLength={ 4 }
                      max={9999}
                      min = {0}
                      className="form-control"
                      value={this.state.number_of_teeth}
                      getInputText={this.getInputNumber.bind(this, "number_of_teeth")}
                      inputmode="numeric"
                    />
                  </div>
                </div>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>義歯の有無</div>
                    <div className='flex'>
                      <Radiobox
                        id = {'artificial_tooth_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'with_or_without_denture')}
                        checked={this.state.with_or_without_denture == 0 ? true : false}
                        name={`artificial_tooth`}
                      />
                      <Radiobox
                        id = {'artificial_tooth_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'with_or_without_denture')}
                        checked={this.state.with_or_without_denture == 1 ? true : false}
                        name={`artificial_tooth`}
                      />
                      <div className='checkbox-blog'>
                        <div className='flex'>
                          <Checkbox
                            label={'総入れ歯'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.full_dentures_flag}
                            name="full_dentures_flag"
                            isDisabled = {this.state.with_or_without_denture != 1}
                          />
                          <Checkbox
                            label={'部分入れ歯（上）'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.partial_denture_top_flag}
                            name="partial_denture_top_flag"
                            isDisabled = {this.state.with_or_without_denture != 1}
                          />
                          <Checkbox
                            label={'部分入れ歯（下）'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.partial_denture_bottom_flag}
                            name="partial_denture_bottom_flag"
                            isDisabled = {this.state.with_or_without_denture != 1}
                          />
                        </div>
                        <div className='flex'>
                          <Checkbox
                            label={'差し歯（上）'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.insert_tooth_top_flag}
                            name="insert_tooth_top_flag"
                            isDisabled = {this.state.with_or_without_denture != 1}
                          />
                          <Checkbox
                            label={'差し歯（下）'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.insert_tooth_bottom_flag}
                            name="insert_tooth_bottom_flag"
                            isDisabled = {this.state.with_or_without_denture != 1}
                          />                    
                        </div>
                        <div className='flex'>
                          <Checkbox
                            label={'その他'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.other_denture_flag}
                            name="other_denture_flag"
                            isDisabled = {this.state.with_or_without_denture != 1}
                          />
                          <textarea value={this.state.other_denture} disabled={this.state.with_or_without_denture != 1 || this.state.other_denture_flag != 1} onChange={this.getInputText.bind(this, 'other_denture')}></textarea>
                        </div>
                      </div>
                    </div>                    
                  </div>
                </div>                
                <div className='checkbox-blog'>
                  <div className='border-block'>
                    <div className='title-label'>口腔粘膜の状態</div>
                    <div className='flex'>
                      <Checkbox
                        label={'口内炎'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.stomatitis_flag}
                        name="stomatitis_flag"
                      />
                      <Checkbox
                        label={'白斑'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.vitiligo_teeth_flag}
                        name="vitiligo_teeth_flag"
                      />
                      <Checkbox
                        label={'歯肉出血'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.meat_bleeding_flag}
                        name="meat_bleeding_flag"
                      />
                      <Checkbox
                        label={'乾燥'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.dry_flag}
                        name="dry_flag"
                      />
                    </div>
                    <div className='flex'>
                      <Checkbox
                        label={'その他'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.other_oral_mucosa_flag}
                        name="other_oral_mucosa_flag"
                      />
                      <textarea disabled={this.state.other_oral_mucosa_flag != 1} onChange={this.getInputText.bind(this, 'other_oral_mucosa')} value={this.state.other_oral_mucosa}></textarea>
                    </div>                
                  </div>
                </div>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>う歯</div>
                    <div className='flex'>
                      <Radiobox
                        id = {'caries_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'caries')}
                        checked={this.state.caries == 0 ? true : false}
                        name={`toothlet`}
                      />
                      <Radiobox
                        id = {'caries_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'caries')}
                        checked={this.state.caries == 1 ? true : false}
                        name={`toothlet`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='blog-title'>体格や代謝の状態</div>
              
              <div className='one-row' style={{width:'85%'}}>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>体重</div>
                    <NumericInputWithUnitLabel
                      label={''}
                      unit={'kg'}                    
                      max={9999}
                      min = {0}
                      precision={2}
                      step={0.01}
                      className="form-control"
                      value={this.state.weight}
                      getInputText={this.getInputNumber.bind(this, "weight")}
                      inputmode="numeric"
                    />
                  </div>
                </div>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>身長</div>
                    <NumericInputWithUnitLabel
                      label={''}
                      unit={'cm'}                    
                      max={9999}
                      min = {0}
                      precision={2}
                      step={0.01}
                      className="form-control"
                      value={this.state.height}
                      getInputText={this.getInputNumber.bind(this, "height")}
                      inputmode="numeric"
                    />
                  </div>
                </div>
                <div className='checkbox-blog'>
                  <div className='border-block'>
                    <div className='title-label'>体重の増加または減少</div>
                    <div className='flex weight'>
                      <Radiobox
                        id = {'weight_increase'}
                        label={'増加'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'weight_change')}
                        checked={this.state.weight_change == 0 ? true : false}
                        name={`weight`}
                      />
                      <Radiobox
                        id = {'weight_decrease'}
                        label={'減少'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'weight_change')}
                        checked={this.state.weight_change == 1 ? true : false}
                        name={`weight`}
                      />
                      <div className='no-unit-numeric'>                        
                        <input value= {this.state.weight_change_period} onChange = {this.getInputText.bind(this, 'weight_change_period')}/>
                      </div>
                      <label className='num-label'>ごろから</label>
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'kg'}                      
                        max={9999}
                        min = {0}
                        precision={2}
                        step={0.01}
                        className="form-control"
                        value={this.state.weight_change_kg}
                        getInputText={this.getInputNumber.bind(this, "weight_change_kg")}
                        inputmode="numeric"
                      />
                    </div>
                  </div>
                </div>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>体温</div>
                    <NumericInputWithUnitLabel
                      label={''}
                      unit={'℃'}                    
                      max={9999}
                      min = {0}
                      precision={1}
                      step={0.1}
                      className="form-control"
                      value={this.state.temperature}
                      getInputText={this.getInputNumber.bind(this, "temperature")}
                      inputmode="numeric"
                    />
                  </div>
                </div>
                <div className=''>
                  <div className='border-block'>
                    <div className='title-label'>平熱</div>
                    <NumericInputWithUnitLabel
                      label={''}
                      unit={'℃'}                    
                      max={9999}
                      min = {0}
                      precision={1}
                      step={0.1}
                      className="form-control"
                      value={this.state.normal_temperature}
                      getInputText={this.getInputNumber.bind(this, "normal_temperature")}
                      inputmode="numeric"
                    />
                  </div>
                </div>
              </div>
              
              <div className='one-row'>
                <div className='one-blog border-block'>
                  <div className='title-label'>顔色</div>                  
                  <div className='flex'>
                    <Checkbox
                      label={'普通'}                      
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.usually_color_flag}
                      name="usually_color_flag"
                    />
                    <Checkbox
                      label={'蒼白'}                      
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.pallor_flag}
                      name="pallor_flag"
                    />
                    <Checkbox
                      label={'紅潮'}                      
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.flush_flag}
                      name="flush_flag"
                    />
                    <Checkbox
                      label={'黄染'}
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.yellow_dyeing_flag}
                      name="yellow_dyeing_flag"
                    />                    
                  </div>
                  <div className='flex'>
                    <Checkbox
                      label={'その他'}                      
                      getRadio={this.selectCheckBox.bind(this)}
                      value = {this.state.other_complexion_flag}
                      name="other_complexion_flag"
                    />
                    <textarea disabled={this.state.other_complexion_flag != 1} onChange={this.getInputText.bind(this,'other_complexion')} value={this.state.other_complexion}></textarea>
                  </div>
                </div>
                <div className='one-blog'>                  
                  <div className='title-label'>皮膚の状態</div>
                  <textarea onChange={this.getInputText.bind(this,'skin')} value={this.state.skin}></textarea>
                </div>
              </div>

              <div className='other-area flex'>
                <div className='one-blog'>
                  <div className='title-label'>その他</div>                  
                  <textarea style={{width:'100%'}} onChange={this.getInputText.bind(this,'other')} value={this.state.other}></textarea>
                </div>
                <div className='one-blog'>                  
                  <div className='title-label'>要約</div>                  
                  <textarea onChange={this.getInputText.bind(this,'summary')} value={this.state.summary}></textarea>
                </div>
              </div>
          </Wrapper>
        );
    }
}

NutrityManage.contextType = Context;

NutrityManage.propTypes = {    
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,    
  cache_index:PropTypes.number,
  detailedPatientInfo : PropTypes.object,
  general_data:PropTypes.object,
  handleGeneralOk:PropTypes.func,
};

export default NutrityManage;
