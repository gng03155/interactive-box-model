
// 4/18  - 게이지 구현 중 반올림할지말지 선택

const sliderIcons = document.querySelectorAll(".slider-icon");

const contentBox = document.querySelector(".contentBox");
const paddingBox = document.querySelector(".paddingBox");
const borderBox = document.querySelector(".borderBox");
const marginBox = document.querySelector(".marginBox");


let paddingBarList = {};
let borderBarList = {};
let marginBarList = {};

let prevX = 0;

let Pressed = false;

let prevVal = 0;

let prevGauge = 50;

let increased = false;

//익명함수도 이벤트 삭제가 가능하도록, 이벤트를 등록 시 해당 이벤트 콜백함수를 리스너에 넣어줌
const Handler = (function () {
    let i = 1,
        listeners = {};

    return {
        addListener: function (element, event, handler, capture) {
            element.addEventListener(event, handler, capture);
            listeners[i] = {
                element: element,
                event: event,
                handler: handler,
                capture: capture
            };
            return i++;
        },
        removeListener: function () {
            for (i in listeners) {
                let h = listeners[i];
                h.element.removeEventListener(h.event, h.handler, h.capture);
                delete listeners[i];
            }
            // if (id in listeners) {
            //     let h = listeners[id];
            //     h.element.removeEventListener(h.event, h.handler, h.capture);
            //     delete listeners[id];
            // }
        }
    };
}());

const evnetAdd = () => {
    for (let i = 0; i < sliderIcons.length; i++) {
        // console.log(sliderIcons[i].parentElement.parentElement.parentElement);
        const barType = sliderIcons[i].parentElement.parentElement.parentElement.parentElement.dataset.control;
        const directionType = sliderIcons[i].parentElement.parentElement.parentElement.dataset.direct
        if (barType === "padding") {
            switch (directionType) {
                case "top":
                    paddingBarList = { ...paddingBarList, top: sliderIcons[i].parentElement.parentElement.parentElement };
                    break;
                case "right":
                    paddingBarList = { ...paddingBarList, right: sliderIcons[i].parentElement.parentElement.parentElement };
                    break;
                case "bottom":
                    paddingBarList = { ...paddingBarList, bottom: sliderIcons[i].parentElement.parentElement.parentElement };
                    break;
                case "left":
                    paddingBarList = { ...paddingBarList, left: sliderIcons[i].parentElement.parentElement.parentElement };
                    break;

                default:
                    break;
            }
        } else if (barType === "border") {
            switch (directionType) {
                case "top":
                    borderBarList = { ...borderBarList, top: sliderIcons[i].parentElement.parentElement.parentElement };
                    break;
                case "right":
                    borderBarList = { ...borderBarList, right: sliderIcons[i].parentElement.parentElement.parentElement };
                    break;
                case "bottom":
                    borderBarList = { ...borderBarList, bottom: sliderIcons[i].parentElement.parentElement.parentElement };
                    break;
                case "left":
                    borderBarList = { ...borderBarList, left: sliderIcons[i].parentElement.parentElement.parentElement };
                    break;

                default:
                    break;
            }
        } else if (barType === "margin") {
            // console.log(directionType);
            switch (directionType) {
                case "top":
                    marginBarList = { ...marginBarList, top: sliderIcons[i].parentElement.parentElement.parentElement };
                    break;
                case "right":
                    marginBarList = { ...marginBarList, right: sliderIcons[i].parentElement.parentElement.parentElement };
                    break;
                case "bottom":
                    marginBarList = { ...marginBarList, bottom: sliderIcons[i].parentElement.parentElement.parentElement };
                    break;
                case "left":
                    marginBarList = { ...marginBarList, left: sliderIcons[i].parentElement.parentElement.parentElement };
                    break;
                default:
                    break;
            }
        } else if (barType === "size") {

        } else {
            console.error("barType none");
        }

        sliderIcons[i].addEventListener("mousedown", (e) => scopedown(e));
    }
    // console.log(marginBarList);
}

