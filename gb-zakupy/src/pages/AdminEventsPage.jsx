import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";

import AdminCalendar from "../components/admin/AdminCalendar";

import {
    createEvent,
    deleteEvent,
    listenToEvents,
    updateEvent,
} from "../services/calendarService";

import "../styles/admin-events.css";


const ADMIN_UID =
    "kRulgEcxNed8aYacTWq3j9GgP4J2";


const TYPES = [
    "meeting",
    "birthday",
    "company",
    "vacation",
    "holiday",
    "other",
];


const EMOJIS = [
    "📅",
    "🤝",
    "🎂",
    "🎉",
    "🏖️",
    "📢",
    "🚚",
    "🎄",
    "🇵🇱",
    "❤️",
    "⭐",
];


const EMPTY_FORM = {
    title:"",
    description:"",
    date:"",
    time:"",
    location:"",
    type:"meeting",
    emoji:"📅",
    recurring:false,
};



export default function AdminEventsPage({
    goBack,
}) {

    const { t } = useTranslation();

    const [authorized,setAuthorized] =
        useState(false);

    const [checking,setChecking] =
        useState(true);

    const [events,setEvents] =
        useState([]);

    const [editingId,setEditingId] =
        useState(null);

    const [form,setForm] =
        useState(EMPTY_FORM);



    useEffect(()=>{

        const unsubscribe =
            onAuthStateChanged(
                auth,
                user=>{

                    setAuthorized(
                        Boolean(
                            user &&
                            user.uid === ADMIN_UID
                        )
                    );

                    setChecking(false);

                }
            );

        return unsubscribe;

    },[]);



    useEffect(()=>{

        if(!authorized)
            return;

        return listenToEvents(setEvents);

    },[authorized]);



    const stats = useMemo(()=>{

        const now = new Date();

        return {

            all:events.length,

            recurring:
                events.filter(
                    event=>event.recurring
                ).length,

            upcoming:
                events.filter(event=>{

                    const date =
                        event.date?.toDate?.() ??
                        new Date(event.date);

                    return date >= now;

                }).length,

        };

    },[events]);



    function handleChange(event){

        const {
            name,
            value,
            checked,
            type,
        } = event.target;


        setForm(prev=>({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,

        }));

    }



    async function handleSubmit(event){

        event.preventDefault();


        if(!form.title.trim()){

            alert(
                t("admin.events.errors.titleRequired")
            );

            return;

        }


        if(!form.date){

            alert(
                t("admin.events.errors.dateRequired")
            );

            return;

        }


        try{

            const payload = {
                ...form,
                date:new Date(form.date),
            };


            if(editingId){

                await updateEvent(
                    editingId,
                    payload
                );

            }else{

                await createEvent(
                    payload
                );

            }


            setEditingId(null);
            setForm(EMPTY_FORM);


        }catch(error){

            console.error(error);

            alert(
                t("admin.events.errors.saveFailed")
            );

        }

    }



    function editEvent(event){

        const date =
            event.date?.toDate?.() ??
            new Date(event.date);


        setEditingId(event.id);


        setForm({

            title:event.title || "",

            description:event.description || "",

            location:event.location || "",

            date:
                date.toISOString()
                .split("T")[0],

            time:event.time || "",

            type:event.type || "meeting",

            emoji:event.emoji || "📅",

            recurring:Boolean(
                event.recurring
            ),

        });


        window.scrollTo({
            top:0,
            behavior:"smooth",
        });

    }



    async function removeEvent(id){

        if(
            !window.confirm(
                t("admin.events.confirmDelete")
            )
        ){
            return;
        }


        try{

            await deleteEvent(id);

        }catch(error){

            console.error(error);

            alert(
                t("admin.events.errors.deleteFailed")
            );

        }

    }



    if(checking){

        return (

            <main className="admin-events-page">

                <section className="admin-events-card loading-card">

                    <h2>
                        🔐 {t("admin.events.checkingAccess")}
                    </h2>

                </section>

            </main>

        );

    }



    if(!authorized){

        return (

            <main className="admin-events-page">

                <section className="admin-events-card">

                    <h1>
                        🔒 {t("admin.events.noAccess.title")}
                    </h1>

                    <p>
                        {t("admin.events.noAccess.description")}
                    </p>

                    <button
                        className="back-button"
                        onClick={goBack}
                    >
                        ← {t("common.back")}
                    </button>

                </section>

            </main>

        );

    }



    return (

        <main className="admin-events-page">


            <header className="admin-events-header">

                <div>

                    <p className="admin-events-eyebrow">
                        GB Portal
                    </p>

                    <h1>
                        📅 {t("admin.events.title")}
                    </h1>

                    <p className="admin-events-description">
                        {t("admin.events.description")}
                    </p>

                </div>


                <button
                    className="back-button"
                    onClick={goBack}
                >
                    ← {t("common.back")}
                </button>

            </header>



            <section className="events-top">


                <section className="admin-events-card form-card">

                    <h2>

                        {editingId
                            ? `✏️ ${t("admin.events.editEvent")}`
                            : `➕ ${t("admin.events.newEvent")}`}

                    </h2>



                    <form
                        className="event-form"
                        onSubmit={handleSubmit}
                    >

                        <input
                            name="title"
                            value={form.title}
                            placeholder={t("admin.events.placeholders.title")}
                            onChange={handleChange}
                        />


                        <input
                            name="location"
                            value={form.location}
                            placeholder={t("admin.events.placeholders.location")}
                            onChange={handleChange}
                        />


                        <textarea
                            name="description"
                            value={form.description}
                            placeholder={t("admin.events.placeholders.description")}
                            onChange={handleChange}
                        />


                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                        />


                        <input
                            type="time"
                            name="time"
                            value={form.time}
                            onChange={handleChange}
                        />


                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                        >

                            {TYPES.map(type=>(

                                <option
                                    key={type}
                                    value={type}
                                >
                                    {t(`calendar.eventTypes.${type}`)}
                                </option>

                            ))}

                        </select>



                        <select
                            name="emoji"
                            value={form.emoji}
                            onChange={handleChange}
                        >

                            {EMOJIS.map(icon=>(

                                <option
                                    key={icon}
                                    value={icon}
                                >
                                    {icon}
                                </option>

                            ))}

                        </select>



                        <label className="checkbox-row">

                            <input
                                type="checkbox"
                                name="recurring"
                                checked={form.recurring}
                                onChange={handleChange}
                            />

                            {t("admin.events.fields.recurring")}

                        </label>



                        <button
                            className="save-event-button"
                            type="submit"
                        >

                            {editingId
                                ? `💾 ${t("admin.events.saveChanges")}`
                                : `➕ ${t("admin.events.addEvent")}`}

                        </button>


                    </form>


                </section>



                <aside className="events-stats">


                    <div className="event-stat-card">
                        <span className="stat-number">
                            {stats.all}
                        </span>
                        <span className="stat-label">
                            {t("admin.events.stats.all")}
                        </span>
                    </div>


                    <div className="event-stat-card">
                        <span className="stat-number">
                            {stats.recurring}
                        </span>
                        <span className="stat-label">
                            {t("admin.events.stats.recurring")}
                        </span>
                    </div>


                    <div className="event-stat-card">
                        <span className="stat-number">
                            {stats.upcoming}
                        </span>
                        <span className="stat-label">
                            {t("admin.events.stats.upcoming")}
                        </span>
                    </div>


                </aside>


            </section>



            <section className="calendar-wrapper">

                <AdminCalendar
                    events={events}
                    onEdit={editEvent}
                    onDelete={removeEvent}
                />

            </section>


        </main>

    );

}
