var base_url = "http://localhost/real_estate/api";

function getUrlParameter(sParam)
{
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	var parameter_val = false;
	for (var i = 0; i < sURLVariables.length; i++) 
	{
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) 
		{
			parameter_val = sParameterName[1];
		}
	}
	return parameter_val;
}

function logout(){
	$.ajax({url: get_base_url()+"/logout",success:function(result){
    	window.location.href = "login.html";
  }});
}

function get_base_url(){
	return base_url;
}

function loading(val){
	$('#cust_loading').removeClass('cl_show');
	$('#cust_loading').removeClass('cl_hide');
	if(val){
	    $('#cust_loading').addClass('cl_show');
	}
	else {
	    $('#cust_loading').addClass('cl_hide');        
	}
}
function load_theme(){
	if(getUrlParameter('bid'))
		jQuery('#cust_css').attr('href', 'assets/css/'+getUrlParameter('bid')+".css");
	/*
	$.ajax({
	  type: 'POST',
	  url: get_base_url()+"/get_theme",
	  data: { id: getUrlParameter('bid') },
	  beforeSend:function(){
	    
	  },
	  success:function(data){
	    // successful request; do something with the data
	    $('#cust_css').attr('src', data.link);
	  },
	  error:function(){
	    alert("Error");
	  }
	});*/
}
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-59263310-1', 'auto');
  ga('send', 'pageview');