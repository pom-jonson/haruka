import React, { Component } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import nth from "lodash/nth";
// import Button from "../atoms/Button";
import CalcPart from "../molecules/CalcPart";
import { Modal } from "react-bootstrap";
import { KEY_CODES, CACHE_LOCALNAMES } from "../../helpers/constants";
import * as cacheApi from  "../../helpers/cacheLocal-utils";

const UNITS = {
  PACKS: "包",
  CAPS: "錠",
  PIPES: "筒"
};

const OPERATORS = [[".", "."]];

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

// const InputDiv = styled.div`
//   padding-top: 10px;
//   padding-bottom: 10px;

//   input {
//     margin-left: 7px;
//   }

//   input.name {
//     width: 200px;
//   }

//   .select-div {
//     display: inline-block;
//     width: 250px;
//     margin-left: 20px;
//   }
// `;

// const SplitArea = styled.div`
//   display: inline-block;
//   width 90px;

//   input {
//     width: 35px;
//     margin-left: 5px;
//   }
// `;

const UnevenContainer = styled.div`
  display: flex;
  flex-wrap: no-wrap;

  &.move-top {
    margin-top: -45px;
  }
`;

const UnitBox = styled.div`
  border: 1px solid ${colors.midEmphasis};
  box-sizing: border-box;
  width: 200px;
  margin: 10px auto;
  padding: 10px 15px;
  text-align: center;

  ol {
    border: 1px solid ${colors.midEmphasis};
    box-sizing: border-box;
    width: 100%;
    font-size: 12px;
    padding: 0;
    li {
      display: block;
    }

    li.selected {
      background: black;
      color: white;
    }
  }
`;

const UnitBoxTop = styled.div`
  border: 1px solid ${colors.midEmphasis};
  box-sizing: border-box;
  width: 400px;
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

const UnevenDiv = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  width: 300px;
  margin: 0 auto;
  padding: 10px;
  margin-top: 41px;

  .content {
    flex: 1;
    margin-right: 10px;

    .uneven {
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      margin-bottom: 5px;

      .select-div {
        width: 120px;
      }

      input {
        width: 100px;
        text-align: right;
        margin-left: 10px;
        margin-right: 10px;
        background: #eee;
        border: 1px solid #999;
        border-radius: 5px;
      }

      .unit {
        width: 60px;
        font-size: 13px;
        text-align: left;
        line-height: 38px;
      }
    }
  }
`;

const CalcBox = styled.div`
  background-color: ${colors.surface};
  border: 1px solid #ced4da;
  box-sizing: border-box;
  padding: 10px;
  width: 560px;
  outline: none;

  // position: absolute;
  z-index:1000;
  left: calc(50% - 359px);
  top: 15%;

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
  .cancel-btn {
    background: #ffffff;
    border: solid 2px #7e7e7e;
    span {
      color: #7e7e7e;
    }
  }
  .cancel-btn:hover {
    border: solid 2px #000000;
    background: #ffffff;
    span {
      color: #000000;
    }
  }
  .red-btn {
    background: #cc0000 !important;
    span {
      color: #ffffff !important;
    }
  }
  .red-btn:hover {
    background: #e81123 !important;
    span {
      color: #ffffff !important;
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
    grid-column: 1 / span 2;
    -ms-grid-column: 1;
    -ms-grid-row: 5;
    -ms-grid-column-span: 2;
  }
  > div:nth-child(13) {
    -ms-grid-column: 3;
    -ms-grid-row: 5;
  }
  > div:nth-child(14) {
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

  > div:hover {
    background-color: ${colors.background};
  }

  .hide {
    visibility: hidden;
  }
`;

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
  text-align: right;
  width: 100%;
  padding: 0 4px;
`;

const MedicineLabel = styled.div`
  width: 100%;
  text-align: center;
  font-size: 16px;
  border: 1px solid #000;
  padding: 5px;
  border-radius: 5px;
  margin-bottom:10px;
