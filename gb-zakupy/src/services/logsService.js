import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';


import {
  auth,
  db
} from '../firebase/firebase';





const ADMIN_EMAIL =
  "belacount4@gmail.com";








function checkAdmin(){


  const user = auth.currentUser;



  if(
    !user ||
    user.email !== ADMIN_EMAIL
  ){

    throw new Error(
      "Brak uprawnień administratora"
    );

  }


}









// =================================
// DODAWANIE LOGÓW
// =================================
//
// może działać dla aplikacji
// np. dodanie zamówienia
//
// =================================


export async function addLog(
  message,
  type='info'
){


  await addDoc(

    collection(
      db,
      'logs'
    ),

    {


      message,


      type,


      createdAt:
        serverTimestamp(),


    }


  );


}









// =================================
// ODCZYT LOGÓW ADMINA
// =================================


export function listenToLogs(callback){



  checkAdmin();



  const q = query(

    collection(
      db,
      'logs'
    ),


    orderBy(
      'createdAt',
      'desc'
    ),


    limit(200)


  );





  return onSnapshot(

    q,


    (snapshot)=>{


      const logs =
        snapshot.docs.map(

          (document)=>({


            id:
              document.id,


            ...document.data(),


          })


        );



      callback(logs);



    }


  );



}
