// by Danseo

// Factory for creating league objects and providing tools to manage them

import { getClubsByContinent, getClubsByCountry } from "../../clubs/clubs.js";
import { Day, Calendar, Season, WorldTimeManager } from "../calendar/calendarManager.js";

class Club {
    constructor(id, name, country, continent, specs, stadium) {
        this.name = name;
        this.country = country;
        this.continent = continent;
        this.stadium = stadium
        this.specs = specs;
        this.id = id;

        this.matchesPlayed = 0;
        this.wins = 0;
        this.draws = 0;
        this.losses = 0;
        this.goalsFor = 0;
        this.goalsAgainst = 0;
        this.points = 0;
        this.goalDifference = this.goalsFor - this.goalsAgainst;

        this.championsMatchPlayed = 0;
        this.championsWins = 0;
        this.championsDraws = 0;
        this.championsLosses = 0;
        this.championsGoalsFor = 0;
        this.championsGoalsAgainst = 0;
        this.championsPoints = 0;
        this.championsGoalDifference = this.championsGoalsFor - this.championsGoalsAgainst;
    }


    resetStats() {
        this.matchesPlayed = 0;
        this.wins = 0;
        this.draws = 0;
        this.losses = 0;
        this.goalsFor = 0;
        this.goalsAgainst = 0;
        this.points = 0;

        this.championsMatchPlayed = 0;
        this.championsWins = 0;
        this.championsDraws = 0;
        this.championsLosses = 0;
        this.championsGoalsFor = 0;
        this.championsGoalsAgainst = 0;
        this.championsPoints = 0;
    }

    recordMatch(goalsFor, goalsAgainst) {
        this.matchesPlayed += 1;
        this.goalsFor += goalsFor;
        this.goalsAgainst += goalsAgainst;

        if (goalsFor > goalsAgainst) {
            this.wins += 1;
            this.points += 3;
        } else if (goalsFor < goalsAgainst) {
            this.losses += 1;
        } else {
            this.draws += 1;
            this.points += 1;
        }
    }

    recordMatchChampions(championsGoalsFor, championGoalsAgainst) {
        this.championsMatchPlayed += 1;
        this.championsGoalsFor += championsGoalsFor;
        this.championsGoalsAgainst += championGoalsAgainst;

        if (championsGoalsFor > championGoalsAgainst) {
            this.championsWins += 1;
            this.championsPoints += 3;
        } else if (championsGoalsFor < championGoalsAgainst) {
            this.championsLosses += 1;
        } else {
            this.championsDraws += 1;
            this.championsPoints += 1;
        }

        this.championsGoalDifference = this.championsGoalsFor - this.championsGoalsAgainst;
    }
}

class Match {
    constructor(homeClub, awayClub) {
        this.homeClub = homeClub;
        this.awayClub = awayClub;
        this.homeGoals = null;
        this.awayGoals = null;
        this.played = false;
        this.dayScheduled = null; // Jour du calendrier (1-366)
        this.matchday = null; // Numéro de la journée
        this.competitionType = "championship"; // championship, cup, continental
    }

