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
    [CS(22), CS(32)],
  ].map(props => new CelestialStudyConnection(props[0], props[1], props[2]));

  return connections;
}());
