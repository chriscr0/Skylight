// On Document Loaded
$(document).ready(function() {
	startTime();
	chrome.runtime.sendMessage({action: "topSites"}, function(response) {
		displayTop(response);
	});
	chrome.runtime.sendMessage({action: "getBackground"}, updateBackground);
});

// Update background image
function updateBackground(response) {
	$('#bg').hide()
	var img = new Image();	// load the image to make the browser cache it
    img.src = response.url
	img.onload = function() {	// once it is cached, set it as the background
		document.getElementById('bg').style.backgroundImage = "url('" + response.url + "')";
		$('#bg').fadeIn(500);
	}
	if (response.author)
		$('#photo-credit').text('Photo by ' + response.author);
	else
		$('#photo-credit').text('Photo by Unknown');
	$('#photo-credit').attr('href', response.url);
}

// Top Sites Display
function displayTop(sites) {
	row = $("#top-sites")
	for(var i = 0; (i < 10) && (i < sites.length); i++) {
		row.append(createTsCard(sites[i].title, sites[i].url));
	}
	row.append('<li style="text-align: center;">...</li>');
};

function createTsCard(title, url) {
	var card = '<li><a href="' + url + '">';
	card += '<div class="truncate" style="margin-right: 16px">';
	card += '<h4>' + title + '</h4>';
	card += '<p>' + url + '</p>';
	card += '</div>';
	card += '</a></li>';
	return card;
}

// Clock Functionality
function startTime() {
    var today = new Date();
    var dateString = today.toDateString();
	var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var ampm = (h > 12) ? 'pm' : 'am';
	h = hour12(h)
	m = checkTime(m);
    s = checkTime(s);
	var timeString = h + ":" + m + " " + ampm
    document.getElementById('time-text').innerHTML = timeString;
	document.getElementById('date-text').innerHTML = dateString;
    var t = setTimeout(startTime, 1000);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
function hour12(i) {
	if (i > 12)
		i -= 12;
	return i;
}