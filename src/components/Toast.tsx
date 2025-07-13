"use client";
import { toast } from "sonner";

interface ShowToastOptions {
  title: string;
}

export function showToast({ title }: ShowToastOptions) {
  toast(`${title}`);
}
