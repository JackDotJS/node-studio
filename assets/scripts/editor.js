const memory = {
  audioCTX: new window.AudioContext(),
  currentInstrument: 0,
  instruments: [
    {
      name: `Triangle`,
      type: `triangle`,
      node: null,
      attack: 100,
      decay: 0,
      sustain: 1,
      release: 100
    }
  ],
  masterVolume: null,
  masterAnalyser: null
};

document.addEventListener(`DOMContentLoaded`, () => {
  memory.masterVolume = memory.audioCTX.createGain();
  memory.masterAnalyser = memory.audioCTX.createAnalyser();

  memory.masterVolume.connect(memory.masterAnalyser);
  memory.masterAnalyser.connect(memory.audioCTX.destination);

  memory.masterVolume.gain.value = 0.00;
  memory.masterVolume.gain.minValue = 0.00;
  memory.masterVolume.gain.maxValue = 0.00;

  memory.masterAnalyser.fftSize = 128; // WARN: frequencyBinCount will always be half of this value!!!
  memory.masterAnalyser.smoothingTimeConstant = 0.0;

  let dbtest = false;

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
    dbtest = true;
  };

  const keyReleaseHandler = () => {
    const ci = memory.instruments[memory.currentInstrument];
    ci.node.stop(0);
    dbtest = false;
  };

  const keyContainer = document.getElementById(`keys`);
  const keyCount = 112;
  const keyTypes = [ 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0 ];
  const offset = -3; // matches standard 88-key piano

  let octaveCount = 1;

  for (let i = 0; i < keyCount; i++) {
    const key = document.createElement(`div`);

    const wrapped = (i % keyTypes.length);
    const typeIndex = (keyTypes.length + wrapped + (offset % keyTypes.length)) % keyTypes.length;
    const isBlackKey = keyTypes[typeIndex];

    if (isBlackKey) {
      key.classList.add(`black`);
    } else {
      key.classList.add(`white`);

      if (typeIndex === 0) {
        key.innerHTML = `C${octaveCount}`;
        octaveCount++;
      }
    }

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

    key.addEventListener(`ondragstart`, () => {
      console.log(`DRAGGING `);
      //return false;
    });

    key.addEventListener(`onselectstart`, () => {
      console.log(`DRAGGING 2`);
      //return false;
    });

    key.addEventListener(`drag`, () => {
      console.log(`DRAGGING 3`);
      return false;
    });

    key.addEventListener(`dragleave`, () => {
      console.log(`DRAGGING 4`);
      //return false;
    });

    keyContainer.appendChild(key);
  }

  keyContainer.addEventListener(`wheel`, (e) => {
    e.preventDefault();

    //keyContainer.scrollBy({ left: e.deltaY, behavior: `smooth` });

    // keyContainer.animate([
    //   { scrollLeft: keyContainer.scrollLeft - e.deltaY }
    // ], {
    //   duration: 500
    // });

    keyContainer.scrollLeft += e.deltaY;
  });

  const debugOutput = document.getElementById(`contextData`);

  setInterval(() => {
    debugOutput.innerHTML = [
      `baselatency: ${memory.audioCTX.baseLatency}`,
      `outputLatency: ${memory.audioCTX.outputLatency}`,
      `currentTime: ${memory.audioCTX.currentTime}`,
      `listener: ${memory.audioCTX.listener}`,
      `sampleRate: ${memory.audioCTX.sampleRate}`,
      `state: ${memory.audioCTX.state}`
    ].join(`<br>`);
  }, 250);

  const ablength = memory.masterAnalyser.frequencyBinCount;
  const spectrumData = new Float32Array(ablength);
  //const spectrumData = new Uint8Array(ablength);
  const spectrum = document.getElementById(`spectrum`);
  const spectrumCTX = spectrum.getContext(`2d`);

  // fix stupid canvas size bullshittery
  spectrumCTX.canvas.width = spectrum.offsetWidth;
  spectrumCTX.canvas.height = spectrum.height;

  const drawSpectrum = () => {
    requestAnimationFrame(drawSpectrum);

    spectrumCTX.clearRect(0, 0, spectrum.width, spectrum.height);

    memory.masterAnalyser.getFloatFrequencyData(spectrumData);
    //memory.masterAnalyser.getByteFrequencyData(spectrumData);

    const width = spectrum.width / spectrumData.length;

    let x = 0;

    for (let i = 0; i < (spectrum.width / width); i++) {
      // values for float data (i want to cry)
      const dbValue = spectrumData[Math.round(i * spectrumData.length / (spectrum.offsetWidth / width))];
      const mappedDb = (dbValue - (memory.masterAnalyser.minDecibels)) * (spectrum.height / 2) / (memory.masterAnalyser.maxDecibels - memory.masterAnalyser.minDecibels) + (spectrum.height / 2);

      // values for byte data
      // const dbValue = spectrumData[Math.round(i * spectrumData.length / (spectrum.offsetWidth / width))];
      // const mappedDb = dbValue * (spectrum.height / 2) / 255;

      const height = Math.max(1, mappedDb);

      spectrumCTX.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(`--accent`);

      spectrumCTX.fillRect(
        x, 
        (spectrum.height / 2) - Math.max(1, height / 2),
        width, 
        height,
      );

      x += width;
    }
  };

  const waveformData = new Float32Array(ablength);
  const waveform = document.getElementById(`waveform`);
  const waveformCTX = waveform.getContext(`2d`);

  waveformCTX.canvas.width = waveform.offsetWidth;
  waveformCTX.canvas.height = waveform.height;

  const drawWaveform = () => {
    requestAnimationFrame(drawWaveform);

    waveformCTX.clearRect(0, 0, waveform.width, waveform.height);

    memory.masterAnalyser.getFloatTimeDomainData(waveformData);

    const width = waveform.width / waveformData.length;

    let x = 0;

    for (let i = 0; i < (waveform.width / width); i++) {
      waveformCTX.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(`--accent`);

      waveformCTX.fillRect(
        x, 
        (waveform.height / 2) + waveformData[Math.round(i * waveformData.length / (waveform.offsetWidth / width))] * waveform.height - 1,
        width, 
        1,
      );

      x += width;
    }
  };

  drawSpectrum();
  drawWaveform();
});