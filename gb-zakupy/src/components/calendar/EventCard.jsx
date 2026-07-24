const EVENT_TYPES = {
    company:"company",
    firma:"company",
    holiday:"holiday",
    święto:"holiday",
    birthday:"birthday",
    urodziny:"birthday",
    meeting:"meeting",
    spotkanie:"meeting",
    vacation:"vacation",
    urlop:"vacation",
};


function safeText(value,language){

    if(value == null)
        return "";

    if(typeof value === "string")
        return value;

    if(typeof value === "number")
        return String(value);

    if(value instanceof Date)
        return value.toLocaleDateString(language);

    if(typeof value?.toDate === "function")
        return value
            .toDate()
            .toLocaleDateString(language);

    return "";

}



export default function EventCard({
    event,
}) {

    const { t,i18n } = useTranslation();


    const language =
        i18n.language;


    const title =
        safeText(
            event.title,
            language
        );


    const type =
        EVENT_TYPES[
            safeText(
                event.type,
                language
            ).toLowerCase()
        ] || "other";


    const emoji =
        safeText(
            event.emoji,
            language
        );


    const time =
        safeText(
            event.time,
            language
        );


    const location =
        safeText(
            event.location,
            language
        );


    const description =
        safeText(
            event.description,
            language
        );


    const formattedDate =
        safeText(
            event.date,
            language
        );



    const badge =
        t(
            `calendar.eventTypes.${type}`
        );



    return (

        <article
            className={
                `event-card ${type}`
            }
        >


            <div className="event-card-header">


                <h3 className="event-title">


                    {emoji && (

                        <span className="event-emoji">

                            {emoji}

                        </span>

                    )}


                    {title}


                </h3>



                <span
                    className={
                        `event-badge ${type}`
                    }
                >

                    {badge}

                </span>


            </div>



            <div className="event-divider" />



            <div className="event-card-body">


                {formattedDate && (

                    <div className="event-row date">

                        <span className="event-icon">
                            📅
                        </span>

                        <span className="event-text">
                            {formattedDate}
                        </span>

                    </div>

                )}



                {time && (

                    <div className="event-row">

                        <span className="event-icon">
                            🕒
                        </span>

                        <span className="event-text">
                            {time}
                        </span>

                    </div>

                )}



                {location && (

                    <div className="event-row">

                        <span className="event-icon">
                            📍
                        </span>

                        <span className="event-text">
                            {location}
                        </span>

                    </div>

                )}



                {description && (

                    <div className="event-description">

                        {description}

                    </div>

                )}


            </div>


        </article>

    );

}
