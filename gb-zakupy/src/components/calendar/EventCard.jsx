import { useTranslation } from "react-i18next";

export default function EventCard({ event }) {

    const { t, i18n } = useTranslation();

    function safeText(value) {

        if (value == null) return "";

        if (typeof value === "string") return value;

        if (typeof value === "number") return String(value);

        if (value instanceof Date) {
            return value.toLocaleDateString(i18n.language);
        }

        if (typeof value?.toDate === "function") {
            return value
                .toDate()
                .toLocaleDateString(i18n.language);
        }

        return "";

    }

    const title = safeText(event.title);
    const type = safeText(event.type).toLowerCase();
    const emoji = safeText(event.emoji);
    const time = safeText(event.time);
    const location = safeText(event.location);
    const description = safeText(event.description);
    const formattedDate = safeText(event.date);

    function getBadgeText() {

        switch (type) {

            case "company":
            case "firma":
                return t("calendar.eventTypes.company");

            case "holiday":
            case "święto":
                return t("calendar.eventTypes.holiday");

            case "birthday":
            case "urodziny":
                return t("calendar.eventTypes.birthday");

            case "meeting":
            case "spotkanie":
                return t("calendar.eventTypes.meeting");

            case "vacation":
            case "urlop":
                return t("calendar.eventTypes.vacation");

            default:
                return t("calendar.eventTypes.other");

        }

    }

    return (

        <article className={`event-card ${type}`}>

            <div className="event-card-header">

                <h3 className="event-title">

                    {emoji && (
                        <span className="event-emoji">
                            {emoji}
                        </span>
                    )}

                    {title}

                </h3>

                <span className={`event-badge ${type}`}>

                    {getBadgeText()}

                </span>

            </div>

            <div className="event-divider"></div>

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
