precision mediump float;

varying vec3 normalInterp;
varying vec3 vertPos;
varying vec2 vertUV;

uniform vec3 diffuseColor;

const vec3 specColor = vec3(1.0, 1.0, 1.0);

// Function to display regular  black lines at some frequency
float lines(float value, float resolution, float width) {
    return 1.0 - step(fract((resolution * value)),width);
}

// Two regular black lines make a grid
float grid(vec2 uv, float resolution, float width) {
     return lines(uv.x, resolution, width) * lines(uv.y, resolution, width);
}

void main() {
    vec3 lightDir = normalize(vec3(0.0, 0.1, 1.0));
    vec3 normal = normalize(normalInterp);

    float lambertian = max(dot(lightDir, normal), 0.0);
    float specular = 0.0;

    if(lambertian > 0.0) {
        vec3 viewDir = normalize(-vertPos);
        vec3 halfDir = normalize(lightDir + viewDir);
        float specAngle = max(dot(halfDir, normal), 0.0);
        specular = pow(specAngle, 16.0);
    }

    // Half-assed fresnel term + phong shading.
    float fresnel = (0.1 + (1.0-0.04)*(pow(1.0 - max(0.0, dot(normal, normalize(vertPos))), 5.0)));
    float grid = 0.8 * grid(vertUV, 10.0, 0.02) * grid(vertUV, 100.0, 0.01);
    vec3 albedo =  (grid+fresnel) * diffuseColor;
    vec3 C = specular * specColor + clamp(lambertian, 0.05, 1.0) * albedo;
    gl_FragColor = vec4(C, 1.0);
}