`;

const Display = ({ formula, class_name }) => (
  <DisplayWrap className={class_name}>{formula}</DisplayWrap>
);
Display.propTypes = {
  formula: PropTypes.string,
  unit: PropTypes.string,
  class_name: PropTypes.string
};

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

class InjectCalc extends Component {
  initialState = {
    formula: "0",
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
    unevenValues: [
      {
        label: UNEVEN_OPTIONS[0].label,
        value: "0.000"
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

    var cache_formula = cacheApi.getObject(CACHE_LOCALNAMES.CALC);
    this.start_cache = 1;
    if(cache_formula != null) {
      return;
    }

    let unitIndex = 0;
    let unevenValues = [
      {
        label: UNEVEN_OPTIONS[0].label,
        value: "0.000"
      }
    ];
    let formula = "0.000";

    if (
      this.props.showedPresData !== undefined &&
      this.props.showedPresData.usage !== undefined
    ) {
      if (
        this.props.units !== undefined &&
        this.props.units.length > 0 &&
        this.props.showedPresData.usage.unit !== undefined
      ) {
        this.props.units.map((item, index) => {
          if (item.name === this.props.showedPresData.usage.unit) {
            unitIndex = index;
          }
        });
      }
      if (this.props.showedPresData.usage.uneven_values !== undefined) {
        unevenValues = [
          ...this.props.showedPresData.usage.uneven_values,
          ...unevenValues
        ];
        if (this.props.showedPresData.usage.uneven_values.length === 0) {
          if (this.props.showedPresData.usage.amount !== undefined) {
            formula = "" + this.props.showedPresData.usage.amount;
          }
        }
      } else {
        if (this.props.showedPresData.usage.amount !== undefined) {
          formula = "" + this.props.showedPresData.usage.amount;
        }
      }
    }
    this.setState(
      { usageData: this.props.usageData, unitIndex, unevenValues, formula },
      () => {
        var partUsageData = [];
        if (this.state.usageData != undefined && this.state.usageData != null && this.state.usageData.length > 0) {
          this.state.usageData.map(usage => {
            partUsageData.push({
              label: usage.name,
              value: usage.name,
              usage: usage.code
            });
          });        
        }

        this.setState({ partUsageData: partUsageData });
      }
    );


    if(this.props.daysInitial !== undefined && this.props.daysInitial !== "0") {
      this.setState({formula: this.props.daysInitial});
    }


  }

  calcCancel = () => {
    window.localStorage.removeItem(CACHE_LOCALNAMES.CALC);
    this.props.calcCancel();
  };

  calcConfirm = (keypressed = false, item) => {
    // const { usageName, splitNumbers } = this.state;
    // var isNill = false;
    // splitNumbers.map(obj => {
    //   isNill = obj.value == null;
    // });

    // if (this.state.tabIndex == 2 && (usageName == "" || isNill)) {
    //   alert("数値を入力をしてください。");
    //   return;
    // }
    var unit = "";
    if (this.props.units.length > 0) {
      unit = this.props.units[this.state.unitIndex].name;
    }
    if (
      this.state.tabIndex != 2 &&
      ((parseFloat(this.state.formula)*10000/10000) <= 0 || this.state.formula === "")
    ) {
      if (this.props.zeroEnable){
        window.localStorage.removeItem(CACHE_LOCALNAMES.CALC);
        this.props.calcConfirm(
          0,
          unit,
          this.state.splitNumbers,
          this.state.usageName,
          this.state.usageComment,
          item == null ? this.state.partUsageItem : item,
          keypressed === true ? true : false
        );
        return;
      }
      window.sessionStorage.setItem("alert_messages", "数値を入力をしてください。");
      // alert("数値を入力をしてください。");
      return;
    }
    window.localStorage.removeItem(CACHE_LOCALNAMES.CALC);
    this.props.calcConfirm(
      this.state.formula,
      unit,
      this.state.splitNumbers,
      this.state.usageName,
      this.state.usageComment,
      item == null ? this.state.partUsageItem : item,
      keypressed === true ? true : false
    );
  };

  opsVal = OPERATORS.map(([_key, val]) => val);  
  _firstIsNotZero = letters => nth(letters, 0) !== "0";
  _firstIsNotOperator = letters => !this.opsVal.includes(nth(letters, 0));
  _isDecimal = () => !(!this.props.daysLabel.includes("ＸＸ") && this.props.daysSelect);
  // _operatorsIsNotContinuing = letters =>
  //   !(
  //     this.opsVal.includes(nth(letters, -1)) &&
  //     this.opsVal.includes(nth(letters, -2))
  //   );

  isValidFormula = letters =>
    this._firstIsNotZero(letters) &&
    this._firstIsNotOperator(letters);
    //this._operatorsIsNotContinuing(letters);  

  updateFormula = input => {

    let decimal_point = this._isDecimal();

    if(input === "." && decimal_point === false) return;
    if(input ==="." && this.state.formula.includes(".") ) return;
    if (
      parseInt(parseFloat(this.state.formula) * 1000) === 0 //&&
      // this.isValidFormula(input)
    ) {
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
      
      if (this.state.tabIndex === 2) {
        let unevenValues = this.state.unevenValues;
        unevenValues[this.state.unevenSelectedIndex].value = input;
        this.setState({
          formula: input,
          unevenValues
        });
      } else {
        //window.localStorage.setItem("haruka_calc_formula", input);
        this.setState({ formula: input }, () => {});
      }
      return;
    }


    let next = `${this.state.formula}${input}`;    
    if (this.start_flg === 0) {
      next = `${input}`;
      this.start_flg = 1;
    }    
    // if (!this.isValidFormula(next)) return;
    if (this.props.daysSelect) {
      if (parseInt(next) > 90) return;
    } 
    let values = next.split(".");
    if (values[0].length > 4) return;
    
    
    if (values[1] !== undefined && values[1].length > 4) return;  

    if (this.state.tabIndex === 2) {
      let unevenValues = this.state.unevenValues;
      unevenValues[this.state.unevenSelectedIndex].value = next;
      this.setState({
        formula: next,
        unevenValues
      });
    } else {
        //window.localStorage.setItem("haruka_calc_formula", next);
      
      this.setState({ formula: next }, () => {});
    }
  };

  /*updateFormula_ = input => {
    
    if (
      parseInt(parseFloat(this.state.formula) * 1000) === 0 &&
      this.isValidFormula(input)
    ) {
      
      if (this.state.tabIndex === 2) {
        let unevenValues = this.state.unevenValues;
        unevenValues[this.state.unevenSelectedIndex].value = input;
        this.setState({
          formula: input,
          unevenValues
        });
      } else {
        this.setState({ formula: input }, () => {});
      }
      return;
    }

    let next = `${this.state.formula}${input}`;

    if (this.start_flg === 0) {
        next = `${input}`;
        this.start_flg = 1;
    }

    if (!this.isValidFormula(next)) return;
    if (this.props.daysSelect) {
      if (parseInt(next) > 90) return;
    } else {
      let values = next.split(".");
      if (values[0].length > 4) return;
      if (values[1] !== undefined && values[1].length > 4) return;
    }

    if (this.state.tabIndex === 2) {
      let unevenValues = this.state.unevenValues;
      unevenValues[this.state.unevenSelectedIndex].value = next;
      this.setState({
        formula: next,
        unevenValues
      });
    } else {
      this.setState({ formula: next }, () => {});
    }
  };*/

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

    // var cache_formula = window.localStorage.getItem(CACHE_LOCALNAMES.CALC);
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
    if (this.state.tabIndex === 2) {
      let unevenValues = this.state.unevenValues;
      unevenValues[this.state.unevenSelectedIndex].value = "0.000";
      this.setState({
        formula: unevenValues[this.state.unevenSelectedIndex].value,
        unevenValues
      });
    } else {
      this.setState(this.initialState);
    }
    document.getElementById("calc_dlg").focus();
  };

  selectInOut = e => {
    this.setState({ tabIndex: parseInt(e.target.id), unevenSelectedIndex: 0 });
  };

  onKeyPressed(e) {
    const { tabIndex } = this.state;
    if (tabIndex === 2 && e.target.id.includes('react-select')) {
      if (e.keyCode === KEY_CODES.enter) {
        this.unevenInputs[this.state.unevenSelectedIndex].focus();
        e.stopPropagation();
        e.preventDefault();
        return;
      }
    }
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
      } else if (e.keyCode === KEY_CODES.period_ten && tabIndex !== 3) {
        /// .
        this.updateFormula(".");
      } else if (e.keyCode === KEY_CODES.enter && tabIndex != 3) {
        /// enter
        if (tabIndex === 2) {
          if (e.target.id === 'calc_dlg') {
            this.unevenSelects[this.state.unevenSelectedIndex].focus();
          } else if (e.target.id.includes('uneven_input')) {
            let nextIndex = this.state.unevenSelectedIndex + 1;
            if (nextIndex >= this.state.unevenValues.length) {
              document.getElementById('confirm_btn').focus();
            } else {
              this.unevenSelects[nextIndex].focus();
            }
          } else if (e.target.id === 'confirm_btn') {
            this.calcConfirm(true);
          }
        } else {
          this.calcConfirm(true);
        }
        e.stopPropagation();
        e.preventDefault();
      } else if (e.keyCode === KEY_CODES.esc && tabIndex !== 3) {
        /// escape
      } else if (e.keyCode === KEY_CODES.backspace && tabIndex !== 3) {
        if (parseInt(parseFloat(formula) * 1000) === 0 && !formula.includes(".")) return;      
        /// backspace
        if (tabIndex === 2) {
          let unevenValues = this.state.unevenValues;
          unevenValues[
            this.state.unevenSelectedIndex
          ].value = formula.substring(0, formula.length - 1);
          this.setState({
            formula: unevenValues[this.state.unevenSelectedIndex].value,
            unevenValues
          });
        } else {
          this.setState({ formula: formula.substring(0, formula.length - 1) });
        }
      } else if (e.keyCode === KEY_CODES.del && tabIndex !== 3) {
        if (parseInt(parseFloat(formula) * 1000) === 0) return;
        /// delete
        if (tabIndex === 2) {
          let unevenValues = this.state.unevenValues;
          unevenValues[
            this.state.unevenSelectedIndex
          ].value = formula.substring(0, formula.length - 1);
          this.setState({
            formula: unevenValues[this.state.unevenSelectedIndex].value,
            unevenValues
          });
        } else {
          this.setState({ formula: formula.substring(0, formula.length - 1) });
        }
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
        value: "0.000"
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

  render() {
    let { units } = this.props;
    const { unitIndex, tabIndex } = this.state;
    if(this.start_cache == 1) {
      cacheApi.setObject(CACHE_LOCALNAMES.CALC, this.state);
    }
    if (units != undefined && units != null && units.length > 0){
      units = units.filter(item => {
        if (item.name != "") return item;
      })
    }
    return (
      <Modal
          show={true}
          onHide={this.onHide}
          className="calc-haruka-modal first-view-modal"
        >
          <Modal.Body>
            <CalcBox
              onKeyDown={this.onKeyPressed}
              className="content"
              tabIndex="0"
              onClick={this.setFocus}
              id="calc_dlg"
            >
              {this.props.showedPresData != undefined && this.props.showedPresData.medicineName != undefined && (
                <MedicineLabel>{this.props.showedPresData.medicineName}</MedicineLabel>
              )}
              {this.props.daysLabel !== "" && (
                <div className="btn-box align-center">
                  <p className="align-center">
                    {this.showDaysLabel(this.props.daysLabel).map((item, ind) => {
                      return (
                        <span key={ind} className={item.class_name}>{item.value}</span>
                      )
                    })}
                  </p>
                </div>
              )}
              {(tabIndex == 1 || tabIndex == 2) && (
                <>
                  {tabIndex === 2 && units.length > 0 && (
                    <UnitBoxTop>
                      <p className="label">単位選択</p>
                      <ol>
                        {units.map((unit, index) => (
                          <li
                            key={unit.main_unit_flag}
                            className={index == unitIndex ? "selected" : ""}
                            onClick={() => this.changeUnit(index)}
                          >
                            {unit.name}
                          </li>
                        ))}
                      </ol>
                    </UnitBoxTop>
                  )}
                  <UnevenContainer className={tabIndex === 2 ? "move-top" : ""}>
                    {tabIndex == 2 && (
                      <UnevenDiv>
                        <div className="content">
                          {this.state.unevenValues.map((item, index) => {
                            return (
                              <div className="uneven" key={index}>
                                <Select
                                  options={UNEVEN_OPTIONS}
                                  className="select-div"
                                  placeholder=""
                                  onChange={this.onChangeUsageName}
                                  onFocus={() => this.onFocusUsageName(index)}
                                  value={UNEVEN_OPTIONS.filter(
                                    option => option.label === item.label
                                  )}
                                  id={`uneven_select_${index}`}
                                  ref={(input) => this.unevenSelects[index] = input}
                                />
                               
                                <input
                                  type="text"
                                  value={item.value}
                                  id={`uneven_input_${index}`}
                                  onKeyDown={this.onInputKeyPressed}
                                  onFocus={() => this.onFocusUsageInput(index)}
                                  onChange={this.handleKeywordsChange.bind(this, index)}
                                  ref={(input) => this.unevenInputs[index] = input}
                                />
                                <span className="unit">
                                  {units !== undefined &&
                                  units.length > 0 &&
                                  units[this.state.unitIndex] !== undefined
                                    ? units[this.state.unitIndex].name
                                    : ""}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </UnevenDiv>
                    )}
                    <Wrap>
                      <Display
                        formula={this.state.formula}
                        unit={this.state.unit}
                        class_name={tabIndex === 1 ? "" : "hide"}
                      />
                      <p className={tabIndex === 1 ? "" : "hide"}>
                        {units !== undefined && units.length > 0
                          ? units[this.state.unitIndex].name
                          : ""}
                        {(this.props.daysSelect && this.props.daysSuffix !== "") && (
                          this.props.daysSuffix
                        )}
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
                </>
              )}
              {tabIndex == 3 && (
                <CalcPart
                  calcConfirm={this.calcConfirm}
                  onChageUsagePart={this.onChageUsagePart}
                  onKeyPressed={this.onKeyPressed}
                  usageData={this.state.partUsageData}
                  bodyPartData={this.props.bodyPartData}
                  formula={this.state.formula}
                  partUsageItem={this.state.partUsageItem}
                  unit={
                    units !== undefined && units.length > 0
                      ? units[this.state.unitIndex].name
                      : ""
                  }
                />
              )}

              {units.length > 0 && tabIndex !== 2 && (
                <UnitBox>
                  <p>単位選択</p>
                  <ol>
                    {units.map((unit, index) => (
                      <li
                        key={unit.main_unit_flag}
                        className={index == unitIndex ? "selected" : ""}
                        onClick={() => this.changeUnit(index)}
                      >
                        {unit.name}
                      </li>
                    ))}
                  </ol>
                </UnitBox>
              )}              
            </CalcBox>
          </Modal.Body>
        <Modal.Footer>
          <div                 
            onClick={this.calcCancel}
            className="custom-modal-btn cancel-btn"
            style={{cursor:"pointer"}}
          >
            <span>キャンセル</span>
          </div>
          <div     
            id="system_confirm_Ok"            
            className="custom-modal-btn red-btn"
            onClick={this.calcConfirm}
            style={{cursor:"pointer"}}
          >
            <span>確定</span>
          </div>
          {/*<Button className="cancel-btn" onClick={this.calcCancel}>キャンセル</Button>
          <Button className="red-btn" onClick={this.calcConfirm} id="confirm_btn">確定</Button>*/}
        </Modal.Footer>
      </Modal>
    );
  }
}

InjectCalc.defaultProps = {
  zeroEnable: false,
};

InjectCalc.propTypes = {
  calcConfirm: PropTypes.func,
  calcCancel: PropTypes.func,
  units: PropTypes.array,
  daysSelect: PropTypes.bool,
  daysLabel: PropTypes.string,
  daysSuffix: PropTypes.string,
  daysInitial: PropTypes.number,
  usageData: PropTypes.array,
  bodyPartData: PropTypes.array,
  showedPresData: PropTypes.object,
  zeroEnable: PropTypes.bool,
};

export default InjectCalc;
