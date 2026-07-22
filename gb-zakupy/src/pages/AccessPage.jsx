import { useState, useRef } from "react";

import logoGB from "../assets/logo.png";

import LiquidEther from "../components/shared/effects/LiquidEther";

import { loginPortal } from "../firebase/auth";

const LIQUID_COLORS = [
  "#0353a4",
  "#023e7d",
  "#002855"
];

export default function AccessPage({
  onSuccess,
}) {


  const [code,setCode] = useState([
    "",
    "",
    "",
    "",
    ""
  ]);


  const [error,setError] = useState("");

  const [loading,setLoading] = useState(false);


  const inputs = useRef([]);








  function handleChange(value,index){


    if(!/^[a-zA-Z0-9]?$/.test(value)){

      return;

    }


    setError("");



    const newCode=[...code];


    newCode[index]=value;


    setCode(newCode);



    if(value && index < 4){

      inputs.current[index+1]?.focus();

    }

  }









  function handleKeyDown(e,index){


    if(
      e.key === "Backspace" &&
      !code[index] &&
      index > 0
    ){

      inputs.current[index-1]?.focus();

    }


  }









  async function handleSubmit(e){


    e.preventDefault();



    if(loading){

      return;

    }



    const finalCode =
      code.join("");





    const validCodes = [

      "gb520",
      "GB520",
      "Gb520",
      "gB520"

    ];







    if(!validCodes.includes(finalCode)){


      setError(
        "Nieprawidłowy kod dostępu"
      );


      return;


    }









    try{


      setLoading(true);

      setError("");





      await loginPortal();





      sessionStorage.setItem(
        "gbAccess",
        "true"
      );



      sessionStorage.setItem(
        "gbLastActivity",
        Date.now()
      );







      onSuccess();







    }catch(error){


      console.error(error);



      setError(
        "Nie udało się połączyć z serwerem."
      );



    }finally{


      setLoading(false);


    }



  }









  return (


<main className="access-page">



    <div className="access-background">



        <LiquidEther
    colors={LIQUID_COLORS}
    mouseForce={20}
    cursorSize={60}
    isViscous
    viscous={18}
    iterationsViscous={16}
    iterationsPoisson={16}
    resolution={0.35}
    isBounce={false}
    autoDemo
    autoSpeed={0.35}
    autoIntensity={1.4}
    takeoverDuration={0.25}
    autoResumeDelay={3000}
    autoRampDuration={0.6}
/>


    </div>









<section className="access-card">







<div className="access-logo">


<img

src={logoGB}

alt="GB Sp. z o.o."

/>


</div>









<h1 className="company-title">

GB Sp. z o.o.

</h1>









<p className="access-subtitle shader-text">

Sekretariat

</p>









<form

onSubmit={handleSubmit}

className="access-form"

>









<label>

Wpisz kod dostępu

</label>









<div className="code-boxes">



{

code.map((item,index)=>(


<input


key={index}



ref={(el)=>
inputs.current[index]=el
}





type="password"




maxLength="1"




value={item}





onChange={(e)=>

handleChange(
e.target.value,
index
)

}





onKeyDown={(e)=>

handleKeyDown(
e,
index
)

}




/>



))

}



</div>









<button

type="submit"

disabled={loading}

>



{

loading

? "Łączenie..."

: "Wejdź"

}



</button>









</form>









{

error &&


<p className="access-error">

{error}

</p>


}









</section>







</main>


  );


}