    simulateMatch() {
        const teamA = this.homeClub;
        const teamB = this.awayClub;

        let teamAScore = 0;
        let teamBScore = 0;

        let allChances = teamA.specs.reputation + teamB.specs.reputation + 8;
        let rangeA = Math.ceil(teamA.specs.OVR / 2);
        let rangeB = Math.floor(teamB.specs.OVR / 2);
        let rest = 100 - (rangeA + rangeB);

        for (let i = 0; i < allChances; i++) {
            const random = Math.floor(Math.random() * 100);

            if (random >= 0 && random <= rangeA) {
                teamAScore += goalAttempt(teamA, teamB)
            }
            else if (random > rangeA && random <= rangeA + rangeB) {
                goalAttemptContest(teamA, teamB);
            }
            else {
                teamBScore += goalAttempt(teamB, teamA);
            }
        }

        this.homeGoals = teamAScore;
        this.awayGoals = teamBScore;
        this.played = true;

        teamA.recordMatch(teamAScore, teamBScore);
        teamB.recordMatch(teamBScore, teamAScore);

        function goalAttempt(team, opponent) {
            const teamAttack = team.specs.attack
            const teamMidfield = team.specs.midfield
            const teamDefense = team.specs.defense
            const opponentAttack = opponent.specs.attack
            const opponentMidfield = opponent.specs.midfield
            const opponentDefense = opponent.specs.defense

            let scoreProbability = 20;

            if (teamAttack > opponentDefense) scoreProbability += 5;
            if (teamMidfield > opponentMidfield) scoreProbability += 3;
            if (teamDefense > opponentAttack) scoreProbability += 2;

            if (teamAttack === opponentDefense) scoreProbability += 3;
            if (teamMidfield === opponentMidfield) scoreProbability += 2;
            if (teamDefense === opponentAttack) scoreProbability += 1;

            if (teamAttack < opponentDefense) scoreProbability -= 6;
            if (teamMidfield < opponentMidfield) scoreProbability -= 3;
            if (teamDefense < opponentAttack) scoreProbability -= 3;

            const random = Math.floor(Math.random() * 100);

            return random < scoreProbability ? 1 : 0;
        }

        function goalAttemptContest(teamA, teamB) {
            // just a simple randomiser to allow the goalAttempt function to one of 2 teams
            const random = Math.floor(Math.random() * 100);

            if (random <= 30) {
                teamAScore += goalAttempt(teamA, teamB);
            }
            else if (random > 30 && random <= 70) {
                return; //
            }
            else {
                teamBScore += goalAttempt(teamB, teamA);
            }
        }


    }


}

class CupMatch extends Match {
    constructor(homeClub, awayClub) {
        super(homeClub, awayClub);
        this.penaltiesWinner = null;
        this.penaltiesScoreHomeClub = null;
        this.penaltiesScoreAwayClub = null;
    }

    simulateMatch() {
        const teamA = this.homeClub;
        const teamB = this.awayClub;

        let teamAScore = 0;
        let teamBScore = 0;

        let randomFactor = Math.floor(Math.random() * 10) + 1; // Random factor between 1 and 10

        let allChances = randomFactor + 8;
        let rangeA = Math.ceil(teamA.specs.OVR / 2);
        let rangeB = Math.floor(teamB.specs.OVR / 2);
        let rest = 100 - (rangeA + rangeB);

        for (let i = 0; i < allChances; i++) {
            const random = Math.floor(Math.random() * 100);

            if (random >= 0 && random <= rangeA) {
                teamAScore += goalAttempt(teamA, teamB)
            }
            else if (random > rangeA && random <= rangeA + rangeB) {
                goalAttemptContest(teamA, teamB);
            }
            else {
                teamBScore += goalAttempt(teamB, teamA);
            }
        }

        this.homeGoals = teamAScore;
        this.awayGoals = teamBScore;

        if (this.homeGoals === this.awayGoals) {
            this.penaltiesScoreHomeClub = Math.floor(Math.random() * 5) + 3;
            this.penaltiesScoreAwayClub = Math.floor(Math.random() * 5) + 3;
            while (this.penaltiesScoreHomeClub === this.penaltiesScoreAwayClub) {
                this.penaltiesScoreHomeClub = Math.floor(Math.random() * 5) + 3;
            }
            this.penaltiesWinner = this.penaltiesScoreHomeClub > this.penaltiesScoreAwayClub ? this.homeClub : this.awayClub;
        }

        this.played = true;

        function goalAttempt(team, opponent) {
            const teamAttack = team.specs.attack
            const teamMidfield = team.specs.midfield
            const teamDefense = team.specs.defense
            const opponentAttack = opponent.specs.attack
            const opponentMidfield = opponent.specs.midfield
            const opponentDefense = opponent.specs.defense

            let scoreProbability = 20;

            if (teamAttack > opponentDefense) scoreProbability += 5;
            if (teamMidfield > opponentMidfield) scoreProbability += 3;
            if (teamDefense > opponentAttack) scoreProbability += 2;

            if (teamAttack === opponentDefense) scoreProbability += 3;
            if (teamMidfield === opponentMidfield) scoreProbability += 2;
            if (teamDefense === opponentAttack) scoreProbability += 1;

            if (teamAttack < opponentDefense) scoreProbability -= 6;
            if (teamMidfield < opponentMidfield) scoreProbability -= 3;
            if (teamDefense < opponentAttack) scoreProbability -= 3;

            const random = Math.floor(Math.random() * 100);

            return random < scoreProbability ? 1 : 0;
        }

        function goalAttemptContest(teamA, teamB) {
            // just a simple randomiser to allow the goalAttempt function to one of 2 teams
            const random = Math.floor(Math.random() * 100);

            if (random <= 30) {
                teamAScore += goalAttempt(teamA, teamB);
            }
            else if (random > 30 && random <= 70) {
                return; //
            }
            else {
                teamBScore += goalAttempt(teamB, teamA);
            }
        }


    }


