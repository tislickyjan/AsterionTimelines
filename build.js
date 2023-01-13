// trida pro vystvabu cele stranky plus zmeny a aktualizace
// utilita z bp Zimmermanova - prepocet pozice na casovou znacku
import dateUtils from "./currentVer/DateUtils.js";

export default class Build {
    // minimalni velikost obrazku udalosti
    minWidthEvent = 50;
    //konstruktor tridi build
    constructor(context, order) {
        this.context = context;
        this.order = order;
        this.header = document.createElement("div");
        this.minimap = document.createElement("div");
        this.canvas = document.createElement("div");
        this.modal_menu = document.createElement("div");
        this.footer = document.createElement("div");
        this.viz = document.createElement("div");

        // zmena velikosti okna s vizualizaci
        window.addEventListener("resize", () => {
            let tmp = d3.select(".minimapDraw");
            tmp.remove(tmp.firstElementChild);
            this.buildMinimap();
            if (context.active.length > 0) {
                this.context.updateBrushZoomAxis(this.getMinimapInfo());
                this.context.updateScales();
                d3.select("#timestamps").attr("transform", `translate(0,${d3.select(".canvasDraw").node().clientHeight - 160})`);
                this.drawRes(this.order.makeView());
            }
            this.moveButtons();
        });

        // vytvoreni cele vizualizace, zatim jen virtualne
        this.buildViz();
        // pripojeni vizualizace do okna prohlizece
        document.body.append(this.viz);
        // prepocitani pozice tlacitek pro pridani/odebrani
        this.moveButtons();
        // nacteni velikosti
        this.minimapX = Number(d3.select("#minimap_Bound").attr("x"));
        this.minimapW = Number(d3.select("#minimap_Bound").attr("width"));
    }

    // vraci x a width minimapy
    getMinimapInfo() {
        let tmp = d3.select(".minimapDraw #minimap_Bound");
        this.minimapX = Number(tmp.attr("x"));
        this.minimapW = Number(tmp.attr("width"));
        return {x:Number(tmp.attr("x")), width: Number(tmp.attr("width"))};
    }

    //------------------------------------------------------------------
    //------------------build-whole-viz---------------------------------
    // postav hlavni element vizualizace, div kontejner s jednotlivymi podcastmi
    buildViz() {
        // pridej atributy
        d3.select(this.viz).attr("id", "viz");
        // postav a pridej header
        this.buildHeader();
        this.viz.append(this.header);
        // postav a pridej minimapu
        this.buildMinimap();
        this.viz.append(this.minimap);
        // postav a pridej platno
        this.buildCnvs();
        this.viz.append(this.canvas);
        // postav a pridej modal menu
        this.buildModal();
        this.viz.append(this.modal_menu);
        // postav a pridej konec
        this.buildFooter();
        this.viz.append(this.footer);
    }

    // vytvor zahlavi
    buildHeader() {
        d3.select(this.header).attr("id", "header");
        const title = d3.select(this.header).append("div");
        title.attr("class", "title")
            .append("h1")
            .text("Asterion Timelines");
        const links = d3.select(this.header).append("div");
        links.attr("class", "links");
        // links.append("a")
        //     .text("Upravit");
        links.append("a")
            .attr("href", "./help.html")
            .append("img")
                .attr("src", require("./img/help.png"));
        links.append("a")
            .attr("href", "https://discord.com/invite/vAzSaYc")
            .append("img")
                .attr("src", require("./img/discord.png"));
        links.append("a")
            .attr("href", "https://asterionrpg.cz/")
            .append("img")
                .attr("src", require("./img/asterionrpg.png"));
    }

    // vytvor minimapu
    buildMinimap() {
        d3.select(this.minimap).attr("class", "minimap");
        let starttime = this.BrowserText.getWidth(dateUtils.getDateName(0), 16 ,"Arial Black")/3;
        let endtime = this.BrowserText.getWidth(dateUtils.getDateName(3699999), 16 ,"Arial Black")/3;
        const focus_begin = 0.12 * window.innerWidth;
        const boundWidth = 0.76 * window.innerWidth;
        // const dateWidth = 0.15 * (window.innerWidth - boundWidth)/2;
        const dateWidth = (window.innerWidth - boundWidth)/4;
        const yDatePosition = 65;
        // console.log(dateWidth);
        const svg = d3.select(this.minimap)
            .append("svg")
            .attr("class", "minimapDraw");
        svg.append("text")
            .attr("id", "start_time")
            .attr("x", `${dateWidth - starttime}`)
            .attr("y", `${yDatePosition}%`)
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
            .attr("y", `${yDatePosition}%`)
            .text(dateUtils.getDateName(3699999));
        svg.append("g")
            .attr("id", "gb");
    }

