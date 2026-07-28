import { useState } from "react";
import { useTranslation } from "react-i18next";

import { createOrder } from "../../services/ordersService";
import { UNITS } from "../../utils/constants";

export default function ShoppingForm() {

    const { t } = useTranslation();

    const [requestedBy,setRequestedBy] = useState("");
    const [product,setProduct] = useState("");
    const [quantity,setQuantity] = useState("1");
    const [unit,setUnit] = useState("szt.");
    const [message,setMessage] = useState("");
    const [isError,setIsError] = useState(false);
    const [loading,setLoading] = useState(false);

    async function handleSubmit(event){

        event.preventDefault();

        if(loading)
            return;

        const amount = Number(quantity);

        if(
            !requestedBy.trim() ||
            !product.trim() ||
            !amount ||
            amount < 1
        ){

            setIsError(true);

            setMessage(
                t("shopping.form.errors.required")
            );

            return;

        }

        try{

            setLoading(true);
            setIsError(false);

            await createOrder({
                requestedBy: requestedBy.trim(),
                product: product.trim(),
                quantity: amount,
                unit,
            });


            setMessage(
                `${t("shopping.form.success")} ${product}`
            );

            setProduct("");
            setQuantity("1");
            setUnit("szt.");


            setTimeout(
                ()=>setMessage(""),
                3500
            );


        }catch(error){

            console.error(error);

            setIsError(true);

            setMessage(
                t("shopping.form.errors.addFailed")
            );


        }finally{

            setLoading(false);

        }

    }


    return (

        <form
            className="shopping-form"
            onSubmit={handleSubmit}
        >

            {message && (

                <div
                    className={
                        isError
                            ? "error-message"
                            : "success-message"
                    }
                >
                    {message}
                </div>

            )}


            <label>

                {t("shopping.form.name")} *

                <input
                    value={requestedBy}
                    onChange={e =>
                        setRequestedBy(e.target.value)
                    }
                    placeholder={
                        t("shopping.form.placeholders.name")
                    }
                />

            </label>


            <label>

                {t("shopping.form.product")} *

                <textarea
                    rows="4"
                    value={product}
                    onChange={e =>
                        setProduct(e.target.value)
                    }
                    placeholder={
                        t("shopping.form.placeholders.product")
                    }
                />

            </label>


            <div className="form-row">

                <label>

                    {t("shopping.form.quantity")} *

                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={e =>
                            setQuantity(e.target.value)
                        }
                    />

                </label>


                <label>

                    {t("shopping.form.unit")}

                    <select
                        value={unit}
                        onChange={e =>
                            setUnit(e.target.value)
                        }
                    >

                        {UNITS.map(item => (

                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>

                        ))}

                    </select>

                </label>

            </div>


            <button
                className="submit-button"
                disabled={loading}
            >

                {loading
                    ? t("shopping.form.loading")
                    : t("shopping.form.submit")}

            </button>

        </form>

    );

}