    claimMatchWinner() {
        if (!this.played) return null;

        if (this.homeGoals > this.awayGoals) {
            return this.homeClub;
        } else if (this.homeGoals < this.awayGoals) {
            return this.awayClub;
        } else {
            return this.penaltiesWinner;
        }
    }

    textMessageResult() {
        if (!this.played) return "Match not played yet.";

        return `${this.equipeDomicile.nom} ${this.scoreDomicile}-${this.scoreExterieur} ${this.equipeExterieur.nom} (${this.scoreTabDomicile} - ${this.scoreTabExterieur} 
                t.a.b, vainqueur: ${this.obtenirVainqueur().nom})`;
    }

}



class League {
    constructor(name, country, continent, clubs) {
        this.name = name;
        this.country = country;
        this.matchdays = []; // Array of matchdays
        this.currentMatchday = 0;
        this.c1Slots = [];
        this.c2Slots = [];
        this.type = "championship";
    }

    /**
     * Génère le calendrier et organise les matchs par journées
     */
    generateCalendar() {
        this.calendar = [];
        const n = this.clubs.length;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    this.calendar.push(new Match(this.clubs[i], this.clubs[j]));
                }
            }
        }

        // Organiser les matchs par journées
        this.organizeMatchdays();
    }

    /**
     * Organise les matchs en journées
     */
    organizeMatchdays() {
        const n = this.clubs.length;
        const totalRounds = n - 1; // Nombre de journées
        const matchesPerRound = n / 2;

        // Créer un array de journées
        this.matchdays = Array.from({ length: totalRounds }, () => []);

        let matchIndex = 0;
        for (let day = 0; day < totalRounds; day++) {
            for (let match = 0; match < matchesPerRound; match++) {
                if (matchIndex < this.calendar.length) {
                    this.calendar[matchIndex].matchday = day + 1;
                    this.matchdays[day].push(this.calendar[matchIndex]);
                    matchIndex++;
                }
            }
        }
    }

    /**
     * Assigne les matchs au calendrier de saison
     */
    assignToSeasonCalendar(season) {
        season.assignMatchesToCalendar(this, this.calendar);
        console.log(`${this.name}: ${this.calendar.length} matchs assignés au calendrier`);
    }

    simulateLeague() {
        this.generateCalendar();
        this.calendar.forEach(match => match.simulateMatch());

        // show all matches results
        this.calendar.forEach(match => {
            console.log(`${match.homeClub.name} ${match.homeGoals} - ${match.awayGoals} ${match.awayClub.name}`);
        });
    }

    claimLeagueRanking() {
        return [...this.clubs].sort((a, b) => {
            // Primary: Sort by points (descending)
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            // Secondary: Sort by goal difference (descending)
            if (b.goalDifference !== a.goalDifference) {
                return b.goalDifference - a.goalDifference;
            }
            // Tertiary: Sort by goals scored (descending)
            if (b.goalsFor !== a.goalsFor) {
                return b.goalsFor - a.goalsFor;
            }
            // Final tiebreaker: Sort by wins (descending)
            return b.wins - a.wins;
        });
    }

    /**
     * Retourne les matchs d'une journée spécifique
     */
    getMatchdayMatches(matchdayNumber) {
        if (matchdayNumber < 1 || matchdayNumber > this.matchdays.length) {
            return [];
        }
        return this.matchdays[matchdayNumber - 1];
    }
}

class NationalCup {
    constructor(name, country, continent, clubs) {
        this.name = name;
        this.country = country;
        this.continent = continent;
        this.clubs = clubs;
        this.calendar = [];
        this.type = "nationalCup";
    }

    drawClubsCup(teams) {
        return [...teams].sort(() => Math.random() - 0.5);
    }

