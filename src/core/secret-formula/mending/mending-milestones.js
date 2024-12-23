export const mendingMilestones = {
  one: {
    mends: 1,
    reward: `Infinity is always broken and all pre-Eternity autobuyers are unlocked and maxed.
    Gain a multiplier to various pre-Reality resources (hover for details)`,
    activeCondition: () => `${formatX(10)} Infinities, ${formatX(100)} Infinity Points, ${formatX(10)} Replicanti Speed,
    ${formatX(10)} Eternity Points, ${formatX(5)} Eternties, ${formatX(5)} Tachyon Particles,
    and ${formatX(20)} Dilated Time.`
  },
  two: {
    mends: 2,
    reward: () => `Start every prestige with ${format(1e7)} Banked Infinites and ${format(50000)} Eternities`
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
  five: {
    mends: 7,
    reward: "Start every Mend with Achievement rows 14 and 15, and automatically unlock Teresa and V"
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
    // eslint-disable-next-line max-len
    reward: `Teresa's container is set to your highest Reality Machine amount this Mend. Start every Mend with both Nameless Upgrades`
  },
  nine: {
    mends: 30,
    reward: "Start Mends with all Reality Upgrades purchased"
  },
  ten: {
    mends: 50,
    reward: "Start Mends with all pre-Mend Achievements"
  },
  eleven: {
    mends: 70,
    reward: "Lai'tela autobuyers are permanently unlocked"
  },
  twelve: {
    mends: 80,
    reward: "[TBD]"
  },
  thirteen: {
    mends: 100,
    reward: () => `Generate Mends based on fastest real-time Mend (Currently: 1 every [time])`
  },
  fourteen: {
    mends: 250,
    reward: "Mending Milestone 100 is now based on fastest game time Mend (if faster than fastest real time Mend)"
  }
};
