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
    // Initialize position tracking variables
    let pos1 = 0,  // Previous mouse X position
        pos2 = 0,  // Previous mouse Y position  
        pos3 = 0,  // Current mouse X position
        pos4 = 0;  // Current mouse Y position

    // Set up the initial drag event listener
    terrariumElement.onpointerdown = pointerDrag;

    function pointerDrag(e) {
        // Even if you don't explicitly pass variables into an event listener, the browser automatically hands the function an invisible gift: the Event Object (usually written as e or event).
        // The browser automatically passes all the details of that click into the function. That event object contains a property called e.target (the exact HTML element your mouse just clicked).

        // Prevent default browser behavior which interferes with the drag operation (like text selection)
        e.preventDefault();

        // Capture the initial mouse/touch position
        pos3 = e.clientX;  // X coordinate where drag started
        pos4 = e.clientY;  // Y coordinate where drag started

        // Set up event listeners for the dragging process
        document.onpointermove = elementDrag;
        document.onpointerup = stopElementDrag;
    }

    function elementDrag(e) {
        // Calculate the distance moved since the last event
        pos1 = pos3 - e.clientX;  // Horizontal distance moved
        pos2 = pos4 - e.clientY;  // Vertical distance moved

        // Update the current position tracking
        pos3 = e.clientX;  // New current X position
        pos4 = e.clientY;  // New current Y position

        // Apply the movement to the element's position
        terrariumElement.style.top = (terrariumElement.offsetTop - pos2) + 'px';
        terrariumElement.style.left = (terrariumElement.offsetLeft - pos1) + 'px';
    }

    function stopElementDrag() {
        // Remove the document-level event listeners
        document.onpointerup = null;
        document.onpointermove = null;
    }

}
