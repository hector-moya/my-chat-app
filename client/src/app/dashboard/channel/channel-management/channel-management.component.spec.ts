import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelManagementComponent } from './channel-management.component';

describe('ChannelManagementComponent', () => {
  let component: ChannelManagementComponent;
  let fixture: ComponentFixture<ChannelManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChannelManagementComponent]
    });
    fixture = TestBed.createComponent(ChannelManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
