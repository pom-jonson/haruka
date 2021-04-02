export default function() {
  let title = this.state.isForUpdate ? (this.state.is_done ? "編集して実施": "処方箋[編集中]") : "処方箋";
  if (this.context.selectedDoctor.name !== "") {
    title = title + " ( " + this.context.selectedDoctor.name + " )";
  }
  return title;
  // let data = {
  //   title,
  //   status:this.state.isForUpdate ? true : false,
  // };
  
  // return data;
}
