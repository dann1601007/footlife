// by Danseo
// Factory for creating player objects

import { playerBase } from "./player.js";

const positionsOvrCoefficients = {
    "GK": { pace: 0.03, shooting: 0.03, dribbling: 0.04, passing: 0.15, physicality: 0.10, defending: 0.10, goalkeeping: 0.55 },
    "FB": { pace: 0.30, shooting: 0.07, dribbling: 0.10, passing: 0.10, physicality: 0.15, defending: 0.25, goalkeeping: 0.03 },
    "CB": { pace: 0.10, shooting: 0.07, dribbling: 0.08, passing: 0.15, physicality: 0.25, defending: 0.30, goalkeeping: 0.05 },
    "DM": { pace: 0.10, shooting: 0.10, dribbling: 0.07, passing: 0.30, physicality: 0.15, defending: 0.25, goalkeeping: 0.03 },
    "CM": { pace: 0.10, shooting: 0.10, dribbling: 0.08, passing: 0.35, physicality: 0.2, defending: 0.15, goalkeeping: 0.02 },
    "AM": { pace: 0.15, shooting: 0.25, dribbling: 0.20, passing: 0.25, physicality: 0.06, defending: 0.08, goalkeeping: 0.01 },
    "WI": { pace: 0.30, shooting: 0.15, dribbling: 0.25, passing: 0.15, physicality: 0.08, defending: 0.06, goalkeeping: 0.01 },
    "ST": { pace: 0.2, shooting: 0.30, dribbling: 0.15, passing: 0.10, physicality: 0.20, defending: 0.03, goalkeeping: 0.02 },
};

const numberInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const midPoints = (obj) => {
    const values = Object.values(obj);
    return values.length === 0 ? 0 : Math.round(values.reduce((a, v) => a + v, 0) / values.length);
};

function allocateAbilityPoints(player) {
    const coefficients = positionsOvrCoefficients[player.identity.mainPosition];
    
    Object.entries(player.abilities).forEach(([ability, subAbilities]) => {
        Object.keys(subAbilities).forEach(subAbility => {
            let points = numberInRange(40, 55);
            const coef = coefficients[ability];
            
            if (coef >= 0.25) points += numberInRange(10, 20);
            else if (coef >= 0.15) points += numberInRange(5, 10);
            else if (coef > 0.05) points += numberInRange(-5, 5);
            else points += numberInRange(-40, -20);
            
            player.abilities[ability][subAbility] = points;
        });
    });
    
    return player;
}

function calculateOVR(player) {
    const coefficients = positionsOvrCoefficients[player.identity.mainPosition];
    return Object.entries(coefficients).reduce((ovr, [ability, coef]) => {
        return ovr + (midPoints(player.abilities[ability]) * coef);
    }, 0);
}

function createPlayer(basePlayer = playerBase) {
    const player = JSON.parse(JSON.stringify(basePlayer)); // Deep clone
    allocateAbilityPoints(player);
    
    player.attributes.OVR = Math.round(calculateOVR(player));
    player.attributes.PAC = midPoints(player.abilities.pace);
    player.attributes.SHO = midPoints(player.abilities.shooting);
    player.attributes.DRI = midPoints(player.abilities.dribbling);
    player.attributes.PAS = midPoints(player.abilities.passing);
    player.attributes.PHY = midPoints(player.abilities.physicality);
    player.attributes.DEF = midPoints(player.abilities.defending);
    player.attributes.GK = midPoints(player.abilities.goalkeeping);
    
    return player;
}

export default createPlayer;

console.log('My booooooy: ', createPlayer());

