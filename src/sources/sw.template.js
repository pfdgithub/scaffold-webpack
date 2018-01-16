importScripts('workbox-sw.js');

const workbox = new WorkboxSW({
  ignoreUrlParametersMatching: [/./],
  skipWaiting: true,
  clientsClaim: true
});

workbox.precache([]);
