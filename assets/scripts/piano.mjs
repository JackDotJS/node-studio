// generate piano keys
function generateKeys(memory, container) {
  const keyCount = 112;
  const pattern = [ 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0 ];
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

    const keyPressHandler = key => {
      const ci = memory.instruments[memory.currentInstrument];
      const oscillator = memory.audioCTX.createOscillator();
      ci.node = oscillator;
  
      oscillator.connect(memory.masterVolume);
      memory.masterVolume.gain.value = 0.5;
  
      const freq = (Math.pow(2, (key - 49) / 12)) * 440;
      oscillator.frequency.value = freq;
  
      oscillator.type = ci.type;
  
      oscillator.start(0);
    };

    const keyReleaseHandler = () => {
      const ci = memory.instruments[memory.currentInstrument];
      ci.node.stop(0);
    };

    key.addEventListener(`mousedown`, (e) => {
      if (e.button === 0) keyPressHandler(i+1);
    });

    key.addEventListener(`mouseup`, (e) => {
      if (e.button === 0) keyReleaseHandler();
    });

    key.addEventListener(`mouseenter`, (e) => {
      if (e.buttons === 1) keyPressHandler(i+1);
    });

    key.addEventListener(`mouseleave`, (e) => {
      if (e.buttons === 1) keyReleaseHandler();
    });

    key.addEventListener(`drag`, () => {
      return false;
    });

    // key.addEventListener(`ondragstart`, () => {
    //   console.log(`DRAGGING `);
    //   //return false;
    // });

    // key.addEventListener(`onselectstart`, () => {
    //   console.log(`DRAGGING 2`);
    //   //return false;
    // });

    // key.addEventListener(`dragleave`, () => {
    //   console.log(`DRAGGING 3`);
    //   //return false;
    // });

    container.appendChild(key);
  }
}

// scale black keys with correct margins
function scaleUpdate(container) {
  const observer = new ResizeObserver(() => {
    const wkey = container.querySelector(`.white`);

    // search through stylesheets to find the rule for the black keys
    // im wondering if it'd be easier and/or faster to just add/modify the style attribute for each element directly
    for (const sheet of document.styleSheets) {
      (function searchRuleList(sheet) {
        for (const ruleList of sheet.cssRules) {
          if (ruleList instanceof CSSImportRule) {
            searchRuleList(ruleList.styleSheet);
          } else if (ruleList instanceof CSSStyleRule && ruleList.selectorText === `#keys .black`) {
            const width = Math.round(wkey.offsetWidth * 0.8);
  
            ruleList.style.minWidth = `${width}px`;
            ruleList.style.marginLeft = `-${width / 2}px`;
            ruleList.style.marginRight = `-${width / 2}px`;
          }
        }
      })(sheet);
    }
  });

  observer.observe(container);
}


export function loadPiano(memory) {
  const container = document.getElementById(`keys`);

  generateKeys(memory, container);
  scaleUpdate(container);

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
}