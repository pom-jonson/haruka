/* Pagination Component
-------------------------------------------------*/
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Paginate = styled.ul`
  width:fit-content;
  margin-left:auto;
  margin-right:auto;
  .paginate_link {
    position: relative;
    width: 3.5rem;
    text-align: center;
    float: left;
    padding: 6px 12px;
    margin-left: -1px;
    line-height: 1.42857143;
    color: #337ab7;
    text-decoration: none;
    background-color: #fff;
    border: 1px solid #ddd;
    cursor:pointer;
  }
  .paginate_link:hover{
    z-index: 3;
    color: #23527c;
    background-color: #eee;
    border-color: #ddd;
  }
  .disabled a, .disabled a:hover {
    color: #777;
    cursor: not-allowed;
    background-color: #fff;
    border-color: #ddd;
  }
  .active a, .active a:hover{
    z-index: 2;
    color: #fff;
    cursor: default;
    background-color: #337ab7;
    border-color: #337ab7;
  }
`;

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pager: {} };
  }
  
  UNSAFE_componentWillMount () {
    // set page if items array isn't empty
    if (this.props.items) {
      this.setPage(this.props.initialPage);
    }
  }
  
  componentDidUpdate(prevProps) {
    // reset page if items array has changed
    if (this.props.items != undefined && this.props.items != null && this.props.items !== prevProps.items || this.props.pageSize != prevProps.pageSize) {
      this.setPage(this.props.initialPage);
    }
  }
  
  setPage(page) {
    var items = this.props.items;
    var pager = this.state.pager;
    if (page < 1 || page > pager.totalPages) {
      return;
    }
    // get new pager object for specified page
    pager = this.getPager(items.length, page, this.props.pageSize);
    // get new page of items from items array
    var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
    
    // update state
    this.setState({ pager: pager });
    
    // call change page function in parent component
    this.props.onChangePage(pageOfItems, pager);
  }
  
  getPager(totalItems, currentPage, pageSize) {
    // default to first page
    currentPage = currentPage || 1;
    
    // default page size is 10
    pageSize = pageSize || 10;
    
    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);
    
    var startPage, endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }
    
    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    
    // create an array of pages to ng-repeat in the pager control
    var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);
    
    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages>0?totalPages:undefined,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }
  
  render() {
    var pager = this.state.pager;
    if (!pager.pages || pager.pages.length <= 1) {
      // don't display pager if there is only 1 page
      return null;
    }
    
    return (
      <Paginate className="pagination">
        <li className={pager.currentPage === 1 ? 'disabled' : ''}>
          <a className="paginate_link" onClick={() => this.setPage(1)}>|＜</a>
        </li>
        <li className={pager.currentPage === 1 ? 'disabled' : ''}>
          <a className="paginate_link" onClick={() => this.setPage(pager.currentPage - 1)}>＜</a>
        </li>
        {pager.pages.map((page, index) =>
          <li key={index} className={pager.currentPage === page ? 'active' : ''}>
            <a className="paginate_link" onClick={() => this.setPage(page)}>{page}</a>
          </li>
        )}
        <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
          <a className="paginate_link" onClick={() => this.setPage(pager.currentPage + 1)}>＞</a>
        </li>
        <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
          <a className="paginate_link" onClick={() => this.setPage(pager.totalPages)}>＞|</a>
        </li>
      </Paginate>
    );
  }
}
// const propTypes = {

// }

const defaultProps = {
  initialPage: 1
}
Pagination.propTypes = {
  items: PropTypes.array.isRequired,
  onChangePage: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
};
Pagination.defaultProps = defaultProps;

export default Pagination;
