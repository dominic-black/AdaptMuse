export const jobIconNames = {
  Email: "Email",
  Script: "Script", 
  Advertising: "Advertising",
  Speech: "Speech",
  Music: "Music",
  Video: "Video",
  Default: "Default",
} as const;

export type JobIconName = keyof typeof jobIconNames; 