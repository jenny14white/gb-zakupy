import {useEffect,useState} from "react";
import "../../styles/scroll-top.css";

export default function ScrollTopButton(){

const [visible,setVisible]=useState(false);


useEffect(()=>{

function handleScroll(){

setVisible(
window.scrollY>400
);

}


window.addEventListener(
"scroll",
handleScroll
);


return()=>{

window.removeEventListener(
"scroll",
handleScroll
);

};


},[]);



function scrollTop(){

window.scrollTo({

top:0,

behavior:"smooth"

});

}



if(!visible){
return null;
}


return(

<button
className="scroll-top-button"
onClick={scrollTop}
aria-label="Powrót na górę"
>

↑

</button>

);


}
