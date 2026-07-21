import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

import "./Ferrofluid.css";


export default function Ferrofluid({

    colors = [
        "#012A4A",
        "#014F86",
        "#2C7DA0"
    ],

    speed = 0.35,

    glow = 2.5

}){


    const containerRef = useRef(null);



    useEffect(()=>{


        const container = containerRef.current;


        if(!container) return;



        const renderer = new Renderer({

            alpha:true,

            antialias:true

        });



        const gl = renderer.gl;



        gl.clearColor(
            0,
            0,
            0,
            0
        );



        const canvas = gl.canvas;



        canvas.style.width="100%";

        canvas.style.height="100%";

        canvas.style.display="block";



        container.appendChild(canvas);





        function hexToRGB(hex){


            const value =
                hex.replace("#","");



            return [

                parseInt(value.substring(0,2),16)/255,

                parseInt(value.substring(2,4),16)/255,

                parseInt(value.substring(4,6),16)/255

            ];


        }





        const c1 =
            hexToRGB(colors[0]);

        const c2 =
            hexToRGB(colors[1]);

        const c3 =
            hexToRGB(colors[2]);







        const vertex = `

        attribute vec2 position;

        attribute vec2 uv;


        varying vec2 vUv;


        void main(){

            vUv = uv;

            gl_Position =
                vec4(position,0.0,1.0);

        }

        `;







        const fragment = `

        precision highp float;


        uniform float iTime;

        uniform float uSpeed;

        uniform float uGlow;


        uniform vec3 color1;

        uniform vec3 color2;

        uniform vec3 color3;


        varying vec2 vUv;




        float wave(vec2 p){


            float x =
                sin(
                    p.x*4.0+iTime*uSpeed
                );


            float y =
                cos(
                    p.y*5.0-iTime*uSpeed
                );


            return x*y;

        }




        void main(){


            vec2 uv=vUv;



            float w =
                wave(
                    uv*3.0
                );



            float mix1 =
                smoothstep(
                    -1.0,
                    1.0,
                    w
                );



            vec3 col =
                mix(
                    color1,
                    color2,
                    mix1
                );



            col =
                mix(
                    col,
                    color3,
                    uv.y
                );



            col *= uGlow;



            float alpha =
                0.75;



            gl_FragColor =
                vec4(
                    col,
                    alpha
                );


        }

        `;







        const program =
            new Program(
                gl,
                {

                    vertex,

                    fragment,


                    uniforms:{


                        iTime:{
                            value:0
                        },


                        uSpeed:{
                            value:speed
                        },


                        uGlow:{
                            value:glow
                        },


                        color1:{
                            value:c1
                        },


                        color2:{
                            value:c2
                        },


                        color3:{
                            value:c3
                        }


                    }


                }
            );







        const mesh =
            new Mesh(
                gl,
                {

                    geometry:
                        new Triangle(gl),

                    program

                }
            );








        function resize(){


            const rect =
                container.getBoundingClientRect();



            renderer.setSize(

                rect.width,

                rect.height

            );


        }



        resize();



        window.addEventListener(
            "resize",
            resize
        );







        let frame;



        function animate(time){


            program.uniforms.iTime.value =
                time*0.001;



            renderer.render({

                scene:mesh

            });



            frame =
                requestAnimationFrame(
                    animate
                );


        }




        frame =
            requestAnimationFrame(
                animate
            );








        return ()=>{


            cancelAnimationFrame(frame);



            window.removeEventListener(
                "resize",
                resize
            );



            if(canvas.parentNode){

                canvas.parentNode.removeChild(canvas);

            }


        };



    },[
        colors,
        speed,
        glow
    ]);








    return (

        <div

            ref={containerRef}

            className="ferrofluid-container"

        />

    );


}
