importScripts('workbox-sw.js');

const workbox = new WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
});

workbox.precache([]);
