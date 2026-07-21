import { useState, useRef } from "react";

import logoGB from "../assets/logo.png";

import Ferrofluid from "../components/shared/effects/Ferrofluid";

import { loginPortal } from "../firebase/auth";



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


  const inputs = useRef([]);





  function handleChange(value,index){


    if(!/^[a-zA-Z0-9]?$/.test(value)){

      return;

    }


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


    const finalCode =
      code.join("");





    const validCodes=[

      "gb520",
      "GB520",
      "Gb520",
      "gB520"

    ];






    if(validCodes.includes(finalCode)){


      try{


        setError("");



        // logowanie anonimowe Firebase

        await loginPortal();




        // sesja aplikacji

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


      }





    }else{



      setError(
        "Nieprawidłowy kod dostępu"
      );



    }


  }









return (


<main className="access-page">



    <div className="access-background">


        <Ferrofluid


            colors={[

                "#012A4A",
                "#013A63",
                "#01497C",
                "#014F86",
                "#2A6F97",
                "#2C7DA0",
                "#468FAF"

            ]}



            speed={0.22}



            scale={1.7}



            turbulence={0.9}



            glow={2.5}


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









<button type="submit">


Wejdź


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
