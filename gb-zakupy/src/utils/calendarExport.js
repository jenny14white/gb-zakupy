function toDate(value){
    if(!value)return new Date();
    if(value instanceof Date)return value;
    if(typeof value?.toDate==="function")return value.toDate();
    return new Date(value);
}
function pad(value){
    return String(value).padStart(2,"0");
}
function formatICSDate(date){
    return date.getUTCFullYear()+pad(date.getUTCMonth()+1)+pad(date.getUTCDate())+"T"+pad(date.getUTCHours())+pad(date.getUTCMinutes())+pad(date.getUTCSeconds())+"Z";
}
function formatGoogleDate(date){
    return formatICSDate(date);
}
function applyTime(date,time){
    if(!time)return;
    const[hour,minute]=String(time).split(":").map(Number);
    date.setHours(Number.isFinite(hour)?hour:0,Number.isFinite(minute)?minute:0,0,0);
}
function createDates(event){
    const start=toDate(event.date);
    const endDate=event.endDate?toDate(event.endDate):new Date(start);
    if(event.time){
        applyTime(start,event.time);
        if(event.endTime){
            applyTime(endDate,event.endTime);
        }else{
            applyTime(endDate,event.time);
            endDate.setHours(endDate.getHours()+1);
        }
        return{start,end:endDate};
    }
    start.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);
    endDate.setDate(endDate.getDate()+1);
    return{start,end:endDate};
}
export function addToGoogle(event){
    const{start,end}=createDates(event);
    const url="https://calendar.google.com/calendar/render?action=TEMPLATE"+
        "&text="+encodeURIComponent(event.title||"")+
        "&dates="+formatGoogleDate(start)+"/"+formatGoogleDate(end)+
        "&details="+encodeURIComponent(event.description||"")+
        "&location="+encodeURIComponent(event.location||"");
    window.open(url,"_blank","noopener,noreferrer");
}
function escapeICS(value){
    return String(value||"").replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/;/g,"\\;").replace(/,/g,"\\,");
}
function downloadICS(event,fileName){
    const{start,end}=createDates(event);
    const ics=`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GB Portal//Calendar//PL
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@gbportal
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:${escapeICS(event.title)}
DESCRIPTION:${escapeICS(event.description)}
LOCATION:${escapeICS(event.location)}
END:VEVENT
END:VCALENDAR`;
    const blob=new Blob([ics],{type:"text/calendar;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;
    link.download=fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
export function addToApple(event){
    downloadICS(event,"event.ics");
}
export function addToOutlook(event){
    downloadICS(event,"event.ics");
}
