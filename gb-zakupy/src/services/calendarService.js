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


const ADMIN_UIDS = [
    "kRulgEcxNed8aYacTWq3j9GgP4J2",
    "474lDJntS0agRKyLcnHTXfEf58n1",
];


/* =====================================================
   ADMIN CHECK
===================================================== */

function checkAdmin() {

    const user =
        auth.currentUser;


    if (
        !user ||
        !ADMIN_UIDS.includes(user.uid)
    ) {
        throw new Error(
            "Brak uprawnień administratora"
        );
    }

}


/* =====================================================
   TEXT CLEANING
===================================================== */

function cleanText(value = "") {

    return String(value).trim();

}


/* =====================================================
   DATE HELPERS
===================================================== */

function normalizeDate(value) {

    if (!value) {
        return null;
    }


    const date =
        value?.toDate?.() ??
        new Date(value);


    if (
        !(date instanceof Date) ||
        Number.isNaN(date.getTime())
    ) {
        return null;
    }


    return date;

}


function getEventDate(event) {

    const date =
        normalizeDate(event.date);


    return date || new Date(0);

}


function getEventEndDate(event) {

    const startDate =
        getEventDate(event);


    const endDate =
        normalizeDate(event.endDate);


    /*
       Stare wydarzenia nie mają endDate.
       W takim przypadku wydarzenie
       trwa tylko jeden dzień.
    */

    if (!endDate) {
        return startDate;
    }


    return endDate;

}


/* =====================================================
   NORMALIZE EVENT
===================================================== */

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

        endDate:
            event.endDate ||
            event.date ||
            null,

        time:
            event.time || "",

        endTime:
            event.endTime || "",

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


/* =====================================================
   SORT EVENTS
===================================================== */

function sortEvents(events) {

    return events.sort(
        (a, b) =>
            getEventDate(a) -
            getEventDate(b)
    );

}


/* =====================================================
   PREPARE EVENT
===================================================== */

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


    const startDate =
        normalizeDate(data.date);


    if (!startDate) {

        throw new Error(
            "Nieprawidłowa data rozpoczęcia wydarzenia"
        );

    }


    /*
       Jeżeli użytkownik nie poda daty końcowej,
       wydarzenie jest jednodniowe.
    */

    const endDate =
        normalizeDate(data.endDate)
        || startDate;


    /*
       Nie pozwalamy, żeby data końcowa
       była wcześniejsza od początkowej.
    */

    if (
        endDate.getTime() <
        startDate.getTime()
    ) {

        throw new Error(
            "Data zakończenia nie może być wcześniejsza niż data rozpoczęcia"
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
            startDate,

        endDate:
            endDate,

        time:
            cleanText(data.time),

        endTime:
            cleanText(data.endTime),

        location:
            cleanText(data.location),

        emoji:
            cleanText(data.emoji) || "📅",

        recurring:
            Boolean(data.recurring),

    };

}


/* =====================================================
   LISTEN TO EVENTS
===================================================== */

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


/* =====================================================
   GET ALL EVENTS
===================================================== */

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


/* =====================================================
   CHECK DATE IN EVENT RANGE
===================================================== */

function isDateInEventRange(
    date,
    event
) {

    const currentDate =
        new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );


    const startDate =
        getEventDate(event);


    const endDate =
        getEventEndDate(event);


    const normalizedStart =
        new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
        );


    const normalizedEnd =
        new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
        );


    return (
        currentDate.getTime()
            >=
        normalizedStart.getTime()
        &&
        currentDate.getTime()
            <=
        normalizedEnd.getTime()
    );

}


/* =====================================================
   GET EVENTS FOR DATE
===================================================== */

export function getEventsForDate(
    events,
    date
) {

    return events.filter(
        event =>
            isDateInEventRange(
                date,
                event
            )
    );

}


/* =====================================================
   CREATE EVENT
===================================================== */

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


/* =====================================================
   UPDATE EVENT
===================================================== */

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


/* =====================================================
   DELETE EVENT
===================================================== */

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
