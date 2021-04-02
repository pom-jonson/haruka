export default function(fromWhere) {
  let canEdit = 0;
  if (fromWhere === 1) {
    if (
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.EDIT
      ) ||
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.EDIT_OLD
      )
    ) {
      canEdit = 1;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.EDIT_PROXY
      ) ||
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.EDIT_PROXY_OLD
      )
    ) {
      canEdit = 2;
    }

    if (canEdit === 0) {
      window.sessionStorage.setItem("alert_messages", "権限がありません。");
      // alert("権限がありません。");
      return;
    }
  }

  if (fromWhere === 0) {
    // Copy
    if (
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.REGISTER
      ) ||
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.REGISTER_OLD
      )
    ) {
      canEdit = 1;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.REGISTER_PROXY
      ) ||
      this.context.$canDoAction(
        this.context.FEATURES.PRESCRIPTION,
        this.context.AUTHS.REGISTER_PROXY_OLD
      )
    ) {
      canEdit = 2;
    }

    if (canEdit === 0) {
      window.sessionStorage.setItem("alert_messages", "権限がありません。");
      // alert("権限がありません。");
      return;
    }
  }

  // if (this.state.canEdit === false && this.context.selectedDoctor.code <= 0) {
  if (canEdit === 2 && this.context.selectedDoctor.code <= 0) {
    this.setState({
      isCopyOrder: fromWhere === 0,
      isEditOrder: fromWhere === 1
    });
    this.context.$selectDoctor(true);
    return false;
  }
  return true;
}