    // vytvor hlavni zobrazovaci plochu
    buildCnvs() {
        d3.select(this.canvas)
            .attr("class", "canvas");
        const svg = d3.select(this.canvas)
            .append("svg")
            .attr("class", "canvasDraw")
            .attr("height", "100%")
            .attr("width", "100%");
        svg.append("rect")
            .attr("id", "zoom");
        svg.append("g")
            .attr("id", "timestamps")
            .attr("transform", "translate(0,960)");
        const cnvs = svg.append("g").attr("transform", "translate(0,0)");
        let tmp = cnvs.append("g").attr("id", "timelines");
        tmp = tmp.append("g").attr("id", "timeline_els");
        tmp.append("g").attr("id", "paths");
        cnvs.append("rect")
            .attr("id", "lampshade")
            .attr("x", "0")
            .attr("y", "-2000")
            .attr("height", "900%")
            .attr("width", "200");
        cnvs.append("image")
            .attr("id", "selected")
            .attr("x", "40")
            .attr("y", "0")
            .attr("width", "100")
            .attr("height", "100")
            .attr("href", require("./img/selection.png"));
        cnvs.append("g")
            .attr("id", "emblems")
            .attr("transform", "translate(90,-50)");

        this.addButtonCnvs(svg, 0, "add", require("./img/add.png"), 60, 10, "Přidej", "příběh", 10);
        this.addButtonCnvs(svg, 100, "remove", require("./img/delete.png"), 60, 110, "Smaž", "vše", 125);
    }

    // pridej svg tlacitko do hlavni zobrazovaci plochy
    addButtonCnvs(to,xCoord, groupId, img, imgWidth, imgX, textA, textB, textX) {
        let button = to.append("g")
            .attr("id", groupId);
        button.append("rect")
            .attr("width","100")
            .attr("height", "100")
            .attr("x", xCoord)
            .attr("y", "0");
        button.append("image")
            .attr("href", img)
            .attr("width", imgWidth)
            .attr("y", "5")
            .attr("x", imgX);
        button.append("text")
            .text(textA)
            .attr("y", "65")
            .attr("x", textX);
        button.append("text")
            .text(textB)
            .attr("y", "90")
            .attr("x", textX);
    }

    // pridej tlacitko do modalniho okna
    addButtonModal(to, clss, text) {
        to.append("button")
            .attr("class", clss)
            .text(text);
    }

    // vytvor modalni okno pro pridavani os
    buildModal() {
        const content = d3.select(this.modal_menu).attr("id", "modal_menu").append("div").attr("class", "content");
        let tmp = content.append("div")
            .attr("id", "buttons");
        this.addButtonModal(tmp, "close", "X");
        const tabs = content.append("div")
            .attr("class", "tabs");
        tmp = tabs.append("div")
            .attr("id", "modal_add");
        tmp.append("p").text("Vyhledávání časových os:");
        let form = tmp.append("div").attr("class", "dropdown");
        form.append("input")
            .attr("class", "form_control")
            .attr("type", "text")
            .attr("value", "")
            .attr("placeholder", "Začněte psát");
        form.append("ul")
            .attr("id", "content")
            .style("visibility", "hidden");
        tmp.append("button")
            .attr("id", "add_confirm")
            .text("Přidat osu");
        tmp.append("button")
            .attr("id", "add_example")
            .text("Ukázka časových os");
        tmp.append("button")
            .attr("id", "frequency")
            .text("Frekvenční metoda");
        tmp.append("button")
            .attr("id", "force")
            .text("Silova metoda");
        tmp.append("button")
            .attr("id", "random_order")
            .text("Náhodné pořadí");
    }

    // vytvor zapati s prislusnymi informacemi
    buildFooter() {
        const date = new Date();
        d3.select(this.footer).attr("id","footer");
        d3.select(this.footer).append("p")
            .text(`2021 - ${date.getFullYear()} ©`)
            .append("a")
            .attr("href", "./about.html")
            .text("O nás")
    }

