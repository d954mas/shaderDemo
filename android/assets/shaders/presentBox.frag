#ifdef GL_ES
     #define LOWP lowp
     precision mediump float;
 #else
     #define LOWP
 #endif

 varying LOWP vec4 v_color;
 varying vec2 v_texCoords;
 uniform sampler2D u_texture;
 uniform float u_time;
 uniform vec2 u_resolution;
 const vec3 color1=vec3(0.22, 0.275, 0.318);
 const vec3 color2=vec3(0.235, 0.286, 0.322);
 const vec3 light_color=vec3(0.95, 0.355, 0.1);
 const vec3 upper_light_color=vec3(1, 0.914, 0.1);

 const float min_color_size=0.2;
 const float max_color_size=0.6;

 const float upper_x=0.5;
 const float upper_y=-1;
 const float upper_r=1.5;
 const float min_phi=-0.97;
 const float max_phi=1.97;

void main() {
    vec4 color = texture2D(u_texture, v_texCoords);

       //vec2 p = (-u_resolution.xy+2.0*gl_FragColor.xy)/u_resolution.y;//����� ������(�������� ����� ����� �������� �� ���� �������� ����� ����� ���� ��������������
        vec2 p=vec2(v_texCoords.s,v_texCoords.t)-vec2(0.5);
        p.x *= u_resolution.x / u_resolution.y;
        // background
        vec2 q = vec2( -atan(p.y,p.x), length(p)); //-atan �������� � ���������������� �������
        float f = smoothstep( -0.1, 0.1, sin(q.x*10.0 + u_time));//���������� � ������, ����� �������
        vec3 round_color = mix( color1, color2, f );

      vec3 col = vec3(0.0);
      float r = length(p);
      float a = atan(p.y, p.x);
      col = mix(col, vec3(0), smoothstep(0.0, 4.0, r));
    //+0.05 ����� ��� ����������� ���� ���� ���� ���� ���� �������
    float maxvalue=min_color_size +(max_color_size-min_color_size)*(sin(u_time)+1.0)/2.0 +0.05;
      col = mix(col, light_color, 1.0 - smoothstep(min_color_size,maxvalue, r));

      col=mix(col,round_color,0.8);


       //����� ����� ������
       float x=v_texCoords.s;
       float y=v_texCoords.t;
      //������� ����
       float r2 = pow(pow(x - upper_x , 2) + pow(y - upper_y, 2),0.5);
     float phi = atan((y - upper_y)/(x - upper_x))+0.5;
     if(r2<upper_r){
      if(phi<min_phi){
              col = mix(col.rgb, upper_light_color,smoothstep(0,1,0.5-clamp((upper_x-v_texCoords.s),0.1,1.0)*3));
          }
          if(phi>max_phi){
            col = mix(col.rgb, upper_light_color,smoothstep(0,1,0.5-clamp((v_texCoords.s-upper_x),0.1,1.0)*3));
          }
     }
     gl_FragColor = vec4(vec3(col), 1.0);


}



