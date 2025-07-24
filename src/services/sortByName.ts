export default function sortByName (kits) {
  const names = (kits[0].sport === "football")
    ? ['Home', 'Home alt', 'Away', 'Third', 'Fourth', 'Special']
    : ['Asociation', 'Icon','Statement', 'City', 'Classic', 'Special'];
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
