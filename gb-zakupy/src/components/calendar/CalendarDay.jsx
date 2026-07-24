const EVENT_CLASSES = {
    firma:"company",
    company:"company",
    święto:"holiday",
    holiday:"holiday",
    urodziny:"birthday",
    birthday:"birthday",
    spotkanie:"meeting",
    meeting:"meeting",
    urlop:"vacation",
    vacation:"vacation",
};


function getEventClass(type = "") {
    return EVENT_CLASSES[
        type.toLowerCase()
    ] || "other";
}



export default function CalendarDay({
    day,
    isCurrentMonth,
    isToday,
    isSelected,
    isWeekend,
    events = [],
    onClick,
}) {


    const className = [
        "calendar-day",
        !isCurrentMonth && "outside",
        isToday && "today",
        isSelected && "selected",
        isWeekend && "weekend",
    ]
    .filter(Boolean)
    .join(" ");



    function handleKeyDown(event){

        if(
            event.key === "Enter" ||
            event.key === " "
        ){

            event.preventDefault();

            onClick(day);

        }

    }



    return (

        <div
            className={className}
            role="button"
            tabIndex={0}
            onClick={() => onClick(day)}
            onKeyDown={handleKeyDown}
        >


            <div className="calendar-day-number">

                {day.getDate()}

            </div>



            {events.length > 0 && (

                <>


                    <div className="calendar-day-events">


                        {events.slice(0,1).map(
                            (event,index)=>(

                            <div
                                key={
                                    event.id ??
                                    `${event.title}-${index}`
                                }
                                className={
                                    `calendar-event-bubble ${
                                        getEventClass(
                                            event.type
                                        )
                                    }`
                                }
                                title={event.title}
                            >

                                <span className="calendar-event-emoji">

                                    {event.emoji || "📅"}

                                </span>


                                <span className="calendar-event-name">

                                    {event.title}

                                </span>


                            </div>

                        ))}



                        {events.length > 1 && (

                            <div className="calendar-event-more">

                                +{events.length - 1}

                            </div>

                        )}


                    </div>



                    <div className="calendar-mobile-dots">

                        {events.slice(0,5).map(
                            (event,index)=>(

                            <span
                                key={
                                    event.id ??
                                    `${event.title}-dot-${index}`
                                }
                                className={
                                    `calendar-event-dot ${
                                        getEventClass(
                                            event.type
                                        )
                                    }`
                                }
                                title={event.title}
                            />

                        ))}


                    </div>


                </>

            )}


        </div>

    );

}