//mousemove 이벤트 콜백함수
// function mouseMoveHandler(element, valueLB, minX, maxX, scopeDir, controlType) {
//     return Handler.addListener(document, 'mousemove', (e) => mouseMove(e, element, valueLB, minX, maxX, scopeDir, controlType), false);
// }

function eventHandlerAdd(eventType, eventFunction, ...argu) {
    return Handler.addListener(document, eventType, (e) => eventFunction(e, ...argu), false);
}

//스코프를 누르면 mousemove 이벤트 등록
const scopedown = (e) => {

    // const prev = e.clientX;
    const element = e.target.parentElement;
    const parentElement = e.target.parentElement.parentElement;

    const scopeDir = parentElement.parentElement.dataset.direct;
    const controlType = parentElement.parentElement.parentElement.dataset.control;

    let barList = {};

    if (controlType === "padding") {
        barList = paddingBarList;
    } else if (controlType === "border") {
        barList = borderBarList;
    } else if (controlType === "margin") {
        // barList = borderBarList;
    }

    // console.log(parentElement.nextElementSibling.innerText);

    const valueLabel = parentElement.nextElementSibling;

    const { minRelX, maxRelX } = getRelativePos(parentElement);

    const curValue = Number(parentElement.nextElementSibling.innerText);

    prevGauge = (maxRelX - minRelX) * (curValue / 100);

    console.log(prevGauge);

    let handler = eventHandlerAdd("mousemove", mouseMove, element, valueLabel, minRelX, maxRelX, scopeDir, controlType);

    handler = eventHandlerAdd("mouseup", mouseUp);

    // document.addEventListener("mouseup", () => { mouseUp(handler) });

}


const getRelativePos = (element) => {
    const clientRect = element.getBoundingClientRect(); // DomRect 구하기 (각종 좌표값이 들어있는 객체)
    const minRelX = clientRect.left; // Viewport의 시작지점을 기준으로한 상대좌표 X 값.  
    const maxRelX = clientRect.right; // Viewport의 끝 지점을 기준으로한 상대좌표 X 값.  
    return { minRelX, maxRelX }
}

//mouseup이 되었을 시 기존에 등록했던 mousemove 이벤트를 제거
const mouseUp = () => {
    console.log("mouseup");
    Handler.removeListener();
    prevX = 0;
    Pressed = false;
    //document.removeEventListener("mouseup", mouseUp);
}

//슬라이더 바 타입 체크
const barTypeCheck = (value, dir, type) => {

    switch (type) {
        case "padding":
            paddingBoxMove(value, dir, true);
            break;
        case "border":
            borderBoxMove(value, dir, true);
            break;
        case "margin":
            marginBoxMove(value, dir, true);
            break;
        case "size":
            contentBoxMove(value, dir, true);
            break;
        default:
            break;
    }

}

const contentBoxMove = (value, direction) => {


    const contentWidth = Number(window.getComputedStyle(contentBox).width.split("px")[0]);
    const contentHeight = Number(window.getComputedStyle(contentBox).height.split("px")[0]);
    const paddingWidth = Number(window.getComputedStyle(paddingBox).width.split("px")[0]);
    const paddingHeight = Number(window.getComputedStyle(paddingBox).height.split("px")[0]);
    const borderWidth = Number(window.getComputedStyle(borderBox).width.split("px")[0]);
    const borderHeight = Number(window.getComputedStyle(borderBox).height.split("px")[0]);
    const marginWidth = Number(window.getComputedStyle(marginBox).width.split("px")[0]);
    const marginHeight = Number(window.getComputedStyle(marginBox).height.split("px")[0]);

    if (direction === "width") {
        //50 100
        paddingBox.style.width = paddingWidth - contentWidth + value + "px";
        borderBox.style.width = borderWidth - contentWidth + value + "px";
        marginBox.style.width = marginWidth - contentWidth + value + "px";
        contentBox.style.width = value + "px";


    } else if (direction === "height") {
        paddingBox.style.height = paddingHeight - contentHeight + value + "px";
        borderBox.style.height = borderHeight - contentHeight + value + "px";
        marginBox.style.height = marginHeight - contentHeight + value + "px";
        contentBox.style.height = value + "px";
    }





}

