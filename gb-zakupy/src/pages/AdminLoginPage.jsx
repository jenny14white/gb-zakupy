import { useState } from "react";
import { useTranslation } from "react-i18next";

import { loginAdmin } from "../firebase/auth";

import Logo from "../components/shared/Logo";
import LiquidEther from "../components/shared/effects/LiquidEther";


const LIQUID_COLORS = [
    "#0353a4",
    "#023e7d",
    "#002855",
];


export default function AdminLoginPage({
    goBack,
    onLogin,
}) {

    const { t } = useTranslation();

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);



    async function handleLogin(event){

        event.preventDefault();

        if(loading){
            return;
        }


        setError("");


        try{

            setLoading(true);


            const user =
                await loginAdmin(
                    email,
                    password
                );


            onLogin(user);


            setEmail("");
            setPassword("");


        }catch(error){

            console.error(
                "Admin login error:",
                error
            );


            setError(
                t(
                    "admin.login.errors.invalidCredentials"
                )
            );


        }finally{

            setLoading(false);

        }

    }



    return (

        <main className="admin-page login-view">

            <div className="admin-background">

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


            <form
                className="login-card"
                onSubmit={handleLogin}
            >

                <button
                    type="button"
                    className="back-button"
                    onClick={goBack}
                    disabled={loading}
                >
                    {t("shopping.page.back")}
                </button>


                <Logo className="admin-logo" />


                <h1>
                    {t("admin.login.title")}
                </h1>


                <p>
                    {t("admin.login.description")}
                </p>


                <input
                    type="email"
                    placeholder={t("admin.login.email")}
                    value={email}
                    onChange={e =>
                        setEmail(e.target.value)
                    }
                    autoFocus
                    autoComplete="username"
                    required
                />


                <input
                    type="password"
                    placeholder={t("admin.login.password")}
                    value={password}
                    onChange={e =>
                        setPassword(e.target.value)
                    }
                    autoComplete="current-password"
                    required
                />


                {error && (
                    <div className="admin-error">
                        {error}
                    </div>
                )}


                <button
                    type="submit"
                    className="admin-button"
                    disabled={loading}
                >
                    {
                        loading
                            ? t("admin.login.loggingIn")
                            : t("admin.login.login")
                    }
                </button>

            </form>

        </main>

    );

}
