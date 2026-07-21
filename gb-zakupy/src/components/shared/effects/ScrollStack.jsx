import {
  useLayoutEffect,
  useRef,
  useCallback
} from "react";

import Lenis from "lenis";

import "./ScrollStack.css";





export function ScrollStackItem({
  children,
  itemClassName = ""
}) {


  return (

    <div
      className={`scroll-stack-card ${itemClassName}`.trim()}
    >

      {children}

    </div>

  );

}









export default function ScrollStack({

  children,

  className = "",

  itemDistance = 80,

  itemStackDistance = 35,

  stackPosition = "20%",

  scaleEndPosition = "10%",

  baseScale = 0.9,

  itemScale = 0.03,

  rotationAmount = 0,

  blurAmount = 0,

  useWindowScroll = true,

  onStackComplete

}) {



  const scrollerRef = useRef(null);

  const cardsRef = useRef([]);

  const lenisRef = useRef(null);

  const frameRef = useRef(null);

  const completedRef = useRef(false);









  const parsePosition = useCallback(
    (value,height)=>{

      if(
        typeof value === "string" &&
        value.includes("%")
      ){

        return (
          parseFloat(value) / 100
        ) * height;

      }


      return Number(value);

    },
    []
  );









  const updateCards = useCallback(()=>{


    const scrollTop =
      useWindowScroll
        ? window.scrollY
        : scrollerRef.current.scrollTop;



    const height =
      window.innerHeight;



    const stackPx =
      parsePosition(
        stackPosition,
        height
      );



    cardsRef.current.forEach(
      (card,index)=>{


        if(!card) return;



        const rect =
          card.getBoundingClientRect();



        const cardTop =
          rect.top + scrollTop;



        const start =
          cardTop - stackPx -
          index * itemStackDistance;



        const progress =
          Math.min(
            1,
            Math.max(
              0,
              (scrollTop - start) / 500
            )
          );



        const scale =
          1 -
          progress *
          (1 - (baseScale + index * itemScale));



        const translate =
          progress *
          index *
          itemStackDistance;



        const rotate =
          rotationAmount *
          progress *
          index;




        let blur = 0;


        if(blurAmount && progress){

          blur =
            index *
            blurAmount *
            progress;

        }





        card.style.transform =

          `
          translate3d(
            0,
            ${translate}px,
            0
          )

          scale(${scale})

          rotate(${rotate}deg)
          `;



        card.style.filter =
          blur
            ? `blur(${blur}px)`
            : "none";





        if(
          index ===
          cardsRef.current.length - 1
        ){

          if(progress > .8){

            if(!completedRef.current){

              completedRef.current=true;

              onStackComplete?.();

            }

          }else{

            completedRef.current=false;

          }

        }


      }

    );


  },[
    stackPosition,
    itemStackDistance,
    itemScale,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    parsePosition,
    onStackComplete
  ]);









  useLayoutEffect(()=>{


    cardsRef.current =
      Array.from(

        useWindowScroll

        ?

        document.querySelectorAll(
          ".scroll-stack-card"
        )

        :

        scrollerRef.current.querySelectorAll(
          ".scroll-stack-card"
        )

      );





    cardsRef.current.forEach(
      (card,index)=>{


        if(
          index <
          cardsRef.current.length - 1
        ){

          card.style.marginBottom =
            `${itemDistance}px`;

        }



        card.style.willChange =
          "transform";



        card.style.transformOrigin =
          "top center";


      }
    );









    const lenis =
      new Lenis({

        smoothWheel:true,

        duration:1.2,

        easing:
          t =>
          1 -
          Math.pow(
            2,
            -10*t
          )

      });





    lenis.on(
      "scroll",
      updateCards
    );




    lenisRef.current=lenis;





    function raf(time){

      lenis.raf(time);

      frameRef.current =
        requestAnimationFrame(
          raf
        );

    }



    frameRef.current =
      requestAnimationFrame(
        raf
      );





    updateCards();







    return ()=>{


      if(frameRef.current){

        cancelAnimationFrame(
          frameRef.current
        );

      }



      lenis.destroy();



      cardsRef.current=[];



    };




  },[
    itemDistance,
    updateCards
  ]);









  return (

    <div

      ref={scrollerRef}

      className={
        `scroll-stack-scroller ${className}`
      }

    >


      <div className="scroll-stack-inner">


        {children}


        <div className="scroll-stack-end"/>


      </div>


    </div>

  );


}
