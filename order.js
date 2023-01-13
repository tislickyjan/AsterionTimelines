import * as inter from "./intersections.js";

export default class Order {
    // od kdy se zacne jedno osa priblizovat k druhe, nebo jedna oddalovat od druhe
    pathShift = 50;
    // rozdil mezi umistenim os
    diff = 150;
    //
    connShift = 25;
    // minimalni datum
    min = 0;
    // maximalni datum
    max = 0;
    // zatim budou take nekonecne vsechny, TODO: dodelat metody makePathI... makePathOther
    extend = 30000;

    constructor(context) {
        this.context = context;
    }

    // vrat element, ktery byl umisten jako prvni do vizualizace
    getMinIdxFrom(common, placedCommon) {
        return placedCommon.indexOf(common.reduce((prev, curr) => {
            let prevI = placedCommon.indexOf(prev);
            let currI = placedCommon.indexOf(curr);
            let res;
            if (prevI === -1 && currI === -1)
                res = prev;
            else if (prevI !== -1 && currI === -1 || prevI === -1 && currI !== -1)
                res = (prevI === -1) ? curr : prev;
            else
                res = (prevI < currI) ? prev : curr;
            return res;
        }));
    }

    // Z dat typu predmet osobnost zvire udela specialne cesty
    makePathItemPerson() {

    }
    // pro vsechny ostatni tagy
    makePathOther() {

    }

    // vytvor osu na zaklade udalosti, ktere se na ni odehravaji a jejich souvislosti s ostatnimi osami
    makePathEvents(item, levels, names, start, datum, events, commonEvents) {
        // projdi vsechny udalosti dane osy
        for (let event of item.events) {
            // zjisti s kym souvisi a jeste neni umisten
            let common = event.filters.map((item) => item.name);
            // souvisi s temito umistenymi
            let placedCommon = levels.map((item) => item.name);
            // minimalni index, ke kteremu se priblizi dana osa ve zkoumane udalosti
            let minIdx = this.getMinIdxFrom(common, placedCommon);
            // vytvor prislusny event
            let tmpEv = {
                id: event.id,
                name: event.name,
                desc: event.description,
                icon: event.icon.path,
                filters: common,
                cls: item.name,
                bck_x: event.begin,
                y: undefined
            }
            // sdili nekdo kdo uz je umisten tuto udalost? A nekdo z cekajicich? NE| nikdo z umistenych ani cekajicich ji nema
            if (common.some(r => placedCommon.indexOf(r) >= 0)) {
                // delka dane udalosti
                let dur = event.end !== undefined ? event.end - event.begin : 1;
                // kterym smerem je nutne poslat osu
                let dir = (levels[minIdx].start > start ? -1 : 1);
                // zkonstruuj oblouk
                datum.push(
                    {x: event.begin - this.pathShift, y: start},
                    {x: event.begin, y: levels[minIdx].start + dir * this.connShift},
                    {x: event.begin + dur, y: levels[minIdx].start + dir * this.connShift},
                    {x: event.begin + dur + this.pathShift, y: start});
                // uprav konec a zacatek osy
                if (event.begin + this.pathShift > this.max)
                    this.max = event.begin + this.pathShift;
                if (event.begin - this.pathShift < this.min)
                    this.min = event.begin - this.pathShift;
                // pri umisteni udalosti bude jine y, protoze uz ji nekdo se mnou sdili a ja se musim dostat k nemu
                if ((!common.some(r => names.indexOf(r) >= 0))) {
                    let yShift = levels[minIdx].start + ((dir === -1) ? dir * this.connShift * 3 : this.connShift);
                    let res = commonEvents.find((el) => el.x === tmpEv.begin && el.y === yShift && el.id !== event.id);
                    tmpEv.y = yShift;
                    if (res === undefined)
                        commonEvents.push({x:event.begin, y:yShift, eventlist:[tmpEv]});
                    else
                        res.eventlist.push(tmpEv);
                }
            }
            else {// nic spolecneho
                // pokud neni zadny dalsi spolecny umisti, jinak nech na dalsim
                if (!common.some(r => names.indexOf(r) >= 0)) {
                    tmpEv.y = start - this.connShift;
                    events.push(tmpEv);
                }
            }
        }
    }

// vezme predavana data a udela prubeh cesty pro jednotlive osy, pokud maji alespon nejake udalosti
    makeView() {
        // pole udalosti
        let events = [];
        // pole urovni jednotlivych casovych os
        let levels = [];
        // kde se ma zacit
        let start = d3.select(".canvasDraw").node().clientHeight / 2;
        // spolecne udalosti
        let commonEvents = [];
        // poradi pro prohazovani os
        this.context.activeOrder = [];
        // seznam jmen os, ktere se budou vykreslovat
        let names = this.context.active.map((item) => item.name);
        // projdi vsechy aktivni osy
        for (let [idx,item] of this.context.active.entries()) {
            // zjisti zacatky a konce
            this.min = this.context.minDate - this.pathShift;
            this.max = this.context.maxDate + this.pathShift;
            // odstran z cekajicich na zpracovani
            names.splice(names.indexOf(item.name), 1);
            // kde bude dana osa zacinat?
            start += (((idx % 2) === 0) ? idx : -idx) * this.diff;
            // pridej danou osu do pole na prohazovani
            (idx % 2) === 0 ? this.context.activeOrder.push(item.clsName) : this.context.activeOrder.unshift(item.clsName);
            // urci pocatecni bod casove osy
            let datum = [{x: this.min - this.extend, y: start}];
            // projdi eventy a zjisti jak je spravne umistit
            this.makePathEvents(item, levels, names, start, datum, events, commonEvents);
            // vloz posledni bod casove osy
            datum.push({x: this.max + this.extend, y: start});
            // uloz vsechny dulezite casti do levels
            levels.push({name: item.name, clsName: item.clsName, start: start, datum: datum, color: item.color, imgPath:item.iconPath});
        }
        return {paths: levels, events: events, commonEvents: commonEvents};
    }
//----------------------------------------------------------------------------------------------------------------------
    // metoda pro nahodne poradi os
    randomOrder(b) {
        this.context.updateScales();
        const entriesCount = this.context.active.length;
        let idxs = [...Array(entriesCount).keys()];
        idxs = this.context.shuffelArray(idxs);
        this.context.active = idxs.map(i => this.context.active[i]);
        b.drawRes(this.makeView());
    }
//----------------------------------------------------------------------------------------------------------------------
    // vezme pole indexu a vrati vsechny mozne permutace
    permutate(idxArray, idxCount) {
        let c = new Array(idxCount).fill(0);
        let res = [[...idxArray]];
        let i = 1;
        while (i < idxCount) {
            if (c[i] < i) {
                if (i % 2 === 0)
                    [idxArray[0], idxArray[i]] = [idxArray[i], idxArray[0]];
                else
                    [idxArray[c[i]], idxArray[i]] = [idxArray[i], idxArray[c[i]]];
                res.push([...idxArray]);
                c[i]++;
                i = 1;
            } else {
                c[i] = 0;
                i++;
            }
        }
        return res;
    }

