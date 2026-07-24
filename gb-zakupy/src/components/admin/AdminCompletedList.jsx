import { useMemo, useState } from "react";
import * as XLSX from "xlsx";

import EmptyState from "../shared/EmptyState";
import AdminMonthGroup from "./AdminMonthGroup";

import { groupOrdersByOrderedMonth } from "../../utils/orderUtils";
import { formatDate } from "../../utils/dateUtils";
import { ORDER_STATUS } from "../../utils/constants";

function normalize(text = "") {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ł/g, "l");
}

export default function AdminCompletedList({ orders }) {

    const [search, setSearch] = useState("");

    const completedOrders = useMemo(
        () =>
            orders.filter(
                order => order.status === ORDER_STATUS.COMPLETED
            ),
        [orders]
    );

    const filteredGroups = useMemo(() => {

        const groups =
            groupOrdersByOrderedMonth(completedOrders);

        if (!search.trim())
            return groups;

        const phrase = normalize(search);

        return groups
            .map(group => ({
                ...group,
                items: group.items.filter(order =>
                    normalize(order.product).includes(phrase) ||
                    normalize(order.requestedBy).includes(phrase) ||
                    normalize(order.adminComment || "").includes(phrase)
                ),
            }))
            .filter(group => group.items.length);

    }, [completedOrders, search]);

    function exportToExcel() {

        const rows = filteredGroups.flatMap(group =>
            group.items.map(order => ({
                Miesiąc: group.month,
                Produkt: order.product,
                Ilość: order.quantity,
                Jednostka: order.unit,
                Zgłaszający: order.requestedBy,
                Status: "Zrealizowane",
                "Data dodania": formatDate(order.createdAt),
                "Data zamówienia": formatDate(order.orderedAt),
                "Data realizacji": formatDate(order.completedAt),
                "Komentarz admina": order.adminComment || "",
            }))
        );

        if (!rows.length) {
            alert("Brak danych do eksportu.");
            return;
        }

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            XLSX.utils.json_to_sheet(rows),
            "Zrealizowane"
        );

        const today =
            new Date().toISOString().split("T")[0];

        XLSX.writeFile(
            workbook,
            `GB_Zrealizowane_${today}.xlsx`
        );

    }

    return (

        <section className="admin-completed-list">

            <div className="admin-list-header">

                <div>

                    <h2>✅ Zrealizowane</h2>

                    <p>
                        Łącznie zamówień: {completedOrders.length}
                    </p>

                </div>

                <button
                    className="admin-button"
                    onClick={exportToExcel}
                >
                    📊 Eksport Excel
                </button>

            </div>

            <input
                className="search-input"
                type="text"
                placeholder="🔍 Szukaj produktu, osoby lub komentarza..."
                value={search}
                onChange={event => setSearch(event.target.value)}
            />

            {filteredGroups.length === 0 ? (

                <EmptyState>

                    {search
                        ? "Nie znaleziono żadnych zrealizowanych zamówień."
                        : "Nie ma jeszcze zrealizowanych zamówień."}

                </EmptyState>

            ) : (

                <div className="completed-months">

                    {filteredGroups.map(group => (

                        <AdminMonthGroup
                            key={group.month}
                            month={group.month}
                            orders={group.items}
                            autoOpen={Boolean(search)}
                        />

                    ))}

                </div>

            )}

        </section>

    );

}
