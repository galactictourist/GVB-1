export function cleanUpFilename(filename: string) {
  return filename.replace(/([^a-z0-9\-_\.]+)/gi, '-').replace(/(-{2,})/g, '-');
}
