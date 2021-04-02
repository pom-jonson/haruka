import React from "react";
import styled from "styled-components";
import Card from "../../atoms/Card";
import PropTypes from "prop-types";
import DatePicker, { registerLocale } from "react-datepicker";
import * as methods from "./methods";
import Context from "../../../helpers/configureStore";
import ja from "date-fns/locale/ja";
import Checkbox from "../../molecules/Checkbox";
import Button from "../../atoms/Button";
import MedicineDetailModal from "../../organisms/MedicineDetailModal";
import * as apiClient from "~/api/apiClient";
import auth from "~/api/auth";
import {setDateColorClassName} from "~/helpers/dialConstants";

registerLocale("ja", ja);

const Wrapper = styled.div`
  height: 100vh;
  .title {
    padding-top: 62px;
    font-size: 28px;
    margin-left: 10%;
  }
  .med-name {
    margin-left: 10%;
    width: 42%;
    display: inline;
    float: left;

  }
  .gene-name {
    width: 44%;
    display: inline;
    padding-right: 10%;
    text-align: right;
    float: right;
  }
  .yj-code {
    float: left;
    margin-right: 60px;
    margin-left: 10%;
  }
  .date-input {
    width: 100%;
  }
`;

const Label = styled.div`
  font-size: 18px !important;
  // width: 100%;
  margin-right: 10px;
  float: left;
  margin-top: 0px;
  padding-bottom: 10px;
`;

const CenterBox = styled.div`
  position: relative;
  overflow-y: auto;
  max-height: 70vh;
  min-height: 60vh;
  top: 2%;
  margin-left: 10%;
  margin-right: 10%;
  ${Card} {
    width: 100%;
  }
  .react-datepicker-wrapper{
    width: 220px;
  }
  .react-datepicker__input-container{
    width: 100px;
  }
  .unit-array{
    width: 100%;
    display: flex;
  span {
    margin-left: 25px;
    margin-right: 25px;
  }
  }
  .unit-label {
    margin-top: 20px;
    margin-left: -82px;
  }
  
  .date-span {
    font-size: 14px !important; 
    margin-left: -9%;
    margin-right: 25px;
  }
  
  .add-unit-btn {
    margin-top: 10px;
    width: 130px;
  }
  .del-btn {
    width: 130px;
    height: 35px;
  }
  .detail-btn{
  }
  .confirm-btn {
    float: right;
  }
  .round-up{
    font-size: 14px !important; 
    .radio {
      display: inline;
      margin-left: 5px;
    }
    span {
      margin-right: 10px; 
    }
  }
`;

const InputBox = styled.div`
  display: flex;
  margin-left: 10px;
  float: left;

  label {
    font-size: 12px;
    line-height: 38px;
    letter-spacing: 0.4px;
    margin-right: 8px;
  
  }

  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    font-size: 12px;
    padding: 0 8px;
    width: 120px;
    height: 38px;
    float: left;
  }
  .unit-name {
    width: 260px;
  }
  .unit-value {
    margin-left: 20px;
  }

`;