    // prepocitej pozici tlacitek
    moveButtons() {
        let y = d3.select(this.canvas).node().clientHeight;
        let node = d3.select("#add");
        node.attr("transform", `translate(0,${y - node.node().firstChild.attributes["height"].value})`)
        node = d3.select("#remove");
        node.attr("transform", `translate(0,${y - node.node().firstChild.attributes["height"].value})`)
    }

    //--------------------------------------------------------------------------------------------
    //--------------------------Draw-timelines----------------------------------------------------
    // pridej zadany obrazek ke skupine g na urcitych souradnicich
    addImg(g, cls, imgPath, x, y, h, w, transf) {
        const newImg = g.append("image")
            .attr("class", cls)
            .attr("href", imgPath)
            .attr("x",x)
            .attr("y",y)
            .attr("height", h)
            .attr("width", w);
        if (transf !== undefined)
            newImg.attr("transform", transf);
    }

    // prenastav osu v item na zadane parametry
    setPath(item, datum, cls, color) {
        item.datum(datum)
            .attr("class", cls)
            .attr("stroke", color)
            .attr("d", this.context.area);
    }

    // pridej/zmen/odstran casove osy tak, aby se setrilo vytvareni novych prvku a mazani starych
    fillPaths(list, data) {
        let child = list.node() !== null ? list.node().firstElementChild : null;
        let i = 0;
        for (i; i < data.length; i++) {
            if (child !== null) {
                this.setPath(d3.select(child), data[i].datum, data[i].clsName, data[i].color);
                child = child.nextElementSibling;
                this.setPath(d3.select(child), [data[i].datum[0], data[i].datum[data[i].datum.length - 1]],
                    data[i].clsName + " sec_path", data[i].color);
                child = child.nextElementSibling;
            } else {
                this.setPath(list.append("path"), data[i].datum, data[i].clsName, data[i].color);
                this.setPath(list.append("path"), [data[i].datum[0], data[i].datum[data[i].datum.length - 1]],
                    data[i].clsName + " sec_path", data[i].color);
            }
        }
        if (i === data.length && child) {

            child = child.previousElementSibling;
            while (list.node().lastElementChild !== child)
                list.node().removeChild(list.node().lastElementChild);
        }
    }

    // pridej/uprav/smaz reprezentace casovych os (erby) dle potreby
    fillEmblems(list, data) {
        let child = list.node() !== null ? list.node().firstElementChild : null;
        let i = 0;
        for (i; i < data.length; i++) {
            if (child !== null) {
                let tmp = d3.select(child);
                tmp.attr("class", data[i].clsName)
                    .attr("transform", `translate(0,${data[i].start})`);
                tmp.select(".item").attr("href", data[i].imgPath);
                tmp.select("text").text(data[i].name);
                tmp.select(".colorPicker").attr("fill", data[i].color);
                if (i + 1 < data.length)
                    child = child.nextElementSibling;
            } else
                this.addEmblem(data[i].name, data[i].clsName, data[i].start, data[i].imgPath, data[i].color);
        }
        if (i === data.length && child)
            while (list.node().lastElementChild !== child)
                list.node().removeChild(list.node().lastElementChild);
    }

