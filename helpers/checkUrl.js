export const canShowKarteStatus = (strUrl) => {
  // check url includes "patients" for Karte Status
  if (strUrl.includes("patients")) {
    return true;
  }
  return false;
};

