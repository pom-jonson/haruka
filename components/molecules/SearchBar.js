import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/pro-regular-svg-icons";

const SearchBoxWrapper = styled.div`
  display: flex;
  height: 38px;
`;

const SearchBox = styled.div`
  position: relative;
  width: 290px;
  height: 38px;
`;

const SearchInput = styled.input`
  font-size: 14px;
  box-sizing: border-box;
  padding: 0.3em;
  padding-left: 41px;
  letter-spacing: 1px;
  width: 290px;
  height: 38px;
  border-radius: 4px 0 0 4px;
  border: solid 1px #ced4da;
`;

const StyledGlass = styled(FontAwesomeIcon)`
  color: ${colors.midEmphasis};
  font-size: 18px;
  position: absolute;
  top: 10px;
  left: 11px;
`;

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = e => {
    this.props.search(e.target.value);
  };

  render() {
    return (
      <SearchBoxWrapper>
        <SearchBox className="search-box">
          <SearchInput
            type="text"
            placeholder={this.props.placeholder}
            onChange={this.handleChange}
            onKeyPress={this.props.enterPressed.bind(this)}
            value={this.props.value}
            id={this.props.id !== undefined ? this.props.id : ""}
            onBlur={e => {if(this.props.onBlur != undefined) this.props.onBlur(e);}}
          />
          <StyledGlass icon={faSearch} aria-hidden="true" />
        </SearchBox>
      </SearchBoxWrapper>
    );
  }
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  search: PropTypes.func,
  enterPressed: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.string,
  id:PropTypes.string,
};

export default SearchBar;
