import { useMemo, useState, useEffect } from 'react';

import {
  onAuthStateChanged
} from 'firebase/auth';

import { auth } from '../firebase/firebase';

import { useAdminOrders } from '../hooks/useAdminOrders';
import { useLogs } from '../hooks/useLogs';

import {
  getOrderedOrders,
  getPendingOrders
} from '../utils/orderUtils';


import AdminSidebar from '../components/admin/AdminSidebar';
import AdminStats from '../components/admin/AdminStats';
import AdminShoppingList from '../components/admin/AdminShoppingList';
import AdminNotifications from '../components/admin/AdminNotifications';
import AdminCompletedList from '../components/admin/AdminCompletedList';
import AdminEventLog from '../components/admin/AdminEventLog';



export default function AdminDashboardPage({
  goBack,
  logout,
  goToEvents,
}) {



  const [activeTab,setActiveTab] = useState('lista');


  const [authorized,setAuthorized] = useState(false);


  const [checking,setChecking] = useState(true);







  // ============================
  // SPRAWDZENIE ADMINA FIREBASE
  // ============================


  useEffect(()=>{


    const unsubscribe = onAuthStateChanged(
      auth,
      (user)=>{


        if(
          user &&
          user.email === "belacount4@gmail.com"
        ){


          setAuthorized(true);


        }else{


          setAuthorized(false);


        }



        setChecking(false);



      }

    );



    return ()=>unsubscribe();



  },[]);









  const { orders, loading } = useAdminOrders();


  const logs = useLogs();









  const pendingOrders = useMemo(

    ()=>getPendingOrders(orders),

    [orders]

  );





  const orderedOrders = useMemo(

    ()=>getOrderedOrders(orders),

    [orders]

  );







  const unreadNotifications = useMemo(()=>{


    return pendingOrders.filter(

      (order)=>
        !order.notificationRead

    );


  },[pendingOrders]);









  // ============================
  // BLOKADA
  // ============================


  if(checking){


    return (

      <main className="admin-page">

        <section className="dashboard">

          Sprawdzanie uprawnień...

        </section>

      </main>

    );


  }







  if(!authorized){


    return (

      <main className="admin-page login-view">


        <section className="login-card">


          <h1>
            Brak dostępu
          </h1>


          <p>
            Konto administratora jest wymagane.
          </p>


          <button

            className="admin-button"

            onClick={goBack}

          >

            Wróć

          </button>



        </section>


      </main>

    );


  }











  return (

    <main className="admin-page">


      <AdminSidebar

        activeTab={activeTab}

        setActiveTab={setActiveTab}

        pendingCount={pendingOrders.length}

        orderedCount={orderedOrders.length}

        unreadNotificationsCount={
          unreadNotifications.length
        }

        goBack={goBack}

        logout={logout}

        goToEvents={goToEvents}

      />







      <section className="dashboard">


        <p className="dashboard-eyebrow">

          GB Zakupy

        </p>




        <h1>
          Dashboard
        </h1>







        <AdminStats

          allCount={orders.length}

          pendingCount={pendingOrders.length}

          orderedCount={orderedOrders.length}

        />









        {loading && (

          <div className="empty-admin-box">

            Ładowanie danych...

          </div>

        )}










        {!loading && activeTab === 'lista' && (

          <AdminShoppingList

            orders={pendingOrders}

          />

        )}









        {!loading &&
        activeTab === 'powiadomienia' && (

          <AdminNotifications

            orders={pendingOrders}

          />

        )}









        {!loading &&
        activeTab === 'zrealizowane' && (

          <AdminCompletedList

            orders={orderedOrders}

          />

        )}









        {!loading &&
        activeTab === 'dziennik' && (

          <AdminEventLog

            logs={logs}

          />

        )}







      </section>


    </main>


  );


}
