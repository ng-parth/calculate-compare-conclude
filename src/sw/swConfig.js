const swConfig = {
    swRelativeUrl: '/sw/swLetsGo.js',
    onUpdate: registration => {
        const waitingServiceWorker = registration.waiting;
        if (waitingServiceWorker) {
            waitingServiceWorker.addEventListener('statechange', event => {
                console.log('SW state changed to: ', event.target.state);
                if (event.target.state === 'activated') {
                    window.location.reload();
                }
            });
            console.log('Posting message to skip waiting. ');
            waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
        }
    },
};

export default swConfig;
