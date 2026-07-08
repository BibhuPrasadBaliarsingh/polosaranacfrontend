// @ts-nocheck
export const buildWardPayload = (ward) => ({
  wardName: ward.wardName,
  area: Number(ward.area),
  population: Number(ward.population),
  household: Number(ward.household),
  wasteGenerationPerDay: Number(ward.wasteGenerationPerDay),
  collectionFrequency: ward.collectionFrequency,
  supervisorName: ward.supervisorName,
  supervisorPhone: ward.supervisorPhone,
  centerLat: Number(ward.centerLat),
  centerLng: Number(ward.centerLng),
  radius: Number(ward.radius),
});
