import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewVoxPage } from './new-vox.page';

describe('NewVoxPage', () => {
  let component: NewVoxPage;
  let fixture: ComponentFixture<NewVoxPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVoxPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewVoxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
