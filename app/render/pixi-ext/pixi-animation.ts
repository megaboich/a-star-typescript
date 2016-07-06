import * as pixi from 'pixi.js'

export interface IAnimation {
    Update(elapsedMs: number): void;
    IsCompleted: boolean;
    OnCompleted: () => void;
}

export class AnimationBase {
    Entity: pixi.DisplayObject;
    IsCompleted: boolean;
    protected durationRemains: number;
    OnCompleted: () => void;

    constructor(entity: pixi.DisplayObject, durationInMs: number, onCompleted: () => void) {
        if (entity == null) {
            throw 'Entity is null';
        }
        this.Entity = entity;
        this.OnCompleted = onCompleted;
        this.durationRemains = durationInMs;
        this.IsCompleted = false;
    }
}