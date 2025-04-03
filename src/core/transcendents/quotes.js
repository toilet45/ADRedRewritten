import { BitUpgradeState } from "../game-mechanics";
import wordShift from "../word-shift";

export const TranscendentQuote = {
  addToQueue(quote) {
    ui.view.transcendentQuotes.queue.push(quote);
    if (!ui.view.transcendentQuotes.current) this.advanceQueue();
  },
  advanceQueue() {
    ui.view.transcendentQuotes.current = ui.view.transcendentQuotes.queue.shift();
  },
  showHistory(history) {
    ui.view.transcendentQuotes.history = history;
  },
  clearQueue() {
    ui.view.transcendentQuotes.queue = [];
    ui.view.transcendentQuotes.current = undefined;
  },
  clearHistory() {
    ui.view.transcendentQuotes.history = undefined;
  },
  clearAll() {
    this.clearQueue();
    this.clearHistory();
  },
  get isOpen() {
    return ui.view.transcendentQuotes.current !== undefined;
  },
  get isHistoryOpen() {
    return ui.view.transcendentQuotes.history !== undefined;
  }
};

// Gives an array specifying proportions of transcendents to blend together on the modal, as a function of time, to
// provide a smoother transition between different transcendents to reduce potential photosensitivity issues
function blendTr(trs) {
  const totalTime = trs.map(tr => tr[1]).nSum();
  const tick = (Date.now() / 1000) % totalTime;

  // Blend the first blendTime seconds with the previous transcendent and the last blendTime seconds with the next;
  // note that this results in a total transition time of 2*blendTime. We specifically set this to be half the duration
  // of the first entry - this is because in the case of all intervals having the same duration, this guarantees two
  // blended entries at all points in time.
  const blendTime = trs[0][1] / 2;
  let start = 0;
  for (let index = 0; index < trs.length; index++) {
    const prevTr = trs[(index + trs.length - 1) % trs.length], currTr = trs[index],
      nextTr = trs[(index + 1) % trs.length];

    // Durations of time from after last transition and after next transition. May be negative, which is how we
    // check to see if we're in the correct time interval (last should be positive, next should be negative)
    const lastTime = tick - start, nextTime = lastTime - currTr[1];
    if (nextTime > 0) {
      start += currTr[1];
      continue;
    }

    if (lastTime <= blendTime) {
      const t = 0.5 * lastTime / blendTime;
      return [[prevTr[0], 0.5 - t], [currTr[0], 0.5 + t]];
    }
    if (-nextTime <= blendTime) {
      const t = 0.5 * nextTime / blendTime;
      return [[currTr[0], 0.5 - t], [nextTr[0], 0.5 + t]];
    }

    // In principle the animation properties should never get to this return case, but we leave it here just in case -
    // the worst side-effect of reaching here is that some UI elements may appear to lose click detection for a
    // fraction of a second when transitioning from two blended entries to one
    return [[currTr[0], 1]];
  }
  throw new Error("Could not blend transcendent fractions in Quote modal");
}

class TrQuoteLine {
  constructor(line, parent) {
    this._parent = parent;
    this._showTranscendentName = line.showTranscendentName ?? true;

    this._transcendentArray = line.background
      ? () => blendTr(line.background)
      : [[parent.transcendent, 1]];

    const replacementMatch = /\$(\d+)/gu;

    this._line = typeof line === "string"
      ? line
      // This matches each digit after a $ and replaces it with the wordCycle of an array with the digit it matched.
      : () => line.text.replaceAll(replacementMatch, (_, i) => wordShift.wordCycle(line[i]));
  }

  get line() {
    return typeof this._line === "function" ? this._line() : this._line;
  }

  get transcendents() {
    return typeof this._transcendentArray === "function" ? this._transcendentArray() : this._transcendentArray;
  }

  get transcendentSymbols() {
    return this.transcendents.map(c => Transcendents[c[0]].symbol);
  }

  get showTranscendentName() {
    return this._showTranscendentName;
  }

  get transcendentName() {
    return Transcendents[this._parent.transcendent].displayName;
  }
}

class TrQuotes extends BitUpgradeState {
  constructor(config, transcendent) {
    super(config);
    this._transcendent = transcendent;
    this._lines = config.lines.map(line => new TrQuoteLine(line, this));
  }

  get bits() { return player.transcendents[this._transcendent].quoteBits; }
  set bits(value) { player.transcendents[this._transcendent].quoteBits = value; }

  get requirement() {
    // If requirement is defined, it is always a function returning a boolean.
    return this.config.requirement?.();
  }

  get transcendent() {
    return this._transcendent;
  }

  line(id) {
    return this._lines[id];
  }

  get totalLines() {
    return this._lines.length;
  }

  show() { this.unlock(); }
  onUnlock() { this.present(); }

  present() {
    TranscendentQuote.addToQueue(this);
  }
}


export const TranscendentQuotes = {
  kohler: mapGameDataToObject(
    GameDatabase.transcendents.transcendentQuotes.kohler,
    config => new TrQuotes(config, "kohler")
  ),
};
