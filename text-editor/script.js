// Select all the buttons and input elements for options
let optionsButtons = document.querySelectorAll(".option-button");
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let fontSizeRef = document.getElementById("fontSize");
let writingArea = document.getElementById("text-input");
let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let spacingButtons = document.querySelectorAll(".spacing");
let formatButtons = document.querySelectorAll(".format");
let scriptButtons = document.querySelectorAll(".script");

// List of available fonts for the user to choose from
let fontList = [
    "Arial",
    "Verdana",
    "Times New Roman",
    "Garamond",
    "Georgia",
    "Courier New",
    "Cursive",
    "Poppins"
];

// Initial setup function to add options to the font and size selectors
const initializer = () => {

    // Highlight active buttons for alignment, spacing, format, and script
    highlighter(alignButtons, true);
    highlighter(spacingButtons, true);
    highlighter(formatButtons, false);
    highlighter(scriptButtons, true);

    // Adding font options to the font selector dropdown
    fontList.map((font) => {
        let option = document.createElement("option");
        option.value = font;
        option.innerHTML = font;
        fontName.appendChild(option);
    });

    // Adding font size options (1 to 7) to the font-size selector dropdown
    for (let i = 1; i <= 7; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        fontSizeRef.appendChild(option);
    }

    // Default value for font-size
    fontSizeRef.value = 3;
};

// Function to modify text styles using the execCommand method
// Every button id corresponds to a specific execCommand function
function modifyText(command, defaultUi, value) {
    document.execCommand(command, defaultUi, value);
};

// Event listeners for the buttons (option-buttons)
optionsButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        // Call modifyText when any option button is clicked
        modifyText(button.id, false, null); 
    });
});

// Event listeners for advanced options (like font size, font, etc.)
advancedOptionButton.forEach((button) => {
    button.addEventListener("change", () => {
        // Call modifyText when any advanced option button is changed
        modifyText(button.id, false, button.value);
    });
});

// Event listeners for color pickers and alpha values
const backColorPicker = document.getElementById('backColor');
const backColorPickerAlpha = document.getElementById('backColorAlpha');
backColorPicker.addEventListener('input', () => changeColor(backColorPicker, backColorPickerAlpha));
backColorPickerAlpha.addEventListener('input', () => changeColor(backColorPicker, backColorPickerAlpha));

const foreColorPicker = document.getElementById('foreColor');
const foreColorPickerAlpha = document.getElementById('foreColorAlpha');
foreColorPicker.addEventListener('input', () => changeColor(foreColorPicker, foreColorPickerAlpha));
foreColorPickerAlpha.addEventListener('input', () => changeColor(foreColorPicker, foreColorPickerAlpha));

// Function to change the background and foreground colors with alpha transparency
function changeColor(init, alpha) {
    // Convert hex color to RGB and apply the alpha value
    let rgbObject = rgbToString(hexToRgb(init.value), alpha.value);
    console.log(rgbObject);
    modifyText(init.id, false, rgbObject);
};

// Updating the alpha percentage display for foreground and background colors
const foreColorAlphaPercent = document.getElementById('foreColorAlphaValue');
foreColorAlphaPercent.innerHTML = foreColorPickerAlpha.value + '%';
foreColorPickerAlpha.addEventListener('input', () => {
    foreColorAlphaPercent.innerHTML = foreColorPickerAlpha.value + '%';
});

const backColorAlphaPercent = document.getElementById('backColorAlphaValue');
backColorAlphaPercent.innerHTML = backColorPickerAlpha.value + '%';
backColorPickerAlpha.addEventListener('input', () => {
    backColorAlphaPercent.innerHTML = backColorPickerAlpha.value + '%';
});

// Event listener for the link creation button
linkButton.addEventListener('click', function() {
    // Prompt the user for a URL
    let userLink = prompt('Enter your Link: ');
    // Check if the link starts with 'http', if not add it
    if (/http/i.test(userLink)) {
        modifyText(this.id, false, userLink);
    } else {
        userLink = "http://" + userLink;
        modifyText(this.id, false, userLink);
    }
});

// Function to highlight buttons when they are active
const highlighter = (className, needsRemoval) => {
    className.forEach((button) => {
        button.addEventListener("click", () => {
            // If only one button in the group should be active (like alignment)
            if (needsRemoval) {
                let alreadyActive = false;
                if (button.classList.contains("active")) {
                    alreadyActive = true;
                }
                // Remove the 'active' class from all buttons of the same group
                highlighterRemover(className);
                // If the clicked button was not active before, add 'active' to it
                if (!alreadyActive) {
                    button.classList.add("active");
                }
            } 
            else {
                // Toggle 'active' class for other types of buttons
                button.classList.toggle("active");
            }
        });
    });
};

// Function to remove the 'active' class from all buttons in a group
const highlighterRemover = (className) => {
    className.forEach((button) => {
        button.classList.remove("active");
    });
};

// Helper function to convert hex color to RGB format
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
}

// Helper function to convert RGB object to CSS 'rgb' string format with alpha transparency
function rgbToString(rgbObject, alphaValue) {
    return `rgb(${rgbObject.r} ${rgbObject.g} ${rgbObject.b} / ${alphaValue}%)`;
}

// Initialize the app when the window is loaded
window.onload = initializer();
