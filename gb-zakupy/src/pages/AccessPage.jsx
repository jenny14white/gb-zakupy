import { useState } from "react";

import logoGB from "../assets/logo-gb.png";



export default function AccessPage({
  onSuccess,
}) {


  const [code, setCode] = useState("");

  const [error, setError] = useState("");





  function handleSubmit(e){

    e.preventDefault();


    const validCodes = [
      "gb520",
      "GB520",
      "Gb520",
      "gB520",
    ];



    if(validCodes.includes(code.trim())){


      setError("");

      onSuccess();


    } else {


      setError(
        "Nieprawidłowy kod dostępu"
      );


    }


  }





  return (

    <main className="access-page">



      <section className="access-card">






        <div className="access-logo">


          <img

            src={logoGB}

            alt="GB Sp. z o.o."

          />


        </div>







        <h1>

          GB Sp. z o.o.

        </h1>





        <p className="access-subtitle">

          Portal firmowy

        </p>







        <form

          onSubmit={handleSubmit}

          className="access-form"

        >





          <label>

            Kod dostępu

          </label>







          <input


            type="password"


            value={code}


            onChange={(e)=>
              setCode(e.target.value)
            }


            placeholder="Wpisz kod"


          />








          <button type="submit">

            Wejdź

          </button>





        </form>








        {error && (

          <p className="access-error">

            {error}

          </p>

        )}







      </section>





    </main>

  );

}
