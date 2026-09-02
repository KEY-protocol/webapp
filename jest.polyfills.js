const { TextEncoder, TextDecoder } = require('util');
const { TextEncoderStream, TextDecoderStream, ReadableStream, WritableStream, TransformStream } = require('stream/web');

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
if (typeof global.TextEncoderStream === 'undefined') {
  global.TextEncoderStream = TextEncoderStream;
}
if (typeof global.TextDecoderStream === 'undefined') {
  global.TextDecoderStream = TextDecoderStream;
}
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = ReadableStream;
}
if (typeof global.WritableStream === 'undefined') {
  global.WritableStream = WritableStream;
}
if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = TransformStream;
}
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (val) => (val === undefined ? undefined : JSON.parse(JSON.stringify(val)));
}

const { Request, Response, Headers, fetch } = require('next/dist/compiled/@edge-runtime/primitives');

if (typeof global.Request === 'undefined') {
  global.Request = Request;
}
if (typeof global.Response === 'undefined') {
  global.Response = Response;
}
if (typeof global.Headers === 'undefined') {
  global.Headers = Headers;
}
if (typeof global.fetch === 'undefined') {
  global.fetch = fetch;
}
