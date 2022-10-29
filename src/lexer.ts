const Az = require('az');

async function generateSentence(weight: number, material: string, category: string, insert: string, proba: number, auditory:  {
    ["ДляДетей"]: boolean,
    ["ДляМужчин"]: boolean,
    ["ДляЖенщин"]: boolean
}): Promise<string> {
    let gramForm = getGramForm(weight);
    let materialForm = getMaterialForm(material);
    let auditoryForm = getAuditoryForm(auditory);
    let probaForm = getProbaForm(proba);
    let insertForm: string = await getInsertForm(insert, category);

    let firstPart = `${category} из ${materialForm}`;
    let secondPart = '';
    let thirdPart = `, весом ${weight} ${gramForm}.`;

    if (auditoryForm) {
        firstPart = `${category} ${auditoryForm} из ${materialForm}`;
    }

    if (insertForm) {
        secondPart = insertForm;
    }

    if (probaForm) {
        thirdPart = `, ${probaForm} и весом ${weight} ${gramForm}.`; 
    }
    
    return firstPart + secondPart + thirdPart;
}

function getGramForm(weight: number): string {
    let number = weight % 10;
    if (number < 5 && weight != 0) {
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

function getInsertForm(insertString, category) : Promise<string> {
    
    if (!insertString) {
        return undefined;
    }

    let inserts = insertString.split(",");

    let adjectAdd = ['идеально ',
    'хорошо ',
    'великолепно ', 
    'чудесно ',
    'очень хорошо ',
    'изумительно ',
    'отлично ',
    'прекрасно ',
    'потрясающе ',
    'замечательно '];

    let endAdd = ['подходит к ',
    'подходит для ',
    'смотрится с ',
    'сочетается с '];

    

    let promise = new Promise<string>((resolve, reject) => {
        Az.Morph.init('./dicts', () => {
            let wordsToString = [];
    
            inserts.forEach((insert) => {
                let words = insert.split(' ');
                let nouns = [];
                let adjectives = [];
                let number;
    
                const regexLatin = new RegExp(/([a-zA-Z])\w+/g);
    
                for (let word of words) {
                    if (+word) {
                        number = +word;
                        continue;
                    }
    
                    word = word.toLowerCase();
    
                    let wordMorph = Az.Morph(word);
    
                    wordMorph = wordMorph[0];
    
                    if (word.includes('.')) {
                        continue;
                    }
    
                    if (regexLatin.test(word)) {
                        nouns.push(word);
                        continue;
                    }

                    if (word == "бесцветный") {
                        continue;
                    }
                    
                    if (nouns.length < 1 && wordMorph.matches(['NOUN'])) {
                        wordMorph = wordMorph.inflect(['sing', 'ablt']);
                    } 
                    
    
                    if (number > 1 && !wordMorph.matches(['nomn'])) {
                        wordMorph = wordMorph.inflect(['plur','ablt']);
                    }
    
    
                    if (wordMorph.matches(['NOUN'])) {
                        nouns.push(wordMorph.toString())
                    }
    
                    if (wordMorph.matches(['ADJF'])) {
                        adjectives.push(wordMorph.toString());
                    }
                }
                
                let setWord = new Set<string>(nouns);

                nouns = Array.from(setWord);

                wordsToString.push(`${adjectives.join(" ")} ${nouns.join(" ")}`)
            });

            let c;
    
            if (wordsToString[0].startsWith('c')) {
                c = ' co ';
            } else {
                c = ' c ';
            }


            let randomAdd = Math.floor(Math.random() * (adjectAdd.length - 1));
            let randomEnd = Math.floor(Math.random() * (endAdd.length - 1));

            let needWord = endAdd[randomEnd].split(' ')[0];
            let end2;

            let categoryParse = Az.Morph(category)[0].matches(['plur']);

            if (categoryParse) {
                end2 = Az.Morph(needWord)[0].inflect(['plur'].toString())
            }

            let endPart = `${adjectAdd[randomAdd]}${end2}`;

            if (wordsToString.length > 1) {
                let stringInsert = wordsToString.join(', ').replace(/\,(?=[^,]*$)/gm, ' и');
                stringInsert = stringInsert.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
                
                resolve(c + stringInsert + endPart);
            }
            
            wordsToString[0] = wordsToString[0].replace(/^\s+|\s+$|\s+(?=\s)/g, "");

            resolve(c + wordsToString[0] + endPart);
        });
    });

    return promise;
}

let weight = 85;
let material = "Белое золото";
let category = "Часы";

let proba = 43;

let auditory = {
    ["ДляДетей"]: true,
    ["ДляМужчин"]: false,
    ["ДляЖенщин"]: true,
};

let insert = "5 Топаз лондон,5 Ситалл турмалин зеленый,8 Фианит бесцветный";

let sentence = generateSentence(weight, material, category, insert, proba, auditory).then((data) => console.log(data));


