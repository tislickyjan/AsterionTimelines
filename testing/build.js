import dateUtils from '../currentVer/DateUtils.js';

let header = document.createElement("div");
let minimap = document.createElement("div");
let canvas = document.createElement("div");
let modal_menu = document.createElement("div");
let footer = document.createElement("div");
let viz = document.createElement("div");

function buildViz() {
    // pridej atributy
    d3.select(viz).attr("id", "viz");
    // postav a pridej header
    buildHeader();
    viz.append(header);
    // postav a pridej minimapu
    buildMinimap();
    viz.append(minimap);
    // postav a pridej platno
    buildCnvs();
    viz.append(canvas);
    // postav a pridej modal menu
    buildModal();
    viz.append(modal_menu);
    // postav a pridej konec
    buildFooter();
    viz.append(footer);
}

function buildHeader() {
    d3.select(header).attr("id", "header");
    const title = d3.select(header).append("div");
    title.attr("class", "title")
        .append("h1")
        .text("Asterion Timelines");
    const links = d3.select(header).append("div");
    links.attr("class", "links");
    links.append("a")
        .text("Upravit");
    links.append("a")
        .attr("href", "./help.html")
        .text("Nápověda");
    links.append("a")
        .attr("href", "https://asterionrpg.cz/")
        .text("Asterion");
    links.append("a")
        .attr("href", "https://discord.com/invite/vAzSaYc")
        .text("Discord");
}

function buildMinimap() {
    d3.select(minimap).attr("class", "minimap");
    let starttime = BrowserText.getWidth(dateUtils.getDateName(0), 16 ,"Arial Black")/2;
    let endtime = BrowserText.getWidth(dateUtils.getDateName(3699999), 16 ,"Arial Black")/2;
    const focus_begin = 0.12 * window.innerWidth;
    const boundWidth = 0.76 * window.innerWidth;
    // const dateWidth = 0.15 * (window.innerWidth - boundWidth)/2;
    const dateWidth = (window.innerWidth - boundWidth)/4;
    // console.log(dateWidth);
    const svg = d3.select(minimap)
        .append("svg")
        .attr("class", "minimapDraw");
    svg.append("text")
        .attr("id", "start_time")
        .attr("x", `${dateWidth - starttime}`)
        .attr("y", `${65}%`)
        .text(dateUtils.getDateName(0));
    svg.append("rect")
        .attr("id", "minimap_Bound")
        .attr("x", `${focus_begin}`)
        .attr("y","5")
        .attr("height", "25")
        .attr("width", `${boundWidth}`);
    svg.append("text")
        .attr("id", "end_time")
        .attr("x", `${focus_begin + boundWidth + dateWidth - endtime}`)
        .attr("y", `${65}%`)
        .text(dateUtils.getDateName(3699999));
}

function buildCnvs() {
    d3.select(canvas)
        .attr("class", "canvas");
    const svg = d3.select(canvas)
        .append("svg")
        .attr("height", "100%")
        .attr("width", "100%");
    svg.append("g")
        .attr("id", "timestamps")
        .attr("transform", "translate(200,950)");
    const cnvs = svg.append("g");
    cnvs.attr("transform", "translate(0,100)");
    let tmp = cnvs.append("g").attr("id", "timelines");
    tmp = tmp.append("g").attr("id", "timeline_els").attr("transform", "translate(0,200)");
    tmp.append("g").attr("id", "paths");
    cnvs.append("rect")
        .attr("id", "lampshade")
        .attr("x", "0")
        .attr("y", "-100")
        .attr("height", "100%")
        .attr("width", "200")
        .attr("fill", "lightgray");
    cnvs.append("image")
        .attr("id", "selected")
        .attr("x", "100")
        .attr("y", "0")
        .attr("width", "100")
        .attr("height", "100")
        .attr("href", "../img/war.png"); // TODO: dynamicky doplnit adresu obrazku
    cnvs.append("g")
        .attr("id", "emblems")
        .attr("transform", "translate(90,0)");
}

function addButton(to, clss, text) {
    to.append("button")
        .attr("class", clss)
        .text(text);
}

function buildModal() {
    const content = d3.select(modal_menu).attr("id", "modal_menu").append("div").attr("class", "content");
    let tmp = content.append("div")
        .attr("id", "buttons");
    addButton(tmp, "mod_item edit", "Upravit");
    addButton(tmp, "mod_item add", "Přidat");
    addButton(tmp, "mod_item del", "Odebrat");
    addButton(tmp, "close", "X");
    content.append("hr");
    const tabs = content.append("div")
        .attr("class", "tabs");
    tmp = tabs.append("div")
        .attr("id", "modal_remove")
    tmp.append("p").text("Vyberte");
    let form = tmp.append("select").attr("class", "form_select");
    form.append("option")
        .attr("value", "0")
        .attr("title", "Vše")
        .attr("selected", "")
        .text("Vše");
    tmp.append("img")
        .attr("src", "")
        .attr("alt", "Vyberte ze zobrazených");
    tmp.append("button")
        .attr("id", "del_confirm")
        .text("Vymazat");
    tmp = tabs.append("div")
        .attr("id", "modal_add");
    tmp.append("p").text("Dostupné kategorie:");
    form = tmp.append("select").attr("class", "form_select")
    form.append("option")
        .attr("value", "0")
        .attr("title", "Všechny kategorie")
        .attr("selected", "")
        .text("Vše");
    tmp.append("p").text("Přesné vyhledávání");
    form = tmp.append("div").attr("class", "dropdown");
    form.append("input")
        .attr("class", "form_control")
        .attr("type", "text")
        .attr("value", "");
    tmp.append("button")
        .attr("id", "add_confirm")
        .text("Potvrdit");
    tmp = tabs.append("div")
        .attr("id", "modal_edit");
    tmp.append("p")
        .text("Vyberte barvu:");
    tmp.append("input")
        .attr("id", "edit_color")
        .attr("type", "color");
    tmp.append("button")
        .attr("id", "edit_confirm")
        .text("Změň");
}

function buildFooter() {
    const date = new Date();
    d3.select(footer).attr("id","footer");
    d3.select(footer).append("p")
        .text(`2021 - ${date.getFullYear()} ©`)
        .append("a")
        .attr("href", "./about.html")
        .text("O nás")
}

// #TODO: aktualizace soucasti kontextu -> xt, xt2, minimap, brush, zoom plus prekreslit aktualni vizualizaci, pokud nejaka je
window.addEventListener("resize", () => {
    let tmp = d3.select(".minimapDraw");
    tmp.remove(tmp.firstElementChild);
    buildMinimap();
    tmp = d3.select(".canvas svg");
    tmp.remove(tmp.firstElementChild);
    buildCnvs();
});

//--------utils------------------------ //TODO: potrebuje vlastni soubor??
//https://stackoverflow.com/questions/29031659/calculate-width-of-text-before-drawing-the-text
const BrowserText = (function () {
    let canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    /**
     * Measures the rendered width of arbitrary text given the font size and font face
     * @param {string} text The text to measure
     * @param {number} fontSize The font size in pixels
     * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
     * @returns {number} The width of the text
     **/
    function getWidth(text, fontSize, fontFace) {
        context.font = fontSize + 'px ' + fontFace;
        return context.measureText(text).width;
    }

    return {
        getWidth: getWidth
    };
})();

window.onload = function () {
    buildViz();
    document.body.append(viz);
}