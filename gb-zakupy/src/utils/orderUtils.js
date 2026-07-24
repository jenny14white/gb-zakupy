import { ORDER_STATUS } from "./constants";
import { getMonthYear, sortByDateDesc } from "./dateUtils";


export function getPendingOrders(orders = []){

    return orders.filter(order =>
        order.status === ORDER_STATUS.PENDING ||
        order.status === ORDER_STATUS.ACCEPTED ||
        order.status === ORDER_STATUS.ORDERED
    );

}


export function getCompletedOrders(orders = []){

    return orders.filter(
        order =>
            order.status === ORDER_STATUS.COMPLETED
    );

}


export function groupOrdersByCompletedMonth(orders = []){

    const groups = {};


    orders.forEach(order=>{

        if(!order.completedAt)
            return;


        const month =
            getMonthYear(
                order.completedAt
            );


        if(!groups[month]){
            groups[month] = [];
        }


        groups[month].push(order);

    });



    return Object.entries(groups)
        .map(([month,items])=>({

            month,

            items:
                sortByDateDesc(
                    items,
                    "completedAt"
                ),

        }))
        .sort((a,b)=>{

            const dateA =
                a.items[0]?.completedAt;

            const dateB =
                b.items[0]?.completedAt;


            return (
                new Date(dateB || 0)
                -
                new Date(dateA || 0)
            );

        });

}


export const groupOrdersByOrderedMonth =
    groupOrdersByCompletedMonth;
