export const addKeyEvent = (_this) => {
  let nextEelementOrder = 999;
  let tmpEelementOrder = 0;
  let currentElementOrder = 0;

  const handleInputKeypress = e => {
    switch (e.key) {
      case "Enter":
        currentElementOrder = Number(e.currentTarget.getAttribute("ordernumber"));
        nextEelementOrder = currentElementOrder + 1;
        Object.values(_this.formElements).map(element => {
          tmpEelementOrder = Number(element.getAttribute("ordernumber"));
          if (tmpEelementOrder <= currentElementOrder) return;
          if (tmpEelementOrder < nextEelementOrder) nextEelementOrder = tmpEelementOrder;
        });
        if (_this.formElements[nextEelementOrder] !== undefined) {
          _this.formElements[nextEelementOrder].focus();
        }
        break;

      default:
        break;
    }
  };

  Object.values(_this.formElements).map(element => {
    // add event listener
    if (!element.getAttribute('hasKeypressEvent')) {
      element.addEventListener('keypress', handleInputKeypress);
      element.setAttribute('hasKeypressEvent', true)
    }
  })
}

export const registerElement = (_this, e, index) => {
  if (e === null) return;
  _this.formElements[index] = e;
  e.setAttribute("ordernumber", index);
}