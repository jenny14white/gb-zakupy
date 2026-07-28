function toDate(value){

    if(!value)
        return new Date();

    if(value instanceof Date)
        return value;

    if(typeof value?.toDate==="function")
        return value.toDate();

    return new Date(value);

}

function formatGoogleDate(date){

    return date
        .toISOString()
        .replace(/[-:]/g,"")
        .replace(/\.\d{3}/,"");

}

function createDates(event){

    const start=
        toDate(event.date);

    const end=
        new Date(start);

    if(event.time){

        const parts=
            String(event.time)
                .split(":");

        if(parts.length>=2){

            start.setHours(
                Number(parts[0]),
                Number(parts[1]),
                0,
                0
            );

            end.setHours(
                Number(parts[0]),
                Number(parts[1])+60,
                0,
                0
            );

        }else{

            end.setHours(
                start.getHours()+1
            );

        }

    }else{

        end.setDate(
            end.getDate()+1
        );

    }

    return{
        start,
        end,
    };

}

export function addToGoogle(event){

    const{
        start,
        end,
    }=createDates(event);

    const url=
        "https://calendar.google.com/calendar/render?action=TEMPLATE"+
        "&text="+encodeURIComponent(event.title||"")+
        "&dates="+
        formatGoogleDate(start)+
        "/"+
        formatGoogleDate(end)+
        "&details="+encodeURIComponent(
            event.description||""
        )+
        "&location="+encodeURIComponent(
            event.location||""
        );

    window.open(
        url,
        "_blank"
    );

}

function downloadICS(event,fileName){

    const{
        start,
        end,
    }=createDates(event);

    const ics=
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GB Portal//Calendar//PL
BEGIN:VEVENT
UID:${Date.now()}@gbportal
DTSTAMP:${formatGoogleDate(new Date())}
DTSTART:${formatGoogleDate(start)}
DTEND:${formatGoogleDate(end)}
SUMMARY:${event.title||""}
DESCRIPTION:${event.description||""}
LOCATION:${event.location||""}
END:VEVENT
END:VCALENDAR`;

    const blob=
        new Blob(
            [ics],
            {
                type:"text/calendar;charset=utf-8",
            }
        );

    const url=
        URL.createObjectURL(blob);

    const link=
        document.createElement("a");

    link.href=url;

    link.download=fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

export function addToApple(event){

    downloadICS(
        event,
        "event-apple.ics"
    );

}

export function addToOutlook(event){

    downloadICS(
        event,
        "event-outlook.ics"
    );

}