    /**
     * Assigne les matchs de coupe au calendrier de saison
     */
    assignToSeasonCalendar(season) {
        season.assignMatchesToCalendar(this, this.calendar);
        console.log(`${this.name}: ${this.calendar.length} matchs assignés au calendrier`);
    }

    simulateCup(exemptedClubs) {
        console.log(`Starting ${this.name.toUpperCase()} simulation with ${this.clubs.length} clubs...`);

        const notExemptedClubs = this.clubs.filter(club => !exemptedClubs.includes(club));

        console.log("Round 1");

        const drawRound1 = this.drawClubsCup(notExemptedClubs);
        const winnersRound1 = [];

        for (let i = 0; i < drawRound1.length; i += 2) {
            const match = new CupMatch(drawRound1[i], drawRound1[i + 1]);
            match.simulateMatch();
            winnersRound1.push(match.claimMatchWinner());
            // console.log(`Match: ${match.homeClub.name} vs ${match.awayClub.name} - Winner: ${match.claimMatchWinner().name}`);
        }
        console.log("Round 1 --- Finished");

        console.log(" Round 2 --- top 10 incomes !!!!!! ");
        const drawRound2 = this.drawClubsCup([...winnersRound1, ...exemptedClubs]);
        const winnersRound2 = [];

        for (let i = 0; i < drawRound2.length; i += 2) {
            const match = new CupMatch(drawRound2[i], drawRound2[i + 1]);
            match.simulateMatch();
            winnersRound2.push(match.claimMatchWinner());
            // console.log(`Match: ${match.homeClub.name} vs ${match.awayClub.name} - Winner: ${match.claimMatchWinner().name}`);
        }
        console.log("Round 2 --- Finished");

        console.log("Round of 16");
        const drawRoundOf16 = this.drawClubsCup(winnersRound2);
        const winnersRoundOf16 = [];

        for (let i = 0; i < drawRoundOf16.length; i += 2) {
            const match = new CupMatch(drawRoundOf16[i], drawRoundOf16[i + 1]);
            match.simulateMatch();
            winnersRoundOf16.push(match.claimMatchWinner());
            // console.log(`Match: ${match.homeClub.name} vs ${match.awayClub.name} - Winner: ${match.claimMatchWinner().name}`);
        }
        console.log("Round of 16 --- Finished");

        console.log("Quarterfinals");
        const drawQuarterfinals = this.drawClubsCup(winnersRoundOf16);
        const winnersQuarterfinals = [];

        for (let i = 0; i < drawQuarterfinals.length; i += 2) {
            const match = new CupMatch(drawQuarterfinals[i], drawQuarterfinals[i + 1]);
            match.simulateMatch();
            winnersQuarterfinals.push(match.claimMatchWinner());
            // console.log(`Match: ${match.homeClub.name} vs ${match.awayClub.name} - Winner: ${match.claimMatchWinner().name}`);
        }
        console.log("Quarterfinals --- Finished");

        console.log("Semifinals");
        const drawSemifinals = this.drawClubsCup(winnersQuarterfinals);
        const winnersSemifinals = [];

        for (let i = 0; i < drawSemifinals.length; i += 2) {
            const match = new CupMatch(drawSemifinals[i], drawSemifinals[i + 1]);
            match.simulateMatch();
            winnersSemifinals.push(match.claimMatchWinner());
            // console.log(`Match: ${match.homeClub.name} vs ${match.awayClub.name} - Winner: ${match.claimMatchWinner().name}`);
        }
        console.log("Semifinals --- Finished");

        console.log("Final");
        const finalMatch = new CupMatch(winnersSemifinals[0], winnersSemifinals[1]);
        finalMatch.simulateMatch();
        const cupWinner = finalMatch.claimMatchWinner();
        console.log(`Final Match: ${finalMatch.homeClub.name} vs ${finalMatch.awayClub.name} - Winner: ${cupWinner.name}`);
        console.log("Final --- Finished");
    }
}

class CountryFederation {
    constructor(clubs) {
        this.clubs = clubs;
        this.mainSeason = 1;
        this.championsHistory = [];
        this.cupChampion = [];
        this.season = null;
        this.timeManager = new WorldTimeManager();
    }

