// Enable drag functionality for all 14 plants
dragElement(document.getElementById('plant1'));
dragElement(document.getElementById('plant2'));
dragElement(document.getElementById('plant3'));
dragElement(document.getElementById('plant4'));
dragElement(document.getElementById('plant5'));
dragElement(document.getElementById('plant6'));
dragElement(document.getElementById('plant7'));
dragElement(document.getElementById('plant8'));
dragElement(document.getElementById('plant9'));
dragElement(document.getElementById('plant10'));
dragElement(document.getElementById('plant11'));
dragElement(document.getElementById('plant12'));
dragElement(document.getElementById('plant13'));
dragElement(document.getElementById('plant14'));

function dragElement(terrariumElement) {
    let offsetX = 0;
    let offsetY = 0;
    const dragArea = document.getElementById('plant-selection');

    terrariumElement.onpointerdown = pointerDrag;

    function pointerDrag(e) {
        e.preventDefault();
        terrariumElement.setPointerCapture(e.pointerId);

        const plantRect = terrariumElement.getBoundingClientRect();
        const areaRect = dragArea.getBoundingClientRect();
        offsetX = e.clientX - plantRect.left;
        offsetY = e.clientY - plantRect.top;

        terrariumElement.style.position = 'absolute';
        terrariumElement.style.width = `${plantRect.width}px`;
        terrariumElement.style.height = `${plantRect.height}px`;
        terrariumElement.style.left = `${plantRect.left - areaRect.left}px`;
        terrariumElement.style.top = `${plantRect.top - areaRect.top}px`;
        terrariumElement.style.zIndex = '3';
        terrariumElement.onpointermove = elementDrag;
        terrariumElement.onpointerup = stopElementDrag;
    }

    function elementDrag(e) {
        const areaRect = dragArea.getBoundingClientRect();
        terrariumElement.style.left = `${e.clientX - areaRect.left - offsetX}px`;
        terrariumElement.style.top = `${e.clientY - areaRect.top - offsetY}px`;
    }

    function stopElementDrag(e) {
        terrariumElement.releasePointerCapture(e.pointerId);
        terrariumElement.onpointermove = null;
        terrariumElement.onpointerup = null;
    }

}
