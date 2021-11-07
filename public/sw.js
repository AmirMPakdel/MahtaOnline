self.addEventListener("install", function(e){
    console.log("[SW] installing sw...");
})

self.addEventListener("activate", function(e){
    console.log("[SW] activating sw...");
    return self.clients.claim();
})