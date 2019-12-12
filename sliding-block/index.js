"use strict";
var drag;
(function (doc) {
    var isTransition = false, isStart = false, translateX = 0, translateY = 0, winWidth = doc.body.clientWidth, winHeight = doc.body.clientHeight, halfWinWidth = winWidth / 2, newDragDom, newDragDomWidth = 0, newDragDomHeight = 0, halfDragWidth = 0, halfDragHeight = 0, paramObjects; // 用户参数
    function touchstart(e) {
        e.preventDefault();
        if (!isTransition)
            isStart = true;
    }
    function touchmove(e) {
        e.preventDefault();
        // 过渡动画与是否开始
        if (!isTransition && isStart) {
            var pageXY = e.changedTouches[0];
            if (pageXY.pageX !== translateX)
                translateX = parseInt("" + (pageXY.pageX - halfDragWidth));
            if (pageXY.pageY !== translateY)
                translateY = parseInt("" + (pageXY.pageY - halfDragHeight));
            newDragDom.style.cssText = "position: absolute;transform:translate(" + translateX + "px," + translateY + "px);";
        }
    }
    function touchend(e) {
        e.preventDefault();
        // 当前手松开的时候判断接近于屏幕的那一边就自动靠着哪一边
        if (paramObjects.isWelt && isStart) {
            translateX = translateX <= halfWinWidth ? 0 : winWidth - newDragDomWidth;
            if (translateY <= 0) {
                translateY = 0;
            }
            else if (translateY >= winHeight - newDragDomHeight) {
                translateY = winHeight - newDragDomHeight;
            }
            // 是否贴边就代表时候有动画
            isTransition = true;
            isStart = false;
            newDragDom.style.cssText = "position: absolute;transform:translate(" + translateX + "px," + translateY + "px);transition:transform .8s ease;";
        }
    }
    function transitionend() {
        isTransition = false;
    }
    /*
    * 事件绑定
    * */
    function bindEvent() {
        newDragDom.addEventListener('touchstart', touchstart);
        newDragDom.addEventListener('touchmove', touchmove);
        newDragDom.addEventListener('touchend', touchend);
        if (paramObjects.isWelt) {
            newDragDom.addEventListener('transitionend', transitionend);
        }
    }
    /*
    * domId   当前绑定的元素id
    * isWelt  是否贴边
    *	domWidth   当前元素的宽
    *	domHeight  当前元素的高
    * */
    drag = function (paramObject) {
        if (!paramObject.domId)
            return;
        paramObjects = paramObject;
        newDragDom = doc.getElementById(paramObject.domId);
        newDragDomWidth = paramObject.domWidth || newDragDom.offsetWidth;
        newDragDomHeight = paramObject.domHeight || newDragDom.offsetHeight;
        halfDragWidth = newDragDomWidth / 2;
        halfDragHeight = newDragDomHeight / 2;
        bindEvent();
    };
})(document);
