import memory from "../memory.js";
import isInterface from "../util/isInterface.js";

const container = document.getElementById(`keys`);

if (!container) {
  throw new Error(`#keys element not found`);
}

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

function getKeyFreq(key: number) {
  return (Math.pow(2, (key - 49) / 12)) * 440;
}

function getKeyIndex(x: number, y: number): number | undefined {
  let elem: Node | null = document.elementFromPoint(x, y);

  let dataNode;
  while (elem?.parentNode != null && dataNode == null) {
    // TODO: this is the third time i'm seeing node parent traversal. im really thinking we should abstract this into its own util.
    if (!isInterface<HTMLElement>(elem, `dataset`)) {
      return;
    }
    if (elem.classList.contains(`black`) || elem.classList.contains(`white`)) {
      dataNode = elem;
    }

    elem = elem.parentNode as Node;
  }

  if (dataNode == null) return;

  let key = 0;
  let nIndexTest = dataNode;
  while (nIndexTest != null) {
    if (nIndexTest.nodeType !== 3) {
      key++;
    }

    if (!nIndexTest.previousElementSibling) {
      break;
    }

    nIndexTest = nIndexTest.previousElementSibling as HTMLElement;
  }

  return key;
}

function keyPressHandler(e: MouseEvent) {
  const key = getKeyIndex(e.clientX, e.clientY);

  if (!key) return;

  playing = true;

  const ci = memory.instruments[memory.currentInstrument];
  const oscillator = memory.audioCTX.createOscillator();
  ci.node = oscillator;

  if (!memory.masterVolume) {
    throw new Error('Missing memory.masterVolume'); // TODO: there's probably a better way of checking this
  }

  oscillator.connect(memory.masterVolume);
  memory.masterVolume.gain.value = 0.5;

  const freq = getKeyFreq(key);
  oscillator.frequency.value = freq;

  oscillator.type = ci.type;

  oscillator.start(0);
}

function keyReleaseHandler() {
  const ci = memory.instruments[memory.currentInstrument];
  if (!ci?.node) {
    throw new Error(`Missing current instrument / ci.node`);
  }

  if (!isInterface<OscillatorNode>(ci.node, `stop`)) { // FIXME: does this look right to you
    throw new Error(`Current instrument node is not an OscillatorNode`);
  }

  ci.node.stop(0);
  playing = false;
}

function moveCurHandler(x: number, y: number) {
  if (!playing) return;

  const ci = memory.instruments[memory.currentInstrument];
  if (!ci?.node) {
    throw new Error(`Missing current instrument / ci.node`);
  }

  const key = getKeyIndex(x, y);
  if (key == null) return;

  if (!isInterface<OscillatorNode>(ci.node, `frequency`)) {
    throw new Error(`ci.node is not an OscillatorNode`);
  }

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

  if (!memory.masterVolume) {
    throw new Error(`Missing memory.masterVolume`);
  }

  memory.masterVolume.gain.value = 0.5;
});

container.addEventListener(`mouseleave`, (e) => {
  if (!playing) return;

  curX = e.clientX;
  curY = e.clientY;

  if (!memory.masterVolume) {
    throw new Error(`Missing memory.masterVolume`);
  }

  memory.masterVolume.gain.value = 0;
});

// scale black keys with correct margins
new ResizeObserver(() => {
  const wkey: HTMLElement | null = container.querySelector(`#keys .white`);

  if (!wkey) {
    throw new Error('Missing piano, effectively');
  }

  /**
   * search through stylesheets to find the rule for the black keys
   * 
   * we modify the stylesheets directly because, despite requiring much more code,
   * it's still significantly more performant than modifying the style attributes
   * for each individual element.
   */
  for (let i = 0; i < document.styleSheets.length; i++) {
    const sheet = document.styleSheets[i];
    (function searchRuleList(sheet): void {
      for (let i2 = 0; i2 < sheet.cssRules.length; i2++) {
        const ruleList = sheet.cssRules[i2]
        if (ruleList instanceof CSSImportRule) {
          return searchRuleList(ruleList.styleSheet);
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