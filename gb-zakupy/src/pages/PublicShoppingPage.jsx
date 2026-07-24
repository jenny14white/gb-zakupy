import { useTranslation } from "react-i18next";

import PublicHeader from "../components/public/PublicHeader";
import ShoppingForm from "../components/public/ShoppingForm";
import CurrentShoppingList from "../components/public/CurrentShoppingList";

import { usePublicOrders } from "../hooks/usePublicOrders";

const PAPER_HOLES = 12;

export default function PublicShoppingPage({
    goBack,
}) {

    const { t } = useTranslation();

    const {
        orders,
        loading,
    } = usePublicOrders();


    return (
        <main className="public-page">

            <button
                className="back-home-button"
                onClick={goBack}
            >
                ← {t("shopping.page.back")}
            </button>


            <section className="paper">

                <div className="holes">
                    {Array.from({
                        length: PAPER_HOLES,
                    }).map((_, index) => (
                        <span key={index} />
                    ))}
                </div>


                <PublicHeader />


                <div className="shopping-layout">

                    <ShoppingForm />

                    <CurrentShoppingList
                        items={orders}
                        loading={loading}
                    />

                </div>


                <p className="thanks">
                    {t("shopping.page.thanks")}
                </p>

            </section>

        </main>
    );

}
