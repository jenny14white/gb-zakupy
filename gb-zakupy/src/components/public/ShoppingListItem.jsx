import { useTranslation } from "react-i18next";

import { formatDate } from "../../utils/dateUtils";
import { ORDER_STATUS } from "../../utils/constants";

export default function ShoppingListItem({ item }) {

    const { t } = useTranslation();


    function getStatus(){

        switch(item.status){

            case ORDER_STATUS.PENDING:
                return t("shopping.status.pending");

            case ORDER_STATUS.ACCEPTED:
                return t("shopping.status.accepted");

            case ORDER_STATUS.COMPLETED:
                return t("shopping.status.completed");

            default:
                return item.status;

        }

    }


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
                        : item.status === ORDER_STATUS.COMPLETED
                        ? "completed"
                        : "pending"
                }`}
            >
                {getStatus()}
            </div>

        </article>

    );

}
