var baseVs = require('./../shaders/base.vs');
var rgbShiftFs = require('./../shaders/rgbShift.fs');
var glitchFs = require('./../shaders/glitch.fs');
var noiseFs = require('./../shaders/noise.fs');
var invertFs = require('./../shaders/invert.fs');
var chromaticAberrationFs = require('./../shaders/chromaticAberration.fs');

var Shaders = {
	invert : {
		uniforms: {
			'tDiffuse': { value: null },
			'on':    { value: 1.0 }
		},
		vertexShader: baseVs,
		fragmentShader: invertFs
	},
	RGBShift: {
		uniforms: {
			'tDiffuse': { value: null },
			'amount':   { value: 0.01 },
			'angle':    { value: 0.3 }
		},
		vertexShader: baseVs,
		fragmentShader: rgbShiftFs
	},
	glitch : {
		uniforms: {
			'tDiffuse': { value: null },
			'time':    { value: 1.0 }
		},
		vertexShader: baseVs,
		fragmentShader: glitchFs
	},
	mpeg : {
		uniforms: {
			'tDiffuse': { value: null },
			'time':    { value: 1.0 },
			'noise':    { value: null }
		},
		vertexShader: baseVs,
		fragmentShader: glitchFs
	},
	noise : {
		uniforms: {
			'tDiffuse': { value: null },
			'time':    { value: 1.0 }
		},
		vertexShader: baseVs,
		fragmentShader: noiseFs
	},
	cromaticAberration : {
		uniforms: {
			'tDiffuse': { value: null },
			'time':    { value: 1.0 }
		},
		vertexShader: baseVs,
		fragmentShader: chromaticAberrationFs
	}
}

module.exports = Shaders;