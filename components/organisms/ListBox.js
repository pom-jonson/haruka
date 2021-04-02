import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/pro-regular-svg-icons";
import { faEdit } from "@fortawesome/pro-regular-svg-icons";
import { faEllipsisV } from "@fortawesome/pro-light-svg-icons";
import CategoryName from "../atoms/CategoryName";
import DescriptionList from "../molecules/DescriptionList";

const ListBoxWrapper = styled.div`
  border: 1px solid ${colors.disable};
  box-sizing: border-box;
  padding: 10px 17px 36px 32px;
  position: relative;
  width: 50%;

  .icon {
    cursor: pointer;
    color: ${colors.midEmphasis};
    display: inline-block;
    font-size: 17px;
    :hover {
      color: ${colors.onSurface};
    }
  }
`;

const Copy = styled(FontAwesomeIcon)`
  margin-right: 11px;
`;

const Edit = styled(FontAwesomeIcon)`
  margin-right: 13px;
`;

const Ellipsis = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

const ListBox = props => (
  <ListBoxWrapper className={props.className}>
    <div className="text-right">
      <Copy className="icon" icon={faCopy} />
      <Edit className="icon" icon={faEdit} />
      <Ellipsis className="icon" icon={faEllipsisV} />
    </div>
    <CategoryName categoryName={props.categoryName} />
    <div className="mt-2">
      <DescriptionList dtName="病名" ddName="胃潰瘍" />
      <DescriptionList dtName="Subjective" ddName="胃潰瘍" />
      <DescriptionList dtName="Objective" ddName="胃潰瘍" />
      <DescriptionList dtName="Assessment" ddName="胃潰瘍" />
      <DescriptionList dtName="Plan" ddName="胃潰瘍" />
    </div>
  </ListBoxWrapper>
);

ListBox.propTypes = {
  className: PropTypes.string,
  categoryName: PropTypes.string
};

export default ListBox;
