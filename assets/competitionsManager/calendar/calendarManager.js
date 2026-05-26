// Calendar and Season Management System
// Danseo - Système complet de gestion du calendrier et des saisons

/**
 * Classe pour gérer un jour spécifique dans le calendrier
 */
class Day {
    constructor(dayNumber, dayName, monthNumber, monthName) {
        this.dayNumber = dayNumber;
        this.dayName = dayName; // jour de la semaine
        this.monthNumber = monthNumber;
        this.monthName = monthName;
        this.matches = []; // Matchs prévus ce jour
        this.isMatchday = false;
    }

    addMatch(match) {
        this.matches.push(match);
        this.isMatchday = true;
    }

    getMatchCount() {
        return this.matches.length;
    }
}

/**
 * Classe pour gérer le calendrier complet (366 jours)
 */
class Calendar {
    constructor() {
        this.days = [];
        this.dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        this.monthNames = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        this.monthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // Année bissextile (366 jours)
        
        this.generateCalendar();
    }

    /**
     * Génère le calendrier complet avec 366 jours
     */
    generateCalendar() {
        let dayCounter = 1;
        let dayOfWeekIndex = 0; // Commence par Lundi

        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            for (let dayInMonth = 1; dayInMonth <= this.monthDays[monthIndex]; dayInMonth++) {
                const day = new Day(
                    dayCounter,
                    this.dayNames[dayOfWeekIndex % 7],
                    monthIndex + 1,
                    this.monthNames[monthIndex]
                );
                this.days.push(day);
                dayCounter++;
                dayOfWeekIndex++;
            }
        }
    }

    /**
     * Récupère un jour par son numéro (1-366)
     */
    getDay(dayNumber) {
        if (dayNumber < 1 || dayNumber > 366) {
            console.warn(`Jour invalide: ${dayNumber}. Plage valide: 1-366`);
            return null;
        }
        return this.days[dayNumber - 1];
    }

    /**
     * Récupère les jours d'un mois spécifique
     */
    getDaysOfMonth(monthNumber) {
        return this.days.filter(day => day.monthNumber === monthNumber);
    }

    /**
     * Assigned un match à un jour spécifique
     */
    assignMatchToDay(dayNumber, match) {
        const day = this.getDay(dayNumber);
        if (day) {
            day.addMatch(match);
            match.dayScheduled = dayNumber;
        }
    }

    /**
     * Récupère tous les matchdays (jours avec des matchs)
     */
    getMatchdays() {
        return this.days.filter(day => day.isMatchday);
    }

    /**
     * Affiche le calendrier pour déboguer
     */
    displayCalendar() {
        this.days.forEach(day => {
            if (day.isMatchday) {
                console.log(`Jour ${day.dayNumber}: ${day.dayName} ${day.dayInMonth} ${day.monthName} - ${day.getMatchCount()} match(s)`);
            }
        });
    }
}

/**
 * Classe pour gérer une saison complète (janvier à décembre)
 */
class Season {
    constructor(seasonNumber) {
        this.seasonNumber = seasonNumber;
        this.startDay = 1;
        this.endDay = 366;
        this.currentDay = 1;
        
        // Périodes de compétition
        this.championship_start = 33;  // Début février (33e jour)
        this.championship_end = 304;   // Fin octobre
        
        this.nationalCup_start = 33;
        this.nationalCup_end = 304;
        
        this.continentalCup_start = 33;
        this.continentalCup_end = 304;
        
        this.status = "planning"; // planning, ongoing, finished
        this.calendar = new Calendar();
        this.leagues = [];
        this.nationalCup = null;
        this.continentalCups = [];
    }

    /**
     * Définit la période d'une compétition
     */
    setCompetitionPeriod(competitionType, startDay, endDay) {
        if (competitionType === "championship") {
            this.championship_start = startDay;
            this.championship_end = endDay;
        } else if (competitionType === "nationalCup") {
            this.nationalCup_start = startDay;
            this.nationalCup_end = endDay;
        } else if (competitionType === "continentalCup") {
            this.continentalCup_start = startDay;
            this.continentalCup_end = endDay;
        }
    }

    /**
     * Vérifie si un jour est durant une période de compétition
     */
    isCompetitionDay(dayNumber, competitionType) {
        if (competitionType === "championship") {
            return dayNumber >= this.championship_start && dayNumber <= this.championship_end;
        } else if (competitionType === "nationalCup") {
            return dayNumber >= this.nationalCup_start && dayNumber <= this.nationalCup_end;
        } else if (competitionType === "continentalCup") {
            return dayNumber >= this.continentalCup_start && dayNumber <= this.continentalCup_end;
        }
        return false;
    }

