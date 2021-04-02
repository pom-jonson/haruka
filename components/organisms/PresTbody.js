import React, { Component } from "react";
import PropTypes from "prop-types";

class PresTbody extends Component {
  state = {
    show: false,
    word: ""
  };

  handleShow() {
    this.props.handleShow(this.props.medicine, this.props.indexNum);
  }

  search = e => {
    this.setState({ word: e.target.value });
    this.props.search(this.state.word);
  };

  render() {
    const { medicine } = this.props;

    return (
      <tbody>
        <tr>
          <td>{medicine.medicineId}</td>
          <td>
            {!medicine.medicineName ? (
              <input
                type="text"
                value={`${this.state.word}`}
                onChange={this.search}
              />
            ) : (
              `${medicine.medicineName}`
            )}
          </td>
          <td className="text-right">{medicine.amount}</td>
          <td>{medicine.unit}</td>
          <td>
            <button onClick={this.handleShow.bind(this)}>詳細</button>
          </td>
        </tr>
        <tr>
          <td />
          <td>{medicine.usageName}</td>
          <td className="text-right">{medicine.days}</td>
          <td>日分</td>
          <td>
            <button>詳細</button>
          </td>
        </tr>
        <tr>
          <td />
          <td>{medicine.start_date}</td>
          <td className="text-right" />
          <td />
          <td />
        </tr>
      </tbody>
    );
  }
}

PresTbody.propTypes = {
  medicine: PropTypes.object,
  handleShow: PropTypes.func,
  indexNum: PropTypes.number,
  search: PropTypes.func
};

export default PresTbody;
