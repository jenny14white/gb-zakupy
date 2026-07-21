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


import { logoutAdmin } from "./firebase/auth";






export default function App() {



  const [page,setPage] = useState(
    "access"
  );



  const [hasAccess,setHasAccess] = useState(false);



  const [firebaseReady,setFirebaseReady] = useState(false);




  const [isAdmin,setIsAdmin] = useState(
    sessionStorage.getItem("admin") === "true"
  );









  // ==========================
  // FIREBASE SESSION CHECK
  // ==========================


  useEffect(()=>{


    const unsubscribe = onAuthStateChanged(
      auth,
      (user)=>{


        if(user){


          setHasAccess(true);



          if(
            sessionStorage.getItem("gbAccess")
            ===
            "true"
          ){

            setPage("home");

          }



        }else{


          setHasAccess(false);


          sessionStorage.removeItem(
            "gbAccess"
          );


          sessionStorage.removeItem(
            "gbLastActivity"
          );


          setPage("access");


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



    sessionStorage.removeItem(
      "admin"
    );


    setIsAdmin(false);


    setPage("home");


  }









  function handleLogin(){


    sessionStorage.setItem(
      "admin",
      "true"
    );


    setIsAdmin(true);


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



              logout={handleLogout}



              goToEvents={()=>


                setPage("admin-events")

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



              onLogin={()=>{


                handleLogin();


                setPage("admin-events");


              }}


            />


          );









        default:


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



      }



    })()


    }



    </>


  );


}
