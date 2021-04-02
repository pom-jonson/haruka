import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

class SameOptionsNew extends Component {  

  render() {
    const { sameOptions, keyNames } = this.props;
    const StyledEl = styled.span`
      text-decoration-line: "none";
      margin-right: 3px;
      display: inline-block;
    `;
    const OptionItem = styled.div`
      flex-flow: row-reverse;
      padding-right: 90px !important;
      padding-left: 80px !important;
      .flex-wrap{
        flex-wrap: wrap;
      }
      .full-width{
        width: 100%;
      }
    `;
    return (
      <OptionItem className="option flex table-item table-row">
      {/* <div className="text-right table-item flex flex-wrap"> */}
      <div className="table-item flex-wrap full-width" style={{textAlign:'right'}}>
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
                  【{keyNames[key]}】
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

SameOptionsNew.propTypes = {
  sameOptions: PropTypes.array,
  keyNames: PropTypes.object
};

export default SameOptionsNew;