    // pridej reprezentaci casove osy
    addEmblem(name, clsName, y, path, color) {
        const embls = d3.select("#emblems");
        const newGroup = embls.append("g")
            .attr("class", `${clsName}`)
            .attr("transform", `translate(0,${y})`);
        newGroup.append("rect")
            .attr("class", "background")
            .attr("x", "-90")
            .attr("y", "-15")
            .attr("width", "190")
            .attr("height", "130");
        newGroup.append("text")
            .attr("x", "-70")
            .attr("y", "0")
            .text(name);
        // tlacitka skupiny
        this.addImg(newGroup, "item", this.context.url + path, "-35", "10", "100", "100")
        this.addImg(newGroup, "up hideable", require("/img/smallArrow.png"), "-75", "5", "30", "30");
        this.addImg(newGroup, "down hideable", require("/img/smallArrow.png"), "45", "-65", "30", "30", "rotate(180)");
        this.addImg(newGroup, "remove", require("/img/remove.png"), "-100", "-5", "20", "20", "rotate(180)");
        // dummy vyber barev
        newGroup.append("circle")
            .attr("class", "colorPicker hideable")
            .attr("fill",color)
            .attr("cx", "-60")
            .attr("cy", "90")
            .attr("r", "20")
            .attr("stroke", "black")
            .attr("stroke-width", "1px");

        // element pro vlastni vyber a zmenu barev
        d3.select(this.canvas)
            .append("input")
            .attr("type", "color")
            .attr("class", `inputPicker ${clsName}`);
    }
    //------------------------
    // okenko pro napovedu u jednotlivych udalosti
    makeDescr(info) {
        let descr = d3.select(document.createElement("div"));
        descr.attr("id", "tooltip")
            .style("position", "absolute")
            .style("opacity", 0);
        let tmp = descr.append("div")
            .attr("class", "left");
        tmp.append("h2").text(info.name);
        tmp.append("p")
            .attr("class", "desc_date")
            .text(dateUtils.getDateName(info.bck_x));
        tmp.append("p").text(info.desc);
        if (info.filters.length > 1) {
            tmp = descr.append("div")
                .attr("class", "right");
            tmp.append("h2")
                .text("Související časové linky");
            tmp = tmp.append("ul");
            for (let i = 0; i < info.filters.length; i++ )
                tmp.append("li").text(info.filters[i]);
        }
        return descr;
    }

    // spojeni obrazku udalosti s jeho popisem
    appendInfoTo(item, event) {
        event.attr("class", this.getClass(item.cls))
            .attr("href", item.icon)
            .attr("y",item.y)
            .attr("bckp-x", item.bck_x)
            .attr("x", this.context.xt2(item.bck_x))
            .attr("height", this.minWidthEvent)
            .attr("width", this.minWidthEvent)
            .attr("transform", "translate(-" + this.minWidthEvent / 2 + ",0)");
        const desc = this.makeDescr(item);
        tippy(event.node(), {
            content: desc.node().innerHTML,
            allowHTML: true,
            theme: "tooltip",
            placement: "left",
            duration: [500,200],
        });
    }

    // tecka v minimape
    appendMinimapMark(item) {
        // console.log(item);
        d3.select(".minimapDraw").append("circle")
            .attr("class", `miniEvent ${this.getClass(item.cls)}`)
            .attr("r", "5")
            .attr("cx", `${this.context.xt(item.bck_x) + this.minimapX}`)
            .attr("cy", "17.5")
            .attr("fill", d3.select(`#paths .${this.getClass(item.cls)}`).attr("stroke"));
    }

    // umisteni udalosti
    placeEvents(appendTo, events) {
        for (let item of events) {
            // console.log(item);
            this.appendInfoTo(item, appendTo.append("image"));
            this.appendMinimapMark(item);
        }
    }

    // umisteni skupiny nekolika udalosti v jednom miste
    placeGroup(appendTo, x, y, l) {
        let g = appendTo.append("g")
            .attr("class", "group")
            .on("mouseover", (d) => {
                const tmp = d3.select(d.target.parentNode).select("rect");
                const l = tmp.attr("length");
                tmp.attr("width",l*50);
                d3.select(d.target.parentNode).select(".placeholder").attr("display", "none");
                d3.select(d.target.parentNode).selectAll(".hideable").nodes().forEach(d => d3.select(d).attr("display", "inherit"));
            })
            .on("mouseout", (d) => {
                d3.select(d.target.parentNode).select("rect").attr("width", this.minWidthEvent);
                d3.select(d.target.parentNode).select(".placeholder").attr("display", "inherit");
                d3.select(d.target.parentNode).selectAll(".hideable").nodes().forEach(d => d3.select(d).attr("display", "none"));
            });
        g.append("rect")
            .attr("x", x)
            .attr("bckp-x", x)
            .attr("y", y)
            .attr("width", this.minWidthEvent)
            .attr("fill", "antiquewhite")
            .attr("length", l)
            .attr("transform", "translate(-" + this.minWidthEvent / 2 + ",0)");
        g.append("image")
            .attr("href", require("/img/group.png"))
            .attr("class", "placeholder")
            .attr("x", x)
            .attr("bckp-x", x)
            .attr("y", y)
            .attr("transform", "translate(-" + this.minWidthEvent / 2 + ",0)");
        return g;
    }

