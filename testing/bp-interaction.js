import dateUtils from '../currentVer/DateUtils.js';

// ovladani emblemu
d3.selectAll(".up").each(function(d,i) {d3.select(this).on("click",moveUp);});
d3.selectAll(".down").each(function(d,i) {d3.select(this).on("click",moveDown);});
d3.selectAll("#emblems .item").each(function (d,i) {d3.select(this).on("click", selectItem);});
d3.selectAll("#emblems .edit").each(function (d,i) {d3.select(this).on("click", activateModal);});

// klavesy
d3.select("body").on("keydown", keyboardControlDown)
d3.select("body").on("keyup", keyboardControlUp)

// modalni okno pro moznosti
const modal = d3.select("#modal_menu");
let modalActive = false;
// prirad callbacky
d3.select("#buttons .close").on("click", closeModal);
d3.select("#buttons .add").on("click", showAdd);
d3.select("#buttons .edit").on("click", showEdit);
d3.select("#buttons .del").on("click", showRemove);
d3.select("#del_confirm").on("click", deleteSelected);
d3.select("#add_confirm").on("click", addEmblem);
d3.select("#edit_confirm").on("click", editSelected);

// natav callback pro prvni tlacitko - upravy
d3.select(d3.select(".links").node().firstElementChild).on("click", function () {activateModal(); showAdd();});

// zmena vyberu zmene vyberu v modal okne
d3.select(".form_select").selectAll("option").each(
    function(d,i) {
        if (this.index) {
            d3.select(this).on("click", () => {
                d3.select(`#emblems .${this.title} .item`).dispatch("click");
                changeModalSelection();
            });
        }
        else {
            d3.select(this).on("click",() => {d3.select("#modal_select img").attr("src", "../img/eternity.png"); unselectItem();});
        }
    });

// aktualni vyber
let selection = null;
// ovladani z klavesnice
let keys = {shift: false, ctrl:false, up: false, down: false, e: false, d:false, a:false, esc:false};

function moveUp(e) {
    const node = d3.select(this.parentNode).node(); // aktualni node
    const parparnode = node.parentNode;
    const prevsib = node.previousElementSibling; // jeho predchudce
    if (prevsib) {
        parparnode.insertBefore(node, prevsib);
        swapGroups(node,prevsib);
        // TODO prohazovani os !!!
        // pohni s vyberem
        moveSelection(node, prevsib);
    } else {
        console.log("cant move node")
    }
}

function moveDown(e) {
    const node = d3.select(this.parentNode).node(); // aktualni node
    const parparnode = node.parentNode; // cela skupina
    const nextsib = node.nextElementSibling; // jeho nasledovnik
    if (nextsib) {
        if (nextsib.nextElementSibling)
            parparnode.insertBefore(node, nextsib.nextElementSibling);
        else
            parparnode.append(node);
        swapGroups(node,nextsib)
        // TODO prohazovani os !!!
        // pohni s vyberem
        moveSelection(node, nextsib);
    } else {
        console.log("cant move node")
    }
}

// ovladani modalniho okna s moznostmi na pridani, vymazani, zmenu
function activateModal() {
    modalActive = true;
    // console.log(modal);
    modal.style("display","inherit");
}

function closeModal() {
    modalActive = false;
    // console.log(modal);
    modal.style("display","none");
}

function changeModalSelection() {
    const clrPicker = d3.select("#edit_color").node();
    if (selection) {
        const clsName = selection.className.baseVal;
        let col = d3.color(d3.select(`#paths .${clsName}`).attr("stroke"));
        //https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        col = "#" + (((1 << 24) + (col.r << 16) + (col.g << 8) + col.b).toString(16).slice(1));
        clrPicker.value = col;
        d3.select("#modal_select img").attr("src", `../img/${clsName}.png`);
        let form = d3.select(".form_select").node();
        for (let opt of form.options){
            if (opt.title.includes(clsName)) {
                form.selectedIndex = opt.value;
                break;
            }
        }
    } else {
        d3.select(".form_select").node().selectedIndex = 0;
        d3.select("#modal_select img").attr("src", `../img/eternity.png`);
    }
}

