import { DC } from "../../constants";

const rebuyable = props => {
  // eslint-disable-next-line max-len
  props.costs = () => [props.costs[0], props.costs[1]];
  const effect = props.effect;
  props.effect = effect;
  props.description = () => props.textTemplate;
  props.formatCosts = (value1, value2) => `${format(value1, 2, 0)} and ${format(value2, 2, 0)}`;
  return props;
};

export const damagedUpgrades = [
  rebuyable({
    name: "Better Tesseracts",
    id: 1,
    costs: [new Decimal(1), new Decimal(1)],
    textTemplate: "Tessertacts are slightly cheaper and can be redistributed to affect other hardcaps",
    effect: () => DC.D0_965
  }),
  rebuyable({
    name: "Long Term Memory",
    id: 2,
    costs: [new Decimal(1), new Decimal(1)],
    textTemplate: "Improve a Celestial's memory gain, in exchange for decaying another",
    effect: () => DC.D1
  }),
  rebuyable({
    name: "Glyph Retention",
    id: 3,
    costs: [new Decimal(1), new Decimal(1)],
    textTemplate: "Glyphs are Kept through Mend, except in cetrain circumstances",
    effect: () => DC.D1
  }),
  rebuyable({
    name: "Dark Gravity",
    id: 3,
    costs: [new Decimal(1), new Decimal(1)],
    textTemplate: "The Universal Damage Dark Matter cap removal applies outside of Universal Damage",
    effect: () => DC.D1
  }),
  rebuyable({
    name: "Unit 08",
    id: 5,
    costs: [new Decimal(1), new Decimal(1)],
    textTemplate: "Improve Reality Machine and Imaginary Machine gain",
    effect: () => DC.D1
  }),
  {
    name: "???",
    id: 6,
    costs: [new Decimal(1), new Decimal(1)],
    description: () => `Unlock a 4th Black Hole`,
  },
];