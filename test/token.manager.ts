import { Injectable } from "@nestjs/common";
import * as config from "config";

@Injectable()
export class TokenManager {
  private msalConfig = {
    auth: {
      clientId: config.get<string>("aquireToken.clientId"),
      authority: config.get<string>("aquireToken.authority") + config.get<string>("aquireToken.tenant"),
      clientSecret: config.get<string>("aquireToken.clientSecret"),
    },
  };

  private pca = new PublicClientApplication(this.msalConfig);

  private usernamePasswordRequest = {
    scopes: [config.get<string>("aquireToken.readScope")],
    username: config.get<string>("aquireToken.username"), // Add your username here
    password: config.get<string>("aquireToken.password"), // Add your password here
  };

  async getIdToken() {
    try {
      const response = await this.pca.acquireTokenByUsernamePassword(this.usernamePasswordRequest);
      return response.idToken;
    } catch (err) {
      console.log("There was some error", err);
      return err;
    }
  }
}
