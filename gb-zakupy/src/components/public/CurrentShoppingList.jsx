import { useState } from "react";
import { useTranslation } from "react-i18next";

import EmptyState from "../shared/EmptyState";
import ShoppingListItem from "./ShoppingListItem";

export default function CurrentShoppingList({
    items = [],
    loading,
}) {

    const { t } = useTranslation();

    const [expanded, setExpanded] = useState(false);

    return (

        <section className="current-list-wrapper">

            <div className="current-list-header">

                <h2>
                    {t("shopping.currentList.title")}
                </h2>

                {items.length > 1 && (

                    <button
                        className="expand-list-button"
                        onClick={() =>
                            setExpanded((prev) => !prev)
                        }
                    >

                        {expanded
                            ? t("shopping.currentList.collapse")
                            : t("shopping.currentList.expand")}

                    </button>

                )}

            </div>

            {loading && (

                <EmptyState>
                    {t("shopping.currentList.loading")}
                </EmptyState>

            )}

            {!loading && items.length === 0 && (

                <EmptyState>
                    {t("shopping.currentList.empty")}
                </EmptyState>

            )}

            {!loading && items.length > 0 && (

                <div
                    className={
                        expanded
                            ? "shopping-list expanded"
                            : "shopping-list collapsed"
                    }
                >

                    {items.map((item, index) => (

                        <div
                            key={item.id}
                            className="shopping-wave-item"
                            style={{
                                "--delay": `${index * 50}ms`,
                            }}
                        >

                            <ShoppingListItem
                                item={item}
                            />

                        </div>

                    ))}

                </div>

            )}

        </section>

    );

}
