export default function getDisplayedDate(date: string) {
  const dateObj = new Date();

  return dateObj.toLocaleDateString();
}