const paddingBoxMove = (value, direction, myMoving = true) => {

    const contentWidth = Number(window.getComputedStyle(contentBox).width.split("px")[0]);
    const contentHeight = Number(window.getComputedStyle(contentBox).height.split("px")[0]);

    //슬라이드가 움직인 값
    let val = 10;
    // Math.abs(50 - value);

    if (myMoving) {
        let curWidth, curHeight = 0;

        switch (direction) {
            // 100 100 100 100
            case "top":
                const bottomPos = Number(paddingBarList.bottom.lastChild.previousSibling.innerText);
                curHeight = contentHeight + bottomPos + value;
                paddingBox.style.height = curHeight + "px";
                borderBoxMove(curHeight, direction, false);
                parentMove("PADDING", direction);
                break;
            case "right":
                const leftPos = Number(paddingBarList.left.lastChild.previousSibling.innerText);
                curWidth = contentWidth + leftPos + value;
                paddingBox.style.width = curWidth + "px";;
                borderBoxMove(curWidth, direction, false);
                break;
            case "bottom":
                const topPos = Number(paddingBarList.top.lastChild.previousSibling.innerText);
                curHeight = contentHeight + topPos + value;
                paddingBox.style.height = curHeight + "px";
                borderBoxMove(curHeight, direction, false);
                break;
            case "left":
                const rightPos = Number(paddingBarList.right.lastChild.previousSibling.innerText);
                curWidth = contentWidth + rightPos + value;
                paddingBox.style.width = curWidth + "px";
                borderBoxMove(curWidth, direction, false);
                parentMove("PADDING", direction);
                break;
            default:
                break;
        }

        return;
    }








    // let [borderTopPosition,] = window.getComputedStyle(borderBox).getPropertyValue('top').split("px");
    // let [borderLeftPosition,] = window.getComputedStyle(borderBox).getPropertyValue('left').split("px");
    // let [bordergWidth,] = window.getComputedStyle(borderBox).getPropertyValue('width').split("px");
    // let [borderHeight,] = window.getComputedStyle(borderBox).getPropertyValue('height').split("px");
    // borderTopPosition = Number(borderTopPosition);
    // borderLeftPosition = Number(borderLeftPosition);
    // bordergWidth = Number(bordergWidth);
    // borderHeight = Number(borderHeight);

    //슬라이드가 움직인 값
    // let val = Math.abs(100 - value);

    // // console.log(Number(pdTop) + val);
    // // console.log(`pre : ${prevVal}`);
    // // console.log(`value : ${value}`);
    // // console.log(`val : ${val}`);
    // // console.dir(barList.top.lastChild.previousSibling.innerText);


    // switch (dir) {
    //     // 100 100 100 100
    //     case "top":
    //         const pdBottomValue = Number(barList.bottom.lastChild.previousSibling.innerText);
    //         paddingBox.style.top = (value * -1) + "px";
    //         paddingBox.style.height = 100 + pdBottomValue + value + "px";
    //         borderBox.style.height = borderHeight + value + "px";
    //         console.log(value);
    //         // console.log(pdBottomValue);
    //         // console.log(pdBottomValue);
    //         // console.log(paddingBox.style.height);
    //         // if (prevVal < value) {
    //         //     paddingBox.style.top = (value * -1) + "px";
    //         //     paddingBox.style.height = Number(pdHeight) + val + "px";
    //         //     // paddingBox.style.height = 100 + pd-bt + pd+top ;
    //         // } else if (prevVal > value) {
    //         //     paddingBox.style.top = (value * -1) + "px";
    //         //     paddingBox.style.height = Number(pdHeight) - val + "px";
    //         // }
    //         break;
    //     case "right":
    //         const pdLeftValue = Number(barList.left.lastChild.previousSibling.innerText);
    //         paddingBox.style.width = 100 + pdLeftValue + value + "px";
    //         borderBox.style.width = bordergWidth + value + "px";
    //         break;
    //     case "bottom":
    //         const pdTopValue = Number(barList.top.lastChild.previousSibling.innerText);
    //         paddingBox.style.height = 100 + pdTopValue + value + "px";
    //         borderBox.style.height = borderHeight + value + "px";
    //         break;
    //     case "left":
    //         const pdRightValue = Number(barList.right.lastChild.previousSibling.innerText);
    //         paddingBox.style.left = borderLeftPosition + (value * -1) + "px";
    //         paddingBox.style.width = 100 + pdRightValue + value + "px";
    //         borderBox.style.width = bordergWidth + value + "px";
    //         break;
    //     default:
    //         break;
    // }

}

