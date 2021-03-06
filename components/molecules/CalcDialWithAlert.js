import React, { Component } from "react";
// import Select from "react-select";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import nth from "lodash/nth";
import Button from "../atoms/Button";
// import CalcPart from "../molecules/CalcPart";
// import CalcNav from "../organisms/CalcNav";
import { KEY_CODES, CACHE_LOCALNAMES } from "../../helpers/constants";
import * as cacheApi from  "../../helpers/cacheLocal-utils";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
const UNITS = {
  PACKS: "包",
  CAPS: "錠"
};

const OPERATORS = [[".", "."], ["+/-", "-"]];

const KEYS = [
  ["7", "7"],
  ["8", "8"],
  ["9", "9"],
  ["4", "4"],
  ["5", "5"],
  ["6", "6"],
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["0", "0"],
  ...OPERATORS
];

const UNEVEN_OPTIONS = [
  { label: "選択", value: "" },
  { label: "起床時", value: "起床時" },
  { label: "朝食後", value: "朝食後" },
  { label: "昼食前", value: "昼食前" },
  { label: "昼食後", value: "昼食後" },
  { label: "夕食前", value: "夕食前" },
  { label: "夕食後", value: "夕食後" },
  { label: "寝る前", value: "寝る前" }
];

const DisplayWrap = styled.div`
  background: ${colors.background};
  border-radius: 4px 4px 0 0;
  color: ${colors.onSurface};
  font-size: 16px;
  font-weight: 500;
  grid-column: 1 / span 3;
  -ms-grid-column: 1;
  -ms-grid-row: 1;
  -ms-grid-column-span: 3;
  grid-row: 1;
  text-align: right !important;
  width: 100%;
  padding: 0 4px;
`;

const Display = ({ formula, class_name }) => (
  <DisplayWrap className={class_name}>{formula}</DisplayWrap>
);
Display.propTypes = {
  formula: PropTypes.string,
  unit: PropTypes.string,
  class_name: PropTypes.string
};

const UnevenContainer = styled.div`
  display: flex;
  flex-wrap: no-wrap;

  &.move-top {
    margin-top: -45px;
  }
`;

const UnitBoxTop = styled.div`
  border: 1px solid ${colors.midEmphasis};
  box-sizing: border-box;
  width: 300px;
  margin: 10px auto;
  padding: 10px 15px;
  text-align: center;
  display: flex;
  flex-wrap: nowrap;
  position: relative;

  .label {
    flex: 1;
    margin-bottom: 0px;
  }

  ol {
    border: 1px solid ${colors.midEmphasis};
    box-sizing: border-box;
    width: 100%;
    font-size: 12px;
    padding: 0;
    flex: 1;
    margin-bottom: 0px;

    li {
      display: block;
    }

    li.selected {
      background: black;
      color: white;
    }
  }
`;
const CalcBox = styled.div`
  background-color: ${colors.surface};
  border: 1px solid #ced4da;
  border-color: #6e6d6d;
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  outline: none;

  .btn-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    button {
      width: 80px;
      height: 30px;
      min-width: 80px;
      line-height: 28px;
      padding: 0;
      margin-right: 15px;
    }

    .red {
      color: #ff0000;
    }
  }

  .new-btn{
    button{
      height: 38px;
      margin-right: 0px;    
      span{
        font-size: 1rem;
      }  
    }
    button:first-child{
      width: 120px;            
    }
  }

  .align-center {
    text-align: center;
    width: 100%;
  }
`;

