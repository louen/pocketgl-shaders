precision mediump float;
uniform vec2 resolution;
uniform float time;

const float eps = 1e-7;
const float pi = 3.1415926536;
const float tmin = 0.1;
const vec3 bg_color = vec3(0.1, 0.1, 0.1);

float raycastPlane(vec3 ray_origin, vec3 ray_dir, vec3 plane_origin, vec3 plane_normal) {
    // Solve for P = (o + t.d )
    // and AP.n = 0
    // gives t = d.n / OA.n
    float d_n = dot(ray_dir, plane_normal);
    float oa_n = dot(plane_origin - ray_origin, plane_normal);
    return d_n / (oa_n + eps);
}

vec2 plane_uv(vec3 point, vec3 plane_origin, vec3 plane_tangent) {
    vec3 oa = point - plane_origin;
    float u = dot(oa, plane_tangent);
    float v = length(oa - u * plane_tangent);
    return vec2(u,v);
}

float raycastSphere(vec3 ray_origin, vec3 ray_dir, vec3 sphere_center, float radius) {

    vec3 co = ray_origin - sphere_center;
    float co2 = dot(co, co);
    float dco = dot(ray_dir, co);

    float c = co2 - (radius * radius);
    float b = 2.0 * dco;
    float delta = b*b - (4.0 *c);

    if (delta >= 0.0) {
        float t = 0.5 * (-b - sqrt(delta));
        if (t < tmin) {
            t = 0.5 * (-b + sqrt(delta));
        }
        if (t > tmin) {
            return t;
        }
    }
    return -1.0;
}


vec3 rayFromCamera(vec3 origin, vec3 target, vec3 up, float znear, float fovy, vec2 uv, vec2 resolution) {

    vec3 z = normalize(origin - target);
    vec3 x = normalize(cross(up, z));
    vec3 y = normalize(cross(z,x));

    mat3 view = mat3(x,y,z);

    float h = 2.0 * znear * tan(fovy/2.0);
    float w = h * resolution.x / resolution.y;
    float pix_w = w / resolution.x;

    // In camera space
    vec3 bottom_left = vec3(-w/2.0, -h/2.0, -znear);
    vec3 pixel = bottom_left + vec3(pix_w * uv.xy, 0.0);

    // In world space
    vec3 pixel_world = view * pixel;

    return normalize(pixel_world - origin);

}

// Function to display regular  black lines at some frequency
float lines(float value, float resolution, float width) {
    return 1.0 - step(fract((resolution * value)),width);
}

float grid(vec2 uv, float resolution, float width) {
     return lines(uv.x, resolution, width) * lines(uv.y, resolution, width);
}

void main() {
    vec3 camera_origin = vec3(1.0 * cos(time/100.0), 10.0, 1.0 * sin(time/100.0));
    const vec3 camera_target = vec3(0.0, 0.0, 0.0);
    const vec3 camera_up = vec3(0.0, 1.0, 0.0);
    const float fovy = 0.8726; // 50 deg.
    const float znear = 0.1;


    vec3 dir = rayFromCamera(camera_origin, camera_target, camera_up, znear, fovy, gl_FragCoord.xy, resolution);


    vec3 plane_center = vec3(0);
    vec3 plane_normal = vec3(0.0, 1.0, 0.0);
    vec3 plane_tangent = vec3(1.0, 0.0, 0.0);
    float tPlane = raycastPlane(camera_origin, dir, plane_center, plane_normal);
    vec3 col = bg_color;
    if (tPlane > 0.0) {
        vec3 plane_pt = camera_origin + tPlane * dir;
        vec2 plane_uv = plane_uv(plane_pt, plane_center, plane_tangent);
        col += grid(plane_uv, 10000.0, 0.1);
    }

    gl_FragColor = vec4(col ,1.0);
}