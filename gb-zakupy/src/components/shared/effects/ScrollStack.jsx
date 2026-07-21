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

  itemDistance = 100,

  itemScale = 0.03,

  itemStackDistance = 30,

  stackPosition = "20%",

  scaleEndPosition = "10%",

  baseScale = 0.85,

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

  const lastTransforms = useRef(new Map());







  const parsePercentage = useCallback(
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







  const getScroll = useCallback(()=>{

    return useWindowScroll

      ? window.scrollY

      : scrollerRef.current.scrollTop;


  },[useWindowScroll]);







  const updateCards = useCallback(()=>{


    const scrollTop =
      getScroll();



    const height =
      window.innerHeight;



    const stackPx =
      parsePercentage(
        stackPosition,
        height
      );



    const scaleEndPx =
      parsePercentage(
        scaleEndPosition,
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
          cardTop -
          stackPx -
          index *
          itemStackDistance;



        const end =
          cardTop -
          scaleEndPx;





        let progress =
          (scrollTop-start) /
          (end-start);



        progress =
          Math.min(
            1,
            Math.max(
              0,
              progress
            )
          );







        const targetScale =
          baseScale +
          index *
          itemScale;





        const scale =
          1 -
          progress *
          (1-targetScale);






        let translateY = 0;






        const pinEnd =
          cardTop +
          window.innerHeight;






        if(scrollTop >= start){

          translateY =
            scrollTop -
            cardTop +
            stackPx +
            index *
            itemStackDistance;


        }







        let blur = 0;


        if(blurAmount){

          blur =
            Math.max(
              0,
              index *
              blurAmount *
              progress
            );

        }






        const rotation =
          rotationAmount *
          progress *
          index;







        const transform =

          `translate3d(
            0,
            ${translateY}px,
            0
          )
          scale(${scale})
          rotate(${rotation}deg)`;







        const previous =
          lastTransforms.current.get(index);




        if(
          previous !== transform
        ){

          card.style.transform =
            transform;


          card.style.filter =
            blur
              ? `blur(${blur}px)`
              : "none";



          lastTransforms.current.set(
            index,
            transform
          );

        }






        if(
          index ===
          cardsRef.current.length-1
        ){


          if(progress > .9){


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
    getScroll,
    parsePercentage,
    stackPosition,
    scaleEndPosition,
    itemStackDistance,
    itemScale,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete
  ]);









  useLayoutEffect(()=>{


    cardsRef.current =
      Array.from(

        document.querySelectorAll(
          ".scroll-stack-card"
        )

      );






    cardsRef.current.forEach(
      (card,index)=>{


        if(
          index <
          cardsRef.current.length-1
        ){

          card.style.marginBottom =
            `${itemDistance}px`;

        }



        card.style.willChange =
          "transform, filter";


        card.style.transformOrigin =
          "top center";


      }
    );









    const lenis =
      new Lenis({

        duration:1.2,

        smoothWheel:true,

      });





    lenis.on(
      "scroll",
      updateCards
    );




    lenisRef.current =
      lenis;







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


      cancelAnimationFrame(
        frameRef.current
      );


      lenis.destroy();


      cardsRef.current=[];


      lastTransforms.current.clear();


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
