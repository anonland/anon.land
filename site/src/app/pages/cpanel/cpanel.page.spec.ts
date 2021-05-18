import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CpanelPage } from './cpanel.page';

describe('CpanelPage', () => {
  let component: CpanelPage;
  let fixture: ComponentFixture<CpanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpanelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CpanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
