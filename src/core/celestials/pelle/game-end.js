import { isDecimal } from "../../../utility/type-check";

export const END_STATE_MARKERS = {
  // Tab zalgoification starts as soon as endState > 0
  GAME_END: 1,
  TAB_START_HIDE: 1.5,
  INTERACTIVITY_DISABLED: 2.5,
  FADE_AWAY: 2.5,
  SAVE_DISABLED: 4,
  END_NUMBERS: 4.2,
  CREDITS_START: 4.5,
  SHOW_NEW_GAME: 13.5,
  SPECTATE_GAME: 13.9,
  // The song is 3:04 and the credits increment by 1 every 20 seconds. Needs changing if the song is changed.
  SONG_END: 13.7,
  CREDITS_END: 14.5,
};

export const GameEnd = {
  get endState() {
    if (this.removeAdditionalEnd || player.bypassEnd) return this.additionalEnd;
    // 8.99e15 cause this code is dumb and 9e15 returns 0.99999999... and will never end up reaching END
    return Math.max(player.celestials.pelle.records.totalAntimatter.add(1).log10().add(1).log10().sub(8.7)
      .div(Decimal.log10(8.99e15).sub(8.7)).clampMax(1.5).toNumber() + this.additionalEnd, 0);
  },

  _additionalEnd: 0,
  get additionalEnd() {
    return (player.isGameEnd || this.removeAdditionalEnd) ? this._additionalEnd : 0;
  },
  set additionalEnd(x) {
    this._additionalEnd = (player.isGameEnd || this.removeAdditionalEnd) ? x : 0;
  },

  removeAdditionalEnd: false,

  creditsClosed: false,
  creditsEverClosed: false,

  gameLoop(diffr) {
    const diff = isDecimal(diffr) ? diffr.toNumber() : diffr;
    if (this.removeAdditionalEnd) {
      this.additionalEnd -= Math.min(diff / 200, 0.5);
      if (this.additionalEnd < 4) {
        this.additionalEnd = 0;
        this.removeAdditionalEnd = false;
      }
    }
    if (!this.removeAdditionalEnd && this.endState >= END_STATE_MARKERS.GAME_END &&
        ui.$viewModel.modal.progressBar === undefined) {
      player.isGameEnd = true;
      this.additionalEnd += this.additionalEnd >= 3 ? 25 * Math.min(diff / 1000 / 20, 0.1) : Math.min(diff / 1000 / 20, 0.1);
    }
  }
};
