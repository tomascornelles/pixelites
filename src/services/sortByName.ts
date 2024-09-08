export default function sortByName (kits) {
  const names = ['Home', 'Home alt', 'Away', 'Third', 'Fourth', 'Special'];
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
