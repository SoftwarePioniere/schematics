import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { <%= ClassName %>LoeschenModal } from './<%= FILENAME %>-loeschen.modal';

@NgModule({
  declarations: [
      <%= ClassName %>LoeschenModal,
  ],
  imports: [
    IonicPageModule.forChild(<%= ClassName %>LoeschenModal),
  ],
})
export class <%= ClassName %>LoeschenModalModule {}
