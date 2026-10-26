import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { MDXFrontMatter } from "./types";

const root = process.cwd();

export const postsPath = path.join(root, "./docs/wiki");

export const getMdx = (filePath: string) => {
  const docSource = fs.readFileSync(filePath, "utf-8");

  const { data, content } = matter(docSource);

  return {
    frontMatter: {
      ...data,
      slug: path.basename(filePath).replace(".mdx", ""),
    } as MDXFrontMatter,
    content,
  };
};

export const getAllMdx = (dir = postsPath): { frontMatter: MDXFrontMatter, content: string }[] => {
  const items = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Caso seja uma subpasta, chama recursivamente a função
      const subItems = getAllMdx(filePath);
      items.push(...subItems);
    } else if (path.extname(filePath) === ".mdx") {
      // Caso seja um arquivo .mdx, lê e adiciona na lista
      const item = getMdx(filePath);
      items.push(item);
    }
  }

  return items.sort(
    (a, b) =>
      new Date(b.frontMatter.date).getTime() -
      new Date(a.frontMatter.date).getTime()
  );
};




export const getLatestMdx = (dir = postsPath): { frontMatter: MDXFrontMatter, content: string } | null => {
  let latestMdx = null;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Caso seja uma subpasta, chama recursivamente a função
      const latestSubMdx = getLatestMdx(filePath);
      if (latestSubMdx && (!latestMdx || new Date(latestSubMdx.frontMatter.date) > new Date(latestMdx.frontMatter.date))) {
        latestMdx = latestSubMdx;
      }
    } else if (path.extname(filePath) === ".mdx") {
      // Caso seja um arquivo .mdx, verifica se é mais recente que o atual
      const item = getMdx(filePath);
      if (!latestMdx || new Date(item.frontMatter.date) > new Date(latestMdx.frontMatter.date)) {
        latestMdx = item;
      }
    }
  }

  return latestMdx;
};

