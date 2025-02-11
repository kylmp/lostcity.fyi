import { readdirSync, statSync } from "fs";
import path from "path";

export function getFilesWithExtension(base: string | undefined, ext: string, files?: string[], result?: string[]): string[] {
  if (!base) return [];
  files = files || readdirSync(base);
  result = result || [];
  files.forEach(file => {
    const newbase = path.join(base, file);
    if (statSync(newbase).isDirectory()) {
      result = getFilesWithExtension(newbase, ext, readdirSync(newbase), result);
    }
    else {
      if (file.substr(-1 * (ext.length + 1)) == `.${ext}`) {
        result!!.push(newbase);
      } 
    }
  });
  return result;
}
