var clipboard = (function (){

    var t = {}
    function copyText(text){
        var isRTL = document.documentElement.getAttribute('dir') == 'rtl';
        var container = document.body

        var fakeElem = document.createElement('textarea');
        // Prevent zooming on iOS
        fakeElem.style.fontSize = '12pt';
        // Reset box model
        fakeElem.style.border = '0';
        fakeElem.style.padding = '0';
        fakeElem.style.margin = '0';
        // Move element out of screen horizontally
        fakeElem.style.position = 'absolute';
        fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
        // Move element to the same position vertically
        var yPosition = window.pageYOffset || document.documentElement.scrollTop;
        fakeElem.style.top = yPosition + 'px';

        fakeElem.setAttribute('readonly', '');
        fakeElem.value = text;

        container.appendChild(fakeElem);

        fakeElem.focus()
        fakeElem.select()

        var succeeded = false
        try {
            succeeded = document.execCommand("copy");
        } catch (err) {
            succeeded = false;
        }
        container.removeChild(fakeElem)

        return succeeded
    }

    t.copyText = copyText


    return t
})();



