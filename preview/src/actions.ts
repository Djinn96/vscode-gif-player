import * as appState from './state';
import { Gif } from './util/loadGif';
import { VSCodeState } from './vscodeState';

export enum ActionType {
    DidLoad,
    DidError,

    SetFrame,
    SetZoom,
    TogglePlay,
}

export class DidLoad {
    public readonly type = ActionType.DidLoad;

    constructor(
        public readonly gif: Gif,
        public readonly vscodeState: VSCodeState | undefined,
    ) { }
}

export class DidError {
    public readonly type = ActionType.DidError;

    constructor(
        public readonly error: string,
    ) { }
}

export class SetFrame {
    public readonly type = ActionType.SetFrame;

    constructor(
        public readonly frame: number,
    ) { }
}

export class SetZoom {
    public readonly type = ActionType.SetZoom;

    constructor(
        public readonly zoom: number,
    ) { }
}

export class TogglePlay {
    public readonly type = ActionType.TogglePlay;

    constructor(
        public readonly playing: boolean,
    ) { }
}

export type Actions =
    | DidLoad
    | DidError
    | SetFrame
    | SetZoom
    | TogglePlay;


export function appStateReducer(state: appState.AppState, action: Actions): appState.AppState {

    switch (action.type) {
        case ActionType.DidLoad:
            {
                return new appState.Ready(
                    action.gif,
                    action.vscodeState?.frame || 0,
                    1,
                    false);
            }
        case ActionType.DidError:
            {
                return new appState.Errored(action.error);
            }
        case ActionType.SetFrame:
            {
                if (state.stage !== appState.AppStage.Ready) {
                    throw new Error('Bad state');
                }

                const frame = action.frame < 0
                    ? state.gif.frames.length + action.frame
                    : action.frame % state.gif.frames.length;

                return new appState.Ready(
                    state.gif,
                    frame,
                    state.zoom,
                    state.playing);
            }
        case ActionType.SetZoom:
            {
                if (state.stage !== appState.AppStage.Ready) {
                    throw new Error('Bad state');
                }

                var zoom = action.zoom
                zoom = Math.min(zoom,5)
                zoom = Math.max(zoom,0.2)

                return new appState.Ready(
                    state.gif,
                    state.frame,
                    zoom,
                    state.playing);
            }
        case ActionType.TogglePlay:
            {
                if (state.stage !== appState.AppStage.Ready) {
                    throw new Error('Bad state');
                }

                return new appState.Ready(
                    state.gif,
                    state.frame,
                    state.zoom,
                    action.playing);
            }
    }
}
