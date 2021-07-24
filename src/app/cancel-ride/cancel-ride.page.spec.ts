import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CancelRidePage } from './cancel-ride.page';

describe('CancelRidePage', () => {
  let component: CancelRidePage;
  let fixture: ComponentFixture<CancelRidePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelRidePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelRidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
