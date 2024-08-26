export default function sortByYear(kits) {
  let years = []
  for (let kit in kits) {
    years.push(kits[kit]['year'])
  }

  return [...new Set(years)].sort().reverse();
}
