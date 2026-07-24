export default function AdminStats({
    allCount,
    pendingCount,
    acceptedCount,
    completedCount,
}) {

    
    const stats = [
        {
            icon: "📋",
            label: "Wszystkie zgłoszenia",
            value: allCount,
        },
        {
            icon: "🟡",
            label: "Oczekujące",
            value: pendingCount,
        },
        {
            icon: "🟢",
            label: "Przyjęte do realizacji",
            value: acceptedCount,
        },
        {
            icon: "🟣",
            label: "Zrealizowane",
            value: completedCount,
        },
    ];

    return (

        <section className="stats">

            {stats.map(({ icon, label, value }) => (

                <article
                    key={label}
                    className="stat-card"
                >

                    <strong>

                        {value}

                    </strong>

                    <span>

                        {icon} {label}

                    </span>

                </article>

            ))}

        </section>

    );

}