class Medicine extends React.Component {

  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      haruka: [],
      rece: [],
      japic: [],
      start_date: "",
      end_date: "",
      unit_conversion_array: [],
      is_round_up: 0
    }
  }

  async componentDidMount() {
    let data = await this.getMedicineInfo();
    let params = {type: "haruka", codes: parseInt(data.haruka.haruka_code)};
    let medDetail = await apiClient.get("/app/api/v2/reference/medicines", {
      params: params
    }); 
    
    this.setState({
      haruka: data.haruka,
      rece: data.rece,
      japic: data.japic,
      start_date: data.haruka.start_date,
      end_date: data.haruka.end_date,
      unit_conversion_array: data.haruka.unit_conversion_array,
      is_round_up: data.haruka.is_round_up,
      medDetail : medDetail[data.haruka.haruka_code] !== undefined ? medDetail[data.haruka.haruka_code] : [],
    });
    if (this.state.unit_conversion_array.length === 0) {
      let blank_array = [];
      this.addUnit(blank_array);
    }
      auth.refreshAuth(location.pathname+location.hash);

  }

  isValidate = () => {
    const {unit_conversion_array} = this.state;
    let result = unit_conversion_array.filter( item => {
      return !(item.name === "" && item.value === "");
    });
    return result;
  }

  getRadio = (index, name, value ) => {
    if (name=="checkBox"){
    const unit_array = this.state.unit_conversion_array
    unit_array[index].is_disabled = value;
    this.setState({
      unit_conversion_array: unit_array
      });
  }
  }

  handleRadioChane = (e) =>{
    this.setState({is_round_up: parseInt(e.target.value)});
  }

  handleNameChange = (index, e) => {
    const unit_array = this.state.unit_conversion_array
    unit_array[index].name = e.target.value;
    this.setState({
      unit_conversion_array: unit_array
    })
  }

  handleValueChange = (index, e) => {
    const unit_array = this.state.unit_conversion_array
    unit_array[index].value = e.target.value;
    this.setState({
      unit_conversion_array: unit_array
    })
  }

  addUnit = unit_array => {
    const item = {
      name: "",
      value: "",
      is_disabled: 0
    }
    unit_array.push(item);
    this.setState({
      unit_conversion_array: unit_array
    });
  }

  getDetail = () => {
    this.setState({
      isMedicineBodyPartOpen: true
    });
  }

  handleUsageMedDetailCancel = () => {
    this.setState({
      isMedicineBodyPartOpen: false
    });
  }

  handleConfirm = () => {
      this.saveInfo();
  }
  
  async saveInfo () {
    await this.updateMedicineInfo();
  }

  handleStartDateChange = value => {
    this.setState({
      start_date: value
    })
  }

  handleEndDateChange = value => {
    this.setState({
      end_date: value
    })
  }

  delUnit = index => {
    const delItem = this.state.unit_conversion_array;
    if (delItem.length == 1 ) return;
    delItem.splice(index, 1);
    this.setState({
      unit_conversion_array: delItem
    })
  }
  
  render() {
    const {haruka, rece, japic } = this.state;
    const detailShow = japic !== undefined  && japic !== null && 
      japic.T02_TENPU_ID !== undefined && japic.T02_TENPU_S_NM !== undefined
      && japic.T02_TENPU_ID.length > 0 && japic.T02_TENPU_S_NM.length > 0 
      ? true : false;
     let  content = this.state.unit_conversion_array.map((item, index)=>{
        return (
          <>
          <div className="unit-array">
            <InputBox>
              <label>1</label>
              <input type="text"
                onChange={this.handleNameChange.bind(this,index)}
                className="unit-name"
                placeholder="単位の名前"
                value={item.name}
                autoFocus
              />               
            </InputBox>
            <InputBox>
              <label>=</label>
              <input type="text"
                onChange={this.handleValueChange.bind(this, index)}
                className="unit-value"
                placeholder="倍率"
                value={item.value}
              />               
            </InputBox>
            <span>{rece.main_unit}</span>
            {item.name !== undefined && item.name !== null && item.name.length > 0 ? (
              <Checkbox
              label="削除 (候補から非表示)"
              getRadio={this.getRadio.bind(this, index)}
              name="checkBox"
              value={item.is_disabled}
              />
            ) : (
              <Button type="mono" className="del-btn" onClick={() => this.delUnit(index)}>削除</Button>
            )}
            </div>
          </>
        )
      });
    
    return (
      <Wrapper>
        <div className="title">薬剤マスタ管理</div>
        <div className="med-name">{rece.name}</div>
        { rece.gene_name !== undefined && rece.gene_name !== null && rece.gene_name.length > 0 ? (
          <div className="gene-name">{rece.gene_name}</div>
        ) : (
          <div className="gene-name">（一般名登録なし）</div>
        )}
        <br />
        <div className="yj-code">YJコード：{rece.yj_code !== undefined && rece.yj_code.length > 0 ? rece.yj_code : "登録なし"}</div>
        <div className="hot-cd">HOTコード：{rece.hot_cd !== undefined && rece.hot_cd.length > 0 ? rece.hot_cd : "登録なし"}</div>
        <CenterBox>
          <div className="">
            <Card className={`p-5 m-auto`}>          
            <div>      
            <Label>適用期間</Label>
            <div className="">
              <DatePicker
                locale="ja"
                selected={this.state.start_date}
                onChange={this.handleStartDateChange}
                dateFormat="yyyy/MM/dd"
                placeholderText="年/月/日"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="date-input"
                dayClassName = {date => setDateColorClassName(date)}
              />
              <span className="date-span">から</span>
              <DatePicker
                locale="ja"
                selected={this.state.end_date}
                onChange={this.handleEndDateChange}
                dateFormat="yyyy/MM/dd"
                placeholderText="年/月/日"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="date-input"
                dayClassName = {date => setDateColorClassName(date)}
              />
              <span className="date-span">まで使用可能</span>
            </div>
            </div>
            <div>
            <Label className="unit-label">単位候補管理</Label>
            <div className="">
            {content}
            </div>
            <Button type="mono" className="add-unit-btn" onClick={() => this.addUnit(haruka.unit_conversion_array)}>変換単位を追加</Button>
            </div>
            <br />
            <div className="round-up">
              <span>注射薬残量廃棄</span>
              <div className="radio">
                <label>
                  <input type="radio" name="round" value="0" checked={this.state.is_round_up == 0} onChange={this.handleRadioChane.bind(this)}/>
                  なし/
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" name="round" value="1" checked={this.state.is_round_up == 1} onChange={this.handleRadioChane.bind(this)} />
                  あり（レセプト送信値のみ端数を切り上げます）
                </label>
              </div>
            </div>
            <div className="">
            {detailShow && (<Button type="mono" className="detail-btn" onClick={this.getDetail}>詳細を表示</Button> )}
            <Button className="confirm-btn" onClick={this.handleConfirm}>保存</Button>
            </div>
            </Card>
          </div>
        </CenterBox>
        {this.state.isMedicineBodyPartOpen ? (
            <MedicineDetailModal
            hideModal={this.handleUsageMedDetailCancel}
            handleCancel={this.handleUsageMedDetailCancel}
            medicineDetailList={[this.state.medDetail]}
          />
        ) : (
            ""
          )}
      </Wrapper>
    );
  }
}
Medicine.contextType = Context;

Medicine.propTypes = {
  match: PropTypes.object
};

export default Medicine;