if('serviceWorker' in navigator){
    navigator.serviceWorker.register('https://online.mahtaschool.ir/storage/web/sw.js')
    .then(function (){
        console.log("Service worker registered");
    })
}