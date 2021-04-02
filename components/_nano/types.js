import styled from "styled-components";
import WebFont from "webfontloader";

WebFont.load({
  google: {
    families: ["Noto Sans JP"]
  }
});

export const Button = styled.span`
  font-family: "Noto Sans JP", sans-serif;
  font-weight: bold;
  font-size: 0.75rem;
  letter-spacing: 1.3px;
  text-align: center;
  display: block;
`;

/**
 * FIXME: below code will cause syntax error
 *************************************************/
// export const h2Active = styled.h2Active`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: rgba(0, 0, 0, 0.87);
// `;
//
// export const h3Active = styled.h3Active`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.onSurface};
// `;
//
// export const editableActive = styled.editableActive`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.onSecondaryDark};
// `;
//
// export const editableDisable = styled.editableDisable`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.onSecondaryDark};
// `;
//
// export const editableMidEmphasis = styled.editableMidEmphasis`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.midEmphasis};
// `;
//
// export const h5Link = styled.h5Link`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.secondary600};
// `;
//
// export const buttonDisable = styled.buttonDisable`
//   font-family: "Noto Sans JP";
//   font-weight: bold;
//   font-size: 8px;
//   color: ${colors.midEmphasis};
// `;
//
// export const h6Active = styled.buttonOnSecondaryLight`
//   font-family: "Noto Sans JP";
//   font-weight: bold;
//   font-size: 8px;
//   color: ${colors.onSecondaryDark};
// `;
//
// export const navigationActive = styled.navigationActive`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.secondary};
// `;
//
// export const navigationLink = styled.navigationLink`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.secondary};
// `;
//
// export const navigationMidEmpasis = styled.navigationMidEmpasis`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: #bbbbbb;
// `;
//
// export const navigationOnBlack = styled.navigationOnBlack`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.onSecondaryLight};
// `;
//
// export const paragraphLink = styled.paragraphLink`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.secondary600};
// `;
//
// export const paragraphOnBlack = () => styled.paragraphOnBlack`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.onSecondaryLight};
// `;
//
// export const paragraphOnSurface = () => styled.paragraphOnSurface`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.onSecondaryDark};
// `;
//
// export const tagActive = () => styled.tagActive`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.midEmphasis};
// `;
//
// export const tagError = () => styled.tagError`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.error};
// `;
//
// export const tagMale = () => styled.tagMale`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: #9baede;
// `;
//
// export const asideInfohighEmphasis = () => styled.asideInfohighEmphasis`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.onSecondaryDark};
// `;
//
// export const asideInfomidEmphasis = () => styled.asideInfomidEmphasis`
//   font-family: "Noto Sans JP";
//   font-size: 8px;
//   color: ${colors.midEmphasis};
// `;
