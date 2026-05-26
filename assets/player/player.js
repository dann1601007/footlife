// Structure of the player object

export const playerBase = {
    identity: {
        firstName: "Paulo",
        lastName: "Nima",
        age: 16,
        country: "Brasil",
        mainPosition: "AM",
    },

    currentSeason: {
        club: "Brentford FC",
        appearances: 0,
        goals: 0,
        assists: 0,
        ratingMid: 0,
        yellowCard: 0,
        redCard: 0,
        injuries: 0,
    },

    attributes: {
        OVR: 0,
        PAC: 0, SHO: 0, DRI: 0,
        PAS: 0, PHY: 0, DEF: 0,
        GK: 0,
    },

    abilities: {
        pace: { velocity: 0, acceleration: 0 },
        shooting: { finishing: 0, longShot: 0, volley: 0, penalty: 0, FreeKick: 0 },
        dribbling: { agility: 0, balance: 0, ballDriving: 0, ballControl: 0, dribbling: 0 },
        passing: { vision: 0, crossing: 0, shortPassing: 0, longPassing: 0, calm: 0 },
        physicality: { strength: 0, stamina: 0, jumping: 0, reactivity: 0 },
        defending: { marking: 0, standingTackle: 0, slidingTackle: 0, aggressivity: 0, interceptions: 0 },
        goalkeeping: { diving: 0, handling: 0, kicking: 0, reflexes: 0, positioning: 0 },
    },

    relationships: {
        club: 0,
        fans: 0,
        teammates: 0,
        coach: 0,
        clubBoard: 0,
        Followers: 0,
        family: 0,
        friends: 0,
        lover: 0,
    },

    contracts: {
        current: {
            club: "Brentford FC",
            salary: 0,
            bonuses: { goalBonus: 0, assistBonus: 0, appearanceBonus: 0, cleanSheetBonus: 0, captainBonus: 0 },
            duration: 0, // in years
        },

        depenses: {
            agentFee: 0,
            communityManagement: 0,
            personalTrainer: 0,
            nutritionist: 0,
            physiotherapist: 0,
            marketing: 0,
            legal: 0,
            doctor: 0,
        },
    },

    career: {
        history: [
            { season: "2023/2024", club: "Brentford FC", appearances: 0, goals: 0, assists: 0, ratingMid: 0 },
            // etc....
        ],

        trophies: [
            { cups: "2022, 2025," }
            // also .....
        ],

        milestones: [
            { milestone: "First Professional Contract", date: "2023-07-01" },
            { milestone: "First Team Debut", date: "2023-08-15" },
            // etc....
        ],

        popularity: {
            level: 0,
            status: "Unknown",
        },

        allStats: {
            totalAppearances: 0,
            totalGoals: 0,
            totalAssists: 0,
            totalRatingMid: 0,
            totalCleanSheets: 0,
        },
    },

    internationalCareer: {
        country: "Brasil",
        appearances: 0,
        goals: 0,
        assists: 0,
        ratingMid: 0,
    },

    inventory: {
        money: 0,
        items: [
            { name: "Car", type: "Luxury", value: 0 },
            { name: "House", type: "Real Estate", value: 0 },
            { name: "Watch", type: "Accessory", value: 0 },
            // etc....
        ],

        EXPs: 0,
    },

    sponsorings: [
        { name: "Nike", type: "Sportswear", value: 0, paymentStyle: "one-time" },
        { name: "Adidas", type: "Sportswear", value: 0, paymentStyle: "recurring", duration: 12 }, // duration in months for recurring payments
        { name: "Puma", type: "Sportswear", value: 0, paymentStyle: "one-time", },
        // etc....
    ]
}

console.log("Player base structure loaded.");
console.log(playerBase);