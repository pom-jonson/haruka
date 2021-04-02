export default function() {
  let title = this.state.isForUpdate ? (this.modal_obj.is_done ? "編集して実施": "注射[編集中]") : "注射";
  if (this.context.selectedDoctor.name !== "") {
    title = title + " ( " + this.context.selectedDoctor.name + " )";
  }
  let data = {
    title,
    status:this.state.isForUpdate ? true : false,
  };

  return data;
}
