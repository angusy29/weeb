var url = 'https://jisho.org/api/v1/search/words?keyword=';
var definitionURL = "https://jisho.org/search/"
const http = new XMLHttpRequest();

function dismissPopover() {
    $('#definition').contents().remove();
    $('#infoDiv').css('display', 'none');
}

function isNotASCII(str) {
	for (var i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) > 127) return true;
	}
	return false;
}
 
translate = function() {
    var selectedText = window.getSelection().toString();
    console.log(selectedText);
    $('#definition').contents().remove();

    if (selectedText.length <= 0) {
        return;
    }

    var x = window.pageXOffset + event.clientX;
    var y = window.pageYOffset + event.clientY;

    if (selectedText) {
        $('#infoDiv').css('display', 'block');
        $('#infoDiv').css('position', 'absolute');
        $('#infoDiv').css('left', x - 100);
        $('#infoDiv').css('top', y + 15);
        $('#definition').append('<div class="weeb-h3">Fetching data...</div>');
    } else {
        $('#infoDiv').css('display', 'none');
    }

    var toLink = isNotASCII(selectedText) ? url + selectedText : url + '"' + selectedText.toLowerCase() + '"';
    http.open("GET", toLink);
    http.send();

    console.log(selectedText.toLowerCase());

    http.onload = () => {
        var json = JSON.parse(http.responseText);
        console.log(json);

        if (json.meta.status == 200) {
            $('#definition').contents().remove();
            if (json.data.length == 0) {
                $('#definition').append('<div class="weeb-h3">No Japanese translation</div>');
            }

            for (var i = 0; i < 4; i++) {
                if (i >= json.data.length) break;
                if (i != 0) {
                    $('#definition').append('<hr class="weeb-hr">');
                }

                if (json.data[i].japanese[0].reading && !json.data[i].japanese[0].word) {
                    $('#definition').append('<div class="weeb-h3">' + json.data[i].japanese[0].reading + '</div>');                
                } else {
                    $('#definition').append('<div class="weeb-h3">' + json.data[i].japanese[0].word + '</div>');
                    
                    if (json.data[i].japanese[0].reading) {
                        $('#definition').append('<div class="weeb-paragraph">' + json.data[i].japanese[0].reading + '</div>');
                    }
                }

                if (json.data[i].senses[0].english_definitions.length > 0) {
                    $('#definition').append('<div class="weeb-h4">Definitions:</div>');
                    var toAdd = '<div class="weeb-paragraph">'
                    for (var j = 0; j < json.data[i].senses[0].english_definitions.length; j++) {
                        toAdd += j+1 + ') ' + json.data[i].senses[0].english_definitions[j] + '<br>';
//                            $('#definition').append(j+1 + ') ' + json.data[i].senses[0].english_definitions[j] + '<br>');
                    }
                    toAdd += '</div>';
                    $('#definition').append(toAdd);
                }
            }
            $('#definition').append('<hr class="weeb-hr">');

            toLink = isNotASCII(selectedText) ? definitionURL + selectedText : definitionURL + '"' + selectedText.toLowerCase() + '"';
            $('#definition').append('<a class="weeb-link" href=' + toLink + ' target="_blank">More definitions for ' + '"' + selectedText +'"' + '</a>')
            
        }
    }

}

//document.onmouseup = createPopover;
//document.onkeyup = createPopover;
$('body').append('<div id="infoDiv" class="card"><div id="definition" class="cardContainer"></div></div>');

// dismiss popover on click outside of card
$(document).click(function(e) {
	if (!$(e.target).closest('#infoDiv').length) {
		dismissPopover();
	}
});
document.body.addEventListener('dblclick', translate);
