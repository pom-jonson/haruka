import React, { Component } from "react";
import PropTypes from "prop-types";

const textAlignRight = {
  textAlign: "right"
};

class TrackUl extends Component {
  state = {
    unit: this.props.medi.unit,
    is_not_generic: this.props.medi.is_not_generic,
    can_generic_name: this.props.medi.can_generic_name,
    amount: this.props.medi.amount,
    separate_packaging: this.props.medi.separate_packaging,
    milling: this.props.medi.milling,
    usage_comment: this.props.medi.usage_comment,
    poultice_one_day: this.props.medi.poultice_one_day,
    poultice_days: this.props.medi.poultice_days,
    free_comment: this.props.medi.free_comment,
    item_name: this.props.medi.item_name,
    medicineData: [],
    delete_flag: 1,
    allOptions: [
      "milling",
      "can_generic_name",
      "is_not_generic",
      "one_dose_package",
      "temprary_dedicine",
      "insurance_type",
      "separate_packaging"
    ]
  };

  getText(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.props.getText(e.target.name, e.target.value, this.props.id);
  }

  timer = "";

  render() {
    const { medi, keyNames } = this.props;
    return (
      <div>
        <div className="flex between">
          <div className="flex">
            <div className="ml-2" style={textAlignRight}>
              {medi.item_name}
              {medi.free_comment
                ? medi.free_comment.map(comment => {
                    return <p key={comment.id}>{comment}</p>;
                  })
                : ""}
              <div className="options">
                {this.state.allOptions.map(option => {
                  if (
                    keyNames[option] &&
                    medi[option] !== "" &&
                    medi[option] !== undefined &&
                    medi[option] !== 0 &&
                    medi[option] !== "0" &&
                    medi[option][0] !== ""
                  ) {
                    return (
                      <div className={option} key={option}>
                        {keyNames[option]}
                        {medi[option] !== 1 && medi[option] !== "1" ? (
                          <span>:{medi[option]}</span>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
          <div className="w50" style={textAlignRight}>
            {medi.amount}
            {medi.unit}
          </div>
        </div>
      </div>
    );
  }
}

TrackUl.propTypes = {
  medi: PropTypes.object,
  getText: PropTypes.func,
  id: PropTypes.number,
  units: PropTypes.array,
  serial_number: PropTypes.string,
  sameKeys: PropTypes.array,
  keyNames: PropTypes.object
};

export default TrackUl;
