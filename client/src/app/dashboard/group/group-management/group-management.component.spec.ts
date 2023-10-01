import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupManagementComponent } from './group-management.component';

describe('GroupManagementComponent', () => {
  let component: GroupManagementComponent;
  let fixture: ComponentFixture<GroupManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GroupManagementComponent]
    });
    fixture = TestBed.createComponent(GroupManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