// prepinani modalniho okna
function showEdit() {
    d3.select("#modal_select").style("visibility", "inherit");
    d3.select("#del_confirm").style("visibility", "hidden");
    d3.select("#modal_add").style("visibility", "inherit");
    d3.select("#add_confirm").style("visibility", "hidden");
    d3.select("#modal_edit").style("visibility", "inherit");
    d3.select("#edit_confirm").style("visibility", "inherit");
    changeModalSelection();
}

function showAdd() {
    d3.select("#modal_select").style("visibility", "hidden");
    d3.select("#del_confirm").style("visibility", "hidden");
    d3.select("#modal_add").style("visibility", "inherit");
    d3.select("#add_confirm").style("visibility", "inherit");
    d3.select("#modal_edit").style("visibility", "inherit");
    d3.select("#edit_confirm").style("visibility", "hidden");
}

function showRemove() {
    d3.select("#modal_select").style("visibility", "inherit");
    d3.select("#del_confirm").style("visibility", "inherit");
    d3.select("#modal_add").style("visibility", "hidden");
    d3.select("#add_confirm").style("visibility", "hidden");
    d3.select("#modal_edit").style("visibility", "hidden");
    d3.select("#edit_confirm").style("visibility", "hidden");
}

// z modalniho okna vymaze casti vyberu, nekolik mist kam pujde, build, context
function deleteSelected() {
    let selected = d3.select("#modal_select .form_select").node();
    let emblems = d3.select("#emblems").node();
    if (selected.selectedIndex !== 0) {
        selected = selected[selected.selectedIndex].title;
        let remove = d3.select(`#emblems .${selected}`).node();
        if (!remove)
            return;
        if (remove !== emblems.lastElementChild) {
            console.log("difficult");
            let nextElSib = remove.nextElementSibling;
            let newY = Number(remove.transform.baseVal.consolidate().matrix.f);
            let oldY = Number(nextElSib.transform.baseVal.consolidate().matrix.f);
            while (nextElSib) {
                nextElSib.setAttribute("transform", `translate(0,${newY})`);
                newY = oldY;
                nextElSib = nextElSib.nextElementSibling;
                if (nextElSib)
                    oldY = Number(nextElSib.transform.baseVal.consolidate().matrix.f);
            }
        }
        if (remove === selection)
            unselectItem();
        emblems.removeChild(remove);
        selected = d3.select("#modal_select .form_select").node();
        selected.removeChild(selected[selected.selectedIndex]);
    } else {
        unselectItem();
        let child = emblems.lastElementChild;
        while (child) {
            emblems.removeChild(child);
            child = emblems.lastElementChild;
        }
    }
    // TODO: predelat cesty dle noveho rozvrzeni, pokud se odstranila jen posledni, pohoda
}

// pridavani prvku modal| pujde do build.js
function addImg(g, cls, imgPath, x, y, h, w, cb, transf) {
    const newImg = g.append("image");
    newImg.attr("class", cls);
    newImg.attr("href", imgPath);
    newImg.attr("x",x);
    newImg.attr("y",y);
    newImg.attr("height", h);
    newImg.attr("width", w);
    if (transf !== undefined)
        newImg.attr("transform", transf);
    newImg.on("click", cb);
}

// půjde do build.js
function addEmblem() {
    const embls = d3.select("#emblems");
    let lastY = embls.node().lastElementChild.getAttribute("transform");
    lastY = lastY.split(",");
    lastY = Number(lastY[lastY.length - 1].slice(0,-1));
    const name = d3.select("#modal_add .dropdown .form_control").node().value.toLowerCase();
    //const cat = d3.select("#modal_add .form_select").text.toLowerCase();
    const newGroup = embls.append("g")
        .attr("class", `${name}`)
        .attr("transform", `translate(0,${lastY + 170})`);
    newGroup.append("rect")
        .attr("class", "background")
        .attr("x", "-90")
        .attr("y", "-15")
        .attr("width", "145")
        .attr("height", "125");
    newGroup.append("text")
        .attr("x", "15")
        .attr("y", "0")
        .text(`${name[0].toUpperCase() + name.slice(1)}`);
    // imgs
    //     kam      tridy   obrazek                x    y      h      w    cb   opt(translate)
    // bude treba nastavovat spravne obrazky
    addImg(newGroup, "item", "/img/misto.png", "0", "10", "100", "100", selectItem)
    addImg(newGroup, "up hideable", "/img/smallArrow.png", "-60", "-20", "40", "40", moveUp);
    addImg(newGroup, "down hideable", "/img/smallArrow.png", "20", "-120", "40", "40", moveDown, "rotate(180)");
    newGroup.append("rect")
        .attr("class", "edit hideable")
        .attr("x", "-80")
        .attr("y", "30")
        .attr("width", "80")
        .attr("height", "40")
        .attr("fill", "white")
        .attr("rx", "15")
        .on("click", activateModal);
    newGroup.append("text")
        .attr("class", "hideable")
        .attr("x", "-72")
        .attr("y", "55")
        .text("Upravit");
    addPath(name);
}

