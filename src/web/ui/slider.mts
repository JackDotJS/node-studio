import isInterface from "common/util/isInterface";

document.querySelectorAll(`.slider`).forEach((slider) => {
  // there's probably a better way to do all this
  // also may need additional listeners for touch inputs

  if (!isInterface<HTMLInputElement>(slider, 'max')) {
    throw new Error(`slider element ${slider} does not appear to be a HTMLInputElement`);
  }

  const vertical = slider.classList.contains(`vertical`);
  const thumb = slider.querySelector(`div`);
  if (!thumb) {
    throw new Error(`slider thumb not found`);
  }
  
  const sliderData = thumb.dataset;

  let active = false;

  // im going to fucking explode
  const updatePos = (x: number | null, y: number | null, val?: number) => {
    const elemBox = slider.getBoundingClientRect();

    const thumbSize = (vertical) ? thumb.offsetHeight : thumb.offsetWidth;
    const sliderSize = (vertical) ? slider.offsetHeight : slider.offsetWidth;

    // I tried to put this outside the updatePos function but TS was complaining
    if (sliderData.max === undefined || sliderData.min === undefined) {
      throw new Error(`slider element ${slider} does not have min and max values`);
    }

    // bunch of stuff to ensure negative values are correctly interpreted
    const fullRange = Math.abs(+sliderData.max - +sliderData.min);
    const negRange = Math.abs(+sliderData.min);
    const flipSignage = parseInt(sliderData.max) < parseInt(sliderData.min);

    let targetPos;
    let rawValue;

    if (val) {
      rawValue = Math.max(negRange, Math.min(fullRange, val));
    } else {

      if (x === null || y === null) {
        throw new Error(`x and y values are null`);
      }

      // get target position
      if (vertical) {
        targetPos = Math.max((thumbSize / 2), Math.min(sliderSize - (thumbSize / 2), elemBox.bottom - y));
      } else {
        targetPos = Math.max((thumbSize / 2), Math.min(sliderSize - (thumbSize / 2), x - elemBox.left));
      }

      // get slider value from that position
      rawValue = Math.round(fullRange * ((targetPos - (thumbSize / 2)) / (sliderSize - (thumbSize))));
    }

    // snap thumb to nearest position based on max value of the input range
    const thumbPos = Math.max(0, Math.min(100, ((rawValue / fullRange) * 100)));

    let newValue = rawValue - negRange;

    if (vertical) {
      thumb.style.bottom = thumbPos + `%`;
    } else {
      thumb.style.left = thumbPos + `%`;
    }

    if (flipSignage) newValue = -newValue;

    if (sliderData.value === undefined) {
      throw new Error(`slider element ${slider} does not have a value`);
    }

    // stop here if the value is the same
    // prevents infinite loop: DO NOT REMOVE!!!
    // there's probably a better way to do this
    if (+sliderData.value == Math.round(newValue)) return;

    thumb.setAttribute(`data-value`, String(Math.round(newValue)));
  };

  if (!sliderData.default) {
    throw new Error(`slider element ${slider} does not have a default value`);
  }

  // set initial thumb position
  updatePos(null, null, +sliderData.default);

  slider.addEventListener(`mousedown`, (e) => {
    if (e.button !== 0) return;
    active = true;
    updatePos(e.clientX, e.clientY);
  });

  window.addEventListener(`mousemove`, (e) => {
    if (e.button !== 0 || !active) return;
    updatePos(e.clientX, e.clientY);
  });

  window.addEventListener(`mouseup`, (e) => {
    if (e.button !== 0 || !active) return;
    active = false;

    if (!sliderData.default) {
      throw new Error(`slider element ${slider} does not have a default value`);
    }
    if (sliderData.springy === `true`) {
      updatePos(null, null, +sliderData.default);
    }
  });

  new MutationObserver((changes) => {
    const target: HTMLElement = changes[0].target as HTMLElement;
    if (!target.dataset.value) {
      throw new Error(`You should never see this error`);
    }

    updatePos(null, null, +target.dataset.value);
  }).observe(thumb, {
    attributes: true,
    attributeFilter: [`data-value`]
  });
});