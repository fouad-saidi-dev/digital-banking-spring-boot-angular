import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartOperationsComponent } from './line-chart-operations.component';

describe('LineChartOperationsComponent', () => {
  let component: LineChartOperationsComponent;
  let fixture: ComponentFixture<LineChartOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineChartOperationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LineChartOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
