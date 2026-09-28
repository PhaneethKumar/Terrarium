let topZ = 3;

document.querySelectorAll('.plant').forEach(dragElement);

function dragElement(el) {
    const dragArea = document.getElementById('plant-selection');
    let offsetX = 0, offsetY = 0;

    el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);

        const plantRect = el.getBoundingClientRect();
        const areaRect = dragArea.getBoundingClientRect();
        offsetX = e.clientX - plantRect.left;
        offsetY = e.clientY - plantRect.top;

        Object.assign(el.style, {
            position: 'absolute',
            width: `${el.offsetWidth}px`,
            height: `${el.offsetHeight}px`,
            left: `${plantRect.left - areaRect.left}px`,
            top: `${plantRect.top - areaRect.top}px`,
            zIndex: ++topZ,
        });
    });

    el.addEventListener('pointermove', (e) => {
        if (!el.hasPointerCapture(e.pointerId)) return;
        const areaRect = dragArea.getBoundingClientRect();
        const maxX = areaRect.width - el.offsetWidth;
        const maxY = areaRect.height - el.offsetHeight;
        const x = e.clientX - areaRect.left - offsetX;
        const y = e.clientY - areaRect.top - offsetY;
        el.style.left = `${Math.min(Math.max(0, x), maxX)}px`;
        el.style.top = `${Math.min(Math.max(0, y), maxY)}px`;
    });

    const stop = (e) => {
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);
}
