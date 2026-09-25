import { describe, expect, it } from "vitest";

import { resolvePagesMeta } from "../scripts/github-pages-meta.mjs";

describe("resolvePagesMeta", () => {
  it("uses project-site defaults for a normal repo", () => {
    expect(resolvePagesMeta({ owner: "jasodeepchatterjee", repo: "leetflix" })).toEqual({
      url: "https://jasodeepchatterjee.github.io/leetflix",
      basePath: "/leetflix",
      kind: "project",
    });
  });

  it("uses the apex for a user/org site repo", () => {
    expect(resolvePagesMeta({ owner: "acme", repo: "acme.github.io" })).toEqual({
      url: "https://acme.github.io",
      basePath: "",
      kind: "user",
    });
  });

  it("honours custom-domain overrides and strips trailing slashes", () => {
    expect(
      resolvePagesMeta({
        owner: "acme",
        repo: "leetflix",
        siteUrl: "https://leetflix.dev/",
        basePath: "/",
      }),
    ).toEqual({
      url: "https://leetflix.dev",
      basePath: "",
      kind: "custom",
    });
  });

  it("rejects a relative SITE_URL override", () => {
    expect(() =>
      resolvePagesMeta({ owner: "acme", repo: "leetflix", siteUrl: "leetflix.dev" }),
    ).toThrow(/absolute/);
  });

  it("rejects missing identity", () => {
    expect(() => resolvePagesMeta({ owner: "", repo: "leetflix" })).toThrow(/required/);
  });
});
