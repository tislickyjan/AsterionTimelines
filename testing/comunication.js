import Context from "../context.js"
import Order from "./order.js";
const ctx = new Context();
const order = new Order(ctx);

const url = "http://localhost:5000/"

// drzi informace k vybranemu prvku v input okenku pod kategoriemi
let searchItem = {"name": "", "id": -1, "cat": -1};
// obsahuje veskere dotazane polozky buffer = {name: "" , vals : {id: xy, catid:xy}, {}}|| nahrazeno ctx.data
let buffer = [];
// obsahuje pozadovane prvky ziskane ze serveru || nahrazeno ctx.active
let dataBuffer = [];

function fillSearchItem(name, id, cat){
    searchItem["name"] = name;
    searchItem["id"] = Number(id);
    searchItem["cat"] = Number(cat);
}

function changeSearched() {
    // console.log(this);
    d3.selectAll("#content .searchSel").each(() => {if (this.attributes["class"].value === "searchSel") this.attributes["class"].value = "";});
    fillSearchItem(this.textContent, Number(this.attributes["ida"].value), Number(this.attributes["cat"].value))
    this.attributes["class"].value = "searchSel";
    d3.select("#control").node().value = this.textContent;
    // console.log(searchItem);
}

async function searchCats() {
    const selection = d3.select("#catSel").node();
    let selected = selection[selection.selectedIndex];
    const list = d3.select("#content");
    clearElement("#content")
    // console.log(selected);
    const searchFor = d3.select("#control").node().value;
    if (searchFor !== "") {
        d3.select("#content").style("visibility", "inherit");
        let resp;
        let data = ctx.data.filter(item => item.name.includes(searchFor) && (item.category.id === selected.value || selected.title === "Vše"));
        // console.log(data.length);
        if (!data.length) {
            resp = await fetch(url + `tag/byContent?search=${searchFor}`);
            data = await resp.json();
            for (const item of data) {
                if (!ctx.data.some(el => el.name === item.name))
                    ctx.data.push({"name": item.name, "id":item.id, "category":{"id": item["category"].id}});
            }
            data = data.filter(item => item["name"].includes(searchFor) && (item.category.name === selected.title || selected.title === "Vše"));
        }
        // vyuzit filter na ziskani spravnych dat
        for (const item of data) {
            list.append("li")
                .attr("ida", item.id)
                .attr("cat", item.category.id)
                .attr("class", "")
                .on("click", changeSearched)
                .text(item["name"]);
        }
    }
    else {
        d3.select("#content").style("visibility", "hidden");
        d3.selectAll("#content").each(function (d,i) {d3.select(this).attr["class"] = "";});
        fillSearchItem("", -1, -1);
    }
}

function fillSelect(data) {
    const sel = d3.select("body select");
    for (let i = 0; i < data.length; i++) {
        sel.append("option")
            .attr("value", data[i]["id"])
            .attr("title", data[i]["name"])
            .attr("alt", data[i]["description"])
            .text(data[i]["name"]);
    }
}

async function getCategories() {
    const resp = await fetch(url + "category/all");
    const data = (await resp.json()).slice(0,10);
    // console.log(data);
    fillSelect(data);
}

function clearElement(name) {
    const events = d3.select(name);
    while (events.node().firstElementChild)
        events.node().removeChild(events.node().lastElementChild);
}

function iterateEvents(name, data) {
    const events = d3.select("#eventsResult");
    events.append("h2").text(name + " - počet událostí:" + data.length);
    for (const item of data) {
        const list = events.append("ul");
        list.append("li").text("id: " + item["id"]);
        list.append("li").text("Nazev: " + item["name"]);
        list.append("li").text("Popis: " + item["description"]);
        list.append("li").text("Zacatek: " + item["begin"]);
        list.append("li").text("IconsPath: " + item["icon"]["path"]);
    }
    events.append("hr");
}

