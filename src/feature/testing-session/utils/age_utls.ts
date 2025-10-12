import { log } from "console";

export class AgeUtils {
    static calculateStageFromBirthDate(birthDate: Date): number {
        const age = this._calculateAge(birthDate);
        if (age >= 6 && age <= 8) return 1;
        if (age >= 9 && age <= 10) return 2;
        if (age >= 11 && age <= 12) return 3;
        if (age >= 13 && age <= 15) return 4;
        if (age >= 16 && age <= 17) return 5;
        if (age >= 18 && age <= 29) return 6;
        if (age >= 30 && age <= 39) return 7;
        if (age >= 40 && age <= 49) return 8;
        if (age >= 50 && age <= 59) return 9;
        if (age >= 60 && age <= 69) return 10;
        if (age >= 70 && age <= 79) return 11;
        if (age >= 80) return 12;
        return 0; // too young
    }

    static _calculateAge(birthDate: Date): number {
        const today = new Date();
        const bd = new Date(birthDate);
        var age = today.getFullYear() - bd.getFullYear();
        const monthDiff = today.getMonth() - bd.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bd.getDate())) {
            age--;
        }
        return age; 
    }
}