const CLOTHING_TYPES = [
    't-shirt', 'shirt', 'jeans', 'dress', 'skirt',
    'shorts', 'jacket', 'coat', 'sweater', 'hoodie',
    'sweatshirt', 'blouse', 'tank top', 'polo shirt',
    'suit', 'blazer', 'vest', 'trousers', 'leggings',
    'cargo pants', 'cargo shorts', 'bikini', 'swimsuit',
    'swim trunks', 'underwear', 'boxers', 'briefs',
    'bra', 'panties', 'socks', 'stockings', 'tights',
    'scarf', 'hat', 'beanie', 'cap', 'gloves',
    'belt', 'tie', 'bow tie', 'suspenders', 'pajamas',
    'robe', 'slippers', 'sandals', 'sneakers', 'boots',
    'heels', 'flats', 'loafers', 'oxfords',
    'clogs', 'moccasins', 'espadrilles', 'wedges',
    'platform shoes', 'dress shoes', 'running shoes',
    'button-up shirt', 'cargo jacket', 'windbreaker',
    'parka', 'anorak', 'trench coat', 'raincoat',
    'bomber jacket', 'denim jacket', 'leather jacket',
];
const COLOR_NAMES = [
    'red', 'green', 'blue', 'yellow', 'orange',
    'purple', 'pink', 'brown', 'black', 'white',
    'gray', 'silver', 'gold', 'beige', 'cyan',
    'magenta', 'teal', 'navy', 'maroon', 'olive',
    'turquoise', 'lavender', 'peach', 'coral', 'indigo',
    'violet', 'lime', 'mint', 'chocolate', 'tan',
    'cream', 'ivory', 'bronze', 'charcoal', 'burgundy',
    'plum', 'fuchsia', 'apricot', 'amber', 'emerald',
    'sapphire', 'ruby', 'topaz', 'pearl', 'onyx',
    'jade', 'aquamarine', 'crimson', 'orchid',
    'sepia', 'slate', 'taupe', 'blush', 'caramel',
    'mustard', 'cobalt', 'cerulean', 'chartreuse', 'periwinkle',
    'sienna', 'ash', 'smoke', 'chocolate', 'cinnamon',
    'copper', 'platinum', 'brass', 'sage', 'fern',
    'moss', 'spruce', 'pine', 'cedar', 'mahogany',
    'walnut', 'ebony', 'maple', 'birch', 'oak',
    'teak', 'bamboo', 'driftwood'
];
const CLOTHING_PATTERNS = [
    'solid', 'striped', 'plaid', 'checkered', 'polka dot',
    'floral', 'paisley', 'geometric', 'animal print', 'camouflage',
    'tie-dye', 'argyle', 'herringbone', 'houndstooth', 'chevron',
    'gingham', 'batik', 'ikat', 'damask', 'brocade',
    'embroidery', 'lace', 'sequin', 'glitter', 'metallic',
    'ombre', 'gradient', 'color block', 'abstract', 'tropical',
    'bohemian', 'tribal', 'vintage', 'retro', 'art deco',
    'tartan', 'celtic', 'nautical', 'western', 'gothic',
    'punk', 'grunge', 'steampunk', 'futuristic'
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CLOTHING_TYPES,
        COLOR_NAMES,
        CLOTHING_PATTERNS
    };
}
