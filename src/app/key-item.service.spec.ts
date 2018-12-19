import { TestBed } from "@angular/core/testing";

import { KeyItemService } from "./key-item.service";

describe("KeyItemService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: KeyItemService = TestBed.get(KeyItemService);
    expect(service).toBeTruthy();
  });
});
