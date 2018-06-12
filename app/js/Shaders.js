var baseVs = require('./../shaders/base.vs');
var rgbShiftFs = require('./../shaders/rgbShift.fs');
var glitchFs = require('./../shaders/glitch.fs');
var glitch2Fs = require('./../shaders/glitch2.fs');
var noiseFs = require('./../shaders/noise.fs');
var invertFs = require('./../shaders/invert.fs');
var chromaticAberrationFs = require('./../shaders/chromaticAberration.fs');

var Shaders = {
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
	glitch2 : {
		uniforms: {
			'tDiffuse': { value: null },
			'time':    { value: 1.0 }
		},
		vertexShader: baseVs,
		fragmentShader: glitch2Fs
	},
	noise : {
		uniforms: {
			'tDiffuse': { value: null },
			'seed':    { value: 1.0 }
		},
		vertexShader: baseVs,
		fragmentShader: noiseFs
	},
	invert : {
		uniforms: {
			'tDiffuse': { value: null },
			'on':    { value: 1.0 }
		},
		vertexShader: baseVs,
		fragmentShader: invertFs
	},
	cromaticAberration : {
		uniforms: {
			'tDiffuse': { value: null },
			'time':    { value: 1.0 }
		},
		vertexShader: baseVs,
		fragmentShader: invertFs
	}
}

module.exports = Shaders;