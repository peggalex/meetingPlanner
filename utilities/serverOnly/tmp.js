const textToType = Array.from(document.querySelectorAll('span[unselectable="on"]')).map(e => e.innerText).join("");
const getInputElement = () => document.querySelector('input');

const animationFrameWrapper = async () => {
    const element = getInputElement();
    if (!element.disabled){
        console.log('typing text');
        for (let i = 0; i < textToType.length; i++){
            element.focus();
            element.value = textToType.substring(0, i+1);
            element.dispatchEvent(new Event('change'));
            await new Promise((resolve) => setTimeout(
                () => resolve(), 
                textToType[i] === ' ' ? 100 : 3
            ));
        }
        console.log('done');
        element.onblur();
        //document.querySelector('div#dUI').click();
    } else {
        window.requestAnimationFrame(animationFrameWrapper);
    }
}

animationFrameWrapper();
