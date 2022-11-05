import isInterface from "../util/isInterface.js";

function closeCM() {
  const cm: HTMLElement | null = document.querySelector(`#context`);
  if (!cm) {
    throw new Error(`context menu not found`);
  }

  cm.style.left = `0px`;
  cm.style.top = `0px`;
  cm.className = `cmhide`;

  cm.childNodes.forEach(e => e.remove());
}

// TEMPORARY!!!
const menus = {
  slider: [
    {
      label: `Reset to Default`,
      func: (node: HTMLElement) => {
        const elem: HTMLElement | null = node.querySelector(`div[data-value][data-default]`);
        if (!elem) {
          throw new Error(`[contextMenu] slider element not found`);
        }
        elem.dataset.value = elem.dataset.default;
        closeCM();
      }
    }
  ]
};

const cm: HTMLElement | null = document.querySelector(`#context`);
if (!cm) {
  throw new Error(`context menu not found`);
}

// show/hide context menu
document.addEventListener(`contextmenu`, e => {
  e.preventDefault();
  const x = e.clientX;
  const y = e.clientY;

  // debugging data

  // console.log({
  //   winWidth: window.innerWidth,
  //   winHeight: window.innerHeight,
  //   cmWidth: cm.offsetWidth,
  //   cmHeight: cm.offsetHeight,
  //   curX: e.clientX,
  //   curY: e.clientY
  // });

  let elem: Node | null = document.elementFromPoint(x, y);

  if (!elem) {
    throw new Error(`[contextMenu] element not found`);
  }

  let dataNode: HTMLElement | null = null;
  while (elem?.parentNode != null && dataNode === null) {
    if (!isInterface<HTMLElement>(elem, `dataset`)) {
      return;
    }
    if (elem.dataset.cm) {
      dataNode = elem;
    }

    elem = elem.parentNode as Node;
  }

  if (dataNode === null)
    return;

  // TEMPORARY!!!
  if (dataNode.dataset.cm === `slider`) {
    const button = document.createElement(`a`);
    button.innerHTML = menus.slider[0].label;
    // @ts-ignore // FIXME: THIS IS A BAD IDEA. BUT SINCE IT'S TEMPORARY, I'LL ALLOW IT.
    button.onclick = () => { menus.slider[0].func(dataNode); };
    // -------------------------------------------^^^^^^^^ THIS COULD BE NULL.

    console.log(button);

    cm.appendChild(button);
  }

  const posX = (x + cm.offsetWidth > window.innerWidth) ? x - cm.offsetWidth : x;
  const posY = (y + cm.offsetHeight > window.innerHeight) ? y - cm.offsetHeight : y;

  cm.style.left = `${posX}px`;
  cm.style.top = `${posY}px`;

  cm.className = ``;
});

document.addEventListener(`mousedown`, e => {
  let mouseClickPoint = document.elementFromPoint(e.clientX, e.clientY);

  // if (e.path.includes(cm)) return; // TODO: what is path? it doesnt seem to exist on mousedown.
  if (mouseClickPoint === cm) return; // FIXME: this is dangerous
  closeCM();
});

window.addEventListener(`blur`, () => {
  closeCM();
});

window.addEventListener(`resize`, () => {
  closeCM();
});