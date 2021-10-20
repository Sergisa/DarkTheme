function pageLoad() {
    var formulaTextField = document.getElementById('finput');
    var Rows = 5;
    var Columns = 5;
    var lastColumn = String.fromCharCode("A".charCodeAt(0) + Columns - 1);
    var LastCell = lastColumn + Rows;

    for (var i = 0; i < Rows + 1; i++) {
        var row = document.querySelector("table").insertRow(-1);
        for (var j = 0; j < Columns + 1; j++) {
            var letter = String.fromCharCode("A".charCodeAt(0) + j - 1);
            row.insertCell(-1).innerHTML = i && j ? "<input id='" + letter + i + "'/>" : i || letter;
        }
    }
    var DATA = {},
        INPUTS = [].slice.call(document.querySelectorAll("table input"));
    document.querySelectorAll(".alingmentSwitch").forEach(function (elm) {
        elm.onclick = alignment;
    });

    function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    function alignment(but) {
        if (but.target.className.indexOf('material-icons') > -1) {
            //проверка что мы нажали имено на иконкук нопки
            document.querySelectorAll(".tools .on").forEach(function (elm) {
                //removing class "on" from others
                elm.classList.remove("on");
            });
            but.target.parentElement.classList.add("on");
            INPUTS.forEach(function (elm) {
                elm.classList.value = '';
                if (but.target.parentElement.id != '') {
                    elm.classList.add(but.target.parentElement.id);
                }
            });
        }
    }

    //middle();
    function nextRow(active) {
        return active.split('')[0] + (parseInt(active.split('')[1]) + 1);
    }

    function nextCol(active) {
        return String.fromCharCode(active.charCodeAt(0) + 1) + (parseInt(active.split('')[1]));
    }

    function prevRow(active) {
        return active.split('')[0] + (parseInt(active.split('')[1]) - 1);
    }

    function prevCol(active) {
        return String.fromCharCode(active.charCodeAt(0) - 1) + (parseInt(active.split('')[1]));
    }

    INPUTS.forEach(function (elm) {
        elm.onkeydown = function (e) {
            try {
                switch (e.code) {
                    case "ArrowDown":
                        document.getElementById(nextRow(e.target.id)).focus();
                        break;
                    case "ArrowUp":
                        document.getElementById(prevRow(e.target.id)).focus();
                        break;
                    case "ArrowRight":
                        document.getElementById(nextCol(e.target.id)).focus();
                        break;
                    case "ArrowLeft":
                        document.getElementById(prevCol(e.target.id)).focus();
                        break;
                    case "Enter":
                        if (e.target.id.charAt(1) != Rows) {
                            document.getElementById(nextRow(e.target.id)).focus();
                        }
                        break;
                    case "Tab":
                        if ((e.target.id != LastCell) && (e.target.id.charAt(0) != lastColumn)) {
                            document.getElementById(nextCol(e.target.id)).focus();
                        }
                        return false;
                        break;
                }
            } catch (e) {
            }
            //return false;
        };
        elm.onkeypress = function (e) {

        };
        elm.onfocus = function (e) {
            e.target.value = localStorage[e.target.id] || "";
            if (e.target.value.startsWith("=")) {
                //если в ячейке формула
                var cells = e.target.value.split("=")[1].split("+");
                try {
                    cells.forEach(function (cellId) {
                        document.getElementById(cellId).classList.add("highlight");
                    });
                } catch (e) {
                }
            } else {
            }
            formulaTextField.value = e.target.value;
            if (e.target.value != '') {
            } else {
                //formulaTextField.value = '';
            }
        };
        elm.onblur = function (e) {
            localStorage[e.target.id] = e.target.value;
            INPUTS.forEach(function (cell) {
                cell.classList.remove("highlight");
            });
            computeAll();
        };
        var getter = function () {
            var value = localStorage[elm.id] || "";
            if (value.charAt(0) == "=") {
                with (DATA) return eval(value.substring(1));
            } else {
                return isNaN(parseFloat(value)) ? value : parseFloat(value);
            }
        };
        Object.defineProperty(DATA, elm.id, {
            get: getter
        });
        Object.defineProperty(DATA, elm.id.toLowerCase(), {
            get: getter
        });
    });
    console.log(DATA);
    (window.computeAll = function () {
        INPUTS.forEach(function (elm) {
            try {
                elm.value = DATA[elm.id];
            } catch (e) {
            }
        });
    })();
}