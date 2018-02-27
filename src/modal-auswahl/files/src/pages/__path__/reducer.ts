import {createSelector, createFeatureSelector, ActionReducerMap, Action} from '@ngrx/store';
import * as actionsUi from './actions.ui';
import * as apiActions from './<%= dasherize(name) %>-auswahl.modal';

export interface DividerGroup {
    titel: string,
    items: CheckboxWrapper[]
}

export interface CheckboxWrapper {
    selected: boolean,
    titel: string,
    item: any
}

export interface IndexWrapper {
    titel: string
    aktiv: boolean,
}


let indexNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let defaultIndex = indexNames.map(x => {
    return <IndexWrapper>{titel: x, aktiv: false}
});

function itemsGruppierenUndFiltern(benutzer: Array<CheckboxWrapper>, state: PageState, filterString: string = "") {
    let itemsGruppiert: Array<DividerGroup> = [];
    if (filterString == null) {
        filterString = "";
    }
    benutzer.filter(item => {
        return filterString == "" || item.titel.toLowerCase().indexOf(filterString.toLowerCase()) != -1;
    }).filter(item => {
        let nichtAnzuzeigenderBenutzer = state.nichtAnzuzeigendeItems.find(i => i.benutzer_id == item.item.id);
        return nichtAnzuzeigenderBenutzer == null;
    }).forEach(checkboxWrapper => {
        let divTitle = "";

        if(checkboxWrapper.item != null && checkboxWrapper.item.last_name != null){
            divTitle = checkboxWrapper.item.displayText.substring(0, 1).toUpperCase();
        }else{
            divTitle = "";
        }
        let div = itemsGruppiert.find(i => i.titel == divTitle);

        if (div == null) {
            div = <DividerGroup>{titel: divTitle, items: []};
            itemsGruppiert.push(div);
        }

        div.items.push(checkboxWrapper);
    });
    return itemsGruppiert;
}

function indexAufbauen(itemsGruppiert: Array<DividerGroup>): Array<IndexWrapper> {
    let index: any = [];

    defaultIndex.forEach(x => {
        index.push(Object.assign({}, x));
    });

    let newIndex = index.map((x: any) => {
        let div = itemsGruppiert.find(i => i.titel.toUpperCase() == x.titel.toUpperCase());

        if (div != null) {
            x.aktiv = true;
        }
        return x;
    });
    return newIndex;
}


export interface ModuleState {
    page: PageState;
}

export const reducers: ActionReducerMap<ModuleState> = {
    page: pageReducer
};

export interface PageState {
    items: Array<CheckboxWrapper>;
    itemsGruppiert: Array<DividerGroup> ;
    nichtAnzuzeigendeItems: Array<any>;
    uiIndex: Array<IndexWrapper>;
    uiLadeanimation: boolean;
    uiLadeFehler: boolean;
    uiAktuellerFilterString: string;
}

export const initialPageState: PageState = {
    items: [],
    itemsGruppiert: [],
    nichtAnzuzeigendeItems: [],
    uiIndex: defaultIndex,
    uiLadeanimation: false,
    uiLadeFehler: false,
    uiAktuellerFilterString: ""
};

export function pageReducer(state = initialPageState, action: Action): PageState {
    switch (action.type) {

        // Page State Reset
        case actionsUi.PAGE_STATE_RESET: {
            return Object.assign({}, state, <PageState>initialPageState);
        }


        case apiActions.actionApi.actionGeladen: {
            // Items wrappen
            const itemsCheckboxWrapped: CheckboxWrapper[] = action.payload.map(item => {
                return <CheckboxWrapper> {
                    titel: item.displayText,
                    selected: false,
                    item: item
                };
            })

            // Items sortieren und gruppieren
            const itemsGruppiert: Array<DividerGroup> = itemsGruppierenUndFiltern(itemsCheckboxWrapped, state);
            let neuerIndex = indexAufbauen(itemsGruppiert);

            return Object.assign({}, state, <PageState>{
                uiIndex: neuerIndex,
                items: itemsCheckboxWrapped,
                itemsGruppiert: itemsGruppiert,
                uiLadeanimation: false
            });
        }

        case apiActions.actionApi.actionLaden: {
            return Object.assign({}, state, <PageState>{uiLadeanimation: true});
        }

        case apiActions.actionApi.actionFehler: {
            return Object.assign({}, state, <PageState>{uiLadeanimation: false, uiLadeFehler: true});
        }

        case actionsUi.NICHT_ANZUZEIGENDE_ITEMS_SETZEN: {
            const a = <actionsUi.NichtAnzuzeigendeItemsSetzenAction> action;

            if (a.nichtAnzuzeigendeItems == null) {
                a.nichtAnzuzeigendeItems = [];
            }
            return Object.assign({}, state, <PageState>{nichtAnzuzeigendeItems: a.nichtAnzuzeigendeItems});
        }

        case actionsUi.ITEM_SUCHEN: {
            const a = <actionsUi.ItemSuchenAction> action;

            // Items filtern, sortieren und gruppieren
            const itemsGruppiert: Array<DividerGroup> = itemsGruppierenUndFiltern(state.items, state, a.filterString);
            let neuerIndex = indexAufbauen(itemsGruppiert);


            return Object.assign({}, state, <PageState>{
                uiIndex: neuerIndex,
                uiAktuellerFilterString: a.filterString,
                itemsGruppiert: itemsGruppiert,
                uiLadeanimation: false
            });
        }

        default: {
            return state;
        }
    }
}

export const getModuleState = createFeatureSelector<ModuleState>('<%= classify(name) %>AuswahlModal');

export const getPageState = createSelector(getModuleState, (state: ModuleState) => state.page);

export const getItems = createSelector(getPageState, (state: PageState) => state.items);
export const getItemsGruppiert = createSelector(getPageState, (state: PageState) => state.itemsGruppiert);
export const getUiLadeanimation = createSelector(getPageState, (state: PageState) => state.uiLadeanimation);
export const getUiLadeFehler = createSelector(getPageState, (state: PageState) => state.uiLadeFehler);
export const getUiIndex = createSelector(getPageState, (state: PageState) => state.uiIndex);
