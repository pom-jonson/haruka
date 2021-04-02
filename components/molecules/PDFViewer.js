import React, { Component } from "react";
import PDF from "react-pdf-js";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
  text-align: center;
  canvas {
    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 8px;
  }
`;

class PDFViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: 0,
      page: 1,
    };
  }
  
  UNSAFE_componentWillMount() {
    console.log("UNSAFE_componentWillMount")
    this.setState({
      pages: null,
      page: this.props.page || 1,
    })
  }
  
  UNSAFE_componentWillReceiveProps({ page }) {
    console.log("UNSAFE_componentWillReceiveProps page = ", page)
    this.setState({ page: page || this.state.page });
  }
  
  onDocumentComplete = (pages) => {
    console.log("onDocumentComplete pages = ", pages)
    this.setState({ page: 1, pages });
  }
  
  handlePrevious = () => {
    if (this.state.page === 1) return;
    this.setState({ page: this.state.page - 1 });
  }
  
  handleNext = () => {
    if (this.state.page === this.state.pages) return;
    this.setState({ page: this.state.page + 1 });
  }
  
  renderPagination() {
    return (
      <>
        <button onClick={this.handlePrevious}>&lt;</button>
        <button onClick={this.handleNext}>&gt;</button>
      </>
    );
  }
  
  render() {
    let pagination = null;
    if (this.state.pages) {
      pagination = this.renderPagination();
    }
    return (
      <Wrapper>
        <PDF
          file={this.props.file}
          page={this.state.page}
          onDocumentComplete={this.onDocumentComplete}
        />
        {pagination}
      </Wrapper>
    );
  }
}

PDFViewer.propTypes = {
  file:PropTypes.any,
  page: PropTypes.number,
};

export default PDFViewer;