const layout = {
    default: [
        ["அ", "இ", "உ", "எ", "ஒ", "ஐ"],
        ["க்", "ச்", "ட்", "த்", "ப்", "ற்"],
        ["ங்", "ஞ்", "ண்", "ந்", "ம்", "ன்"],
        ["ய்", "ர்", "ல்", "வ்", "ழ்", "ள்"]
    ],
    shift: [
        ["ஆ", "ஈ", "ஊ", "ஏ", "ஓ", "ஔ"],
        ["க", "ச", "ட", "த", "ப", "ற"],
        ["ங", "ஞ", "ண", "ந", "ம", "ன"],
        ["ய", "ர", "ல", "வ", "ழ", "ள"]
    ],
    grantha: [
        ["ஜ", "ஷ", "ஸ", "ஹ", "க்ஷ", "ஸ்ரீ"],
        ["ஜ்", "ஷ்", "ஸ்", "ஹ்", "", ""],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""]
    ]
};

// Basic Uyirmei combinations (simplified for prototype)
const combinations = {
    "க்+அ": "க", "க்+ஆ": "கா", "க்+இ": "கி", "க்+ஈ": "கீ", "க்+உ": "கு", "க்+ஊ": "கூ", "க்+எ": "கெ", "க்+ஏ": "கே", "க்+ஐ": "கை", "க்+ஒ": "கொ", "க்+ஓ": "கோ", "க்+ஔ": "கௌ",
    "ச்+அ": "ச", "ச்+ஆ": "சா", "ச்+இ": "சி", "ச்+ஈ": "சீ", "ச்+உ": "சு", "ச்+ஊ": "சூ", "ச்+எ": "செ", "ச்+ஏ": "சே", "ச்+ஐ": "சை", "ச்+ஒ": "சொ", "ச்+ஓ": "சோ", "ச்+ஔ": "சௌ",
    "ட்+அ": "ட", "ட்+ஆ": "டா", "ட்+இ": "டி", "ட்+ஈ": "டீ", "ட்+உ": "டு", "ட்+ஊ": "டூ", "ட்+எ": "டெ", "ட்+ஏ": "டே", "ட்+ஐ": "டை", "ட்+ஒ": "டொ", "ட்+ஓ": "டோ", "ட்+ஔ": "டௌ",
    "த்+அ": "த", "த்+ஆ": "தா", "த்+இ": "தி", "த்+ஈ": "தீ", "த்+உ": "து", "த்+ஊ": "தூ", "த்+எ": "தெ", "த்+ஏ": "தே", "த்+ஐ": "தை", "த்+ஒ": "தொ", "த்+ஓ": "தோ", "த்+ஔ": "தௌ",
    "ப்+அ": "ப", "ப்+ஆ": "பா", "ப்+இ": "பி", "ப்+ஈ": "பீ", "ப்+உ": "பு", "ப்+ஊ": "பூ", "ப்+எ": "பெ", "ப்+ஏ": "பே", "ப்+ஐ": "பை", "ப்+ஒ": "பொ", "ப்+ஓ": "போ", "ப்+ஔ": "பௌ",
    "ற்+அ": "ற", "ற்+ஆ": "றா", "ற்+இ": "றி", "ற்+ஈ": "றீ", "ற்+உ": "று", "ற்+ஊ": "றூ", "ற்+எ": "றெ", "ற்+ஏ": "றே", "ற்+ஐ": "றை", "ற்+ஒ": "றொ", "ற்+ஓ": "றோ", "ற்+ஔ": "றௌ",
    
    "ங்+அ": "ங", "ங்+ஆ": "ஙா", "ங்+இ": "ஙி", "ங்+ஈ": "ஙீ", "ங்+உ": "ஙு", "ங்+ஊ": "ஙூ", "ங்+எ": "ஙெ", "ங்+ஏ": "ஙே", "ங்+ஐ": "ஙை", "ங்+ஒ": "ஙொ", "ங்+ஓ": "ஙோ", "ங்+ஔ": "ஙௌ",
    "ஞ்+அ": "ஞ", "ஞ்+ஆ": "ஞா", "ஞ்+இ": "ஞி", "ஞ்+ஈ": "ஞீ", "ஞ்+உ": "ஞு", "ஞ்+ஊ": "ஞூ", "ஞ்+எ": "ஞெ", "ஞ்+ஏ": "ஞே", "ஞ்+ஐ": "ஞை", "ஞ்+ஒ": "ஞொ", "ஞ்+ஓ": "ஞோ", "ஞ்+ஔ": "ஞௌ",
    "ண்+அ": "ண", "ண்+ஆ": "ணா", "ண்+இ": "ணி", "ண்+ஈ": "ணீ", "ண்+உ": "ணு", "ண்+ஊ": "ணூ", "ண்+எ": "ணெ", "ண்+ஏ": "ணே", "ண்+ஐ": "ணை", "ண்+ஒ": "ணொ", "ண்+ஓ": "ணோ", "ண்+ஔ": "ணௌ",
    "ந்+அ": "ந", "ந்+ஆ": "நா", "ந்+இ": "நி", "ந்+ஈ": "நீ", "ந்+உ": "நு", "ந்+ஊ": "நூ", "ந்+எ": "நெ", "ந்+ஏ": "நே", "ந்+ஐ": "நை", "ந்+ஒ": "நொ", "ந்+ஓ": "நோ", "ந்+ஔ": "நௌ",
    "ம்+அ": "ம", "ம்+ஆ": "மா", "ம்+இ": "மி", "ம்+ஈ": "மீ", "ம்+உ": "மு", "ம்+ஊ": "மூ", "ம்+எ": "மெ", "ம்+ஏ": "மே", "ம்+ஐ": "மை", "ம்+ஒ": "மொ", "ம்+ஓ": "மோ", "ம்+ஔ": "மௌ",
    "ன்+அ": "ன", "ன்+ஆ": "னா", "ன்+இ": "னி", "ன்+ஈ": "னீ", "ன்+உ": "னு", "ன்+ஊ": "னூ", "ன்+எ": "னெ", "ன்+ஏ": "னே", "ன்+ஐ": "னை", "ன்+ஒ": "னொ", "ன்+ஓ": "னோ", "ன்+ஔ": "னௌ",
    
    "ய்+அ": "ய", "ய்+ஆ": "யா", "ய்+இ": "யி", "ய்+ஈ": "யீ", "ய்+உ": "யு", "ய்+ஊ": "யூ", "ய்+எ": "யெ", "ய்+ஏ": "யே", "ய்+ஐ": "யை", "ய்+ஒ": "யொ", "ய்+ஓ": "யோ", "ய்+ஔ": "யௌ",
    "ர்+அ": "ர", "ர்+ஆ": "ரா", "ர்+இ": "ரி", "ர்+ஈ": "ரீ", "ர்+உ": "ரு", "ர்+ஊ": "ரூ", "ர்+எ": "ரெ", "ர்+ஏ": "ரே", "ர்+ஐ": "ரை", "ர்+ஒ": "ரொ", "ர்+ஓ": "ரோ", "ர்+ஔ": "ரௌ",
    "ல்+அ": "ல", "ல்+ஆ": "லா", "ல்+இ": "லி", "ல்+ஈ": "லீ", "ல்+உ": "லு", "ல்+ஊ": "லூ", "ல்+எ": "லெ", "ல்+ஏ": "லே", "ல்+ஐ": "லை", "ல்+ஒ": "லொ", "ல்+ஓ": "லோ", "ல்+ஔ": "லௌ",
    "வ்+அ": "வ", "வ்+ஆ": "வா", "வ்+இ": "வி", "வ்+ஈ": "வீ", "வ்+உ": "வு", "வ்+ஊ": "வூ", "வ்+எ": "வெ", "வ்+ஏ": "வே", "வ்+ஐ": "வை", "வ்+ஒ": "வொ", "வ்+ஓ": "வோ", "வ்+ஔ": "வௌ",
    "ழ்+அ": "ழ", "ழ்+ஆ": "ழா", "ழ்+இ": "ழி", "ழ்+ஈ": "ழீ", "ழ்+உ": "ழு", "ழ்+ஊ": "ழூ", "ழ்+எ": "ழெ", "ழ்+ஏ": "ழே", "ழ்+ஐ": "ழை", "ழ்+ஒ": "ழொ", "ழ்+ஓ": "ழோ", "ழ்+ஔ": "ழௌ",
    "ள்+அ": "ள", "ள்+ஆ": "ளா", "ள்+இ": "ளி", "ள்+ஈ": "ளீ", "ள்+உ": "ளு", "ள்+ஊ": "ளூ", "ள்+எ": "ளெ", "ள்+ஏ": "ளே", "ள்+ஐ": "ளை", "ள்+ஒ": "ளொ", "ள்+ஓ": "ளோ", "ள்+ஔ": "ளௌ"
};

