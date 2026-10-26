import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { MDXFrontMatter } from "./types";

const root = process.cwd();

export const postsPath = path.join(root, "./docs/articles");

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
