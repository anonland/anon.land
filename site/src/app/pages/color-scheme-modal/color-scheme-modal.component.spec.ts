import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ColorSchemeModalPage } from './color-scheme-modal.component';

describe('ColorSchemeModalComponent', () => {
  let component: ColorSchemeModalPage;
  let fixture: ComponentFixture<ColorSchemeModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorSchemeModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorSchemeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
