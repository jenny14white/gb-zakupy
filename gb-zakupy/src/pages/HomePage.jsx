import logoGB from "../assets/logo.png";

import GooeyCard from "../components/shared/effects/GooeyCard";


export default function HomePage({

  goToShopping,

  goToCalendar,

  goToAdmin,

}) {


return (


<main className="home-page">





<section className="home-container">







<header className="home-header">





<div className="home-logo">


<img

src={logoGB}

alt="GB Sp. z o.o."

/>


</div>







<h1 className="company-title">


GB Sp. z o.o.


</h1>








<p>

Portal wewnętrzny firmy
  (nowe funkcje już niedługo!)

</p>






</header>









<div className="home-options">







<GooeyCard


title="Lista zakupowa"


description="Obsługa zamówień na artykuły biurowe i wyposażenie"


onClick={goToShopping}


/>










<GooeyCard


title="Kalendarz GB"


description="Święta, wydarzenia i spotkania firmowe"


onClick={goToCalendar}


/>










<GooeyCard


title="Panel admina"


description="Zarządzanie zamówieniami i wydarzeniami"


onClick={goToAdmin}


/>






</div>








</section>







</main>


);


}
