import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
const FormControl = styled.div`
  display: flex;
  margin-top: 8px;

  .label-title {
    font-size: 12px;
    width: 70px;
    margin-top: 0px;
    padding-right: 8px;
  }
`;

const InputBox = styled.div`
  .show {
    display: block !important;
  }

  .hidden {
    display: none !important;
  }

  .label-error {
    display: block;
    width: 100%;
    font-size: 13px;
    line-height: 18px;
    color: red;
  }

  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    font-size: 14px;
    width: 100%;
    height: 38px;
    padding: 0px 8px;
  }

  input[disabled] {
    opacity: 0.8;
  }
`;

const Select = styled.div`
  display: block;
  position: relative;

  button {
    position: absolute;
    right: 10px;
    top: calc(50% - 10px);
    display: inline-block;
    width: 20px;
    height: 20px;
    font-size: 12px;
    line-hight: 12px;
    border: 1px solid black;
    background: transparent;
  }
`;

/**
 * type=text のとき、getInputText のパラメータは(event, label)
 * type=date のとき、getInputText のパラメータは(date)
 * @param {*} props
 */
const InputWithSearch = props => {
  return (
    <FormControl>
      <label className="label-title">{props.label}</label>
      <InputBox>
        <Select>
          <input
            type={props.type}
            placeholder={props.placeholder}
            onChange={e => {
              props.getInputText(e, props.label);
            }}
            onKeyPress={props.handleKeyPress}
            value={
              props.editStatus ? props.diseaseEditData : props.selectedName
            }
          />
          <button
            className={props.editStatus ? "hidden" : "show"}
            onClick={props.cancelDiseaseSelect}
          >
            X
          </button>
        </Select>
        <label className="label-error `${props.error != ''? 'show':'hidden'}`">
          {props.error}
        </label>
      </InputBox>
    </FormControl>
  );
};

InputWithSearch.defaultProps = {
  diseaseEditData: null
};

InputWithSearch.propTypes = {
  getInputText: PropTypes.func,
  cancelDiseaseSelect: PropTypes.func,
  onBlur: PropTypes.func,
  handleKeyPress: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  diseaseEditData: PropTypes.string,
  selectedName: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  editStatus: PropTypes.bool
};

export default InputWithSearch;
