
function generateSentence(weight: number, material: string, category: string, insert: string, proba: number, auditory:  {
    ["ДляДетей"]: boolean,
    ["ДляМужчин"]: boolean,
    ["ДляЖенщин"]: boolean
}): string {
    let gramForm = getGramForm(weight);
    let materialForm = getMaterialForm(material);
    let auditoryForm = getAuditoryForm(auditory);
    let probaForm = getProbaForm(proba);
    let insertForm = getInsertForm(insert);

    let firstPart = `${category} из ${materialForm}`;
    let thirdPart = `, весом ${weight} ${gramForm}.`;

    if (auditoryForm) {
        firstPart = `${category} ${auditoryForm} из ${materialForm}`;
    }

    if (probaForm) {
        thirdPart = `, ${probaForm} и весом ${weight} ${gramForm}.`; 
    }
    
    return firstPart + thirdPart;
}

function getGramForm(weight: number): string {
    let number = weight % 10;
    if (number < 5) {
        return "грамма";
    } else {
        return "грамм";
    }
}

function getMaterialForm(material: string): string {
    let words = material.toLowerCase().split(' ');

    if (words[words.length - 1].endsWith('о')) {
        words[words.length - 1] = words[words.length - 1].replace(/[о]$/gm, "а");
    } else if (words[words.length - 1].endsWith('а')) {
        words[words.length - 1] = words[words.length - 1].replace(/[а]$/gm, 'ы');
    } else if (words[words.length - 1].endsWith('ь')) {
        words[words.length - 1] = words[words.length - 1].replace(/[ь]$/gm, 'и');
    } 

    if (words.length > 1) {
        words[0] = words[0].replace(/[а,я,у, ю, о, е, ё, э, и, ы]{2}$/gm, "ого");
    }
    
    return words.join(' ');
}

function getAuditoryForm(auditories: {
    ["ДляДетей"]: boolean,
    ["ДляМужчин"]: boolean,
    ["ДляЖенщин"]: boolean
}): string {
    let stringOfAuditory = [];

    if (auditories.ДляДетей) {
        stringOfAuditory.push("для детей");
    }

    if (auditories.ДляЖенщин) {
        stringOfAuditory.push("для женщин");
    }

    if (auditories.ДляМужчин) {
        stringOfAuditory.push("для мужчин");
    }

    switch (stringOfAuditory.length) {
        case 1:
            return stringOfAuditory[0];
        case 2:
            return `${stringOfAuditory[0]}, ${stringOfAuditory[1].split(" ")[1]}`
        case 3:
            return `${stringOfAuditory[0]}, ${stringOfAuditory[1].split(" ")[1]} и ${stringOfAuditory[2].split(" ")[1]}`
    }

    return undefined;
}

function getProbaForm(proba: number): string {
    if (proba) {
        return `${proba} пробы`
    }

    return undefined
}

function getInsertForm(insert: string) {
    const lolo = new morpher.Morpher(); 

    lolo.russian.declension('аметист').then(
        result => {
            console.log(result['родительный']);
        }
    ) 
}

let weight = 85;
let material = "Белое золото";
let category = "Часы";

let proba = undefined;

let auditory = {
    ["ДляДетей"]: false,
    ["ДляМужчин"]: false,
    ["ДляЖенщин"]: true,
};

// let sentence = generateSentence(weight, material, category, proba, auditory);
// console.log(sentence);

getInsertForm('sad');