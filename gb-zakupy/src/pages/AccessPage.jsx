import { useEffect,useRef,useState } from "react";
import { useTranslation } from "react-i18next";

import logoGB from "../assets/logo.png";

import LiquidEther from "../components/shared/effects/LiquidEther";

import { loginPortal } from "../firebase/auth";
import { checkAccessCode } from "../services/accessService";


const LIQUID_COLORS = [
    "#0353a4",
    "#023e7d",
    "#002855",
];

const CODE_LENGTH = 5;


export default function AccessPage({
    onSuccess,
}){

    const { t } = useTranslation();

    const [code,setCode] = useState(
        Array(CODE_LENGTH).fill("")
    );

    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);

    const inputs = useRef([]);


    useEffect(()=>{

        inputs.current[0]?.focus();

    },[]);



    function handleChange(value,index){

        if(!/^[a-zA-Z0-9]?$/.test(value))
            return;


        setError("");

        const updated = [...code];

        updated[index] = value;

        setCode(updated);


        if(
            value &&
            index < CODE_LENGTH - 1
        ){

            inputs.current[index + 1]?.focus();

        }

    }



    function handleKeyDown(event,index){

        if(
            event.key === "Backspace" &&
            !code[index] &&
            index > 0
        ){

            inputs.current[index - 1]?.focus();

        }

    }



    async function handleSubmit(event){

        event.preventDefault();


        if(loading)
            return;


        const finalCode =
            code.join("");


        try{

            setLoading(true);
            setError("");


            const valid =
                await checkAccessCode(finalCode);


            if(!valid){

                setError(
                    t("access.errors.invalidCode")
                );

                return;

            }


            await loginPortal();


            sessionStorage.setItem(
                "gbAccess",
                "true"
            );


            sessionStorage.setItem(
                "gbLastActivity",
                Date.now()
            );


            onSuccess();


        }catch(error){

            console.error(
                "Access error:",
                error
            );


            setError(
                t("access.errors.connection")
            );


        }finally{

            setLoading(false);

        }

    }



    return (

        <main className="access-page">

            <div className="access-background">

                <LiquidEther
                    colors={LIQUID_COLORS}
                    mouseForce={20}
                    cursorSize={60}
                    isViscous
                    viscous={18}
                    iterationsViscous={16}
                    iterationsPoisson={16}
                    resolution={0.35}
                    isBounce={false}
                    autoDemo
                    autoSpeed={0.35}
                    autoIntensity={1.4}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />

            </div>


            <section className="access-card">


                <div className="access-logo">

                    <img
                        src={logoGB}
                        alt="GB Sp. z o.o."
                    />

                </div>


                <h1 className="company-title">
                    GB Sp. z o.o.
                </h1>


                <p className="access-subtitle shader-text">
                    {t("access.subtitle")}
                </p>


                <form
                    className="access-form"
                    onSubmit={handleSubmit}
                >

                    <label>
                        {t("access.codeLabel")}
                    </label>


                    <div className="code-boxes">

                        {code.map((item,index)=>(

                            <input
                                key={index}
                                ref={element =>
                                    inputs.current[index] = element
                                }
                                type="password"
                                maxLength="1"
                                value={item}
                                onChange={event =>
                                    handleChange(
                                        event.target.value,
                                        index
                                    )
                                }
                                onKeyDown={event =>
                                    handleKeyDown(
                                        event,
                                        index
                                    )
                                }
                            />

                        ))}

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? t("access.connecting")
                            : t("access.enter")}

                    </button>


                </form>


                {error && (

                    <p className="access-error">
                        {error}
                    </p>

                )}


            </section>

        </main>

    );

}