// TODO: potrebuje prepsat aby brala v potaz i udalosti | pujde do build.js
function addPath(name) {
    const paths = d3.select("#paths");
    const lineY = Number(paths.node().childElementCount) * 170;
    const selectedCol = d3.select("#edit_color").node().value;
    // const path = d3.path();
    // path.moveTo(0, lineY.toString());
    // path.lineTo(1500, lineY.toString());
    const p = paths.append("path")
        .datum([{x:0,y:lineY},{x:1500, y:lineY}])
        .attr("class", `${name}`)
        .attr("stroke", selectedCol.toString())
        .attr("d", area);
}

// úprava z modalniho okna | mozna do build.js
// TODO: celkova zmena dane linie, zatim je jen barva
function editSelected() {
    let selected = d3.select("#modal_select .form_select").node();
    if (selected.selectedIndex !== 0 || selection){
        const clsName = selected[selected.selectedIndex].title;
        const path = d3.select(`#paths .${clsName}`);
        const color = d3.select("#edit_color").node().value;
        path.attr("stroke", color);
    }
    else {
        alert("Nejdříve je nutné vybrat jednu z existujících linek.");
    }
}

// Helper functions | build.js
function rescaleTimeline(p,j) {
    // const scale = d3.select("#paths").node().transform.baseVal.consolidate().matrix.a;
    // console.log(currentScale);
    const x = Number(d3.select(this).attr("bckp-x"));
    // console.log(`${scale} * ${x} = ${scale * x}`);
    d3.select(this).attr("x", `${xt2(x)}`);
}

// prohoď skupinu a s b
function swapGroups(a, b) {
    const aMat = a.transform.baseVal.consolidate().matrix;
    const bMat = b.transform.baseVal.consolidate().matrix;
    a.transform.baseVal.consolidate().setTranslate(bMat.e, bMat.f)
    b.transform.baseVal.consolidate().setTranslate(aMat.e, aMat.f)
}

// vyber urcitou linku
function selectItem() {
    const selIcon = d3.select("#selected");
    if (selection === null)
        selIcon.style("display", "inherit")
    selection = d3.select(this.parentNode).node();
    const nY = Number(selection.transform.baseVal.consolidate().matrix.f); // nova y souradnice
    selIcon.attr("y", `${nY + 20}`);
}

function unselectItem() {
    selection = null;
    d3.select("#selected").style("display","none");
}

// pohnu s vybranou linkou
function moveSelection(node, prevsib) {
    if (selection === node)
        d3.select(`#emblems .${node.className.baseVal} .item`).dispatch("click");
    if (selection === prevsib)
        d3.select(`#emblems .${prevsib.className.baseVal} .item`).dispatch("click");
}

