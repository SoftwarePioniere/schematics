import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { <%= classify(name) %>LoeschenModal } from './<%= dasherize(name) %>-loeschen.modal';

@NgModule({
  declarations: [
      <%= classify(name) %>LoeschenModal,
  ],
  imports: [
    IonicPageModule.forChild(<%= classify(name) %>LoeschenModal),
  ],
})
export class <%= classify(name) %>LoeschenModalModule {}