const Wrap = styled.div`
  display: -ms-grid;
  display: grid;
  grid-template-rows: 50px 50px 50px 50px 50px;
  -ms-grid-rows: 50px 50px 50px 50px 50px;
  grid-template-columns: 50px 50px 50px 50px;
  -ms-grid-columns: 50px 50px 50px 50px;
  margin: auto;
  width: 200px;

  > * {
    background-color: ${colors.surface};
    border-top: 1px solid ${colors.midEmphasis};
    border-left: 1px solid ${colors.midEmphasis};
    box-shadow: 1px 1px ${colors.midEmphasis};
    box-sizing: border-box;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    line-height: 50px;
    height: 50px;
  }

  > p {
    grid-row: 1;
    -ms-grid-row: 1;
    grid-column: 4;
    -ms-grid-column: 4;
    border-top: 0px;
    box-shadow: none;
    text-align: left;
    padding-left: 5px;
  }

  > div:nth-child(12) {
    grid-column: 1 / span 1;
    -ms-grid-column: 1;
    -ms-grid-row: 5;
    -ms-grid-column-span: 1;
  }
  > div:nth-child(13) {
    -ms-grid-column: 2;
    -ms-grid-row: 5;
  }
  > div:nth-child(14) {
    -ms-grid-column: 3;
    -ms-grid-row: 5;
  }
  > div:nth-child(15) {
    -ms-grid-column: 4;
    -ms-grid-row: 5;
  }

  > div:nth-child(3) {
    grid-row: 2;
    -ms-grid-column: 1;
    -ms-grid-row: 2;
  }
  > div:nth-child(4) {
    grid-row: 2;
    -ms-grid-column: 2;
    -ms-grid-row: 2;
  }
  > div:nth-child(5) {
    grid-row: 2;
    -ms-grid-column: 3;
    -ms-grid-row: 2;
  }

  > div:nth-child(6) {
    grid-row: 3;
    -ms-grid-column: 1;
    -ms-grid-row: 3;
  }
  > div:nth-child(7) {
    grid-row: 3;
    -ms-grid-column: 2;
    -ms-grid-row: 3;
  }
  > div:nth-child(8) {
    grid-row: 3;
    -ms-grid-column: 3;
    -ms-grid-row: 3;
  }

  > div:nth-child(9) {
    grid-row: 4;
    -ms-grid-column: 1;
    -ms-grid-row: 4;
  }
  > div:nth-child(10) {
    grid-row: 4;
    -ms-grid-column: 2;
    -ms-grid-row: 4;
  }
  > div:nth-child(11) {
    grid-row: 4;
    -ms-grid-column: 3;
    -ms-grid-row: 4;
  }

  > *:hover {
    background-color: ${colors.background};
  }
  p:hover {
    background-color: white;
  }
  .hide {
    visibility: hidden;
  }
`;

const Key = ({ children, onClick }) => <div onClick={onClick}>{children}</div>;
Key.propTypes = {
  children: PropTypes.string,
  onClick: PropTypes.func
};

const EvalKey = ({ children, onClick }) => (
  <div onClick={onClick}>{children}</div>
);
EvalKey.propTypes = {
  children: PropTypes.string,
  onClick: PropTypes.func
};

const ClearKey = ({ children, onClick }) => (
  <div onClick={onClick}>{children}</div>
);
ClearKey.propTypes = {
  children: PropTypes.string,
  onClick: PropTypes.func
};
// class 
class CalcDialWithAlert extends Component {

  initialState = {
    formula: this.props.calcFormula == "not_decimal" ? "0.00" : "0",
    unit: UNITS.CAPS,
    unitIndex: 0,
    tabIndex: 1,
    splitNum: 0,
    splitNumbers: [],
    usageName: "",
    usageComment: "",
    usageData: [],
    realUsageData: [],
    partUsageData: [],
    partUsageItem: {
      usageName: "",
      usageComment: "",
      usage_optional_num: null,
      poultice_times_one_day: null,
      days: null
    },
    selectedIndex: 0,
    unevenSelectedIndex: 0,
    alert_messages: "",
    unevenValues: [
      {
        label: UNEVEN_OPTIONS[0].label,
        value: this.props.calcFormula == "not_decimal" ? "0.00" : "0"
      }
    ]
  };


