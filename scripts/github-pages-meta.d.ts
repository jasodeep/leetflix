export function resolvePagesMeta(input: {
  owner: string;
  repo: string;
  siteUrl?: string;
  basePath?: string;
}): {
  url: string;
  basePath: string;
  kind: "custom" | "user" | "project";
};
