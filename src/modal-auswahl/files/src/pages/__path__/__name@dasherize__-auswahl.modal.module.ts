import {ErrorHandler, NgModule} from '@angular/core';
import {IonicPageModule, IonicErrorHandler} from 'ionic-angular';
import {HttpModule, Http, XHRBackend, RequestOptions, JsonpModule} from "@angular/http";
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {DBModule} from "@ngrx/db";
import {reducers} from './reducer';

import { <%= classify(name) %>AuswahlModal } from './<%= dasherize(name) %>-auswahl.modal';

@NgModule({
    declarations: [
        <%= classify(name) %>AuswahlModal,
    ],
    imports: [
        IonicPageModule.forChild(<%= classify(name) %>AuswahlModal),

        StoreModule.forFeature('<%= classify(name) %>AuswahlModal', reducers),

        EffectsModule.forFeature([])
    ],
    providers: []
})
export class <%= classify(name) %>AuswahlModalModule {}
