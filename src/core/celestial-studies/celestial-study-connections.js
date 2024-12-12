import { CelestialStudy } from "./normal-celestial-study";

export class CelestialStudyConnection {
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
    // eslint-disable-next-line no-negated-condition
    return this._override !== undefined && this._override();
  }

  get isSatisfied() {
    return this.isOverridden || this._from.isBought;
  }
}

/**
 * @type {CelestialStudyConnection[]}
 */
CelestialStudy.allConnections = (function() {
  const CS = id => CelestialStudy(id);
  const EC = id => CelestialStudy.eternityChallenge(id);
  const connections = [
    [CS(11), CS(21)],
    [CS(11), CS(22)],

    [CS(21), CS(31)],
    [CS(21), EC(13)],
    [CS(22), CS(32)],

    [CS(31), CS(41)],
    [CS(31), CS(42)],
    [CS(32), CS(43)],
    [CS(32), CS(44)],

    [CS(41), CS(51)],
    [CS(42), CS(52)],
    [CS(43), CS(53)],
    [CS(44), CS(54)],

    [CS(51), CS(61)],
    [CS(52), CS(62)],
    [CS(53), CS(63)],
    [CS(54), CS(64)],

    [CS(61), CS(71)],
    [CS(62), CS(71)],
    [CS(63), CS(72)],
    [CS(64), CS(72)],

    [CS(71), CS(81)],
    [CS(72), CS(81)],
    [CS(71), EC(14)],
    [CS(72), EC(14)],

    [CS(81), CS(91)],
    [CS(81), CS(92)],
    [CS(81), CS(93)],
    [CS(81), EC(15)],
    [CS(81), EC(16)],

    [CS(91), EC(17)],
    [CS(92), CS(102)],
    [CS(93), EC(18)],

    [CS(101), CS(111)],
    [CS(102), CS(112)],
    [CS(103), CS(113)],

    [CS(111), CS(121)],
    [CS(112), CS(121)],
    [CS(113), CS(121)],

    [CS(121), CS(131)],
    [CS(121), CS(132)],

    [CS(131), EC(19)],
    [CS(132), EC(19)],

    [EC(19), CS(151)],
    [EC(19), CS(152)],

    [CS(151), EC(20)],
    [CS(152), EC(20)],

    [EC(20), CS(171)],
    [EC(20), CS(172)],

    [CS(171), CS(181)],
    [CS(171), CS(182)],
    [CS(171), CS(183)],
    [CS(171), CS(184)],
    [CS(172), CS(185)],
    [CS(172), CS(186)],
    [CS(172), CS(187)],
    [CS(172), CS(188)],

    [CS(181), CS(191)],
    [CS(182), CS(191)],
    [CS(183), CS(191)],
    [CS(184), CS(191)],
    [CS(185), CS(191)],
    [CS(186), CS(191)],
    [CS(187), CS(191)],
    [CS(188), CS(191)],

    [CS(191), EC(21)],
    [CS(191), EC(22)],
    [CS(191), EC(23)],
    [CS(191), EC(24)],
    [CS(191), EC(25)],

  ].map(props => new CelestialStudyConnection(props[0], props[1], props[2]));

  return connections;
}());
