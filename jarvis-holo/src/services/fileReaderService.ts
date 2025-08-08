export async function fileToText(file: File): Promise<string> {
  return file.text()
}