const borderBoxMove = (value, direction, myMoving = true) => {

    const contentWidth = Number(window.getComputedStyle(contentBox).width.split("px")[0]);
    const contentHeight = Number(window.getComputedStyle(contentBox).height.split("px")[0]);

    const paddingWidth = Number(window.getComputedStyle(paddingBox).width.split("px")[0]);
    const paddingHeight = Number(window.getComputedStyle(paddingBox).height.split("px")[0]);

    if (myMoving) {

        switch (direction) {
            // 100 100 100 100
            case "top":
                const bottomPos = Number(borderBarList.bottom.lastChild.previousSibling.innerText);
                curHeight = paddingHeight + bottomPos + value;
                borderBox.style.height = curHeight + "px";
                marginBoxMove(curHeight, direction, false);
                parentMove("BORDER", direction);
                break;
            case "right":
                const leftPos = Number(borderBarList.left.lastChild.previousSibling.innerText);
                curWidth = paddingWidth + leftPos + value;
                borderBox.style.width = curWidth + "px";;
                marginBoxMove(curWidth, direction, false);
                break;
            case "bottom":
                const topPos = Number(borderBarList.top.lastChild.previousSibling.innerText);
                curHeight = paddingHeight + topPos + value;
                borderBox.style.height = curHeight + "px";
                marginBoxMove(curHeight, direction, false);
                break;
            case "left":
                const rightPos = Number(borderBarList.right.lastChild.previousSibling.innerText);
                curWidth = paddingWidth + rightPos + value;
                borderBox.style.width = curWidth + "px";
                marginBoxMove(curWidth, direction, false);
                parentMove("BORDER", direction);
                break;
            default:
                break;
        }
        return;
    } else {

        if (direction === "top" || direction === "bottom") {

            const topValue = Number(borderBarList.top.lastChild.previousSibling.innerText);
            const bottomValue = Number(borderBarList.bottom.lastChild.previousSibling.innerText);
            const val = value + topValue + bottomValue;
            borderBox.style.height = val + "px";
            marginBoxMove(val, direction, false);

        } else if (direction === "left" || direction === "right") {

            const leftValue = Number(borderBarList.left.lastChild.previousSibling.innerText);
            const rightValue = Number(borderBarList.right.lastChild.previousSibling.innerText);
            const val = value + leftValue + rightValue;
            borderBox.style.width = val + "px";
            marginBoxMove(val, direction, false);


        }

        return;
    }
}

