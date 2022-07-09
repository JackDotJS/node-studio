export function loadSliders() {
  document.querySelectorAll(`.slider`).forEach((slider) => {
    // there's probably a better way to do all this
    // also may need additional listeners for touch inputs

    const vertical = slider.classList.contains(`vertical`);
    const thumb = slider.querySelector(`div`);
    const sliderData = thumb.dataset;
    let active = false;

    // im going to fucking explode
    const updatePos = (x, y) => {
      const elemBox = slider.getBoundingClientRect();

      const thumbsize = (vertical) ? thumb.offsetHeight : thumb.offsetWidth;
      const sliderSize = (vertical) ? slider.offsetHeight : slider.offsetWidth;
      
      // bunch of stuff to ensure negative values are correctly interpreted
      const fullRange = Math.abs(sliderData.max - sliderData.min);
      const negRange = Math.abs(sliderData.min);
      const flipSignage = parseInt(sliderData.max) < parseInt(sliderData.min);

      // get target position
      let targetPos;
      if (vertical) {
        targetPos = Math.max((thumbsize / 2), Math.min(sliderSize - (thumbsize / 2), y - elemBox.top));
      } else {
        targetPos = Math.max((thumbsize / 2), Math.min(sliderSize - (thumbsize / 2), x - elemBox.left));
      }

      // get slider value from that position
      const rawValue = Math.round(fullRange * ((targetPos - (thumbsize / 2)) / (sliderSize - (thumbsize))));

      // snap thumb to nearest position based on max value of the input range
      const thumbPos = Math.max(0, Math.min(100, ((rawValue / fullRange) * 100)));

      let newValue = rawValue - negRange;
      
      // done!
      if (vertical) {
        // "invert" value if it's a vertical slider
        // because otherwise setting the slider to the lowest position
        // would make it it's max value, which would be weird and counter-intuitive
        newValue = ((1 - (rawValue / fullRange)) * fullRange) - negRange;

        thumb.style.top = thumbPos + `%`;
      } else {
        thumb.style.left = thumbPos + `%`;
      }

      if (flipSignage) newValue = -newValue;

      sliderData.value = Math.round(newValue);
    };

    //set initial thumb position
    const initBox = slider.getBoundingClientRect();

    if (vertical) {
      const val = initBox.top + ((slider.offsetHeight / sliderData.max) * sliderData.value);
      updatePos(0, val);
    } else {
      const val = initBox.left + ((slider.offsetWidth / sliderData.max) * sliderData.value);
      updatePos(val, 0);
    }

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
    });
  });
}