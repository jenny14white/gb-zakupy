import "../../styles/admin-dashboard.css";


export default function AdminStats({
    allCount,
    pendingCount,
    acceptedCount,
    completedCount,
}){
    const stats=[
        {
            icon:"📋",
            label:"Wszystkie zgłoszenia",
            value:allCount,
        },
        {
            icon:"🟡",
            label:"Oczekujące",
            value:pendingCount,
        },
        {
            icon:"🟢",
            label:"Przyjęte do realizacji",
            value:acceptedCount,
        },
        {
            icon:"🟣",
            label:"Zrealizowane",
            value:completedCount,
        },
    ];

    return(
        <section className="stats">

            {stats.map(item=>(

                <article
                    key={item.label}
                    className="stat-card"
                >

                    <div className="stat-icon">
                        {item.icon}
                    </div>

                    <strong>
                        {item.value}
                    </strong>

                    <span>
                        {item.label}
                    </span>

                </article>

            ))}

        </section>
    );
}
