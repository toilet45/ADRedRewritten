export const mendingChallenges = [
  {
    id: 1,
    description: () => "Fuck you",
    goal: new Decimal(50),
    goalCurrency: Currency.antimatter,
    failConditions: {},
    reward: {
      description: () => "less fucks given",
      effect: () => new Decimal(2),
      formatEffect: value => formatX(value, 2, 2)
    }
  }
];