import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import {
    auth,
    db,
} from "../firebase/firebase";


const EVENTS_COLLECTION =
    "events";


const ADMIN_UID =
    "kRulgEcxNed8aYacTWq3j9GgP4J2";



function checkAdmin() {

    const user =
        auth.currentUser;


    if (
        !user ||
        user.uid !== ADMIN_UID
    ) {
        throw new Error(
            "Brak uprawnień administratora"
        );
    }

}



function cleanText(value = "") {

    return String(value).trim();

}



function normalizeEvent(event) {

    return {

        id:
            event.id,


        title:
            event.title || "",


        description:
            event.description || "",


        type:
            event.type || "inne",


        date:
            event.date || null,


        time:
            event.time || "",


        location:
            event.location || "",


        emoji:
            event.emoji || "📅",


        recurring:
            Boolean(event.recurring),


        createdAt:
            event.createdAt || null,


        updatedAt:
            event.updatedAt || null,

    };

}



function getEventDate(event) {

    const date =
        event.date?.toDate?.()
        ??
        new Date(event.date);


    return isNaN(date)
        ? new Date(0)
        : date;

}



function sortEvents(events) {

    return events.sort(
        (a, b) =>
            getEventDate(a) -
            getEventDate(b)
    );

}



function prepareEvent(data) {

    if (
        !cleanText(data.title)
    ) {
        throw new Error(
            "Tytuł wydarzenia jest wymagany"
        );
    }


    if (!data.date) {

        throw new Error(
            "Data wydarzenia jest wymagana"
        );

    }


    return {

        title:
            cleanText(data.title),


        description:
            cleanText(data.description),


        type:
            cleanText(data.type) || "inne",


        date:
            data.date,


        time:
            cleanText(data.time),


        location:
            cleanText(data.location),


        emoji:
            cleanText(data.emoji) || "📅",


        recurring:
            Boolean(data.recurring),

    };

}



export function listenToEvents(callback) {

    return onSnapshot(
        collection(
            db,
            EVENTS_COLLECTION
        ),
        snapshot => {

            const events =
                snapshot.docs.map(
                    document =>
                        normalizeEvent({
                            id: document.id,
                            ...document.data(),
                        })
                );


            callback(
                sortEvents(events)
            );

        }
    );

}



export async function getAllCalendarEvents() {

    const snapshot =
        await getDocs(
            collection(
                db,
                EVENTS_COLLECTION
            )
        );


    const events =
        snapshot.docs.map(
            document =>
                normalizeEvent({
                    id: document.id,
                    ...document.data(),
                })
        );


    return sortEvents(events);

}



export function getEventsForDate(
    events,
    date
) {

    return events.filter(event => {

        const eventDate =
            getEventDate(event);


        return (

            eventDate.getFullYear()
            ===
            date.getFullYear()

            &&

            eventDate.getMonth()
            ===
            date.getMonth()

            &&

            eventDate.getDate()
            ===
            date.getDate()

        );

    });

}



export async function createEvent(data) {

    checkAdmin();


    const event =
        prepareEvent(data);


    await addDoc(
        collection(
            db,
            EVENTS_COLLECTION
        ),
        {

            ...event,

            createdAt:
                serverTimestamp(),

            updatedAt:
                serverTimestamp(),

        }
    );

}



export async function updateEvent(
    id,
    data
) {

    checkAdmin();


    const event =
        prepareEvent(data);


    await updateDoc(
        doc(
            db,
            EVENTS_COLLECTION,
            id
        ),
        {

            ...event,

            updatedAt:
                serverTimestamp(),

        }
    );

}



export async function deleteEvent(id) {

    checkAdmin();


    await deleteDoc(
        doc(
            db,
            EVENTS_COLLECTION,
            id
        )
    );

}
