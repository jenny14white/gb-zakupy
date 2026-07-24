export default function EmptyState({
    icon = "📭",
    title,
    children,
}) {

    return (

        <div className="empty-state">

            <div className="empty-state-icon">
                {icon}
            </div>


            {title && (
                <h3>
                    {title}
                </h3>
            )}


            <div className="empty-state-content">
                {children}
            </div>

        </div>

    );

}
