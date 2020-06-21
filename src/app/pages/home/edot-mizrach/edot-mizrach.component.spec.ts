import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EdotMizrachComponent } from './edot-mizrach.component';

describe('EdotMizrachComponent', () => {
  let component: EdotMizrachComponent;
  let fixture: ComponentFixture<EdotMizrachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdotMizrachComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EdotMizrachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
