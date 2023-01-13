import * as inter from "../intersections.js";

export default class Order {
    pathShift = 100;
    diff = 150;
    connShift = 25;
    min = 0;
    max = 0;

    colors = ["red", "blue", "yellow", "black", "green", "orange", "gray", "brown"];

    constructor(context) {
        this.context = context;
    }

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

    makePathEvents(item, levels, names, start, datum, events, commonEvents) {
        for (let event of item.events) {
            let common = event.filters.map((item) => item.name);
            let placedCommon = levels.map((item) => item.name);
            let minIdx = this.getMinIdxFrom(common, placedCommon);
            let tmpEv = {
                name: event.name,
                desc: event.description,
                icon: "/img/war.png",
                filters: common,
                cls: item.name,
                bck_x: event.begin,
                y: undefined
            }
            // sdili nekdo kdo uz je umisten tuto udalost? A nekdo z cekajicich? NE| nikdo z umistenych ani cekajicich ji nema
            if (common.some(r => placedCommon.indexOf(r) >= 0)) {
                let dir = (levels[minIdx].start > start ? -1 : 1);
                //                           | pouze konstanta na ted, pozdeji mozna promenna
                datum.push({x: event.begin - this.pathShift, y: start},
                    {x: event.begin, y: levels[minIdx].start + dir * this.connShift},
                    {x: event.begin + 1, y: levels[minIdx].start + dir * this.connShift},
                    {x: event.begin + this.pathShift, y: start});
                // pri umisteni bude jiny x, protoze uz ji nekdo se mnou sdili a ja se musim dostat k nemu
                if ((!common.some(r => names.indexOf(r) >= 0))) {
                    let yShift = levels[minIdx].start + ((dir === -1) ? dir * this.connShift * 3 : this.connShift);
                    let res = commonEvents.find((el) => el.x === event.begin && el.y === yShift);
                    tmpEv.y = yShift;
                    if (res === undefined)
                        commonEvents.push({x:event.begin, y:yShift, eventlist:[tmpEv]});
                    else
                        res.eventlist.push(tmpEv);
                }
            }
            else {
                datum.push({x: event.begin, y: start});
                if (!common.some(r => names.indexOf(r) >= 0)) {
                    tmpEv.y = start - this.connShift;
                    events.push(tmpEv);
                }
            }
        }
    }

// vezme predavana data a udela prubeh cesty pro jednotlive osy, pokud maji alespon nejake udalosti
// TODO: Detekce toho, ze uz nektere pozice jsou obsazene a je treba pridat posun v danem smeru a znovu zkontrolovat
// TODO: Moznost zjisteni zda mohu na danou pozici neco vubec umistit
    makeView(topDown) {
        let events = [];
        let levels = [];
        let start = topDown ? 0 : window.innerHeight / 2;
        let yEv = 0;
        let commonEvents = [];
        let names = this.context.active.map((item) => item.name);
        for (let [idx,item] of this.context.active.entries()) {
            this.min = item.events.reduce((prev, curr) => prev.begin < curr.begin ? prev : curr).begin;
            this.max = item.events.reduce((prev, curr) => prev.begin > curr.begin ? prev : curr).begin;
            names.splice(names.indexOf(item.name), 1);
            start += topDown ? this.diff : (((idx % 2) === 0) ? idx : -idx) * this.diff;
            let datum = [{x: this.min, y: start}];
            // projdi eventy a zjisti jak je spravne umistit
            this.makePathEvents(item, levels, names, start, datum, events, commonEvents);
            datum.push({x: this.max, y: start});
            // lepe ulozit a levels dat lokalni, doplnit o datum a barvu, bude treba vice casti
            levels.push({name: item.name, start: start, datum: datum, color: this.colors[idx]});
        }
        // console.log(commonEvents);
        return {paths: levels, events: events, commonEvents: commonEvents};
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

    xt2 = d3.scaleLinear().domain([0,316065]).range([0,6000]);
    area = d3.area()
        .curve(d3.curveMonotoneX)
        .x((d) => {return this.xt2(d.x)})
        .y0(0)
        .y((d) => {return(d.y)})

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
            let res = intersection.intersect(intersection.shape("path", {d: this.area(paths[i])}),
                                             intersection.shape("path", {d: this.area(paths[j])}));
            numInt += res.points.length;
        }
        return numInt;
    }

    // prvni metoda pro zjisteni optimalniho poradi os, brute force verze
    bruteForceOrder() {
        const entriesCount = this.context.active.length;
        const idxs = [...Array(entriesCount).keys()];
        const permutations = this.permutate(idxs, entriesCount);
        // obsahuje nejlepsi permutaci v poctu krizeni
        // #prus, perm, paths, events
        let bestPerm = undefined;
        // zjisti ktera permutace ma nejmene pruniku
        for (let perm of permutations) {
            // mam jine poradi
            this.context.active = perm.map(r => this.context.active[r]);
            // zjisti prubeh cest pro dane poradi
            let tmpPaths = this.makeView(this.context.active);
            // zjisti # pruseciku pro aktualni prubehy
            let numInt = this.getNumberOfIntersection(tmpPaths.paths);
            console.log(perm, numInt);
            if (bestPerm === undefined || bestPerm.numInt > numInt)
                bestPerm = {numInt: numInt, perm: perm, res: tmpPaths};
        }
        this.context.active = bestPerm.perm.map(r => this.context.active[r]);
        return bestPerm.res;
    }

