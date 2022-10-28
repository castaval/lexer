import * as XLSX from 'xlsx';
import * as fs from "fs";
import * as path from 'path';


const ParseXLSXTables = (filename, listName) => {
    const exelData = XLSX.readFile(filename);

    const sheet = [listName].map((name) => ({
        name,
        data: XLSX.utils.sheet_to_json(exelData.Sheets[name]),
    }));

    filename = path.basename(filename, '.xlsx'); 

    const file = fs.openSync(`./json/${filename}.json`, 'w')


    sheet.forEach((element) => {
        fs.writeSync(file, JSON.stringify(element.data, null, "\t"));
    });
}

const ParseJson = (path) => {
    let rawdata = fs.readFileSync(path);
    let productsInfo = JSON.parse(rawdata.toString());
    let information = [];

    let style = new Set();
    let inserts = new Set();
    let coreStoneInsert = new Set();
    let additionInfoInsert = new Set();
    let insertDescription = new Set();
    let forChildren = new Set();
    let forMen = new Set();
    let forWomen = new Set();

    information.push(style, coreStoneInsert, additionInfoInsert, insertDescription, inserts, forChildren, forMen, forWomen);

    productsInfo.forEach((productInfo) => {
        style.add(productInfo["Стиль"]);
        coreStoneInsert.add(productInfo["КаменьОсновнойВставки"]);
        additionInfoInsert.add(productInfo["ДополнительнаяИнформацияПоВставке"]);
        insertDescription.add(productInfo["ОписаниеВставок"]);
        inserts.add(productInfo["ПеречислениеВсехВставок"]);
        forChildren.add(productInfo["ДляДетей"]);
        forMen.add(productInfo["ДляМужчин"]);
        forWomen.add(productInfo["ДляЖенщин"]);
    });

    fs.writeFileSync("./json/information.json", JSON.stringify({
        ["Стиль"]: Array.from(information[0]),
        ["КаменьОсновнойВставки"]: Array.from(information[1]),
        ["ДополнительнаяИнформацияПоВставке"]: Array.from(information[2]),
        ["ОписаниеВставок"]: Array.from(information[3]),
        ["ПеречислениеВсехВставок"]: Array.from(information[4]),
        ["ДляДетей"]: Array.from(information[5]),
        ["ДляМужчин"]: Array.from(information[6]),
        ["ДляЖенщин"]: Array.from(information[7]),
    }, null, "\t"));
}

// ParseXLSXTables("./sheets/abilities.xlsx", 'TDSheet');
ParseJson('./json/abilities.json');




