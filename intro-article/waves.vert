precision mediump float;

varying vec3 normalInterp;
varying vec3 vertPos;
varying vec2 vertUV;

uniform float time;
uniform int waveCount;

#define MAX_WAVE float(20)

// Add waves to the surface.
// Returns the surface altitude in .w and the surface gradient in .xyz
vec4 deform(vec2 uv){
    float value = 0.0;
    vec2 grad = vec2(0.0);

    for (float i = 0.0; i < MAX_WAVE; i++) {
        if (i >= float(waveCount)){
            break;
        }
        float amplitude = 0.2 / sqrt(i+1.0);
        float period = 1.5 / pow(i+1.0, 1.1);
        vec2 k = vec2(cos(5.0 * i) + 0.5, 0.5 * sin(7.0 * i));
        value += amplitude *  sin(dot(k,uv) - time/period);
        grad += amplitude * vec2(cos(k.y*uv.y - time/period), cos(k.x*uv.x - time/period));
    }

    vec3 normal = normalize(vec3(grad,1.0));
    return vec4(normal, value);
}

void main(){
    vec4 def = deform(position.xy);
    vec3 newPosition = vec3(position.x, position.y, def.w);
    vec3 newNormal = def.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vec4 vertPos4 = modelViewMatrix * vec4(newPosition, 1.0);

    vertPos = vec3(vertPos4) / vertPos4.w;
    normalInterp = normalMatrix * newNormal;
    vertUV = uv;
}