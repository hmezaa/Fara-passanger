import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoiceModalPageRoutingModule } from './voice-modal-routing.module';

import { VoiceModalPage } from './voice-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    VoiceModalPageRoutingModule
  ],
  declarations: [VoiceModalPage]
})
export class VoiceModalPageModule {}
