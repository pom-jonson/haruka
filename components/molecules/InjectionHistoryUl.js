import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const textAlignRight = {
  textAlign: "right"
};

// const underLine = {
//   textDecorationLine: "underline"
// };

const DrugItem = styled.div`
  .full-width {
    width: 100%;
  }
  .option {
    text-align: right;
  }
  .options {
    float: right;
  }
`;

class InjectionHistoryUl extends Component { 

  getUnevenValues = (values, unit) => {
    let unevenValues = [];
    values.map(splitNum => {
      if (splitNum.value !== undefined) {
        unevenValues.push(splitNum.label + " " + splitNum.value + unit);
      }
    });
    return unevenValues.join(",");
  };

  render() {
    // const { medi, serial_number} = this.props;
    const { medi } = this.props;
    return (
      <DrugItem className="drug-item table-row">
        <div className="flex between">
          <div className="flex full-width table-item">
            {/*<div className="number" style={underLine}>
              {serial_number === "" ? "" : " Rp" + serial_number}
            </div>*/}
            <div className="number">              
            </div>

            <div className="ml-3 full-width mr-2">
              {medi.item_name}
              {medi.amount > 0 &&
                medi.uneven_values !== undefined &&
                medi.uneven_values.length > 0 && (
                  <p style={textAlignRight}>
                    {this.getUnevenValues(medi.uneven_values, medi.unit)}
                  </p>
                )}
              {medi.free_comment
                ? medi.free_comment.map(comment => {
                    return (
                      <p key={comment.id} style={textAlignRight}>
                        {comment}
                      </p>
                    );
                  })
                : ""}              
            </div>
          </div>  
          <div className="w80 table-item" style={textAlignRight}>
            {medi.amount}          
            {medi.unit}
          </div>                  
        </div>
      </DrugItem>
    );
  }
}

InjectionHistoryUl.propTypes = {
  medi: PropTypes.object,
  id: PropTypes.number,
  serial_number: PropTypes.string,  
};

export default InjectionHistoryUl;