let isShift = false;
let isGrantha = false;
const output = document.getElementById('output');
const keyboardContainer = document.getElementById('keyboard');
const suggestionBar = document.getElementById('suggestion-bar');

// Mock dictionary for suggestions
const mockDictionary = ["அம்மா", "அப்பா", "தமிழ்", "வணக்கம்", "யாம்", "கீபோர்டு", "தொல்காப்பியம்"];

function renderKeyboard() {
    keyboardContainer.innerHTML = '';
    let currentLayout = layout.default;
    if (isGrantha) {
        currentLayout = layout.grantha;
    } else if (isShift) {
        currentLayout = layout.shift;
    }

    // Create WASD-style arrow key cluster
    const arrowCluster = document.createElement('div');
    arrowCluster.className = 'arrow-cluster';

    const upArrowBtn = document.createElement('button');
    upArrowBtn.className = 'key action arrow-key up';
    upArrowBtn.textContent = '▲';
    upArrowBtn.onclick = () => moveCursorVertical(-1);

    const leftArrowBtn = document.createElement('button');
    leftArrowBtn.className = 'key action arrow-key left';
    leftArrowBtn.textContent = '◀';
    leftArrowBtn.onclick = () => moveCursor(-1);

    const downArrowBtn = document.createElement('button');
    downArrowBtn.className = 'key action arrow-key down';
    downArrowBtn.textContent = '▼';
    downArrowBtn.onclick = () => moveCursorVertical(1);

    const rightArrowBtn = document.createElement('button');
    rightArrowBtn.className = 'key action arrow-key right';
    rightArrowBtn.textContent = '▶';
    rightArrowBtn.onclick = () => moveCursor(1);

    // Add two special characters to the empty spots in the 2x3 matrix
    const specialChar1Btn = document.createElement('button');
    specialChar1Btn.className = 'key action arrow-key special-char';
    specialChar1Btn.textContent = '?';
    specialChar1Btn.onclick = () => handleKeyPress('?');
    specialChar1Btn.style.gridColumn = '1';
    specialChar1Btn.style.gridRow = '1';

    const specialChar2Btn = document.createElement('button');
    specialChar2Btn.className = 'key action arrow-key special-char';
    specialChar2Btn.textContent = '!';
    specialChar2Btn.onclick = () => handleKeyPress('!');
    specialChar2Btn.style.gridColumn = '3';
    specialChar2Btn.style.gridRow = '1';

    arrowCluster.appendChild(specialChar1Btn);
    arrowCluster.appendChild(upArrowBtn);
    arrowCluster.appendChild(specialChar2Btn);
    arrowCluster.appendChild(leftArrowBtn);
    arrowCluster.appendChild(downArrowBtn);
    arrowCluster.appendChild(rightArrowBtn);

    // Create a container for the main keyboard rows
    const mainKeysContainer = document.createElement('div');
    mainKeysContainer.className = 'main-keys-container';

    // Add special keys row
    const specialRow = document.createElement('div');
    specialRow.className = 'keyboard-row';
    
    const commaBtn = document.createElement('button');
    commaBtn.className = 'key special';
    commaBtn.textContent = ',';
    commaBtn.onclick = () => handleKeyPress(',');

    const dotBtn = document.createElement('button');
    dotBtn.className = 'key special';
    dotBtn.textContent = '.';
    dotBtn.onclick = () => handleKeyPress('.');

    const aythamBtn = document.createElement('button');
    aythamBtn.className = 'key special';
    aythamBtn.textContent = 'ஃ';
    aythamBtn.onclick = () => handleKeyPress('ஃ');
    
    const auBtn = document.createElement('button');
    auBtn.className = 'key special';
    auBtn.textContent = 'ஔ';
    auBtn.onclick = () => handleKeyPress('ஔ');

    const granthaToggleBtn = document.createElement('button');
    granthaToggleBtn.className = 'key action';
    granthaToggleBtn.textContent = isGrantha ? 'தமிழ்' : 'Grantha';
    granthaToggleBtn.onclick = () => {
        isGrantha = !isGrantha;
        isShift = false; // Reset shift when toggling grantha
        renderKeyboard();
    };

    specialRow.appendChild(commaBtn);
    specialRow.appendChild(dotBtn);
    specialRow.appendChild(aythamBtn);
    specialRow.appendChild(auBtn);
    specialRow.appendChild(granthaToggleBtn);
    mainKeysContainer.appendChild(specialRow);

    currentLayout.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        
        row.forEach((key, colIndex) => {
            if (key === "") return; // Skip empty keys
            const keyBtn = document.createElement('button');
            keyBtn.className = 'key';
            keyBtn.textContent = key;
            
            let longPressKey = null;
            if (!isGrantha) {
                if (!isShift) {
                    longPressKey = layout.shift[rowIndex][colIndex];
                } else {
                    longPressKey = layout.default[rowIndex][colIndex];
                }
            }

            let pressTimer;
            let isLongPress = false;

            const startPress = (e) => {
                if (e.type === 'touchstart') e.preventDefault(); // Prevent double firing on mobile
                isLongPress = false;
                if (longPressKey) {
                    pressTimer = setTimeout(() => {
                        isLongPress = true;
                        handleKeyPress(longPressKey);
                        // Visual feedback for long press
                        keyBtn.style.backgroundColor = '#d0d0d0';
                        setTimeout(() => keyBtn.style.backgroundColor = '', 200);
                    }, 500); // 500ms for long press
                }
            };

            const endPress = (e) => {
                if (e.type === 'touchend') e.preventDefault();
                clearTimeout(pressTimer);
                if (!isLongPress) {
                    handleKeyPress(key);
                }
            };

            const cancelPress = () => {
                clearTimeout(pressTimer);
                isLongPress = true; // Prevent endPress from triggering if mouse leaves
            };

            keyBtn.addEventListener('mousedown', startPress);
            keyBtn.addEventListener('touchstart', startPress, { passive: false });
            keyBtn.addEventListener('mouseup', endPress);
            keyBtn.addEventListener('touchend', endPress, { passive: false });
            keyBtn.addEventListener('mouseleave', cancelPress);
            keyBtn.addEventListener('touchcancel', cancelPress);

            rowDiv.appendChild(keyBtn);
        });
        
        mainKeysContainer.appendChild(rowDiv);
    });

    // Add action row
    const actionRow = document.createElement('div');
    actionRow.className = 'keyboard-row';
    
    const shiftBtn = document.createElement('button');
    shiftBtn.className = 'key action';
    shiftBtn.textContent = isShift ? '⬇ Shift' : '⬆ Shift';
    shiftBtn.disabled = isGrantha; // Disable shift in grantha mode for now
    shiftBtn.onclick = () => {
        if (!isGrantha) {
            isShift = !isShift;
            renderKeyboard();
        }
    };

    const spaceBtn = document.createElement('button');
    spaceBtn.className = 'key space';
    spaceBtn.textContent = 'Space';
    spaceBtn.onclick = () => handleKeyPress(' ');
    
    const enterBtn = document.createElement('button');
    enterBtn.className = 'key action';
    enterBtn.textContent = '↵ Enter';
    enterBtn.onclick = () => handleKeyPress('\n');

    const backspaceBtn = document.createElement('button');
    backspaceBtn.className = 'key action';
    backspaceBtn.textContent = '⌫';
    backspaceBtn.onclick = handleBackspace;
    
    actionRow.appendChild(shiftBtn);
    actionRow.appendChild(spaceBtn);
    actionRow.appendChild(enterBtn);
    actionRow.appendChild(backspaceBtn);
    
    mainKeysContainer.appendChild(actionRow);

    // Append the arrow cluster and main keys to the keyboard container
    keyboardContainer.appendChild(arrowCluster);
    keyboardContainer.appendChild(mainKeysContainer);
}

