// Square distance to a circle
float squircle(in vec2 p, in vec2 c, in float r, in float n) {
    return pow(abs(p.x  c.x)/r, n)  + pow(abs(p.y - c.y)/r, n)
}

uniform float n;

void main() {
    // Uniform scale
    vec2 uv = (2.0 * gl_FragCoord.xy - resolution)/resolution.y;

    n = max(0, n)
    squircle(uv, vec2(0), 1.0, n)

    // Inigo's colorscheme for SDFs
    vec3 col = (f>0.0) ? vec3(0.9,0.6,0.3) : vec3(0.65,0.85,1.0);
    col *= 1.0 - exp(-6.0*abs(f));
    col *= 0.8 + 0.2*cos(150.0*f);
    col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.01,abs(f)) );
    gl_FragColor = vec4(col,1.0);
}