uniform vec2 resolution;
uniform float time;

// Square distance to a circle
float circle( in vec2 p, in vec2 c, in float r) {
    return length(p-c) -r;
}

// Smooth union of distance fields
float smooth_union(float x, float y, float n) {
    float res = exp(-n*x) + exp (-n*y);
    return -log(max(0.0001, res)) / n;
}

void main() {

    // Uniform scale
    vec2 uv = (2.0 * gl_FragCoord.xy - resolution)/resolution.y;

    float f = 100.0;
    // Spawn 10 particles, orbiting the center
    for (int i = 0; i < 10; ++i) {
        // Radius of the orbit
        float R = 0.1 * float(i)+0.1;
        // Period of the orbit (Kepler's law)
        float T = 10.0 * sqrt(R*R*R);
        // Have orbits in two different directions
        float parity = float((i+1)/2 - i/2);
        float ccw = 1.0 - parity * 2.0;
        float t = time + 2.23 * sqrt(float(i));

        // Center of our position
        vec2 c = R * vec2(cos(t/T),  ccw * sin(t/T));
        // Value of the distance function
        float d = circle(uv, c, 0.1 + 0.05 * cos(t/2.0 + float(i)));
        f = smooth_union(f,d,8.0);
    }

    // Inigo's colorscheme for SDFs
    vec3 col = (f>0.0) ? vec3(0.9,0.6,0.3) : vec3(0.65,0.85,1.0);
    col *= 1.0 - exp(-6.0*abs(f));
    col *= 0.8 + 0.2*cos(150.0*f);
    col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.01,abs(f)) );
    gl_FragColor = vec4(col,1.0);
}