function updateSuggestions() {
    suggestionBar.innerHTML = '';
    const words = output.value.split(/\s+/);
    const currentWord = words[words.length - 1];

    if (currentWord.length > 0) {
        const matches = mockDictionary.filter(w => w.startsWith(currentWord));
        matches.forEach(match => {
            const chip = document.createElement('div');
            chip.className = 'suggestion-chip';
            chip.textContent = match;
            chip.onclick = () => {
                // Replace current word with suggestion
                const newText = output.value.substring(0, output.value.length - currentWord.length) + match + ' ';
                output.value = newText;
                saveText();
                updateSuggestions();
            };
            suggestionBar.appendChild(chip);
        });
    }
}

function moveCursor(direction) {
    const start = output.selectionStart;
    const end = output.selectionEnd;
    
    if (start === end) {
        const newPos = Math.max(0, Math.min(output.value.length, start + direction));
        output.setSelectionRange(newPos, newPos);
    } else {
        if (direction < 0) {
            output.setSelectionRange(start, start);
        } else {
            output.setSelectionRange(end, end);
        }
    }
    output.focus();
}

function moveCursorVertical(direction) {
    const text = output.value;
    const cursorPos = output.selectionStart;
    
    // Find current line and column
    const lines = text.split('\n');
    let currentLine = 0;
    let charsCounted = 0;
    
    for (let i = 0; i < lines.length; i++) {
        if (charsCounted + lines[i].length + 1 > cursorPos || i === lines.length - 1) {
            currentLine = i;
            break;
        }
        charsCounted += lines[i].length + 1; // +1 for newline
    }
    
    const currentColumn = cursorPos - charsCounted;
    const targetLine = currentLine + direction;
    
    if (targetLine >= 0 && targetLine < lines.length) {
        let newPos = 0;
        for (let i = 0; i < targetLine; i++) {
            newPos += lines[i].length + 1;
        }
        // Try to maintain column, or go to end of target line
        newPos += Math.min(currentColumn, lines[targetLine].length);
        output.setSelectionRange(newPos, newPos);
    } else if (targetLine < 0) {
        output.setSelectionRange(0, 0);
    } else {
        output.setSelectionRange(text.length, text.length);
    }
    output.focus();
}

