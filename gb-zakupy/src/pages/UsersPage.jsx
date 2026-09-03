import {
    useEffect,
    useState,
} from "react";

import {
    collection,
    onSnapshot,
    query,
} from "firebase/firestore";

import {
    db,
} from "../firebase/firebase";


const USERS = {

    "kRulgEcxNed8aYacTWq3j9GgP4J2":{
        name:"Liliana Szymikowska",
        email:"—",
        role:"Administrator",
    },

    "474lDJntS0agRKyLcnHTXfEf58n1":{
        name:"Sekretariat",
        email:"gbfaktury@grupabinko.pl",
        role:"Sekretariat",
    },

};


function formatLastLogin(timestamp){

    if(!timestamp){
        return "Brak danych";
    }


    const date =
        timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);


    return date.toLocaleString(
        "pl-PL",
        {
            day:"2-digit",
            month:"2-digit",
            year:"numeric",
            hour:"2-digit",
            minute:"2-digit",
        }
    );

}


export default function UsersPage(){

    const [users,setUsers] =
        useState({});


    useEffect(()=>{

        const usersQuery =
            query(
                collection(
                    db,
                    "users"
                )
            );


        const unsubscribe =
            onSnapshot(
                usersQuery,
                snapshot=>{

                    const data={};


                    snapshot.forEach(
                        item=>{

                            data[item.id] =
                                item.data();

                        }
                    );


                    setUsers(data);

                },
                error=>{

                    console.error(
                        "Błąd pobierania użytkowników:",
                        error
                    );

                }
            );


        return unsubscribe;

    },[]);



    return (

        <section className="users-page">

            <div className="users-page-header">

                <div>

                    <span className="dashboard-eyebrow">
                        ADMINISTRACJA
                    </span>

                    <h2>
                        Użytkownicy
                    </h2>

                    <p>
                        Konta posiadające dostęp do panelu
                        administracyjnego.
                    </p>

                </div>

            </div>


            <div className="users-list">

                {Object.entries(USERS).map(
                    ([uid,defaultUser])=>{

                        const user =
                            users[uid] || {};


                        const name =
                            user.name ||
                            defaultUser.name;


                        const email =
                            user.email ||
                            defaultUser.email;


                        const role =
                            user.role ||
                            defaultUser.role;


                        const lastLogin =
                            user.lastLoginAt;


                        return (

                            <article
                                className="user-card"
                                key={uid}
                            >

                                <div className="user-card-avatar">
                                    👤
                                </div>


                                <div className="user-card-main">

                                    <div className="user-card-title">

                                        <h3>
                                            {name}
                                        </h3>

                                        {role === "admin" ||
                                        role === "Administrator" ? (

                                            <span className="user-role admin">
                                                Administrator
                                            </span>

                                        ) : (

                                            <span className="user-role">
                                                Sekretariat
                                            </span>

                                        )}

                                    </div>


                                    <p>
                                        {email}
                                    </p>


                                    <small>
                                        UID: {uid}
                                    </small>

                                </div>


                                <div className="user-card-login">

                                    <span>
                                        Ostatnie logowanie
                                    </span>

                                    <strong>
                                        {formatLastLogin(
                                            lastLogin
                                        )}
                                    </strong>

                                </div>

                            </article>

                        );

                    }
                )}

            </div>

        </section>

    );

}
