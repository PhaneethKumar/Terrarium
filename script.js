const dragArea = document.getElementById('plant-selection');
const resetBtn = document.getElementById('reset-btn');
const plants = document.querySelectorAll('.plant');

let audioCtx = null;
let soundEnabled = true;

function getAudioCtx() {
    if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        audioCtx = new AC();
    }
    // Browsers start the context suspended until a user gesture
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function playTone({ from, to, duration, type = 'sine', volume = 0.15 }) {
    if (!soundEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(to, now + duration);

    // Quick fade in/out avoids clicks
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
}

// Rising "blip" when lifting a plant
const playPickup = () => playTone({ from: 380, to: 620, duration: 0.12 });
// Soft falling "thud" when setting it down
const playPlace = () => playTone({ from: 260, to: 140, duration: 0.16, type: 'triangle', volume: 0.2 });

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

const STORAGE_KEY = 'plantLayout';

function saveLayout() {
    const layout = {};
    plants.forEach((el) => {
        if (el.style.position !== 'absolute') return;
        const cs = getComputedStyle(el);
        layout[el.id] = {
            left: parseFloat(cs.left) || 0,
            top: parseFloat(cs.top) || 0,
            width: parseFloat(cs.width) || 0,
            height: parseFloat(cs.height) || 0,
            zIndex: parseInt(cs.zIndex) || 0,
        };
    });

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch (e) {
        console.error('Failed to save layout:', e);
    }
}

function restoreLayout() {
    let layout = {};
    try {
        layout = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
        console.error('Failed to restore layout:', e);
        return;
    }

    if (Object.keys(layout).length > 0) {
        plants.forEach((el) => {
            const pos = layout[el.id];
            if (pos) {
                Object.assign(el.style, {
                    position: 'absolute',
                    left: `${pos.left}px`,
                    top: `${pos.top}px`,
                    width: `${pos.width}px`,
                    height: `${pos.height}px`,
                    zIndex: pos.zIndex,
                });
            }
        });
    }
}

function clearSavedLayout() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Failed to clear saved layout:', e);
    }
}

// Store on load, and refresh on resize so the layout stays correct
window.addEventListener('load', () => {
    storeHomePositions();
    restoreLayout();
});
window.addEventListener('resize', storeHomePositions);

plants.forEach(dragElement);

let topZ = 3;

function bringToFront(el) {
    el.style.zIndex = ++topZ;
}

function dragElement(el) {
    let offsetX = 0, offsetY = 0;

    el.addEventListener('pointerdown', (e) => {
        playPickup();
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
        if (el.hasPointerCapture(e.pointerId)) {
            el.releasePointerCapture(e.pointerId);
            playPlace();
        }
        saveLayout();
    };
    el.addEventListener('pointerup', stop);
    el.addEventListener('pointercancel', stop);
    el.addEventListener('dblclick', () => {
        bringToFront(el);
        saveLayout();
    });
}

function resetPlants() {
    clearSavedLayout();

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