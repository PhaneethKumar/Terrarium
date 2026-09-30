let topZ = 3;

const dragArea = document.getElementById('plant-selection');
const resetBtn = document.getElementById('reset-btn');
const plants = document.querySelectorAll('.plant');

// Original position/size of each plant, relative to #plant-selection
const homePositions = new Map();

function storeHomePositions() {
    const areaRect = dragArea.getBoundingClientRect();
    plants.forEach((el) => {
        // The .plant-holder stays in the grid even after its image is dragged out,
        // so it always marks the plant's original slot.
        const r = el.parentElement.getBoundingClientRect();
        homePositions.set(el, {
            left: r.left - areaRect.left,
            top: r.top - areaRect.top,
            width: r.width,
            height: r.height,
        });
    });
}

// Store on load, and refresh on resize so the layout stays correct
window.addEventListener('load', storeHomePositions);
window.addEventListener('resize', storeHomePositions);

plants.forEach(dragElement);

function bringToFront(el) {
    el.style.zIndex = ++topZ;
}

function dragElement(el) {
    let offsetX = 0, offsetY = 0;

    el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);

        const areaRect = dragArea.getBoundingClientRect();
        const plantRect = el.getBoundingClientRect();   // visual box: only used for the grab offset
        offsetX = e.clientX - plantRect.left;
        offsetY = e.clientY - plantRect.top;

        // Layout-based position and size (unaffected by the sway rotation)
        let left, top;
        if (el.style.position === 'absolute') {
            // Already dragged before (or mid-reset): read its current animated values
            const cs = getComputedStyle(el);
            left = parseFloat(cs.left);
            top = parseFloat(cs.top);
        } else {
            // Still in the sidebar: use its holder's slot
            const holderRect = el.parentElement.getBoundingClientRect();
            left = holderRect.left - areaRect.left;
            top = holderRect.top - areaRect.top;
        }
        const width = el.offsetWidth;
        const height = el.offsetHeight;

        // If the plant is in mid-reset, stop the animation and grab it where it is
        clearTimeout(el.resetTimer);
        el.classList.remove('returning');

        // If none of the plants has the returning class, enable the reset button
        if (![...plants].some((p) => p.classList.contains('returning'))) {
            resetBtn.disabled = false;
        }

        Object.assign(el.style, {
            position: 'absolute',
            width: `${width}px`,
            height: `${height}px`,
            left: `${left}px`,
            top: `${top}px`,
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
    el.addEventListener('dblclick', () => bringToFront(el));
}

function resetPlants() {
    let moved = 0;

    plants.forEach((el) => {
        // Only plants that were dragged have inline absolute positioning
        if (el.style.position !== 'absolute') return;

        moved++;
        const home = homePositions.get(el);
        el.classList.add('returning');

        // Next frame, so the browser registers the transition before values change
        requestAnimationFrame(() => {
            Object.assign(el.style, {
                left: `${home.left}px`,
                top: `${home.top}px`,
                width: `${home.width}px`,
                height: `${home.height}px`,
            });
        });

        // After the 1s transition, drop the inline styles so the plant
        // returns to normal grid flow inside its holder
        clearTimeout(el.resetTimer);
        el.resetTimer = setTimeout(() => {
            el.classList.remove('returning');
            ['position', 'left', 'top', 'width', 'height', 'zIndex']
                .forEach((prop) => (el.style[prop] = ''));
            if (![...plants].some((p) => p.classList.contains('returning'))) {
                resetBtn.disabled = false;
            }
        }, 1050);
    });

    if (moved) resetBtn.disabled = true; // prevent double-clicks mid-animation
}

resetBtn.addEventListener('click', resetPlants);