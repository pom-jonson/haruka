import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Item = styled.li`
  display: block;

  &.focused {
    display: block;
    background: black;
    border-radius: 13.5px;
    color: white;
    padding-left: 10px;
  }
  &.disabled {
    background: #ccc;
    color: #999;
    border-radius: 20px;
    padding-left: 10px;
  }
`;

class SmallDiseaseList extends Component {
  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  insertMed = () => {
    this.props.insertMed(this.props.medicine);
  };

  simulateClick() {
    if (this.props.className === "focused" && this.props.isEnter) {
      this.insertMed();
    }
  }

  onMouseOver(e, index) {
    if (e !== undefined) this.props.onMouseOver(index);
  }

  render() {
    const { medicine, className } = this.props;
    return (
      <Item
        onClick={this.insertMed}
        className={className}
        ref={this.simulateClick.bind(this)}
        onMouseOver={e => this.onMouseOver(e, this.props.itemIndex)}
      >
        {medicine.name}
      </Item>
    );
  }
}

SmallDiseaseList.propTypes = {
  medicine: PropTypes.object,
  className: PropTypes.string,
  isEnter: PropTypes.bool,
  insertMed: PropTypes.func,
  onMouseOver: PropTypes.func,
  itemIndex: PropTypes.number
};

export default SmallDiseaseList;
