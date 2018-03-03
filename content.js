var url = 'https://jisho.org/api/v1/search/words?keyword=';
const http = new XMLHttpRequest();

function getSelectedText() {
    var text = "";

    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text;
    }

    if (!text) {
        console.log("NONE");
        $('#infoDiv').css('display', 'none');
    }

    return text;
}

function dismissPopover() {
    $('#definition').contents().remove();
    $('#infoDiv').css('display', 'none');
}

function createPopover() {
    var selectedText = getSelectedText();

    $('#definition').contents().remove();

    if (selectedText.length <= 1) {
        return;
    }

    var x = window.pageXOffset + event.clientX;
    var y = window.pageYOffset + event.clientY;

    if (selectedText) {
        $('#infoDiv').css('display', 'block');
        $('#infoDiv').css('position', 'absolute');
        $('#infoDiv').css('left', x + 10);
        $('#infoDiv').css('top', y + 15);
        $('#definition').append('<h3>Fetching data...</h3>');
    } else {
        $('#infoDiv').css('display', 'none');
    }

    http.open("GET", url + '"' + selectedText.toLowerCase() + '"');
    http.send();

    http.onload = () => {
        var json = JSON.parse(http.responseText);
        console.log(json);

        if (json.meta.status == 200) {
                $('#definition').contents().remove();
                if (json.data.length == 0) {
                    $('#definition').append('<h3>No Japanese translation</h3>');
                }

                for (var i = 0; i < 4; i++) {
                    if (i >= json.data.length) return;
                    if (i != 0) {
                        $('#definition').append('<hr>');
                    }

                    if (json.data[i].japanese[0].reading && !json.data[i].japanese[0].word) {
                        $('#definition').append('<h3>' + json.data[i].japanese[0].reading + '</h3>');                
                    } else {
                        $('#definition').append('<h3>' + json.data[i].japanese[0].word + '</h3>');
                        $('#definition').append('<p>' + json.data[i].japanese[0].reading + '</p>');
                    }
                    $('#definition').append('<p>' + json.data[i].senses[0].english_definitions[0] + '</p>');
                }
        }
    }
}
 
translate = function() {
    var selectedText = window.getSelection().toString();

    $('#definition').contents().remove();

    if (selectedText.length <= 1) {
        return;
    }

    var x = window.pageXOffset + event.clientX;
    var y = window.pageYOffset + event.clientY;

    if (selectedText) {
        $('#infoDiv').css('display', 'block');
        $('#infoDiv').css('position', 'absolute');
        $('#infoDiv').css('left', x + 10);
        $('#infoDiv').css('top', y + 15);
        $('#definition').append('<h3>Fetching data...</h3>');
    } else {
        $('#infoDiv').css('display', 'none');
    }

    http.open("GET", url + '"' + selectedText.toLowerCase() + '"');
    http.send();

    http.onload = () => {
        var json = JSON.parse(http.responseText);
        console.log(json);
        if (json.meta.status == 200) {
             $('#definition').contents().remove();
             if (json.data.length == 0) {
                 $('#definition').append('<h3>No Japanese translation</h3>');
             }

             for (var i = 0; i < 4; i++) {
                if (i >= json.data.length) return;
                if (i != 0) {
                    $('#definition').append('<hr>');
                }

                if (json.data[i].japanese[0].reading && !json.data[i].japanese[0].word) {
                    $('#definition').append('<h3>' + json.data[i].japanese[0].reading + '</h3>');
                } else {
                    $('#definition').append('<h3>' + json.data[i].japanese[0].word + '</h3>');
                    $('#definition').append('<p>' + json.data[i].japanese[0].reading + '</p>');
                }
                $('#definition').append('<p>' + json.data[i].senses[0].english_definitions[0] + '</p>');
             }
        }
    }
}

document.onmouseup = createPopover;
document.onkeyup = createPopover;
$('body').append('<div id="infoDiv" class="card"><div id="definition" class="cardContainer"></div></div>');

//document.onmouseup = dismissPopover;
//document.body.addEventListener('dblclick', translate);
