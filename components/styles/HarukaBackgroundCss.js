import {haruka_color as harukaBackground } from "~/components/_nano/colors";
import styled from "styled-components";

export const Bar = styled.div`
  height:100%;
  .data-item{
    background: ${harukaBackground.out.default.linear}!important;
  }

  ._color_received{
    .history-region{
      background: ${harukaBackground.out.received.main}!important;
    }
    .doctor-name{
      background: ${harukaBackground.out.received.main}!important;
    }

    .data-item{
      background: ${harukaBackground.out.received.linear}!important;
    }
  }

  ._color_implemented{
    .history-region{
      background: ${harukaBackground.out.done.main}!important;
    }
    .doctor-name{
      background: ${harukaBackground.out.done.main}!important;
    }

    .data-item{
      background: ${harukaBackground.out.done.linear}!important;
    }
  }
  ._color_not_implemented{
    .history-region{
      background: ${harukaBackground.out.not_done.main}!important;
    }
    .doctor-name{
      background: ${harukaBackground.out.not_done.main}!important;
    }

    .data-item{
      background: ${harukaBackground.out.not_done.linear}!important;
    }
  }

  ._color_received_hospital{
    .history-region{
      background: ${harukaBackground.hospital.received.main}!important;
    }
    .doctor-name{
      background: ${harukaBackground.hospital.received.main}!important;
    }

    .data-item{
      background: ${harukaBackground.hospital.received.linear}!important;
    }
  }

  ._color_implemented_hospital{
    .history-region{
      background: ${harukaBackground.hospital.done.main}!important;
    }
    .doctor-name{
      background: ${harukaBackground.hospital.done.main}!important;
    }

    .data-item{
      background: ${harukaBackground.hospital.done.linear}!important;
    }
  }
  ._color_not_implemented_hospital{
    .history-region{
      background: ${harukaBackground.hospital.not_done.main}!important;
    }
    .doctor-name{
      background: ${harukaBackground.hospital.not_done.main}!important;
    }

    .data-item{
      background: ${harukaBackground.hospital.not_done.linear}!important;
    }
  }
`;
