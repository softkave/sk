export default function trim(value) {
  if (value && value.trim) {
    return value.trim();
  }
}
