temple.modules.NetflixCtaModule = function(_super) {
    __extends(NetflixCtaModule, _super);
    var Utils = temple.utils;
    function NetflixCtaModule(data, banner, id) {
        this.version = "1.8.0";
        this.banner = data == temple.banner ? data : banner ? banner : temple.banner;
        this.data = {};
        this.data.id = id || 0;
        this.data.element = data.element ? data.element : data != temple.banner ? data : null;
        this.data.size = data.size || 5;
        this.data.elementClass = "cta_module_" + this.data.id;
        this.data.elementOverClass = "cta_over";
        this.data.fillClass = "cta_fill";
        this.data.copyClass = "cta_copy";
        this.data.arrowClass = "cta_arrow";
        this.data.color = [ "#ffffff", "#e50914" ];
        this.data.text = "WATCH NOW";
        this.data.isArrow = true;
        this.data.dynamic = "";
        this.data.autoInit = undefined;
        if (data != temple.banner) {
            this.sortData(data);
            if (data.autoInit == undefined) {
                this.data.autoInit = true;
            }
        }
        if (this.data.autoInit) {
            temple.utils.debug("Auto initing the netflixCtaModule", "orange");
            this.addCtaButton(this.data);
        }
        this.done();
    }
    NetflixCtaModule.prototype.addCtaButton = function(data) {
        this.data.fill = document.createElement("div");
        this.data.copy = document.createElement("div");
        this.data.arrow = document.createElement("div");
        this.data.arrow.appendChild(this.createArrow());
        if (data) {
            this.sortData(data);
        }
        this.data.element.classList.add(this.data.elementClass);
        this.data.fill.className = this.data.fillClass;
        this.data.copy.className = this.data.copyClass;
        this.data.arrow.className = this.data.arrowClass;
        this.data.element.appendChild(this.data.fill);
        this.data.element.appendChild(this.data.copy);
        if (this.data.isArrow) {
            this.data.element.appendChild(this.data.arrow);
            this.data.element.classList.add("isArrow");
        }
        this.data.color = data.color || [ "#ffffff", "#e50914" ];
        Utils.createStyle("." + this.data.elementClass, "cursor: pointer;overflow: hidden;text-align: center;font-size:" + this.data.size + "px;");
        Utils.createStyle("." + this.data.elementClass + " ." + this.data.fillClass, "width:100%;height:100%;transform: translate(-100%, 0);-webkit-transform: translate(-100%, 0); transition: transform .4s cubic-bezier(0.19, 1, 0.22, 1);");
        Utils.createStyle("." + this.data.elementClass + " ." + this.data.arrowClass, "position:absolute;text-align: right;top:50%;left:auto;right:auto;width:100%;font-size:160% !important;-webkit-transform: translate(0%, -50%);transform: translate(0%, -50%);");
        Utils.createStyle("." + this.data.elementClass + " ." + this.data.arrowClass + " svg", "position:absolute;right:4%;left:auto;top:0;");
        if (!Utils.isMobile) {
            Utils.createStyle("." + this.data.elementClass + ":hover ." + this.data.fillClass, "transform: translate(0, 0); -webkit-transform: translate(0, 0);");
            Utils.createStyle("." + this.data.elementClass + ".hover ." + this.data.fillClass, "transform: translate(0, 0); -webkit-transform: translate(0, 0);");
            Utils.createStyle("." + this.data.elementClass + ":hover ." + this.data.arrowClass, "color:" + this.data.color[1]);
            Utils.createStyle("." + this.data.elementClass + ".hover ." + this.data.arrowClass, "color:" + this.data.color[1]);
            Utils.createStyle("." + this.data.elementClass + ":hover ." + this.data.copyClass, "color:" + this.data.color[1]);
            Utils.createStyle("." + this.data.elementClass + ".hover ." + this.data.copyClass, "color:" + this.data.color[1]);
            Utils.createStyle("." + this.data.elementClass + ".isArrow:hover ." + this.data.copyClass, "color:" + this.data.color[1]);
        }
        Utils.createStyle("." + this.data.elementClass + " ." + this.data.copyClass, "transform-origin: 0 0;white-space:nowrap;line-height:10px;padding:4px 8%;transition: color .4s cubic-bezier(0.19, 1, 0.22, 1);color:" + this.data.color[0]);
        Utils.createStyle("." + this.data.elementClass + " .border", "-webkit-box-sizing: border-box;box-sizing: border-box;position: absolute;top: 0;left: 0;width:100%;height:100%;border:solid " + this.borderSize + "px " + this.data.color[0]);
        Utils.createStyle("." + this.data.elementClass + " *", "position: absolute;top: 0;left: 0;");
        this.data.element.style.backgroundColor = this.data.color[1];
        this.data.fill.style.backgroundColor = this.data.color[0];
        if (this.data.dynamic != "") {
            this.data.copy.setAttribute("data-dynamic", this.data.dynamic);
        }
        this.setText(this.data.text);
        this.ctaOver = this.data.element.addEventListener("mouseover", this.onOver.bind(this));
        this.ctaOut = this.data.element.addEventListener("mouseout", this.onOut.bind(this));
    };
    NetflixCtaModule.prototype.createArrow = function() {
        var s = Math.round(this.data.element.offsetHeight / 3);
        TweenMax.set(this.data.arrow, {
            height: s
        });
        var i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        i.setAttribute("width", s + "px");
        i.setAttribute("height", s + "px");
        i.line = new this.svgIcon("line1", "M0,0 l" + s / 2 + "," + s / 2 + "l-" + s / 2 + "," + s / 2);
        i.line.setAttribute("fill", "none");
        i.line.setAttribute("stroke", this.data.color[0]);
        i.line.setAttribute("stroke-width", 2);
        i.appendChild(i.line);
        return i;
    };
    NetflixCtaModule.prototype.svgIcon = function svgIcon(id, path) {
        var i = document.createElementNS("http://www.w3.org/2000/svg", "path");
        i.setAttributeNS(null, "d", path);
        i.setAttribute("data-original", path);
        i.setAttribute("class", id || "");
        return i;
    };
    NetflixCtaModule.prototype.addReveal = function() {
        var ieBugPadding = 20;
        var height = parseInt(window.getComputedStyle(this.data.element, null).getPropertyValue("height")) + ieBugPadding + "px";
        var width = parseInt(window.getComputedStyle(this.data.element, null).getPropertyValue("width")) + "px";
        var rectStart = "rect(" + "0px" + " " + "0px" + " " + height + " " + "0px" + ")";
        var rectEnd = "rect(" + "0px" + " " + width + " " + height + " " + "0px" + ")";
        var tl = TweenMax.fromTo(this.data.element, 1.2, {
            clip: rectStart
        }, {
            clip: rectEnd,
            clearProps: "clip",
            ease: Quad.easeInOut
        });
        return tl;
    };
    NetflixCtaModule.prototype.setText = function(text, size) {
        this.data.copy.innerHTML = text || this.data.text;
        this.resizeText();
    };
    NetflixCtaModule.prototype.resizeText = function(text, size) {
        this.data.copy.setAttribute("style", "transform: scale(1);");
        var bb = this.data.copy.getBoundingClientRect();
        var bbb = this.data.element.getBoundingClientRect();
        var pr = "8%";
        if (this.data.isArrow) {
            var s = bb.width / bbb.width;
            pr = s * 16 + "%";
            this.data.copy.setAttribute("style", "padding-right: " + pr + ";padding-left: " + s * 16 + "%");
            bb = this.data.copy.getBoundingClientRect();
            bbb = this.data.element.getBoundingClientRect();
        }
        var widthTransform = bbb.width / bb.width;
        var heightTransform = bbb.height / bb.height;
        var value = widthTransform < heightTransform ? widthTransform : heightTransform;
        var matrix = window.getComputedStyle(this.data.copy, null).getPropertyValue("transform");
        this.data.copy.setAttribute("style", "transform: scale(" + value.toFixed(3) + ");padding-right: " + pr);
        var copyBounds = this.data.copy.getBoundingClientRect();
        var xp = Math.round(copyBounds.width * .96 / 2);
        var yp = Math.round(copyBounds.height / 2);
        var p = bbb.width - copyBounds.width;
        this.data.copy.setAttribute("style", "backface-visibility: hidden; transform: translateZ(0) scale(" + value.toFixed(3) + ") translate(-50%,0); left: 50%;top:50%;margin-top:-" + yp + "px;padding-right: " + pr);
    };
    NetflixCtaModule.prototype.onOver = function() {
        if (!temple.utils.isMobile) {
            this.data.element.classList.add("hover");
        }
        this.data.arrow.querySelector("svg").line.setAttribute("stroke", this.data.color[1]);
    };
    NetflixCtaModule.prototype.onOut = function() {
        if (!temple.utils.isMobile) {
            this.data.element.classList.remove("hover");
        }
        this.data.arrow.querySelector("svg").line.setAttribute("stroke", this.data.color[0]);
    };
    NetflixCtaModule.prototype.sortData = function(data) {
        for (var i in data) {
            this.data[i] = data[i];
        }
        if (this.data.element && typeof this.data.element == "string") {
            this.data.element = $(this.data.element);
        }
    };
    return NetflixCtaModule;
}(temple.core.Module);