function keyboardControlDown(e) {
    if (e.key === "Shift")
        keys.shift = true;
    if (e.key === "Control")
        keys.ctrl = true;
    if (e.key === "ArrowUp")
        keys.up = true;
    if (e.key === "ArrowDown")
        keys.down = true;
    if (e.key === "e")
        keys.e = true;
    if (e.key === "a")
        keys.a = true;
    if (e.key === "d")
        keys.d = true;
    if (e.key === "Escape")
        keys.esc = true;

    if (keys.esc && modalActive){
        closeModal();
    }
    else if (keys.esc && selection !== null) {
        unselectItem();
    }
    if (keys.shift && keys.up && selection !== null) {
        e.preventDefault();
        console.log("hey move up");
        d3.select(`#emblems .${selection.className.baseVal} .up`).dispatch("click");
    }
    if (keys.shift && keys.down && selection !== null) {
        e.preventDefault();
        console.log("hey move down");
        d3.select(`#emblems .${selection.className.baseVal} .down`).dispatch("click");
    }
    // TODO: spravne prirazovani do kolonek - dalsi funkce asi
    if (keys.ctrl && keys.e && selection !== null){
        e.preventDefault();
        // console.log("edit selected");
        activateModal();
        showEdit();
    }
    if (keys.ctrl && keys.a) {
        e.preventDefault();
        // console.log("add new");
        activateModal();
        showAdd();
    }
    if (keys.ctrl && keys.d && selection !== null) {
        e.preventDefault();
        // console.log("delete selected");
        activateModal();
        showRemove();
    }
    if (keys.up && !keys.shift && selection !== null){
        e.preventDefault();
        const sel = d3.select(selection).node().previousElementSibling;
        if (sel !== null || sel)
            d3.select(`#emblems .${sel.className.baseVal} .item`).dispatch("click");
    }
    if (keys.up && !keys.shift && selection === null){
        e.preventDefault();
        const sel = d3.select("#emblems").node().lastElementChild.className;
        d3.select(`#emblems .${sel.baseVal} .item`).dispatch("click");
    }
    if (keys.down && !keys.shift && selection !== null){
        e.preventDefault();
        const sel = d3.select(selection).node().nextElementSibling;
        if (sel !== null)
            d3.select(`#emblems .${sel.className.baseVal} .item`).dispatch("click");
    }
    if (keys.down && !keys.shift && selection === null){
        e.preventDefault();
        const sel = d3.select("#emblems").node().firstElementChild.className;
        d3.select(`#emblems .${sel.baseVal} .item`).dispatch("click");
    }
    //e.preventDefault();
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
    if (e.key === "e")
        keys.e = false;
    if (e.key === "a")
        keys.a = false;
    if (e.key === "d")
        keys.d = false;
    if (e.key === "Escape")
        keys.esc = false;
}

// https://observablehq.com/@d3/focus-context
// https://bl.ocks.org/emilyinamillion/fc1593aea93089bab61b2c71ef2e9544
// https://www.freecodecamp.org/news/get-ready-to-zoom-and-pan-like-a-pro-after-reading-this-in-depth-tutorial-5d963b0a153e/
// https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172
// https://bl.ocks.org/andrew-reid/33ed41fa918af88de8b447da3786de0f
// https://github.com/d3/d3-zoom/issues/222
// osa pro datumy
// https://www.d3indepth.com/axes/
// https://ghenshaw-work.medium.com/customizing-axes-in-d3-js-99d58863738b

// brush & zoom part
const lowerEnd = -100;
const upperEnd = -200;
const xt = d3.scaleLinear()     .domain([lowerEnd,20000]).range([0,700]);
const xt2 = d3.scaleLinear()    .domain(xt.domain()).range([200,d3.select(".canvasDraw").node().clientWidth - 50]);

let axis = d3.axisBottom(xt2)
    .ticks(15)
    .tickSizeInner(-900)
    .tickSizeOuter(0)
    .tickFormat((d) => {return dateUtils.getDateName(d)});

let area = d3.area()
    .curve(d3.curveMonotoneX)
    .x((d) => {return xt2(d.x)})
    .y0(0)
    .y((d) => {return(d.y)})

const brush = d3.brushX()
    .extent([[130,4],[830,30]])
    .on("brush", brushed);

// translate extent bude treba dopocitavat
const zoom = d3.zoom()
    .scaleExtent([1, 1000])
    // .translateExtent([[0,0],[d3.select(".canvasDraw").node().clientWidth, d3.select(".canvasDraw").node().clientHeight]])
    // .translateExtent([[105,0],[d3.select(".canvasDraw").node().clientWidth, d3.select(".canvasDraw").node().clientHeight]])
    .translateExtent([[0,0],[700, d3.select(".canvasDraw").node().clientHeight]])
    .extent([[0,0],[700,d3.select(".canvasDraw").node().clientHeight]])
    .on("zoom", zoomed);

