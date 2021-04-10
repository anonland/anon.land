import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewPostPage } from './new-post.page';

describe('NewPostPage', () => {
  let component: NewPostPage;
  let fixture: ComponentFixture<NewPostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPostPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
