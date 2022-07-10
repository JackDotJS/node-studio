export function loadSliders() {
  document.querySelectorAll(`.slider`).forEach((slider) => {
    // there's probably a better way to do all this
    // also may need additional listeners for touch inputs

    const vertical = slider.classList.contains(`vertical`);
    const thumb = slider.querySelector(`div`);
    const sliderData = thumb.dataset;
    let active = false;

    // im going to fucking explode
    const updatePos = (x, y, val) => {
      const elemBox = slider.getBoundingClientRect();

      const thumbsize = (vertical) ? thumb.offsetHeight : thumb.offsetWidth;
      const sliderSize = (vertical) ? slider.offsetHeight : slider.offsetWidth;
      
      // bunch of stuff to ensure negative values are correctly interpreted
      const fullRange = Math.abs(sliderData.max - sliderData.min);
      const negRange = Math.abs(sliderData.min);
      const flipSignage = parseInt(sliderData.max) < parseInt(sliderData.min);

      let targetPos;
      let rawValue;

      if (val) {
        rawValue = Math.max(negRange, Math.min(fullRange, val));
      } else {
        // get target position
        if (vertical) {
          targetPos = Math.max((thumbsize / 2), Math.min(sliderSize - (thumbsize / 2), elemBox.bottom - y));
        } else {
          targetPos = Math.max((thumbsize / 2), Math.min(sliderSize - (thumbsize / 2), x - elemBox.left));
        }
  
        // get slider value from that position
        rawValue = Math.round(fullRange * ((targetPos - (thumbsize / 2)) / (sliderSize - (thumbsize))));
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

      // stop here if the value is the same
      // prevents infinite loop: DO NOT REMOVE!!!
      // there's probably a better way to do this
      if (sliderData.value == Math.round(newValue)) return;

      thumb.setAttribute(`data-value`, Math.round(newValue));
    };

    //set initial thumb position
    updatePos(null, null, sliderData.default);

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

    new MutationObserver((changes) => {
      updatePos(null, null, changes[0].target.dataset.value);
    }).observe(thumb, {
      attributes: true,
      attributeFilter: [`data-value`]
    });
  });
}