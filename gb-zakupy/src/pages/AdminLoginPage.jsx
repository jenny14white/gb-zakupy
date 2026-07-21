import { useState } from 'react';

import {
  loginAdmin,
  logoutAdmin
} from '../firebase/auth';

import Logo from '../components/shared/Logo';

import Ferrofluid from '../components/shared/effects/Ferrofluid';



export default function AdminLoginPage({
  goBack,
  onLogin
}) {


  const [email,setEmail] = useState('');

  const [password,setPassword] = useState('');

  const [error,setError] = useState('');

  const [loading,setLoading] = useState(false);









  async function handleLogin(event){


    event.preventDefault();


    setError("");



    try{


      setLoading(true);




      const user = await loginAdmin(
        email,
        password
      );





      // ==========================
      // SPRAWDZENIE ADMINA
      // ==========================


      if(
        user.email !== "belacount4@gmail.com"
      ){


        await logoutAdmin();



        throw new Error(
          "Brak uprawnień administratora"
        );


      }







      // przekazujemy użytkownika Firebase

      onLogin(user);








    }catch(error){


      console.error(error);



      setError(
        "Brak dostępu do panelu administratora."
      );



    }finally{


      setLoading(false);


    }


  }













return (


<main className="admin-page login-view">



<div className="admin-background">


<Ferrofluid

colors={[
"#012A4A",
"#013A63",
"#01497C",
"#2A6F97",
"#468FAF"
]}


speed={0.22}


scale={1.7}


turbulence={0.9}


glow={2.5}


flowDirection="down"


opacity={1}


/>


</div>









<form

className="login-card"

onSubmit={handleLogin}

>








<button

type="button"

onClick={goBack}

className="back-button"

>

Wróć do listy

</button>









<Logo

className="admin-logo"

/>









<h1>

Panel admina

</h1>








<p>

Zaloguj się jako administrator.

</p>









<input


type="email"


placeholder="Adres e-mail"


value={email}



onChange={(event)=>

setEmail(
event.target.value
)

}


autoFocus


required


/>



<input


type="password"


placeholder="Hasło"


value={password}



onChange={(event)=>

setPassword(
event.target.value
)

}


required


/>









{

error &&


<div className="admin-error">

{error}

</div>


}









<button


className="admin-button"


disabled={loading}


>


{

loading

?

"Logowanie..."

:

"Zaloguj"

}



</button>









</form>






</main>


);


}
