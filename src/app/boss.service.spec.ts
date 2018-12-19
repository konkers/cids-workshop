import { TestBed } from '@angular/core/testing';

import { BossService } from './boss.service';

describe('BossService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BossService = TestBed.get(BossService);
    expect(service).toBeTruthy();
  });
});
