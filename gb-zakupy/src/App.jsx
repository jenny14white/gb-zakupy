import { useState } from "react";

import AccessPage from "./pages/AccessPage";
import HomePage from "./pages/HomePage";

import PublicShoppingPage from "./pages/PublicShoppingPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CalendarPage from "./pages/CalendarPage";
import AdminEventsPage from "./pages/AdminEventsPage";

import { logoutAdmin } from "./firebase/auth";


export default function App() {


  const [page, setPage] = useState(
    sessionStorage.getItem("gb_access") === "true"
      ? "home"
      : "access"
  );



  const [isAdmin, setIsAdmin] = useState(
    sessionStorage.getItem("admin") === "true"
  );





  async function handleLogout() {

    try {

      await logoutAdmin();

    } catch(error){

      console.error(error);

    }


    sessionStorage.removeItem("admin");

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
      "gb_access",
      "true"
    );


    setPage("home");

  }







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

        />

      );








    case "shopping":

      return (

        <PublicShoppingPage

          goToAdmin={()=>
            setPage("admin")
          }


          goToCalendar={()=>
            setPage("calendar")
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

        />

      );



  }

}
