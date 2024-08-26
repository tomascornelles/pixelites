export default function sortByName (kits) {
  const names = ['home', 'home alt', 'away', 'third', 'fourth', 'special'];
  const kitsSorted = [];
  for (let name in names) {
    for (let kit in kits) {
      if (kits[kit]['name'] === names[name]) {
        kitsSorted.push(kits[kit])
      }
    }
  }

  return kitsSorted;
}
