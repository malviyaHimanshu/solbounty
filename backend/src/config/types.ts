
export interface User {
  id: string;
  username: string;
  accessToken: string;
}

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      accessToken: string;
    }
  }
}