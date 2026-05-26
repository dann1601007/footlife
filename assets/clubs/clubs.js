// by Danseo
// Factory for creating club objects

import clubsData from "../data/clubs.json";

const allClubs = clubsData

console.log("Clubs data loaded:", allClubs);

const clubsByCountry = Object.groupBy(allClubs, club => club.country);
const clubsByContinent = Object.groupBy(allClubs, club => club.continent);

console.log("Clubs grouped by country:", clubsByCountry);
console.log("Clubs grouped by continent:", clubsByContinent);

// Function to get clubs by country
export function getClubsByCountry(country) {
    return clubsByCountry[country] || [];
}

// Function to get clubs by continent
export function getClubsByContinent(continent) {
    return clubsByContinent[continent] || [];
}

// Function to get all clubs
export function getAllClubs() {
    return allClubs;
}

// Europe 
//       ---- Continent ---
const clubsEurope = getClubsByContinent("Europe");
//       ---- Countries ----
export const clubsEngland = getClubsByCountry("England");
export const clubsSpain = getClubsByCountry("Spain");
export const clubsGermany = getClubsByCountry("Germany");
export const clubsItaly = getClubsByCountry("Italy");
export const clubsFrance = getClubsByCountry("France");
export const clubsPortugal = getClubsByCountry("Portugal");
export const clubsNetherlands = getClubsByCountry("Netherlands");
export const clubsTurkey = getClubsByCountry("Turkey");

// America (whole)
export const clubsAmerica = getClubsByContinent("America");
//       ---- Countries ----
export const clubsUSA = getClubsByCountry("USA");
export const clubsBrazil = getClubsByCountry("Brazil");
export const clubsArgentina = getClubsByCountry("Argentina");
export const clubsMexico = getClubsByCountry("Mexico");
export const clubsColombia = getClubsByCountry("Colombia");
export const clubsChile = getClubsByCountry("Chile");
export const clubsCanada = getClubsByCountry("Canada");
export const clubsUruguay = getClubsByCountry("Uruguay");

// Asia
export const clubsAsia = getClubsByContinent("Asia");
//       ---- Countries ----
export const clubsJapan = getClubsByCountry("Japan");
export const clubsChina = getClubsByCountry("China");
export const clubsSouthKorea = getClubsByCountry("South Korea");
export const clubsSaudiArabia = getClubsByCountry("Saudi Arabia");
export const clubsQatar = getClubsByCountry("Qatar");
export const clubsIran = getClubsByCountry("Iran");
export const clubsRussia = getClubsByCountry("Russia");
export const clubsAustralia = getClubsByCountry("Australia");

// Africa
export const clubsAfrica = getClubsByContinent("Africa");
//       ---- Countries ----
export const clubsEgypt = getClubsByCountry("Egypt");
export const clubsSouthAfrica = getClubsByCountry("South Africa");
export const clubsCongoDRC = getClubsByCountry("Congo DRC");
export const clubsMorocco = getClubsByCountry("Morocco");
export const clubsTunisia = getClubsByCountry("Tunisia");
export const clubsAlgeria = getClubsByCountry("Algeria");
export const clubsTanzania = getClubsByCountry("Tanzania");
export const clubsIvoryCoast = getClubsByCountry("Ivory Coast");