function updateLineNumbers() {
    const lines = output.value.split('\n').length;
    const lineNumbersDiv = document.getElementById('line-numbers');
    let numbersHtml = '';
    for (let i = 1; i <= lines; i++) {
        numbersHtml += i + '<br>';
    }
    lineNumbersDiv.innerHTML = numbersHtml;
}

function syncScroll() {
    const lineNumbersDiv = document.getElementById('line-numbers');
    lineNumbersDiv.scrollTop = output.scrollTop;
}

function handleKeyPress(char) {
    const currentText = output.value;
    const cursorPos = output.selectionStart;
    const textBefore = currentText.substring(0, cursorPos);
    const textAfter = currentText.substring(output.selectionEnd);
    
    // Check for Uyirmei combination
    if (textBefore.length > 0) {
        // Find the last consonant (ends with ்)
        const lastCharMatch = textBefore.match(/([க-ஹ]்)$/);
        
        if (lastCharMatch && "அஆஇஈஉஊஎஏஐஒஓஔ".includes(char)) {
            const lastConsonant = lastCharMatch[1];
            const comboKey = `${lastConsonant}+${char}`;
            
            if (combinations[comboKey]) {
                // Replace the last consonant with the combined character
                const newTextBefore = textBefore.slice(0, -2) + combinations[comboKey];
                output.value = newTextBefore + textAfter;
                output.setSelectionRange(newTextBefore.length, newTextBefore.length);
                saveText();
                updateSuggestions();
                updateLineNumbers();
                output.focus();
                return;
            }
        }
    }
    
    const newTextBefore = textBefore + char;
    output.value = newTextBefore + textAfter;
    output.setSelectionRange(newTextBefore.length, newTextBefore.length);
    saveText();
    updateSuggestions();
    updateLineNumbers();
    output.focus();
}