  start_flg = 0;
  start_cache = 0;
  select_input_flag = 0;
  constructor(props) {
    super(props);
    this.updateFormula = this.updateFormula.bind(this);
    this.clear = this.clear.bind(this);
    this.addMinus = this.addMinus.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.selectInOut = this.selectInOut.bind(this);
    this.setSplitNum = this.setSplitNum.bind(this);
    this.confirmSplitNum = this.confirmSplitNum.bind(this);
    this.onChangeUsageName = this.onChangeUsageName.bind(this);
    this.setDetailNum = this.setDetailNum.bind(this);
    this.confirmDetailNum = this.confirmDetailNum.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.calcConfirm = this.calcConfirm.bind(this);
    this.onInputKeyPressed = this.onInputKeyPressed.bind(this);
    this.unevenSelects = [];
    this.unevenInputs = [];
    this.select_input_flag = 0;
    
    var cache_formula = cacheApi.getObject(CACHE_LOCALNAMES.CALC);
    if(cache_formula != null) {
      this.state = cache_formula
    } else {
      this.state = this.initialState;
    }
  }

  async componentDidMount() {

    document.getElementById("calc_dlg").focus();
    let _state = {};    
    if (this.props.calcInitData) {      
      _state.formula = this.props.calcInitData;      
    }
    if (this.props.calcInitData == "0.0") {      
      _state.formula = this.props.calcInitData;
    }    
    if (this.props.decimalPointDigits != undefined && this.props.decimalPointDigits != null && this.props.decimalPointDigits != 0) {
      _state.decimal_point_digits = this.props.decimalPointDigits;
    }    
    this.setState(_state);
  }

  calcCancel = () => {
    window.localStorage.removeItem(CACHE_LOCALNAMES.CALC);
    this.props.calcCancel();
  };

  calcConfirm = (keypressed = false) => {
      let formula = this.state.formula;
      let formula_length = formula.length;      
      let last_letter = formula.substring(formula_length - 1, formula_length);
      if (last_letter == ".") {
        this.showAlertMessage();
        return;
      }      
      this.props.calcConfirm(
        this.state.formula, keypressed
      );
  };

  opsVal = OPERATORS.map(([_key, val]) => val);  
  _firstIsNotZero = letters => nth(letters, 0) !== "0";
  _firstIsNotOperator = letters => !this.opsVal.includes(nth(letters, 0));
  _isDecimal = () => !(this.props.daysSelect);

  isValidFormula = letters =>
    this._firstIsNotZero(letters) &&
    this._firstIsNotOperator(letters);

  updateFormula = input => {
    let decimal_point = this._isDecimal();
    if(input === "-" && !this.props.minus_type) return;
    if(input === "." && decimal_point === false) return;
    if(input ==="." && this.state.formula.includes(".") ) return;   
    
    if (parseInt(parseFloat(this.state.formula) * 1000) === 0 ) {
      if (input == '-') {
        return;
      }

      let fnext = `${this.state.formula}${input}`;

      if(!decimal_point) {
        if(input === "0") return;
      }
      else {
        if(this.start_flg === 1 ) {
          let fvalues = fnext.split(".");
          if (fvalues[0].length > 4) return;
          if (fvalues[1] !== undefined && fvalues[1].length > 4) return;  
          if (fvalues[1] !== undefined && fvalues[1].length > 3) {
            if(input === "0") return;
          }
    
          if(parseFloat(fnext) === 0 && fvalues[1] === undefined)
            input = "0";
          else if(input === ".") {
            input = fnext;
          }
          else if(fnext.includes(".")) {
            input = fnext;
            
          } else {
            input = parseFloat(fnext).toString();
          }
            
          }
      }
      if(input === ".") return;
      this.start_flg = 1;
      
      this.setState({ formula: input }, () => {});
      return;
    }

    let next = '';
    if (input != '-') {
      next = `${this.state.formula}${input}`;
    } else {
      if (this.state.formula != '' && this.state.formula.trim() != '' && this.state.formula.includes("-")) {
        next = this.state.formula.substring(1, this.state.formula.length);
      } else {
        next = `${input}${this.state.formula.toString()}`;
      }
    }
    
    if (this.start_flg === 0) {
      next = `${input}`;
      this.start_flg = 1;
    }    
    if (this.props.daysSelect) {      
      if (parseInt(next) > this.props.maxAmount) return;
    } else {
      if (parseFloat(next) > this.props.maxAmount) return;
    } 
    let values = next.split(".");
    let decimal_point_digits = 4;
    if (this.state.decimal_point_digits != undefined && this.state.decimal_point_digits != null) {
      decimal_point_digits = this.state.decimal_point_digits;
    }
    
    if (values[1] !== undefined && values[1].length > decimal_point_digits) return;  

    if (this.props.numberDigits != null && this.props.numberDigits != undefined && this.props.numberDigits != 0) {
      if (next.length >= this.state.formula.length && this.state.formula.length >= this.props.numberDigits) return;
    }
    this.setState({ formula: next }, () => {});
  };

