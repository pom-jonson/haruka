export default function(value) {
    window.sessionStorage.removeItem('soap_scroll_top')
    this.setState({
        activeOperation: value
    });
}
  