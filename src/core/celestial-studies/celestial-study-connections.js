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
  let val = 1;
  function updateVal() {
    val = CelestialStudy.totalVisibleRows();
    return val < 2;
  }
  const connections = [
    // Idk why but we have to define val here to be reactive. Better than having like 30 calls
    [CS(11), CS(21), () => updateVal()],
    [CS(11), CS(22), () => val < 2],

    [CS(21), CS(31), () => val < 3],
    [CS(22), EC(13), () => val < 3],
    [CS(22), CS(32), () => val < 3],

    [CS(31), CS(41), () => val < 4],
    [CS(31), CS(42), () => val < 4],
    [CS(32), CS(43), () => val < 4],
    [CS(32), CS(44), () => val < 4],

    [CS(41), CS(51), () => val < 5],
    [CS(42), CS(52), () => val < 5],
    [CS(43), CS(53), () => val < 5],
    [CS(44), CS(54), () => val < 5],

    [CS(51), CS(61), () => val < 6],
    [CS(52), CS(62), () => val < 6],
    [CS(53), CS(63), () => val < 6],
    [CS(54), CS(64), () => val < 6],

    [CS(61), CS(71), () => val < 7],
    [CS(62), CS(71), () => val < 7],
    [CS(63), CS(72), () => val < 7],
    [CS(64), CS(72), () => val < 7],

    [CS(71), CS(81), () => val < 8],
    [CS(72), CS(81), () => val < 8],
    [CS(71), EC(14), () => val < 8],
    [CS(72), EC(14), () => val < 8],

    [CS(81), CS(91), () => val < 9],
    [CS(81), CS(92), () => val < 9],
    [CS(81), CS(93), () => val < 9],
    [CS(81), EC(15), () => val < 9],
    [CS(81), EC(16), () => val < 9],

    [CS(91), EC(17), () => val < 10],
    [CS(92), CS(102), () => val < 10],
    [CS(93), EC(18), () => val < 10],

    [EC(17), CS(111), () => val < 11],
    [CS(102), CS(112), () => val < 11],
    [EC(18), CS(113), () => val < 11],

    [CS(111), CS(121), () => val < 12],
    [CS(112), CS(121), () => val < 12],
    [CS(113), CS(121), () => val < 12],

    [CS(121), CS(131), () => val < 13],
    [CS(121), CS(132), () => val < 13],

    [CS(131), EC(19), () => val < 14],
    [CS(132), EC(19), () => val < 14],

    [EC(19), CS(151), () => val < 15],
    [EC(19), CS(152), () => val < 15],

    [CS(151), EC(20), () => val < 16],
    [CS(152), EC(20), () => val < 16],

    [EC(20), CS(171), () => val < 17],
    [EC(20), CS(172), () => val < 17],

    [CS(171), CS(181), () => val < 18],
    [CS(171), CS(182), () => val < 18],
    [CS(171), CS(183), () => val < 18],
    [CS(171), CS(184), () => val < 18],
    [CS(172), CS(185), () => val < 18],
    [CS(172), CS(186), () => val < 18],
    [CS(172), CS(187), () => val < 18],
    [CS(172), CS(188), () => val < 18],

    [CS(181), CS(191), () => val < 19],
    [CS(182), CS(191), () => val < 19],
    [CS(183), CS(191), () => val < 19],
    [CS(184), CS(191), () => val < 19],
    [CS(185), CS(191), () => val < 19],
    [CS(186), CS(191), () => val < 19],
    [CS(187), CS(191), () => val < 19],
    [CS(188), CS(191), () => val < 19],

    [CS(191), EC(21), () => val < 19],
    [CS(191), EC(22), () => val < 19],
    [CS(191), EC(23), () => val < 20],
    [CS(191), EC(24), () => val < 20],
    [CS(191), EC(25), () => val < 21],

  ].map(props => new CelestialStudyConnection(props[0], props[1], props[2]));

  return connections;
}());