function brushed(event) { // move
    // console.log(d3.select(".canvasDraw").node().clientWidth);
    if (event.sourceEvent && event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    let s = event.selection || xt.range();
    // posun o to, kde zacina minimapa
    s = s.map(value => value - 130);
    xt2.domain(s.map(xt.invert, xt));
    for(let child of d3.select("#paths").node().children)
        d3.select(child).attr("d", area);
    d3.select("#timelines").selectAll("image").each(rescaleTimeline);
    d3.select("#timestamps").call(axis);
    d3.select("#zoom").call(zoom.transform,
        d3.zoomIdentity
        .scale((700) / ((s[1]) - (s[0])))
        .translate(-s[0], 0),
        null,
        event);
}

function zoomed(event) { // zoom
    if (event.sourceEvent && event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    let t = event.transform;
    xt2.domain(t.rescaleX(xt).domain());
    for(let child of d3.select("#paths").node().children)
        d3.select(child).attr("d", area);
    if (event.sourceEvent) {
        let par = d3.select(d3.select("#timelines").node().parentNode);
        let y = Number(par.node().transform.baseVal.consolidate().matrix.f);
        par.attr("transform", `translate(0,${y + event.sourceEvent.movementY})`);
    }
    d3.select("#timelines").selectAll("image").each(rescaleTimeline);
    d3.select("#timestamps").call(axis);
    d3.select("#gb").call(brush.move, xt.range().map(t.invertX, t).map(value => value + 130), event);
}

window.onload = () => {
    // d3.select(".canvasDraw").append("circle")
    //     .attr("cx", "67.5")
    //     .attr("cy", "0")
    //     .attr("r", "5")
    //     .attr("fill","red");
    // d3.select(".canvasDraw").append("circle")
    //     .attr("cx", "135")
    //     .attr("cy", "0")
    //     .attr("r", "5")
    //     .attr("fill","red");

    const gz = d3.select("#zoom")
        .attr("width", d3.select(".canvasDraw").node().clientWidth - 200)
        .attr("height", d3.select(".canvasDraw").node().clientHeight)
        .attr("transform", "translate(" + 200 + "," + 0 + ")")
        .call(zoom);

    const gb = d3.select(".minimapDraw")
        .append("g")
        .attr("id", "gb")
        .call(brush)
        .call(brush.move, xt.range().map(value => value + 130));
    //                                                    | posun o to, kde zacina minimapa

    // d3.select(".canvasDraw").call(zoom);
    const paths = d3.select("#paths");
    paths.append("path")
        .datum([{x: -30000,y:0}, {x:6000, y:0}])
        .attr("class", "Almendor")
        .attr("stroke", "red")
        .attr("d", area);

    paths.append("path")
        .datum([{x: -300,y:170}, {x:20000, y:170}])
        .attr("class", "Danérie")
        .attr("stroke", "blue")
        .attr("d", area);

    paths.append("path")
        .datum([{x: 0,y:340}, {x:1500, y:340}])
        .attr("class", "Keledor")
        .attr("stroke", "yellow")
        .attr("d", area);

    const minimap = d3.select(".minimapDraw");
    const evs = [{"cx":400, "col":"blue"}, {"cx":20000, "col":"blue"}, {"cx":6000, "col":"red"}, {cx: 0, col: "yellow"}];
    for(const item of evs) {
        minimap.append("circle")
            .attr("r", "5")
            .attr("cy", "17.5")
            .attr("cx", `${xt(item.cx) + 130}`)
            .attr("fill", `${item.col}`);
    }
};

// TODO: nezapomenout odoznacovat mazane veci #DONE
// TODO: menit vyber a barvy v modal okne dle vyberu v modal_del -> modal_select (nutno prejmenovat) #DONE/sortof
// TODO: vymyslet predavani z modalniho okna, mozna podtrida
// TODO: animace pri pocitani poradi? spise ne, nice to have
// TODO: vypocty poradi - prvni poradi, brute force, silove modely  #DONE prototypes
// https://stackoverflow.com/questions/42070839/intersection-of-2-svg-paths
// FIXME: prepocitavani os #DONE vymysleno na papire
// TODO: rozmyslet, jak udělat, když bude více os a budou přetékat zobrazení -> posouvání #DONE
// TODO: udrzeni si nactenych dat mezi reloady, odkaz nize
// https://stackoverflow.com/questions/17591447/how-to-reload-current-page-without-losing-any-form-data