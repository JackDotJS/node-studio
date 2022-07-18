function closeCM() {
  const cm = document.querySelector(`#context`);

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
      func: (node) => {
        const elem = node.querySelector(`div[data-value][data-default]`);
        if (elem == null) return;
        elem.dataset.value = elem.dataset.default;
        closeCM();
      }
    }
  ]
};

const cm = document.querySelector(`#context`);

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

  let elem = document.elementFromPoint(x, y);
  let dataNode;
  while (elem.parentNode != null && dataNode == null) {
    if (elem.dataset.cm) {
      dataNode = elem;
    }

    elem = elem.parentNode;
  }

  if (dataNode == null) return;

  // TEMPORARY!!!
  if (dataNode.dataset.cm === `slider`) {
    const button = document.createElement(`a`);
    button.innerHTML = menus.slider[0].label;
    button.onclick = () => { menus.slider[0].func(dataNode); };

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
  if (e.path.includes(cm)) return;
  closeCM();
});

window.addEventListener(`blur`, () => {
  closeCM();
});

window.addEventListener(`resize`, () => {
  closeCM();
});