const marginBoxMove = (value, direction, myMoving = true) => {

    const borderWidth = Number(window.getComputedStyle(borderBox).width.split("px")[0]);
    const borderHeight = Number(window.getComputedStyle(borderBox).height.split("px")[0]);

    if (myMoving) {

        switch (direction) {
            // 100 100 100 100
            case "top":
                const bottomValue = Number(marginBarList.bottom.lastChild.previousSibling.innerText);
                curHeight = borderHeight + bottomValue + value;
                marginBox.style.height = curHeight + "px";
                parentMove("MARGIN", direction);
                break;
            case "right":
                const leftValue = Number(marginBarList.left.lastChild.previousSibling.innerText);
                curWidth = borderWidth + leftValue + value;
                marginBox.style.width = curWidth + "px";;
                break;
            case "bottom":
                const topValue = Number(marginBarList.top.lastChild.previousSibling.innerText);
                curHeight = borderHeight + topValue + value;
                marginBox.style.height = curHeight + "px";
                break;
            case "left":
                const rightValue = Number(marginBarList.right.lastChild.previousSibling.innerText);
                curWidth = borderWidth + rightValue + value;
                marginBox.style.width = curWidth + "px";
                parentMove("MARGIN", direction);
                break;
            default:
                break;
        }
        return;
    } else {

        if (direction === "top" || direction === "bottom") {

            const topValue = Number(marginBarList.top.lastChild.previousSibling.innerText);
            const bottomValue = Number(marginBarList.bottom.lastChild.previousSibling.innerText);

            marginBox.style.height = value + topValue + bottomValue + "px";


        } else if (direction === "left" || direction === "right") {

            const leftValue = Number(marginBarList.left.lastChild.previousSibling.innerText);
            const rightValue = Number(marginBarList.right.lastChild.previousSibling.innerText);

            marginBox.style.width = value + leftValue + rightValue + "px";

        }

        return;
    }



}

//부모 박스가 이동하면 자식 박스들도 이동
const parentMove = (parentName, direction) => {

    const paddingLeftValue = Number(paddingBarList.left.lastChild.previousSibling.innerText);
    const borderLeftValue = Number(borderBarList.left.lastChild.previousSibling.innerText);
    const marginLeftValue = Number(marginBarList.left.lastChild.previousSibling.innerText);
    const paddingTopValue = Number(paddingBarList.top.lastChild.previousSibling.innerText);
    const borderTopValue = Number(borderBarList.top.lastChild.previousSibling.innerText);
    const marginTopValue = Number(marginBarList.top.lastChild.previousSibling.innerText);


    if (parentName === "PADDING") {
        if (direction === "top") {
            contentBox.style.top = marginTopValue + borderTopValue + paddingTopValue + "px";
        } else if (direction === "left") {
            contentBox.style.left = marginLeftValue + borderLeftValue + paddingLeftValue + "px";
        }
    } else if (parentName === "BORDER") {
        if (direction === "top") {
            paddingBox.style.top = marginTopValue + borderTopValue + "px";
            contentBox.style.top = marginTopValue + borderTopValue + paddingTopValue + "px";
        } else if (direction === "left") {
            paddingBox.style.left = marginLeftValue + borderLeftValue + "px";
            contentBox.style.left = marginLeftValue + borderLeftValue + paddingLeftValue + "px";

        }
    } else if (parentName === "MARGIN") {
        if (direction === "top") {
            borderBox.style.top = marginTopValue + "px";
            paddingBox.style.top = marginTopValue + borderTopValue + "px";
            contentBox.style.top = marginTopValue + borderTopValue + paddingTopValue + "px";
        } else if (direction === "left") {
            borderBox.style.left = marginLeftValue + "px";
            paddingBox.style.left = marginLeftValue + borderLeftValue + "px";
            contentBox.style.left = marginLeftValue + borderLeftValue + paddingLeftValue + "px";

        }
    }


}

