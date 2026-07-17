import { useState } from "react";

import { checkAccessCode } from "../services/accessService";


export default function AccessPage({
  onSuccess
}) {


  const [code,setCode] = useState("");

  const [error,setError] = useState("");



  function handleSubmit(e){

    e.preventDefault();


    if(checkAccessCode(code)){


      sessionStorage.setItem(
        "gb_access",
        "true"
      );


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
          📦
        </div>


        <h1>
          GB Zakupy
        </h1>


        <p>
          Dostęp firmowy
        </p>



        <form
          onSubmit={handleSubmit}
        >


          <input

            type="password"

            value={code}

            onChange={(e)=>
              setCode(e.target.value)
            }

            placeholder="Kod dostępu"

          />



          <button type="submit">

            Wejdź

          </button>



        </form>




        {error && (

          <div className="access-error">

            {error}

          </div>

        )}



      </section>


    </main>

  );

}
