import { getKits } from "@api/loadData";
import sortByYear from "@services/sortByYear";
import sortByName from "@services/sortByName";

// export default function getLayers(teamId):any[] {
export const getLayers = async (layers) => {
  let kits = [];
  console.log('layers kits', layers)
  for (let layer in layers) {
    const schema = {
      name: layers[layer]['name'],
      year: layers[layer]['year'],
      jersey: layers[layer]['jersey'],
      pants: layers[layer]['pants'],
      socks: layers[layer]['socks'],
      layer1: [layers[layer]['layer1'], layers[layer]['layer1Color']],
      layer2: [layers[layer]['layer2'], layers[layer]['layer2Color']],
      layer3: [layers[layer]['layer3'], layers[layer]['layer3Color']],
    }
    kits.push(schema)
  }

  kits = sortByName(kits);
  console.log('kits', kits);
  return kits;
}