//mousemove 콜백함수
const mouseMove = (e, element, valueLabel, minRelativeX, maxRelativeX, controlDir, controlType, barList) => {

    const maxWidth = maxRelativeX - minRelativeX;
    const avarageValue = Math.round(maxWidth / 10);
    let curX = e.clientX - minRelativeX;

    //지정된 슬라이드 게이지를 초과했는지 확인
    if (e.clientX > maxRelativeX || e.clientX < minRelativeX) {
        if (e.clientX > maxRelativeX && prevGauge !== maxWidth) {
            curX = maxWidth;
            let value = Math.round(curX / avarageValue) * 10;
            console.log(maxWidth / 10);
            element.style.width = value + "%";
            valueLabel.innerHTML = `${value}`;
            barTypeCheck(value, controlDir, controlType, barList);
            prevGauge = curX;
        } else if (e.clientX < minRelativeX && prevGauge !== 0) {
            curX = 0;
            element.style.width = 0 + "%";
            valueLabel.innerHTML = `${curX}`;
            barTypeCheck(curX, controlDir, controlType, barList);
            prevGauge = curX;
        }
        return;
    }
    const n = curX % avarageValue;

    //ok

    // console.log(`cur : ${curX} , n : ${n}`);
    // console.log(avarageValue);

    if (n !== 0) {

        if (n < avarageValue / 2) {
            curX = prevGauge;
        } else if (n >= (avarageValue / 2) + (avarageValue / 2 / 2)) {
            // curX = Math.ceil(curX / avarageValue) * 10;
            if (maxWidth % 10 === 0) {
                curX = Math.round(curX / 10) * 10;
            } else {
                curX = Math.round(curX);
            }
        }
        else {
            return;
        }

    }

    if (prevGauge !== curX) {


        let value = Math.round((curX / avarageValue)) * 10;

        // console.log(`value : ${value}`);

        element.style.width = value + "%";

        valueLabel.innerHTML = `${value}`;

        barTypeCheck(value, controlDir, controlType);

        prevGauge = curX;
    }

    // const maxWidth = maxRelativeX - minRelativeX;
    // let curX = (e.clientX - minRelativeX) / 2;

    // //지정된 슬라이드 게이지를 초과했는지 확인
    // if (e.clientX > maxRelativeX || e.clientX < minRelativeX) {
    //     if (e.clientX > maxRelativeX && prevGauge !== 100) {
    //         curX = maxWidth / 2;
    //         element.style.width = curX * 2 + "px";
    //         valueLabel.innerHTML = `${curX}`;
    //         barTypeCheck(curX, controlDir, controlType, barList);
    //         prevGauge = curX;
    //     } else if (e.clientX < minRelativeX && prevGauge !== 0) {
    //         curX = 0;
    //         element.style.width = curX * 2 + "px";
    //         valueLabel.innerHTML = `${curX}`;
    //         barTypeCheck(curX, controlDir, controlType, barList);
    //         prevGauge = curX;
    //     }
    //     return;
    // }

    // const n = curX % 10;

    // if (n !== 0) {

    //     if (n < 3) {
    //         curX = prevGauge;
    //     } else if (n > 7) {
    //         curX = Math.ceil(curX / 10) * 10;
    //     }
    //     else {
    //         return;
    //     }

    // }

    // if (prevGauge !== curX) {

    //     if (curX > prevGauge) {
    //         increased = true;
    //     } else {
    //         increased = false;
    //     }

    //     element.style.width = curX * 2 + "px";

    //     valueLabel.innerHTML = `${curX}`;

    //     barTypeCheck(curX, controlDir, controlType);

    //     prevGauge = curX;
    // }

    // console.log(controlType);


    /* 첫번째 방법
    let [curPos,] = window.getComputedStyle(element).getPropertyValue('width').split("px");

    const maxWidth = maxRelativeX-minRelativeX;

    if(prevX === 0){
        prevX = e.clientX ;
    }

    let curX = Number(curPos);

    let moveX = prevX < e.clientX ? curX + Math.abs(prevX - e.clientX) : curX - Math.abs(prevX - e.clientX) ;

    if(moveX < 0) {
        moveX = 0;
    }else if(moveX > maxWidth){
        moveX = maxWidth;

    }

    prevX = e.clientX;

    if(e.clientX < minRelativeX || e.clientX > maxRelativeX){
        console.log("limit");
        if(curX <= 0 || curX >= maxWidth){
            return;
        }
    }

    element.style.width = moveX + "px";
    */

    // console.log(`prev : ${prevX}`);
    // console.log(`e : ${e.clientX}`);
    // console.log(`cur : ${curX}`);
    // console.log(`move : ${moveX}`);
    // console.dir(e.target.offsetLeft);
}

evnetAdd();