  evalFormula = formula => {
    const rounded = Math.round(eval(formula) * 10000) / 10000;
    return rounded.toString();
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    var cache_formula = cacheApi.getObject(CACHE_LOCALNAMES.CALC);
    if(cache_formula != null ) {
      this.setState(cache_formula, function(){
        this.start = 1;
      });
      return;
    }
  if (nextProps.daysInitial !== this.state.formula) {
      this.setState({ formula: nextProps.daysInitial });
    }
  }

  calculate = () =>
    this.setState(({ formula, ...s }) => ({
      ...s,
      formula: this.evalFormula(formula)
    }));

  clear = () => {
    this.start_flg = 0;
    this.setState(this.initialState);
    document.getElementById("calc_dlg").focus();
  };
  addMinus = () => {
    this.updateFormula("-")
  };

  selectInOut = e => {
    this.setState({ tabIndex: parseInt(e.target.id), unevenSelectedIndex: 0 });
  };

  onKeyPressed(e) {
    const { tabIndex } = this.state;
    if (e.target === e.currentTarget) {
      const { units } = this.props;
      const { unitIndex, formula } = this.state;
      if (e.keyCode > 47 && e.keyCode < 58 && tabIndex !== 3) {
        /// 0 ~ 9
        this.updateFormula(e.keyCode - 48 + "");
      } else if (e.keyCode > 95 && e.keyCode < 106 && tabIndex !== 3) {
        /// 0 ~ 9
        this.updateFormula(e.keyCode - 96 + "");
      } else if (e.keyCode === KEY_CODES.period && tabIndex !== 3) {
        /// .
        this.updateFormula(".");
      }else if (e.keyCode === KEY_CODES.period_ten && tabIndex !== 3) {
        /// .
        this.updateFormula(".");
      } else if (e.keyCode === KEY_CODES.enter && tabIndex != 3) {
        /// enter
        this.calcConfirm(true);
        e.stopPropagation();
        e.preventDefault();
      } else if (e.keyCode === KEY_CODES.esc && tabIndex !== 3) {
        /// escape
      } else if (e.keyCode === KEY_CODES.backspace && tabIndex !== 3) {
        if (parseInt(parseFloat(formula) * 1000) === 0 && !formula.includes(".")) return;      
        /// backspace
        this.setState({ formula: formula.substring(0, formula.length - 1) });
      } else if (e.keyCode === KEY_CODES.del && tabIndex !== 3) {
        if (parseInt(parseFloat(formula) * 1000) === 0) return;
        /// delete
        this.setState({ formula: formula.substring(0, formula.length - 1) });
      } else if (e.keyCode === KEY_CODES.down && units.length > 0) {
        /// bottom
        this.setState({
          unitIndex: unitIndex == units.length - 1 ? 0 : unitIndex + 1
        });
      } else if (e.keyCode === KEY_CODES.up && units.length > 0) {
        /// up
        this.setState({
          unitIndex: unitIndex == 0 ? units.length - 1 : unitIndex - 1
        });
      } else if (e.keyCode === KEY_CODES.left) {
        this.setState({ tabIndex: tabIndex == 1 ? 2 : 1 }, () => {
          if (this.state.tabIndex == 1) {
            document.getElementById("calc_dlg").focus();
          }
        });
      } else if (e.keyCode === KEY_CODES.right) {
        this.setState({ tabIndex: tabIndex == 2 ? 1 : 2 }, () => {
          if (this.state.tabIndex == 1) {
            document.getElementById("calc_dlg").focus();
          }
        });
      }
    }
  }

