import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the <%= ClassName %>LoeschenModal page.
 *
 * See http://docs.softwarepioniere.de/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'modal-<%= FILENAME %>-loeschen',
    templateUrl: '<%= FILENAME %>-loeschen.modal.html',
})
export class <%= ClassName %>LoeschenModal {

    private titel: string = "";

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private viewCtrl: ViewController) {
        this.titel = this.navParams.get('titel');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad <%= ClassName %>LoeschenModal');
    }


    ok() {
        this.viewCtrl.dismiss("ok");
    }

    abbrechen() {
        this.viewCtrl.dismiss();
    }

}
