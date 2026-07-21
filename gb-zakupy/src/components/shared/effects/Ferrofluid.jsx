import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

import "./Ferrofluid.css";


const MAX_COLORS = 8;



function hexToRGB(hex){

    const c = hex
        .replace("#","")
        .padEnd(6,"0");


    return [
        parseInt(c.slice(0,2),16)/255,
        parseInt(c.slice(2,4),16)/255,
        parseInt(c.slice(4,6),16)/255
    ];

}



function prepareColors(colors){


    const list = (
        colors?.length
        ?
        colors
        :
        [
            "#16425B",
            "#3A7CA5",
            "#81C3D7"
        ]
    )
    .slice(0,MAX_COLORS);



    const arr = [];


    for(let i=0;i<MAX_COLORS;i++){

        arr.push(
            hexToRGB(
                list[
                    Math.min(
                        i,
                        list.length-1
                    )
                ]
            )
        );

    }



    return {

        arr,

        count:list.length

    };


}





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


uniform vec3 iResolution;

uniform float iTime;


uniform vec3 uColor0;

uniform vec3 uColor1;

uniform vec3 uColor2;


uniform float uSpeed;

uniform float uGlow;


varying vec2 vUv;



float noise(vec2 p){

    return sin(
        p.x*3.0+
        sin(p.y*4.0+
        iTime)
    );

}



void main(){


    vec2 uv =
        vUv;


    float wave = noise(
        uv*3.0 +
        iTime*uSpeed
    );



    float light =
        smoothstep(
            -1.0,
            1.0,
            wave
        );



    vec3 color =
        mix(
            uColor0,
            uColor1,
            light
        );



    color =
        mix(
            color,
            uColor2,
            uv.y
        );



    color *= uGlow;



    float alpha =
        smoothstep(
            0.0,
            1.0,
            uv.y
        );



    gl_FragColor =
        vec4(
            color,
            alpha
        );


}

`;









export default function Ferrofluid({

    colors = [
        "#16425B",
        "#3A7CA5",
        "#81C3D7"
    ],


    speed = 0.35,


    glow = 1.5,


}){


    const containerRef =
        useRef(null);



    useEffect(()=>{


        const container =
            containerRef.current;


        if(!container)
            return;



        const renderer =
            new Renderer({

                alpha:true,

                antialias:true,

            });



        const gl =
            renderer.gl;



        gl.clearColor(
            0,
            0,
            0,
            0
        );



        container.appendChild(
            gl.canvas
        );



        const {
            arr
        } = prepareColors(colors);




        const program =
            new Program(
                gl,
                {

                    vertex,

                    fragment,


                    uniforms:{


                        iResolution:{
                            value:[
                                gl.canvas.width,
                                gl.canvas.height,
                                1
                            ]
                        },


                        iTime:{
                            value:0
                        },


                        uColor0:{
                            value:arr[0]
                        },


                        uColor1:{
                            value:arr[1]
                        },


                        uColor2:{
                            value:arr[2]
                        },


                        uSpeed:{
                            value:speed
                        },


                        uGlow:{
                            value:glow
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


            const {
                width,
                height
            } =
            container.getBoundingClientRect();



            renderer.setSize(
                width,
                height
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


            cancelAnimationFrame(
                frame
            );


            window.removeEventListener(
                "resize",
                resize
            );


            container.removeChild(
                gl.canvas
            );


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
