declare namespace App {
  interface Locals {
    user: {
      userId: string;
      profileType: "PROFESOR" | "ESTUDIANTE";
      isAdmin: boolean;
    } | null;
  }
}
