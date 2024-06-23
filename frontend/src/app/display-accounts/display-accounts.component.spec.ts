import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAccountsComponent } from './display-accounts.component';

describe('DisplayAccountsComponent', () => {
  let component: DisplayAccountsComponent;
  let fixture: ComponentFixture<DisplayAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayAccountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