    // spocti kolik maji zadane osy pruseciku
    getNumberOfIntersection(data) {
        let paths = data.map(item => item.datum);
        let pairs = [];
        let numInt = 0;
        // ziskej vsechny dvojice
        for (let i = 0; i < paths.length; i++)
            for (let j = i + 1; j < paths.length; j++)
                pairs.push([i,j]);
        // spocitej vsechny pruseciky
        for (let [i,j] of pairs){
            let res = inter.intersect(inter.shape("path", {d: this.context.area(paths[i])}),
                inter.shape("path", {d: this.context.area(paths[j])}));
            numInt += res.points.length;
        }
        return numInt;
    }

    // metoda pro zjisteni optimalniho poradi os, brute force verze
    bruteForceOrder(b) {
        this.context.updateScales();
        const entriesCount = this.context.active.length;
        const idxs = [...Array(entriesCount).keys()];
        const permutations = this.permutate(idxs, entriesCount);
        // obsahuje nejlepsi permutaci v poctu krizeni
        let bestPerm = undefined;
        // zjisti ktera permutace ma nejmene pruniku
        for (let perm of permutations) {
            // mam nove poradi
            this.context.active = perm.map(r => this.context.active[r]);
            // zjisti prubeh cest pro dane poradi
            let tmpPaths = this.makeView(this.context.active);
            // zjisti # pruseciku pro aktualni prubehy
            let numInt = this.getNumberOfIntersection(tmpPaths.paths);
            // console.log(perm, numInt);
            // urci novnou nejlepsi permutaci nebo zachovej puvodni
            if (bestPerm === undefined || bestPerm.numInt > numInt)
                bestPerm = {numInt: numInt, perm: perm, res: tmpPaths};
        }
        // zprehazej osy
        this.context.active = bestPerm.perm.map(r => this.context.active[r]);
        // vykresli
        b.drawRes(bestPerm.res);
    }

//----------------------------------------------------------------------------------------------------------------------
    // vytvor vztahy mezi osami
    getEdges(filtEvents, names) {
        // vysledne hrany
        let edges = []
        // projdi udalosti
        filtEvents.forEach( event => {
            let filters = event.filters.map( item => item.name);
            // projdi filtry a vytvor spojnice
            filters.forEach( (source) => {
                filters.forEach( (target) => {
                    if (source !== target && names.indexOf(source) !== -1 && names.indexOf(target) !== -1) {
                        edges.push({"source":names.indexOf(source), "target":names.indexOf(target)});
                    }
                })
            })
        });
        return edges;
    }

    // ziskej vsechny eventy a nech za kazdy duplicitni jen jeden
    getEvents(buffer) {
        let events = buffer.map(r => r.events).flat();
        events = events.filter((value, index, self) => index === self.findIndex(
            (t) => t.place === value.place && t.id === value.id));
        return events;
    }

