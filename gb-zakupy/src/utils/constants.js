

export const ORDER_STATUS = Object.freeze({

    PENDING: "pending",

    ACCEPTED: "accepted",

    COMPLETED: "completed",

});


export const ORDER_STATUS_LABELS = Object.freeze({

    [ORDER_STATUS.PENDING]:
        "🟡 Oczekujące",

    [ORDER_STATUS.ACCEPTED]:
        "🟢 Przyjęte do realizacji",

    [ORDER_STATUS.COMPLETED]:
        "🟣 Zrealizowane",

});


export const UNITS = Object.freeze([

    "szt.",

    "op.",

    "kpl.",

    "karton",

    "l",

    "kg",

]);
