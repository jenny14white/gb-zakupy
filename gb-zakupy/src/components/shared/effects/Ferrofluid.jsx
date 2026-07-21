import { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Program, Mesh, Plane } from "ogl";

import "./Ferrofluid.css";


export default function Ferrofluid({

    colors = [
        "#10002b",
        "#240046",
        "#3c096c",
        "#5a189a",
        "#7b2cbf",
        "#9d4edd"
    ],

    speed = 0.22,

    scale = 1.7,

    turbulence = 0.9,

    glow = 2.5,

    opacity = 1

}) {


    const containerRef = useRef(null);



    useEffect(()=>{


        const container =
            containerRef.current;


        if(!container)
            return;



        const renderer =
            new Renderer({
                alpha:true,
                antialias:true
            });



        const gl =
            renderer.gl;



        container.appendChild(
            gl.canvas
        );



        const camera =
            new Camera(gl);



        camera.position.z = 1;



        const geometry =
            new Plane(gl);



        const program =
            new Program(gl,{

                vertex:`

                attribute vec2 uv;

                attribute vec2 position;


                varying vec2 vUv;


                void main(){

                    vUv = uv;

                    gl_Position =
                    vec4(position,0.0,1.0);

                }

                `,


                fragment:`

                precision highp float;


                uniform float uTime;


                uniform float uScale;


                uniform float uSpeed;


                uniform float uTurbulence;


                uniform vec3 colors[6];


                varying vec2 vUv;



                float noise(vec2 p){

                    return fract(
                        sin(
                            dot(
                                p,
                                vec2(
                                    12.9898,
                                    78.233
                                )
                            )
                        )
                        *
                        43758.5453
                    );

                }




                void main(){


                    vec2 uv =
                    vUv;



                    float t =
                    uTime *
                    uSpeed;



                    float n =
                    noise(
                        uv *
                        uScale +
                        t
                    );



                    float wave =
                    sin(
                        uv.x *
                        8.0
                        +
                        t
                    )
                    *
                    0.15;



                    float mixValue =
                    n +
                    wave *
                    uTurbulence;



                    vec3 color =
                    mix(
                        colors[0],
                        colors[5],
                        mixValue
                    );



                    color =
                    mix(
                        color,
                        colors[3],
                        sin(t+uv.y*5.0)
                    );



                    gl_FragColor =
                    vec4(
                        color,
                        1.0
                    );

                }

                `,


                uniforms:{


                    uTime:{
                        value:0
                    },


                    uScale:{
                        value:scale
                    },


                    uSpeed:{
                        value:speed
                    },


                    uTurbulence:{
                        value:turbulence
                    },


                    colors:{
                        value:
                        colors.map(c=>{
                            const col =
                            hexToRgb(c);

                            return [
                                col.r,
                                col.g,
                                col.b
                            ];

                        })
                    }

                }


            });



        const mesh =
            new Mesh(
                gl,
                {
                    geometry,
                    program
                }
            );



        const scene =
            new Transform();



        mesh.setParent(scene);



        let frame;



        function animate(time){


            program.uniforms.uTime.value =
            time * 0.001;



            renderer.render({

                scene,

                camera

            });



            frame =
            requestAnimationFrame(
                animate
            );


        }



        animate(0);




        function resize(){


            renderer.setSize(
                container.clientWidth,
                container.clientHeight
            );


        }



        resize();


        window.addEventListener(
            "resize",
            resize
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
        scale,
        turbulence
    ]);







    return (

        <div

            ref={containerRef}

            className="ferrofluid-container"

            style={{
                opacity
            }}

        />

    );


}






function hexToRgb(hex){


    const value =
        hex.replace("#","");



    return {

        r:
        parseInt(
            value.substring(0,2),
            16
        )
        /
        255,


        g:
        parseInt(
            value.substring(2,4),
            16
        )
        /
        255,


        b:
        parseInt(
            value.substring(4,6),
            16
        )
        /
        255

    };


}
