import "./styles.css";
import Context from "./context.js";
import Build from "./build.js"
import Order from "./order.js"
import Communication from "./communication.js";
import dateUtils from './currentVer/DateUtils.js';

// Tento soubor obsahuje veskera zpetna volani
// nastav potrebne promenne pro vsechny casti interakci
// aktualni vyber
let selection = null;
// ovladani z klavesnice
let keys = {shift: false, ctrl:false, up: false, down: false, d:false, a:false, esc:false};
// promenna drzici veskere potrebne informace
let context = new Context();
// vypocty poradi os
let order = new Order(context);
// vystavba cele vizualizace
let build = new Build(context, order);
// komunikace se serverem
let comm = new Communication(context);
// modalni okno
let modal = build.getElement("#modal_menu");
let modalActive = false;

// nastaveni callbacku
build.setCallBack(".form_control"
    ,"keyup", (e) => {
    if (e.key !== "Escape" && e.key !== "ArrowUp" && e.key !== "ArrowDown"
        && e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Enter")
        comm.searchCats();
});

//callback pro klávesnici/klávesové zkratky
build.setCallBack(".dropdown","keyup", dropDownKeys);
build.setCallBack("#modal_menu","keyup", (e) => {
    if (e.key === "Escape") {
        build.setStyle("#content","visibility", "hidden");
    }
})

// nastav callback pro prvni tlacitko - upravy
build.setCallBack("#add","click",() => {
    activateModal();
    showAdd();
});

// ovladani pomoci klavesnice
build.setCallBack("body", "keydown", keyboardControlDown)
build.setCallBack("body", "keyup", keyboardControlUp)
// prirad callbacky modalnimu oknu
build.setCallBack("#buttons .close","click", closeModal);
build.setCallBack("#add_confirm","click", addPath); // pujde do komunikace
build.setCallBack("#frequency","click", calcFRQShowPaths); // prepocitej dle dane metody - frekvencni
build.setCallBack("#force","click", calcFMShowPaths); // prepocitej dle dane metody - silova
build.setCallBack("#random_order","click", getRandomOrderShowPaths); // prepocitej dle dane metody - nahodne poradi
build.setCallBack("#add_example", "click", autofill); // samo plnici metoda pro ukazku
build.setCallBack("#remove", "click", deleteAllTimeLines); // odstran vse

// vykresleni elmentu vizualizace, pripadne vycisteni zobrazovaci plochy
function orderCbs() {
    if (context.active.length > 0) {
        calcFRQShowPaths();
        build.getAllElements("#emblems .item").nodes().forEach((el) => build.setCallBack(el,"click", selectItem));
        build.getAllElements("#emblems .up").nodes().forEach((el) => build.setCallBack(el,"click", moveUp));
        build.getAllElements("#emblems .down").nodes().forEach((el) => build.setCallBack(el,"click", moveDown));
        build.getAllElements("#emblems .remove").nodes().forEach((el) => build.setCallBack(el,"click", deleteTimeLine));
        build.getAllElements(".colorPicker").nodes().forEach((el) => build.setCallBack(el, "click", editColor));
        build.getAllElements(".inputPicker").nodes().forEach((el) => build.setCallBack(el, "input", changeColor));
    }
    else {
        build.removeItems();
    }
}

// pridani aktualne hledane osy do vizualizace a zobrazeni
async function addPath() {
    // nactu z repre co chci pridat
    await comm.saveToBuffer();
    // necham spocitat poradi a necham zobrazit
    orderCbs();
}

// vycisteni cele vizualizace
function deleteAllTimeLines() {
    build.removeItems();
    context.removeAll();
}

// odstraneni jedne casove osy
function deleteTimeLine(event) {
    let itemClass = event.target.parentElement.className.baseVal;
    context.removeSelected(itemClass);
    build.removeSpecificItems([`.inputPicker.${itemClass}`]);
    if (selection?.className.baseVal === itemClass)
        unselectItem();
    orderCbs();
}

// zmena barvy u osy
function editColor(event) {
    let clsName = event.target.parentNode.attributes["class"].value;
    // console.log(build.getElement(`.inputPicker.${clsName}`));
    let picker = build.getElement(`.inputPicker.${clsName}`);
    picker.attr("value", event.target.attributes["fill"].value);
    // console.log(picker);
    picker.node().click();
}

// postupna aktualizace barvy vsech elementu meneneho prvku
function changeColor(event) {
    // nacti novou barvu
    let newColor = event.target.value;
    // meneny prvek
    let clsName = event.target.classList[event.target.classList.length - 1];
    // zmena barev v datech
    context.changeColor(event.target.defaultValue, newColor);
    // zmena barvy ve vsech dilcich castech
    event.target.defaultValue = newColor;
    let idx = context.active.findIndex(d => d.name === clsName);
    context.active[idx].color = newColor;
    build.getAllElements(`.minimapDraw .${clsName}`).nodes().forEach((d) => {build.setAttrib(d,"fill", newColor)});
    build.getAllElements(`#paths .${clsName}`).nodes().forEach((d) => {build.setAttrib(d,"stroke", newColor)});
    build.setAttrib(`#emblems .${clsName} .colorPicker`,"fill",newColor);
}

// ovladani modalniho okna s moznostmi na pridani nebo vytvoreni ukazky
function activateModal() {
    modalActive = true;
    modal.style("display","inherit");
}

// zavreni modalniho okna
function closeModal() {
    build.getElement(".dropdown .form_control").node().value = "";
    modalActive = false;
    modal.style("display","none");
}

// polozka na pridavani
function showAdd() {
    build.setStyle("#modal_add","visibility", "inherit");
    build.setStyle("#add_confirm","visibility", "inherit");
    build.setStyle("#add_example","visibility", "inherit");
}

// brush event callback
function brushed(event) { // move
    if (event.sourceEvent && event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    // ziskej vyber
    let s = event.selection || context.xt.range();
    // zjisti zmeny ve vyberu
    s = s.map(value => value - build.minimapX);
    context.xt2.domain(s.map(context.xt.invert, context.xt));
    // aktualizuj cesty
    for(let child of build.getElement("#paths").node().children)
        build.getElement(child).attr("d", context.area);
    // prepocitej vizualizaci a zavolej zoom
    build.rescaleTimeline();
    build.getElement("#timestamps").call(context.axis);
    build.getElement("#zoom").call(context.zoom.transform,
        d3.zoomIdentity
        .scale((build.minimapW) / ((s[1]) - (s[0])))
        .translate(-s[0], 0),
        null,
        event);
}
// zoom event callback
function zoomed(event) { // zoom
    if (event.sourceEvent && event.sourceEvent.type === "brush") return;
    // nacti transformaci
    let t = event.transform;
    // spocitej zmenu
    context.xt2.domain(t.rescaleX(context.xt).domain());
    // uprav cesty
    for(let child of build.getElement("#paths").node().children)
        build.getElement(child).attr("d", context.area);
    // posun co je treba
    if (event.sourceEvent) {
        let par = build.getElement(build.getElement("#timelines").node().parentNode);
        let y = Number(par.node().transform.baseVal.consolidate().matrix.f);
        par.attr("transform", `translate(0,${y + event.sourceEvent.movementY})`);
    }
    // prepocitej vizualizaci a zavolej brush
    build.rescaleTimeline();
    build.getElement("#timestamps").call(context.axis);
    build.getElement("#gb").call(context.brush.move, context.xt.range().map(t.invertX, t).map(value => value + build.minimapX), event);
}

// vyber urcitou casovou osu
function selectItem(event) {
    // console.log(event);
    const selIcon = build.getElement("#selected");
    if (selection === null)
        selIcon.style("display", "inherit")
    selection = build.getElement(this.parentNode).node();
    const nY = Number(selection.transform.baseVal.consolidate().matrix.f); // nova y souradnice
    selIcon.attr("y", `${nY - 30}`);
}
// zrus vyber
function unselectItem() {
    selection = null;
    build.setStyle("#selected","display","none");
}

// prohod dve skupiny v reprezentaci
function swapGroups(idx, otherIdx) {
    let clicked = context.activeOrder[idx];
    let other = context.activeOrder[otherIdx];
    let sel = selection ? selection.className.baseVal : undefined;
    let clkedAIdx = context.active.findIndex(e => e.clsName === clicked);
    let abvAIdx = context.active.findIndex(e => e.clsName === other);
    // prohod dve casove osy
    [context.active[clkedAIdx], context.active[abvAIdx]] = [context.active[abvAIdx], context.active[clkedAIdx]];
    [context.activeOrder[idx], context.activeOrder[otherIdx]] = [context.activeOrder[otherIdx], context.activeOrder[idx]];
    // prekresli
    build.drawRes(order.makeView());
    if (sel === clicked)
        moveSelectionTo(clicked);
    if (sel === other)
        moveSelectionTo(other);
}

// pohnu uzlem, posunu ho o jednu nahoru v aktivnim listu, prekreslim
function moveUp() {
    let idx = context.activeOrder.findIndex(e => e === this.parentNode.className.baseVal);
    if (idx !== 0)
        swapGroups(idx, idx - 1);
}

// pohnu uzlem, posunu ho o jednu dolu v aktivnim listu, prekreslim
function moveDown() {
    let idx = context.activeOrder.findIndex(e => e === this.parentNode.className.baseVal);
    if (idx !== context.active.length - 1)
        swapGroups(idx, idx + 1);
}

// pohnu s vyberem linky
function moveSelectionTo(clss) {
    if (selection !== null)
        build.getElement(`#emblems .${clss} .item`).dispatch("click");
}

// vezme data z databufferu a zkusi je zobrazit
function showPaths () {
    context.updateScales();
    build.drawRes(order.makeView());
}

// metoda hrube sily
async function calcBFShowPaths() {
    order.bruteForceOrder(build);
}

// nahodne poradi
async function getRandomOrderShowPaths() {
    let tmpCls = selection?.className.baseVal;
    order.randomOrder(build);
    if (tmpCls)
        clickEmblemItem(tmpCls);
}

// frekvencni tabulka
async function calcFRQShowPaths() {
    let tmpCls = selection?.className.baseVal;
    order.frequencyTable(build);
    if(tmpCls)
        clickEmblemItem(tmpCls);
}

// silova metoda
async function calcFMShowPaths() {
    let tmpCls = selection?.className.baseVal;
    order.forceMethod(build);
    if (tmpCls)
        clickEmblemItem(tmpCls);
}

// automatické testovani / priklad vizualizace
async function autofill() {
    const ids = [3,19,88,71,40,13,69,21];
    const names = ["Almendor", "Danérie", "Storabsko", "Podzemní říše", "Keledor", "Boševal", "Plavena", "Detreon"];
    for (let i = 0; i < names.length; i++) {
        comm.searchItem.id = ids[i];
        comm.searchItem.name = names[i];
        await comm.fetchTags(names[i],[]);
        await addPath();
    }
    comm.searchItem.id = -1;
    comm.searchItem.name = "";
}

// callback pro kliknuti na emblem daneho prvku
function clickEmblemItem(cls) {
    build.getElement(`#emblems .${cls} .item`).dispatch("click");
}

// ovladani klavesnice
function keyboardControlDown(e) {
    if (e.key === "Shift")
        keys.shift = true;
    if (e.key === "Control")
        keys.ctrl = true;
    if (e.key === "ArrowUp")
        keys.up = true;
    if (e.key === "ArrowDown")
        keys.down = true;
    if (e.key === "a")
        keys.a = true;
    if (e.key === "d")
        keys.d = true;
    if (e.key === "Escape")
        keys.esc = true;

    if (keys.esc && modalActive && build.getStyle("#content","visibility") === "hidden"){
        closeModal();
    }
    else if (keys.esc && selection !== null && build.getStyle("#content","visibility") === "hidden") {
        unselectItem();
    }
    if (keys.shift && keys.up && selection !== null && build.getStyle("#content","visibility") === "hidden") {
        e.preventDefault();
        build.getElement(selection).select(".up").dispatch("click");
    }
    if (keys.shift && keys.down && selection !== null && build.getStyle("#content","visibility") === "hidden") {
        e.preventDefault();
        build.getElement(selection).select(".down").dispatch("click");
    }
    if (keys.ctrl && keys.a) {
        e.preventDefault();
        activateModal();
        showAdd();
    }
    if (keys.up && !keys.shift && selection !== null && build.getStyle("#content","visibility") === "hidden"){
        e.preventDefault();
        if (context.activeOrder.length) {
            const sel = context.activeOrder.findIndex(e => e === selection.className.baseVal) - 1;
            if (sel !== -1)
                build.getElement(`#emblems .${context.activeOrder[sel]} .item`).dispatch("click");
        }
    }
    if (keys.up && !keys.shift && selection === null && build.getStyle("#content","visibility") === "hidden"){
        e.preventDefault();
        if (context.activeOrder.length) {
            const sel = context.activeOrder.length - 1;
            build.getElement(`#emblems .${context.activeOrder[sel]} .item`).dispatch("click");
        }
    }
    if (keys.down && !keys.shift && selection !== null && build.getStyle("#content","visibility") === "hidden"){
        e.preventDefault();
        if (context.activeOrder.length) {
            const sel = context.activeOrder.findIndex(e => e === selection.className.baseVal) + 1;
            if (sel !== context.activeOrder.length)
                build.getElement(`#emblems .${context.activeOrder[sel]} .item`).dispatch("click");
        }
    }
    if (keys.down && !keys.shift && selection === null && build.getStyle("#content","visibility") === "hidden"){
        e.preventDefault();
        if (context.activeOrder.length) {
            build.getElement(`#emblems .${context.activeOrder[0]} .item`).dispatch("click");
        }
    }
}

function keyboardControlUp(e) {
    if (e.key === "Shift")
        keys.shift = false;
    if (e.key === "Control")
        keys.ctrl = false;
    if (e.key === "ArrowUp")
        keys.up = false;
    if (e.key === "ArrowDown")
        keys.down = false;
    if (e.key === "a")
        keys.a = false;
    if (e.key === "d")
        keys.d = false;
    if (e.key === "Escape")
        keys.esc = false;
}

// ovladani dropdown nabidky pri pridavani jednotlivych polozek
function dropDownKeys (e){
    e.preventDefault();
    if (build.getElement(".form_control").node().value !== "" &&
        (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter")) {
        const list = build.getElement("#content").node();
        let sel = build.getElement("#content .searchSel").node();
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
            sel = build.getElement("#content .searchSel").node();
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
            sel = build.getElement("#content .searchSel").node();
            sel.scrollIntoView(true);
        }
        if (e.key === "Enter") {
            // console.log(e.key);
            build.getElement(sel).dispatch("click");
            build.setStyle("#content","visibility", "hidden");
        }
    }
}

// nastartovani vsech podcasti - vykresleni, ziskani poradi barev, informaci o minimape, ...
let info = build.getMinimapInfo();
context.shuffelColors();

context.setBrush(info, brushed);
context.setZoom(info, zoomed);

context.axis.tickFormat((d) => {return dateUtils.getDateName(d)});
context.updateBrushZoomAxis(info);
build.getElement("#timestamps").attr("transform", `translate(0,${build.getElement(".canvasDraw").node().clientHeight - 160})`);
