import { CelestialStudyConnectionSetup } from "./CelestialStudyConnection";
import { CelestialStudySetup } from "./CelestialStudyButton";

class CelestialStudyRow {
  constructor(layout, items, isWide) {
    this.layout = layout;
    this.items = items;
    this.isWide = isWide;
  }

  get width() {
    const itemCount = this.items.length;
    const layout = this.layout;
    return itemCount * layout.itemWidth + (itemCount - 1) * layout.spacing;
  }

  itemPosition(column, treeLayout) {
    const layout = this.layout;
    const treeWidth = treeLayout.width;
    const rowLeft = (treeWidth - this.width) / 2;
    return rowLeft + column * layout.itemWidth + column * layout.spacing;
  }
}

class CelestialStudyRowLayout {
  constructor(props) {
    this.itemWidth = props.itemWidth;
    this.itemHeight = props.itemHeight;
    this.spacing = props.spacing;
  }
}

export default class CelestialStudyTreeLayout {
  // eslint-disable-next-line complexity
  constructor(type, scaling = 1) {
    this.spacing = 4 * scaling;

    const normalRowLayout = new CelestialStudyRowLayout({
      itemWidth: 18 * scaling,
      itemHeight: 10 * scaling,
      spacing: 3 * scaling
    });

    const wideRowLayout = new CelestialStudyRowLayout({
      itemWidth: 12 * scaling,
      itemHeight: 10 * scaling,
      spacing: 0.6 * scaling
    });
    const normalRow = (...items) => new CelestialStudyRow(normalRowLayout, items);
    const wideRow = (...items) => new CelestialStudyRow(wideRowLayout, items, true);

    const CS = id => (CelestialStudy(id).isUnlocked ? CelestialStudy(id) : null);
    const EC = id => CelestialStudy.eternityChallenge(id);

    /**
     * @type {CelestialStudyRow[]}
     */
    /* eslint-disable no-multi-spaces, space-in-parens, func-call-spacing, capitalized-comments */
    this.rows = [
      normalRow(                       null,   CS(11),   null                         ),
      normalRow(                           CS(21), CS(22)                             ),
      normalRow(                           CS(31), CS(32)                             )
    ];

    /* this.rows.push(
      normalRow(                           CS(41), CS(42)                             ),
      normalRow(                       null,   CS(51),  EC(5)                         )
    );

    this.rows.push(
      normalRow(                       null,   CS(61),  CS(62)                        ),
      normalRow(                      CS(71),  CS(72),  CS(73)                        ),
      normalRow(                      CS(81),  CS(82),  CS(83)                        ),
      normalRow(                      CS(91),  CS(92),  CS(93)                        ),
      normalRow(                      CS(101), CS(102), CS(103)                       ),
      normalRow(                       EC(7),  CS(111),  CS(306)                      ),
      normalRow(                      CS(121), CS(122), CS(123)                       ),
      normalRow(               EC(6), CS(131), CS(132), CS(133), EC(8)                ),
      normalRow(                      CS(141), CS(142), CS(143)                       ),
      normalRow(               null,   EC(9), CS(151),   null,   EC(4)                ),
      normalRow(                          CS(161), CS(162)                            ),
      normalRow(                               CS(171)                                ),
      normalRow(                         EC(1), EC(2), EC(3)                          ),
      normalRow(                               CS(181)                                ),
      normalRow(                               EC(10)                                 ),
      normalRow(             CS(191),          CS(192),          CS(193)              ),
      normalRow(                         null, CS(201), CS(307)                       ),
      normalRow(    CS(211),          CS(212),          CS(213),          CS(214)     ),
      wideRow  (CS(221), CS(222), CS(223), CS(224), CS(225), CS(226), CS(227), CS(228))
    );

    this.rows.push(
      normalRow(    CS(231),          CS(232),          CS(233),          CS(234)     ),
      normalRow(              EC(11),                             EC(12)              )); */
    /* eslint-enable no-multi-spaces, space-in-parens, func-call-spacing, capitalized-comments */

    /**
     * @type {CelestialStudySetup[]}
     */
    this.studies = [];
    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      const row = this.rows[rowIndex];
      for (let columnIndex = 0; columnIndex < row.items.length; columnIndex++) {
        const study = row.items[columnIndex];
        if (study === null) continue;
        const setup = new CelestialStudySetup({
          study,
          row: rowIndex,
          column: columnIndex
        });
        if (row.isWide) {
          setup.isSmall = true;
        }
        this.studies.push(setup);
      }
    }

    /**
     * @type {CelestialStudyConnectionSetup[]}
     */
    this.connections = CelestialStudy.allConnections
      .map(c => new CelestialStudyConnectionSetup(c));

    this.width = this.rows.map(row => row.width).nMax();
    const heightNoSpacing = this.rows.map(r => r.layout.itemHeight).nSum();
    this.height = heightNoSpacing + (this.rows.length - 1) * this.spacing;

    for (const study of this.studies) {
      study.setPosition(this);
    }
    for (const connection of this.connections) {
      if (!connection.isOverridden) connection.setPosition(this.studies, this.width, this.height);
    }
  }

  itemPosition(row) {
    const rows = this.rows.slice(0, row);
    const heightNoSpacing = rows.map(r => r.layout.itemHeight).nSum();
    return heightNoSpacing + rows.length * this.spacing;
  }

  static get current() {
    return {
      alt62: Perk.bypassEC5Lock.isBought,
      alt181: Perk.bypassEC1Lock.isBought && Perk.bypassEC2Lock.isBought && Perk.bypassEC3Lock.isBought,
      mu9: MendingUpgrade(9).isBought,
      triad: Ra.canBuyTriad,
      triadPace: (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 9),
      triadDim: (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 12),
      mvdUnlocked: Ra.pets.laitela.level >= 75,
    };
  }

  static create(type, scaling = 1) {
    if (this._instances === undefined) {
      this._instances = {};
    }
    const layout = new CelestialStudyTreeLayout(type, scaling);
    this._instances[`${Object.keys(type).filter(x => type[x]).join("")}__${scaling}`] = layout;
    return layout;
  }
}
