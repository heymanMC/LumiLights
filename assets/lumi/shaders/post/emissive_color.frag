#include lumi:shaders/post/common/header.glsl

#include frex:shaders/lib/color.glsl
#include frex:shaders/lib/sample.glsl
#include frex:shaders/lib/math.glsl
#include lumi:shaders/post/common/bloom.glsl
#include lumi:shaders/lib/util.glsl

/******************************************************
  lumi:shaders/post/emissive_color.frag
******************************************************/
uniform sampler2D u_base_composite;
uniform sampler2D u_emissive_solid;
uniform sampler2D u_emissive_composite;
uniform sampler2D u_emissive_reflection_solid;
uniform sampler2D u_emissive_reflection_translucent;
uniform sampler2D u_solid_depth;

out vec4 fragColor;

void main()
{
	// Couldn't unjitter bloom :-?
	// vec2 unjitteredTexcoord = v_texcoord - taa_jitter(v_invSize) * 0.5;

	// TODO: elaborate hand blending? (requires hand alpha)
	float solidDepth = texture(u_solid_depth, v_texcoord).r;
	float ref = max(texture(u_emissive_reflection_solid, v_texcoord).r, texture(u_emissive_reflection_translucent, v_texcoord).r);
	float ems = solidDepth == 1.0 ? max(texture(u_emissive_composite, v_texcoord).r, ref) : texture(u_emissive_solid, v_texcoord).r;
	vec4 c = texture(u_base_composite, v_texcoord);

	c.rgb = hdr_fromGamma(c.rgb);

	fragColor = vec4(c.rgb * ems, ems);
}
