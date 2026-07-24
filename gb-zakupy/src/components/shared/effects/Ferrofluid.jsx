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

    useEffect(() => {

        const container =
            containerRef.current;

        if (!container)
            return;

        const renderer =
            new Renderer({
                alpha: true,
                antialias: true
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
            new Program(gl, {

                vertex: `

                attribute vec2 uv;

                attribute vec2 position;

                varying vec2 vUv;

                void main(){

                    vUv = uv;

                    gl_Position =
                    vec4(position,0.0,1.0);

                }

                `,

                fragment: `

                precision highp float;

                uniform float uTime;

                uniform float uScale;

                uniform float uSpeed;

                uniform float uTurbulence;

                uniform float uGlow;

                uniform vec3 colors[6];

                varying vec2 vUv;

                float random(vec2 p){

                    return fract(
                        sin(
                            dot(
                                p,
                                vec2(
                                    127.1,
                                    311.7
                                )
                            )
                        )
                        *
                        43758.5453123
                    );

                }

                float noise(vec2 p){

                    vec2 i = floor(p);

                    vec2 f = fract(p);

                    float a = random(i);

                    float b = random(i + vec2(1.0,0.0));

                    float c = random(i + vec2(0.0,1.0));

                    float d = random(i + vec2(1.0,1.0));

                    vec2 u =
                        f*f*(3.0-2.0*f);

                    return mix(a,b,u.x)
                         + (c-a)*u.y*(1.0-u.x)
                         + (d-b)*u.x*u.y;

                }

                vec3 palette(float v){

                    if(v < 0.20){

                        return mix(
                            colors[0],
                            colors[1],
                            smoothstep(
                                0.0,
                                0.20,
                                v
                            )
                        );

                    }

                    else if(v < 0.40){

                        return mix(
                            colors[1],
                            colors[2],
                            smoothstep(
                                0.20,
                                0.40,
                                v
                            )
                        );

                    }

                    else if(v < 0.60){

                        return mix(
                            colors[2],
                            colors[3],
                            smoothstep(
                                0.40,
                                0.60,
                                v
                            )
                        );

                    }

                    else if(v < 0.80){

                        return mix(
                            colors[3],
                            colors[4],
                            smoothstep(
                                0.60,
                                0.80,
                                v
                            )
                        );

                    }

                    return mix(
                        colors[4],
                        colors[5],
                        smoothstep(
                            0.80,
                            1.0,
                            v
                        )
                    );

                }

                void main(){

                    vec2 uv = vUv;

                    float t =
                        uTime *
                        uSpeed;

                    float n1 =
                        noise(
                            uv *
                            uScale +
                            t
                        );

                    float n2 =
                        noise(
                            uv *
                            uScale *
                            2.5 -
                            t *
                            0.6
                        );

                    float wave =
                        sin(
                            uv.x *
                            9.0 +
                            t
                        ) *
                        0.12;

                    float swirl =
                        cos(
                            uv.y *
                            7.0 -
                            t *
                            0.8
                        ) *
                        0.10;

                    float value =
                        n1 * 0.65 +
                        n2 * 0.35 +
                        wave *
                        uTurbulence +
                        swirl;

                    value =
                        clamp(
                            value,
                            0.0,
                            1.0
                        );

                    vec3 color =
                        palette(value);

                    float veins =
                        smoothstep(
                            0.72,
                            0.98,
                            value
                        );

                    color =
                        mix(
                            color,
                            colors[0],
                            veins *
                            0.70
                        );

                    float highlights =
                        1.0 -
                        smoothstep(
                            0.15,
                            0.45,
                            value
                        );

                    color +=
                        colors[5] *
                        highlights *
                        0.18 *
                        uGlow;

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

                    uGlow:{
                        value:glow
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
        turbulence,
        glow
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

    return{

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
