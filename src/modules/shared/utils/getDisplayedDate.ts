export default function getDisplayedDate(date: string) {
  const dateObj = new Date(date);

  return dateObj.toLocaleDateString();
}
