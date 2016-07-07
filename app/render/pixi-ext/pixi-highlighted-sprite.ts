export class HighligtedSprite extends PIXI.Sprite {
    private _ex_originalTint: number;
    private _ex_originalAlpha: number;
    private _ex_originalFilter: PIXI.AbstractFilter[];

    removeHighlighting: (options: { tintColor?: boolean, alpha?: boolean, filters?: boolean }) => void;
    setHighlighting: (options: { tintColor?: number, alpha?: number, filters?: PIXI.AbstractFilter[] }) => void;

    // static constructor function
    public static fromSprite(sprite: PIXI.Sprite): HighligtedSprite {
        let s = sprite as HighligtedSprite;
        s.setHighlighting = (options: { tintColor?: number, alpha?: number, filters?: PIXI.AbstractFilter[] }) => {
            if (options.tintColor) {
                s._ex_originalTint = s.tint;
                s.tint = options.tintColor;
            }
            if (options.alpha) {
                s._ex_originalAlpha = s.alpha;
                s.alpha = options.alpha;
            }
            if (options.filters) {
                s._ex_originalFilter = s.filters;
                s.filters = options.filters;
            }
        };

        s.removeHighlighting = (options: { tintColor?: boolean, alpha?: boolean, filters?: boolean }) => {
            if (options.tintColor) {
                s.tint = s._ex_originalTint;
            }
            if (options.alpha) {
                s.alpha = s._ex_originalAlpha;
            }
            if (options.filters) {
                s.filters = s._ex_originalFilter;
            }
        };

        return s;
    }
}