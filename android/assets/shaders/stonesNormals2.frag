#ifdef GL_ES
     #define LOWP lowp
     precision mediump float;
 #else
     #define LOWP
 #endif

varying vec4 v_color;
varying vec2 v_texCoords;

//our texture samplers
uniform sampler2D u_texture;   //diffuse map
uniform sampler2D u_normals;   //normal map

//values used for shading algorithm...
uniform vec2 Resolution;      //resolution of screen
uniform vec3 LightPos;        //light position, normalized
uniform LOWP  vec4 LightColor;      //light RGBA -- alpha is intensity
uniform LOWP vec4 AmbientColor;    //ambient RGBA -- alpha is intensity
uniform vec3 Falloff;         //attenuation coefficients

void main() {
   //RGBA of our diffuse color
   vec4 DiffuseColor = texture2D(u_texture, v_texCoords);
   //RGB of our normal map
   vec3 NormalMap = texture2D(u_normals, v_texCoords).rgb;
   //The delta position of light
   vec3 LightDir = vec3(LightPos.xy - (gl_FragColor.xy / Resolution.xy), LightPos.z);
   //Correct for aspect ratio
   LightDir.x *= Resolution.x / Resolution.y;
   //Determine distance (used for attenuation) BEFORE we normalize our LightDir\n" +
   float D = length(LightDir);
   //normalize our vectors\n" +
   vec3 N = normalize(NormalMap * 2.0 - 1.0);
   vec3 L = normalize(LightDir);
   //Pre-multiply light color with intensity\n" +
   //Then perform \"N dot L\" to determine our diffuse term\n" +
   vec3 Diffuse = (LightColor.rgb * LightColor.a) * max(dot(N, L), 0.0);
   //pre-multiply ambient color with intensity\n" +
   vec3 Ambient = AmbientColor.rgb * AmbientColor.a;
   //calculate attenuation\n" +
   float Attenuation = 1.0 / ( Falloff.x + (Falloff.y*D) + (Falloff.z*D*D) );
   //the calculation which brings it all together\n" +
   vec3 Intensity = Ambient + Diffuse * Attenuation;
   vec3 FinalColor = DiffuseColor.rgb * Intensity;
   gl_FragColor = v_color * vec4(FinalColor, DiffuseColor.a);
}

