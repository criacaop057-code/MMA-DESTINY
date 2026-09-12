import { createId } from "../core/ids.js";

export function createStudent({
    name,
    age = 15,
    level = "beginner",
    potential = 50
}) {
    return {
        id: createId("student"),

        name,
        age,

        level,

        attributes: {
            striking: 30,
            wrestling: 30,
            grappling: 30,
            bjj: 30,
            takedownDefense: 30,
            strikingDefense: 30,
            cardio: 30,
            strength: 30,
            speed: 30,
            durability: 30,
            fightIQ: 25,
            discipline: 50,
            confidence: 40,
            mental: 40
        },

        potential,

        attendance: 100,
        loyalty: 50,
        motivation: 70,
        fatigue: 0,

        monthlyFee: 0,
        paid: true,

        competitions: 0,
        victories: 0,
        losses: 0,

        professional: false,
        active: true,

        enrollmentDate: null,
        history: []
    };
}

export function trainStudent(student, trainingType, intensity = 1) {
    if (!student.active) {
        return null;
    }

    const effects = {
        striking: ["striking", "strikingDefense"],
        wrestling: ["wrestling", "takedownDefense"],
        grappling: ["grappling", "bjj"],
        conditioning: ["cardio", "strength", "durability"],
        mental: ["fightIQ", "mental", "confidence"]
    };

    const targets = effects[trainingType] || [];

    targets.forEach(attribute => {
        if (student.attributes[attribute] !== undefined) {
            student.attributes[attribute] = Math.min(
                100,
                student.attributes[attribute] +
                0.1 * intensity
            );
        }
    });

    student.fatigue = Math.min(
        100,
        student.fatigue + intensity * 2
    );

    return student;
}

export function updateStudentAttendance(student, amount) {
    student.attendance = Math.max(
        0,
        Math.min(100, student.attendance + amount)
    );

    return student.attendance;
}

export function updateStudentLoyalty(student, amount) {
    student.loyalty = Math.max(
        0,
        Math.min(100, student.loyalty + amount)
    );

    return student.loyalty;
}

export function processStudentWeek(student) {
    if (!student.active) {
        return null;
    }

    if (student.attendance >= 80) {
        student.motivation = Math.min(
            100,
            student.motivation + 1
        );

        student.loyalty = Math.min(
            100,
            student.loyalty + 0.5
        );
    } else {
        student.motivation = Math.max(
            0,
            student.motivation - 2
        );

        student.loyalty = Math.max(
            0,
            student.loyalty - 1
        );
    }

    student.fatigue = Math.max(
        0,
        student.fatigue - 10
    );

    return {
        id: student.id,
        attendance: student.attendance,
        motivation: student.motivation,
        loyalty: student.loyalty,
        fatigue: student.fatigue
    };
}

export function calculateStudentOVR(student) {
    const values = Object.values(student.attributes);

    if (!values.length) {
        return 0;
    }

    return Math.round(
        values.reduce((sum, value) => sum + value, 0) /
        values.length
    );
}
