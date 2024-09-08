import { TimeStudy } from "./normal-time-study";

export class TimeStudyConnection {
  constructor(from, to, override) {
    this._from = from;
    this._to = to;
    this._override = override;
  }

  get from() {
    return this._from;
  }

  get to() {
    return this._to;
  }

  get isOverridden() {
    return this._override !== undefined && this._override();
  }

  get isSatisfied() {
    return this.isOverridden || this._from.isBought;
  }
}

/**
 * @type {TimeStudyConnection[]}
 */
TimeStudy.allConnections = (function() {
  const TS = id => TimeStudy(id);
  const EC = id => TimeStudy.eternityChallenge(id);
  const connections = [
    [TS(11), TS(21)],
    [TS(11), TS(22)],

    [TS(21), TS(31)],
    [TS(22), TS(305), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 5)],
    [TS(22), TS(33)],
    [TS(22), TS(32)],

    [TS(31), TS(41)],
    [TS(32), TS(42)],

    [TS(41), TS(51)],
    [TS(42), TS(51)],
    [TS(42), EC(5)],

    [TS(42), TS(62), () => !Perk.bypassEC5Lock.isBought],

    [TS(51), TS(61)],
    [EC(5), TS(62), () => Perk.bypassEC5Lock.isBought],

    [TS(61), TS(71)],
    [TS(61), TS(72)],
    [TS(61), TS(73)],
    [TS(61), TS(74), () => !(Ra.pets.laitela.level >= 75)],

    [TS(71), TS(81)],
    [TS(72), TS(82)],
    [TS(73), TS(83)],
    [TS(74), TS(84), () => !(Ra.pets.laitela.level >= 75)],

    [TS(81), TS(91)],
    [TS(82), TS(92)],
    [TS(83), TS(93)],
    [TS(84), TS(94), () => !(Ra.pets.laitela.level >= 75)],

    [TS(91), TS(101)],
    [TS(92), TS(102)],
    [TS(93), TS(103)],
    [TS(94), TS(104), () => !(Ra.pets.laitela.level >= 75)],

    [TS(101), TS(111), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 12)],
    [TS(101), TS(321), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 12)],
    [TS(321), TS(111), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 12)],
    [TS(102), TS(111), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 13)],
    [TS(102), TS(322), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 13)],
    [TS(322), TS(111), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 13)],
    [TS(103), TS(111), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 14)],
    [TS(103), TS(323), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 14)],
    [TS(323), TS(111), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 14)],
    [TS(104), TS(111), () => (!(Ra.pets.laitela.level >= 75) || !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 15))],
    [TS(104), TS(324), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 15 && Ra.pets.laitela.level >= 75)],
    [TS(324), TS(111), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 15)],

    [TS(111), EC(7)],
    [TS(111), TS(306), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 6)],

    [TS(111), TS(121)],
    [TS(111), TS(122)],
    [TS(111), TS(123)],

    [TS(121), TS(131)],
    [TS(122), TS(132)],
    [TS(123), TS(133)],
    [TS(121), EC(6)],
    [TS(123), EC(8)],

    [TS(131), TS(141)],
    [TS(132), TS(142)],
    [TS(133), TS(143)],

    [TS(141), TS(151), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 9)],
    [TS(141), TS(311), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 9)],
    [TS(311), TS(151), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 9)],
    [TS(142), TS(151), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 10)],
    [TS(142), TS(312), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 10)],
    [TS(312), TS(151), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 10)],
    [TS(143), TS(151), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 11)],
    [TS(143), TS(313), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 11)],
    [TS(313), TS(151), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 11)],
    [TS(143), EC(4)],

    [TS(151), EC(9)],

    [TS(151), TS(161)],
    [TS(151), TS(162)],

    [TS(161), TS(171)],
    [TS(162), TS(171)],

    [TS(171), EC(1)],
    [TS(171), EC(2)],
    [TS(171), EC(3)],

    [TS(171), TS(181),
      () => !Perk.bypassEC1Lock.isBought || !Perk.bypassEC2Lock.isBought || !Perk.bypassEC3Lock.isBought],

    [EC(1), TS(181), () => Perk.bypassEC1Lock.isBought],
    [EC(2), TS(181), () => Perk.bypassEC2Lock.isBought],
    [EC(3), TS(181), () => Perk.bypassEC3Lock.isBought],

    [TS(181), EC(10)],

    [EC(10), TS(191)],
    [EC(10), TS(192)],
    [EC(10), TS(193)],

    [TS(192), TS(201)],

    [TS(191), TS(211)],
    [TS(191), TS(212)],
    [TS(193), TS(307), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 7)],
    [TS(193), TS(213), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 7)],
    [TS(193), TS(214), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 7)],
    [TS(307), TS(213), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 7)],
    [TS(307), TS(214), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 7)],

    [TS(211), TS(221)],
    [TS(211), TS(222)],
    [TS(212), TS(223)],
    [TS(212), TS(224)],
    [TS(213), TS(225)],
    [TS(213), TS(226)],
    [TS(214), TS(227)],
    [TS(214), TS(228)],

    [TS(221), TS(231), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 1)],
    [TS(222), TS(231), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 1)],
    [TS(223), TS(232), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 2)],
    [TS(224), TS(232), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 2)],
    [TS(225), TS(233), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 3)],
    [TS(226), TS(233), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 3)],
    [TS(227), TS(234), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 4)],
    [TS(228), TS(234), () => (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 4)],

    [TS(221), TS(301), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 1)],
    [TS(222), TS(301), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 1)],
    [TS(223), TS(302), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 2)],
    [TS(224), TS(302), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 2)],
    [TS(225), TS(303), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 3)],
    [TS(226), TS(303), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 3)],
    [TS(227), TS(304), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 4)],
    [TS(228), TS(304), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 4)],

    [TS(301), TS(231), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 1)],
    [TS(302), TS(232), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 2)],
    [TS(303), TS(233), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 3)],
    [TS(304), TS(234), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 4)],

    [TS(231), EC(11)],
    [TS(232), EC(11)],
    [TS(233), EC(12)],
    [TS(234), EC(12)],

    [EC(11), TimeStudy.dilation],
    [EC(12), TimeStudy.dilation],

    [TimeStudy.dilation, TimeStudy.timeDimension(5)],
    [TimeStudy.dilation, TS(308), () => !(Ra.unlocks.unlockHardV.effectOrDefault(0) >= 8)],
    [TimeStudy.timeDimension(5), TimeStudy.timeDimension(6)],
    [TimeStudy.timeDimension(5), TimeStudy.TGformula, () => !MendingUpgrade(9).isBought],
    [TimeStudy.timeDimension(6), TimeStudy.timeDimension(7)],
    [TimeStudy.timeDimension(7), TimeStudy.timeDimension(8)],
    [TimeStudy.timeDimension(7), TimeStudy.TPformula, () => !MendingUpgrade(9).isBought],
    [TimeStudy.timeDimension(8), TimeStudy.reality],
  ].map(props => new TimeStudyConnection(props[0], props[1], props[2]));

  return connections;
}());
