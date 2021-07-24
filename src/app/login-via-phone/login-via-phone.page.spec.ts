import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginViaPhonePage } from './login-via-phone.page';

describe('LoginViaPhonePage', () => {
  let component: LoginViaPhonePage;
  let fixture: ComponentFixture<LoginViaPhonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginViaPhonePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginViaPhonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
