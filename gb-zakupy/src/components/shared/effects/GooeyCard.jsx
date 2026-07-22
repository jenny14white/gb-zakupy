export default function GooeyCard({
    title,
    description,
    onClick
}) {


return (

<button

    className="gooey-card"

    onClick={onClick}

>



    <div className="gooey-glow"></div>





    <div className="gooey-content">





        <div className="gooey-line"></div>





        <h3>

            {title}

        </h3>






        <p>

            {description}

        </p>






        <span className="gooey-arrow">

            →

        </span>





    </div>





</button>


);


}