async function showEventsToId() {
    // console.log(`${control.value}`);
    clearElement("#eventsResult");
    // console.log(text);
    // doptat se na eventy
    let resp = await fetch(url + `event/byFilterId?id=${searchItem.id}`);
    let data = await resp.json();
    // vypsat vysledek
    iterateEvents(searchItem["name"], data);
}

// ukladad do databufferu eventy dane osy, doplnit cteni a ukladani do data, kde bude nutna jeste jedna promenna
async function saveToBuffer() {
    let resp = await fetch(url + `event/byFilterId?id=${searchItem.id}`);
    let data = await resp.json();
    // console.log(data);
    // TODO: osetreni ze uz tam dany prvek neni
    if (data.length !== 0)
        ctx.active.push({"name":searchItem.name, "id":searchItem.id, "events":data});
}

let xt2 = d3.scaleLinear().domain([0,316065]).range([0,6000]);
let area = d3.area()
    .curve(d3.curveMonotoneX)
    .x((d) => {return xt2(d.x)})
    .y0(0)
    .y((d) => {return(d.y)});
// utils.js/build.js
function makeDescr(info) {
    let descr = d3.select(document.createElement("div"));
    descr.attr("id", "tooltip")
        .style("position", "absolute")
        .style("opacity", 0);
    let tmp = descr.append("div")
        .attr("class", "left");
    tmp.append("h2").text(info.name);
    tmp.append("p").text(info.desc);
    if (info.filters.length > 1) {
        tmp = descr.append("div")
            .attr("class", "right")
            .append("ul");
        for (let i = 0; i < info.filters.length; i++ )
            tmp.append("li").text(info.filters[i]);
    }
    return descr;
}
// utils.js/build.js
function appendInfoTo(item, event) {
    event.attr("class", item.cls)
        .attr("href", item.icon)
        .attr("y",item.y)
        .attr("bckp-x", item.bck_x)
        .attr("x", ctx.xt2(item.bck_x))
        .attr("height", "50")
        .attr("width", "50");
    const desc = makeDescr(item);
    tippy(event.node(), {
        content: desc.node().innerHTML,
        allowHTML: true,
        theme: "tooltip",
        placement: "left",
        duration: [1000,200],
    });
}
// utils.js/build.js
function placeEvents(events) {
    for (let item of events) {
        appendInfoTo(item, d3.select("svg").append("image"));
        // console.log(item);
    }
}
// utils.js/build.js
function placeGroup(x,y, l) {
    let g = d3.select(".cnvs svg").append("g")
        .attr("class", "group")
        .on("mouseover", (d) => {
            const tmp = d3.select(d.target.parentNode).select("rect");
            const l = tmp.attr("length");
            tmp.attr("width",l*50);
            d3.select(d.target.parentNode).select(".placeholder").attr("display", "none");
            d3.select(d.target.parentNode).selectAll(".hideable").nodes().forEach(d => d3.select(d).attr("display", "inherit"));
        })
        .on("mouseout", (d) => {
            d3.select(d.target.parentNode).select("rect").attr("width", 50);
            d3.select(d.target.parentNode).select(".placeholder").attr("display", "inherit");
            d3.select(d.target.parentNode).selectAll(".hideable").nodes().forEach(d => d3.select(d).attr("display", "none"));
        });
    g.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", 50)
        .attr("fill", "antiquewhite")
        .attr("length", l);
    g.append("image")
        .attr("href", "/img/war.png") // TODO hodit jiny obrazek
        .attr("class", "placeholder")
        .attr("x", x)
        .attr("y", y);
    return g;
}
// utils.js/build.js
function placeCommonEvents(events) {
    const svg = d3.select("svg");
    for (let item of events) {
        if (item.eventlist.length === 1)
            appendInfoTo(item.eventlist[0], svg.append("image"));
        else {
            // udelej skupinu
            let group = placeGroup(item.eventlist[0].x,item.eventlist[0].y,item.eventlist.length);
            // vloz udalosti se vsemi daty
            for (let [idx, event] in item.eventlist.entries()) {
                event.bck_x = event.bck_x + idx * 50;
                appendInfoTo(event, group.append("image"));
            }
        }
    }
}
// utils.js/build.js
function drawRes(res) {
    for (let item of res.paths) {
        d3.select("svg").append("path")
            .datum(item.datum)
            .attr("class", item.name)
            .attr("stroke", item.color)
            .attr("d", ctx.area);
    }
    placeEvents(res.events);
    placeCommonEvents(res.commonEvents);
}
// utils.js/build.js
// vezme data z databufferu a zkusi je zobrazit
function showPaths () {
    ctx.updateScales();
    let res = order.makeView();
    drawRes(res);
}
// utils.js/build.js
async function calcBFShowPaths() {
    ctx.updateScales();
    let res = order.bruteForceOrder();
    drawRes(res);
}
// utils.js/build.js
async function calcFRQShowPaths() {
    ctx.updateScales();
    let res = order.frequencyTable();
    drawRes(res);
}
// utils.js/build.js
async function calcFMShowPaths() {
    ctx.updateScales();
    order.forceMethod(drawRes);
}
// utils.js/build.js
async function autofill() {
    const ids = [3,19,88,71,40,13,69,21];
    const names = ["Almendor", "Danérie", "Storabsko", "Podzemní ?iše", "Keledor", "Boševal", "Plavena", "Detreon"];
    for (let i = 0; i < ids.length; i++) {
        searchItem.id = ids[i];
        searchItem.name = names[i];
        await saveToBuffer();
    }
    searchItem.id = -1;
}

