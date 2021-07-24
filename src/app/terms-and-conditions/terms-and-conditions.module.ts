import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsAndConditionsPageRoutingModule } from './terms-and-conditions-routing.module';

import { TermsAndConditionsPage } from './terms-and-conditions.page';

import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    PdfViewerModule,
    IonicModule,
    TermsAndConditionsPageRoutingModule
  ],
  declarations: [TermsAndConditionsPage]
})
export class TermsAndConditionsPageModule { }
