import { useTranslation } from "react-i18next";

import Calendar from "../components/calendar/Calendar";


export default function CalendarPage({
    goBack,
}) {

    const { t } = useTranslation();

    const year =
        new Date().getFullYear();


    return (

        <main className="calendar-page">


            <header className="calendar-page-header">


                <button
                    type="button"
                    className="back-button"
                    onClick={goBack}
                >
                    ← {t("calendar.page.back")}
                </button>



                <div className="calendar-header-top">


                    <p className="calendar-eyebrow">
                        GB Sekretariat
                    </p>


                    <h1>
                        {t("calendar.page.title")}
                    </h1>


                    <p className="calendar-description">
                        {t("calendar.page.description")}
                    </p>


                </div>


            </header>



            <section className="calendar-container">

                <Calendar year={year} />

            </section>


        </main>

    );

}
