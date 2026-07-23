import { useState } from "react";
import { useTranslation } from "react-i18next";

import Calendar from "../components/calendar/Calendar";

export default function CalendarPage({
    goBack,
}) {

    const { t } = useTranslation();

    const [year] = useState(
        new Date().getFullYear()
    );

    return (

        <main className="calendar-page">

            <header className="calendar-page-header">

                <button
                    type="button"
                    className="back-button"
                    onClick={goBack}
                >
                    ← {t("common.mainMenu")}
                </button>

                <div className="calendar-header-top">

                    <p className="calendar-eyebrow">
                        GB Sekretariat
                    </p>

                    <h1>
                        {t("calendar.title")}
                    </h1>

                    <p className="calendar-description">
                        {t("calendar.description")}
                    </p>

                </div>

            </header>

            <section className="calendar-container">

                <Calendar year={year} />

            </section>

        </main>

    );

}
