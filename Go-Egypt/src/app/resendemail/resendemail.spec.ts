import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resendemail } from './resendemail';

describe('Resendemail', () => {
  let component: Resendemail;
  let fixture: ComponentFixture<Resendemail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resendemail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Resendemail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
