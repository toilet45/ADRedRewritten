import { DC } from "../../../constants";

export const ecCelestialStudies = [
  {
    id: 13,
    cost: new Decimal(0),
    requirement: [11],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Eternities",
      current: () => Currency.eternitiesTotal.value,
      required: () => new Decimal(0),
      formatValue: formatInt
    }
  },
];