    // umisti event nebo skupinu do vizualizace
    placeCommonEvents(appendTo, events) {
        for (let item of events) {
            if (item.eventlist.length === 1)
                this.appendInfoTo(item.eventlist[0], appendTo.append("image"));
            else {
                // console.log(item.eventlist);
                // udelej skupinu
                let group = this.placeGroup(appendTo, item.eventlist[0].x,item.eventlist[0].y,item.eventlist.length);
                // vloz udalosti se vsemi daty
                for (let [idx, event] in item.eventlist.entries()) {
                    event.bck_x = event.bck_x + idx * this.minWidthEvent;
                    this.appendInfoTo(event, group.append("image"));
                }
            }
            this.appendMinimapMark(item.eventlist[0]);
        }
    }

    // vykresli vsechny vybrane casove osy
    drawRes(res) {
        this.fillPaths(d3.select("#paths"), res.paths);
        this.fillEmblems(d3.select("#emblems"), res.paths);
        let svgTarget = d3.select("#timeline_els");
        d3.selectAll("#timeline_els .group").remove();
        d3.selectAll("#timeline_els image").remove();
        d3.selectAll(".minimapDraw .miniEvent").remove();
        this.placeEvents(svgTarget, res.events);
        this.placeCommonEvents(svgTarget, res.commonEvents);
    }

    //--------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------

    // odstrani specifikovanou mnozinu elementu
    // potrebuje jako vstup pole prvku
    removeSpecificItems(items) {
        for(let item of items) {
            d3.selectAll(item).remove();
        }
    }

    // odstrani definovanou sadu prvku
    removeItems() {
        for(let item of ["#timeline_els .group", "#timeline_els image",".minimapDraw .miniEvent","#paths path",
            "#emblems g", ".inputPicker"]) {
            d3.selectAll(item).remove();
        }
    }

    // --------------------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------------------

    // Helper functions
    // preskaluj casove osy dle aktualniho priblizeni
    rescaleTimeline() {
        d3.select("#timelines").selectAll("image").nodes().forEach((d,i) => {
            const x = Number(d3.select(d).attr("bckp-x"));
            d3.select(d).attr("x", `${this.context.xt2(x)}`);
        });
    }

    // preskalovani skupin
    rescaleGroups(ctx) {
        let x = Number(d3.select(this).attr("bckp-x"));
        d3.select(this).attr("x", `${this.context.xt2(x)}`);
        x = d3.select(this).select(".placehlder").attr("bckp-x");
        d3.select(this).select(".placehlder").attr("x", `${this.context.xt2(x)}`);
    }

    // uprav zadanou tridu na pouzitelnou podobu
    getClass(cls) {
        return cls.split(" ").join("").replaceAll(".", "");
    }

    //--------------------------------------------------------------------------------------------
    //---------------------------------Selection utils--------------------------------------------

    // nasteveni stylu zadanemu prvku
    setStyle(target, style, value) {
        d3.select(target).style(style, value);
    }

    // ziskani stylu zadaneho prvku
    getStyle(target, style) {
        return d3.select(target).style(style);
    }

    // nastaveni atributu zadanemu prvku
    setAttrib(target, attrib, value) {
        d3.select(target).attr(attrib, value);
    }

    // ziskani atributu zadaneho prvku
    getAttrib(target, value) {
        return d3.select(target).attr(value);
    }

    // nastaveni callbacku zadanemu prvku s určitou akci
    setCallBack(target, action, cb) {
        d3.select(target).on(action, cb);
    }

    // nacteni elementu z vizualizace
    getElement(target) {
        return d3.select(target);
    }

    // nacteni vsech specifikovanych elementu z vizualizace
    getAllElements(target) {
        return d3.selectAll(target);
    }

    //--------------------------------------------------------------------------------------------
    //--------utils------------------------
    //https://stackoverflow.com/questions/29031659/calculate-width-of-text-before-drawing-the-text
    // vypocet sirky textu z velikosti fontu a typu fontu
    BrowserText = (function () {
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        /**
         * Measures the rendered width of arbitrary text given the font size and font face
         * @param {string} text The text to measure
         * @param {number} fontSize The font size in pixels
         * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
         * @returns {number} The width of the text
         **/
        function getWidth(text, fontSize, fontFace) {
            ctx.font = fontSize + 'px ' + fontFace;
            return ctx.measureText(text).width;
        }

        return {
            getWidth: getWidth
        };
    })();

}