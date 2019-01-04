import { KiloPipe } from "./kilo.pipe";

describe("KiloPipe", () => {
  it("create an instance", () => {
    const pipe = new KiloPipe();
    expect(pipe).toBeTruthy();
  });
});
