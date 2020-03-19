(function() {
    const getHostElement = () => {
        let host = document.querySelector('.sh-toast-host');

        if (!host) {
            const el = document.createElement('div');
            el.classList.add('sh-toast-host');
            document.body.appendChild(el);
            host = el;
        }

        return host;
    }

    const createToast = (message, type) => {
        const el = document.createElement('div');
        el.classList.add('sh-toast');
        el.classList.add(`sh-toast-${type}`.toLowerCase());
        el.innerHTML = `<div class="sh-toast-content">${renderMessage(message)}</div>`;

        return el;
    }

    const renderMessage = (message) => {
        return String(message)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/\*\*(.*?)\*\*/gm, '<b>$1</b>');
    }

    function toast (message, type) {
        const el = createToast(message, type || toast.SUCCESS);
        getHostElement().appendChild(el);

        setTimeout(() => {
            el.classList.add('visible');
        }, 50);

        setTimeout(() => {
            el.classList.remove('visible');
            setTimeout(() => getHostElement().removeChild(el), 500);
        }, 5000);
    }

    toast.SUCCESS = 'SUCCESS';
    toast.ERROR = 'ERROR';
    toast.INFO = 'INFO';

    window.toast = toast;
})();