window.onload = function () {
    const menu = d3.select("body").append("div").attr("class", "menu");
    menu.append("p").text("Eventy k zadanému místu");
    const sel = menu.append("select")
        .attr("id", "catSel");
    sel.append("option")
        .attr("value", "0")
        .attr("title", "Vše")
        .text("Vše");

    getCategories();

    const dropd = menu.append("div")
        .attr("id", "dropdown")
        .on("keyup", (e) => {
            e.preventDefault();
            if (d3.select("#control").node().value !== "" &&
                (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter")) {
                const list = d3.select("#content").node();
                let sel = d3.select("#content .searchSel").node();
                // console.log(sel);
                if (e.key === "ArrowUp") {
                    // console.log(e.key);
                    if (!sel){
                        list.lastElementChild.attributes["class"].value = "searchSel";
                    }
                    else {
                        sel.attributes["class"].value = "";
                        if (sel.previousElementSibling)
                            sel.previousElementSibling.attributes["class"].value = "searchSel";
                        else
                            list.lastElementChild.attributes["class"].value = "searchSel";
                    }
                    sel = d3.select("#content .searchSel").node();
                    sel.scrollIntoView(true);
                }
                if (e.key === "ArrowDown") {
                    // console.log(e.key);
                    if (!sel){
                        list.firstElementChild.attributes["class"].value = "searchSel";
                    }
                    else {
                        sel.attributes["class"].value = "";
                        if (sel.nextElementSibling)
                            sel.nextElementSibling.attributes["class"].value = "searchSel";
                        else
                            list.firstElementChild.attributes["class"].value = "searchSel";
                    }
                    sel = d3.select("#content .searchSel").node();
                    sel.scrollIntoView(true);
                }
                if (e.key === "Enter") {
                    // console.log(e.key);
                    d3.select(sel).dispatch("click");
                    d3.select("#content").style("visibility", "hidden");
                    document.activeElement = undefined;
                }
            }
        });
    dropd.append("input")
        .attr("id", "control")
        .attr("type", "text")
        .attr("value", "")
        .attr("placeholder", "Začněte psát")
        .on("keyup", (e) => {
            if (e.key !== "Escape" && e.key !== "ArrowUp" && e.key !== "ArrowDown"
                && e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Enter")
                searchCats();
        });
    dropd.append("ul")
        .attr("id", "content")
        .style("visibility", "hidden");

    menu.on("keyup", (e) => {
        if (e.key === "Escape") {
            d3.select("#content").style("visibility", "hidden");
            // document.activeElement = undefined;
        }
    })

    menu.on("click", (e) => {
        d3.select("#content").style("visibility", "hidden");
        // document.activeElement = undefined;
    });

    menu.append("button")
        .text("Zobraz eventy")
        .on("click", showEventsToId);

    menu.append("button")
        .attr("class", "loadData")
        .text("Načti data")
        .on("click", saveToBuffer);

    menu.append("button")
        .text("Zobraz cesty")
        .on("click", showPaths);

    menu.append("button")
        .text("Spočitej poradi a zobraz (BF)")
        .on("click", calcBFShowPaths);

    menu.append("button")
        .text("Spočitej poradi a zobraz (FQCY)")
        .on("click", calcFRQShowPaths);

    menu.append("button")
        .text("Spočitej poradi a zobraz (FM)")
        .on("click", calcFMShowPaths);

    // auto zadavani
    menu.append("button")
        .text("Autofill")
        .on("click", autofill);

    d3.select("body").append("div")
        .attr("class", "cnvs");
    d3.select(".cnvs").append("svg")
        .attr("width", "500%")
        .attr("height", "70rem");

    // link na mouseover menu
    // https://medium.com/@kj_schmidt/show-data-on-mouse-over-with-d3-js-3bf598ff8fc2
    // let g = d3.select(".cnvs svg").append("g")
    //     .attr("class", "group")
    //     .on("mouseover", (d) => {
    //         const tmp = d3.select(d.target.parentNode).select("rect");
    //         const l = tmp.attr("length");
    //         tmp.attr("width",l*50);
    //         d3.select(d.target.parentNode).select(".placeholder").attr("display", "none");
    //         d3.select(d.target.parentNode).selectAll(".hideable").nodes().forEach(d => d3.select(d).attr("display", "inherit"));
    //     })
    //     .on("mouseout", (d) => {
    //         d3.select(d.target.parentNode).select("rect").attr("width", 50);
    //         d3.select(d.target.parentNode).select(".placeholder").attr("display", "inherit");
    //         d3.select(d.target.parentNode).selectAll(".hideable").nodes().forEach(d => d3.select(d).attr("display", "none"));
    //     });
    // g.append("rect")
    //     .attr("x", 300)
    //     .attr("y", 300)
    //     .attr("width", 50)
    //     .attr("fill", "antiquewhite")
    //     .attr("length", 5);
    // g.append("image")
    //     .attr("href", "/img/group.png")
    //     .attr("class", "placeholder")
    //     .attr("height", 500)
    //     .attr("x", 300)
    //     .attr("y", 300);
    //
    // const ev = [300,350,400,450,500];
    // const info = {bck_x: 268897,
    //     cls: "Almendor",
    //     desc: "Objevení Žlutého pergamenu, shromáždění na dvoře almendorského krále Belgalada, projev Garonda Dějepravce.",
    //     filters: ["Almendor","Belgedad","Gerond d?jepravec","Žlutý pergamen"],
    //     icon: "/img/war.png",
    //     name: "objevení žlutého pergamenu",
    //     y: 441.5};
    //
    // let div = d3.select(".cnvs").append("div")
    //     .attr("id", "tooltip")
    //     .style("position", "absolute")
    //     .style("opacity", 0);
    // let tmp = div.append("div")
    //     .attr("class", "left");
    // tmp.append("h2");
    // tmp.append("p");
    // tmp = div.append("div")
    //     .attr("class", "right")
    //     .append("ul");
    // for (let i = 0; i < 50; i++ )
    //     tmp.append("li");
    //
    // for (let i of ev) {
    //     let el = g.append("image")
    //         .attr("href", "/img/war.png")
    //         .attr("class", `hideable ${info.cls}`)
    //         .attr("display", "none")
    //         .attr("x", i)
    //         .attr("y", 300);
    //     let desc = makeDescr(info);
    //     tippy(el.node(), {
    //        content: desc.node().innerHTML,
    //        allowHTML: true,
    //        theme: "tooltip"
    //     });
    // }
    d3.select("body").append("div")
        .attr("id", "eventsResult");
}