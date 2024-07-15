export const mendingMilestones = {
  one: {
    mends: 1,
    reward: "Infinity is always broken and all pre-Eternity autobuyers are unlocked and maxed. Gain a multiplier to various pre-Reality resources (hover for details)",
    activeCondition: () =>{
      return `${formatX(10)} Infinities, ${formatX(100)} Infinity Points, ${fromatX(10)} Replicanti Speed, ${formatX(10)} Eternity Points, ${formatX(5)} Eternties, ${formatX(5)} Tachyon Particle, and ${formatX(20)} Dilated Time.`
    }
  },
  two: {
    mends: 2,
    reward: () => {
      return `Start every prestige with ${format(1e7)} Banked Infinites and ${format(50000)} Eternities`
    }
  },
  three:{
    mends: 3,
    reward: "Start all Mends with all perks purchased"
  },
  four:{
    mends: 5,
    reward: "Start every Mend with Effarig's shop completely bought out and the Automator unlocked (at full speed)"
  },
  five:{
    mends: 7,
    reward: "Start every Mend with Achievement rows 14 and 15, and automatically unlock Teresa and V"
  },
  six:{
    mends: 10,
    reward: () => {
      return `You can now Mend outside a Doomed Reality and decrease the antimatter requirement to Mend (${format(new Decimal("1e9e15"))} ➜ ${format(new Decimal("1e5e14"))})`
    }
  },
  seven:{
    mends: 15,
    reward: "Start every Mend with all Eternity and Reality autobuyers (except Lai'tela resources)"
  },
  eight:{
    mends: 20,
    reward: "Teresa's container is set to your highest Reality Machine amount this Mend. Start every Mend with both Nameless Upgrades"
  },
  nine:{
    mends: 30,
    reward: "Lai'tela autobuyers are permanently unlocked"
  },
  ten:{
    mends: 50,
    reward: "Start Mends with all pre-Mend Achievements"
  },
  eleven:{
    mends: 70,
    reward: "Start Mends with all Reality Upgrades purchased"
  },
  twelve:{
    mends: 80,
    reward: "Start Mends with the Black Hole, and the first four Celestials unlocked"
  },
  thirteen:{
    mends: 100,
    reward: () => {
      return `Generate Mends based on fastest real-time Mend (Currently: 1 every [time])`
    }
  },
  fourteen:{
    mends: 250,
    reward: "100 Mend Milestone is now based on fastest game time Mend (if faster than fastest real time Mend)"
  }
};
