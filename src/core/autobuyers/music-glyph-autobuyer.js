import { AutobuyerState } from "./autobuyer";

export class MusicGlyphAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.musicGlyphs;
  }

  get name() {
    return `Music Glyphs Purchase/Purge`;
  }

  get isUnlocked() {
    return MendingUpgrade(17).boughtAmount.gt(1);
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    if (MendingUpgrade(17).boughtAmount.lt(3) && Currency.perkPoints.lte(0)) return;
    Currency.perkPoints.subtract(PerkShopUpgrade.musicGlyph.cost);
    AutoGlyphProcessor.getRidOfGlyph(GlyphGenerator.musicGlyph());
  }

  static get isActive() { return player.auto.musicGlyphs.isActive; }
  static set isActive(value) { player.auto.musicGlyphs.isActive = value; }
}
