function sendHello() {
    window.top.postMessage('hello', '*');
}

setInterval(sendHello, 1000);