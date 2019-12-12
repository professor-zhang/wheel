interface paramObjects {
    domId: string,
    isWelt?: boolean,
    domWidth?: number,
    domHeight?: number
}

let drag: (paramObject: paramObjects) => void;

(function (doc: Document) {
    let isTransition: boolean = false,
        isStart: boolean = false,
        translateX: number = 0,
        translateY: number = 0,
        winWidth: number = doc.body.clientWidth,
        winHeight: number = doc.body.clientHeight,
        halfWinWidth: number = winWidth / 2,
        newDragDom: HTMLElement | null,
        newDragDomWidth: number = 0,
        newDragDomHeight: number = 0,
        halfDragWidth: number = 0,
        halfDragHeight: number = 0,
        paramObjects: paramObjects;// 用户参数

    function touchstart(e: any) {
        e.preventDefault();
        if (!isTransition) isStart = true;
    }


    function touchmove(e: any): void {
        e.preventDefault();
        // 过渡动画与是否开始
        if (!isTransition && isStart) {
            var pageXY = e.changedTouches[0];
            if (pageXY.pageX !== translateX) translateX = parseInt(`${(pageXY.pageX - halfDragWidth)}`);
            if (pageXY.pageY !== translateY) translateY = parseInt(`${(pageXY.pageY - halfDragHeight)}`);
            (<HTMLElement>newDragDom).style.cssText = `position: absolute;transform:translate(${translateX}px,${translateY}px);`;


        }
    }

    function touchend(e: any): void {
        e.preventDefault();
        // 当前手松开的时候判断接近于屏幕的那一边就自动靠着哪一边
        if (paramObjects.isWelt && isStart) {
            translateX = translateX <= halfWinWidth ? 0 : winWidth - newDragDomWidth;
            if (translateY <= 0) {
                translateY = 0;
            } else if (translateY >= winHeight - newDragDomHeight) {
                translateY = winHeight - newDragDomHeight;
            }
            // 是否贴边就代表时候有动画
            isTransition = true;
            isStart = false;
            (<HTMLElement>newDragDom).style.cssText = `position: absolute;transform:translate(${translateX}px,${translateY}px);transition:transform .8s ease;`;
        }
    }

    function transitionend(): void {
        isTransition = false;
    }

    /*
    * 事件绑定
    * */
    function bindEvent(): void {
        (<HTMLElement>newDragDom).addEventListener('touchstart', touchstart);
        (<HTMLElement>newDragDom).addEventListener('touchmove', touchmove);
        (<HTMLElement>newDragDom).addEventListener('touchend', touchend);
        if (paramObjects.isWelt) {
            (<HTMLElement>newDragDom).addEventListener('transitionend', transitionend);
        }
    }

    /*
    * domId   当前绑定的元素id
    * isWelt  是否贴边
    *	domWidth   当前元素的宽
    *	domHeight  当前元素的高
    * */
    drag = function (paramObject: paramObjects) {
        if (!paramObject.domId) return;
        paramObjects = paramObject;
        newDragDom = doc.getElementById(paramObject.domId);
        newDragDomWidth = paramObject.domWidth || (<HTMLElement>newDragDom).offsetWidth;
        newDragDomHeight = paramObject.domHeight || (<HTMLElement>newDragDom).offsetHeight;
        halfDragWidth = newDragDomWidth / 2;
        halfDragHeight = newDragDomHeight / 2;
        bindEvent();
    };
})(document);