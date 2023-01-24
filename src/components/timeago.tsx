export function TimeAgo({ date }: { date: Date }) {
  return <span>{getAgoString(date)}</span>;
}

function getAgoString(date: Date) {
  const seconds = (new Date().getTime() - date.getTime()) / 1000;
  const minutes = seconds / 60;
  if (minutes < 60) {
    return "minutes ago";
  }
  const hours = minutes / 60;
  if (hours < 24) {
    return "hours ago";
  }
  const days = hours / 24;
  if (days < 7) {
    return "days ago";
  }
  const weeks = days / 7;
  if (weeks < 3) {
    return "weeks ago";
  }
  const months = days / 30;
  if (months < 2) {
    return "month ago";
  }
  if (months < 12 && months > 2) {
    return `${Math.floor(months)} months ago`;
  }
  const years = days / 365;
  return `${Math.floor(years)} years ago`;
}
