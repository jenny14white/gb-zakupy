import { useTranslation } from "react-i18next";

import { formatDate } from "../../utils/dateUtils";
import { ORDER_STATUS } from "../../utils/constants";

export default function ShoppingListItem({ item }) {

    const { t } = useTranslation();

    return (

        <article className="shopping-item">

            <div className="shopping-item-header">

                <h3>
                    {item.product}
                </h3>

                <span className="shopping-badge">
                    {item.quantity} {item.unit}
                </span>

            </div>

            <div className="shopping-meta">

                <span>
                    👤 {item.requestedBy}
                </span>

                <span>
                    🕒 {formatDate(item.createdAt)}
                </span>

            </div>

            <div
                className={`shopping-status ${
                    item.status === ORDER_STATUS.ACCEPTED
                        ? "accepted"
                        : "pending"
                }`}
            >

                {item.status === ORDER_STATUS.PENDING
                    ? t("shopping.status.pending")
                    : item.status === ORDER_STATUS.ACCEPTED
                    ? t("shopping.status.accepted")
                    : item.status === ORDER_STATUS.COMPLETED
                    ? t("shopping.status.completed")
                    : item.status}

            </div>

            {item.adminComment && (

                <div className="shopping-comment">

                    💬 {item.adminComment}

                </div>

            )}

        </article>

    );

}
