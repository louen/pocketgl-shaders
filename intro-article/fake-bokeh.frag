uniform vec2 resolution;
uniform float time;
uniform sampler2D codeimg;

// Number of samples
#define ITER_COUNT 150
// Golden angle
#define PHI 2.399963229728653
// Rotation matrix by golden angle
const mat2 rot_phi = mat2( cos(PHI), -sin(PHI), sin(PHI), cos(PHI));

vec3 fake_bokeh(sampler2D texture, vec2 uv, float radius)
{
	vec3 result = vec3(0);
	vec3 norm = vec3(0);
    float r = 1.0;
    vec2 angle = vec2(0.0, radius*.01 / sqrt(float(ITER_COUNT)));

    // Sample image outwards from the uv point in a golden spiral
	for (int j = 0; j < ITER_COUNT; j++)
    {
        r += 1. / r;
	    angle = rot_phi * angle;
        vec3 col = texture2D(texture, uv + (r-1.0) * angle).xyz;
		vec3 bokeh = pow(col, vec3(4));
		result += col * bokeh;
		norm += bokeh;
	}
	return result / norm;
}

void main() {
    float t = (1.0+sin(time/2.0));
    vec2 uv =  gl_FragCoord.xy / resolution;

    // Fake focus breathing
    float zoom = (((0.05*sqrt(t))+1.0));
    vec2 zoomed_uv =  (1.0/zoom)* (uv-vec2(0.5,0.5)) + vec2(0.5,0.5);
    gl_FragColor = vec4(fake_bokeh(codeimg, zoomed_uv,  0.2 * t),1.0);
}