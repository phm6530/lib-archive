// BASE
export const NOTION_ID = process.env.NOTION_ID as string;
export const NOTION_TOKEN = process.env.NOTION_TOKEN as string;
export const NOTION_BASE_URL = process.env.NOTION_BASE_URL as string;

export const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string;

// Notion - Segment
export enum NOTION_SEGMENT {
  DETAIL_CONTENTS = "blocks",
  DETAIL_META = "pages",
  LIST = "databases",
}

// revadiltetags
export enum REVADILTE_PRE {
  POST_METADATA = "POST_METADATA",
  POST = "POST",
  GIT = "GIT",
  CATEGORY = "CATEGORY",
  ALL_LIST = "ALL_LIST",
}