//----------------------------------------------------------------------------------------------------------------------
    getEdges(filtEvents, names) {
        let edges = []
        filtEvents.forEach( event => {
            let filters = event.filters.map( item => item.name);
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

    getEvents(buffer) {
        let events = buffer.map(r => r.events).flat();
        events = events.filter((value, index, self) => index === self.findIndex(
            (t) => t.place === value.place && t.id === value.id));
        return events;
    }

    makeFrequencyTable(names) {
        let freqData = [];
        let filtEvents = this.getEvents(this.context.active);
        this.context.active.forEach((item) => freqData.push({"idx": this.context.active.indexOf(item), "freq": Array(names.length + 1).fill(0)}));
        // pocitani frekvenci
        let edges = this.getEdges(filtEvents, names);
        edges.forEach(item => {freqData[item.source].freq[item.target]++; freqData[item.target].freq[names.length]++});
        return freqData;
    }

    // bude treba optimalizace
    frequencyTable() {
        const names = this.context.active.map((item) => item.name);
        // pole 2d s nulami, v datech a jmena budou jmena z this.context.activeu
        let freqData = this.makeFrequencyTable(names);
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
        const order = freqData.map( (item) => item.idx);
        this.context.active = order.map(i => this.context.active[i]);
        // zjisti prubeh cest pro dane poradi
        return this.makeView();
    }
//----------------------------------------------------------------------------------------------------------------------
    getRndNumber(min, max) {
        return Math.random() * (max - min + 1) + min;
    }
    // https://observablehq.com/@ben-tanen/a-tutorial-to-using-d3-force-from-someone-who-just-learned-ho
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
    // autolayout,layered digraph layout
    forceMethod(cb) {
        const names = this.context.active.map((item) => item.name);
        // jednotlive osy
        let nodes = [];
        names.forEach(item => nodes.push({"id":item.index, "x": 150, "y":this.getRndNumber(200,600)}));
        let freqData = this.makeFrequencyTable(names);
        let links = [];
        for (let i = 0; i < names.length; i++) {
            for (let j = i + 1; j < names.length; j++) {
                if (freqData[i].freq[j])
                    links.push({source: i, target: j, weight: freqData[i].freq[j]});
            }
        }
        let weightScale = d3.scaleLinear()
            .domain(d3.extent(links,  (d) => { return d.weight }))
            .range([.1, 1])
        // console.log(freqData);
        // console.log(nodes);
        // const [node, edge] = this.drawNodes(d3.select("svg"),nodes,links)
        // mam transformovany cely graf a chci ziskat poradi
        // console.log(nodes);
        let sim = d3.forceSimulation().nodes(nodes)
            .force("link",d3.forceLink(links).strength((e) => weightScale(e.weight)).distance(0))
            .force("x", d3.forceX(150))
            .force("collide", d3.forceCollide().radius(10))
            .force("charge", d3.forceManyBody().strength(1))
            // .on("tick", () => {
            //     node
            //         .attr("cx", d => d.x)
            //         .attr("cy", d => d.y);
            //     edge
            //         .attr("x1", d => d.source.x)
            //         .attr("y1", d => d.source.y)
            //         .attr("x2", d => d.target.x)
            //         .attr("y2", d => d.target.y);
            // })
            .on("end", () => {
                nodes.sort((a,b) => a.y - b.y);
                // console.log(nodes);
                // mam poradi
                const order = nodes.map(item => item.index);
                this.context.active = order.map(i => this.context.active[i]);
                // zjisti prubeh cest pro dane poradi
                cb(this.makeView());
            });
    }
}
