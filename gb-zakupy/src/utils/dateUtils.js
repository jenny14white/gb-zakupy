export function getDateObject(value){

    if(!value)
        return null;


    if(typeof value.toDate === "function"){
        return value.toDate();
    }


    if(value instanceof Date){
        return value;
    }


    const date =
        new Date(value);


    return Number.isNaN(
        date.getTime()
    )
        ? null
        : date;

}



export function formatDate(value){

    const date =
        getDateObject(value);


    if(!date)
        return "";


    return date.toLocaleString(
        "pl-PL"
    );

}



export function getMonthYear(value){

    const date =
        getDateObject(value);


    if(!date)
        return "Bez daty";


    return date.toLocaleDateString(
        "pl-PL",
        {
            month:"long",
            year:"numeric",
        }
    );

}



export function sortByDateDesc(
    items = [],
    fieldName
){

    return [...items].sort(
        (a,b)=>{

            const dateA =
                getDateObject(
                    a[fieldName]
                )?.getTime() || 0;


            const dateB =
                getDateObject(
                    b[fieldName]
                )?.getTime() || 0;


            return dateB - dateA;

        }
    );

}