  onInputKeyPressed(e) {
    if (e.keyCode === null) {
      this.onKeyPressed(e);
    }
  }

  setSplitNum = e => {
    this.setState({ splitNum: parseInt(e.target.value) });
  };

  confirmSplitNum = e => {
    const { splitNum } = this.state;
    if (e.key === "Enter" && splitNum > 0 && splitNum < 6) {
      let splitNumbers = [];
      for (var i = 1; i <= splitNum; i++) {
        splitNumbers.push({
          id: i,
          value: null
        });
      }
      const usageData = [];
      switch (splitNum) {
        case 1:
          this.state.usageData.internal.times_1.map(usage => {
            usageData.push({ label: usage.name, value: usage.name });
          });
          break;
        case 2:
          this.state.usageData.internal.times_2.map(usage => {
            usageData.push({ label: usage.name, value: usage.name });
          });
          break;
        case 3:
          this.state.usageData.internal.times_3.map(usage => {
            usageData.push({ label: usage.name, value: usage.name });
          });
          break;
        case 4:
          this.state.usageData.internal.times_3.map(usage => {
            usageData.push({ label: usage.name, value: usage.name });
          });
          break;
        case 5:
          this.state.usageData.internal.times_3.map(usage => {
            usageData.push({ label: usage.name, value: usage.name });
          });
          break;
      }
      this.setState({
        splitNumbers: splitNumbers,
        realUsageData: usageData,
        selectedIndex: 1
      });
    }
  };

  setDetailNum = e => {
    const splitNumbers = this.state.splitNumbers;
    splitNumbers[parseInt(e.target.name, 10)].value = e.target.value;
    this.setState({ splitNumbers: splitNumbers });
  };

  confirmDetailNum = e => {
    if (e.key == "Enter") {
      this.setState({ selectedIndex: parseInt(e.target.name) + 3 }, () => {});
    }
  };