function handleBackspace() {
    const currentText = output.value;
    const start = output.selectionStart;
    const end = output.selectionEnd;

    if (start !== end) {
        // Delete selection
        output.value = currentText.substring(0, start) + currentText.substring(end);
        output.setSelectionRange(start, start);
    } else if (start > 0) {
        const textBefore = currentText.substring(0, start);
        const textAfter = currentText.substring(start);
        
        // Use Intl.Segmenter to properly handle Tamil unicode grapheme clusters
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
            const segmenter = new Intl.Segmenter('ta', { granularity: 'grapheme' });
            const segments = Array.from(segmenter.segment(textBefore));
            segments.pop(); // Remove the last grapheme cluster
            const newTextBefore = segments.map(s => s.segment).join('');
            output.value = newTextBefore + textAfter;
            output.setSelectionRange(newTextBefore.length, newTextBefore.length);
        } else {
            // Fallback for older browsers
            const newTextBefore = textBefore.slice(0, -1);
            output.value = newTextBefore + textAfter;
            output.setSelectionRange(newTextBefore.length, newTextBefore.length);
        }
    }
    saveText();
    updateSuggestions();
    updateLineNumbers();
    output.focus();
}

function clearText() {
    if (confirm("Are you sure you want to clear the text?")) {
        output.value = '';
        saveText();
        updateSuggestions();
        updateLineNumbers();
        output.focus();
    }
}

function copyText() {
    output.select();
    document.execCommand('copy');
    output.setSelectionRange(output.value.length, output.value.length);
    output.focus();
    
    // Optional: Show a brief "Copied!" message
    const copyBtn = document.querySelector('button[title="Copy to Clipboard"]');
    if (copyBtn) {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }
}

// Local Storage Caching
function saveText() {
    localStorage.setItem('yazhi_draft', output.value);
}

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('yazhi_draft');
    if (saved) {
        output.value = saved;
        updateSuggestions();
        updateLineNumbers();
    }
});

// Initial render
renderKeyboard();
