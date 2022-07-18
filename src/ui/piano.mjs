import { memory } from "../memory.mjs";

// thanks MDN https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API#examples
let midi = null;
function onMIDISuccess(midiAccess) {
  console.log(`MIDI ready!`);
  midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
}

function onMIDIFailure(msg) {
  console.log(`Failed to get MIDI access - ` + msg);
}

navigator.requestMIDIAccess()
  .then(onMIDISuccess, onMIDIFailure)
  .then(() => {
    listInputsAndOutputs(midi);
    startLoggingMIDIInput(midi);
  });

function listInputsAndOutputs(midiAccess) {
  for (const entry of midiAccess.inputs) {
    const input = entry[1];
    console.log(`Input port [type:'` + input.type + `'] id:'` + input.id +
      `' manufacturer:'` + input.manufacturer + `' name:'` + input.name +
      `' version:'` + input.version + `'`);
  }

  for (const entry of midiAccess.outputs) {
    const output = entry[1];
    console.log(`Output port [type:'` + output.type + `'] id:'` + output.id +
      `' manufacturer:'` + output.manufacturer + `' name:'` + output.name +
      `' version:'` + output.version + `'`);
  }
}

function onMIDIMessage(event) {
  let str = `MIDI message received at timestamp ` + event.timeStamp + `[` + event.data.length + ` bytes]: `;
  for (let i = 0; i < event.data.length; i++) {
    str += `0x` + event.data[i].toString(16) + ` `;
  }
  console.log(str);
}

function startLoggingMIDIInput(midiAccess, indexOfPort) {
  midiAccess.inputs.forEach(function (entry) { entry.onmidimessage = onMIDIMessage; });
}

const container = document.getElementById(`keys`);
let playing = false;
let curX = 0;
let curY = 0;

// generate piano keys
const keyCount = 112;
const pattern = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
const offset = -3; // matches standard 88-key piano
let octaveCount = 1;

for (let i = 0; i < keyCount; i++) {
  const key = document.createElement(`div`);

  const wrapped = (i % pattern.length);
  const typeIndex = (pattern.length + wrapped + (offset % pattern.length)) % pattern.length;
  const isBlackKey = pattern[typeIndex];

  if (isBlackKey) {
    key.classList.add(`black`);
  } else {
    key.classList.add(`white`);

    if (typeIndex === 0) {
      key.innerHTML = `C${octaveCount}`;
      octaveCount++;
    }
  }

  container.appendChild(key);
}

function getKeyFreq(key) {
  return (Math.pow(2, (key - 49) / 12)) * 440;
}

function getKeyIndex(x, y) {
  let elem = document.elementFromPoint(x, y);

  let dataNode;
  while (elem.parentNode != null && dataNode == null) {
    if (elem.classList.contains(`black`) || elem.classList.contains(`white`)) {
      dataNode = elem;
    }

    elem = elem.parentNode;
  }

  if (dataNode == null) return;

  let key = 0;
  let nIndexTest = dataNode;
  while (nIndexTest != null) {
    if (nIndexTest.nodeType !== 3) {
      key++;
    }

    nIndexTest = nIndexTest.previousElementSibling;
  }

  return key;
}

function keyPressHandler(e) {
  const key = getKeyIndex(e.clientX, e.clientY);

  if (!key) return;

  playing = true;

  const ci = memory.instruments[memory.currentInstrument];
  const oscillator = memory.audioCTX.createOscillator();
  ci.node = oscillator;

  oscillator.connect(memory.masterVolume);
  memory.masterVolume.gain.value = 0.5;

  const freq = getKeyFreq(key);
  oscillator.frequency.value = freq;

  oscillator.type = ci.type;

  oscillator.start(0);
}

function keyReleaseHandler() {
  const ci = memory.instruments[memory.currentInstrument];
  ci.node.stop(0);
  playing = false;
}

function moveCurHandler(x, y) {
  if (!playing) return;

  const ci = memory.instruments[memory.currentInstrument];

  const key = getKeyIndex(x, y);
  if (key == null) return;

  ci.node.frequency.value = getKeyFreq(key);
}

container.addEventListener(`mousedown`, (e) => {
  e.preventDefault();
  if (e.button !== 0) return;

  curX = e.clientX;
  curY = e.clientY;

  keyPressHandler(e);
});

container.addEventListener(`mousemove`, (e) => {
  curX = e.clientX;
  curY = e.clientY;
  moveCurHandler(curX, curY);
});

container.addEventListener(`scroll`, () => {
  moveCurHandler(curX, curY);
});

window.addEventListener(`mouseup`, (e) => {
  if (!playing) return;
  if (e.button === 0) keyReleaseHandler();
});

container.addEventListener(`mouseenter`, (e) => {
  if (!playing) return;

  curX = e.clientX;
  curY = e.clientY;

  memory.masterVolume.gain.value = 0.5;
});

container.addEventListener(`mouseleave`, (e) => {
  if (!playing) return;

  curX = e.clientX;
  curY = e.clientY;

  memory.masterVolume.gain.value = 0;
});

// scale black keys with correct margins
new ResizeObserver(() => {
  const wkey = container.querySelector(`#keys .white`);

  /**
   * search through stylesheets to find the rule for the black keys
   * 
   * we modify the stylesheets directly because, despite requiring much more code,
   * it's still significantly more performant than modifying the style attributes
   * for each individual element.
   */
  for (const sheet of document.styleSheets) {
    (function searchRuleList(sheet) {
      for (const ruleList of sheet.cssRules) {
        if (ruleList instanceof CSSImportRule) {
          searchRuleList(ruleList.styleSheet);
        } else if (ruleList instanceof CSSStyleRule && ruleList.selectorText === `#keys .black`) {
          const width = Math.round(wkey.offsetWidth * 0.7);

          ruleList.style.minWidth = `${width}px`;
          ruleList.style.marginLeft = `-${width / 2}px`;
          ruleList.style.marginRight = `-${width / 2}px`;
        }
      }
    })(sheet);
  }
}).observe(container);

// allow horizontal scrolling with mousewheel
container.addEventListener(`wheel`, (e) => {
  e.preventDefault();

  //container.scrollBy({ left: e.deltaY, behavior: `smooth` });

  // container.animate([
  //   { scrollLeft: container.scrollLeft - e.deltaY }
  // ], {
  //   duration: 500
  // });

  container.scrollLeft += e.deltaY;
});