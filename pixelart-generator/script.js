// VARIABLES
const pxl_container = document.querySelector('.pxl_container');
const sizeEl = document.getElementById('pxl_range_picker');
const sizeVal = document.getElementById('pxl_range_val');
const pxl_color = document.getElementById('pxl_color_picker');
const clearBtn = document.getElementById('pxl_clear_button');
const createBtn = document.getElementById('create_btn');

// Function which creates grid with pixels
function populate(size, event) {
    pxl_container.innerHTML = "";
    pxl_container.style.backgroundColor = 'white';
    // Updating the --size CSS variable
    pxl_container.style.setProperty('--size', size);

    for (let i = 0; i < size * size; i++) {
        const div = document.createElement('div');
        div.classList.add('pixel');

        // Handle drawing or erasing when mouse button is pressed down
        function handle(event) {
            // On left click -> Draw
            if (event.buttons === 1) {
                div.style.backgroundColor = pxl_color.value;
            } 
            // On right click -> Erase
            else if (event.buttons === 2) {
                div.style.backgroundColor = "transparent";
            } 
            else {
                return;
            }
        };

        div.addEventListener('mousedown', handle);
        div.addEventListener('mouseover', handle);

        pxl_container.appendChild(div);
    }
};

// Create Pixel-Grid functionality
createBtn.addEventListener('click', () => {
    const newSize = sizeEl.value; // Get the current value of the input
    populate(newSize);
});

// Grid Size Range Input
sizeVal.innerHTML = sizeEl.value;
sizeEl.oninput = function() {
    sizeVal.innerHTML = this.value;
};

// Prevent context menu from opening on right click
pxl_container.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Prevent interpretation of event as drag & drop event
pxl_container.addEventListener('dragstart', function(event) {
    event.preventDefault();  
});


// Save Pixelart as image
const saveBtn = document.getElementById('save_btn');

// Function to save the pixel art as PNG
function saveAsImage() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    const pixelSize = 800 / sizeEl.value; // Calculates the size of each pixel based on the container size

    // Set the size of the canvas according to the pxl_container
    canvas.width = 800;
    canvas.height = 800;

    // Iterate over all pixels in the grid
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach((pixel, index) => {
        const row = Math.floor(index / sizeEl.value);
        const col = index % sizeEl.value;
        
        // Get the background color of each pixel
        const bgColor = window.getComputedStyle(pixel).backgroundColor;
        
        // Draw the pixel on the canvas
        context.fillStyle = bgColor;
        context.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);

        // Draw the border of the pixel (Stroke/Borders)
        context.strokeStyle = 'black'; // Border color
        context.lineWidth = 1; // Border thickness
        context.strokeRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
    });

    // Create an image from the canvas
    const image = canvas.toDataURL('image/png');
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = image;
    link.download = 'pixelart.png';
    link.click();
};

// Event Listener to save the picture
saveBtn.addEventListener('click', saveAsImage);

// Bootstrap Tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

