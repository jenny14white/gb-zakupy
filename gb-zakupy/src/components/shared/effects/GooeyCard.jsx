export default function GooeyCard({
    icon,
    title,
    description,
    onClick
}) {


return (

<button
className="gooey-card"
onClick={onClick}
>


<div className="gooey-blob blob-one"></div>
<div className="gooey-blob blob-two"></div>


<div className="gooey-content">


<div className="gooey-icon">
{icon}
</div>



<h3>
{title}
</h3>


<p>
{description}
</p>


</div>


</button>

);


}
