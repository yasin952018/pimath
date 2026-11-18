/* يحفظ «غلاف» التطبيق على الهاتف حتى يفتح بسرعة. محتوى المنصّة نفسه يأتي دائمًا من الإنترنت. */
var CACHE = 'platform-shell-v2';
var SHELL = ['config.js', 'student/', 'student/index.html', 'student/manifest.webmanifest', 'teacher/', 'teacher/index.html', 'teacher/manifest.webmanifest',
  'icons/student-180.png', 'icons/student-192.png', 'icons/student-512.png', 'icons/teacher-180.png', 'icons/teacher-192.png', 'icons/teacher-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== 'GET') return;   // Apps Script لا يمرّ من هنا
  // النسخة المحفوظة أولًا (فتح فوري)، وتُحدَّث من الشبكة في الخلفية للمرة القادمة
  e.respondWith(caches.match(e.request).then(function (hit) {
    var net = fetch(e.request).then(function (r) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, cp); }); return r; }).catch(function () { return hit; });
    return hit || net;
  }));
});
