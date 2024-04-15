import fs from "fs";

export class FileService {
  static readFileSync(filename: string): Array<string> {
    try {
      const data = fs.readFileSync(filename);

      if (!data) return [];

      return data.toString("utf-8").split("\n").filter((num) => num);
    } catch (error) {
      console.error("Error reading file:", error);
      return [];
    }
  }
}
