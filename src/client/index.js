import { checkerUrl } from "./js/checkerUrl";
import { handleSubmit, handleRemove  } from "./js/app";
//import { handleSubmit } from './js/formHandler'
import "./styles/main.scss";
import "./styles/footer.scss";
import "./styles/form.scss";
import "./styles/header.scss";
import "./styles/colors.scss";

if(document.getElementById("btn-add") != null){
    document.getElementById("btn-add").addEventListener("click", handleSubmit);
}
if(document.getElementById("remove_trip") != null){
    document.getElementById("remove_trip").addEventListener("click", handleRemove);
}


export { checkerUrl, handleSubmit, handleRemove };