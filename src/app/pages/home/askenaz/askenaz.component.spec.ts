import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AskenazComponent } from './askenaz.component';

describe('AskenazComponent', () => {
  let component: AskenazComponent;
  let fixture: ComponentFixture<AskenazComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskenazComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AskenazComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
