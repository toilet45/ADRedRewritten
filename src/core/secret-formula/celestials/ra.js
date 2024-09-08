/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
export const ra = {
  pets: {
    teresa: {
      id: "teresa",
      name: "Teresa",
      color: "#8596ea",
      chunkGain: "Eternity Points",
      memoryGain: "current RM",
      requiredUnlock: () => undefined,
      rawMemoryChunksPerSecond: () => Decimal.pow(Currency.eternityPoints.value.add(1).log10().div(1e4), 3).mul(4),
      memoryProductionMultiplier: () => Ra.unlocks.teresaXP.effectOrDefault(new Decimal(1))
    },
    effarig: {
      id: "effarig",
      name: "Effarig",
      color: "#ea8585",
      chunkGain: "Relic Shards gained",
      memoryGain: "best Glyph level",
      requiredUnlock: () => Ra.unlocks.effarigUnlock,
      rawMemoryChunksPerSecond: () => Decimal.pow(Effarig.shardsGained, 0.1).mul(4),
      memoryProductionMultiplier: () => Ra.unlocks.effarigXP.effectOrDefault(new Decimal(1))
    },
    enslaved: {
      id: "enslaved",
      name: "The Nameless Ones",
      color: "#f1aa7f",
      chunkGain: "Time Shards",
      memoryGain: "total time played",
      requiredUnlock: () => Ra.unlocks.enslavedUnlock,
      rawMemoryChunksPerSecond: () => Decimal.pow(Currency.timeShards.value.add(1).log10().div(3e5), 2).mul(4),
      memoryProductionMultiplier: () => Ra.unlocks.enslavedXP.effectOrDefault(new Decimal(1))
    },
    v: {
      id: "v",
      name: "V",
      color: "#ead584",
      chunkGain: "Infinity Power",
      memoryGain: "total Memory levels",
      requiredUnlock: () => Ra.unlocks.vUnlock,
      rawMemoryChunksPerSecond: () => Decimal.pow(Currency.infinityPower.value.add(1).log10().div(1e7), 1.5).mul(4),
      memoryProductionMultiplier: () => Ra.unlocks.vXP.effectOrDefault(new Decimal(1))
    },
    ra: {
      id: "ra",
      name: "Ra",
      color: "#9575cd",
      chunkGain: "Replicanti",
      memoryGain: "other Memory multipliers",
      // eslint-disable-next-line no-unused-expressions, no-labels, no-unused-labels
      requiredUnlock: () => { isUnlocked: MendingUpgrade(19).isBought; }, // I dont wanna write edgecase so this does
      rawMemoryChunksPerSecond: () => Currency.replicanti.value.add(1).log10().add(1).log10().mul(2)
        .floor().mul(3).pow(4),
      memoryProductionMultiplier: () => Decimal.root(
        Ra.unlocks.vXP.effectOrDefault(new Decimal(1))
          .mul(Ra.unlocks.enslavedXP.effectOrDefault(new Decimal(1)))
          .mul(Ra.unlocks.teresaXP.effectOrDefault(new Decimal(1)))
          .mul(Ra.unlocks.effarigXP.effectOrDefault(new Decimal(1)))
          .mul(Ra.unlocks.laiXP.effectOrDefault(new Decimal(1)))
          .mul(Ra.unlocks.pelleXP.effectOrDefault(new Decimal(1))),
        6).sqrt() // This code sucks, if you couldnt tell
    },
    laitela: {
      id: "laitela",
      name: "Lai'tela",
      color: "#ffffff",
      chunkGain: "Galaxies",
      memoryGain: "singularities",
      requiredUnlock: () => Ra.unlocks.laiMemoryUnlock,
      rawMemoryChunksPerSecond: () => player.galaxies.div(100).pow(1.5),
      memoryProductionMultiplier: () => Ra.unlocks.laiXP.effectOrDefault(new Decimal(1))
    },
    pelle: {
      id: "pelle",
      name: "Pelle",
      color: "#dc143c",
      chunkGain: "Antimatter",
      memoryGain: "best AM",
      requiredUnlock: () => Ra.unlocks.pelleMemoryUnlock,
      rawMemoryChunksPerSecond: () => Currency.antimatter.value.add(1).log10().add(1).log10().mul(4).floor(),
      memoryProductionMultiplier: () => Ra.unlocks.pelleXP.effectOrDefault(new Decimal(1))
    }
  },
  unlocks: {
    autoTP: {
      id: 0,
      reward: "Tachyon Particles are given immediately when Time Dilation is active",
      pet: "teresa",
      level: 1,
      displayIcon: `<span class="fas fa-atom"></span>`,
      disabledByPelle: true
    },
    chargedInfinityUpgrades: {
      id: 1,
      reward: () => `Unlock Charged Infinity Upgrades. You get one more maximum
        Charged Infinity Upgrade every ${formatInt(2)} levels`,
      effect: () => Math.min(12, Math.floor(Ra.pets.teresa.level / 2)),
      pet: "teresa",
      level: 2,
      displayIcon: `<span class="fas fa-infinity"></span>`,
      disabledByPelle: true
    },
    teresaXP: {
      id: 2,
      reward: "All Memory Chunks produce more Memories based on Reality Machines",
      effect: () => Decimal.pow(Currency.realityMachines.value.add(1).log10().div(100), 0.5),
      pet: "teresa",
      level: 5,
      displayIcon: `Ϟ`
    },
    alteredGlyphs: {
      id: 3,
      reward: "Unlock Altered Glyphs, which grant new effects to Glyphs based on Glyph Sacrifice",
      pet: "teresa",
      level: 10,
      displayIcon: `<span class="fas fa-bolt"></span>`,
      disabledByPelle: true
    },
    effarigUnlock: {
      id: 4,
      reward: "Unlock Effarig's Memories",
      pet: "teresa",
      level: 8,
      displayIcon: `Ϙ`
    },
    perkShopIncrease: {
      id: 5,
      reward: "Purchase caps are raised in Teresa's Perk Point Shop",
      pet: "teresa",
      level: 15,
      displayIcon: `<span class="fas fa-project-diagram"></span>`
    },
    unlockDilationStartingTP: {
      id: 6,
      reward: `In non-Celestial Realities, gain Tachyon Particles as if you reached the square root of your total
        antimatter in Dilation. Any multipliers to TP gain are applied retroactively, even outside Dilation`,
      effect: () => player.records.totalAntimatter.pow(0.5),
      pet: "teresa",
      level: 25,
      displayIcon: `<i class="far fa-dot-circle"></i>`
    },
    extraGlyphChoicesAndRelicShardRarityAlwaysMax: {
      id: 7,
      reward: () => `Get ${formatX(2)} Glyph choices and the bonus to Glyph rarity from Relic Shards
        is always its maximum value`,
      effect: 2,
      pet: "effarig",
      level: 1,
      displayIcon: `<i class="fas fa-grip-horizontal"></i>`
    },
    unlockGlyphAlchemy: {
      id: 8,
      reward: `Unlock Glyph Alchemy, which adds alchemical resources you can increase by Refining Glyphs. You unlock
        more resources through Effarig levels. Access through a new Reality tab.`,
      pet: "effarig",
      level: 2,
      displayIcon: `<span class="fas fa-vial"></span>`
    },
    effarigXP: {
      id: 9,
      reward: "All Memory Chunks produce more Memories based on highest Glyph level",
      effect: () => player.records.bestReality.glyphLevel.div(7000).add(1),
      pet: "effarig",
      level: 5,
      displayIcon: `<span class="fas fa-clone"></span>`
    },
    glyphEffectCount: {
      id: 10,
      reward: () => `Glyphs always have ${formatInt(4)} effects, and Effarig Glyphs can now have up to ${formatInt(7)}`,
      pet: "effarig",
      level: 10,
      displayIcon: `<span class="fas fa-braille"></span>`
    },
    enslavedUnlock: {
      id: 11,
      reward: "Unlock Nameless's Memories",
      pet: "effarig",
      level: 8,
      displayIcon: `<span class="c-ra-pet-milestones-effarig-link">\uf0c1</span>`
    },
    relicShardGlyphLevelBoost: {
      id: 12,
      reward: "Glyph level is increased based on Relic Shards gained",
      effect: () => Decimal.pow(Decimal.log10(Decimal.max(Effarig.shardsGained, 1)), 2).mul(100),
      pet: "effarig",
      level: 15,
      displayIcon: `<span class="fas fa-fire"></span>`
    },
    maxGlyphRarityAndShardSacrificeBoost: {
      id: 13,
      reward: () => `Glyphs are always generated with ${formatPercents(1)} rarity and
        Glyph Sacrifice gain is raised to a power based on Relic Shards`,
      effect: () => Effarig.maxRarityBoost.div(100).add(1),
      pet: "effarig",
      level: 25,
      displayIcon: `<i class="fas fa-ankh"></i>`
    },
    blackHolePowerAutobuyers: {
      id: 14,
      reward: "Unlock Black Hole power upgrade autobuyers",
      pet: "enslaved",
      level: 1,
      displayIcon: `<span class="fas fa-circle"></span>`,
      disabledByPelle: true
    },
    improvedStoredTime: {
      id: 15,
      reward: "Stored game time is amplified and you can store more real time, increasing with Nameless levels",
      effects: {
        gameTimeAmplification: () => Decimal.pow(20, Math.clampMax(Ra.pets.enslaved.level, Ra.levelCap)),
        realTimeCap: () => Ra.pets.enslaved.level * 1e3 * 3.6e3,
      },
      pet: "enslaved",
      level: 2,
      displayIcon: `<span class="fas fa-history"></span>`,
      disabledByPelle: true
    },
    enslavedXP: {
      id: 16,
      reward: "All Memory Chunks produce more Memories based on total time played",
      effect: () => Decimal.log10(player.records.totalTimePlayed).div(200).add(1),
      pet: "enslaved",
      level: 5,
      displayIcon: `<span class="fas fa-stopwatch"></span>`
    },
    autoPulseTime: {
      id: 17,
      reward: () => `Black Hole charging now only uses ${formatPercents(0.99)} of your game speed and you can
        automatically discharge ${formatPercents(0.01)} of your stored game time every ${formatInt(5)} ticks.`,
      pet: "enslaved",
      level: 10,
      displayIcon: `<span class="fas fa-expand-arrows-alt"></span>`,
      disabledByPelle: true
    },
    vUnlock: {
      id: 18,
      reward: "Unlock V's Memories",
      pet: "enslaved",
      level: 8,
      displayIcon: `⌬`
    },
    peakGamespeedDT: {
      id: 19,
      reward: "Gain more Dilated Time based on peak game speed in each Reality",
      effect: () => Decimal.max(Decimal.pow(Decimal.log10(player.celestials.ra.peakGamespeed).sub(90), 3), 1),
      pet: "enslaved",
      level: 15,
      displayIcon: `<span class="fas fa-tachometer-alt"></span>`,
      disabledByPelle: true
    },
    allGamespeedGlyphs: {
      id: 20,
      reward: `All basic Glyphs gain the increased game speed effect from Time Glyphs,
        and Time Glyphs gain an additional effect`,
      pet: "enslaved",
      level: 25,
      displayIcon: `<span class="fas fa-clock"></span>`,
      onUnlock: () => {
        const allGlyphs = player.reality.glyphs.active.concat(player.reality.glyphs.inventory);
        for (const glyph of allGlyphs) {
          Glyphs.applyGamespeed(glyph);
        }
      }
    },
    instantECAndRealityUpgradeAutobuyers: {
      id: 21,
      reward: "Rebuyable Reality upgrades are bought automatically and Auto-Eternity Challenges happen instantly",
      pet: "v",
      level: 1,
      displayIcon: `<span class="fas fa-sync-alt"></span>`,
      disabledByPelle: true
    },
    autoUnlockDilation: {
      id: 22,
      reward: () => `In non-Celestial Realities, Time Dilation is unlocked automatically for free at
        ${formatInt(TimeStudy.dilation.totalTimeTheoremRequirement)} Time Theorems`,
      pet: "v",
      level: 2,
      displayIcon: `<span class="fas fa-fast-forward"></span>`
    },
    vXP: {
      id: 23,
      reward: "All Memory Chunks produce more Memories based on total Celestial levels.",
      effect: () => new Decimal(1 + Ra.totalPetLevel / 50),
      pet: "v",
      level: 5,
      displayIcon: `<span class="fas fa-book"></span>`
    },
    unlockHardV: {
      id: 24,
      reward: () => `Unlock Hard V-Achievements and unlock a Triad Study every ${formatInt(6)} levels.
        Triad Studies are located at the bottom of the Time Studies page`,
      effect: () => Math.min(12, Math.floor(Ra.pets.v.level / 6)) +
      (2 * (Ra.pets.v.level >= 65)) + (Ra.pets.v.level >= 75), // Account for V65 and V75
      pet: "v",
      level: 6,
      displayIcon: `<span class="fas fa-trophy"></span>`,
      disabledByPelle: true
    },
    continuousTTBoost: {
      id: 25,
      reward: "Time Theorems boost all forms of continuous non-dimension production",
      effects: {
        ttGen: () => Decimal.pow(10, Ra.theoremBoostFactor().mul(5)),
        eternity: () => Decimal.pow(10, Ra.theoremBoostFactor().mul(2)),
        infinity: () => Decimal.pow(10, Ra.theoremBoostFactor().mul(15)),
        replicanti: () => Decimal.pow(10, Ra.theoremBoostFactor().mul(20)),
        dilatedTime: () => Decimal.pow(10, Ra.theoremBoostFactor().mul(3)),
        memories: () => Ra.theoremBoostFactor().div(50).add(1),
        memoryChunks: () => Ra.theoremBoostFactor().div(50).add(1),
        autoPrestige: () => Ra.theoremBoostFactor().mul(2.4).add(1)
      },
      pet: "v",
      level: 10,
      displayIcon: `<span class="fas fa-university"></span>`,
      disabledByPelle: true
    },
    achievementTTMult: {
      id: 26,
      reward: "Achievement multiplier applies to Time Theorem generation",
      effect: () => Achievements.power.powEffectOf(MendingUpgrade(13).effects.ttGenPow),
      pet: "v",
      level: 15,
      displayIcon: `<span class="fas fa-graduation-cap"></span>`,
      disabledByPelle: true
    },
    achievementPower: {
      id: 27,
      reward: () => `Achievement multiplier is raised ${formatPow(1.5, 1, 1)}`,
      effect: 1.5,
      pet: "v",
      level: 25,
      displayIcon: `<i class="fab fa-buffer"></i>`,
      disabledByPelle: true
    },

    // MU19 (In order, so teresa then effarig, etc, etc)

    musicAtHighest: {
      id: 28,
      reward: () => `Music glyphs now generated at ${formatPercents(1)} of your highest Glyph level`,
      effect: 1,
      pet: "teresa",
      level: 30,
      displayIcon: `?`,
      disabledByPelle: false
    },
    breakCharges: {
      id: 29,
      reward: () => `Every ${formatInt(5)} levels from ${formatInt(40)},
      gain a new charged upgrade and Break Upgrades can be charged`, // BiU 1-9, and col4 iU
      effect: () => Math.min(13, Math.max(0, floor((Ra.pets.teresa.level - 35) / 5))),
      pet: "teresa",
      level: 40,
      displayIcon: `?`,
      disabledByPelle: false
    },
    hardTeresa: {
      id: 30,
      reward: () => `Unlock a harder version of Teresa's Reality, which boosts Glyph Sacrifice caps`,
      effect: 1,
      pet: "teresa",
      level: 50,
      displayIcon: `?`,
      disabledByPelle: false
    },
    perkShopUpgrades: {
      id: 31,
      reward: () => `Unlock ${formatInt(2)} new perk shop upgrades. 
      Infinity and Break Infinity upgrades stay charged through Mend`,
      effect: 1,
      pet: "teresa",
      level: 65,
      displayIcon: `?`,
      disabledByPelle: false
    },
    passiveTeresa: {
      id: 32,
      reward: () => `Your AM in Teresa's Reality is automatically increased based on best AM. Improve Teresa 25.`,
      effect: 1,
      pet: "teresa",
      level: 75,
      displayIcon: `?`,
      disabledByPelle: false
    },
    glyphSacrificeUncap: {
      id: 33,
      reward: () => `Glyph sacrfice can go above the cap, at a rate of ${formatPow(0.01, 2, 2)}`,
      effect: 1,
      pet: "teresa",
      level: 90,
      displayIcon: `?`,
      disabledByPelle: false
    },
    musicUniqueType: {
      id: 34,
      reward: () => `Music glyphs now can generate with a unique glyph type.`,
      effect: 1,
      pet: "teresa",
      level: 100,
      displayIcon: `?`,
      disabledByPelle: false
    },

    alchHardcapIncrease: {
      id: 35,
      reward: () => `Alchemy hardcap is increased to ${formatInt(50000)},
      but harder to gain beyond ${formatInt(25000)}`,
      effect: 50000,
      pet: "effarig",
      level: 30,
      displayIcon: `?`,
      disabledByPelle: false
    },
    alchemyTwo: {
      id: 36,
      reward: () => `Unlock a second set of alchemy resources. A resource is unlocked every ${formatInt(10)} levels`,
      effect: () => Math.min(7, Math.floor((Ra.pets.effarig.level - 30) / 10)),
      pet: "effarig",
      level: 40,
      displayIcon: `?`,
      disabledByPelle: false
    },
    glyphRarityUncap: {
      id: 37,
      reward: () => `Glyph rarity can go above ${formatPercents(1)} at a ${formatPow(0.2, 1, 1)} rate`,
      effect: 0.2,
      pet: "effarig",
      level: 50,
      displayIcon: `?`,
      disabledByPelle: false
    },
    amalgamGlyphUnlock: {
      id: 38,
      reward: () => `Unlock amalgam glyphs, which can have any ${formatInt(8)} effects from basic glyphs`,
      effect: 1,
      pet: "effarig",
      level: 65,
      displayIcon: `?`,
      disabledByPelle: false
    },
    softcapDelay: {
      id: 39,
      reward: () => `Glyph Rarity softcap occurs ${formatPercents(0.1)} later.
      New resources are now unlocked every ${formatInt(5)} levels`,
      effect: () => Math.min(3, Math.floor((Ra.pets.effarig.level - 65) / 10)),
      pet: "effarig",
      level: 75,
      displayIcon: `?`,
      disabledByPelle: false
    },
    effarigMendLayer: {
      id: 40,
      reward: () => `Unlock the Mending layer of Effarig`,
      effect: 1,
      pet: "effarig",
      level: 90,
      displayIcon: `?`,
      disabledByPelle: false
    },
    allGlyphNewUnique: {
      id: 41,
      reward: () => `All glyph types, including Amalgam, gain a new unique effect`,
      effect: 1,
      pet: "effarig",
      level: 100,
      displayIcon: `?`,
      disabledByPelle: false
    },

    gamespeedUncap: {
      id: 42,
      reward: () => `Game speed is uncapped`,
      effect: 1,
      pet: "enslaved",
      level: 30,
      displayIcon: `?`,
      disabledByPelle: false
    },
    thirdBlackHole: {
      id: 43,
      reward: () => `Unlock the third black hole, which is much stronger but costs iM to upgrade`,
      effect: 1,
      pet: "enslaved",
      level: 40,
      displayIcon: `?`,
      disabledByPelle: false
    },
    timeExpansionUnlock: {
      id: 44,
      reward: () => `Unlock Time Expansion.`,
      effect: 1,
      pet: "enslaved",
      level: 50,
      displayIcon: `?`,
      disabledByPelle: false
    },
    tachyonicBoosts: {
      id: 45,
      reward: () => `Dilated Time now also generates Tachyonic Boosts.`,
      effect: 1,
      pet: "enslaved",
      level: 65,
      displayIcon: `?`,
      disabledByPelle: false
    },
    cheaperTess: {
      id: 46,
      reward: () => `Tesseracts are slightly cheaper, and free tickspeed scaling is slower`,
      effect: () => [0.1, 0.05],
      pet: "enslaved",
      level: 75,
      displayIcon: `?`,
      disabledByPelle: false
    },
    weakerGamespeedSoftcap: {
      id: 47,
      reward: () => `Dilated time is boosted by gamespeed at a much higher rate. Gamespeed softcap is weaker`,
      effect: () => [5, 0.9],
      pet: "enslaved",
      level: 90,
      displayIcon: `?`,
      disabledByPelle: false
    },
    timePowAllglyphs: {
      id: 48,
      reward: () => `Achievements provide a power effect to Gamespeed, Effarig Glyphs game speed power is now available
      on all glyphs, and Effarig Glyphs gain a new effect`,
      effect: 1,
      pet: "enslaved",
      level: 100,
      displayIcon: `?`,
      disabledByPelle: false
    },

    achToMemories: {
      id: 49,
      reward: () => `Achievements now provide a multiplier to Memories.`,
      effect: 1,
      pet: "v",
      level: 30,
      displayIcon: `?`,
      disabledByPelle: false
    },
    newVhard: {
      id: 50,
      reward: () => `Unlock new v-hard achievements and improve the dimension study paths`,
      effect: 1,
      pet: "v",
      level: 40,
      displayIcon: `?`,
      disabledByPelle: false
    },
    triadCheaper: {
      id: 51,
      reward: () => `Triad studies cost ${formatInt(1)} Space Theorem less`,
      effect: 1,
      pet: "v",
      level: 50,
      displayIcon: `?`,
      disabledByPelle: false
    },
    triadCheaperAgain: {
      id: 52,
      reward: () => `Unlock ${formatInt(2)} new triad studies,
      and triad studies cost ${formatInt(2)} Space Theorem less`,
      effect: 1,
      pet: "v",
      level: 65,
      displayIcon: `?`,
      disabledByPelle: false
    },
    vHardenedUnlock: {
      id: 53,
      reward: () => `Unlock v-hardened achievements. Gain an extra Triad Study. You do not gain more Triad Studies,
      but unlock the Celestial Study tree`,
      effect: 1,
      pet: "v",
      level: 75,
      displayIcon: `?`,
      disabledByPelle: false
    },
    celTreeUnlocks: {
      id: 54,
      reward: () => `Unlock ${formatInt(4)} more rows of the Celestial Study tree. Unlock a new v-hardened achievement
      , and you can now buy Celestial Studies with Time Theorems`,
      effect: 1,
      pet: "v",
      level: 90,
      displayIcon: `?`,
      disabledByPelle: false
    },
    achArePower: {
      id: 55,
      reward: () => `Achievements provide power effects, all glyphs have an achievement multiplier, and improve
      the achievement power effect on Effarig Glyphs`,
      effect: 1,
      pet: "v",
      level: 100,
      displayIcon: `?`,
      disabledByPelle: false
    },

    keepMemoriesOnMend: {
      id: 56,
      reward: () => `Keep Ra Levels on Mend, but not Memories or Memory Chunks`,
      effect: 1,
      pet: "ra",
      level: 1,
      displayIcon: `?`,
      disabledByPelle: false
    },
    levelInc: {
      id: 57,
      reward: () => `Unlock celestial levels up to ${formatInt(30)}`,
      effect: 1,
      pet: "ra",
      level: 2,
      displayIcon: `?`,
      disabledByPelle: false
    },
    scaleReduce: {
      id: 58,
      reward: () => `Level scaling is slightly reduced`,
      effect: 1,
      pet: "ra",
      level: 5,
      displayIcon: `?`,
      disabledByPelle: false
    },
    levelIncAgain: {
      id: 59,
      reward: () => `Unlock celestial levels up to ${formatInt(40)}`,
      effect: 1,
      pet: "ra",
      level: 8,
      displayIcon: `?`,
      disabledByPelle: false
    },
    raShopUnlock: {
      id: 60,
      reward: () => `Unlock the first ${formatInt(2)} rows of Ra's Shop`,
      effect: 1,
      pet: "ra",
      level: 10,
      displayIcon: `?`,
      disabledByPelle: false
    },
    anotherLevelInc: {
      id: 61,
      reward: () => `Unlock celestial levels up to ${formatInt(55)}`,
      effect: 1,
      pet: "ra",
      level: 15,
      displayIcon: `?`,
      disabledByPelle: false
    },
    laiMemoryUnlock: {
      id: 62,
      reward: () => `Unlock Lai'tela's Memories`,
      effect: 1,
      pet: "ra",
      level: 25,
      displayIcon: `?`,
      disabledByPelle: false
    },
    memGainOutsideRa: {
      id: 63,
      reward: () => `Improve Memory gain while not in Ra's Reality`,
      effect: 1,
      pet: "ra",
      level: 30,
      displayIcon: `?`,
      disabledByPelle: false
    },
    anotherLevelIncAgain: {
      id: 64,
      reward: () => `Unlock celestial levels up to ${formatInt(75)}`,
      effect: 1,
      pet: "ra",
      level: 40,
      displayIcon: `?`,
      disabledByPelle: false
    },
    raShopNewRow: {
      id: 65,
      reward: () => `Unlock the next row of Ra's Shop`,
      effect: 1,
      pet: "ra",
      level: 50,
      displayIcon: `?`,
      disabledByPelle: false
    },
    secondToLastLevelInc: {
      id: 66,
      reward: () => `Unlock celestial levels up to ${formatInt(90)}`,
      effect: 1,
      pet: "ra",
      level: 65,
      displayIcon: `?`,
      disabledByPelle: false
    },
    pelleMemoryUnlock: {
      id: 67,
      reward: () => `Unlock Pelle's Memories`,
      effect: 1,
      pet: "ra",
      level: 75,
      displayIcon: `?`,
      disabledByPelle: false
    },
    raShopFinalRow: {
      id: 68,
      reward: () => `Unlock the next row of Ra's Shop`,
      effect: 1,
      pet: "ra",
      level: 90,
      displayIcon: `?`,
      disabledByPelle: false
    },
    finalCelMemoryInc: {
      id: 69,
      reward: () => `Unlock celestial levels up to ${formatInt(100)}`,
      effect: 1,
      pet: "ra",
      level: 100,
      displayIcon: `?`,
      disabledByPelle: false
    },

    bulkSingIncrease: {
      id: 70,
      reward: () => `Bulk singularities can be increased up to 200`,
      effect: 1,
      pet: "laitela",
      level: 1,
      displayIcon: `?`,
      disabledByPelle: false
    },
    autoSingCapIncUnlock: {
      id: 71,
      reward: () => `Unlock an autobuyer to automatically change the singularity cap, and permenantly
      keep all Dark Matter Dimension autobuyers`,
      effect: 1,
      pet: "laitela",
      level: 2,
      displayIcon: `?`,
      disabledByPelle: false
    },
    laiXP: {
      id: 72,
      reward: () => `Memory gain is improved based on Singularities`,
      effect: 1,
      pet: "laitela",
      level: 5,
      displayIcon: `?`,
      disabledByPelle: false
    },
    lockedImaginaryUpgUnlock: {
      id: 73,
      reward: () => `Game speed is uncapped`,
      effect: 1,
      pet: "laitela",
      level: 8,
      displayIcon: `?`,
      disabledByPelle: false
    },
    infinityDimensionContinuum: {
      id: 74,
      reward: () => `Continuum weakly affects infinity dimensions (including caps)`,
      effect: 1,
      pet: "laitela",
      level: 10,
      displayIcon: `?`,
      disabledByPelle: false
    },
    annihilationGain: {
      id: 75,
      reward: () => `Gain ${formatPercents(0.5)} of your annihilation multiplier per second.
      Manual annihilations are ${formatX(1500)} stronger`,
      effect: 1,
      pet: "laitela",
      level: 15,
      displayIcon: `?`,
      disabledByPelle: false
    },
    newDMD: {
      id: 76,
      reward: () => `Ublock a new dark matter dimension every ${formatInt(25)} levels. Increase the bulk singularity
      cap by ${formatInt(50)} every ${formatInt(5)} levels, gaining a ${formatX(2)} multiplier
      every ${formatInt(20)} levels`,
      effect: () => [
        Math.floor(Ra.pets.laitela.level / 25), // Sorry for the next equation i cant think of another way
        Math.max(Math.floor(Ra.pets.laitela.level / 5), 4) * 50 +
        Math.min(0, Math.max(Math.floor((Ra.pets.laitela.level - 20) / 5), 4)) * 100 +
        Math.min(0, Math.max(Math.floor((Ra.pets.laitela.level - 40) / 5), 4)) * 200 +
        Math.min(0, Math.max(Math.floor((Ra.pets.laitela.level - 60) / 5), 4)) * 400 +
        Math.min(0, Math.max(Math.floor((Ra.pets.laitela.level - 80) / 5), 4)) * 800
      ],
      pet: "laitela",
      level: 25,
      displayIcon: `?`,
      disabledByPelle: false
    },
    universalDamageUnlock: {
      id: 77,
      reward: () => `Unlock Universal Damage`,
      effect: 1,
      pet: "laitela",
      level: 30,
      displayIcon: `?`,
      disabledByPelle: false
    },
    unit08improvement: {
      id: 78,
      reward: () => `Improve unit 08`,
      effect: 1,
      pet: "laitela",
      level: 40,
      displayIcon: `?`,
      disabledByPelle: false
    },
    timeDimensionContinuum: {
      id: 79,
      reward: () => `Continuum weakly affects time dimensions`,
      effect: 1,
      pet: "laitela",
      level: 50,
      displayIcon: `?`,
      disabledByPelle: false
    },
    easierUD: {
      id: 80,
      reward: () => `Re-enable some unlocks in Universal Damage`,
      effect: 1,
      pet: "laitela",
      level: 65,
      displayIcon: `?`,
      disabledByPelle: false
    },
    MvDUnlock: {
      id: 81,
      reward: () => `Unlock Multiversal Dimensions`,
      effect: 1,
      pet: "laitela",
      level: 75,
      displayIcon: `?`,
      disabledByPelle: false
    },
    newInfGlyphEffect: {
      id: 82,
      reward: () => `nlock a new effect for infinity glyphs, which boosts continuum`,
      effect: 1,
      pet: "laitela",
      level: 90,
      displayIcon: `?`,
      disabledByPelle: false
    },
    autoAbsorbExcessCredits: {
      id: 83,
      reward: () => `Experimental black hole absorbs excess credits, if they would cause annihilation otherwise.
      Unlock a new effect on Power Glyphs (dimboost cost)`,
      effect: 1,
      pet: "laitela",
      level: 100,
      displayIcon: `?`,
      disabledByPelle: false
    },

    undoDoom: {
      id: 84,
      reward: () => `You can exit doom, however you will gain no reward and return to before doom`,
      effect: 1,
      pet: "pelle",
      level: 1,
      displayIcon: `?`,
      disabledByPelle: false
    },
    doomMVRmult: {
      id: 85,
      reward: () => `Dooming provides a Multiversal Remain multiplier, and gain is based on best resources
      this Mend, not current`,
      effect: 1,
      pet: "pelle",
      level: 2,
      displayIcon: `?`,
      disabledByPelle: false
    },
    pelleXP: {
      id: 86,
      reward: () => `Increase Memory Production based on your best Antimatter`,
      effect: 1,
      pet: "pelle",
      level: 5,
      displayIcon: `?`,
      disabledByPelle: false
    },
    newIC: {
      id: 87,
      reward: () => `Unlock 4 new Infinity Challenges`,
      effect: 1,
      pet: "pelle",
      level: 8,
      displayIcon: `?`,
      disabledByPelle: false
    },
    horrificGlyphUnlock: {
      id: 88,
      reward: () => `Unlock horrific glyphs, which are harsher than Cursed glyphs but count as ${formatInt(-5)} glyphs`,
      effect: 1,
      pet: "pelle",
      level: 10,
      displayIcon: `?`,
      disabledByPelle: false
    },
    thirdGLscaleReduce: {
      id: 89,
      reward: () => `The third scaling of Glyph Levels is slightly weaker`,
      effect: 5.2,
      pet: "pelle",
      level: 15,
      displayIcon: `?`,
      disabledByPelle: false
    },
    hyperdoomUnlock: {
      id: 90,
      reward: () => `Unlock Hyperdoom`,
      effect: 1,
      pet: "pelle",
      level: 25,
      displayIcon: `?`,
      disabledByPelle: false
    },
    dimStudyPath: {
      id: 91,
      reward: () => `Unlock a fourth time study path in the dimension split that boosts Multiversal Dimensions`,
      effect: 1,
      pet: "pelle",
      level: 30,
      displayIcon: `?`,
      disabledByPelle: false
    },
    galaxyCostReduce: {
      id: 92,
      reward: () => `Galaxy costs are slightly reduced. The upgrade that doubles Tachyon Galaxies is no longer
      limited to ${formatInt(500)} galaxies`,
      effect: 1,
      pet: "pelle",
      level: 40,
      displayIcon: `?`,
      disabledByPelle: false
    },
    inCelImproveGain: {
      id: 93,
      reward: () => `Memory gain is improved for a celestial if you are currently in their reality`,
      effect: 1,
      pet: "pelle",
      level: 50,
      displayIcon: `?`,
      disabledByPelle: false
    },
    tessCheapen: {
      id: 94,
      reward: () => `Tesseracts are slightly cheaper. Improve the strength of Hypercubes`,
      effect: 1,
      pet: "pelle",
      level: 65,
      displayIcon: `?`,
      disabledByPelle: false
    },
    newHyperdoomShit: {
      id: 95,
      reward: () => `Unlock a new upgrade and penalty for Hyperdoom`,
      effect: 1,
      pet: "pelle",
      level: 75,
      displayIcon: `?`,
      disabledByPelle: false
    },
    newDamagedEffects: {
      id: 96,
      reward: () => `Unlock a new effect for damaged Glyphs. Tesseract prisms guarentee
      ${formatInt(2)} effects. Dimensions are slightly stronger`,
      effect: 1,
      pet: "pelle",
      level: 90,
      displayIcon: `?`,
      disabledByPelle: false
    },
    kohlerUnlock: {
      id: 97,
      reward: () => `Unlock Kohler's Realm`,
      effect: 1,
      pet: "pelle",
      level: 100,
      displayIcon: `?`,
      disabledByPelle: false
    },
  }
};
