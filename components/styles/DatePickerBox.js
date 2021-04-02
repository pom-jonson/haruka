import {date_colors} from "~/components/_nano/colors";
import styled from "styled-components";

export const DatePickerBox = styled.div`
  .react-datepicker__day.sunday{
    color:${date_colors != undefined && date_colors.days != undefined && date_colors.days[0].calendar_date_font != undefined && date_colors.days[0].calendar_date_font != ''
      ?date_colors.days[0].calendar_date_font : 'red'} ;
  }
  .react-datepicker__day.saturday{
    color:${date_colors != undefined && date_colors.days != undefined && date_colors.days[6].calendar_date_font != undefined && date_colors.days[6].calendar_date_font != ''
      ?date_colors.days[6].calendar_date_font : 'blue'} ;
  }
  .react-datepicker__day.holiday{
    color:${date_colors != undefined && date_colors.holiday != undefined && date_colors.holiday.calendar_date_font != undefined && date_colors.holiday.calendar_date_font != ''
      ?date_colors.holiday.calendar_date_font : 'red'} ;
  }
`;