  onInputChange = e => {

    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeUsageName = e => {
    let unevenValues = this.state.unevenValues;

    if (this.state.unevenSelectedIndex >= 0) {
      unevenValues[this.state.unevenSelectedIndex].label = e.value;
    }
    if (this.state.unevenSelectedIndex === this.state.unevenValues.length - 1) {
      unevenValues.push({
        label: UNEVEN_OPTIONS[0].label,
        value: "0"
      });
    }
    this.setState({
      unevenValues,
      formula:
        "" + this.state.unevenValues[this.state.unevenSelectedIndex].value
    });
    this.unevenInputs[this.state.unevenSelectedIndex].focus();
  };

  onFocusUsageName = index => {
    this.select_input_flag = 1;
    this.setState({
      unevenSelectedIndex: index
    });
  };

  onFocusUsageInput = index => {
    this.setState({
      unevenSelectedIndex: index,
      formula: "" + this.state.unevenValues[index].value
    });
  };

  handleKeywordsChange = function(index, event) {
    if( event.keyCode === undefined ) {
      let values = [];
      if (event.target.value.match('｡')) {
        values = event.target.value.split('｡');
      } else if(event.target.value.match('．')) {
        values = event.target.value.split('．');
      } else {
        values = event.target.value.split('.')
      }

      if (values[0].length <= 4 && ((values[1] === undefined) || (values[1] !== undefined && values[1].length <= 4))) {
        let unevenValues = this.state.unevenValues;
        unevenValues[index].value = event.target.value;
        this.setState({
          formula: unevenValues[index].value,
          unevenValues
        });
      }
    }
  };    

  onChageUsagePart = item => {
    this.setState({ partUsageItem: item, formula: item.amount + "" });
  };

  showDaysLabel = label => {
    let str = [];
    if (label.includes("ＸＸ")) {
      let strings = label.split("ＸＸ");
      str.push({
        value: strings[0],
        class_name: ""
      })
      str.push({
        value: "ＸＸ",
        class_name: "red"
      })
      strings.map((item, index) => {
        if (index == 1) {
          str.push({
            value: item,
            class_name: ""
          })
        }
        if (index > 1) {
          str.push({
            value: "ＸＸ",
            class_name: ""
          })
          str.push({
            value: item,
            class_name: ""
          })
        }
      })
    } else {
      str.push({
        value: label,
        class_name: ""
      })
    }
    return str;
  }

  changeUnit = index => {
    this.setState({ unitIndex: index });
  };

  setFocus = () => {
    if( this.select_input_flag !== undefined && this.select_input_flag === 1) {
      this.select_input_flag = 0;
      return;
    }
    document.getElementById("calc_dlg").focus();
  }

  showAlertMessage = () => {
    this.setState({
      alert_messages: "数値を正確に入力してください。"
    });
  }

  closeModal = () => {
    this.setState({
      alert_messages: ""
    })
  }
  onHide = () => {
    this.setFocus();
  };

  render() {
    const { units } = this.props;
    return (
      <>
        <Modal
          show={true}
          className="calc-dial-modal"
          onClick={this.setFocus}
          onHide={this.onHide}
        >
        <Modal.Body>
          <CalcBox
            onKeyDown={this.onKeyPressed}
            className="content"
            tabIndex="0"
            onClick={this.setFocus}
            id="calc_dlg"
          > 
          {this.props.calcTitle != null && this.props.calcTitle != undefined && this.props.calcTitle != "" && (
            <UnitBoxTop>
              <p className="label">{this.props.calcTitle}</p>                
            </UnitBoxTop>
          )}                             
            <UnevenContainer>              
              <Wrap> 
                <Display
                  formula={this.state.formula}
                  unit={this.state.unit}
                  class_name=""
                />           
                <p style={{width:"5rem"}}>
                  {units}
                </p>
                {KEYS.map(([key, value]) => (
                  <Key
                    key={key}
                    value={value}
                    onClick={() => this.updateFormula(value)}
                  >
                    {key}
                  </Key>
                ))}
                <ClearKey onClick={this.clear}>C</ClearKey>
              </Wrap>
            </UnevenContainer>
                      
            <div className="btn-box footer-buttons new-btn">
              <Button className="cancel-btn" onClick={this.calcCancel}>
                キャンセル
              </Button>
              <Button className="red-btn" onClick={this.calcConfirm} id="confirm_btn">確定</Button>
            </div>
            {this.state.alert_messages !== "" && (
                <SystemAlertModal
                    hideModal= {this.closeModal.bind(this)}
                    handleOk= {this.closeModal.bind(this)}
                    showMedicineContent= {this.state.alert_messages}
                />
            )}
          </CalcBox>
        </Modal.Body>
      </Modal>
      </>
    );
  }
}

CalcDialWithAlert.propTypes = {
  calcConfirm: PropTypes.func,
  calcCancel: PropTypes.func,
  units: PropTypes.array,
  daysSelect: PropTypes.bool,
  daysLabel: PropTypes.string,
  daysSuffix: PropTypes.string,
  calcTitle: PropTypes.string,
  daysInitial: PropTypes.number,
  maxAmount: PropTypes.number,
  calcInitData: PropTypes.number,
  usageData: PropTypes.array,
  bodyPartData: PropTypes.array,
  showedPresData: PropTypes.object,
  calcFormula: PropTypes.string,
  numberDigits: PropTypes.number,
  decimalPointDigits: PropTypes.number,
  needAlertMessage: PropTypes.bool,
  minus_type: PropTypes.bool,
};

export default CalcDialWithAlert;
