import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartOperationsComponent } from './pie-chart-operations.component';

describe('PieChartOperationsComponent', () => {
  let component: PieChartOperationsComponent;
  let fixture: ComponentFixture<PieChartOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieChartOperationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieChartOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
