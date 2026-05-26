// by Danseo


import { Club, Match, CupMatch, League, NationalCup, CountryFederation } from "./clubsCompetitionsTools";
import { getClubsByCountry, getClubsByContinent } from "../../clubs/clubs.js";

const clubs = getClubsByCountry("England");
const clubsTest = clubs
console.log("Clubs in England -- ok ");

const d1Takes = clubsTest.slice(0, 18);
const d2Takes = clubsTest.slice(18, 36);
const d3Takes = clubsTest.slice(36, 54);

const instanceClubs = [];
let globalId = 1;

d1Takes.forEach(clubData => {
    instanceClubs.push(new Club(globalId++, clubData.name, clubData.country, clubData.continent, clubData.specs, clubData.stadium));
});

d2Takes.forEach(clubData => {
    instanceClubs.push(new Club(globalId++, clubData.name, clubData.country, clubData.continent, clubData.specs, clubData.stadium));
});

d3Takes.forEach(clubData => {
    instanceClubs.push(new Club(globalId++, clubData.name, clubData.country, clubData.continent, clubData.specs, clubData.stadium));
});

console.log("Instance Clubs -- ok ");

const mainCountryCompetitions = new CountryFederation(instanceClubs);

for (let i = 0; i < 1; i++) {
    mainCountryCompetitions.turnOnTheSeason();
}

console.log("Champions:");
console.log(mainCountryCompetitions.championsHistory);