export function mmOneBoost() {
  return {
    infinities: Decimal.pow(5, Currency.mends.value.add(10).log10()).clampMax(1e4),
    ip: Currency.mends.value.pow(5).clampMax(1e10),
    rep: Currency.mends.value.add(1).clampMax(10),
    eternities: Currency.mends.value.add(1).log10().mul(4).add(1).clampMax(50),
    ep: Currency.mends.value.pow(2).clampMax(1e5),
    tp: Currency.mends.value.add(1).clampMax(15),
    dt: Currency.mends.value.add(1).pow(Currency.mends.value.add(1).cbrt()).clampMax(1e20),
    ec11start: Decimal.pow10(Currency.mends.value().add(4).mul(10)).clampMax(1e100),
    ec11scale: Decimal.pow10(Currency.mends.value().sqrt().mul(5)).clampMax(1e25)
  };
}

export const mendingMilestones = {
  one: {
    mends: 1,
    reward: `Infinity is always broken and all pre-Eternity autobuyers are unlocked and maxed.
    Gain a multiplier to various pre-Reality resources based on Mends (hover for details)`,
    activeCondition: () => `${formatX(GameDatabase.mending.mmOneBoost().infinities)} Infinities, ${formatX(GameDatabase.mending.mmOneBoost().ip)} Infinity Points, ${formatX(GameDatabase.mending.mmOneBoost().rep)} Replicanti Speed,
    ${formatX(GameDatabase.mending.mmOneBoost().ep)} Eternity Points, ${formatX(GameDatabase.mending.mmOneBoost().eternities)} Eternties, ${formatX(GameDatabase.mending.mmOneBoost().tp)} Tachyon Particles,
    and ${formatX(GameDatabase.mending.mmOneBoost().dt)} Dilated Time. EC11 goal starts ${GameDatabase.mending.mmOneBoost().ec11start} earlier and scales ${GameDatabase.mending.mmOneBoost().ec11scale} slower`
  },
  two: {
    mends: 2,
    reward: () => `Start every prestige with ${format(1e7)} Banked Infinites and ${format(50000)} Eternities.`
  },
  three: {
    mends: 3,
    reward: `Start all Mends with all perks purchased and the Automator unlocked.
    V's Reality Requirement is now 0 Realities.`
  },
  four: {
    mends: 5,
    reward: "Start every Mend with Effarig's shop completely bought out and the Automator at full speed"
  },
  thirteen: {
    mends: 6,
    reward: () => `Pelle no longer requires all alchemy resources to be at ${formatInt(25000)} to Doom your Reality.`
  },
  five: {
    mends: 7,
    reward: () => `Start every Mend with all achievements in rows ${formatInt(14)} and ${formatInt(15)},
     automatically unlocking Teresa and V`
  },
  six: {
    mends: 10,
    reward: () => `You can now Mend outside a Doomed Reality and decrease the antimatter requirement to Mend
    (${format(new Decimal("1e9e15"))} ➜ ${format(new Decimal("1e5e14"))})`
  },
  seven: {
    mends: 15,
    reward: "Start every Mend with all Eternity and Reality autobuyers (Excluding celestial autobuyers)"
  },
  eight: {
    mends: 20,
    reward: `Teresa's container is set to your highest Reality Machine amount this Mend`
  },
  fourteen: {
    mends: 25,
    // eslint-disable-next-line max-len
    reward: `Start every Mend with both Nameless Upgrades`
  },
  nine: {
    mends: 30,
    reward: "Start Mends with all Reality Upgrades purchased"
  },
  ten: {
    mends: 50,
    reward: () => `Start Mends with all achievements in rows ${formatInt(16)} and ${formatInt(17)}`
  },
  fifteen: {
    mends: 60,
    reward: () => `Start Mends with all achievements in row ${formatInt(18)}. Achievement ${formatInt(183)} is enabled.`
  },
  eleven: {
    mends: 70,
    reward: "Lai'tela autobuyers are permanently unlocked"
  },
  twelve: {
    mends: 100,
    reward: () => `Generate Mends based on fastest real-time Mend (Currently: 1 every [time])`
  },
};
