import Ferrofluid from "../components/shared/effects/Ferrofluid";

import GooeyCard from "../components/shared/effects/GooeyCard";


export default function HomePage({
  goToShopping,
  goToCalendar,
  goToAdmin,
}) {


return (

<main className="home-page">



{/* TŁO */}

<div className="home-background">


<Ferrofluid

colors={[
"#0353a4",
"#023e7d",
"#002855",
"#001845",
"#33415c"
]}


speed={0.18}


scale={1.5}


turbulence={0.8}


fluidity={0.12}


rimWidth={0.25}


sharpness={2}


shimmer={1.5}


glow={2.2}


flowDirection="down"


opacity={0.8}


mouseInteraction={true}


mouseStrength={0.8}


mouseRadius={0.3}


/>


</div>







<section className="home-container">





<div className="home-header">





<div className="home-logo">


<img
src="/src/assets/logo.png"
alt="GB"
/>


</div>






<h1>

GB Sp. z o.o.

</h1>





<p>

Wybierz moduł aplikacji

</p>





</div>









<div className="home-options">





<GooeyCard

icon="📋"

title="Lista zakupowa"

description="Obsługa zamówień na artykuły biurowe i wyposażenie"

onClick={goToShopping}

/>







<GooeyCard

icon="📅"

title="Kalendarz GB"

description="Święta, wydarzenia i spotkania firmowe"

onClick={goToCalendar}

/>








<GooeyCard

icon="👤"

title="Panel admina"

description="Zarządzanie zamówieniami i wydarzeniami"

onClick={goToAdmin}

/>





</div>





</section>





</main>


);


}