    // vytvor frekvencni tabulku
    makeFrequencyTable(names) {
        // data frekvenci vyskytu
        let freqData = [];
        // ziskej vsechny eventy
        let filtEvents = this.getEvents(this.context.active);
        // vytvor frekvencni tabulku pro dane osy
        this.context.active.forEach((item) => freqData.push({"idx": this.context.active.indexOf(item), "freq": Array(names.length + 1).fill(0)}));
        // najdi spojeni os
        let edges = this.getEdges(filtEvents, names);
        // spocitej frekvence
        edges.forEach(item => {freqData[item.source].freq[item.target]++; freqData[item.target].freq[names.length]++});
        return freqData;
    }

    // frekvencni metoda
    frequencyTable(b) {
        // zaktualizuj rozsahy
        this.context.updateScales();
        // console.log(this.context.active);
        // nacti jmena
        const names = this.context.active.map((item) => item.name);
        // pole 2d s nulami, v datech a jmena budou jmena z this.context.active
        let freqData = this.makeFrequencyTable(names);
        // serazeni vysledne tabulky
        freqData.sort((a,b) => {
            if (a.freq[names.length] < b.freq[names.length])
                return 1;
            else if (a.freq[names.length] === b.freq[names.length]) {
                for (let idx = 0; idx < names.length; idx++)
                    if (a.freq[idx] !== b.freq[idx] && freqData.indexOf(a) !== idx && freqData.indexOf(b) !== idx)
                        return a.freq[idx] > b.freq[idx];
            }
            else
                return -1
        });
        // vytvor nove poradi a aplikuj ho
        const order = freqData.map( (item) => item.idx);
        this.context.active = order.map(i => this.context.active[i]);
        // zjisti prubeh cest pro dane poradi a vykresli
        b.drawRes(this.makeView());
    }
//----------------------------------------------------------------------------------------------------------------------
    // vrat nahodne cislo mezi min a max
    getRndNumber(min, max) {
        return Math.random() * (max - min + 1) + min;
    }
    // https://observablehq.com/@ben-tanen/a-tutorial-to-using-d3-force-from-someone-who-just-learned-ho

    // pomocna funkce pro vizualizaci prace silove metody
    drawNodes = (svg, node_data, edge_data) => {
        let edge = null;
        if (edge_data) {
            edge = svg.selectAll(".edge")
                .data(edge_data).enter()
                .append("line")
                .classed("edge", true)
                .attr("x1", d => node_data[d.source].x)
                .attr("y1", d => node_data[d.source].y)
                .attr("x2", d => node_data[d.target].x)
                .attr("y2", d => node_data[d.target].y)
                .style("stroke", "#bbb");
        }

        const node = svg.selectAll(".node")
            .data(node_data).enter()
            .append("circle")
            .classed("node", true)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", "10");

        return [node, edge];
    }

    //https://stackoverflow.com/questions/13463053/calm-down-initial-tick-of-a-force-layout
    //https://www.airpair.com/javascript/posts/d3-force-layout-internals
    //https://stackoverflow.com/questions/39379299/how-do-you-customize-the-d3-link-strength-as-a-function-of-the-links-and-nodes-c
    //https://stackoverflow.com/questions/14407069/how-find-out-if-force-layout-done-placing-the-nodes
    // autolayout,layered digraph layout, silova metoda s vyuzitim knihovny d3
    forceMethod(b) {
        // aktualizace rozmeru
        this.context.updateScales();
        // ziskej pritomne osy
        const names = this.context.active.map((item) => item.name);
        // jednotlive osy jako uzly
        let nodes = [];
        // vytvor reprezentaci uzlu
        names.forEach(item => nodes.push({"id":item.index, "x": 150, "y":this.getRndNumber(200,600)}));
        // ziskej zaklad techto uzlu
        let freqData = this.makeFrequencyTable(names);
        // spojnice mezi uzly
        let links = [];
        for (let i = 0; i < names.length; i++) {
            for (let j = i + 1; j < names.length; j++) {
                if (freqData[i].freq[j])
                    links.push({source: i, target: j, weight: freqData[i].freq[j]});
            }
        }
        // urci vahy jednotlivych spoju
        let weightScale = d3.scaleLinear()
            .domain(d3.extent(links,  (d) => { return d.weight }))
            .range([.1, 1])
        // zacni simulaci
        d3.forceSimulation().nodes(nodes)
            .force("link",d3.forceLink(links).strength((e) => weightScale(e.weight)).distance(0))
            .force("x", d3.forceX(150))
            .force("collide", d3.forceCollide().radius(10))
            .force("charge", d3.forceManyBody().strength(1))
            .on("end", () => { // po skonceni udelej nasledujici
                // serad uzly dle y
                nodes.sort((a,b) => a.y - b.y);
                // ziskej dane poradi
                const order = nodes.map(item => item.index);
                // na jeho zaklade uprav aktivni uzly
                this.context.active = order.map(i => this.context.active[i]);
                // zjisti prubeh cest pro dane poradi a vykresli
                b.drawRes(this.makeView());
            });
    }
}
