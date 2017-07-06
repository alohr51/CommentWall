var image = new Array ();
for(var i = 0; i <= 15; i++){
	image[i] = "/images/avatars/avatar" + (i + 1) + ".png";
}

$( document ).ready(function() {
	$('.user').click(function(){
		var firstName = $(this).data("firstname");
		var lastName = $(this).data("lastname");

		// set commentNamesInput so we know who the current loaded person is (to add comments to)
		$('#addCommentNames').data("firstname", firstName);
		$('#addCommentNames').data("lastname", lastName);
		loadComments(firstName, lastName);
	});

	//detect enter key on from input
	$("#from").keypress(function( event ) {
		if (event.which == 13) {
			addComment();
		}
	});
});

function addComment(){
	var fromField = $('#from').val();
	var honoreeFirst = $('#addCommentNames').data("firstName");
	var honoreeLast = $('#addCommentNames').data("lastName");
	var comment = $('#commentText').val();

	if(typeof honoreeFirst ===  "undefined" || typeof honoreeLast === "undefined"){
		$('#infoBox').text('Please select a name from the left column');
		return;
	}

	// make sure the from field has input
	if(typeof fromField === "undefined" || fromField == ""){
		$('#infoBox').text('Please say who you are!');
		return;
	}

	// make sure the comment box has input
	if(comment.length === 0){
		$('#infoBox').text('Please enter a comment!');
		return;
	}

	$('#infoBox').empty().show();
	$.ajax({
		url: "/api/addComment",
		type: "POST",
		dataType: 'json',
		contentType: "application/x-www-form-urlencoded",
		data: {
			to: honoreeFirst+honoreeLast, from: fromField, msg: comment
		},
		success: function(data){
			$('#commentText').val("");
			$("#infoBox").css('color','green');
			$('#infoBox').text('Success!');
			$("#infoBox").fadeOut(4000, function() {
				$("#infoBox").empty().show();
				$("#infoBox").css('color','red');
			});
			loadComments(honoreeFirst, honoreeLast);
		},
		error: function(err) {
			console.error("Error adding comment");
			console.error(JSON.stringify(err));
		}
	});
	
}

function loadComments(firstName, lastName){
	$.ajax({
		url: "/api/getComments?name="+firstName+lastName,
		type: "GET",
		dataType: 'json',
		contentType: "application/x-www-form-urlencoded",
		success: function(data){
			$('#titleName').html("<p id='congratsText'>Say Congratulations to " + firstName + " " + lastName + "!</p>");
			$('#commentArea').html('');
			for (index in data.msgs){
				var commentHTML = 
					"<div class='row'>"+
						"<div class='large-2 columns small-3'>" +
							"<img src='"+getRandomAvatar()+"'/>" +
						"</div>"+
						"<div class='large-10 columns'>"+
							"<p>" + data.msgs[index].msg + "</p>" + 
							"<p class='fromComment'><strong>-" + data.msgs[index].from + "</strong></p>" +
						"</div>" +
					"</div>" +
					"<hr/>";
				$('#commentArea').append(commentHTML);	
			}
		},
		error: function(err) {
			console.error("failure to get comments");
			console.error(JSON.stringify(err));
		}
	});
}

function getRandomAvatar(){
	var size = image.length;
	var x = Math.floor(size*Math.random());
	return image[x];
}