var url = 'https://jisho.org/api/v1/search/words?keyword=';
var definitionURL = "https://jisho.org/search/"
const http = new XMLHttpRequest();

function dismissPopover() {
    $('#definition').contents().remove();
    $('#infoDiv').css('display', 'none');
}
 
translate = function() {
    var selectedText = window.getSelection().toString();
    console.log(selectedText);
    $('#definition').contents().remove();

    if (selectedText.length <= 1) {
        return;
    }

    var x = window.pageXOffset + event.clientX;
    var y = window.pageYOffset + event.clientY;

    if (selectedText) {
        $('#infoDiv').css('display', 'block');
        $('#infoDiv').css('position', 'absolute');
        $('#infoDiv').css('left', x - 100);
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
                    
                    if (json.data[i].japanese[0].reading) {
                        $('#definition').append('<p>' + json.data[i].japanese[0].reading + '</p>');
                    }
                }

                if (json.data[i].senses[0].english_definitions.length > 0) {
                    $('#definition').append('<h4>Definitions:</h4>');
                    var toAdd = '<p>'
                    for (var j = 0; j < json.data[i].senses[0].english_definitions.length; j++) {
                        toAdd += j+1 + ') ' + json.data[i].senses[0].english_definitions[j] + '<br>';
//                            $('#definition').append(j+1 + ') ' + json.data[i].senses[0].english_definitions[j] + '<br>');
                    }
                    toAdd += '</p>';
                    $('#definition').append(toAdd);
                }
            }
            $('#definition').append('<hr>');
            $('#definition').append('<a href=' + definitionURL + '"' + selectedText + '"' + ' target="_blank">More definitions for ' + '"' + selectedText +'"' + '</a>')
            
        }
    }

}

//document.onmouseup = createPopover;
//document.onkeyup = createPopover;
$('body').append('<div id="infoDiv" class="card"><div id="forblur"></div><div id="definition" class="cardContainer"></div></div>');

// dismiss popover on click outside of card
$(document).click(function(e) {
	if (!$(e.target).closest('#infoDiv').length) {
		dismissPopover();
	}
});
document.body.addEventListener('dblclick', translate);
