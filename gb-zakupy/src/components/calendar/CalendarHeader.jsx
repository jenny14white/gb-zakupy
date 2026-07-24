import { useTranslation } from "react-i18next";

export default function CalendarHeader({
    currentDate,
    onPrev,
    onNext,
    onToday,
}) {

    const { t, i18n } = useTranslation();


    const month = currentDate
        .toLocaleDateString(
            i18n.language || "pl-PL",
            {
                month:"long",
            }
        )
        .toUpperCase();


    return (

        <header className="calendar-header">


            <div className="calendar-header-top">


                <div className="calendar-year">

                    {currentDate.getFullYear()}

                </div>


                <h1
                    className="calendar-month"
                    key={month}
                >

                    {month}

                </h1>


                <div className="calendar-divider">

                    <span></span>


                    <div className="calendar-divider-icon">

                        📅

                    </div>


                    <span></span>

                </div>


            </div>



            <div className="calendar-navigation">


                <button
                    type="button"
                    className="calendar-nav-button"
                    onClick={onPrev}
                    aria-label={
                        t(
                            "calendar.navigation.previousMonth"
                        )
                    }
                >

                    ←

                </button>



                <button
                    type="button"
                    className="today-button"
                    onClick={onToday}
                    aria-label={
                        t(
                            "calendar.navigation.today"
                        )
                    }
                >

                    {t("calendar.navigation.today")}

                </button>



                <button
                    type="button"
                    className="calendar-nav-button"
                    onClick={onNext}
                    aria-label={
                        t(
                            "calendar.navigation.nextMonth"
                        )
                    }
                >

                    →

                </button>


            </div>


        </header>

    );

}