    /**
     * Avance d'un jour dans la saison
     * C'est l'action du joueur qui fait avancer le temps
     */
    nextDay() {
        if (this.currentDay < this.endDay) {
            this.currentDay++;
            return this.calendar.getDay(this.currentDay);
        } else {
            this.status = "finished";
            console.log(`Saison ${this.seasonNumber} terminée!`);
            return null;
        }
    }

    /**
     * Récupère le jour actuel de la saison
     */
    getCurrentDay() {
        return this.calendar.getDay(this.currentDay);
    }

    /**
     * Récupère les matchs prévus pour le jour actuel
     */
    getTodayMatches() {
        const today = this.getCurrentDay();
        return today ? today.matches : [];
    }

    /**
     * Récupère les matchs d'une journée spécifique
     */
    getMatchesForDay(dayNumber) {
        const day = this.calendar.getDay(dayNumber);
        return day ? day.matches : [];
    }

    /**
     * Attribue les matchs du calendrier pour une compétition
     */
    assignMatchesToCalendar(competition, matches) {
        if (!matches || matches.length === 0) return;

        let dayIndex = 0;
        const competitionType = competition.type || "championship";
        
        // Récupère les jours valides pour cette compétition
        const validDays = [];
        for (let day = 1; day <= 366; day++) {
            if (this.isCompetitionDay(day, competitionType)) {
                // Ne planifier que les jours de semaine ou week-end selon la logique
                const dayOfWeek = this.calendar.getDay(day);
                if (dayOfWeek && (!dayOfWeek.dayName.includes("Jeudi") || Math.random() > 0.5)) {
                    validDays.push(day);
                }
            }
        }

        // Distribute les matchs sur les jours valides
        matches.forEach((match, index) => {
            if (validDays.length > 0) {
                const dayToAssign = validDays[index % validDays.length];
                this.calendar.assignMatchToDay(dayToAssign, match);
            }
        });
    }

    /**
     * Affiche le résumé de la saison
     */
    displaySeasonInfo() {
        console.log(`\n=== SAISON ${this.seasonNumber} ===`);
        console.log(`Jour actuel: ${this.currentDay}/366`);
        console.log(`État: ${this.status}`);
        console.log(`Championnats: Jour ${this.championship_start} au ${this.championship_end}`);
        console.log(`Coupe Nationale: Jour ${this.nationalCup_start} au ${this.nationalCup_end}`);
        console.log(`Coupes Continentales: Jour ${this.continentalCup_start} au ${this.continentalCup_end}`);
        const today = this.getCurrentDay();
        if (today) {
            console.log(`\nAujourd'hui: ${today.dayName} ${today.monthName}`);
            console.log(`Matchs prévus: ${today.getMatchCount()}`);
        }
    }
}

/**
 * Classe pour gérer la progression du temps du monde
 */
class WorldTimeManager {
    constructor() {
        this.currentSeason = null;
        this.seasonsHistory = [];
        this.isPaused = false;
    }

    /**
     * Crée une nouvelle saison
     */
    createSeason(seasonNumber) {
        this.currentSeason = new Season(seasonNumber);
        this.currentSeason.status = "ongoing";
        return this.currentSeason;
    }

    /**
     * Le joueur passe au jour suivant
     * Ceci est l'action principale du joueur pour faire avancer le temps
     */
    playerPassDay() {
        if (!this.currentSeason || this.currentSeason.status === "finished") {
            console.warn("Aucune saison en cours ou saison terminée");
            return null;
        }

        const nextDay = this.currentSeason.nextDay();
        if (nextDay === null) {
            // Saison terminée
            this.seasonsHistory.push(this.currentSeason);
            console.log(`Saison ${this.currentSeason.seasonNumber} archivée`);
        }
        return nextDay;
    }

    /**
     * Récupère le jour actuel du monde
     */
    getCurrentDay() {
        return this.currentSeason ? this.currentSeason.getCurrentDay() : null;
    }

    /**
     * Récupère les matchs d'aujourd'hui
     */
    getTodayMatches() {
        return this.currentSeason ? this.currentSeason.getTodayMatches() : [];
    }

    /**
     * Affiche les informations du monde
     */
    displayWorldStatus() {
        if (this.currentSeason) {
            this.currentSeason.displaySeasonInfo();
        }
    }
}

// Export des classes
export { Day, Calendar, Season, WorldTimeManager };
