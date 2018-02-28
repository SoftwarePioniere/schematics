import { Action } from '@ngrx/store';
import {CheckboxWrapper} from "./reducer";

export const PAGE_STATE_RESET = '[<%= classify(name) %>AuswahlModal] Page State reset';
export const NICHT_ANZUZEIGENDE_ITEMS_SETZEN = '[<%= classify(name) %>AuswahlModal] Items die aus der Auswahl entfernt werden sollen setzen';
export const ITEM_SUCHEN = '[<%= classify(name) %>AuswahlModal] Item suchen';
export const ITEM_AKTIVIERT = '[<%= classify(name) %>AuswahlModal] Item aktiviert';
export const ITEM_DEAKTIVIERT = '[<%= classify(name) %>AuswahlModal] Item deaktiviert';


// PAGE STATE RESET
export class PageStateResetAction implements Action {
    readonly type = PAGE_STATE_RESET;
}

//UI
export class NichtAnzuzeigendeItemsSetzenAction implements Action {
    readonly type = NICHT_ANZUZEIGENDE_ITEMS_SETZEN;

    constructor(public nichtAnzuzeigendeItems: Array<any>) {}
}

export class ItemSuchenAction implements Action {
    readonly type = ITEM_SUCHEN;

    constructor(public filterString: string) {}
}

export class ItemAktiviertAction implements Action {
    readonly type = ITEM_AKTIVIERT;

    constructor(public checkboxWrapper: CheckboxWrapper) {}
}

export class ItemDeaktiviertAction implements Action {
    readonly type = ITEM_DEAKTIVIERT;

    constructor(public checkboxWrapper: CheckboxWrapper) {}
}


export type Actions =
    NichtAnzuzeigendeItemsSetzenAction
    | ItemSuchenAction
    | ItemAktiviertAction
    | ItemDeaktiviertAction
    | PageStateResetAction
    ;
