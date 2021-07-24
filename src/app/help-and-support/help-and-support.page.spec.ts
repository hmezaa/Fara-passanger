import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HelpAndSupportPage } from './help-and-support.page';

describe('HelpAndSupportPage', () => {
  let component: HelpAndSupportPage;
  let fixture: ComponentFixture<HelpAndSupportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpAndSupportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpAndSupportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
