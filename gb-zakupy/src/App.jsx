import { useState, useEffect } from "react";

import {
  onAuthStateChanged
} from "firebase/auth";


import { auth } from "./firebase/firebase";


import AccessPage from "./pages/AccessPage";
import HomePage from "./pages/HomePage";

import PublicShoppingPage from "./pages/PublicShoppingPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CalendarPage from "./pages/CalendarPage";
import AdminEventsPage from "./pages/AdminEventsPage";


import SessionGuard from "./components/shared/SessionGuard";


import {
  logoutAdmin
} from "./firebase/auth";









export default function App(){



  const [page,setPage] = useState(

    sessionStorage.getItem("gbAccess") === "true"
      ? "home"
      : "access"

  );



  const [hasAccess,setHasAccess] = useState(

    sessionStorage.getItem("gbAccess") === "true"

  );



  const [firebaseReady,setFirebaseReady] = useState(false);





  // ADMIN TYLKO Z FIREBASE

  const [isAdmin,setIsAdmin] = useState(false);

  const [adminUser,setAdminUser] = useState(null);









  // ===============================
  // FIREBASE AUTH CHECK
  // ===============================


  useEffect(()=>{


    const unsubscribe = onAuthStateChanged(
      auth,
      (user)=>{


        // portal access

        const access =
          sessionStorage.getItem("gbAccess")
          ===
          "true";



        setHasAccess(access);



        if(access){

          setPage("home");

        }else{

          setPage("access");

        }






        // ADMIN CHECK

        if(
          user &&
          user.email === "belacount4@gmail.com"
        ){

          setIsAdmin(true);

          setAdminUser(user);


        }else{


          setIsAdmin(false);

          setAdminUser(null);


        }






        setFirebaseReady(true);


      }

    );



    return ()=>unsubscribe();


  },[]);












  function handleAccessLogout(){


    sessionStorage.removeItem(
      "gbAccess"
    );


    sessionStorage.removeItem(
      "gbLastActivity"
    );



    setHasAccess(false);


    setPage("access");


  }













  async function handleLogout(){


    try{


      await logoutAdmin();


    }catch(error){


      console.error(error);


    }



    setIsAdmin(false);

    setAdminUser(null);


    setPage("home");


  }












  function handleLogin(user){


    setIsAdmin(true);


    setAdminUser(user);


  }













  function handleAccessSuccess(){


    sessionStorage.setItem(
      "gbAccess",
      "true"
    );



    sessionStorage.setItem(
      "gbLastActivity",
      Date.now()
    );



    setHasAccess(true);


    setPage("home");


  }












  if(!firebaseReady){

    return null;

  }













return (

<>


{

hasAccess && (

<SessionGuard

onLogout={handleAccessLogout}

/>

)

}









{

(()=>{


switch(page){





case "access":


return (

<AccessPage

onSuccess={handleAccessSuccess}

/>

);









case "home":


return (

<HomePage

goToShopping={()=>
setPage("shopping")
}


goToCalendar={()=>
setPage("calendar")
}


goToAdmin={()=>
setPage("admin")
}


/>

);









case "shopping":


return (

<PublicShoppingPage

goBack={()=>
setPage("home")
}

/>

);









case "calendar":


return (

<CalendarPage

goBack={()=>
setPage("home")
}

/>

);









case "admin":


return isAdmin ? (


<AdminDashboardPage


goBack={()=>
setPage("home")
}


/>

) : (


<AdminLoginPage


goBack={()=>
setPage("home")
}


onLogin={handleLogin}


/>

);



case "admin-events":


return isAdmin ? (


<AdminEventsPage


goBack={()=>
setPage("admin")
}


/>

) : (


<AdminLoginPage


goBack={()=>
setPage("home")
}


onLogin={(user)=>{


handleLogin(user);


setPage("admin-events");


}}


/>

);



default:


return (

<AccessPage

onSuccess={handleAccessSuccess}

/>

);



}


})()

}



</>

);


}
