import https from "https";

export class AxiosService {
  static get(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const request = https.get(path, (res) => {
        if (res?.statusCode !== 200) {
          reject({ msg: "Offline", statusCode: res?.statusCode });
        }

        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });
      });

      request.on("error", (error) => {
        reject(error);
      });

      const timeout = setTimeout(() => {
        request.destroy();
        reject("Request timed out");
      }, +(process.env.REQUEST_TIMEOUT || 5000));

      request.on("close", () => {
        clearTimeout(timeout);
      });
    });
  }
}
