$(function(){
	$('#ghusername').keypress(function (e) {
	 var key = e.which;
	 if(key == 13)  // the enter key code
	  {
		$('#ghsubmitbtn').click();
		return false;  
	  }
	});   

	$('#ghsubmitbtn').on('click', function(e){
    e.preventDefault();
    
    var username = $('#ghusername').val();
    var requri   = 'https://api.github.com/users/'+username;
	
	
	
    requestJSON(requri, function(json) {
	  $('#usercheck').html('');
      if(json.message == "Not Found" || username == '') {
        $('#usercheck').html("<h2>No such user exists</h2>");
      }
      
      else {
        // else we have a user and we display their info
        var fullname   = json.name;
        var username   = json.login;
        var aviurl     = json.avatar_url;
        var profileurl = json.html_url;
        var location   = json.location;
        var followersnum = json.followers;
        var followingnum = json.following;
        var reposnum     = json.public_repos;
        
		
        if(fullname == undefined) { fullname = username; }
		if(json.location == null) { location = "location not available"}
		
		var iCnt = 0;
		var length = $(".cardblock h2").length;
		
		for (iCnt = 0; iCnt < length ; iCnt++){
			if ($($(".cardblock h2")[iCnt]).text() == fullname){
				$('#usercheck').html("<h2>User already exists in Github contact card</h2>");
				return 1;
			}
		}
		
		var newUser = '<div class = "cardblock" id = "user"><img id="removebtn" src= "./css/close.png" ><img id="user_avatar" src= '+ aviurl +' > <hr>';
		var userName = '<h2>' + fullname + '</h2>';
		var userDetails  = '<div id= "locationdetails">' + location + '</div>' + '<div id = "followersnumber"> <p> Followers: <span id = "followersnum">' + followersnum + '</span></div>' +'</div>';
		$(newUser + userName + userDetails).appendTo('#cardcontainer');
		$('#ghusername').val("");
		
		
      } // end else statement
    }); // end requestJSON Ajax call
  }); // end click event handler
  
	$('#cardcontainer').on('click', 'img' ,function(e){
		$(this).parent().remove();
	});
	
	
	

	$('#sortbyname').on('click' ,function () {
	var $divs = $(".cardblock");
	var alphabeticallyOrderedDivs = $divs.sort(function (a, b) {
			return $(a).find("h2").text().toUpperCase() > $(b).find("h2").text().toUpperCase();
		});
		$("#cardcontainer").html(alphabeticallyOrderedDivs);
	});

	$('#sortbylocation').on('click' ,function () {
	var $divs = $(".cardblock");
	var alphabeticallyOrderedDivs = $divs.sort(function (a, b) {
			if ($(a).find("#locationdetails").text() == "location not available"){
					return 1;
			}	

			if ($(b).find("#locationdetails").text() == "location not available" ){
					return -1;
			}


			return $(a).find("#locationdetails").text().toUpperCase() > $(b).find("#locationdetails").text().toUpperCase();	
		});
		$("#cardcontainer").html(alphabeticallyOrderedDivs);
	});


	$('#sortbyfollowers').on('click', function () {
	var $divs = $(".cardblock");
    var numericallyOrderedDivs = $divs.sort(function (a, b) {
        return parseInt($(a).find("#followersnum").text()) < parseInt($(b).find("#followersnum").text());
    });
    $("#cardcontainer").html(numericallyOrderedDivs);
	});

	  function requestJSON(url, callback) {
	  $('#usercheck').html('<div id="loader"><img src="css/loader.gif" alt="loading..."></div>');
		$.ajax({
		  url: url,
		  complete: function(xhr) {
			callback.call(null, xhr.responseJSON);
		  }
		});
	  }
});