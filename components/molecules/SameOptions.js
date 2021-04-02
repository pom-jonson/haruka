import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

class SameOptions extends Component {  

  render() {
    const { sameOptions, keyNames } = this.props;
    const StyledEl = styled.p`
      text-decoration-line: "none";
    `;
    const OptionItem = styled.div`
      flex-flow: row-reverse;
      padding-right: 90px !important;
    `;
    return (
      <OptionItem className="option flex table-item table-row">
      <div className="text-right table-item flex">
        {sameOptions.map(option => {
          let key = Object.keys(option)[0];
          if (keyNames[key]) {
            if (
              key == "free_comment" &&
              (option[key] == [] || option[key] == "" || option[key] == null)
            ) {
              return "";
            } else {
              return option[key] !== undefined &&
                option[key] !== "" &&
                option[key] !== 0 &&
                option[key] !== "0" &&
                option[key][0] !== "" ? (
                <StyledEl key={key} className=" ">
                  【{keyNames[key]}】&nbsp;
                  {option[key] !== 1 && option[key] !== "1" ? (
                    <span>:{option[key]}</span>
                  ) : (
                    ""
                  )}
                </StyledEl>
              ) : (
                ""
              );
            }
          }
        })}
        </div>
      </OptionItem>
    );
  }
}

SameOptions.propTypes = {
  sameOptions: PropTypes.array,
  keyNames: PropTypes.object
};

export default SameOptions;
