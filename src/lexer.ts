function generateSentence(weight: number, material: string, category: string, ): string {
    let gramForm = getGramForm(weight);
    let materialForm = getMaterialForm(material);
    
    return `${category} из ${materialForm}, весом ${weight} ${gramForm}.`;
}

function getGramForm(weight: number): string {
    if (weight < 5) {
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

let weight = 40;
let material = "Белое золото";
let category = "Часы";

let sentence = generateSentence(weight, material, category);
console.log(sentence);