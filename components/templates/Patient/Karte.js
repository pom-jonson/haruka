import React, { Component } from "react";
import styled from "styled-components";
import ListItem from "../../organisms/ListItem";
import ListBox from "../../organisms/ListBox";
import PropTypes from "prop-types";

const Wrapper = styled.div`
  margin-bottom: 32px;

  .row {
    margin: 0;
  }
`;

const ListContents = styled.div`
  display: flex;
  width: 100%;

  .kalte .category-name {
    top: 35px;
    left: -20px;
  }

  .treatment .category-name {
    top: 70px;
    left: -55px;
  }
`;

class Karte extends Component {
  static propTypes = {
    patientId: PropTypes.number
  };

  render() {
    return (
      <Wrapper>
        <div className="container mt-4">
          <ListItem />
          <ListContents>
            <ListBox className="kalte" categoryName="KALTE" />
            <ListBox className="treatment" categoryName="TREATMENT" />
          </ListContents>
        </div>
      </Wrapper>
    );
  }
}
export default Karte;
