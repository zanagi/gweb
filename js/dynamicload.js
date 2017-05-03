var debug = true;

$(window).ready(function(){
	var setContentMargin = function() {
		$("#content").css("top", $("#navi").height());
	}
	
	var loadContent = function() {
		var hash = window.location.hash.substring(1) || 'home';
		var url = "content/" + hash + ".html";
		var fadeTime = 500;
		
		if(hash.indexOf('-') === -1) {
			$(".active").toggleClass("active");
			$('a[href="#' + hash + '"]').toggleClass("active");
		} else {
			var p = hash.split('-')[0];
			var jqn = $('a[href="#' + p + '"]');
			if(!(jqn.hasClass("active"))) {
				jqn.toggleClass("active");
			}
		}
		
		var ajaxLoad = function() {
			// Empty content
			$("#content").empty();
			
			// Load content using AJAX
			$.ajax({url: url, 
		        beforeSend: function(xhr) {
		          xhr.overrideMimeType("text/html; charset=UTF-8");
		        },
		        success: function(data, textStatus, jqXHR) {
		          setContentMargin();
		          $("#content").html(data);
		          $("#content").fadeIn(fadeTime);
		          animateOpacity("#footer", 1.0, fadeTime); // Having to make a separate call for footer due to problems with jquery multiple selector

		          // Debug print
		          if(debug) console.log("Data loaded from: " + url);
		        },
		        error: function(){
		        	loadErrorPage();
		        }});
		};

		var loadErrorPage = function() {
			// Load content using AJAX
			$.ajax({url: "content/error.html", 
		        beforeSend: function(xhr) {
		          xhr.overrideMimeType("text/html; charset=UTF-8");
		        },
		        success: function(data, textStatus, jqXHR) {
		          $("#content").html(data);
		          $("#content").fadeIn(fadeTime);
		          animateOpacity("#footer", 1.0, fadeTime); 
		        },
		        error: function(){
		        	console.log("Error loading error page."); // Lol
		        }});
		};
		
		// Fade-out animation, after completion call load function
		$("#content").fadeOut(fadeTime, ajaxLoad);
		animateOpacity("#footer", .0, fadeTime); // Having to make a separate call for footer due to problems wiht jquery multiple selector
	};

	var animateOpacity = function(id, target, time) {
		$(id).animate({
			opacity: target
		}, time);
	}

	var animate = function() {
		$("#page").show();
		animateOpacity("#page", 1.0, 2000);
	};

	var setEvents = function() {
		// Navnar collapse
		$(".navbar-nav li a:not(:has(*)),#navi .navbar-brand").click(function(event) {
			$(".navbar-collapse").collapse('hide');
		});
	}
	
	setEvents();
	animate();
	loadContent();
	
	if (!('onhashchange' in window)) {
		// Save old URL.
		var oldHref = location.href;

		// Set a timer (interval) for updating content, if event 'hashchange' does not exist
		setInterval(function() {
		  var newHref = location.href;
		  if (oldHref !== newHref) {
			// Update URL and load content.
		    oldHref = newHref;
		    loadContent();
		  }
		}, 100);
	} else {
	    $(window).on('hashchange', function() {
	    	loadContent();
	    });
	}
});
