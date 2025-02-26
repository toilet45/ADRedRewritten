function rebuyableCost(initialCost, increment, id) {
  return Decimal.mul(initialCost, Decimal.pow(increment, player.celestials.teresa.perkShop[id]));
}
function rebuyable(config) {
  const { id, otherReq, cap, costCap, description, formatEffect, formatCost } = config;
  return {
    id,
    cost: () => (config.cost ? config.cost() : rebuyableCost(config.initialCost, config.increment, config.id)),
    otherReq,
    cap,
    costCap,
    description,
    effect: () => config.effect(player.celestials.teresa.perkShop[config.id]),
    formatEffect,
    formatCost,
    rebuyable: true
  };
}

export const perkShop = {
  glyphLevel: rebuyable({
    id: 0,
    initialCost: 1,
    increment: 2,
    description: () => `Increase pre-instability Glyph levels by ${formatPercents(0.05)}`,
    effect: bought => Decimal.pow(1.05, bought),
    formatEffect: value => formatX(value, 2, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 2 ** 20 : 2 ** 11),
    cap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? Decimal.pow(1.05, 20) : Decimal.pow(1.05, 11))
  }),
  rmMult: rebuyable({
    id: 1,
    initialCost: 1,
    increment: 2,
    description: "Double Reality Machine gain",
    effect: bought => Decimal.pow(2, bought),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 2 ** 20 : 2 ** 11),
    cap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 2 ** 20 : 2 ** 11)
  }),
  bulkDilation: rebuyable({
    id: 2,
    initialCost: 100,
    increment: 2,
    description: "Dilation autobuyers buy twice as many Dilation Upgrades at once.",
    effect: bought => Decimal.pow(2, bought),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 1638400 : 1600),
    cap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 2 ** 14 : 16),
  }),
  autoSpeed: rebuyable({
    id: 3,
    initialCost: 1000,
    increment: 2,
    description: () => `Infinity Dimension, Time Dimension, Dilation,
      and Replicanti autobuyers are ${formatX(2)} faster.`,
    effect: bought => Decimal.pow(2, bought).toNumber(),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    costCap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 64000 : 4000),
    cap: () => (Ra.unlocks.perkShopIncrease.canBeApplied ? 64 : 4)
  }),
  musicGlyph: rebuyable({
    id: 4,
    description: () => `Receive a Music Glyph of a random type that is ${formatPercents(Ra.unlocks.musicAtHighest.canBeApplied ? 1 : 0.8)} of your highest level.
      (Try clicking it!)`,
    cost: () => (MendingUpgrade(17).boughtAmount.gt(2) ? 0 : 1),
    formatCost: value => formatInt(value),
    costCap: () => Number.MAX_VALUE,
    cap: () => Number.MAX_VALUE
  }),
  // Only appears with the perk shop increase upgrade
  fillMusicGlyph: rebuyable({
    id: 5,
    description: () => `Fill all empty slots in your inventory with Music Glyphs`,
    cost: () => (MendingUpgrade(17).boughtAmount.gt(2) ? 0 : Math.clampMin(GameCache.glyphInventorySpace.value, 1)),
    otherReq: () => GameCache.glyphInventorySpace.value > 0,
    formatCost: value => formatInt(value),
    costCap: () => Number.MAX_VALUE,
    cap: () => Number.MAX_VALUE
  }),
  glyphInstability: rebuyable({
    id: 6,
    initialCost: 1e12,
    increment: 5,
    description: () => `Glyph Level post instability +${formatPercents(0.005, 1, 1)}`,
    effect: bought => Decimal.mul(0.005, bought).toNumber() + 1,
    formatEffect: value => formatPercents(value - 1, 1, 1),
    formatCost: value => format(value, 2),
    costCap: () => 1.53e23,
    cap: () => 1.08
  }),
  imCap: rebuyable({
    id: 7,
    initialCost: 1e10,
    increment: 100,
    description: () => `Multiply Imaginary Machine cap by ${formatX(2)}`,
    effect: bought => Decimal.pow(2, bought).toNumber(),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    costCap: () => 1e20,
    cap: () => 32
  }),
};
