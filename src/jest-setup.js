// Add TextEncoder and TextDecoder polyfills for MSW
// These are required by the MSW interceptors
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