    /**
     * Initialise une nouvelle saison
     */
    initSeason(seasonNumber) {
        this.season = this.timeManager.createSeason(seasonNumber);
        this.mainSeason = seasonNumber;
        return this.season;
    }

    /**
     * Joueur passe au jour suivant
     * C'est L'ACTION PRINCIPALE du joueur pour faire avancer le temps
     */
    playerPassDay() {
        const nextDay = this.timeManager.playerPassDay();
        if (nextDay) {
            console.log(`\n>>> Jour ${nextDay.dayNumber}: ${nextDay.dayName} ${nextDay.dayInMonth} ${nextDay.monthName}`);
            const todayMatches = this.timeManager.getTodayMatches();
            if (todayMatches.length > 0) {
                console.log(`📅 ${todayMatches.length} match(s) prévus aujourd'hui!`);
                return todayMatches;
            }
        }
        return [];
    }

    turnOnTheSeason() {
        console.log(`\n=============================================`);
        console.log(`   SAISON N°${this.mainSeason}`);
        console.log(`=============================================`);

        // Initialiser la saison
        const season = this.initSeason(this.mainSeason);

        this.clubs.forEach(club => club.resetStats());

        const clubsD1 = this.clubs.slice(0, 18);
        const clubsD2 = this.clubs.slice(18, 36);
        const clubsD3 = this.clubs.slice(36, 54);

        // Créer les ligues
        const d1 = new League("Division 1", clubsD1[0].country, clubsD1[0].continent, clubsD1);
        const d2 = new League("Division 2", clubsD2[0].country, clubsD2[0].continent, clubsD2);
        const d3 = new League("Division 3", clubsD3[0].country, clubsD3[0].continent, clubsD3);

        // Générer les calendriers des ligues
        d1.generateCalendar();
        d2.generateCalendar();
        d3.generateCalendar();

        // Assigner les matchs au calendrier de saison
        d1.assignToSeasonCalendar(season);
        d2.assignToSeasonCalendar(season);
        d3.assignToSeasonCalendar(season);

        // Simuler les matchs (en production, les matchs se joueront au fil du temps)
        d1.simulateLeague();
        const d1Ranking = d1.claimLeagueRanking();
        console.log(d1Ranking)
        this.championsHistory.push(d1Ranking[0].name);
        console.log(`Champion de ${d1.country} - ${d1.name}: ${d1Ranking[0].name}`);

        d2.simulateLeague();
        const d2Ranking = d2.claimLeagueRanking();
        console.log(`Champion de ${d2.country} - ${d2.name}: ${d2Ranking[0].name}`);

        d3.simulateLeague();
        const d3Ranking = d3.claimLeagueRanking();
        console.log(`Champion de ${d3.country} - ${d3.name}: ${d3Ranking[0].name}`);

        const exempteds = d1Ranking.slice(0, 10);
        const nationalCup = new NationalCup("Coupe Nationale", d1.country, d1.continent, this.clubs);
        nationalCup.simulateCup(exempteds);
        // nationalCup.assignToSeasonCalendar(season);

        this.promotionsManager(d1Ranking, d2Ranking, d3Ranking);

        this.mainSeason++;
    }

    promotionsManager(d1Ranking, d2Ranking, d3Ranking) {
        // -- division 1 --
        const d1Saves = d1Ranking.slice(0, 15);
        const d1Relegated = d1Ranking.slice(15, 18);

        // -- division 2 --
        const d2Promoted = d2Ranking.slice(0, 3);
        const d2Saves = d2Ranking.slice(3, 15);
        const d2Relegated = d2Ranking.slice(15, 18);

        // -- division 3 --
        const d3Promoted = d3Ranking.slice(0, 3);
        const d3Saves = d3Ranking.slice(3);

        // -- update clubs for next season --
        const newD1Clubs = [...d1Saves, ...d2Promoted];
        const newD2Clubs = [...d2Saves, ...d1Relegated, ...d3Promoted];
        const newD3Clubs = [...d3Saves, ...d2Relegated];

        this.clubs = [...newD1Clubs, ...newD2Clubs, ...newD3Clubs];
    }

    /**
     * Affiche l'état du monde
     */
    displayWorldStatus() {
        this.timeManager.displayWorldStatus();
    }
}

// Exporting the classes for use in other modules
export { Club, Match, CupMatch, League, NationalCup, CountryFederation };
