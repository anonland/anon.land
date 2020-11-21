import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VoxPage } from './vox.page';

describe('VoxPage', () => {
  let component: VoxPage;
  let fixture: ComponentFixture<VoxPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoxPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VoxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
