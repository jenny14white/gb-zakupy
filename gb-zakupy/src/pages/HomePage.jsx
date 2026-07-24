import { useTranslation } from "react-i18next";

import logoGB from "../assets/logo.png";

import GooeyCard from "../components/shared/effects/GooeyCard";

import ThemeSwitcher from "../components/shared/ThemeSwitcher";
import LanguageSwitcher from "../components/shared/LanguageSwitcher";

export default function HomePage({
    goToShopping,
    goToCalendar,
    goToAdmin,
}) {

    const { t } = useTranslation();


    return (

        <main className="home-page">

            <section className="home-container">


                <div className="home-switchers">

                    <LanguageSwitcher />

                    <div className="home-switchers-divider" />

                    <ThemeSwitcher />

                </div>


                <header className="home-header">

                    <div className="home-logo">

                        <img
                            src={logoGB}
                            alt="GB Sp. z o.o."
                        />

                    </div>


                    <h1 className="company-title">
                        GB Sp. z o.o.
                    </h1>


                    <p>
                        {t("home.subtitle")}
                    </p>

                </header>


                <div className="home-options">

                    <GooeyCard
                        title={
                            t(
                                "home.cards.shopping.title"
                            )
                        }
                        description={
                            t(
                                "home.cards.shopping.description"
                            )
                        }
                        onClick={goToShopping}
                    />


                    <GooeyCard
                        title={
                            t(
                                "home.cards.calendar.title"
                            )
                        }
                        description={
                            t(
                                "home.cards.calendar.description"
                            )
                        }
                        onClick={goToCalendar}
                    />


                    <GooeyCard
                        title={
                            t(
                                "home.cards.admin.title"
                            )
                        }
                        description={
                            t(
                                "home.cards.admin.description"
                            )
                        }
                        onClick={goToAdmin}
                    />

                </div>


            </section>

        </main>

    );

}
