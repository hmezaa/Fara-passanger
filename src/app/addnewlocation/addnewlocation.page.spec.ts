import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddnewlocationPage } from './addnewlocation.page';

describe('AddnewlocationPage', () => {
  let component: AddnewlocationPage;
  let fixture: ComponentFixture<AddnewlocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnewlocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddnewlocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
